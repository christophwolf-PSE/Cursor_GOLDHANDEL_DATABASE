// Generator Hub (templates list + basic selection)
import { supabase } from './supabase.js';

const CATALOG_SEED_PATH = './src/domain/documentCatalog.seed.json';
let catalogActionsReady = false;
const TOTAL_STEPS = 18;

function groupCatalogByStep(items) {
    const grouped = new Map();
    for (let step = 1; step <= TOTAL_STEPS; step += 1) {
        grouped.set(step, []);
    }
    items.forEach(item => {
        if (!grouped.has(item.step_no)) grouped.set(item.step_no, []);
        grouped.get(item.step_no).push(item);
    });
    return Array.from(grouped.entries()).sort((a, b) => a[0] - b[0]);
}

function renderContactList(contacts) {
    const container = document.getElementById('generator-contact-list');
    if (!container) return;
    if (!contacts.length) {
        container.innerHTML = '<div class="empty-state">Keine Kontakte verfügbar</div>';
        return;
    }
    container.innerHTML = contacts.map(contact => `
        <label class="checkbox-row">
            <input type="checkbox" class="generator-contact" value="${contact.id}">
            <span>${escapeHtml(contact.full_name || contact.company || 'Kontakt')}</span>
        </label>
    `).join('');
}

function renderCatalog(items) {
    const container = document.getElementById('generator-step-list');
    if (!container) return;
    const grouped = groupCatalogByStep(items);
    if (!grouped.length) {
        container.innerHTML = '<div class="empty-state">Keine Templates hinterlegt</div>';
        return;
    }
    container.innerHTML = grouped.map(([stepNo, items]) => `
        <div class="generator-step-card">
            <div class="generator-step-title">Schritt ${stepNo}</div>
            <div class="generator-template-list">
                ${items.length ? items
                    .sort((a, b) => a.default_sub_no - b.default_sub_no)
                    .map(item => renderCatalogItem(item, stepNo))
                    .join('') : '<div class="text-secondary">Keine Templates zugeordnet</div>'}
            </div>
        </div>
    `).join('');
}

function renderCatalogItem(item, stepNo) {
    const meta = `${escapeHtml(item.doc_code)} · S${stepNo}.${item.default_sub_no}`;
    const typeLabel = getDocTypeLabel(item.doc_type);
    const actions = renderCatalogActions(item);
    return `
        <div class="generator-template-btn" data-template="${item.template_no || ''}">
            <div class="template-title">${escapeHtml(item.template_name)}</div>
            <div class="template-meta">${meta}</div>
            <div class="template-meta">${typeLabel}</div>
            <div class="template-actions">${actions}</div>
        </div>
    `;
}

function renderCatalogActions(item) {
    if (item.doc_type === 'UPLOAD_SLOT') {
        return `<button class="btn btn-sm btn-secondary generator-upload-btn" data-step="${item.step_no}" data-sub="${item.default_sub_no}" data-doc="${escapeHtml(item.doc_code)}">Upload</button>`;
    }
    if (item.doc_type === 'EXTERNAL') {
        return `<span class="text-secondary">Auto-Export</span>`;
    }
    return `<button class="btn btn-sm btn-secondary generator-generate-btn" data-doc="${escapeHtml(item.doc_code)}">Erstellen</button>`;
}

function getDocTypeLabel(type) {
    if (type === 'UPLOAD_SLOT') return 'Upload';
    if (type === 'EXTERNAL') return 'Auto';
    return 'Generated';
}

async function loadCatalog() {
    const supabaseCatalog = await loadCatalogFromSupabase();
    if (supabaseCatalog.length) {
        return supabaseCatalog;
    }
    return loadCatalogFromSeed();
}

async function loadCatalogFromSupabase() {
    if (!supabase) return [];
    try {
        const { data, error } = await supabase
            .from('document_catalog')
            .select('*')
            .order('step_no', { ascending: true })
            .order('sub_no', { ascending: true });
        if (error) {
            console.warn('Generator catalog Supabase load failed:', error);
            return [];
        }
        return (data || []).map(mapCatalogRow);
    } catch (err) {
        console.warn('Generator catalog Supabase error:', err);
        return [];
    }
}

async function loadCatalogFromSeed() {
    try {
        const response = await fetch(CATALOG_SEED_PATH);
        if (!response.ok) {
            throw new Error(`Seed fetch failed (${response.status})`);
        }
        const data = await response.json();
        return (Array.isArray(data) ? data : []).map(mapCatalogRow);
    } catch (err) {
        console.warn('Generator catalog seed load failed:', err);
        return [];
    }
}

function mapCatalogRow(item) {
    return {
        template_no: item.template_no ?? null,
        template_name: item.title || item.template_name || 'Untitled',
        doc_code: item.doc_code || 'DOC',
        step_no: Number(item.step_no) || 0,
        default_sub_no: Number(item.sub_no ?? item.default_sub_no) || 0,
        required: Boolean(item.required),
        doc_type: item.doc_type || 'GENERATED'
    };
}

async function loadDeals() {
    const select = document.getElementById('generator-deal-select');
    if (!select) return [];
    let deals = window.getAllDeals ? window.getAllDeals() : [];
    if (!deals.length && supabase) {
        const { data } = await supabase.from('deals').select('id, deal_no').order('created_at', { ascending: false });
        deals = data || [];
    }
    select.innerHTML = '<option value="">Geschäft auswählen</option>' +
        deals.map(deal => `<option value="${deal.id}">${deal.deal_no}</option>`).join('');
    return deals;
}

async function loadContacts() {
    let contacts = window.getAllContacts ? window.getAllContacts() : [];
    if (!contacts.length && supabase) {
        const { data } = await supabase
            .from('contacts')
            .select('id, full_name, company')
            .order('full_name', { ascending: true });
        contacts = data || [];
    }
    renderContactList(contacts);
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text ?? '';
    return div.innerHTML;
}

export async function openGeneratorHub() {
    const modal = document.getElementById('generator-hub-modal');
    if (!modal) {
        alert('Generator-Hub konnte nicht geladen werden.');
        return;
    }
    const catalog = await loadCatalog();
    renderCatalog(catalog);
    setupCatalogActions();
    await Promise.all([loadDeals(), loadContacts()]);
    modal.classList.add('active');
}

function setupCatalogActions() {
    const container = document.getElementById('generator-step-list');
    if (!container) return;
    if (catalogActionsReady) return;
    catalogActionsReady = true;
    container.addEventListener('click', (event) => {
        const uploadBtn = event.target.closest('.generator-upload-btn');
        if (uploadBtn) {
            const stepNo = Number(uploadBtn.dataset.step) || null;
            const subNo = Number(uploadBtn.dataset.sub) || null;
            const docCode = uploadBtn.dataset.doc || 'UPLOAD';
            const detail = { stepNo, subNo, docCode };
            window.dispatchEvent(new CustomEvent('generator:upload', { detail }));
            return;
        }
        const generateBtn = event.target.closest('.generator-generate-btn');
        if (generateBtn) {
            alert('Generator ist vorbereitet. Die Dokumenterstellung wird im nächsten Schritt aktiviert.');
        }
    });
}
