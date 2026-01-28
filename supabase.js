// Supabase Client Setup
// IMPORTANT: Replace these values with your Supabase project credentials
// Get them from: https://app.supabase.com -> Your Project -> Settings -> API

export const SUPABASE_URL = 'https://dswqgiysphtyntydzhpe.supabase.co';
export const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRzd3FnaXlzcGh0eW50eWR6aHBlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjgzMzI4NDUsImV4cCI6MjA4MzkwODg0NX0.IkcQnT3SjsPNacKulJpX3DcY6mxnf103zSdSBn0HWCI';

// Initialize Supabase client
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';

// Only create client if credentials are configured
let supabaseClient = null;
try {
    if (SUPABASE_URL && SUPABASE_URL !== 'YOUR_SUPABASE_URL' && 
        SUPABASE_ANON_KEY && SUPABASE_ANON_KEY !== 'YOUR_SUPABASE_ANON_KEY') {
        supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    }
} catch (err) {
    console.error('Error initializing Supabase client:', err);
}

export const supabase = supabaseClient;

// Storage bucket name
export const STORAGE_BUCKET = 'deal-documents';

// Helper function to check if user is admin
export async function isAdmin() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;
    
    const adminEmails = ['christophmwolf@googlemail.com'];
    // Check user metadata or create a user_roles table
    // For now, we'll use a simple check via user metadata
    // You should implement proper RBAC based on your requirements
    return user.user_metadata?.role === 'admin'
        || user.email?.endsWith('@admin.local')
        || adminEmails.includes(user.email);
}

// Helper function to log audit events
export async function logAudit(dealId, action, entity, entityId, before = null, after = null) {
    const { data: { user } } = await supabase.auth.getUser();
    
    await supabase.from('audit_log').insert({
        deal_id: dealId,
        actor: user?.id || null,
        action: action,
        entity: entity,
        entity_id: entityId,
        before_json: before,
        after_json: after
    });
}

// Helper function to upload document
export async function uploadDocument(dealId, dealNo, stepNo, file, docType) {
    if (!supabase) {
        throw new Error('Supabase client nicht initialisiert');
    }
    
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Nicht authentifiziert');
    
    let resolvedDealId = dealId;
    let resolvedDealNo = dealNo;
    if (!resolvedDealId) {
        if (!resolvedDealNo) throw new Error('Geschäft nicht gefunden');
        const deal = await getDealByNo(resolvedDealNo);
        if (!deal) throw new Error('Geschäft nicht gefunden');
        resolvedDealId = deal.id;
        resolvedDealNo = deal.deal_no;
    }
    
    const timestamp = Date.now();
    const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
    const fileName = `${timestamp}_${sanitizedFileName}`;
    
    // Build file path: deal_no/step_no/file or deal_no/general/file
    const filePath = stepNo
        ? `${resolvedDealNo}/${stepNo}/${fileName}`
        : `${resolvedDealNo}/general/${fileName}`;
    
    // Upload file to storage
    const { data: uploadData, error: uploadError } = await supabase.storage
        .from(STORAGE_BUCKET)
        .upload(filePath, file, {
            cacheControl: '3600',
            upsert: false
        });
    
    if (uploadError) {
        console.error('Storage upload error:', uploadError);
        throw new Error(`Fehler beim Hochladen: ${uploadError.message}`);
    }
    
    // Get step_id if stepNo is provided
    let stepId = null;
    if (stepNo) {
        const step = await getStepByDealAndNo(resolvedDealId, stepNo);
        stepId = step?.id || null;
    }
    
    // Create document record
    const { data: docData, error: docError } = await supabase
        .from('documents')
        .insert({
            deal_id: resolvedDealId,
            step_id: stepId,
            doc_type: docType,
            file_path: filePath,
            file_name: file.name,
            mime_type: file.type || 'application/octet-stream',
            uploaded_by: user.id
        })
        .select()
        .single();
    
    if (docError) {
        console.error('Document insert error:', docError);
        // Try to delete uploaded file if document record creation fails
        await supabase.storage.from(STORAGE_BUCKET).remove([filePath]);
        throw new Error(`Fehler beim Speichern der Dokumentinformationen: ${docError.message}`);
    }
    
    return { ...docData, publicUrl: null };
}

// Helper function to get deal by deal_no
export async function getDealByNo(dealNo) {
    const { data, error } = await supabase
        .from('deals')
        .select('*')
        .eq('deal_no', dealNo)
        .single();
    
    if (error) throw error;
    return data;
}

// Helper function to get step by deal_id and step_no
export async function getStepByDealAndNo(dealId, stepNo) {
    const { data, error } = await supabase
        .from('deal_steps')
        .select('*')
        .eq('deal_id', dealId)
        .eq('step_no', stepNo)
        .single();
    
    if (error && error.code !== 'PGRST116') throw error; // PGRST116 = not found
    return data;
}

// Helper function to download document
export async function downloadDocument(filePath) {
    const { data, error } = await supabase.storage
        .from(STORAGE_BUCKET)
        .download(filePath);
    
    if (error) throw error;
    return data;
}

// Helper function to get signed URL for private documents
export async function getDocumentUrl(filePath, expiresIn = 3600) {
    const { data, error } = await supabase.storage
        .from(STORAGE_BUCKET)
        .createSignedUrl(filePath, expiresIn);
    
    if (error) throw error;
    return data.signedUrl;
}

// ============================================
// n8n Webhook Integration
// ============================================
export const N8N_WEBHOOK_URL = 'https://ki-automatisierung.startplatz-ai-hub.de/webhook-test/fd9ae3e2-6c39-4f42-ac13-9ec04e0a9dc2';

/**
 * Sendet eine Nachricht an den n8n Webhook
 * @param {string} message - Die Chatbot-Nachricht
 * @param {string} context - Kontext (z.B. 'chatbot', 'deal_update', etc.)
 * @param {object} metadata - Zusätzliche Metadaten
 * @returns {Promise<object>} Antwort vom Webhook
 */
export async function sendToN8NWebhook(message, context = 'chatbot', metadata = {}) {
    try {
        const payload = {
            message: message,
            context: context,
            timestamp: new Date().toISOString(),
            ...metadata
        };
        
        const response = await fetch(N8N_WEBHOOK_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload)
        });
        
        if (!response.ok) {
            throw new Error(`Webhook request failed: ${response.status} ${response.statusText}`);
        }
        
        // Try to parse JSON, but handle non-JSON responses gracefully
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
            const data = await response.json();
            return data;
        } else {
            // If response is not JSON, return the text as response
            const text = await response.text();
            return { response: text || null };
        }
    } catch (error) {
        console.error('Error sending to n8n webhook:', error);
        throw error;
    }
}
