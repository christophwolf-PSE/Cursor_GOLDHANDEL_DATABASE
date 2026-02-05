// Main Application Logic
import { supabase, isAdmin, logAudit, uploadDocument, getDealByNo, getStepByDealAndNo, STORAGE_BUCKET, SUPABASE_URL, SUPABASE_ANON_KEY } from './supabase.js';
import { initializeChatbot } from './chatbot.js';
import { initGrcPlanning, openGrcPlanningModal, refreshGrcPlanningDealOptions } from './grc-planning.js';

// ============================================
// State Management
// ============================================
let currentUser = null;
let currentDeal = null;
let currentDealSteps = [];
let activeStepNo = null;
let activeView = 'dashboard';
let activeDealId = null;
let allDeals = [];
let allContacts = [];
let selectedContactId = null;
let contactsModalReady = false;
let currentContactBankDefaults = null;
let currentContactBankDefaultsContactId = null;
let demoMode = false; // Demo mode flag
let appSettings = null;
let pendingSellerAssignment = null;
let pendingNewDealSellerContactId = null;
let discountParticipationDraft = null;
let lbmaRefreshTimer = null;
let lastLbmaQuote = null;
let lastFxRate = null;
let currentKycProfileId = null;
let currentKycRole = 'Buyer';
let lastGeneratorDealId = null;
let deleteContext = null;
const ACCESS_REQUEST_MODE = true;
const LBMA_FALLBACK_QUOTE = {
    usd: 2300
}; // Fallback quote used when live pricing is unavailable.

window.getAllDealsForPlanning = () => allDeals;
window.getAllDeals = () => allDeals;
window.getAllContacts = () => allContacts;

// Make currentDeal globally available for exports
window.currentDeal = currentDeal;
window.setGeneratorDealContext = async (dealId) => {
    if (!dealId) {
        currentDeal = null;
        currentDealSteps = [];
        window.currentDeal = null;
        return false;
    }
    if (!supabase) {
        console.warn('Generator deal context: Supabase not available');
        return false;
    }
    if (currentDeal?.id === dealId && currentDealSteps.length) {
        return true;
    }
    try {
        const { data: deal, error: dealError } = await supabase
            .from('deals')
            .select('*')
            .eq('id', dealId)
            .is('deleted_at', null)
            .single();
        if (dealError || !deal) {
            console.error('Generator deal context: failed to load deal', dealError);
            return false;
        }
        currentDeal = deal;
        window.currentDeal = deal;
        const { data: steps, error: stepsError } = await supabase
            .from('deal_steps')
            .select('*')
            .eq('deal_id', dealId)
            .order('step_no', { ascending: true });
        if (stepsError) {
            console.error('Generator deal context: failed to load steps', stepsError);
            currentDealSteps = [];
        } else {
            currentDealSteps = steps || [];
        }
        return true;
    } catch (error) {
        console.error('Generator deal context: unexpected error', error);
        return false;
    }
};

// Make enableDemoMode globally available
window.enableDemoMode = enableDemoMode;

// ============================================
// Initialization
// ============================================
// Make enableDemoMode available early
function enableDemoMode(e) {
    if (e) {
        e.preventDefault();
        e.stopPropagation();
    }
    // Prevent multiple activations
    if (demoMode || window.demoMode) {
        console.log('Demo mode already active');
        return;
    }
    
    console.log('Demo mode activated');
    
    // Set demo mode flag BEFORE anything else
    demoMode = true;
    window.demoMode = true;
    
    currentUser = {
        id: 'demo-user',
        email: 'demo@example.com',
        user_metadata: {}
    };
    
    // Immediately show app screen and hide login screen
    const loginScreen = document.getElementById('login-screen');
    const appScreen = document.getElementById('app-screen');
    
    console.log('Switching screens - loginScreen:', !!loginScreen, 'appScreen:', !!appScreen);
    
    if (loginScreen) {
        loginScreen.classList.remove('active');
        loginScreen.style.display = 'none';
        console.log('Login screen hidden');
    }
    if (appScreen) {
        appScreen.classList.add('active');
        appScreen.style.display = 'block';
        console.log('App screen shown, display:', appScreen.style.display, 'has active class:', appScreen.classList.contains('active'));
    }
    
    // Show demo mode indicator
    const userEmailEl = document.getElementById('user-email');
    if (userEmailEl) {
        userEmailEl.textContent = 'Demo-Modus';
        console.log('User email set to Demo-Modus');
    }
    
    // Ensure dashboard view is visible (it should have 'view active' class)
    const dashboardView = document.getElementById('dashboard-view');
    const dealDetailView = document.getElementById('deal-detail-view');
    
    console.log('dashboardView exists:', !!dashboardView, 'dealDetailView exists:', !!dealDetailView);
    
    if (dashboardView) {
        dashboardView.classList.add('active');
        dashboardView.style.display = 'block';
        console.log('Dashboard view activated, display:', dashboardView.style.display, 'has active class:', dashboardView.classList.contains('active'));
    }
    if (dealDetailView) {
        dealDetailView.classList.remove('active');
        dealDetailView.style.display = 'none';
        console.log('Deal detail view deactivated');
    }
    
    // Force visibility check
    setTimeout(() => {
        console.log('Visibility check - app-screen visible:', window.getComputedStyle(appScreen || document.body).display !== 'none');
        console.log('Visibility check - dashboard-view visible:', dashboardView ? window.getComputedStyle(dashboardView).display !== 'none' : 'N/A');
    }, 50);
    
    // Load dashboard which will load demo data
    setTimeout(() => {
        console.log('About to load dashboard...');
        loadDashboard();
    }, 100);
    
    // Show demo notice after a short delay to ensure container exists
    setTimeout(() => {
        const container = document.querySelector('.container');
        if (container) {
            // Remove existing demo notice if any
            const existingNotice = container.querySelector('.demo-notice');
            if (existingNotice) {
                existingNotice.remove();
            }
            
            const notice = document.createElement('div');
            notice.className = 'error-message show demo-notice';
            notice.style.backgroundColor = 'rgba(13, 202, 240, 0.1)';
            notice.style.borderLeftColor = '#0dcaf0';
            notice.style.color = '#0c5460';
            notice.style.marginBottom = '1rem';
            notice.innerHTML = `
                <strong>ℹ️ Demo-Modus aktiv:</strong> 
                Sie befinden sich im Demo-Modus. Keine Daten werden in der Datenbank gespeichert. 
                <button onclick="this.parentElement.remove()" style="float: right; background: none; border: none; cursor: pointer; color: inherit; font-size: 1.2rem;">×</button>
            `;
            const firstChild = container.firstElementChild;
            if (firstChild) {
                container.insertBefore(notice, firstChild);
            } else {
                container.appendChild(notice);
            }
        }
    }, 200);
}

// Make function globally available immediately
window.enableDemoMode = enableDemoMode;

document.addEventListener('DOMContentLoaded', async () => {
    await preloadLogoAssets();
    logLogoAssetStatus();
    setupEventListeners();
    disableAutofillForKyc();
    setupDarkMode();
    initializeChatbot();
    initGrcPlanning();
    
    // Don't auto-check auth if demo mode is already active (user clicked demo button before DOM loaded)
    if (window.demoMode || demoMode) {
        console.log('Demo mode active, skipping auth check');
        // Make sure demo mode UI is shown
        const loginScreen = document.getElementById('login-screen');
        const appScreen = document.getElementById('app-screen');
        if (loginScreen) loginScreen.classList.remove('active');
        if (appScreen) appScreen.classList.add('active');
        loadDashboard();
        return;
    }
    
    // Check if Supabase is configured
    if (SUPABASE_URL === 'YOUR_SUPABASE_URL' || SUPABASE_ANON_KEY === 'YOUR_SUPABASE_ANON_KEY') {
        // Show configuration warning but still show the UI
        console.warn('Supabase-Credentials nicht konfiguriert. Bitte tragen Sie Ihre Credentials in supabase.js ein.');
        showLogin();
        // Add warning to login screen
        setTimeout(() => {
            const loginCard = document.querySelector('.login-card');
            if (loginCard) {
                const warning = document.createElement('div');
                warning.className = 'error-message show';
                warning.style.marginBottom = '1rem';
                warning.style.backgroundColor = 'rgba(255, 193, 7, 0.1)';
                warning.style.borderLeftColor = '#ffc107';
                warning.style.color = '#856404';
                warning.innerHTML = `
                    <strong>⚠️ Konfiguration erforderlich:</strong><br>
                    Bitte tragen Sie Ihre Supabase-Credentials in <code>supabase.js</code> ein:<br>
                    <ul style="margin: 0.5rem 0; padding-left: 1.5rem;">
                        <li>Öffnen Sie <code>supabase.js</code></li>
                        <li>Ersetzen Sie <code>YOUR_SUPABASE_URL</code> mit Ihrer Supabase-URL</li>
                        <li>Ersetzen Sie <code>YOUR_SUPABASE_ANON_KEY</code> mit Ihrem Anon-Key</li>
                    </ul>
                    <small>Diese Werte finden Sie im Supabase Dashboard unter Settings → API</small>
                `;
                loginCard.insertBefore(warning, loginCard.querySelector('form'));
            }
        }, 100);
        return;
    }
    
    // Don't check auth if demo mode is active
    if (demoMode || window.demoMode) {
        return;
    }
    
    await checkAuth();
    
    // Check if user is logged in
    if (supabase) {
        try {
            const { data: { session } } = await supabase.auth.getSession();
            if (session && !demoMode) {
                showApp();
            } else if (!demoMode) {
                showLogin();
            }
        } catch (err) {
            console.error('Error checking session:', err);
            if (!demoMode) {
                showLogin();
            }
        }
    } else if (!demoMode) {
        showLogin();
    }
});

function disableAutofillForKyc() {
    const form = document.getElementById('kyc-form');
    if (!form) return;
    form.setAttribute('autocomplete', 'off');
    form.setAttribute('data-form-type', 'other');
    form.setAttribute('data-lpignore', 'true');
    const fields = form.querySelectorAll('input, select, textarea');
    fields.forEach((field, idx) => {
        field.setAttribute('autocomplete', 'off');
        field.setAttribute('data-form-type', 'other');
        field.setAttribute('data-lpignore', 'true');
        field.setAttribute('data-dashlane-disabled', 'true');
        if (!field.getAttribute('name')) {
            field.setAttribute('name', `kyc-field-${idx}`);
        }
    });
    const roleSelect = document.getElementById('kyc-role-select');
    if (roleSelect) {
        roleSelect.setAttribute('autocomplete', 'off');
        roleSelect.setAttribute('data-form-type', 'other');
        roleSelect.setAttribute('data-lpignore', 'true');
        roleSelect.setAttribute('data-dashlane-disabled', 'true');
    }
}

const KORAS_COMPANY_NAME = 'Koras PMR GmbH';
const KORAS_SUBSIDIARIES_LIST = [
    'Koras Management GmbH Germany',
    'Koras GmbH Germany',
    '4Dentis GmbH Germany',
    'WE³Rec GmbH Germany',
    'Green Hills Refining GmbH Germany',
    'Koras Chemicals Pvt. Ltd. India'
].join('\n');

function isKorasCompany(name) {
    return (name || '').toString().trim().toLowerCase() === KORAS_COMPANY_NAME.toLowerCase();
}

// ============================================
// Authentication
// ============================================
async function checkAuth() {
    if (!supabase) {
        console.warn('Supabase client not initialized');
        return;
    }
    
    try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
            currentUser = session.user;
            const userEmailEl = document.getElementById('user-email');
            if (userEmailEl) {
                userEmailEl.textContent = session.user.email;
            }
        }
        
        // Listen for auth changes
        supabase.auth.onAuthStateChange((event, session) => {
            console.log('Auth state changed:', event, session?.user?.email);
            if (event === 'SIGNED_IN' && session) {
                currentUser = session.user;
                const userEmailEl = document.getElementById('user-email');
                if (userEmailEl) {
                    userEmailEl.textContent = session.user.email;
                }
                // Only show app if we're currently on login screen
                if (document.getElementById('login-screen').classList.contains('active')) {
                    showApp();
                }
            } else if (event === 'SIGNED_OUT') {
                currentUser = null;
                showLogin();
            } else if (event === 'TOKEN_REFRESHED' && session) {
                currentUser = session.user;
            }
        });
    } catch (err) {
        console.error('Error in checkAuth:', err);
    }
}

const LOGO_BLACK_PATHS = [
    'assets/Logo SCE black.png',
    'assets/SilberChrom Logo.jpeg',
    'assets/sce-logo-black.png'
];
const LOGO_TRANSPARENT_PATHS = [
    'assets/SCE Logo New Black trans BG.png',
    'assets/sce-logo-transparent.png'
];
const logoAssetCache = {};

async function preloadLogoAssets() {
    const paths = [...LOGO_BLACK_PATHS, ...LOGO_TRANSPARENT_PATHS];
    await Promise.all(paths.map(async (path) => {
        const encoded = encodeURI(path);
        try {
            const res = await fetch(encoded, { cache: 'no-store' });
            logoAssetCache[path] = res.ok;
        } catch (err) {
            logoAssetCache[path] = false;
        }
    }));
}

function resolveLogoPath(paths) {
    for (const path of paths) {
        if (logoAssetCache[path]) {
            return encodeURI(path);
        }
    }
    return encodeURI(paths[0]);
}

function logLogoAssetStatus() {
    const paths = [...LOGO_BLACK_PATHS, ...LOGO_TRANSPARENT_PATHS];
    paths.forEach(path => {
        const encoded = encodeURI(path);
        fetch(encoded, { cache: 'no-store' })
            .then(res => {
                if (!res.ok) {
                    console.warn(`Logo asset missing: ${path} (${res.status})`);
                    return;
                }
                console.info(`Logo asset OK: ${path}`);
            })
            .catch(err => {
                console.warn(`Logo asset error: ${path}`, err);
            });
    });
}

function showLogin() {
    // Reset demo mode when showing login screen
    demoMode = false;
    window.demoMode = false;
    currentUser = null;
    
    const loginScreen = document.getElementById('login-screen');
    const appScreen = document.getElementById('app-screen');
    loginScreen.classList.add('active');
    appScreen.classList.remove('active');
    // Restore flex layout so the login card stays centered.
    loginScreen.style.display = 'flex';
    appScreen.style.display = 'none';
}

function showApp() {
    const loginScreen = document.getElementById('login-screen');
    const appScreen = document.getElementById('app-screen');
    loginScreen.classList.remove('active');
    appScreen.classList.add('active');
    loginScreen.style.display = 'none';
    appScreen.style.display = 'block';
    
    // Update user email display
    if (demoMode) {
        document.getElementById('user-email').textContent = 'Demo-Modus';
    }
    
    updateAdminUi();
    loadDashboard();
}

function updateEditHallmarkVisibility(commodityType) {
    const hallmarkGroup = document.getElementById('edit-hallmark-age-group');
    if (!hallmarkGroup) return;
    hallmarkGroup.style.display = (commodityType === 'Hallmark' || commodityType === 'Minted Bars') ? 'block' : 'none';
}

function updateCommodityHint(selectId, hintId) {
    const select = document.getElementById(selectId);
    const hint = document.getElementById(hintId);
    if (!select || !hint) return;
    let text = '';
    if (select.value === 'Minted Bars') {
        text = 'Hinweis: Minted Bars werden intern wie Hallmark behandelt.';
    } else if (select.value === 'Cast Bars') {
        text = 'Hinweis: Cast Bars werden intern wie Doré behandelt.';
    } else if (select.value === 'Gold Dust / Nuggets / Lumps') {
        text = 'Hinweis: Gold Dust/Nuggets/Lumps gelten als Hochrisiko. Herkunft & Exportpermit zwingend.';
    } else if (select.value === 'Scrap / Melt') {
        text = 'Hinweis: Scrap/Melt erfordert Eigentumsnachweis, Purchase Trail und Legalitätsbelege.';
    } else if (select.value === 'Granulat / Grain') {
        text = 'Hinweis: Granulat/Grain benötigt Feingehalt-Nachweis (Assay) und Chain-of-Custody.';
    } else if (select.value === 'Münzen / Medaillen') {
        text = 'Hinweis: Münzen/Medaillen benötigen Herkunfts- und Eigentumsnachweis; Sammlerstatus prüfen.';
    }
    if (text) {
        hint.textContent = text;
        hint.style.display = 'block';
    } else {
        hint.textContent = '';
        hint.style.display = 'none';
    }
}

function setEditSellerDisplay(contact) {
    const sellerInput = document.getElementById('edit-deal-seller');
    if (!sellerInput) return;
    if (!contact) {
        sellerInput.value = '';
        sellerInput.placeholder = 'Nicht zugeordnet';
        return;
    }
    const name = contact.full_name || '';
    const company = contact.company || '';
    sellerInput.value = [name, company].filter(Boolean).join(' · ') || name || company;
}

function setNewDealSellerDisplay(contact) {
    const sellerInput = document.getElementById('new-deal-seller');
    if (!sellerInput) return;
    if (!contact) {
        sellerInput.value = '';
        sellerInput.placeholder = 'Nicht zugeordnet';
        return;
    }
    const name = contact.full_name || '';
    const company = contact.company || '';
    sellerInput.value = [name, company].filter(Boolean).join(' · ') || name || company;
}

function openDeleteEntityModal(type, entity) {
    const modal = document.getElementById('delete-entity-modal');
    const titleEl = document.getElementById('delete-entity-title');
    const textEl = document.getElementById('delete-entity-text');
    const reasonEl = document.getElementById('delete-reason');
    const confirmEl = document.getElementById('delete-confirm-checkbox');
    const confirmTextEl = document.getElementById('delete-confirm-text');
    const modeArchive = modal?.querySelector('input[name="delete-mode"][value="archive"]');
    if (!modal || !titleEl || !textEl || !reasonEl || !confirmEl || !modeArchive) return;

    const label = entity?.label || '';
    deleteContext = {
        type,
        id: entity?.id || null,
        label,
        confirmText: `DELETE ${label}`.trim()
    };

    titleEl.textContent = type === 'deal' ? 'Geschäft löschen' : 'Kontakt löschen';
    textEl.textContent = type === 'deal'
        ? `Geschäft ${label} löschen: Archivieren oder endgültig entfernen?`
        : `Kontakt ${label} löschen: Archivieren oder endgültig entfernen?`;
    const confirmTextEl = document.getElementById('delete-confirm-text');
    if (confirmTextEl) confirmTextEl.placeholder = deleteContext.confirmText;

    modeArchive.checked = true;
    confirmEl.checked = false;
    confirmEl.disabled = true;
    if (confirmTextEl) confirmTextEl.value = '';
    reasonEl.value = '';
    updateDeleteConfirmState();
    openModal('delete-entity-modal');
}

function getDeleteMode() {
    const modal = document.getElementById('delete-entity-modal');
    const selected = modal?.querySelector('input[name="delete-mode"]:checked');
    return selected?.value || 'archive';
}

function updateDeleteConfirmState() {
    const modal = document.getElementById('delete-entity-modal');
    const confirmEl = document.getElementById('delete-confirm-checkbox');
    const confirmBtn = document.getElementById('delete-entity-confirm');
    const warningEl = document.getElementById('delete-entity-warning');
    const confirmTextEl = document.getElementById('delete-confirm-text');
    if (!modal || !confirmEl || !confirmBtn) return;
    const mode = getDeleteMode();
    if (mode === 'purge') {
        confirmEl.disabled = false;
        const expected = (deleteContext?.confirmText || 'DELETE').toUpperCase();
        const textOk = (confirmTextEl?.value || '').trim().toUpperCase() === expected;
        confirmBtn.disabled = !(confirmEl.checked && textOk);
        if (warningEl) warningEl.style.display = 'block';
    } else {
        confirmEl.checked = false;
        confirmEl.disabled = true;
        confirmBtn.disabled = false;
        if (confirmTextEl) confirmTextEl.value = '';
        if (warningEl) warningEl.style.display = 'none';
    }
}

async function handleDeleteEntityConfirm() {
    if (!deleteContext?.id) return;
    const mode = getDeleteMode();
    const reason = document.getElementById('delete-reason')?.value?.trim() || null;
    if (mode === 'purge') {
        const confirmed = document.getElementById('delete-confirm-checkbox')?.checked;
        const confirmText = (document.getElementById('delete-confirm-text')?.value || '').trim().toUpperCase();
        const expected = (deleteContext?.confirmText || 'DELETE').toUpperCase();
        if (!confirmed || confirmText !== expected) return;
    }

    try {
        if (deleteContext.type === 'deal') {
            await deleteDeal(deleteContext.id, mode, reason);
        } else if (deleteContext.type === 'contact') {
            await deleteContact(deleteContext.id, mode, reason);
        }
        closeModal('delete-entity-modal');
        alert('Löschen abgeschlossen.');
    } catch (err) {
        console.error('Delete failed:', err);
        alert('Löschen fehlgeschlagen. Details in Konsole.');
    } finally {
        deleteContext = null;
    }
}

async function deleteDeal(dealId, mode, reason) {
    if (demoMode || window.demoMode || !supabase) return;
    if (mode === 'archive') {
        const payload = {
            deleted_at: new Date().toISOString(),
            deleted_by: currentUser?.id || null,
            delete_reason: reason
        };
        const { error } = await supabase.from('deals').update(payload).eq('id', dealId);
        if (error) throw error;
        await logAudit(dealId, 'ARCHIVE', 'deal', dealId, null, payload);
    } else {
        await purgeDeal(dealId);
    }

    if (currentDeal?.id === dealId) {
        activeView = 'dashboard';
        activeDealId = null;
        document.getElementById('deal-detail-view')?.classList.remove('active');
        document.getElementById('dashboard-view')?.classList.add('active');
    }
    await loadDashboard();
}

async function purgeDeal(dealId) {
    const { data: docs, error: docsError } = await supabase
        .from('documents')
        .select('file_path')
        .eq('deal_id', dealId);
    if (docsError) {
        console.error('Error loading documents for purge:', docsError);
    }
    const paths = (docs || []).map(d => d.file_path).filter(Boolean);
    if (paths.length > 0) {
        const { error: storageError } = await supabase.storage.from(STORAGE_BUCKET).remove(paths);
        if (storageError) console.error('Error deleting storage files:', storageError);
    }

    const tables = [
        'deal_step_audit',
        'audit_log',
        'deal_steps',
        'deal_contacts',
        'deal_bank_accounts',
        'documents',
        'kyc_bank_contacts',
        'kyc_bank_details',
        'kyc_profiles',
        'kyc_trade_references',
        'parties',
        'risks',
        'step_dependencies'
    ];
    for (const table of tables) {
        const { error } = await supabase.from(table).delete().eq('deal_id', dealId);
        if (error) console.error(`Error deleting from ${table}:`, error);
    }
    const { error: dealError } = await supabase.from('deals').delete().eq('id', dealId);
    if (dealError) throw dealError;
    await logAudit(dealId, 'PURGE', 'deal', dealId, null, { deal_id: dealId });
}

function getDummyMode() {
    const modal = document.getElementById('dummy-cleanup-modal');
    const selected = modal?.querySelector('input[name="dummy-mode"]:checked');
    return selected?.value || 'archive';
}

function updateDummyConfirmState() {
    const modal = document.getElementById('dummy-cleanup-modal');
    const confirmEl = document.getElementById('dummy-confirm-checkbox');
    const confirmBtn = document.getElementById('dummy-confirm');
    const warningEl = document.getElementById('dummy-cleanup-warning');
    const confirmTextEl = document.getElementById('dummy-confirm-text');
    if (!modal || !confirmEl || !confirmBtn) return;
    const mode = getDummyMode();
    if (mode === 'purge') {
        confirmEl.disabled = false;
        const textOk = (confirmTextEl?.value || '').trim().toUpperCase() === 'DELETE DUMMY';
        confirmBtn.disabled = !(confirmEl.checked && textOk);
        if (warningEl) warningEl.style.display = 'block';
    } else {
        confirmEl.checked = false;
        confirmEl.disabled = true;
        confirmBtn.disabled = false;
        if (confirmTextEl) confirmTextEl.value = '';
        if (warningEl) warningEl.style.display = 'none';
    }
}

async function handleDummyCleanupConfirm() {
    if (demoMode || window.demoMode || !supabase) return;
    const mode = getDummyMode();
    const reset = document.getElementById('dummy-reset-numbering')?.checked;
    const confirmed = document.getElementById('dummy-confirm-checkbox')?.checked;
    const confirmText = (document.getElementById('dummy-confirm-text')?.value || '').trim().toUpperCase();
    if (mode === 'purge' && (!confirmed || confirmText !== 'DELETE DUMMY')) return;

    showLoading(true);
    try {
        let dealIds = [];
        if (reset) {
            const { data: all, error } = await supabase.from('deals').select('id');
            if (error) throw error;
            dealIds = (all || []).map(d => d.id);
            if (dealIds.length > 0) {
                const { error: markErr } = await supabase
                    .from('deals')
                    .update({ is_test: true })
                    .in('id', dealIds);
                if (markErr) throw markErr;
            }
        } else {
            const { data: testDeals, error } = await supabase
                .from('deals')
                .select('id')
                .eq('is_test', true);
            if (error) throw error;
            dealIds = (testDeals || []).map(d => d.id);
        }

        if (dealIds.length === 0) {
            alert('Keine Dummy-Daten gefunden.');
            closeModal('dummy-cleanup-modal');
            return;
        }

        if (mode === 'archive') {
            const payload = {
                deleted_at: new Date().toISOString(),
                deleted_by: currentUser?.id || null,
                delete_reason: 'Dummy cleanup'
            };
            const { error } = await supabase.from('deals').update(payload).in('id', dealIds);
            if (error) throw error;
        } else {
            for (const dealId of dealIds) {
                await purgeDeal(dealId);
            }
        }

        closeModal('dummy-cleanup-modal');
        alert('Dummy-Bereinigung abgeschlossen.');
        await loadDashboard();
    } catch (err) {
        console.error('Dummy cleanup failed:', err);
        alert('Bereinigung fehlgeschlagen. Details in Konsole.');
    } finally {
        showLoading(false);
    }
}

async function deleteContact(contactId, mode, reason) {
    if (demoMode || window.demoMode || !supabase) return;
    if (mode === 'archive') {
        const payload = {
            deleted_at: new Date().toISOString(),
            deleted_by: currentUser?.id || null,
            delete_reason: reason
        };
        const { error } = await supabase.from('contacts').update(payload).eq('id', contactId);
        if (error) throw error;
    } else {
        const tables = ['deal_contacts', 'deal_bank_accounts', 'kyc_profiles'];
        for (const table of tables) {
            const { error } = await supabase.from(table).delete().eq('contact_id', contactId);
            if (error) console.error(`Error deleting from ${table}:`, error);
        }
        const { error: contactError } = await supabase.from('contacts').delete().eq('id', contactId);
        if (contactError) throw contactError;
    }

    await loadContacts();
    selectedContactId = null;
    const detail = document.getElementById('contact-detail');
    const empty = document.getElementById('contact-detail-empty');
    if (empty) empty.style.display = 'block';
    if (detail) detail.style.display = 'none';
    renderContactsList(filterContacts(document.getElementById('contacts-search')?.value || ''));
}


// ============================================
// Event Listeners
// ============================================
function setupEventListeners() {
    // Login
    document.getElementById('login-form').addEventListener('submit', handleLogin);
    document.getElementById('signup-form').addEventListener('submit', handleSignup);
    document.getElementById('show-signup').addEventListener('click', () => {
        if (ACCESS_REQUEST_MODE) {
            openAccessRequestModal();
            return;
        }
        document.getElementById('login-form').style.display = 'none';
        document.getElementById('signup-form').style.display = 'block';
    });
    document.getElementById('show-login').addEventListener('click', () => {
        document.getElementById('signup-form').style.display = 'none';
        document.getElementById('login-form').style.display = 'block';
    });
    const requestAccessBtn = document.getElementById('request-access-btn');
    if (requestAccessBtn) {
        requestAccessBtn.addEventListener('click', () => openAccessRequestModal());
    }
    const accessRequestForm = document.getElementById('access-request-form');
    if (accessRequestForm) {
        accessRequestForm.addEventListener('submit', handleAccessRequestSubmit);
    }
    // Demo mode buttons - check if they exist
    const demoModeBtn = document.getElementById('demo-mode-btn');
    const demoModeBtnSignup = document.getElementById('demo-mode-btn-signup');
    
    if (demoModeBtn) {
        demoModeBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            console.log('Demo button clicked');
            enableDemoMode();
        });
    } else {
        console.warn('Demo mode button not found');
    }
    
    if (demoModeBtnSignup) {
        demoModeBtnSignup.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            console.log('Demo button (signup) clicked');
            enableDemoMode();
        });
    }
    
    document.getElementById('logout-btn').addEventListener('click', handleLogout);
    const accessRequestsBtn = document.getElementById('access-requests-btn');
    if (accessRequestsBtn) {
        accessRequestsBtn.addEventListener('click', () => openAccessRequestsAdminModal());
    }
    
    // Dashboard
    document.getElementById('new-deal-btn').addEventListener('click', () => {
        pendingNewDealSellerContactId = null;
        setNewDealSellerDisplay(null);
        openModal('new-deal-modal');
        updateCommodityHint('new-deal-commodity', 'new-deal-commodity-hint');
    });
    document.getElementById('search-deals').addEventListener('input', filterDeals);
    document.getElementById('filter-status').addEventListener('change', filterDeals);
    document.getElementById('back-to-dashboard').addEventListener('click', showDashboard);
    
    // Deal Management
    document.getElementById('new-deal-form').addEventListener('submit', handleCreateDeal);
    document.getElementById('edit-deal-btn').addEventListener('click', () => openModal('edit-deal-modal'));
    document.getElementById('edit-deal-grc-btn')?.addEventListener('click', () => {
        if (currentDeal?.deal_no) {
            openGrcPlanningModal(currentDeal.deal_no);
        }
    });
    document.getElementById('edit-deal-form').addEventListener('submit', handleUpdateDeal);
    const discountBtn = document.getElementById('discount-participation-btn');
    if (discountBtn) {
        discountBtn.addEventListener('click', () => openDiscountParticipationModal());
    }
    const deleteDealBtn = document.getElementById('delete-deal-btn');
    if (deleteDealBtn) {
        deleteDealBtn.addEventListener('click', () => {
            if (!currentDeal?.id) return;
            openDeleteEntityModal('deal', { id: currentDeal.id, label: currentDeal.deal_no });
        });
    }

    const deleteModal = document.getElementById('delete-entity-modal');
    if (deleteModal) {
        deleteModal.querySelectorAll('input[name="delete-mode"]').forEach(input => {
            input.addEventListener('change', updateDeleteConfirmState);
        });
    }
    const deleteConfirm = document.getElementById('delete-confirm-checkbox');
    if (deleteConfirm) {
        deleteConfirm.addEventListener('change', updateDeleteConfirmState);
    }
    const deleteConfirmText = document.getElementById('delete-confirm-text');
    if (deleteConfirmText) {
        deleteConfirmText.addEventListener('input', updateDeleteConfirmState);
    }
    const deleteCancelBtn = document.getElementById('delete-entity-cancel');
    if (deleteCancelBtn) {
        deleteCancelBtn.addEventListener('click', () => closeModal('delete-entity-modal'));
    }
    const deleteConfirmBtn = document.getElementById('delete-entity-confirm');
    if (deleteConfirmBtn) {
        deleteConfirmBtn.addEventListener('click', handleDeleteEntityConfirm);
    }

    const cleanupBtn = document.getElementById('cleanup-dummy-btn');
    if (cleanupBtn) {
        cleanupBtn.addEventListener('click', () => {
            const confirmEl = document.getElementById('dummy-confirm-checkbox');
            const confirmTextEl = document.getElementById('dummy-confirm-text');
            if (confirmEl) confirmEl.checked = false;
            if (confirmTextEl) confirmTextEl.value = '';
            updateDummyConfirmState();
            openModal('dummy-cleanup-modal');
        });
    }
    const dummyModal = document.getElementById('dummy-cleanup-modal');
    if (dummyModal) {
        dummyModal.querySelectorAll('input[name="dummy-mode"]').forEach(input => {
            input.addEventListener('change', updateDummyConfirmState);
        });
    }
    const dummyConfirm = document.getElementById('dummy-confirm-checkbox');
    if (dummyConfirm) {
        dummyConfirm.addEventListener('change', updateDummyConfirmState);
    }
    const dummyConfirmText = document.getElementById('dummy-confirm-text');
    if (dummyConfirmText) {
        dummyConfirmText.addEventListener('input', updateDummyConfirmState);
    }
    const dummyCancel = document.getElementById('dummy-cancel');
    if (dummyCancel) {
        dummyCancel.addEventListener('click', () => closeModal('dummy-cleanup-modal'));
    }
    const dummyConfirmBtn = document.getElementById('dummy-confirm');
    if (dummyConfirmBtn) {
        dummyConfirmBtn.addEventListener('click', handleDummyCleanupConfirm);
    }

    const kycSaveBtn = document.getElementById('kyc-save-btn');
    if (kycSaveBtn) {
        kycSaveBtn.addEventListener('click', async (e) => {
            e.preventDefault();
            await saveKycProfile();
        });
    }
    const kycCreateContactsBtn = document.getElementById('kyc-create-contacts-btn');
    if (kycCreateContactsBtn) {
        kycCreateContactsBtn.addEventListener('click', async (e) => {
            e.preventDefault();
            await createContactsFromKyc();
        });
    }
    const kycCleanupBtn = document.getElementById('kyc-cleanup-btn');
    if (kycCleanupBtn) {
        kycCleanupBtn.addEventListener('click', async (e) => {
            e.preventDefault();
            await cleanupKycSignedPdfs();
        });
    }
    const kycPrintBtn = document.getElementById('kyc-print-btn');
    if (kycPrintBtn) {
        kycPrintBtn.addEventListener('click', (e) => {
            e.preventDefault();
            printKycProfile();
        });
    }
    const kycBackBtn = document.getElementById('kyc-back-to-generator-btn');
    if (kycBackBtn) {
        kycBackBtn.addEventListener('click', async (e) => {
            e.preventDefault();
            await openGeneratorFromKyc();
        });
    }
    const kycPdfCloseBtn = document.getElementById('kyc-pdf-close-btn');
    if (kycPdfCloseBtn) {
        kycPdfCloseBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const panel = document.getElementById('kyc-pdf-panel');
            if (panel) panel.style.display = 'none';
        });
    }
    const kycUploadBtn = document.getElementById('kyc-upload-btn');
    if (kycUploadBtn) {
        kycUploadBtn.addEventListener('click', async (e) => {
            e.preventDefault();
            await handleKycSignedUpload();
        });
    }
    const kycRoleSelect = document.getElementById('kyc-role-select');
    if (kycRoleSelect) {
        kycRoleSelect.addEventListener('change', async () => {
            const previousRole = currentKycRole || 'Buyer';
            const nextRole = kycRoleSelect.value || 'Buyer';
            if (previousRole === nextRole) return;

            if (currentDeal?.id) {
                const hasUnsaved = !currentKycProfileId && kycHasData(collectKycFormValues());
                if (hasUnsaved) {
                    alert('Bitte zuerst speichern, bevor die KYC-Rolle gewechselt wird.');
                    kycRoleSelect.value = previousRole;
                    return;
                }
                await maybeMoveKycProfile(currentDeal.id, previousRole, nextRole);
                currentKycRole = nextRole;
                await loadDealKyc(currentDeal.id);
            } else {
                currentKycRole = nextRole;
            }
        });
    }

    const kycCompanyNameEl = document.getElementById('kyc-company-name');
    if (kycCompanyNameEl) {
        kycCompanyNameEl.addEventListener('input', () => {
            ensureKorasSubsidiariesPrefill();
        });
    }

    const bankContactsEl = document.getElementById('kyc-bank-contacts');
    if (bankContactsEl) {
        bankContactsEl.addEventListener('input', updateBankOfficer2Hint);
    }
    ['kyc-bank-officer', 'kyc-bank-officer-phone', 'kyc-bank-officer-email'].forEach((id) => {
        const field = document.getElementById(id);
        if (field) {
            field.addEventListener('input', updateBankOfficer2Hint);
        }
    });
    
    // Commodity type change
    document.getElementById('new-deal-commodity').addEventListener('change', (e) => {
        const hallmarkGroup = document.getElementById('hallmark-age-group');
        if (e.target.value === 'Hallmark' || e.target.value === 'Minted Bars') {
            hallmarkGroup.style.display = 'block';
        } else {
            hallmarkGroup.style.display = 'none';
        }
        updateCommodityHint('new-deal-commodity', 'new-deal-commodity-hint');
    });

    const editCommodity = document.getElementById('edit-deal-commodity');
    if (editCommodity) {
        editCommodity.addEventListener('change', (e) => {
            updateEditHallmarkVisibility(e.target.value);
            updateCommodityHint('edit-deal-commodity', 'edit-deal-commodity-hint');
        });
    }

    const editSellerPickBtn = document.getElementById('edit-deal-seller-pick');
    if (editSellerPickBtn) {
        editSellerPickBtn.addEventListener('click', (e) => {
            e.preventDefault();
            startSellerAssignment();
        });
    }

    const newSellerPickBtn = document.getElementById('new-deal-seller-pick');
    if (newSellerPickBtn) {
        newSellerPickBtn.addEventListener('click', (e) => {
            e.preventDefault();
            startNewDealSellerAssignment();
        });
    }

    const dptSaveBtn = document.getElementById('dpt-save-btn');
    if (dptSaveBtn) {
        dptSaveBtn.addEventListener('click', () => saveDiscountParticipation());
    }
    const dptResetBtn = document.getElementById('dpt-reset-btn');
    if (dptResetBtn) {
        dptResetBtn.addEventListener('click', () => {
            discountParticipationDraft = cloneDiscountParticipation(getDefaultDiscountParticipation());
            renderDiscountParticipationModal();
        });
    }

    const dptModal = document.getElementById('discount-participation-modal');
    if (dptModal) {
        dptModal.addEventListener('click', (e) => {
            const target = e.target;
            if (target?.id === 'dpt-add-provider') {
                const newId = `P${Date.now()}`;
                discountParticipationDraft.providers.push({
                    id: newId,
                    name: 'Sonstige',
                    amountEUR: 0,
                    costBearer: 'Seller',
                    vatIncluded: true
                });
                renderProviderTable();
                renderDiscountParticipationSummary();
            }
        });
        dptModal.addEventListener('input', (e) => {
            if (!discountParticipationDraft) return;
            const target = e.target;
            if (target.id === 'dpt-gross-input') {
                discountParticipationDraft.grossDiscountPercent = Number(target.value) || 0;
                renderDiscountParticipationSummary();
                return;
            }
            if (target.id === 'dpt-gold-kg-input') {
                discountParticipationDraft.goldAmountKg = Number(target.value) || 0;
                renderDiscountAllocationSections();
                return;
            }
            if (target.classList.contains('dpt-percent')) {
                const group = target.dataset.group;
                const id = target.dataset.id;
                const value = Math.max(0, Number(target.value) || 0);
                updateDiscountParticipationValue(group, id, { percent: value, enabled: true });
                renderDiscountParticipationSummary();
                renderDiscountAllocationSections();
                return;
            }
            if (target.classList.contains('dpt-provider-name')) {
                updateProviderValue(target.dataset.id, { name: target.value });
                return;
            }
            if (target.classList.contains('dpt-provider-amount')) {
                const value = Math.max(0, parseLocaleAmount(target.value));
                updateProviderValue(target.dataset.id, { amountEUR: value });
                renderDiscountParticipationSummary();
            }
        });
        dptModal.addEventListener('change', (e) => {
            if (!discountParticipationDraft) return;
            const target = e.target;
            if (target.classList.contains('dpt-enabled')) {
                const group = target.dataset.group;
                const id = target.dataset.id;
                const enabled = target.checked;
                updateDiscountParticipationValue(group, id, enabled ? { enabled: true } : { enabled: false, percent: 0 });
                renderDiscountAllocationSections();
                renderDiscountParticipationSummary();
            }
            if (target.classList.contains('dpt-provider-choice')) {
                const providerId = target.dataset.id;
                const bearer = target.dataset.bearer;
                const wrapper = target.closest('.dpt-provider-bearer');
                if (wrapper) {
                    wrapper.querySelectorAll('input[type="checkbox"]').forEach(box => {
                        box.checked = box.dataset.bearer === bearer;
                    });
                }
                updateProviderValue(providerId, { costBearer: bearer });
                renderDiscountParticipationSummary();
            }
            if (target.classList.contains('dpt-provider-vat')) {
                updateProviderValue(target.dataset.id, { vatIncluded: target.checked });
                renderProviderTable();
                renderDiscountParticipationSummary();
            }
        });
        dptModal.addEventListener('focusin', (e) => {
            const target = e.target;
            if (target.classList.contains('dpt-provider-amount')) {
                target.select();
            }
        });
        dptModal.addEventListener('focusout', (e) => {
            const target = e.target;
            if (target.classList.contains('dpt-provider-amount')) {
                const value = parseLocaleAmount(target.value);
                target.value = formatAmountValue(value);
                renderProviderTable();
                renderDiscountParticipationSummary();
            }
        });
    }
    
    // Tabs
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const tab = e.target.closest('.tab-btn').dataset.tab;
            switchTab(tab);
        });
    });
    
    // Export
    document.getElementById('export-deal-btn').addEventListener('click', () => openModal('export-modal'));
    document.getElementById('export-execute-btn').addEventListener('click', async () => {
        try {
            const { handleExport } = await import('./exports.js');
            await handleExport();
        } catch (err) {
            console.error('Export failed:', err);
            alert(`Export fehlgeschlagen: ${err.message || err}`);
        }
    });
    const overviewBtn = document.getElementById('export-overview-btn');
    if (overviewBtn) {
        overviewBtn.addEventListener('click', () => openModal('deal-overview-modal'));
    }
    const overviewExportBtn = document.getElementById('deal-overview-export-btn');
    if (overviewExportBtn) {
        overviewExportBtn.addEventListener('click', async () => {
            try {
                const orientation = document.querySelector('input[name="deal-overview-orientation"]:checked')?.value || 'portrait';
                const { exportDealsOverview } = await import('./exports.js');
                await exportDealsOverview(orientation);
                closeModal('deal-overview-modal');
            } catch (err) {
                console.error('Deal overview export failed:', err);
                alert(`Deal-Übersicht fehlgeschlagen: ${err.message || err}`);
            }
        });
    }
    const generatorHubBtn = document.getElementById('generator-hub-btn');
    if (generatorHubBtn) {
        generatorHubBtn.addEventListener('click', async () => {
            try {
                const { openGeneratorHub } = await import('./generator.js');
                openGeneratorHub();
            } catch (err) {
                console.error('Generator hub failed:', err);
                alert(`Generator-Hub fehlgeschlagen: ${err.message || err}`);
            }
        });
    }
    if (!document.body.dataset.generatorHubBound) {
        document.body.dataset.generatorHubBound = 'true';
        document.addEventListener('click', async (e) => {
            const btn = e.target.closest('#generator-hub-btn');
            if (!btn) return;
            try {
                const { openGeneratorHub } = await import('./generator.js');
                openGeneratorHub();
            } catch (err) {
                console.error('Generator hub failed:', err);
                alert(`Generator-Hub fehlgeschlagen: ${err.message || err}`);
            }
        });
    }
    
    // Risks
    document.getElementById('add-risk-btn').addEventListener('click', () => {
        // Reset form for new risk
        document.getElementById('add-risk-form').reset();
        document.getElementById('risk-id').value = '';
        document.getElementById('risk-modal-title').textContent = 'Risiko hinzufügen';
        document.getElementById('risk-submit-btn').textContent = 'Hinzufügen';
        document.getElementById('risk-status').value = 'Open';
        
        // Reset mitigation presets
        document.querySelectorAll('.mitigation-preset').forEach(cb => cb.checked = false);
        const mitigationPresetsContainer = document.getElementById('mitigation-presets-container');
        if (mitigationPresetsContainer) {
            mitigationPresetsContainer.classList.remove('active');
        }
        const mitigationPresetsBtn = document.getElementById('mitigation-presets-btn');
        if (mitigationPresetsBtn) {
            mitigationPresetsBtn.innerHTML = '<i class="ti ti-list"></i> Vordefinierte Maßnahmen auswählen';
        }
        
        // Reset category filter for presets
        const riskCategorySelect = document.getElementById('risk-category');
        if (riskCategorySelect) {
            riskCategorySelect.dispatchEvent(new Event('change'));
        }
        
        openModal('add-risk-modal');
    });
    document.getElementById('add-risk-form').addEventListener('submit', handleAddRisk);
    document.getElementById('filter-risk-category').addEventListener('change', filterRisks);
    
    // Mitigation presets
    const mitigationPresetsBtn = document.getElementById('mitigation-presets-btn');
    const mitigationPresetsContainer = document.getElementById('mitigation-presets-container');
    const mitigationAddSelectedBtn = document.getElementById('mitigation-add-selected');
    const mitigationClearPresetsBtn = document.getElementById('mitigation-clear-presets');
    const mitigationTextarea = document.getElementById('risk-mitigation');
    
    if (mitigationPresetsBtn && mitigationPresetsContainer) {
        mitigationPresetsBtn.addEventListener('click', () => {
            const isVisible = mitigationPresetsContainer.classList.contains('active');
            if (isVisible) {
                mitigationPresetsContainer.classList.remove('active');
                mitigationPresetsBtn.innerHTML = '<i class="ti ti-list"></i> Vordefinierte Maßnahmen auswählen';
            } else {
                mitigationPresetsContainer.classList.add('active');
                mitigationPresetsBtn.innerHTML = '<i class="ti ti-chevron-up"></i> Vordefinierte Maßnahmen ausblenden';
            }
        });
    }
    
    if (mitigationAddSelectedBtn) {
        mitigationAddSelectedBtn.addEventListener('click', () => {
            const selected = Array.from(document.querySelectorAll('.mitigation-preset:checked'))
                .map(cb => cb.value);
            
            if (selected.length === 0) {
                alert('Bitte wählen Sie mindestens eine Maßnahme aus.');
                return;
            }
            
            const currentText = mitigationTextarea.value.trim();
            const newText = selected.map(s => `• ${s}`).join('\n');
            
            if (currentText) {
                // Append to existing text with separator
                mitigationTextarea.value = currentText + '\n\n' + newText;
            } else {
                mitigationTextarea.value = newText;
            }
            
            // Uncheck all checkboxes
            document.querySelectorAll('.mitigation-preset').forEach(cb => cb.checked = false);
        });
    }
    
    if (mitigationClearPresetsBtn) {
        mitigationClearPresetsBtn.addEventListener('click', () => {
            document.querySelectorAll('.mitigation-preset').forEach(cb => cb.checked = false);
        });
    }
    
    // Filter presets by risk category
    const riskCategorySelect = document.getElementById('risk-category');
    if (riskCategorySelect) {
        riskCategorySelect.addEventListener('change', () => {
            const selectedCategory = riskCategorySelect.value;
            const presetLabels = document.querySelectorAll('.mitigation-preset-label');
            
            presetLabels.forEach(label => {
                const category = label.getAttribute('data-category');
                
                if (selectedCategory && category !== selectedCategory) {
                    label.classList.add('disabled');
                } else {
                    label.classList.remove('disabled');
                }
            });
        });
    }
    
    // Documents
    document.getElementById('search-documents').addEventListener('input', filterDocuments);
    document.getElementById('upload-document-btn').addEventListener('click', () => {
        if (demoMode) {
            alert('Demo-Modus: Dateien können nicht hochgeladen werden. Bitte melden Sie sich an, um die vollständige Funktionalität zu nutzen.');
            return;
        }
        openUploadDocumentModal();
    });
    document.getElementById('upload-document-form').addEventListener('submit', handleUploadDocumentForm);

    const contactsBtn = document.getElementById('contacts-btn');
    if (contactsBtn) {
        contactsBtn.addEventListener('click', () => {
            clearSellerAssignmentMode();
            openContactsModal();
        });
    }

    const addDealContactBtn = document.getElementById('add-deal-contact-btn');
    if (addDealContactBtn) {
        addDealContactBtn.addEventListener('click', () => {
            clearSellerAssignmentMode();
            openContactsModal(currentDeal?.id || null);
        });
    }
    
    // Modal close handlers
    document.querySelectorAll('.modal-close, .modal-cancel').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const modal = e.target.closest('.modal');
            closeModal(modal.id);
        });
    });
    
    // Close modal on outside click
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal(modal.id);
            }
        });
    });

    setupModalDragging();
    setupDealSuggestions();
    setupContactsModal();
    setupLbmaUnitToggle();
    window.addEventListener('generator:upload', (event) => {
        openUploadDocumentModalWithPreset(event.detail || {});
    });
    window.addEventListener('generator:kyc', async (event) => {
        const detail = event.detail || {};
        const dealId = detail.dealId || '';
        if (!dealId) return;
        lastGeneratorDealId = dealId;
        closeModal('generator-hub-modal');
        await loadDealDetail(dealId);
        switchTab('kyc');
        document.getElementById('deal-detail-view')?.scrollTo({ top: 0, left: 0, behavior: 'auto' });
        window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    });
}

// ============================================
// Login/Logout
// ============================================
async function handleLogin(e) {
    e.preventDefault();
    
    // Reset demo mode when attempting to login
    demoMode = false;
    window.demoMode = false;
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const errorDiv = document.getElementById('login-error');
    
    // Check if Supabase is configured
    if (!supabase || SUPABASE_URL === 'YOUR_SUPABASE_URL' || SUPABASE_ANON_KEY === 'YOUR_SUPABASE_ANON_KEY') {
        errorDiv.textContent = 'Fehler: Supabase-Credentials nicht konfiguriert. Bitte tragen Sie Ihre Supabase-URL und den Anon-Key in supabase.js ein.';
        errorDiv.classList.add('show');
        return;
    }
    
    showLoading(true);
    errorDiv.classList.remove('show');
    
    try {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password
        });
        
        showLoading(false);
        
        if (error) {
            // Check for email confirmation error
            if (error.message.includes('Email not confirmed') || error.message.includes('email_not_confirmed')) {
                errorDiv.innerHTML = `Fehler: Bitte bestätigen Sie zuerst Ihre E-Mail-Adresse. Prüfen Sie Ihr Postfach und klicken Sie auf den Bestätigungslink.<br><br>
                    <small>Hinweis: Falls Sie die E-Mail nicht erhalten haben, können Sie die E-Mail-Bestätigung im Supabase Dashboard deaktivieren (Authentication → Settings → "Enable email confirmations" deaktivieren).</small>`;
            } else {
                errorDiv.textContent = `Fehler: ${error.message}`;
            }
            errorDiv.classList.add('show');
        } else {
            // Verify session was created
            const { data: { session } } = await supabase.auth.getSession();
            if (session) {
                currentUser = session.user;
                showApp();
            } else {
                errorDiv.textContent = 'Fehler: Anmeldung erfolgreich, aber keine Session erstellt. Bitte versuchen Sie es erneut.';
                errorDiv.classList.add('show');
            }
        }
    } catch (err) {
        showLoading(false);
        console.error('Login error:', err);
        errorDiv.textContent = `Fehler: ${err.message || 'Unbekannter Fehler. Bitte überprüfen Sie Ihre Supabase-Konfiguration.'}`;
        errorDiv.classList.add('show');
    }
}

async function handleSignup(e) {
    e.preventDefault();
    if (ACCESS_REQUEST_MODE) {
        const errorDiv = document.getElementById('signup-error');
        if (errorDiv) {
            errorDiv.textContent = 'Registrierung ist deaktiviert. Bitte nutzen Sie \"Zugang anfragen\".';
            errorDiv.classList.add('show');
        }
        return;
    }
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;
    const passwordConfirm = document.getElementById('signup-password-confirm').value;
    const errorDiv = document.getElementById('signup-error');
    const successDiv = document.getElementById('signup-success');
    
    // Check if Supabase is configured
    if (!supabase || SUPABASE_URL === 'YOUR_SUPABASE_URL' || SUPABASE_ANON_KEY === 'YOUR_SUPABASE_ANON_KEY') {
        errorDiv.textContent = 'Fehler: Supabase-Credentials nicht konfiguriert. Bitte tragen Sie Ihre Supabase-URL und den Anon-Key in supabase.js ein.';
        errorDiv.classList.add('show');
        return;
    }
    
    // Validate passwords match
    if (password !== passwordConfirm) {
        errorDiv.textContent = 'Die Passwörter stimmen nicht überein.';
        errorDiv.classList.add('show');
        return;
    }
    
    if (password.length < 6) {
        errorDiv.textContent = 'Das Passwort muss mindestens 6 Zeichen lang sein.';
        errorDiv.classList.add('show');
        return;
    }
    
    showLoading(true);
    errorDiv.classList.remove('show');
    successDiv.classList.remove('show');
    
    try {
        const { data, error } = await supabase.auth.signUp({
            email,
            password
        });
        
        showLoading(false);
        
        if (error) {
            errorDiv.textContent = `Fehler: ${error.message}`;
            errorDiv.classList.add('show');
        } else {
            successDiv.textContent = 'Account erfolgreich erstellt! Bitte prüfen Sie Ihre E-Mail zur Bestätigung, oder melden Sie sich direkt an.';
            successDiv.classList.add('show');
            
            // Auto-login if email confirmation is disabled
            if (data.user && data.session) {
                // User is immediately logged in (email confirmation disabled)
                setTimeout(() => {
                    currentUser = data.user;
                    showApp();
                }, 1500);
            } else if (data.user && !data.session) {
                // Email confirmation required
                successDiv.innerHTML = 'Account erfolgreich erstellt! Bitte prüfen Sie Ihre E-Mail und klicken Sie auf den Bestätigungslink, bevor Sie sich anmelden.<br><br><small>Hinweis: Falls Sie die E-Mail-Bestätigung deaktivieren möchten, gehen Sie im Supabase Dashboard zu Authentication → Settings → "Enable email confirmations" deaktivieren.</small>';
                successDiv.classList.add('show');
            }
        }
    } catch (err) {
        showLoading(false);
        errorDiv.textContent = `Fehler: ${err.message || 'Unbekannter Fehler. Bitte überprüfen Sie Ihre Supabase-Konfiguration.'}`;
        errorDiv.classList.add('show');
    }
}

function openAccessRequestModal() {
    const statusEl = document.getElementById('access-request-status');
    if (statusEl) statusEl.textContent = '';
    document.getElementById('access-request-form')?.reset();
    openModal('access-request-modal');
}

async function handleAccessRequestSubmit(e) {
    e.preventDefault();
    const statusEl = document.getElementById('access-request-status');
    if (statusEl) statusEl.textContent = 'Sende Anfrage...';
    if (!supabase) {
        if (statusEl) statusEl.textContent = 'Supabase ist nicht konfiguriert.';
        return;
    }
    const payload = {
        full_name: document.getElementById('access-request-name').value.trim(),
        email: document.getElementById('access-request-email').value.trim().toLowerCase(),
        company: document.getElementById('access-request-company').value.trim() || null,
        note: document.getElementById('access-request-note').value.trim() || null,
        status: 'PENDING'
    };
    if (!payload.full_name || !payload.email) {
        if (statusEl) statusEl.textContent = 'Bitte Name und E-Mail angeben.';
        return;
    }
    try {
        const { data, error } = await supabase
            .from('access_requests')
            .insert(payload)
            .select()
            .single();
        if (error) {
            console.error('Access request insert failed:', error);
            if (statusEl) statusEl.textContent = 'Anfrage konnte nicht gespeichert werden.';
            return;
        }
        try {
            await supabase.functions.invoke('access-request-notify', {
                body: {
                    request_id: data.id,
                    email: payload.email,
                    full_name: payload.full_name,
                    company: payload.company,
                    note: payload.note
                }
            });
        } catch (err) {
            console.warn('Access request notify failed:', err);
        }
        if (statusEl) statusEl.textContent = 'Anfrage gesendet. Sie erhalten eine Rückmeldung per E-Mail.';
    } catch (err) {
        console.error('Access request failed:', err);
        if (statusEl) statusEl.textContent = 'Anfrage konnte nicht gesendet werden.';
    }
}

async function updateAdminUi() {
    const btn = document.getElementById('access-requests-btn');
    if (!btn) return;
    try {
        const admin = await isAdmin();
        btn.classList.toggle('hidden', !admin);
    } catch (err) {
        btn.classList.add('hidden');
    }
}

async function openAccessRequestsAdminModal() {
    await loadAccessRequests();
    openModal('access-requests-admin-modal');
}

async function loadAccessRequests() {
    const container = document.getElementById('access-requests-list');
    if (!container) return;
    container.innerHTML = '<div class="text-secondary">Lade...</div>';
    if (!supabase) {
        container.innerHTML = '<div class="text-secondary">Supabase nicht verfügbar.</div>';
        return;
    }
    const { data, error } = await supabase
        .from('access_requests')
        .select('*')
        .order('created_at', { ascending: false });
    if (error) {
        console.error('Access requests load failed:', error);
        container.innerHTML = '<div class="text-secondary">Keine Zugriffsanfragen verfügbar.</div>';
        return;
    }
    renderAccessRequests(data || []);
}

function renderAccessRequests(items) {
    const container = document.getElementById('access-requests-list');
    if (!container) return;
    if (!items.length) {
        container.innerHTML = '<div class="empty-state"><i class="ti ti-user-x"></i><p>Keine offenen Anfragen</p></div>';
        return;
    }
    container.innerHTML = items.map(item => `
        <div class="access-request-item">
            <strong>${escapeHtml(item.full_name || '-')}</strong>
            <div class="text-secondary">${escapeHtml(item.email || '-')}</div>
            ${item.company ? `<div class="text-secondary">${escapeHtml(item.company)}</div>` : ''}
            ${item.note ? `<div class="text-secondary" style="margin-top: 6px;">${escapeHtml(item.note)}</div>` : ''}
            <div class="text-secondary" style="margin-top: 6px;">Status: ${escapeHtml(item.status || 'PENDING')}</div>
            <div class="access-request-actions">
                <button class="btn btn-sm btn-primary" data-action="approve" data-id="${item.id}">Freigeben</button>
                <button class="btn btn-sm btn-secondary" data-action="reject" data-id="${item.id}">Ablehnen</button>
            </div>
        </div>
    `).join('');
    container.querySelectorAll('button[data-action]').forEach(btn => {
        btn.addEventListener('click', () => handleAccessRequestDecision(btn.dataset.id, btn.dataset.action));
    });
}

async function handleAccessRequestDecision(requestId, action) {
    if (!supabase) return;
    try {
        await supabase.functions.invoke('access-request-approve', {
            body: { request_id: requestId, action }
        });
        await loadAccessRequests();
    } catch (err) {
        console.error('Access request decision failed:', err);
        alert('Aktion konnte nicht ausgeführt werden.');
    }
}

async function handleLogout() {
    // Reset demo mode
    demoMode = false;
    window.demoMode = false;
    currentUser = null;
    
    // Only sign out if we have a supabase client and are not in demo mode
    if (supabase && !demoMode) {
        try {
            await supabase.auth.signOut();
        } catch (err) {
            console.error('Error signing out:', err);
        }
    }
    
    showLogin();
}

// ============================================
// Dashboard
// ============================================
async function loadDashboard() {
    console.log('loadDashboard called, demoMode:', demoMode);
    showLoading(true);
    
    if (demoMode || window.demoMode) {
        console.log('Loading demo data...');
        // Load demo data
        await loadDemoData();
        await updateLbmaPriceDisplay();
        showLoading(false);
        console.log('Demo data loaded');
        return;
    }
    
    if (!supabase) {
        showLoading(false);
        renderDeals([]);
        await updateLbmaPriceDisplay();
        return;
    }
    
    try {
        const { data, error } = await supabase
            .from('deals')
            .select('*')
            .is('deleted_at', null)
            .order('created_at', { ascending: false });
        
        showLoading(false);
        
        if (error) {
            console.error('Error loading deals:', error);
            renderDeals([]);
            return;
        }
        
        allDeals = data || [];
        seedCountryDefaultsFromDeals(allDeals);
        updateCountrySuggestionList();
        renderDeals(allDeals);
        refreshGrcPlanningDealOptions();
        await updateLbmaPriceDisplay();
    } catch (err) {
        console.error('Error in loadDashboard:', err);
        showLoading(false);
        renderDeals([]);
        await updateLbmaPriceDisplay();
    }
}

async function updateLbmaPriceDisplay() {
    const container = document.getElementById('lbma-price');
    if (!container) return;
    const valuesEl = container.querySelector('.lbma-values');
    const timeEl = container.querySelector('.lbma-time');
    if (!valuesEl) return;
    if (!lastLbmaQuote) {
        try {
            const cached = JSON.parse(localStorage.getItem('lbma_quote') || 'null');
            if (cached && Number.isFinite(Number(cached.usd))) {
                lastLbmaQuote = {
                    usd: Number(cached.usd),
                    updatedAt: new Date(cached.updatedAt)
                };
            }
        } catch (err) {
            console.warn('LBMA cache parse failed:', err);
        }
    }
    if (!lastFxRate) {
        try {
            const cached = JSON.parse(localStorage.getItem('lbma_fx') || 'null');
            if (cached && Number.isFinite(Number(cached.rate))) {
                lastFxRate = {
                    rate: Number(cached.rate),
                    updatedAt: new Date(cached.updatedAt)
                };
            }
        } catch (err) {
            console.warn('LBMA FX cache parse failed:', err);
        }
    }
    const hasCachedQuote = Boolean(lastLbmaQuote);
    if (hasCachedQuote && valuesEl.textContent.trim() === '—') {
        const unit = getLbmaUnit();
        renderLbmaValues(valuesEl, lastLbmaQuote.usd, unit, lastFxRate?.rate ?? null);
        if (timeEl) {
            timeEl.textContent = `Stand: ${lastLbmaQuote.updatedAt.toLocaleString('de-DE')} (Cache)`;
        }
    }
    container.classList.add('is-updating');
    if (!hasCachedQuote) {
        valuesEl.textContent = 'Lade...';
        if (timeEl) timeEl.textContent = '';
    }
    try {
        const fxRatePromise = fetchUsdToEurRate();
        const goldSources = [
            fetch('https://api.gold-api.com/price/XAU'),
            fetch('https://api.metals.live/v1/spot/gold'),
            fetch('https://r.jina.ai/http://api.metals.live/v1/spot/gold')
        ];
        const goldSettled = await Promise.allSettled(goldSources);
        let usd = null;
        for (const result of goldSettled) {
            if (result.status !== 'fulfilled' || !result.value.ok) continue;
            let data = null;
            const contentType = result.value.headers.get('content-type') || '';
            if (contentType.includes('application/json')) {
                data = await result.value.json();
            } else {
                const text = await result.value.text();
                const jsonStart = text.indexOf('[');
                if (jsonStart !== -1) {
                    try {
                        data = JSON.parse(text.slice(jsonStart));
                    } catch (err) {
                        data = null;
                    }
                }
            }
            if (!data) continue;
            if (Array.isArray(data)) {
                if (data.length >= 2 && Number.isFinite(Number(data[1]))) {
                    usd = Number(data[1]);
                    break;
                }
                if (Array.isArray(data[0]) && Number.isFinite(Number(data[0][1]))) {
                    usd = Number(data[0][1]);
                    break;
                }
            }
            if (Number.isFinite(Number(data?.price))) {
                usd = Number(data.price);
                break;
            }
        }
        if (!Number.isFinite(usd)) {
            throw new Error('LBMA payload invalid');
        }
        const fxRate = await fxRatePromise;
        const unit = getLbmaUnit();
        renderLbmaValues(valuesEl, usd, unit, fxRate);
        const updatedAt = new Date();
        lastLbmaQuote = { usd, updatedAt };
        try {
            localStorage.setItem('lbma_quote', JSON.stringify({
                usd,
                updatedAt: updatedAt.toISOString()
            }));
        } catch (err) {
            console.warn('LBMA cache write failed:', err);
        }
        if (timeEl) {
            timeEl.textContent = `Stand: ${updatedAt.toLocaleString('de-DE')}`;
        }
        container.classList.remove('is-updating');
        container.classList.add('is-updated');
        window.setTimeout(() => container.classList.remove('is-updated'), 700);
        if (discountParticipationDraft && document.getElementById('discount-participation-modal')?.classList.contains('active')) {
            renderDiscountAllocationSections();
        }
    } catch (err) {
        console.error('LBMA price fetch failed:', err);
        if (!lastLbmaQuote) {
            lastLbmaQuote = {
                usd: LBMA_FALLBACK_QUOTE.usd,
                updatedAt: new Date()
            };
        }
        if (lastLbmaQuote) {
            const fxRate = await fetchUsdToEurRate();
            const unit = getLbmaUnit();
            renderLbmaValues(valuesEl, lastLbmaQuote.usd, unit, fxRate);
            if (timeEl) {
                timeEl.textContent = `Stand: ${lastLbmaQuote.updatedAt.toLocaleString('de-DE')} (Fallback)`;
            }
            if (discountParticipationDraft && document.getElementById('discount-participation-modal')?.classList.contains('active')) {
                renderDiscountAllocationSections();
            }
        } else {
            valuesEl.textContent = '—';
            if (timeEl) timeEl.textContent = 'Stand: —';
        }
        container.classList.remove('is-updating');
    }
    if (!lbmaRefreshTimer) {
        lbmaRefreshTimer = window.setInterval(() => {
            updateLbmaPriceDisplay();
        }, 60000);
    }
}

// Load demo data
async function loadDemoData() {
    console.log('loadDemoData called');
    // Demo deals
    allDeals = [
        {
            id: 'demo-1',
            deal_no: 'G-0001',
            country: 'Ghana',
            route: 'Accra → Frankfurt → Pforzheim',
            commodity_type: 'Doré',
            hallmark_age_bucket: null,
            seller_name: 'Foge',
            offer_terms: '50 kg/mo (M1-3) -> 100 kg/mo (M4-36), term 36 mo',
            lbma_discount_pct: 12,
            discount_participation: getDefaultDiscountParticipation(),
            status: 'In Progress',
            created_at: new Date().toISOString(),
            progress: 45,
            started_progress: 70
        },
        {
            id: 'demo-2',
            deal_no: 'G-0002',
            country: 'Südafrika',
            route: 'Johannesburg → Frankfurt → Pforzheim',
            commodity_type: 'Hallmark',
            hallmark_age_bucket: '<=5 Jahre',
            seller_name: 'Aurum',
            offer_terms: '50 kg/mo (M1-3) -> 100 kg/mo (M4-36), term 36 mo',
            lbma_discount_pct: 0,
            discount_participation: getDefaultDiscountParticipation(),
            status: 'Draft',
            created_at: new Date(Date.now() - 86400000).toISOString(),
            progress: 10,
            started_progress: 20
        },
        {
            id: 'demo-3',
            deal_no: 'G-0003',
            country: 'Kenia',
            route: 'Nairobi → Frankfurt → Pforzheim',
            commodity_type: 'Hallmark',
            hallmark_age_bucket: '>5 Jahre',
            seller_name: 'Kona',
            offer_terms: '50 kg/mo (M1-3) -> 100 kg/mo (M4-36), term 36 mo',
            lbma_discount_pct: 12,
            discount_participation: getDefaultDiscountParticipation(),
            status: 'Completed',
            created_at: new Date(Date.now() - 172800000).toISOString(),
            progress: 100,
            started_progress: 100
        }
    ];
    seedCountryDefaultsFromDeals(allDeals);
    updateCountrySuggestionList();
    renderDeals(allDeals);
    refreshGrcPlanningDealOptions();
}

// Setup click handlers for deal cards - direct approach with event delegation
let dealCardClickHandler = null;

function setupDealCardClickHandlers() {
    const container = document.getElementById('deals-list');
    if (!container) {
        console.error('deals-list container not found in setupDealCardClickHandlers');
        return;
    }
    
    // Remove existing handler if any
    if (dealCardClickHandler) {
        container.removeEventListener('click', dealCardClickHandler);
    }
    
    // Create new handler
    dealCardClickHandler = function(e) {
        // Find the closest deal-card parent
        let target = e.target;
        let dealCard = null;
        
        // Walk up the DOM tree to find .deal-card
        while (target && target !== container && target !== document.body) {
            if (target.classList && target.classList.contains('deal-card')) {
                dealCard = target;
                break;
            }
            target = target.parentElement;
        }
        
        if (dealCard) {
            if (e.target.closest('.deal-status-select')) {
                return;
            }
            e.preventDefault();
            e.stopPropagation();
            const dealId = dealCard.getAttribute('data-deal-id');
            console.log('=== DEAL CARD CLICKED ===');
            console.log('Deal ID:', dealId);
            console.log('Deal Card Element:', dealCard);
            console.log('Click target:', e.target);
            
            if (dealId) {
                console.log('Calling loadDealDetail with:', dealId);
                loadDealDetail(dealId);
            } else {
                console.error('No deal ID found on card:', dealCard);
                console.error('Card attributes:', Array.from(dealCard.attributes).map(a => `${a.name}="${a.value}"`).join(', '));
            }
        } else {
            console.log('Click was not on a deal card, target:', e.target);
        }
    };
    
    // Add event listener
    container.addEventListener('click', dealCardClickHandler, true); // Use capture phase
    
    console.log('Deal card click handlers setup complete on container:', container);
    console.log('Number of deal cards in container:', container.querySelectorAll('.deal-card').length);
}

function formatSellerName(fullName) {
    const name = (fullName || '').trim();
    if (!name) return '-';
    const lower = name.toLowerCase();
    let honorific = 'Mr.';
    if (/\b(frau|mrs|ms|miss)\b/.test(lower)) {
        honorific = 'Mrs.';
    } else if (/\b(herr|mr)\b/.test(lower)) {
        honorific = 'Mr.';
    }
    const parts = name.split(/\s+/);
    const lastName = parts[parts.length - 1];
    return `${honorific} ${lastName}`;
}

function getDefaultDiscountParticipation() {
    return {
        grossDiscountPercent: 12.0,
        goldAmountKg: 0,
        currency: 'EUR',
        commodityValue: null,
        commodityLabel: null,
        allocations: {
            netToBuyer: [
                { id: 'C1', label: 'Investor / Vorfinanzierer (effektiver Buyer)', percent: 4.5, enabled: true },
                { id: 'C2', label: 'Buyer / Offtaker (falls getrennt vom Investor)', percent: 0.0, enabled: false }
            ],
            buyerSide: [
                { id: 'B1', label: 'Intermediary Buyer-Side – Lead / Mandate Holder', percent: 0.0, enabled: false },
                { id: 'B2', label: 'Intermediary Buyer-Side – Co-Broker 1', percent: 0.0, enabled: false },
                { id: 'B3', label: 'Intermediary Buyer-Side – Co-Broker 2', percent: 0.0, enabled: false },
                { id: 'B4', label: 'Koras PMR GmbH (Buyer-Side-Commission)', percent: 4.5, enabled: true },
                { id: 'B5', label: 'IMP AG (Dr. Axel Eckart)', percent: 1.05, enabled: true },
                { id: 'B6', label: 'Foge + Wolf', percent: 0.75, enabled: true },
                { id: 'B7', label: 'Affiliated Partner (z. B. Banking/SBLC/Block-Funds Organisator)', percent: 0.0, enabled: false },
                { id: 'B8', label: 'Paymaster-Entity (falls getrennt von IMP)', percent: 0.0, enabled: false }
            ],
            sellerSide: [
                { id: 'S1', label: 'Intermediary Seller-Side – Lead / Mandate Holder', percent: 0.5, enabled: true },
                { id: 'S2', label: 'Intermediary Seller-Side – Co-Broker 1', percent: 0.25, enabled: true },
                { id: 'S3', label: 'Intermediary Seller-Side – Co-Broker 2', percent: 0.25, enabled: true },
                { id: 'S4', label: 'Intermediary Seller-Side – Local Facilitator / Country Rep', percent: 0.0, enabled: false },
                { id: 'S5', label: 'Seller’s Assignee(s) (falls provisionsberechtigt)', percent: 0.0, enabled: false }
            ],
            service: [
                { id: 'X1', label: 'Importbeauftragter (Service)', percent: 0.2, enabled: true }
            ]
        },
        providers: [
            { id: 'P1', name: 'Brinks (Security Logistics ab Afrika)', amountEUR: 0, costBearer: 'Representative', vatIncluded: false },
            { id: 'P2', name: 'Zollagent / Customs Broker (ab Afrika)', amountEUR: 0, costBearer: 'Representative', vatIncluded: false },
            { id: 'P3', name: 'Versicherung (ab Afrika)', amountEUR: 0, costBearer: 'Buyer', vatIncluded: false },
            { id: 'P4', name: 'Air Freight / Carrier (ab Afrika)', amountEUR: 0, costBearer: 'Seller', vatIncluded: false },
            { id: 'P5', name: 'FRA Handling / Lager (an Deutschland)', amountEUR: 0, costBearer: 'Representative', vatIncluded: true },
            { id: 'P6', name: 'FRA Sichtprüfung (an Deutschland)', amountEUR: 0, costBearer: 'Representative', vatIncluded: true },
            { id: 'P7', name: 'Versicherung (an Deutschland)', amountEUR: 0, costBearer: 'Buyer', vatIncluded: true },
            { id: 'P8', name: 'Brinks (FRA -> Koras PMR)', amountEUR: 0, costBearer: 'Representative', vatIncluded: true },
            { id: 'P9', name: '1st Fire Assay (Koras PMR, Pforzheim)', amountEUR: 0, costBearer: 'Representative', vatIncluded: true },
            { id: 'P10', name: 'Brinks 2nd Assay (Security Logistics)', amountEUR: 0, costBearer: 'Representative', vatIncluded: true },
            { id: 'P11', name: '2nd Fire Assay Provider (tba)', amountEUR: 0, costBearer: 'Representative', vatIncluded: true },
            { id: 'P12', name: 'Brinks (2nd Fire Assay -> Koras)', amountEUR: 0, costBearer: 'Representative', vatIncluded: true },
            { id: 'P13', name: 'Sonstige Kosten', amountEUR: 0, costBearer: 'Seller', vatIncluded: true }
        ]
    };
}

function normalizeDiscountParticipation(participation) {
    const defaults = getDefaultDiscountParticipation();
    if (!participation || typeof participation !== 'object') {
        return defaults;
    }
    const normalizeGroup = (defaultGroup, storedGroup) => {
        const stored = Array.isArray(storedGroup) ? storedGroup : [];
        const storedMap = new Map(stored.map(item => [item.id, item]));
        const merged = defaultGroup.map(item => {
            const override = storedMap.get(item.id);
            return {
                ...item,
                ...override,
                percent: Number(override?.percent ?? item.percent) || 0,
                enabled: Boolean(override?.enabled ?? item.enabled)
            };
        });
        stored.forEach(item => {
            if (!storedMap.has(item.id)) {
                merged.push({
                    ...item,
                    percent: Number(item.percent) || 0,
                    enabled: Boolean(item.enabled)
                });
            }
        });
        return merged;
    };

    const storedAlloc = participation.allocations || {};
    const storedProviders = Array.isArray(participation.providers) ? participation.providers : [];
    const providerMap = new Map(storedProviders.map(item => [item.id, item]));
    const mergedProviders = defaults.providers.map(item => {
        const override = providerMap.get(item.id);
        return {
            ...item,
            amountEUR: Number(override?.amountEUR ?? item.amountEUR) || 0,
            costBearer: override?.costBearer || item.costBearer,
            vatIncluded: override?.vatIncluded ?? item.vatIncluded ?? false
        };
    });
    storedProviders.forEach(item => {
        if (!providerMap.has(item.id)) {
            mergedProviders.push({
                ...item,
                amountEUR: Number(item.amountEUR) || 0,
                costBearer: item.costBearer || 'Seller',
                vatIncluded: item.vatIncluded ?? false
            });
        }
    });

    return {
        grossDiscountPercent: Number(participation.grossDiscountPercent ?? defaults.grossDiscountPercent) || 0,
        goldAmountKg: Number(participation.goldAmountKg ?? defaults.goldAmountKg) || 0,
        commodityValue: participation.commodityValue ?? defaults.commodityValue,
        commodityLabel: participation.commodityLabel ?? defaults.commodityLabel,
        currency: 'EUR',
        allocations: {
            netToBuyer: normalizeGroup(defaults.allocations.netToBuyer, storedAlloc.netToBuyer).filter(item => item.id !== 'X2'),
            buyerSide: normalizeGroup(defaults.allocations.buyerSide, storedAlloc.buyerSide).filter(item => item.id !== 'X2'),
            sellerSide: normalizeGroup(defaults.allocations.sellerSide, storedAlloc.sellerSide).filter(item => item.id !== 'X2'),
            service: normalizeGroup(defaults.allocations.service, storedAlloc.service).filter(item => item.id !== 'X2')
        },
        providers: mergedProviders
    };
}

function cloneDiscountParticipation(participation) {
    return JSON.parse(JSON.stringify(participation));
}

function formatPercentValue(value) {
    const number = Number(value) || 0;
    return number.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function formatEurValue(value) {
    return new Intl.NumberFormat('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(value);
}

function getEurPerKg() {
    if (!lastLbmaQuote || !Number.isFinite(Number(lastLbmaQuote.usd))) return null;
    if (!lastFxRate || !Number.isFinite(Number(lastFxRate.rate))) return null;
    return Number(lastLbmaQuote.usd) * 32.1507466 * Number(lastFxRate.rate);
}

function formatAllocationEurValue(goldAmountKg, eurPerKg, percent) {
    if (!eurPerKg) return '—';
    const amount = (Number(goldAmountKg) || 0) * eurPerKg * (Number(percent) || 0) / 100;
    return `€ ${formatEurValue(amount)}`;
}

function formatAmountValue(value) {
    const number = Number(value) || 0;
    return number.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function parseLocaleAmount(value) {
    if (typeof value !== 'string') return Number(value) || 0;
    const normalized = value.replace(/\./g, '').replace(',', '.').replace(/[^\d.-]/g, '');
    const parsed = Number(normalized);
    return Number.isFinite(parsed) ? parsed : 0;
}

function calculateAllocationTotals(participation) {
    const allocations = participation?.allocations || {};
    const sum = Object.values(allocations).flat().reduce((acc, item) => {
        if (!item?.enabled) return acc;
        return acc + (Number(item.percent) || 0);
    }, 0);
    const gross = Number(participation?.grossDiscountPercent) || 0;
    const remaining = gross - sum;
    return { sum, remaining };
}

function calculateProviderTotals(participation) {
    const providers = Array.isArray(participation?.providers) ? participation.providers : [];
    const VAT_RATE = 0.19; // Assumption: German VAT rate.
    const totals = providers.reduce((acc, item) => {
        const gross = Number(item.amountEUR) || 0;
        const vatIncluded = Boolean(item.vatIncluded);
        const net = vatIncluded ? gross / (1 + VAT_RATE) : gross;
        const vat = vatIncluded ? gross - net : 0;
        acc.gross += gross;
        acc.net += net;
        acc.vat += vat;
        if (item.costBearer === 'Seller') {
            acc.seller.gross += gross;
            acc.seller.net += net;
            acc.seller.vat += vat;
        }
        if (item.costBearer === 'Representative') {
            acc.representative.gross += gross;
            acc.representative.net += net;
            acc.representative.vat += vat;
        }
        if (item.costBearer === 'Buyer') {
            acc.buyer.gross += gross;
            acc.buyer.net += net;
            acc.buyer.vat += vat;
        }
        return acc;
    }, {
        gross: 0,
        net: 0,
        vat: 0,
        seller: { gross: 0, net: 0, vat: 0 },
        representative: { gross: 0, net: 0, vat: 0 },
        buyer: { gross: 0, net: 0, vat: 0 }
    });
    return totals;
}

function getDiscountParticipationForDeal(deal) {
    const stored = deal?.discount_participation;
    if (stored) {
        const normalized = normalizeDiscountParticipation(stored);
        if (Number.isFinite(Number(deal?.lbma_discount_pct))) {
            normalized.grossDiscountPercent = Number(deal.lbma_discount_pct);
        }
        return normalized;
    }
    const local = deal?.id ? localStorage.getItem(`discountParticipation:${deal.id}`) : null;
    if (local) {
        try {
            const normalized = normalizeDiscountParticipation(JSON.parse(local));
            if (Number.isFinite(Number(deal?.lbma_discount_pct))) {
                normalized.grossDiscountPercent = Number(deal.lbma_discount_pct);
            }
            return normalized;
        } catch (err) {
            console.error('Error parsing local discount participation:', err);
        }
    }
    const fallback = normalizeDiscountParticipation(null);
    if (Number.isFinite(Number(deal?.lbma_discount_pct))) {
        fallback.grossDiscountPercent = Number(deal.lbma_discount_pct);
    }
    return fallback;
}

function renderDiscountParticipationModal() {
    if (!discountParticipationDraft) return;
    const grossInput = document.getElementById('dpt-gross-input');
    if (grossInput) {
        grossInput.value = Number(discountParticipationDraft.grossDiscountPercent || 0).toFixed(2);
    }
    const goldInput = document.getElementById('dpt-gold-kg-input');
    if (goldInput) {
        goldInput.value = Number(discountParticipationDraft.goldAmountKg || 0).toFixed(2);
    }
    renderDiscountAllocationSections();
    renderProviderTable();
    renderDiscountParticipationSummary();
}

function renderDiscountAllocationSections() {
    const activeContainer = document.getElementById('dpt-active-allocations');
    const placeholderContainer = document.getElementById('dpt-placeholder-allocations');
    if (!activeContainer || !placeholderContainer || !discountParticipationDraft) return;
    const eurPerKg = getEurPerKg();
    const goldAmountKg = Number(discountParticipationDraft.goldAmountKg) || 0;

    const groups = [
        { key: 'netToBuyer', title: 'Net to Buyer' },
        { key: 'buyerSide', title: 'Buyer-Side' },
        { key: 'sellerSide', title: 'Seller-Side' },
        { key: 'service', title: 'Service' }
    ];

    const renderGroup = (items, group) => {
        if (!items.length) {
            return `<div class="text-secondary">Keine Positionen</div>`;
        }
        const rows = items.map(item => `
            <tr>
                <td class="dpt-checkbox-cell">
                    <input type="checkbox" class="dpt-enabled" data-group="${group.key}" data-id="${item.id}" ${item.enabled ? 'checked' : ''}>
                </td>
                <td>${escapeHtml(item.label)}</td>
                <td class="dpt-percent-cell">
                    <input type="number" class="dpt-percent" data-group="${group.key}" data-id="${item.id}" min="0" max="100" step="0.01" value="${Number(item.percent || 0).toFixed(2)}" ${item.enabled ? '' : 'disabled'}>
                </td>
                <td class="dpt-usd-cell">${formatAllocationEurValue(goldAmountKg, eurPerKg, Number(item.percent || 0))}</td>
            </tr>
        `).join('');
        return `
            <div class="dpt-group">
                <h5>${group.title}</h5>
                <table class="dpt-table dpt-allocation-table">
                    <thead>
                        <tr>
                            <th class="dpt-checkbox-cell">Aktiv</th>
                            <th>Position</th>
                            <th>%</th>
                            <th>EUR Anteil</th>
                        </tr>
                    </thead>
                    <tbody>${rows}</tbody>
                </table>
            </div>
        `;
    };

    const activeHtml = groups.map(group => {
        const items = discountParticipationDraft.allocations[group.key].filter(item => item.enabled);
        return renderGroup(items, group);
    }).join('');

    const placeholderHtml = groups.map(group => {
        const items = discountParticipationDraft.allocations[group.key].filter(item => !item.enabled);
        return renderGroup(items, group);
    }).join('');

    activeContainer.innerHTML = activeHtml;
    placeholderContainer.innerHTML = placeholderHtml;
}

function renderProviderTable() {
    const container = document.getElementById('dpt-providers');
    if (!container || !discountParticipationDraft) return;
    const VAT_RATE = 0.19; // Assumption: German VAT rate.
    const defaultOrder = getDefaultDiscountParticipation().providers.map(item => item.id);
    const orderIndex = new Map(defaultOrder.map((id, index) => [id, index]));
    const sortedProviders = [...discountParticipationDraft.providers].sort((a, b) => {
        const aIndex = orderIndex.has(a.id) ? orderIndex.get(a.id) : Number.POSITIVE_INFINITY;
        const bIndex = orderIndex.has(b.id) ? orderIndex.get(b.id) : Number.POSITIVE_INFINITY;
        if (aIndex !== bIndex) return aIndex - bIndex;
        return (a.name || '').localeCompare(b.name || '');
    });
    const rows = sortedProviders.map(item => `
        <tr>
            <td class="dpt-provider-name-cell">
                <input type="text" class="dpt-provider-name" data-id="${item.id}" value="${escapeHtml(item.name || '')}">
            </td>
            <td class="dpt-provider-amount-cell">
                <input type="text" class="dpt-provider-amount" data-id="${item.id}" inputmode="decimal" value="${formatAmountValue(item.amountEUR || 0)}">
            </td>
            <td class="dpt-provider-vat-cell">
                <input type="checkbox" class="dpt-provider-vat" data-id="${item.id}" ${item.vatIncluded ? 'checked' : ''}>
            </td>
            <td class="dpt-provider-net-cell">
                <span class="dpt-provider-net">${formatAmountValue(item.vatIncluded ? (Number(item.amountEUR || 0) / (1 + VAT_RATE)) : Number(item.amountEUR || 0))}</span>
            </td>
            <td>
                <div class="dpt-provider-bearer" data-id="${item.id}">
                    <label><input type="checkbox" class="dpt-provider-choice" data-id="${item.id}" data-bearer="Seller" ${item.costBearer === 'Seller' ? 'checked' : ''}> Seller</label>
                    <label><input type="checkbox" class="dpt-provider-choice" data-id="${item.id}" data-bearer="Representative" ${item.costBearer === 'Representative' ? 'checked' : ''}> Representative</label>
                    <label><input type="checkbox" class="dpt-provider-choice" data-id="${item.id}" data-bearer="Buyer" ${item.costBearer === 'Buyer' ? 'checked' : ''}> Buyer</label>
                </div>
            </td>
        </tr>
    `).join('');
    container.innerHTML = `
        <table class="dpt-table">
            <thead>
                <tr>
                    <th>Service Provider</th>
                    <th>Betrag (Brutto EUR)</th>
                    <th>MwSt (DE)</th>
                    <th>Betrag (Netto EUR)</th>
                    <th>Kostenträger</th>
                </tr>
            </thead>
            <tbody>${rows}</tbody>
        </table>
        <div class="dpt-provider-actions">
            <button type="button" id="dpt-add-provider" class="btn btn-secondary btn-sm">Weitere Sonstige hinzufügen</button>
        </div>
    `;
}

function renderDiscountParticipationSummary() {
    const summary = document.getElementById('dpt-summary');
    const providerSummary = document.getElementById('dpt-provider-summary');
    const saveBtn = document.getElementById('dpt-save-btn');
    if (!summary || !providerSummary || !discountParticipationDraft) return;

    const { sum, remaining } = calculateAllocationTotals(discountParticipationDraft);
    const normalizedRemaining = Math.abs(remaining) < 0.005 ? 0 : remaining;
    const remainingLabel = normalizedRemaining > 0
        ? `Noch ${formatPercentValue(normalizedRemaining)}% zu verteilen`
        : normalizedRemaining < 0
            ? `Überzeichnet um ${formatPercentValue(Math.abs(normalizedRemaining))}%`
            : 'Verteilung vollständig';
    const statusClass = normalizedRemaining > 0 ? 'dpt-status-warn' : (normalizedRemaining < 0 ? 'dpt-status-error' : 'dpt-status-ok');
    summary.innerHTML = `
        <div><strong>Summe verteilt:</strong> ${formatPercentValue(sum)}%</div>
        <div class="${statusClass}"><strong>Status:</strong> ${remainingLabel}</div>
    `;

    const totals = calculateProviderTotals(discountParticipationDraft);
    providerSummary.innerHTML = `
        <div class="dpt-provider-summary-grid">
            <div class="dpt-provider-summary-row dpt-provider-summary-header">
                <span></span>
                <strong>Brutto</strong>
                <strong>Netto</strong>
                <strong class="dpt-provider-vat-note">MwSt</strong>
            </div>
            <div class="dpt-provider-summary-row">
                <strong>Seller</strong>
                <span>€ ${formatAmountValue(totals.seller.gross)}</span>
                <span class="dpt-provider-net-sum">€ ${formatAmountValue(totals.seller.net)}</span>
                <span class="dpt-provider-vat-note">€ ${formatAmountValue(totals.seller.vat)}</span>
            </div>
            <div class="dpt-provider-summary-row">
                <strong>Representative</strong>
                <span>€ ${formatAmountValue(totals.representative.gross)}</span>
                <span class="dpt-provider-net-sum">€ ${formatAmountValue(totals.representative.net)}</span>
                <span class="dpt-provider-vat-note">€ ${formatAmountValue(totals.representative.vat)}</span>
            </div>
            <div class="dpt-provider-summary-row">
                <strong>Buyer</strong>
                <span>€ ${formatAmountValue(totals.buyer.gross)}</span>
                <span class="dpt-provider-net-sum">€ ${formatAmountValue(totals.buyer.net)}</span>
                <span class="dpt-provider-vat-note">€ ${formatAmountValue(totals.buyer.vat)}</span>
            </div>
            <div class="dpt-provider-summary-row dpt-provider-summary-total">
                <strong>Gesamtsumme</strong>
                <span>€ ${formatAmountValue(totals.gross)}</span>
                <span class="dpt-provider-net-sum">€ ${formatAmountValue(totals.net)}</span>
                <span class="dpt-provider-vat-note">€ ${formatAmountValue(totals.vat)}</span>
            </div>
        </div>
    `;

    if (saveBtn) {
        saveBtn.disabled = normalizedRemaining < 0;
    }
}

function updateDiscountParticipationValue(groupKey, itemId, updates) {
    const items = discountParticipationDraft?.allocations?.[groupKey];
    if (!Array.isArray(items)) return;
    const item = items.find(entry => entry.id === itemId);
    if (!item) return;
    Object.assign(item, updates);
}

function updateProviderValue(providerId, updates) {
    const providers = discountParticipationDraft?.providers;
    if (!Array.isArray(providers)) return;
    const provider = providers.find(entry => entry.id === providerId);
    if (!provider) return;
    Object.assign(provider, updates);
}

function openDiscountParticipationModal() {
    if (!currentDeal) {
        alert('Bitte wählen Sie zuerst ein Geschäft.');
        return;
    }
    discountParticipationDraft = cloneDiscountParticipation(getDiscountParticipationForDeal(currentDeal));
    renderDiscountParticipationModal();
    openModal('discount-participation-modal');
}

async function saveDiscountParticipation() {
    if (!discountParticipationDraft || !currentDeal) return;
    const { remaining } = calculateAllocationTotals(discountParticipationDraft);
    const normalizedRemaining = Math.abs(remaining) < 0.005 ? 0 : remaining;
    if (normalizedRemaining < 0) {
        alert(`Überzeichnet um ${formatPercentValue(Math.abs(normalizedRemaining))}%. Bitte korrigieren.`);
        return;
    }

    const payload = cloneDiscountParticipation(discountParticipationDraft);
    if (demoMode || window.demoMode || !supabase) {
        currentDeal.discount_participation = payload;
        const dealIndex = allDeals.findIndex(item => item.id === currentDeal.id);
        if (dealIndex >= 0) {
            allDeals[dealIndex].discount_participation = payload;
        }
        if (currentDeal.id) {
            localStorage.setItem(`discountParticipation:${currentDeal.id}`, JSON.stringify(payload));
        }
        closeModal('discount-participation-modal');
        return;
    }

    showLoading(true);
    const { error } = await supabase
        .from('deals')
        .update({
            discount_participation: payload,
            updated_at: new Date().toISOString()
        })
        .eq('id', currentDeal.id);
    showLoading(false);
    if (error) {
        console.error('Error saving discount participation:', error);
        // Fallback to local persistence if the DB column is missing or blocked.
        if (currentDeal.id) {
            localStorage.setItem(`discountParticipation:${currentDeal.id}`, JSON.stringify(payload));
        }
        currentDeal.discount_participation = payload;
        closeModal('discount-participation-modal');
        return;
    }
    currentDeal.discount_participation = payload;
    closeModal('discount-participation-modal');
}

async function fetchSellerMapForDeals(deals) {
    if (!supabase || !Array.isArray(deals) || deals.length === 0) {
        return {};
    }
    const dealIds = deals.map(deal => deal.id).filter(Boolean);
    if (dealIds.length === 0) {
        return {};
    }
    const { data, error } = await supabase
        .from('deal_contacts')
        .select('deal_id, contact:contacts(full_name, company)')
        .eq('role', 'Seller')
        .in('deal_id', dealIds);
    if (error) {
        console.error('Error loading seller contacts:', error);
        return {};
    }
    return (data || []).reduce((acc, row) => {
        if (acc[row.deal_id]) return acc;
        const name = row.contact?.full_name || '';
        const display = formatSellerName(name);
        acc[row.deal_id] = display || '-';
        return acc;
    }, {});
}

function renderDeals(deals) {
    const container = document.getElementById('deals-list');
    
    if (!container) {
        console.error('deals-list container not found!');
        return;
    }
    
    if (deals.length === 0) {
        container.innerHTML = '<div class="empty-state"><i class="ti ti-inbox"></i><p>Keine Geschäfte gefunden</p></div>';
        return;
    }
    
    // In demo mode, deals already have progress calculated
    if (demoMode || window.demoMode) {
        console.log('Rendering demo deals:', deals.length);
        console.log('Container exists:', !!container);
        
        const html = deals.map(deal => `
            <div class="deal-card" data-deal-id="${deal.id}">
                <div class="deal-card-header">
                    <h3>${deal.deal_no}</h3>
                    <div class="deal-status-control">
                        <span class="badge badge-${getDealStatusClass(deal.status)}">${deal.status}</span>
                        ${renderDealStatusSelect(deal)}
                    </div>
                </div>
                <div class="deal-info">
                    <p><strong>Land:</strong> ${deal.country}</p>
                    <p><strong>Ware:</strong> ${getDealCommodityDisplay(deal)}</p>
                    <p><strong>Angebot:</strong> ${deal.offer_terms || '-'}</p>
                    <p><strong>Seller:</strong> ${formatSellerName(deal.seller_name)}</p>
                    <p><strong>LBMA disc. %:</strong> <span class="${getDiscountClass(deal.lbma_discount_pct)}">${formatDiscount(deal.lbma_discount_pct)}</span></p>
                </div>
                <div class="deal-progress deal-progress-multi">
                    <div class="progress-item">
                        <div class="progress-label">Begonnen</div>
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: ${deal.started_progress || 0}%"></div>
                        </div>
                        <div class="progress-text">${deal.started_progress || 0}% begonnen</div>
                    </div>
                    <div class="progress-item">
                        <div class="progress-label">Abgeschlossen</div>
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: ${deal.progress || 0}%"></div>
                        </div>
                        <div class="progress-text">${deal.progress || 0}% abgeschlossen</div>
                    </div>
                </div>
            </div>
        `).join('');
        
        container.innerHTML = html;
        attachDealStatusSelectHandlers(container);
        console.log('Demo deals HTML rendered, container content length:', container.innerHTML.length);
        console.log('Number of deal cards:', container.querySelectorAll('.deal-card').length);
        
        // Setup event delegation AFTER content is rendered
        setTimeout(() => {
            setupDealCardClickHandlers();
        }, 100);
        return;
    }
    
    // Calculate progress for each deal (only for real deals, not demo)
    if (!supabase) {
        // No supabase, just render without progress calculation
        container.innerHTML = deals.map(deal => `
            <div class="deal-card" data-deal-id="${deal.id}">
                <div class="deal-card-header">
                    <h3>${deal.deal_no}</h3>
                    <div class="deal-status-control">
                        <span class="badge badge-${getDealStatusClass(deal.status)}">${deal.status}</span>
                        ${renderDealStatusSelect(deal)}
                    </div>
                </div>
                <div class="deal-info">
                    <p><strong>Land:</strong> ${deal.country}</p>
                    <p><strong>Ware:</strong> ${getDealCommodityDisplay(deal)}</p>
                    <p><strong>Angebot:</strong> ${deal.offer_terms || '-'}</p>
                    <p><strong>Seller:</strong> ${formatSellerName(deal.seller_name)}</p>
                    <p><strong>LBMA disc. %:</strong> <span class="${getDiscountClass(deal.lbma_discount_pct)}">${formatDiscount(deal.lbma_discount_pct)}</span></p>
                </div>
                <div class="deal-progress deal-progress-multi">
                    <div class="progress-item">
                        <div class="progress-label">Begonnen</div>
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: 0%"></div>
                        </div>
                        <div class="progress-text">0% begonnen</div>
                    </div>
                    <div class="progress-item">
                        <div class="progress-label">Abgeschlossen</div>
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: 0%"></div>
                        </div>
                        <div class="progress-text">0% abgeschlossen</div>
                    </div>
                </div>
            </div>
        `).join('');
        
        attachDealStatusSelectHandlers(container);
        
        // Setup event delegation AFTER content is rendered
        setTimeout(() => {
            setupDealCardClickHandlers();
        }, 100);
        return;
    }
    
    // For real deals, calculate progress from database
    const dealsWithProgress = deals.map(async (deal) => {
        try {
            const { data: steps } = await supabase
                .from('deal_steps')
                .select('status')
                .eq('deal_id', deal.id);
            
            const totalSteps = steps?.length || 0;
            const doneSteps = steps?.filter(s => s.status === 'Done' || s.status === 'Verified').length || 0;
            const progress = totalSteps > 0 ? Math.round((doneSteps / totalSteps) * 100) : 0;
            const startedSteps = steps?.filter(s => ['In Progress', 'Done', 'Verified', 'Blocked'].includes(s.status)).length || 0;
            const startedProgress = totalSteps > 0 ? Math.round((startedSteps / totalSteps) * 100) : 0;
            
            return { ...deal, progress, started_progress: startedProgress };
        } catch (err) {
            console.error('Error loading steps for deal:', deal.id, err);
            return { ...deal, progress: 0, started_progress: 0 };
        }
    });
    
    const sellerMapPromise = fetchSellerMapForDeals(deals);

    Promise.all([Promise.all(dealsWithProgress), sellerMapPromise]).then(([dealsWithProgress, sellerMap]) => {
        container.innerHTML = dealsWithProgress.map(deal => `
            <div class="deal-card" data-deal-id="${deal.id}">
                <div class="deal-card-header">
                    <h3>${deal.deal_no}</h3>
                    <div class="deal-status-control">
                        <span class="badge badge-${getDealStatusClass(deal.status)}">${deal.status}</span>
                        ${renderDealStatusSelect(deal)}
                    </div>
                </div>
                <div class="deal-info">
                    <p><strong>Land:</strong> ${deal.country}</p>
                    <p><strong>Ware:</strong> ${getDealCommodityDisplay(deal)}</p>
                    <p><strong>Angebot:</strong> ${deal.offer_terms || '-'}</p>
                    <p><strong>Seller:</strong> ${sellerMap[deal.id] || '-'}</p>
                    <p><strong>LBMA disc. %:</strong> <span class="${getDiscountClass(deal.lbma_discount_pct)}">${formatDiscount(deal.lbma_discount_pct)}</span></p>
                </div>
                <div class="deal-progress deal-progress-multi">
                    <div class="progress-item">
                        <div class="progress-label">Begonnen</div>
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: ${deal.started_progress}%"></div>
                        </div>
                        <div class="progress-text">${deal.started_progress}% begonnen</div>
                    </div>
                    <div class="progress-item">
                        <div class="progress-label">Abgeschlossen</div>
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: ${deal.progress}%"></div>
                        </div>
                        <div class="progress-text">${deal.progress}% abgeschlossen</div>
                    </div>
                </div>
            </div>
        `).join('');
        
        attachDealStatusSelectHandlers(container);
        
        // Setup event delegation AFTER content is rendered
        setTimeout(() => {
            setupDealCardClickHandlers();
        }, 100);
    }).catch(err => {
        console.error('Error rendering deals with progress:', err);
        // Fallback: render without progress
        container.innerHTML = deals.map(deal => `
            <div class="deal-card" data-deal-id="${deal.id}">
                <div class="deal-card-header">
                    <h3>${deal.deal_no}</h3>
                    <span class="badge badge-${getDealStatusClass(deal.status)}">${deal.status}</span>
                </div>
                <div class="deal-info">
                    <p><strong>Land:</strong> ${deal.country}</p>
                    <p><strong>Ware:</strong> ${getDealCommodityDisplay(deal)}</p>
                    <p><strong>Seller:</strong> ${formatSellerName(deal.seller_name)}</p>
                </div>
                <div class="deal-progress deal-progress-multi">
                    <div class="progress-item">
                        <div class="progress-label">Begonnen</div>
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: 0%"></div>
                        </div>
                        <div class="progress-text">0% begonnen</div>
                    </div>
                    <div class="progress-item">
                        <div class="progress-label">Abgeschlossen</div>
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: 0%"></div>
                        </div>
                        <div class="progress-text">0% abgeschlossen</div>
                    </div>
                </div>
            </div>
        `).join('');
        
        // Setup event delegation AFTER content is rendered
        setTimeout(() => {
            setupDealCardClickHandlers();
        }, 100);
    });
}

function filterDeals() {
    const search = document.getElementById('search-deals').value.toLowerCase();
    const statusFilter = document.getElementById('filter-status').value;
    
    let filtered = allDeals;
    
    if (search) {
        const normalized = normalizeStatusSearch(search);
        filtered = filtered.filter(deal => 
            deal.deal_no.toLowerCase().includes(search) ||
            deal.country.toLowerCase().includes(search) ||
            getDealCommodityLabel(deal).toLowerCase().includes(search) ||
            deal.status.toLowerCase().includes(search) ||
            (normalized && deal.status.toLowerCase().includes(normalized))
        );
    }
    
    if (statusFilter) {
        filtered = filtered.filter(deal => deal.status === statusFilter);
    }
    
    renderDeals(filtered);
}

function normalizeStatusSearch(search) {
    const aliases = {
        abgebrochen: 'aborted',
        abbruch: 'aborted',
        storniert: 'cancelled',
        annulliert: 'cancelled',
        abgesagt: 'cancelled',
        abgeschlossen: 'completed',
        fertig: 'completed',
        pausiert: 'on hold',
        wartend: 'on hold',
        entwurf: 'draft',
        inbearbeitung: 'in progress',
        laufend: 'in progress'
    };
    
    return aliases[search.replace(/\s+/g, '')] || aliases[search] || '';
}

function showDashboard() {
    activeView = 'dashboard';
    activeDealId = null;
    document.getElementById('dashboard-view').classList.add('active');
    document.getElementById('deal-detail-view').classList.remove('active');
    loadDashboard();
}

// ============================================
// Deal Detail
// ============================================
async function loadDealDetail(dealId) {
    console.log('loadDealDetail called with dealId:', dealId);
    showLoading(true);
    activeView = 'deal-detail';
    activeDealId = dealId;
    
    try {
        if (demoMode || window.demoMode) {
            console.log('Loading demo deal detail:', dealId);
            await loadDemoDealDetail(dealId);
            showLoading(false);
            return;
        }
        
        if (!supabase) {
            console.error('Supabase client not available');
            showLoading(false);
            alert('Fehler: Supabase-Verbindung nicht verfügbar');
            return;
        }
        
        // Load deal
        const { data: deal, error: dealError } = await supabase
            .from('deals')
            .select('*')
            .eq('id', dealId)
            .is('deleted_at', null)
            .single();
        
        if (dealError) {
            console.error('Error loading deal:', dealError);
            alert('Fehler beim Laden des Geschäfts: ' + dealError.message);
            showLoading(false);
            return;
        }
        
        if (!deal) {
            console.error('Deal not found:', dealId);
            alert('Geschäft nicht gefunden');
            showLoading(false);
            return;
        }
        
        currentDeal = deal;
        window.currentDeal = deal; // Make available globally
        
        // Load steps
        const { data: steps, error: stepsError } = await supabase
            .from('deal_steps')
            .select('*')
            .eq('deal_id', dealId)
            .order('step_no', { ascending: true });
        
        if (stepsError) {
            console.error('Error loading steps:', stepsError);
            currentDealSteps = [];
        } else {
            currentDealSteps = steps || [];
        }
        
        // Render deal info
        renderDealInfo(deal);
        
        // Render process steps
        renderProcessSteps(currentDealSteps);
        
        // Load other data
        await loadDealDocuments(dealId);
        await loadDealContacts(dealId);
        await loadDealKyc(dealId);
        await loadDealRisks(dealId);
        await loadDealAudit(dealId);
        
        // Show detail view - ensure views are properly switched
        const dashboardView = document.getElementById('dashboard-view');
        const dealDetailView = document.getElementById('deal-detail-view');
        
        console.log('Switching views - dashboardView:', dashboardView, 'dealDetailView:', dealDetailView);
        
        if (activeView !== 'deal-detail' || activeDealId !== dealId) {
            showLoading(false);
            return;
        }
        
        if (dashboardView) {
            dashboardView.classList.remove('active');
            console.log('Dashboard view deactivated');
        }
        if (dealDetailView) {
            dealDetailView.classList.add('active');
            console.log('Deal detail view activated');
        }
        
        // Force a reflow to ensure CSS changes are applied
        void dealDetailView?.offsetHeight;
        // Ensure detail view starts at top
        dealDetailView?.scrollTo({ top: 0, left: 0, behavior: 'auto' });
        window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
        
        showLoading(false);
        console.log('loadDealDetail completed successfully');
    } catch (error) {
        console.error('Unexpected error in loadDealDetail:', error);
        alert('Unerwarteter Fehler beim Laden des Geschäfts: ' + error.message);
        showLoading(false);
    }
}

// Load demo deal detail
async function loadDemoDealDetail(dealId) {
    const deal = allDeals.find(d => d.id === dealId);
    if (!deal) return;
    
    currentDeal = deal;
    window.currentDeal = deal;
    document.getElementById('deal-detail-view')?.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    
    // Create demo steps based on commodity type
    currentDealSteps = [];
    const baseSteps = [
        { step_no: 1, title: 'Kontaktanbahnung Seller/Intermediaries', status: 'Done', responsible_role: 'Koras', due_date: null },
        { step_no: 2, title: 'Buyer-Placement', status: 'Done', responsible_role: 'Koras', due_date: null },
        { step_no: 3, title: 'KYC/AML/Sanktions-/Embargoprüfung', status: 'Done', responsible_role: 'Koras', due_date: null },
        { step_no: 4, title: 'Chain-of-Custody Dokumentation', status: 'Done', responsible_role: 'Koras', due_date: null },
        { step_no: 5, title: 'SPA-Erstellung/Signatur', status: 'Done', responsible_role: 'Koras', due_date: null },
        { step_no: 6, title: 'Re-Identifizierung (nur bei Hallmark >5 Jahre)', status: deal.commodity_type === 'Hallmark' && deal.hallmark_age_bucket === '>5 Jahre' ? 'Open' : 'Done', responsible_role: 'Assay', due_date: null },
        { step_no: 7, title: 'Vorab-Dokumente 72h vor Versand', status: deal.status === 'Completed' ? 'Done' : 'Open', responsible_role: 'Seller', due_date: null },
        { step_no: 8, title: 'Lufttransport (versichert, Zollversiegelung)', status: deal.status === 'Completed' ? 'Done' : 'Open', responsible_role: 'Logistics', due_date: null },
        { step_no: 9, title: 'Zollbereich Frankfurt/Main: Vorprüfung', status: 'Open', responsible_role: 'Customs', due_date: null },
        { step_no: 10, title: 'Sicherheitslogistik', status: 'Open', responsible_role: 'Logistics', due_date: null },
        { step_no: 11, title: 'Ankunft Pforzheim: Annahmebestätigung', status: 'Open', responsible_role: 'Koras', due_date: null },
        { step_no: 12, title: 'Fire Assay + optional Second Assay', status: 'Open', responsible_role: 'Assay', due_date: null },
        { step_no: 13, title: 'Verbindlicher Assay Report', status: 'Open', responsible_role: 'Assay', due_date: null },
        { step_no: 14, title: 'Preisfestlegung (LBMA Fixing Bezug)', status: 'Open', responsible_role: 'Koras', due_date: null },
        { step_no: 15, title: 'Zahlung innerhalb vertraglicher Frist', status: 'Open', responsible_role: 'Koras', due_date: null },
        { step_no: 16, title: 'Ownership Transfer', status: 'Open', responsible_role: 'Koras', due_date: null },
        { step_no: 17, title: 'Raffination zu 999,9', status: 'Open', responsible_role: 'Koras', due_date: null },
        { step_no: 18, title: 'Lagerung/Abholung Buyer', status: 'Open', responsible_role: 'Koras', due_date: null },
        { step_no: 19, title: 'Abschlussdokumentation', status: 'Open', responsible_role: 'Koras', due_date: null }
    ];
    
    // Filter out Re-Identifizierung if not needed
    if (deal.commodity_type === 'Doré' || (deal.commodity_type === 'Hallmark' && deal.hallmark_age_bucket === '<=5 Jahre')) {
        currentDealSteps = baseSteps.filter(s => s.step_no !== 6).map((s, idx) => ({ ...s, step_no: idx + 1 }));
    } else {
        currentDealSteps = baseSteps;
    }
    
    // Update step numbers for filtered steps
    currentDealSteps = currentDealSteps.map((s, idx) => ({ ...s, step_no: idx + 1 }));
    
    // Add descriptions
    currentDealSteps = currentDealSteps.map(step => ({
        ...step,
        description: `Beschreibung für Schritt ${step.step_no}: ${step.title}`,
        risk_notes: 'Beispiel-Risiko-Hinweis',
        documents_required: true,
        documents_json: ['Beispiel-Dokument 1', 'Beispiel-Dokument 2'],
        due_date: step.due_date || null
    }));
    
    renderDealInfo(deal);
    renderProcessSteps(currentDealSteps);
    
    // Load empty demo data for other tabs
    allDocuments = [];
    allRisks = [];
    renderDocuments([]);
    renderRisks([]);
    renderAudit([]);
    await loadDealKyc(dealId);
    
    // Show detail view - ensure views are properly switched
    const dashboardView = document.getElementById('dashboard-view');
    const dealDetailView = document.getElementById('deal-detail-view');
    
    console.log('Demo: Switching views - dashboardView:', dashboardView, 'dealDetailView:', dealDetailView);
    
    if (dashboardView) {
        dashboardView.classList.remove('active');
        console.log('Demo: Dashboard view deactivated');
    }
    if (dealDetailView) {
        dealDetailView.classList.add('active');
        console.log('Demo: Deal detail view activated');
    }
    
    // Force a reflow to ensure CSS changes are applied
    void dealDetailView?.offsetHeight;
    
    console.log('loadDemoDealDetail completed successfully');
}

function renderDealInfo(deal) {
    document.getElementById('deal-title').textContent = deal.deal_no;
    
    const content = document.getElementById('deal-info-content');
    content.innerHTML = `
        <div class="deal-info-grid">
            <div class="info-item">
                <span class="info-label">Geschäftsnummer</span>
                <span class="info-value">${deal.deal_no}</span>
            </div>
            <div class="info-item">
                <span class="info-label">Status</span>
                <span class="info-value">
                    <span class="badge badge-${getDealStatusClass(deal.status)}">${deal.status}</span>
                </span>
            </div>
            <div class="info-item">
                <span class="info-label">Land</span>
                <span class="info-value">${deal.country}</span>
            </div>
            <div class="info-item">
                <span class="info-label">Route</span>
                <span class="info-value">${deal.route || '-'}</span>
            </div>
            <div class="info-item">
                <span class="info-label">Ware</span>
                <span class="info-value">${getDealCommodityDisplay(deal)}</span>
            </div>
            <div class="info-item">
                <span class="info-label">Angebot</span>
                <span class="info-value">${deal.offer_terms || '-'}</span>
            </div>
            <div class="info-item">
                <span class="info-label">Seller</span>
                <span class="info-value" id="deal-seller-value">${formatSellerName(deal.seller_name || '')}</span>
            </div>
            <div class="info-item">
                <span class="info-label">LBMA disc. %</span>
                <span class="info-value ${getDiscountClass(deal.lbma_discount_pct)}">${formatDiscount(deal.lbma_discount_pct)}</span>
            </div>
            <div class="info-item">
                <span class="info-label">Erstellt</span>
                <span class="info-value">${new Date(deal.created_at).toLocaleDateString('de-DE')}</span>
            </div>
        </div>
    `;
    
    // Set edit form values
    document.getElementById('edit-deal-status').value = deal.status;
    document.getElementById('edit-deal-country').value = deal.country;
    document.getElementById('edit-deal-route').value = deal.route || '';
    const editCommodity = document.getElementById('edit-deal-commodity');
    if (editCommodity) {
        const commodityValue = deal.discount_participation?.commodityValue || deal.commodity_type || '';
        editCommodity.value = commodityValue;
        updateEditHallmarkVisibility(editCommodity.value);
        updateCommodityHint('edit-deal-commodity', 'edit-deal-commodity-hint');
    }
    const editHallmarkAge = document.getElementById('edit-deal-hallmark-age');
    if (editHallmarkAge) {
        editHallmarkAge.value = deal.hallmark_age_bucket || '<=5 Jahre';
    }
    document.getElementById('edit-deal-offer').value = deal.offer_terms || '';
    document.getElementById('edit-deal-discount').value = Number.isFinite(Number(deal.lbma_discount_pct))
        ? Math.round(Number(deal.lbma_discount_pct))
        : 0;
    setEditSellerDisplay(null);
}

function renderProcessSteps(steps) {
    const container = document.getElementById('process-stepper');
    
    if (steps.length === 0) {
        container.innerHTML = '<div class="empty-state"><i class="ti ti-info-circle"></i><p>Keine Schritte vorhanden</p></div>';
        return;
    }
    
    container.innerHTML = steps.map(step => {
        const statusClass = getStepStatusClass(step.status);
        const itemStatusClass = step.status === 'In Progress' ? 'in-progress' : statusClass;
        const isDone = step.status === 'Done' || step.status === 'Verified';
        const isBlocked = step.status === 'Blocked';
        const blockReason = step.block_reason ? escapeHtml(step.block_reason) : '';
        const blockReasonIcon = isBlocked && blockReason
            ? `<span class="step-block-reason" title="${blockReason}"><i class="ti ti-alert-circle"></i></span>`
            : '';
        
        return `
            <div class="step-item ${itemStatusClass} ${isDone ? 'done' : ''} ${isBlocked ? 'blocked' : ''}" 
                 data-step-no="${step.step_no}" data-step-id="${step.id}">
                <div class="step-number">${step.step_no}</div>
                <div class="step-content">
                    <div class="step-title">
                        <span class="step-title-text">${step.title}</span>
                        <div class="step-attachment-block ${step.has_documents ? 'active' : ''}">
                            <span class="step-attachment" title="Dokument vorhanden">
                                <i class="ti ti-paperclip"></i>
                                <span class="step-attachment-count">${step.attachment_count ? `(${step.attachment_count})` : ''}</span>
                            </span>
                            <div class="step-attachment-names">
                                ${step.attachment_names?.length ? step.attachment_names.map(name => `<div>${name}</div>`).join('') : ''}
                            </div>
                        </div>
                    </div>
                    <div class="step-meta">
                        <span class="badge badge-${statusClass}">${step.status}</span>
                        ${renderStepStatusSelect(step)}
                        ${blockReasonIcon}
                        ${step.responsible_role ? `<span>${step.responsible_role}</span>` : ''}
                        ${step.due_date ? `<span>Fällig: ${new Date(step.due_date).toLocaleDateString('de-DE')}</span>` : ''}
                    </div>
                </div>
            </div>
        `;
    }).join('');
    
    // Add click handlers
    container.querySelectorAll('.step-item').forEach(item => {
        item.addEventListener('click', async () => {
            const stepNo = parseInt(item.dataset.stepNo);
            const step = steps.find(s => s.step_no === stepNo);
            if (step) {
                activeStepNo = stepNo;
                await showStepDetail(step);
                // Highlight active step
                container.querySelectorAll('.step-item').forEach(i => i.classList.remove('active'));
                item.classList.add('active');
            }
        });
    });

    container.querySelectorAll('.step-status-select').forEach(select => {
        select.addEventListener('click', (e) => e.stopPropagation());
        select.addEventListener('change', async (e) => {
            e.stopPropagation();
            const stepNo = parseInt(select.dataset.stepNo);
            const newStatus = select.value;
            const prevStatus = select.dataset.prevStatus || '';
            
            if (!stepNo || newStatus === prevStatus) return;
            
            if (newStatus === 'Blocked') {
                const reason = prompt('Blockierungsgrund:');
                if (reason === null) {
                    select.value = prevStatus;
                    return;
                }
                await updateStepStatus(stepNo, newStatus, reason);
            } else {
                await updateStepStatus(stepNo, newStatus);
            }
        });
    });
}

function renderStepStatusSelect(step) {
    const disabled = demoMode || window.demoMode || step.status === 'Verified' ? 'disabled' : '';
    const options = [
        'Open',
        'In Progress',
        'Done',
        'Blocked'
    ];
    const statusOptions = options.map(status => `
        <option value="${status}" ${status === step.status ? 'selected' : ''}>${status}</option>
    `).join('');
    const verifiedOption = step.status === 'Verified'
        ? `<option value="Verified" selected>Verified</option>`
        : '';
    
    return `
        <select class="step-status-select" data-step-no="${step.step_no}" data-prev-status="${step.status}" ${disabled}>
            ${statusOptions}
            ${verifiedOption}
        </select>
    `;
}

async function showStepDetail(step) {
    const panel = document.getElementById('step-detail-panel');
    activeStepNo = step.step_no;
    
    const documentsList = step.documents_json || [];
    const documentsHtml = documentsList.length > 0 
        ? documentsList.map(doc => `<li>${doc}</li>`).join('')
        : '<li>Keine Dokumente erforderlich</li>';
    
    // Check if user is admin for verify button (skip in demo mode)
    let userIsAdmin = false;
    if (!demoMode && supabase) {
        try {
            userIsAdmin = await isAdmin();
        } catch (err) {
            console.error('Error checking admin status:', err);
        }
    }
    
    const verifyButtonHtml = step.status === 'Done' && userIsAdmin ? `
        <button class="btn btn-primary" onclick="verifyStep(${step.step_no})">
            <i class="ti ti-shield-check"></i> Verifizieren
        </button>
    ` : '';
    
    panel.innerHTML = `
        <h3>Schritt ${step.step_no}: ${step.title}</h3>
        <div class="form-group">
            <label>Beschreibung</label>
            <p>${step.description || '-'}</p>
        </div>
        <div class="form-group">
            <label>Risiken</label>
            <p>${step.risk_notes || '-'}</p>
        </div>
        <div class="form-group">
            <label>Verantwortliche Rolle</label>
            <p>${step.responsible_role}</p>
        </div>
        <div class="form-group">
            <label>Status</label>
            <div class="step-status-row">
                <span class="badge badge-${getStepStatusClass(step.status)}">${step.status}</span>
                ${renderStepStatusSelect(step)}
            </div>
        </div>
        ${step.status === 'Blocked' && step.block_reason ? `
        <div class="form-group">
            <label>Blockierungsgrund</label>
            <p>${escapeHtml(step.block_reason)}</p>
        </div>
        ` : ''}
        ${step.due_date ? `
        <div class="form-group">
            <label>Fälligkeitsdatum</label>
            <p>${new Date(step.due_date).toLocaleDateString('de-DE')}</p>
        </div>
        ` : ''}
        <div class="form-group">
            <label>Erforderliche Dokumente</label>
            <ul>${documentsHtml}</ul>
        </div>
        ${step.documents_required ? `
        <div class="upload-zone" id="upload-zone-${step.step_no}">
            <i class="ti ti-upload"></i>
            <p>Dokument hochladen (Drag & Drop oder klicken)</p>
            <input type="file" id="file-input-${step.step_no}" style="display: none;" 
                   accept=".pdf,.jpg,.jpeg,.png,.docx,.xlsx" multiple>
        </div>
        ` : ''}
        <div class="step-actions">
            ${step.status !== 'Done' && step.status !== 'Verified' ? `
            <button class="btn btn-primary" onclick="markStepDone(${step.step_no})">
                <i class="ti ti-check"></i> Als erledigt markieren
            </button>
            ` : ''}
            ${verifyButtonHtml}
            ${step.status === 'Blocked' ? `
            <button class="btn btn-secondary" onclick="unblockStep(${step.step_no})">
                <i class="ti ti-lock-open"></i> Blockierung aufheben
            </button>
            ` : `
            <button class="btn btn-secondary" onclick="blockStep(${step.step_no})">
                <i class="ti ti-lock"></i> Blockieren
            </button>
            `}
        </div>
        <div id="step-documents-${step.step_no}" class="documents-list"></div>
    `;
    
    // Setup file upload
    const statusSelect = document.querySelector('#step-detail-panel .step-status-select');
    if (statusSelect) {
        statusSelect.addEventListener('change', async (e) => {
            const stepNo = parseInt(statusSelect.dataset.stepNo);
            const newStatus = statusSelect.value;
            const prevStatus = statusSelect.dataset.prevStatus || '';
            
            if (!stepNo || newStatus === prevStatus) return;
            
            if (newStatus === 'Blocked') {
                const reason = prompt('Blockierungsgrund:');
                if (reason === null) {
                    statusSelect.value = prevStatus;
                    return;
                }
                await updateStepStatus(stepNo, newStatus, reason);
            } else {
                await updateStepStatus(stepNo, newStatus);
            }
        });
    }

    if (step.documents_required) {
        const uploadZone = document.getElementById(`upload-zone-${step.step_no}`);
        const fileInput = document.getElementById(`file-input-${step.step_no}`);
        
        uploadZone.addEventListener('click', () => fileInput.click());
        uploadZone.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadZone.classList.add('dragover');
        });
        uploadZone.addEventListener('dragleave', () => {
            uploadZone.classList.remove('dragover');
        });
        uploadZone.addEventListener('drop', async (e) => {
            e.preventDefault();
            uploadZone.classList.remove('dragover');
            const files = Array.from(e.dataTransfer.files);
            await handleFileUpload(files, step.step_no);
        });
        
        fileInput.addEventListener('change', async (e) => {
            const files = Array.from(e.target.files);
            await handleFileUpload(files, step.step_no);
        });
    }
    
    // Load step documents
    loadStepDocuments(step.step_no);
}

// Make functions available globally for onclick handlers
window.markStepDone = async (stepNo) => {
    await updateStepStatus(stepNo, 'Done');
};

window.verifyStep = async (stepNo) => {
    const note = prompt('Verifikationsnotiz:');
    if (note !== null) {
        await verifyStepStatus(stepNo, note);
    }
};

window.blockStep = async (stepNo) => {
    const reason = prompt('Blockierungsgrund:');
    if (reason !== null) {
        await updateStepStatus(stepNo, 'Blocked', reason);
    }
};

window.unblockStep = async (stepNo) => {
    await updateStepStatus(stepNo, 'Open');
};

async function updateStepStatus(stepNo, status, note = null) {
    const step = currentDealSteps.find(s => s.step_no === stepNo);
    if (!step) return;
    
    const { data: { user } } = await supabase.auth.getUser();
    
    const updateData = {
        status: status,
        updated_at: new Date().toISOString()
    };
    
    if (status === 'Done') {
        updateData.done_at = new Date().toISOString();
        updateData.done_by = user?.id;
    }
    
    if (status === 'Blocked') {
        updateData.block_reason = note || null;
    } else {
        updateData.block_reason = null;
    }
    
    const { error } = await supabase
        .from('deal_steps')
        .update(updateData)
        .eq('id', step.id);
    
    if (error) {
        console.error('Error updating step:', error);
        alert(`Fehler beim Aktualisieren des Schritts: ${error.message}`);
        return;
    }
    
    await logAudit(currentDeal.id, 'UPDATE', 'deal_step', step.id, { status: step.status }, updateData);

    await ensureDealInProgress(status);
    
    // Reload deal detail
    await loadDealDetail(currentDeal.id);
    if (activeStepNo) {
        const updatedStep = currentDealSteps.find(s => s.step_no === activeStepNo);
        if (updatedStep) {
            await showStepDetail(updatedStep);
        }
    }
}

async function ensureDealInProgress(stepStatus) {
    if (!currentDeal || !supabase) return;
    
    const shouldMove = currentDeal.status === 'Draft' &&
        ['In Progress', 'Done', 'Blocked', 'Verified'].includes(stepStatus);
    
    if (!shouldMove) return;
    
    const oldDeal = { ...currentDeal };
    
    const { error } = await supabase
        .from('deals')
        .update({
            status: 'In Progress',
            updated_at: new Date().toISOString()
        })
        .eq('id', currentDeal.id);
    
    if (error) {
        console.error('Error updating deal status from step:', error);
        return;
    }
    
    currentDeal.status = 'In Progress';
    await logAudit(currentDeal.id, 'UPDATE', 'deal', currentDeal.id, { status: oldDeal.status }, { status: 'In Progress' });
}

async function verifyStepStatus(stepNo, note) {
    const step = currentDealSteps.find(s => s.step_no === stepNo);
    if (!step) return;
    
    if (!await isAdmin()) {
        alert('Nur Administratoren können Schritte verifizieren');
        return;
    }
    
    const { data: { user } } = await supabase.auth.getUser();
    
    const { error } = await supabase
        .from('deal_steps')
        .update({
            status: 'Verified',
            verified_at: new Date().toISOString(),
            verified_by: user?.id,
            verification_note: note
        })
        .eq('id', step.id);
    
    if (error) {
        console.error('Error verifying step:', error);
        alert('Fehler beim Verifizieren des Schritts');
        return;
    }
    
    await logAudit(currentDeal.id, 'VERIFY', 'deal_step', step.id, { status: step.status }, { status: 'Verified' });
    
    // Reload deal detail
    await loadDealDetail(currentDeal.id);
}

async function handleFileUpload(files, stepNo) {
    if (demoMode) {
        alert('Demo-Modus: Dateien können nicht hochgeladen werden. Bitte melden Sie sich an, um die vollständige Funktionalität zu nutzen.');
        return;
    }
    
    if (!currentDeal) {
        alert('Kein Geschäft ausgewählt');
        return;
    }
    
    showLoading(true);
    
    try {
        for (const file of files) {
            // Validate file type
            const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png', 
                                 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                                 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'];
            if (!allowedTypes.includes(file.type) && !file.name.match(/\.(pdf|jpg|jpeg|png|docx|xlsx)$/i)) {
                alert(`Datei "${file.name}" hat ein nicht unterstütztes Format. Bitte verwenden Sie PDF, JPG, PNG, DOCX oder XLSX.`);
                continue;
            }
            
            // Validate file size (max 10MB)
            if (file.size > 10 * 1024 * 1024) {
                alert(`Datei "${file.name}" ist zu groß (max. 10MB)`);
                continue;
            }
            
            const docType = file.name.split('.').pop().toUpperCase();
            await uploadDocument(currentDeal.id, currentDeal.deal_no, stepNo, file, docType);

        }
        let stepStatusUpdated = false;
        if (stepNo) {
            stepStatusUpdated = await markStepInProgress(stepNo);
        }
        if (stepStatusUpdated) {
            await loadDealDetail(currentDeal.id);
        } else {
            if (stepNo) {
                await loadStepDocuments(stepNo);
            }
            await loadDealDocuments(currentDeal.id);
        }
        
        alert('Dokument(e) erfolgreich hochgeladen');
    } catch (error) {
        console.error('Error uploading file:', error);
        alert('Fehler beim Hochladen der Datei: ' + (error.message || 'Unbekannter Fehler'));
    }
    
    showLoading(false);
}

async function markStepInProgress(stepNo) {
    if (!currentDeal || !supabase) return false;
    const step = await getStepByDealAndNo(currentDeal.id, stepNo);
    if (!step || step.status !== 'Open') return false;
    const { error } = await supabase
        .from('deal_steps')
        .update({
            status: 'In Progress',
            updated_at: new Date().toISOString()
        })
        .eq('id', step.id);
    if (error) {
        console.error('Error updating step to In Progress:', error);
        return false;
    }
    await logAudit(currentDeal.id, 'UPDATE', 'deal_step', step.id, { status: step.status }, { status: 'In Progress' });
    await ensureDealInProgress('In Progress');
    return true;
}

async function loadStepDocuments(stepNo) {
    const step = currentDealSteps.find(s => s.step_no === stepNo);
    if (!step) return;
    
    const container = document.getElementById(`step-documents-${stepNo}`);
    if (!container) return;
    
    if (demoMode || !supabase) {
        container.innerHTML = '<p class="text-secondary">Keine Dokumente vorhanden (Demo-Modus)</p>';
        return;
    }
    
    try {
        const { data: documents, error } = await supabase
            .from('documents')
            .select('*')
            .eq('deal_id', currentDeal.id)
            .eq('step_id', step.id)
            .order('uploaded_at', { ascending: false });
        
        if (error) {
            console.error('Error loading step documents:', error);
            container.innerHTML = '<p class="text-secondary">Fehler beim Laden der Dokumente</p>';
            return;
        }
        
        if (!documents || documents.length === 0) {
            container.innerHTML = '<p class="text-secondary">Keine Dokumente vorhanden</p>';
            return;
        }
        
        const sortedDocs = [...documents].sort((a, b) => {
            const noA = currentDealSteps.find(step => step.id === a.step_id)?.step_no ?? 9999;
            const noB = currentDealSteps.find(step => step.id === b.step_id)?.step_no ?? 9999;
            if (noA !== noB) return noA - noB;
            return new Date(b.uploaded_at).getTime() - new Date(a.uploaded_at).getTime();
        });
        const stepMap = (currentDealSteps || []).reduce((acc, step) => {
            acc[step.id] = `Schritt ${step.step_no}: ${step.title}`;
            return acc;
        }, {});

        container.innerHTML = sortedDocs.map(doc => `
            <div class="document-item">
                <div>
                    <strong>${doc.file_name}</strong>
                    ${doc.step_id ? `<div class="text-secondary" style="font-size: 0.75rem;">${stepMap[doc.step_id] || ''}</div>` : ''}
                    <div class="text-secondary" style="font-size: 0.75rem;">
                        ${new Date(doc.uploaded_at).toLocaleString('de-DE')}
                    </div>
                </div>
                <div class="document-actions">
                    <button class="btn btn-sm btn-preview" onclick="previewDocumentFile('${doc.file_path}', '${doc.file_name}')">
                        <i class="ti ti-eye"></i>
                    </button>
                    <button class="btn btn-sm btn-secondary" onclick="downloadDocumentFile('${doc.file_path}', '${doc.file_name}')">
                        <i class="ti ti-download"></i>
                    </button>
                </div>
            </div>
        `).join('');
    } catch (err) {
        console.error('Error loading step documents:', err);
        container.innerHTML = '<p class="text-secondary">Fehler beim Laden der Dokumente</p>';
    }
}

window.downloadDocumentFile = async (filePath, originalName) => {
    try {
        const { data, error } = await supabase.storage
            .from(STORAGE_BUCKET)
            .download(filePath);
        
        if (error) throw error;
        
        const url = URL.createObjectURL(data);
        const a = document.createElement('a');
        a.href = url;
        a.download = originalName || filePath.split('/').pop();
        a.click();
        URL.revokeObjectURL(url);
    } catch (error) {
        console.error('Error downloading file:', error);
        alert('Fehler beim Herunterladen der Datei');
    }
};

window.previewDocumentFile = async (filePath, originalName) => {
    try {
        const { data, error } = await supabase.storage
            .from(STORAGE_BUCKET)
            .download(filePath);
        if (error) throw error;
        const url = URL.createObjectURL(data);
        window.open(url, '_blank', 'noopener');
        setTimeout(() => URL.revokeObjectURL(url), 30000);
    } catch (error) {
        console.error('Error previewing file:', error);
        alert('Fehler beim Öffnen der Vorschau');
    }
};

// ============================================
// Deal CRUD
// ============================================
async function handleCreateDeal(e) {
    e.preventDefault();
    
    if (demoMode) {
        alert('Demo-Modus: Geschäfte können nicht erstellt werden. Bitte melden Sie sich an, um die vollständige Funktionalität zu nutzen.');
        return;
    }
    showLoading(true);
    
    const country = document.getElementById('new-deal-country').value;
    const route = document.getElementById('new-deal-route').value;
    const commoditySelect = document.getElementById('new-deal-commodity');
    const commodityValue = commoditySelect.value;
    const commodityLabel = commoditySelect.options[commoditySelect.selectedIndex]?.textContent || commodityValue;
    const commodityType = normalizeCommodityTypeForDb(commodityValue);
    const hallmarkAge = document.getElementById('new-deal-hallmark-age').value;
    const offerTerms = document.getElementById('new-deal-offer').value.trim();
    const discountValue = parseDiscountValue(document.getElementById('new-deal-discount').value);
    
    const { data: { user } } = await supabase.auth.getUser();
    
    // Generate deal number
    const { data: lastDeal } = await supabase
        .from('deals')
        .select('deal_no')
        .is('deleted_at', null)
        .neq('is_test', true)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();
    
    let dealNo = 'G-0001';
    if (lastDeal) {
        const lastNum = parseInt(lastDeal.deal_no.replace('G-', ''));
        dealNo = `G-${String(lastNum + 1).padStart(4, '0')}`;
    }
    
    // Create deal
    const participation = getDefaultDiscountParticipation();
    participation.commodityValue = commodityValue;
    participation.commodityLabel = commodityLabel;
    const { data: deal, error: dealError } = await supabase
        .from('deals')
        .insert({
            deal_no: dealNo,
            country: country,
            route: route || null,
            commodity_type: commodityType,
            hallmark_age_bucket: commodityType === 'Hallmark' ? hallmarkAge : null,
            status: 'Draft',
            offer_terms: offerTerms || null,
            lbma_discount_pct: discountValue,
            discount_participation: participation,
            is_test: false,
            created_by: user?.id
        })
        .select()
        .single();
    
    if (dealError) {
        console.error('Error creating deal:', dealError);
        alert('Fehler beim Erstellen des Geschäfts');
        showLoading(false);
        return;
    }
    
    saveCountryDefaults(country, route || '', offerTerms || '');
    updateCountrySuggestionList();
    
    // Get template and create steps
    const { data: template } = await supabase
        .from('process_templates')
        .select('id')
        .eq('name', 'Goldankauf Prozess V2 (18 Phasen / 35+1 konditional, Gates, Arbeitstage)')
        .single();
    
    if (template) {
        const { data: templateSteps } = await supabase
            .from('template_steps')
            .select('*')
            .eq('template_id', template.id)
            .order('step_no', { ascending: true });
        
        if (templateSteps) {
            // Filter steps based on commodity type and hallmark age
            let stepsToCreate = templateSteps;
            
            // If NOT Doré, mark Re-Identifizierung step (13 in V2) as done without removing it
            const isDore = commodityType === 'Doré';
            
            // Create deal steps
            const dealSteps = stepsToCreate.map((templateStep, index) => {
                const isStep13 = templateStep.step_no === 13;
                const autoDone = !isDore && isStep13;
                const today = new Date().toISOString().slice(0, 10);
                return {
                deal_id: deal.id,
                step_no: index + 1, // Renumber to be sequential
                title: templateStep.title,
                description: templateStep.description,
                risk_notes: templateStep.risk_notes,
                documents_required: templateStep.documents_required,
                documents_json: templateStep.documents_json,
                responsible_role: templateStep.responsible_role,
                gate_level: templateStep.gate_level,
                gate_code: templateStep.gate_code,
                duration_wd: templateStep.duration_wd,
                lag_wd: templateStep.lag_wd,
                buffer_wd: templateStep.buffer_wd,
                status: autoDone ? 'Done' : 'Open',
                actual_done: autoDone ? today : null
            };
            });
            
            await supabase.from('deal_steps').insert(dealSteps);
        }
    }
    
    await logAudit(deal.id, 'CREATE', 'deal', deal.id, null, deal);

    if (pendingNewDealSellerContactId) {
        const { error: sellerError } = await supabase
            .from('deal_contacts')
            .insert({
                deal_id: deal.id,
                contact_id: pendingNewDealSellerContactId,
                role: 'Seller',
                notes: null
            });
        if (sellerError) {
            console.error('Error assigning seller to new deal:', sellerError);
        }
        pendingNewDealSellerContactId = null;
    }
    
    closeModal('new-deal-modal');
    document.getElementById('new-deal-form').reset();
    setNewDealSellerDisplay(null);
    showLoading(false);
    allDeals.unshift(deal);
    refreshGrcPlanningDealOptions();
    
    // Load the new deal
    await loadDealDetail(deal.id);
}

async function handleUpdateDeal(e) {
    e.preventDefault();
    
    if (demoMode) {
        alert('Demo-Modus: Geschäfte können nicht bearbeitet werden. Bitte melden Sie sich an, um die vollständige Funktionalität zu nutzen.');
        return;
    }
    
    showLoading(true);
    
    const status = document.getElementById('edit-deal-status').value;
    const country = document.getElementById('edit-deal-country').value;
    const route = document.getElementById('edit-deal-route').value;
    const commoditySelect = document.getElementById('edit-deal-commodity');
    const commodityValue = commoditySelect.value;
    const commodityLabel = commoditySelect.options[commoditySelect.selectedIndex]?.textContent || commodityValue;
    const commodityType = normalizeCommodityTypeForDb(commodityValue);
    const hallmarkAge = document.getElementById('edit-deal-hallmark-age')?.value;
    const offerTerms = document.getElementById('edit-deal-offer').value.trim();
    const discountValue = parseDiscountValue(document.getElementById('edit-deal-discount').value);
    const updatedParticipation = normalizeDiscountParticipation(currentDeal?.discount_participation);
    updatedParticipation.grossDiscountPercent = discountValue;
    updatedParticipation.commodityValue = commodityValue;
    updatedParticipation.commodityLabel = commodityLabel;
    
    const oldDeal = { ...currentDeal };
    
    const { error } = await supabase
        .from('deals')
        .update({
            status: status,
            country: country,
            route: route || null,
            commodity_type: commodityType,
            hallmark_age_bucket: commodityType === 'Hallmark' ? (hallmarkAge || null) : null,
            offer_terms: offerTerms || null,
            lbma_discount_pct: discountValue,
            discount_participation: updatedParticipation,
            updated_at: new Date().toISOString()
        })
        .eq('id', currentDeal.id);
    
    if (error) {
        console.error('Error updating deal:', error);
        alert('Fehler beim Aktualisieren des Geschäfts');
        showLoading(false);
        return;
    }
    
    saveCountryDefaults(country, route || '', offerTerms || '');
    updateCountrySuggestionList();
    
    await logAudit(currentDeal.id, 'UPDATE', 'deal', currentDeal.id, oldDeal, {
        status,
        country,
        route,
        commodity_type: commodityType,
        hallmark_age_bucket: commodityType === 'Hallmark' ? (hallmarkAge || null) : null,
        offer_terms: offerTerms || null,
        lbma_discount_pct: discountValue
    });
    
    closeModal('edit-deal-modal');
    showLoading(false);
    
    // Reload deal detail
    await loadDealDetail(currentDeal.id);
}

// ============================================
// Documents
// ============================================
let allDocuments = [];

async function loadDealDocuments(dealId) {
    if (demoMode) {
        allDocuments = [];
        renderDocuments([]);
        return;
    }
    
    if (!supabase) {
        allDocuments = [];
        renderDocuments([]);
        return;
    }
    
    const { data: documents, error } = await supabase
        .from('documents')
        .select('*')
        .eq('deal_id', dealId)
        .order('uploaded_at', { ascending: false });
    
    if (error) {
        console.error('Error loading documents:', error);
        allDocuments = [];
        renderDocuments([]);
        return;
    }
    
    allDocuments = documents || [];
    applyStepAttachmentState(allDocuments);
    renderDocuments(allDocuments);
}

function applyStepAttachmentState(documents) {
    if (!currentDealSteps || currentDealSteps.length === 0) return;
    
    const stepDocsMap = documents.reduce((map, doc) => {
        if (!doc.step_id) return map;
        if (!map.has(doc.step_id)) {
            map.set(doc.step_id, []);
        }
        map.get(doc.step_id).push(doc.file_name);
        return map;
    }, new Map());
    
    currentDealSteps = currentDealSteps.map(step => ({
        ...step,
        has_documents: stepDocsMap.has(step.id),
        attachment_count: stepDocsMap.get(step.id)?.length || 0,
        attachment_names: stepDocsMap.get(step.id) || []
    }));
    
    updateStepAttachmentIndicators();
}

function updateStepAttachmentIndicators() {
    const container = document.getElementById('process-stepper');
    if (!container) return;
    
    container.querySelectorAll('.step-item').forEach(item => {
        const stepId = item.dataset.stepId;
        const indicator = item.querySelector('.step-attachment-block');
        const countEl = item.querySelector('.step-attachment-count');
        const namesEl = item.querySelector('.step-attachment-names');
        if (!indicator) return;
        
        const stepInfo = currentDealSteps.find(step => step.id === stepId);
        const hasDocs = !!stepInfo?.has_documents;
        indicator.classList.toggle('active', hasDocs);
        if (countEl) {
            countEl.textContent = hasDocs && stepInfo?.attachment_count
                ? `(${stepInfo.attachment_count})`
                : '';
        }
        if (namesEl) {
            namesEl.innerHTML = hasDocs && stepInfo?.attachment_names?.length
                ? stepInfo.attachment_names.map(name => `<div>${name}</div>`).join('')
                : '';
        }
    });
}

function renderDocuments(documents) {
    const container = document.getElementById('documents-list');
    
    if (documents.length === 0) {
        container.innerHTML = '<div class="empty-state"><i class="ti ti-files"></i><p>Keine Dokumente vorhanden</p></div>';
        return;
    }

    const stepMap = (currentDealSteps || []).reduce((acc, step) => {
        acc[step.id] = `Schritt ${step.step_no}: ${step.title}`;
        return acc;
    }, {});
    const sortedDocs = [...documents].sort((a, b) => {
        const stepA = currentDealSteps.find(step => step.id === a.step_id);
        const stepB = currentDealSteps.find(step => step.id === b.step_id);
        const noA = stepA?.step_no ?? 9999;
        const noB = stepB?.step_no ?? 9999;
        if (noA !== noB) return noA - noB;
        return new Date(b.uploaded_at).getTime() - new Date(a.uploaded_at).getTime();
    });

    container.innerHTML = sortedDocs.map(doc => {
        const icon = getDocumentIcon(doc.mime_type);
        const stepLabel = doc.step_id ? (stepMap[doc.step_id] || '') : '';
        return `
            <div class="document-card">
                <div class="document-icon">${icon}</div>
                <h4>${doc.file_name}</h4>
                <p class="text-secondary">${doc.doc_type}</p>
                ${stepLabel ? `<p class="text-secondary">${stepLabel}</p>` : ''}
                <p class="text-secondary" style="font-size: 0.75rem;">
                    ${new Date(doc.uploaded_at).toLocaleString('de-DE')}
                </p>
                <div class="document-actions mt-sm">
                    <button class="btn btn-sm btn-preview" onclick="previewDocumentFile('${doc.file_path}', '${doc.file_name}')">
                        <i class="ti ti-eye"></i> Vorschau
                    </button>
                    <button class="btn btn-sm btn-primary" onclick="downloadDocumentFile('${doc.file_path}', '${doc.file_name}')">
                        <i class="ti ti-download"></i> Herunterladen
                    </button>
                </div>
            </div>
        `;
    }).join('');
}

// ============================================
// Contacts
// ============================================
function setupContactsModal() {
    if (contactsModalReady) return;
    const searchInput = document.getElementById('contacts-search');
    const newBtn = document.getElementById('new-contact-btn');
    const saveBtn = document.getElementById('save-contact-btn');
    const deleteBtn = document.getElementById('delete-contact-btn');
    const addDealBtn = document.getElementById('add-contact-deal-btn');
    const assignSellerBtn = document.getElementById('assign-seller-btn');
    const addBankBtn = document.getElementById('add-bank-info-btn');
    const bicInput = document.getElementById('bank-bic');
    if (!searchInput || !newBtn || !saveBtn) return;
    
    searchInput.addEventListener('input', () => {
        renderContactsList(filterContacts(searchInput.value));
    });
    
    newBtn.addEventListener('click', () => {
        selectedContactId = null;
        const detail = document.getElementById('contact-detail');
        const empty = document.getElementById('contact-detail-empty');
        if (empty) empty.style.display = 'none';
        if (detail) detail.style.display = 'block';
        resetContactForm();
        renderContactsList(filterContacts(document.getElementById('contacts-search')?.value || ''));
    });
    
    saveBtn.addEventListener('click', saveContact);
    if (deleteBtn) {
        deleteBtn.addEventListener('click', () => {
            if (!selectedContactId) return;
            const contact = allContacts.find(item => item.id === selectedContactId);
            const label = contact?.full_name || contact?.company || 'Kontakt';
            openDeleteEntityModal('contact', { id: selectedContactId, label });
        });
    }
    
    if (addDealBtn) {
        addDealBtn.addEventListener('click', addContactDeal);
    }
    if (assignSellerBtn) {
        assignSellerBtn.addEventListener('click', assignSelectedContactAsSeller);
    }
    if (addBankBtn) {
        addBankBtn.addEventListener('click', addBankInfo);
    }
    if (bicInput) {
        bicInput.addEventListener('input', () => {
            const sanitized = bicInput.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
            if (sanitized !== bicInput.value) {
                bicInput.value = sanitized;
            }
        });
    }
    
    const bankDealSelect = document.getElementById('bank-deal-select');
    if (bankDealSelect) {
        bankDealSelect.addEventListener('change', () => {
            applyBankDefaults();
        });
    }
    
    document.getElementById('contacts-list')?.addEventListener('click', (e) => {
        const item = e.target.closest('.contact-list-item');
        if (!item) return;
        selectContact(item.dataset.contactId || null);
    });
    
    document.getElementById('contact-deals-list')?.addEventListener('click', (e) => {
        const removeBtn = e.target.closest('[data-action="remove-contact-deal"]');
        if (!removeBtn) return;
        removeContactDeal(removeBtn.dataset.id);
    });
    
    document.getElementById('bank-info-list')?.addEventListener('click', (e) => {
        const removeBtn = e.target.closest('[data-action="remove-bank-info"]');
        if (!removeBtn) return;
        removeBankInfo(removeBtn.dataset.id);
    });
    
    contactsModalReady = true;
    setupContactHistory();
}

function setupLbmaUnitToggle() {
    const container = document.getElementById('lbma-price');
    if (!container) return;
    const toggles = Array.from(container.querySelectorAll('.lbma-unit'));
    if (toggles.length === 0) return;
    toggles.forEach(toggle => {
        toggle.addEventListener('change', () => {
            if (toggle.checked) {
                toggles.forEach(other => {
                    if (other !== toggle) other.checked = false;
                });
            } else {
                const anyChecked = toggles.some(other => other.checked);
                if (!anyChecked) {
                    toggle.checked = true;
                }
            }
            renderLbmaQuote();
        });
    });
}

function getLbmaUnit() {
    const container = document.getElementById('lbma-price');
    if (!container) return 'oz';
    const checked = container.querySelector('.lbma-unit:checked');
    return checked?.dataset.unit || 'oz';
}

async function fetchUsdToEurRate() {
    const now = Date.now();
    const maxAgeMs = 60 * 60 * 1000;
    if (lastFxRate && now - lastFxRate.updatedAt.getTime() < maxAgeMs) {
        return lastFxRate.rate;
    }
    try {
        const response = await fetch('https://api.frankfurter.dev/v1/latest?from=USD&to=EUR');
        if (!response.ok) {
            throw new Error(`FX request failed (${response.status})`);
        }
        const data = await response.json();
        const rate = Number(data?.rates?.EUR);
        if (!Number.isFinite(rate)) {
            throw new Error('FX payload invalid');
        }
        const updatedAt = new Date();
        lastFxRate = { rate, updatedAt };
        try {
            localStorage.setItem('lbma_fx', JSON.stringify({
                rate,
                updatedAt: updatedAt.toISOString()
            }));
        } catch (err) {
            console.warn('LBMA FX cache write failed:', err);
        }
        return rate;
    } catch (err) {
        console.warn('LBMA FX fetch failed:', err);
        return lastFxRate?.rate ?? null;
    }
}

function renderLbmaValues(valuesEl, usdPerOz, unit, fxRate) {
    if (!valuesEl) return;
    const multiplier = unit === 'kg' ? 32.1507466 : 1;
    const usdValue = usdPerOz * multiplier;
    const usdFormat = new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    const usdText = `$ ${usdFormat.format(usdValue)} / ${unit}`;
    if (!Number.isFinite(Number(fxRate))) {
        valuesEl.innerHTML = `<span class="lbma-line">€ — / ${unit}</span><span class="lbma-line">${usdText}</span>`;
        return;
    }
    const eurFormat = new Intl.NumberFormat('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    const eurText = `€ ${eurFormat.format(usdValue * fxRate)} / ${unit}`;
    valuesEl.innerHTML = `<span class="lbma-line">${eurText}</span><span class="lbma-line">${usdText}</span>`;
}

function renderLbmaQuote() {
    const container = document.getElementById('lbma-price');
    if (!container || !lastLbmaQuote) return;
    const valuesEl = container.querySelector('.lbma-values');
    const timeEl = container.querySelector('.lbma-time');
    if (!valuesEl) return;
    const unit = getLbmaUnit();
    renderLbmaValues(valuesEl, lastLbmaQuote.usd, unit, lastFxRate?.rate ?? null);
    if (timeEl) {
        timeEl.textContent = `Stand: ${lastLbmaQuote.updatedAt.toLocaleString('de-DE')}`;
    }
}

function updateAssignSellerButtonVisibility() {
    const btn = document.getElementById('assign-seller-btn');
    if (!btn) return;
    if (pendingSellerAssignment && selectedContactId) {
        btn.textContent = pendingSellerAssignment.mode === 'new'
            ? 'Als Seller auswählen'
            : 'Als Seller zuordnen';
        btn.classList.remove('hidden');
    } else {
        btn.classList.add('hidden');
    }
}

function clearSellerAssignmentMode() {
    pendingSellerAssignment = null;
    updateAssignSellerButtonVisibility();
}

async function startSellerAssignment() {
    if (!currentDeal?.id) {
        alert('Bitte öffnen Sie zuerst ein Geschäft.');
        return;
    }
    pendingSellerAssignment = { mode: 'edit', dealId: currentDeal.id };
    await openContactsModal(currentDeal.id);
    const dealRoleSelect = document.getElementById('contact-deal-role');
    if (dealRoleSelect) {
        dealRoleSelect.value = 'Seller';
    }
    updateAssignSellerButtonVisibility();
}

async function startNewDealSellerAssignment() {
    pendingSellerAssignment = { mode: 'new' };
    await openContactsModal();
    const dealRoleSelect = document.getElementById('contact-deal-role');
    if (dealRoleSelect) {
        dealRoleSelect.value = 'Seller';
    }
    updateAssignSellerButtonVisibility();
}

async function assignSelectedContactAsSeller() {
    if (!pendingSellerAssignment) {
        return;
    }
    if (!selectedContactId) {
        alert('Bitte wählen Sie einen Kontakt aus.');
        return;
    }
    if (demoMode || window.demoMode) {
        alert('Demo-Modus: Seller können nicht zugeordnet werden. Bitte melden Sie sich an, um die vollständige Funktionalität zu nutzen.');
        return;
    }
    if (!supabase) {
        alert('Supabase-Verbindung nicht verfügbar.');
        return;
    }

    if (pendingSellerAssignment.mode === 'new') {
        pendingNewDealSellerContactId = selectedContactId;
        const selectedContact = allContacts.find(contact => contact.id === selectedContactId);
        setNewDealSellerDisplay(selectedContact || null);
        clearSellerAssignmentMode();
        closeModal('contacts-modal');
        return;
    }

    showLoading(true);
    const dealId = pendingSellerAssignment.dealId;
    const { error: deleteError } = await supabase
        .from('deal_contacts')
        .delete()
        .eq('deal_id', dealId)
        .eq('role', 'Seller');
    if (deleteError) {
        console.error('Error removing previous seller:', deleteError);
    }

    const { error: insertError } = await supabase
        .from('deal_contacts')
        .insert({
            deal_id: dealId,
            contact_id: selectedContactId,
            role: 'Seller',
            notes: null
        });
    if (insertError) {
        console.error('Error assigning seller:', insertError);
        alert('Fehler beim Zuordnen des Sellers.');
        showLoading(false);
        return;
    }

    const selectedContact = allContacts.find(contact => contact.id === selectedContactId);
    setEditSellerDisplay(selectedContact || null);
    await loadDealContacts(dealId);

    clearSellerAssignmentMode();
    closeModal('contacts-modal');
    showLoading(false);
}

async function openContactsModal(dealId = null) {
    openModal('contacts-modal');
    await ensureDealsLoaded();
    populateDealSelects();
    if (dealId) {
        const dealSelect = document.getElementById('contact-deal-select');
        const bankSelect = document.getElementById('bank-deal-select');
        if (dealSelect) dealSelect.value = dealId;
        if (bankSelect) bankSelect.value = dealId;
    }
    await loadContacts();
    setupContactHistory();
    updateAssignSellerButtonVisibility();
}

function filterContacts(query) {
    const q = query.trim().toLowerCase();
    if (!q) return allContacts;
    return allContacts.filter(contact => {
        return [
            contact.full_name,
            contact.company,
            contact.role,
            contact.email
        ].some(field => field?.toLowerCase().includes(q));
    });
}

async function ensureDealsLoaded() {
    if (allDeals.length > 0 || !supabase || demoMode || window.demoMode) return;
    const { data, error } = await supabase
        .from('deals')
        .select('id, deal_no')
        .is('deleted_at', null)
        .order('created_at', { ascending: false });
    if (!error) {
        allDeals = data || [];
    }
}

function populateDealSelects() {
    const dealSelects = [
        document.getElementById('contact-deal-select'),
        document.getElementById('bank-deal-select')
    ];
    dealSelects.forEach(select => {
        if (!select) return;
        select.innerHTML = '<option value="">Geschäft auswählen</option>' +
            allDeals.map(deal => `<option value="${deal.id}">${deal.deal_no}</option>`).join('');
    });
}

async function loadContacts() {
    if (demoMode || window.demoMode) {
        allContacts = [
            {
                id: 'demo-c-1',
                full_name: 'Herr Foge',
                role: 'Seller',
                company: 'Foge Minerals',
                email: 'foge@example.com',
                phone: '+233 555 123',
                mobile: '+233 700 456',
                notes: 'Bevorzugt Telefon am Vormittag.'
            }
        ];
        seedContactHistoryFromContacts(allContacts);
        renderContactsList(allContacts);
        selectContact(allContacts[0].id);
        return;
    }
    
    if (!supabase) return;
    const { data, error } = await supabase
        .from('contacts')
        .select('*')
        .is('deleted_at', null)
        .order('full_name', { ascending: true });
    if (error) {
        console.error('Error loading contacts:', error);
        return;
    }
    allContacts = data || [];
    seedContactHistoryFromContacts(allContacts);
    renderContactsList(allContacts);
}

function renderContactsList(contacts) {
    const list = document.getElementById('contacts-list');
    if (!list) return;
    if (contacts.length === 0) {
        list.innerHTML = '<div class="empty-state"><i class="ti ti-user-x"></i><p>Keine Kontakte</p></div>';
        return;
    }
    list.innerHTML = contacts.map(contact => `
        <div class="contact-list-item ${contact.id === selectedContactId ? 'active' : ''}" data-contact-id="${contact.id}">
            <div>
                <strong>${escapeHtml(contact.full_name || '')}</strong>
                <div class="text-secondary">${escapeHtml(contact.role || '-')} · ${escapeHtml(contact.company || '-')}</div>
            </div>
        </div>
    `).join('');
}

function selectContact(contactId) {
    selectedContactId = contactId;
    currentContactBankDefaults = null;
    currentContactBankDefaultsContactId = null;
    clearBankInputs();
    const detail = document.getElementById('contact-detail');
    const empty = document.getElementById('contact-detail-empty');
    if (!contactId) {
        empty.style.display = 'block';
        detail.style.display = 'none';
        resetContactForm();
        renderContactsList(filterContacts(document.getElementById('contacts-search')?.value || ''));
        updateAssignSellerButtonVisibility();
        return;
    }
    const contact = allContacts.find(item => item.id === contactId);
    if (!contact) return;
    
    empty.style.display = 'none';
    detail.style.display = 'block';
    fillContactForm(contact);
    loadContactLinks(contactId);
    renderContactsList(filterContacts(document.getElementById('contacts-search')?.value || ''));
    updateAssignSellerButtonVisibility();
}

function resetContactForm() {
    document.getElementById('contact-name').value = '';
    document.getElementById('contact-role').value = '';
    document.getElementById('contact-company').value = '';
    document.getElementById('contact-email').value = '';
    document.getElementById('contact-phone').value = '';
    document.getElementById('contact-mobile').value = '';
    document.getElementById('contact-notes').value = '';
    document.getElementById('contact-name-title').textContent = 'Neuer Kontakt';
    document.getElementById('contact-role-title').textContent = '-';
}

function fillContactForm(contact) {
    document.getElementById('contact-name').value = contact.full_name || '';
    document.getElementById('contact-role').value = contact.role || '';
    document.getElementById('contact-company').value = contact.company || '';
    document.getElementById('contact-email').value = contact.email || '';
    document.getElementById('contact-phone').value = contact.phone || '';
    document.getElementById('contact-mobile').value = contact.mobile || '';
    document.getElementById('contact-notes').value = contact.notes || '';
    document.getElementById('contact-name-title').textContent = contact.full_name || 'Kontakt';
    document.getElementById('contact-role-title').textContent = contact.role || '';
}

async function saveContact() {
    const name = document.getElementById('contact-name').value.trim();
    if (!name) {
        alert('Bitte einen Namen eingeben.');
        return;
    }
    if (demoMode || window.demoMode || !supabase) return;
    
    const payload = {
        full_name: name,
        role: document.getElementById('contact-role').value.trim() || null,
        company: document.getElementById('contact-company').value.trim() || null,
        email: document.getElementById('contact-email').value.trim() || null,
        phone: document.getElementById('contact-phone').value.trim() || null,
        mobile: document.getElementById('contact-mobile').value.trim() || null,
        notes: document.getElementById('contact-notes').value.trim() || null
    };
    
    let contactId = selectedContactId;
    if (contactId) {
        const { error } = await supabase.from('contacts').update(payload).eq('id', contactId);
        if (error) {
            console.error('Error updating contact:', error);
            alert('Fehler beim Speichern des Kontakts');
            return;
        }
    } else {
        const { data, error } = await supabase.from('contacts').insert(payload).select().single();
        if (error) {
            console.error('Error creating contact:', error);
            alert('Fehler beim Erstellen des Kontakts');
            return;
        }
        contactId = data.id;
    }
    
    saveContactHistory(payload.role, payload.company, payload.notes);
    
    await loadContacts();
    selectContact(contactId);
    setupContactHistory();
}

async function loadContactLinks(contactId) {
    if (demoMode || window.demoMode) {
        renderContactDeals([
            { id: 'demo-link-1', role: 'Seller', notes: 'Rahmenvertrag', deal: { id: 'demo-1', deal_no: 'G-0001' } }
        ]);
        currentContactBankDefaults = {
            bank_name: 'Demo Bank',
            iban: 'DE00 0000 0000 0000 0000 00',
            bic: 'DEMODEFF',
            account_holder: 'Demo Account Holder'
        };
        currentContactBankDefaultsContactId = contactId;
        renderBankInfos([]);
        applyBankDefaults();
        return;
    }
    
    if (!supabase) return;
    const { data: dealLinks } = await supabase
        .from('deal_contacts')
        .select('id, role, notes, deal:deals(id, deal_no)')
        .eq('contact_id', contactId)
        .order('created_at', { ascending: false });
    renderContactDeals(dealLinks || []);
    
    const { data: bankInfos, error: bankError } = await supabase
        .from('deal_bank_accounts')
        .select('id, bank_name, iban, bic, account_holder, deal:deals(id, deal_no)')
        .eq('contact_id', contactId)
        .order('created_at', { ascending: false });
    if (bankError) {
        console.error('Error loading deal banks:', bankError);
        renderBankInfos([]);
        currentContactBankDefaults = null;
        currentContactBankDefaultsContactId = null;
        return;
    }
    renderBankInfos(bankInfos || []);
    currentContactBankDefaults = bankInfos?.length
        ? {
            bank_name: bankInfos[0].bank_name || '',
            iban: bankInfos[0].iban || '',
            bic: bankInfos[0].bic || '',
            account_holder: bankInfos[0].account_holder || ''
        }
        : null;
    currentContactBankDefaultsContactId = bankInfos?.length ? contactId : null;
    applyBankDefaults();
}

function renderContactDeals(links) {
    const list = document.getElementById('contact-deals-list');
    if (!list) return;
    if (links.length === 0) {
        list.innerHTML = '<p class="text-secondary">Keine Zuordnungen</p>';
        return;
    }
    list.innerHTML = links.map(link => `
        <div class="contact-link-row">
            <div>
                <strong>${escapeHtml(link.deal?.deal_no || '-')}</strong>
                <span class="badge badge-open">${escapeHtml(link.role || '')}</span>
                <span class="text-secondary">${escapeHtml(link.notes || '')}</span>
            </div>
            <button class="btn btn-sm btn-secondary" data-action="remove-contact-deal" data-id="${link.id}">Entfernen</button>
        </div>
    `).join('');
}

function renderBankInfos(infos) {
    const list = document.getElementById('bank-info-list');
    if (!list) return;
    if (infos.length === 0) {
        list.innerHTML = '<p class="text-secondary">Keine Bankinformationen</p>';
        return;
    }
    list.innerHTML = infos.map(info => `
        <div class="contact-link-row">
            <div>
                <strong>${escapeHtml(info.deal?.deal_no || '-')}</strong>
                <span class="text-secondary">${escapeHtml(info.bank_name || '')}</span>
                <div class="text-secondary small-text">IBAN: ${escapeHtml(info.iban || '-')} · BIC: ${escapeHtml(info.bic || '-')}</div>
                <div class="text-secondary small-text">Kontoinhaber: ${escapeHtml(info.account_holder || '-')}</div>
            </div>
            <button class="btn btn-sm btn-secondary" data-action="remove-bank-info" data-id="${info.id}">Entfernen</button>
        </div>
    `).join('');
}

function applyBankDefaults() {
    if (!currentContactBankDefaults) return;
    if (currentContactBankDefaultsContactId && currentContactBankDefaultsContactId !== selectedContactId) return;
    const bankNameInput = document.getElementById('bank-name');
    const ibanInput = document.getElementById('bank-iban');
    const bicInput = document.getElementById('bank-bic');
    const holderInput = document.getElementById('bank-account-holder');
    if (!bankNameInput || !ibanInput || !bicInput || !holderInput) return;
    
    if (!bankNameInput.value) bankNameInput.value = currentContactBankDefaults.bank_name || '';
    if (!ibanInput.value) ibanInput.value = currentContactBankDefaults.iban || '';
    if (!bicInput.value) {
        const normalized = (currentContactBankDefaults.bic || '').toUpperCase().replace(/[^A-Z0-9]/g, '');
        bicInput.value = normalized;
    }
    if (!holderInput.value) holderInput.value = currentContactBankDefaults.account_holder || '';
}

function clearBankInputs() {
    const bankNameInput = document.getElementById('bank-name');
    const ibanInput = document.getElementById('bank-iban');
    const bicInput = document.getElementById('bank-bic');
    const holderInput = document.getElementById('bank-account-holder');
    if (bankNameInput) bankNameInput.value = '';
    if (ibanInput) ibanInput.value = '';
    if (bicInput) bicInput.value = '';
    if (holderInput) holderInput.value = '';
}

async function addContactDeal() {
    if (!selectedContactId) {
        alert('Bitte zuerst einen Kontakt auswählen oder speichern.');
        return;
    }
    const dealSelect = document.getElementById('contact-deal-select');
    const dealId = dealSelect?.value || currentDeal?.id || '';
    const role = document.getElementById('contact-deal-role').value;
    const notes = document.getElementById('contact-deal-notes').value.trim();
    if (!dealId) {
        alert('Bitte ein Geschäft auswählen.');
        return;
    }
    if (demoMode || window.demoMode || !supabase) return;
    
    const { error } = await supabase
        .from('deal_contacts')
        .insert({
            contact_id: selectedContactId,
            deal_id: dealId,
            role: role,
            notes: notes || null
        });
    if (error) {
        console.error('Error adding deal contact:', error);
        alert(`Fehler beim Speichern der Zuordnung: ${error.message}`);
        return;
    }
    if (notes) {
        saveDealNotesHistory(notes);
    }
    document.getElementById('contact-deal-notes').value = '';
    loadContactLinks(selectedContactId);
    if (currentDeal?.id === dealId) {
        loadDealContacts(dealId);
    }
}

async function removeContactDeal(linkId) {
    if (!linkId || !supabase) return;
    await supabase.from('deal_contacts').delete().eq('id', linkId);
    loadContactLinks(selectedContactId);
}

async function addBankInfo() {
    if (!selectedContactId) return;
    const dealId = document.getElementById('bank-deal-select').value;
    const bankName = document.getElementById('bank-name').value.trim();
    const iban = document.getElementById('bank-iban').value.trim();
    const bicRaw = document.getElementById('bank-bic').value.trim();
    const bic = bicRaw.toUpperCase().replace(/[^A-Z0-9]/g, '');
    const accountHolder = document.getElementById('bank-account-holder').value.trim();
    if (!dealId || !bankName) {
        alert('Bitte Geschäft und Bankname angeben.');
        return;
    }
    if (demoMode || window.demoMode || !supabase) return;
    
    const { error } = await supabase
        .from('deal_bank_accounts')
        .insert({
            contact_id: selectedContactId,
            deal_id: dealId,
            bank_name: bankName,
            iban: iban || null,
            bic: bic || null,
            account_holder: accountHolder || null
        });
    if (error) {
        console.error('Error adding bank info:', error);
        alert('Fehler beim Speichern der Bankinformationen');
        return;
    }
    currentContactBankDefaults = {
        bank_name: bankName,
        iban: iban || '',
        bic: bic || '',
        account_holder: accountHolder || ''
    };
    currentContactBankDefaultsContactId = selectedContactId;
    document.getElementById('bank-name').value = '';
    document.getElementById('bank-iban').value = '';
    document.getElementById('bank-bic').value = '';
    document.getElementById('bank-account-holder').value = '';
    loadContactLinks(selectedContactId);
}

async function removeBankInfo(infoId) {
    if (!infoId || !supabase) return;
    await supabase.from('deal_bank_accounts').delete().eq('id', infoId);
    loadContactLinks(selectedContactId);
}

async function loadDealContacts(dealId) {
    const contactsList = document.getElementById('deal-contacts-list');
    const bankList = document.getElementById('deal-bank-list');
    if (!contactsList || !bankList) return;
    
    if (demoMode || window.demoMode) {
        contactsList.innerHTML = `
            <div class="contact-card">
                <h4>Herr Foge</h4>
                <p class="text-secondary">Seller · Foge Minerals</p>
                <p><strong>Kontakt:</strong> foge@example.com · +233 700 456</p>
                <div class="badge badge-open">Seller</div>
            </div>
        `;
        bankList.innerHTML = `
            <div class="contact-card">
                <h4>Foge Minerals</h4>
                <p class="text-secondary">IBAN: GH12 3456 7890</p>
                <p class="text-secondary">BIC: GHABCDEFG</p>
                <p class="text-secondary">Kontoinhaber: Foge Minerals Ltd.</p>
            </div>
        `;
        setEditSellerDisplay({ full_name: 'Herr Foge', company: 'Foge Minerals' });
        const sellerValue = document.getElementById('deal-seller-value');
        if (sellerValue) {
            sellerValue.textContent = formatSellerName('Herr Foge');
        }
        return;
    }
    
    if (!supabase) return;
    
    const { data: dealContacts, error: dealContactsError } = await supabase
        .from('deal_contacts')
        .select('id, role, notes, contact:contacts(id, full_name, role, company, email, phone, mobile, deleted_at)')
        .eq('deal_id', dealId)
        .order('created_at', { ascending: false });
    
    if (dealContactsError) {
        console.error('Error loading deal contacts:', dealContactsError);
        contactsList.innerHTML = '<p class="text-secondary">Kontakte konnten nicht geladen werden.</p>';
        setEditSellerDisplay(null);
        const sellerValue = document.getElementById('deal-seller-value');
        if (sellerValue) {
            sellerValue.textContent = '-';
        }
    } else {
        const visibleContacts = (dealContacts || []).filter(link => !link.contact?.deleted_at);
        renderDealContacts(visibleContacts);
        const sellerLink = visibleContacts.find(link => link.role === 'Seller');
        setEditSellerDisplay(sellerLink?.contact || null);
        const sellerValue = document.getElementById('deal-seller-value');
        if (sellerValue) {
            sellerValue.textContent = formatSellerName(sellerLink?.contact?.full_name || '');
        }
    }
    
    const { data: bankInfos, error: bankError } = await supabase
        .from('deal_bank_accounts')
        .select('id, bank_name, iban, bic, account_holder, contact:contacts(full_name)')
        .eq('deal_id', dealId)
        .order('created_at', { ascending: false });
    
    if (bankError) {
        console.error('Error loading deal banks:', bankError);
        bankList.innerHTML = '<p class="text-secondary">Bankinformationen konnten nicht geladen werden.</p>';
    } else {
        renderDealBanks(bankInfos || []);
    }
}

// ============================================
// KYC / CIS
// ============================================
async function loadDealKyc(dealId) {
    const statusEl = document.getElementById('kyc-status');
    if (statusEl) {
        statusEl.textContent = '';
        statusEl.classList.remove('status-success', 'status-error');
        statusEl.classList.add('status-muted');
    }

    const roleSelect = document.getElementById('kyc-role-select');
    if (roleSelect) {
        roleSelect.value = currentKycRole || 'Buyer';
        currentKycRole = roleSelect.value || currentKycRole || 'Buyer';
    }

    if (demoMode || window.demoMode) {
        currentKycProfileId = null;
        window.currentDealKyc = null;
        applyKycFormValues({
            company_name: 'Koras PMR GmbH',
            authorized_signatory_name: 'Thorsten Koras',
            authorized_signatory_title: 'General Manager',
            country: 'Germany',
            city: 'Engelsbrand',
            postal_code: '75331',
            business_email: 'info@koras-group.de',
            company_roles: ['Buyer'],
            type_of_business: 'Sales / trade',
            incorporation_date: '2019-08-14',
            shareholder_owner: 'Thorsten Koras',
            employees_count: 5,
            primary_contact_first_name: 'Thorsten',
            primary_contact_last_name: 'Koras',
            primary_contact_function: 'General Manager',
            primary_contact_phone: '+49 7082 79283 00',
            primary_contact_email: 'thorsten.koras@koras-group.de',
            bank_name: 'HypoVereinsbank',
            iban: 'DE09 67020190 0033115229',
            swift_bic: 'HYVEDEMM489',
            products: ['Gold'],
            trade_references: [
                { customer: 'Adani', country: 'India' },
                { customer: 'Aurus', country: 'Russia' },
                { customer: 'Heng Juan', country: 'China' }
            ]
        });
        await loadKycUploads(dealId, currentKycRole || 'Buyer');
        if (statusEl) statusEl.textContent = 'Demo-Daten geladen';
        return;
    }

    if (!supabase) return;

    const { data, error } = await supabase
        .from('kyc_profiles')
        .select('*')
        .eq('deal_id', dealId)
        .eq('party_role', currentKycRole)
        .maybeSingle();

    if (error) {
        console.error('Error loading KYC profile:', error);
        if (statusEl) {
            statusEl.textContent = 'KYC-Daten konnten nicht geladen werden';
            statusEl.classList.remove('status-success', 'status-muted');
            statusEl.classList.add('status-error');
        }
        applyKycFormValues({});
        currentKycProfileId = null;
        return;
    }

    currentKycProfileId = data?.id || null;
    window.currentDealKyc = data || null;
    applyKycFormValues(data || {});
    await loadKycUploads(dealId, currentKycRole || 'Buyer');
}

async function saveKycProfile() {
    const statusEl = document.getElementById('kyc-status');
    if (!currentDeal?.id) {
        alert('Kein Geschäft ausgewählt');
        return;
    }
    if (demoMode || window.demoMode) {
        if (statusEl) statusEl.textContent = 'Demo-Modus: Keine Speicherung';
        return;
    }
    if (!supabase) return;

    const payload = collectKycFormValues();
    payload.deal_id = currentDeal.id;
    payload.deal_no = currentDeal.deal_no;
    payload.party_role = currentKycRole || 'Buyer';
    if (currentKycProfileId) {
        payload.id = currentKycProfileId;
    }

    const { data, error } = await supabase
        .from('kyc_profiles')
        .upsert(payload, { onConflict: 'deal_id,party_role' })
        .select()
        .single();

    if (error) {
        console.error('Error saving KYC profile:', error);
        if (statusEl) {
            statusEl.textContent = 'Speichern fehlgeschlagen';
            statusEl.classList.remove('status-success', 'status-muted');
            statusEl.classList.add('status-error');
        }
        alert(`KYC speichern fehlgeschlagen: ${error.message}`);
        return;
    }

    currentKycProfileId = data?.id || currentKycProfileId;
    window.currentDealKyc = data || window.currentDealKyc || null;
    if (statusEl) {
        statusEl.textContent = `KYC-Daten gespeichert (${currentKycRole})`;
        statusEl.classList.remove('status-error', 'status-muted');
        statusEl.classList.add('status-success');
        setTimeout(() => {
            if (statusEl.textContent === `KYC-Daten gespeichert (${currentKycRole})`) {
                statusEl.classList.remove('status-success');
                statusEl.classList.add('status-muted');
            }
        }, 4000);
    }
}

function collectKycFormValues() {
    const companyRoles = [
        document.getElementById('kyc-role-buyer')?.checked ? 'Buyer' : null,
        document.getElementById('kyc-role-seller')?.checked ? 'Seller' : null,
        document.getElementById('kyc-role-producer')?.checked ? 'Producer' : null
    ].filter(Boolean);

    const products = Array.from(document.querySelectorAll('.kyc-product'))
        .filter(cb => cb.checked)
        .map(cb => cb.value);

    const bankContacts = parseDelimitedLines(
        document.getElementById('kyc-bank-contacts')?.value || '',
        ['function', 'name', 'phone', 'email']
    );

    const tradeRefs = parseDelimitedLines(
        document.getElementById('kyc-trade-references')?.value || '',
        ['customer', 'country']
    );

    const fixturesLastThree = getInputValue('kyc-fixtures-last-three');

    const cifValue = document.getElementById('kyc-cif-basis')?.value || '';

    return {
        company_name: getInputValue('kyc-company-name'),
        authorized_signatory_name: getInputValue('kyc-authorized-name'),
        authorized_signatory_title: getInputValue('kyc-authorized-title'),
        passport_no: getInputValue('kyc-passport-no'),
        street: getInputValue('kyc-street'),
        city: getInputValue('kyc-city'),
        postal_code: getInputValue('kyc-postal-code'),
        country: getInputValue('kyc-country'),
        phone: getInputValue('kyc-phone'),
        business_email: getInputValue('kyc-email'),
        business_website: getInputValue('kyc-website'),
        tax_id: getInputValue('kyc-tax-id'),
        vat_no: getInputValue('kyc-vat-no'),
        company_roles: companyRoles,
        product_raw_material: Boolean(document.getElementById('kyc-product-raw-material')?.checked),
        product_refined_bars: Boolean(document.getElementById('kyc-product-refined-bars')?.checked),
        product_refinery_machinery: Boolean(document.getElementById('kyc-product-refinery-machinery')?.checked),
        type_of_business: getInputValue('kyc-type-of-business'),
        incorporation_date: getInputValue('kyc-incorporation-date') || null,
        shareholder_owner: getInputValue('kyc-shareholder-owner'),
        employees_count: parseNumberValue(getInputValue('kyc-employees-count')),
        subsidiaries: getInputValue('kyc-subsidiaries'),
        primary_contact_first_name: getInputValue('kyc-primary-first-name'),
        primary_contact_last_name: getInputValue('kyc-primary-last-name'),
        primary_contact_function: getInputValue('kyc-primary-function'),
        primary_contact_phone: getInputValue('kyc-primary-phone'),
        primary_contact_email: getInputValue('kyc-primary-email'),
        legal_counsel_name: getInputValue('kyc-legal-name'),
        legal_counsel_street: getInputValue('kyc-legal-street'),
        legal_counsel_postal_code: getInputValue('kyc-legal-postal'),
        legal_counsel_city: getInputValue('kyc-legal-city'),
        legal_counsel_country: getInputValue('kyc-legal-country'),
        legal_counsel_phone: getInputValue('kyc-legal-phone'),
        legal_counsel_email: getInputValue('kyc-legal-email'),
        legal_counsel_website: getInputValue('kyc-legal-website'),
        bank_name: getInputValue('kyc-bank-name'),
        bank_street: getInputValue('kyc-bank-street'),
        bank_postal_code: getInputValue('kyc-bank-postal'),
        bank_city: getInputValue('kyc-bank-city'),
        bank_country: getInputValue('kyc-bank-country'),
        bank_phone: getInputValue('kyc-bank-phone'),
        bank_officer: getInputValue('kyc-bank-officer'),
        bank_officer_phone: getInputValue('kyc-bank-officer-phone'),
        bank_officer_email: getInputValue('kyc-bank-officer-email'),
        account_name: getInputValue('kyc-account-name'),
        account_number: getInputValue('kyc-account-number'),
        iban: getInputValue('kyc-iban'),
        swift_bic: getInputValue('kyc-swift-bic'),
        account_signatory: getInputValue('kyc-account-signatory'),
        bank_contacts: bankContacts,
        bank_reference_letter_appendix: Boolean(document.getElementById('kyc-bank-reference-letter')?.checked),
        products: products,
        trade_references: tradeRefs,
        cif_basis: cifValue === 'yes' ? true : (cifValue === 'no' ? false : null),
        fixtures_last_three: fixturesLastThree || null
    };
}

function applyKycFormValues(profile) {
    setInputValue('kyc-company-name', profile.company_name);
    setInputValue('kyc-authorized-name', profile.authorized_signatory_name);
    setInputValue('kyc-authorized-title', profile.authorized_signatory_title);
    setInputValue('kyc-passport-no', profile.passport_no);
    setInputValue('kyc-street', profile.street);
    setInputValue('kyc-city', profile.city);
    setInputValue('kyc-postal-code', profile.postal_code);
    setInputValue('kyc-country', profile.country);
    setInputValue('kyc-phone', profile.phone);
    setInputValue('kyc-email', profile.business_email);
    setInputValue('kyc-website', profile.business_website);
    setInputValue('kyc-tax-id', profile.tax_id);
    setInputValue('kyc-vat-no', profile.vat_no);

    const roles = Array.isArray(profile.company_roles) ? profile.company_roles : [];
    setCheckboxValue('kyc-role-buyer', roles.includes('Buyer'));
    setCheckboxValue('kyc-role-seller', roles.includes('Seller'));
    setCheckboxValue('kyc-role-producer', roles.includes('Producer'));

    setCheckboxValue('kyc-product-raw-material', profile.product_raw_material);
    setCheckboxValue('kyc-product-refined-bars', profile.product_refined_bars);
    setCheckboxValue('kyc-product-refinery-machinery', profile.product_refinery_machinery);

    setInputValue('kyc-type-of-business', profile.type_of_business);
    setInputValue('kyc-incorporation-date', formatDateInput(profile.incorporation_date));
    setInputValue('kyc-shareholder-owner', profile.shareholder_owner);
    setInputValue('kyc-employees-count', profile.employees_count);
    setInputValue('kyc-subsidiaries', profile.subsidiaries);

    setInputValue('kyc-primary-first-name', profile.primary_contact_first_name);
    setInputValue('kyc-primary-last-name', profile.primary_contact_last_name);
    setInputValue('kyc-primary-function', profile.primary_contact_function);
    setInputValue('kyc-primary-phone', profile.primary_contact_phone);
    setInputValue('kyc-primary-email', profile.primary_contact_email);

    setInputValue('kyc-legal-name', profile.legal_counsel_name);
    setInputValue('kyc-legal-street', profile.legal_counsel_street);
    setInputValue('kyc-legal-postal', profile.legal_counsel_postal_code);
    setInputValue('kyc-legal-city', profile.legal_counsel_city);
    setInputValue('kyc-legal-country', profile.legal_counsel_country);
    setInputValue('kyc-legal-phone', profile.legal_counsel_phone);
    setInputValue('kyc-legal-email', profile.legal_counsel_email);
    setInputValue('kyc-legal-website', profile.legal_counsel_website);

    setInputValue('kyc-bank-name', profile.bank_name);
    setInputValue('kyc-bank-street', profile.bank_street);
    setInputValue('kyc-bank-postal', profile.bank_postal_code);
    setInputValue('kyc-bank-city', profile.bank_city);
    setInputValue('kyc-bank-country', profile.bank_country);
    setInputValue('kyc-bank-phone', profile.bank_phone);
    setInputValue('kyc-bank-officer', profile.bank_officer);
    setInputValue('kyc-bank-officer-phone', profile.bank_officer_phone);
    setInputValue('kyc-bank-officer-email', profile.bank_officer_email);
    setInputValue('kyc-account-name', profile.account_name);
    setInputValue('kyc-account-number', profile.account_number);
    setInputValue('kyc-iban', profile.iban);
    setInputValue('kyc-swift-bic', profile.swift_bic);
    setInputValue('kyc-account-signatory', profile.account_signatory);

    setInputValue('kyc-bank-contacts', formatDelimitedLines(profile.bank_contacts, ['function', 'name', 'phone', 'email']));
    setInputValue('kyc-trade-references', formatDelimitedLines(profile.trade_references, ['customer', 'country']));
    setCheckboxValue('kyc-bank-reference-letter', profile.bank_reference_letter_appendix);
    setInputValue('kyc-fixtures-last-three', profile.fixtures_last_three);

    const productValues = Array.isArray(profile.products) ? profile.products : [];
    document.querySelectorAll('.kyc-product').forEach(cb => {
        cb.checked = productValues.includes(cb.value);
    });

    const cifValue = profile.cif_basis === true ? 'yes' : (profile.cif_basis === false ? 'no' : '');
    setInputValue('kyc-cif-basis', cifValue);
    updateBankOfficer2Hint();
    ensureKorasSubsidiariesPrefill(profile);
}

function parseDelimitedLines(text, keys) {
    const lines = text.split('\n').map(line => line.trim()).filter(Boolean);
    return lines.map(line => {
        const parts = line.split('|').map(part => part.trim());
        const entry = {};
        keys.forEach((key, idx) => {
            entry[key] = parts[idx] || '';
        });
        return entry;
    });
}

function ensureKorasSubsidiariesPrefill(profile) {
    const companyName = profile?.company_name ?? getInputValue('kyc-company-name');
    if (!isKorasCompany(companyName)) return;
    const subsidiariesEl = document.getElementById('kyc-subsidiaries');
    if (!subsidiariesEl) return;
    const currentValue = (subsidiariesEl.value || '').trim();
    if (currentValue.length === 0) {
        subsidiariesEl.value = KORAS_SUBSIDIARIES_LIST;
    }
}

function updateBankOfficer2Hint() {
    const hintEl = document.getElementById('kyc-bank-officer2-hint');
    if (!hintEl) return;
    const normalize = value => (value || '').toString().trim().toLowerCase();
    const officer1 = {
        name: getInputValue('kyc-bank-officer'),
        phone: getInputValue('kyc-bank-officer-phone'),
        email: getInputValue('kyc-bank-officer-email')
    };
    const hasOfficer1 = normalize(officer1.name) || normalize(officer1.phone) || normalize(officer1.email);
    const contacts = parseDelimitedLines(
        document.getElementById('kyc-bank-contacts')?.value || '',
        ['function', 'name', 'phone', 'email']
    ).filter(contact => {
        return normalize(contact.name) || normalize(contact.phone) || normalize(contact.email);
    });
    const isSameContact = (a, b) => {
        if (!a || !b) return false;
        return normalize(a.name) === normalize(b.name) &&
            normalize(a.phone) === normalize(b.phone) &&
            normalize(a.email) === normalize(b.email);
    };
    const hasOfficer2 = contacts.some(contact => {
        if (!hasOfficer1) return true;
        return !isSameContact(officer1, contact);
    });
    if (hasOfficer2) {
        hintEl.textContent = '';
        hintEl.style.display = 'none';
    } else {
        hintEl.textContent = 'Bank Officer 2 leer';
        hintEl.style.display = 'block';
    }
}

function formatDelimitedLines(items, keys) {
    if (!Array.isArray(items)) return '';
    return items
        .map(item => keys.map(key => item?.[key] || '').join(' | '))
        .filter(line => line.replace(/\s|\|/g, '').length > 0)
        .join('\n');
}

function getInputValue(id) {
    const el = document.getElementById(id);
    return el ? el.value.trim() : '';
}

function parseNumberValue(value) {
    if (value === '' || value === null || value === undefined) return null;
    const num = Number(value);
    return Number.isFinite(num) ? num : null;
}

function setInputValue(id, value) {
    const el = document.getElementById(id);
    if (!el) return;
    el.value = value ?? '';
}

function setCheckboxValue(id, checked) {
    const el = document.getElementById(id);
    if (!el) return;
    el.checked = Boolean(checked);
}

function formatDateInput(value) {
    if (!value) return '';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return '';
    return date.toISOString().slice(0, 10);
}

async function createContactsFromKyc() {
    const statusEl = document.getElementById('kyc-status');
    if (!currentDeal?.id) {
        alert('Kein Geschäft ausgewählt');
        return;
    }
    if (!window.currentDealKyc) {
        alert('Keine KYC-Daten geladen. Bitte erst speichern und erneut laden.');
        return;
    }
    if (demoMode || window.demoMode) {
        if (statusEl) {
            statusEl.textContent = 'Demo-Modus: Kontakte werden nicht erstellt';
            statusEl.classList.remove('status-success', 'status-error');
            statusEl.classList.add('status-muted');
        }
        return;
    }
    if (!supabase) return;

    const kyc = window.currentDealKyc || {};
    const role = currentKycRole || 'Buyer';

    const bankContacts = Array.isArray(kyc.bank_contacts) ? kyc.bank_contacts : [];
    const bankContactEntries = bankContacts
        .map((contact) => {
            const functionLabel = (contact.function || '').trim();
            const roleLabel = functionLabel
                ? `Bank Officer (${role}) - ${functionLabel}`
                : `Bank Officer (${role})`;
            return {
                role: roleLabel,
                full_name: contact.name || '',
                company: kyc.bank_name || '',
                email: contact.email || '',
                phone: contact.phone || '',
                notes: functionLabel || null
            };
        })
        .filter(entry => entry.full_name || entry.company);

    const contactsToCreate = [
        {
            role: role,
            full_name: kyc.authorized_signatory_name || '',
            company: kyc.company_name || '',
            email: kyc.business_email || '',
            phone: kyc.phone || ''
        },
        {
            role: `Legal Counsel (${role})`,
            full_name: kyc.legal_counsel_name || '',
            company: kyc.legal_counsel_name ? '' : '',
            email: kyc.legal_counsel_email || '',
            phone: kyc.legal_counsel_phone || ''
        },
        {
            role: `Bank Officer (${role})`,
            full_name: kyc.bank_officer || '',
            company: kyc.bank_name || '',
            email: kyc.bank_officer_email || '',
            phone: kyc.bank_officer_phone || kyc.bank_phone || ''
        }
    ].concat(bankContactEntries).filter(c => c.full_name || c.company);

    if (!contactsToCreate.length) {
        alert('Keine Kontaktinformationen im KYC gefunden.');
        return;
    }

    let mainContactId = null;
    for (const entry of contactsToCreate) {
        const contactId = await findOrCreateContact(entry);
        if (contactId) {
            await linkContactToDeal(contactId, entry.role, currentDeal.id, entry.notes);
            if (!mainContactId && entry.role === role) {
                mainContactId = contactId;
            }
        }
    }

    if (mainContactId) {
        await upsertDealBankAccountFromKyc(mainContactId, currentDeal.id, kyc);
    }

    if (statusEl) {
        statusEl.textContent = `Kontakte aus KYC erstellt (${role})`;
        statusEl.classList.remove('status-error', 'status-muted');
        statusEl.classList.add('status-success');
    }
    await loadDealContacts(currentDeal.id);
}

async function handleKycSignedUpload() {
    const statusEl = document.getElementById('kyc-status');
    if (!currentDeal?.id) {
        alert('Kein Geschäft ausgewählt');
        return;
    }
    const fileInput = document.getElementById('kyc-signed-file');
    const file = fileInput?.files?.[0];
    if (!file) {
        alert('Bitte PDF-Datei auswählen');
        return;
    }
    if (!supabase) return;
    const role = (currentKycRole || 'Buyer').toUpperCase();
    const docType = `KYC_SIGNED_${role}`;
    try {
        await uploadDocument(currentDeal.id, currentDeal.deal_no, 3, file, docType);
        if (fileInput) fileInput.value = '';
        await loadKycUploads(currentDeal.id, currentKycRole || 'Buyer');
        if (statusEl) {
            statusEl.textContent = `KYC-PDF hochgeladen (${currentKycRole})`;
            statusEl.classList.remove('status-error', 'status-muted');
            statusEl.classList.add('status-success');
        }
    } catch (error) {
        console.error('Error uploading KYC PDF:', error);
        if (statusEl) {
            statusEl.textContent = 'KYC-PDF Upload fehlgeschlagen';
            statusEl.classList.remove('status-success', 'status-muted');
            statusEl.classList.add('status-error');
        }
        alert(`KYC-PDF Upload fehlgeschlagen: ${error.message || error}`);
    }
}

async function loadKycUploads(dealId, role) {
    const listEl = document.getElementById('kyc-upload-list');
    const pdfStatusEl = document.getElementById('kyc-pdf-status');
    if (!listEl) return;
    if (!dealId) {
        listEl.innerHTML = '<p class="text-secondary">Kein Geschäft ausgewählt.</p>';
        if (pdfStatusEl) {
            pdfStatusEl.textContent = '';
            pdfStatusEl.className = 'text-secondary';
        }
        return;
    }
    if (demoMode || window.demoMode) {
        listEl.innerHTML = '<p class="text-secondary">Demo-Modus: Keine Uploads.</p>';
        if (pdfStatusEl) {
            setKycPdfStatus(pdfStatusEl, 'Demo', { Buyer: 0, Seller: 0, Producer: 0 }, 'muted');
        }
        return;
    }
    if (!supabase) return;

    let totalCount = null;
    let roleFlags = { Buyer: 0, Seller: 0, Producer: 0 };
    if (pdfStatusEl) {
        const { data: allDocs, error: allDocsError } = await supabase
            .from('documents')
            .select('doc_type')
            .eq('deal_id', dealId)
            .like('doc_type', 'KYC_SIGNED_%');
        if (allDocsError) {
            setKycPdfStatus(pdfStatusEl, 'Fehler', roleFlags, 'error');
        } else {
            const docs = allDocs || [];
            totalCount = docs.length;
            docs.forEach(doc => {
                const roleKey = (doc.doc_type || '').replace('KYC_SIGNED_', '');
                if (roleKey === 'BUYER') roleFlags.Buyer += 1;
                if (roleKey === 'SELLER') roleFlags.Seller += 1;
                if (roleKey === 'PRODUCER') roleFlags.Producer += 1;
            });
        }
    }

    const docType = `KYC_SIGNED_${(role || 'Buyer').toUpperCase()}`;
    const { data, error } = await supabase
        .from('documents')
        .select('id, file_name, file_path, uploaded_at')
        .eq('deal_id', dealId)
        .eq('doc_type', docType)
        .order('uploaded_at', { ascending: false });

    if (error) {
        console.error('Error loading KYC uploads:', error);
        listEl.innerHTML = '<p class="text-secondary">KYC Uploads konnten nicht geladen werden.</p>';
        if (pdfStatusEl) {
            const totalLabel = totalCount === null ? 'Fehler' : `${totalCount} gesamt`;
            setKycPdfStatus(pdfStatusEl, totalLabel, roleFlags, 'error');
        }
        return;
    }

    if (!data || data.length === 0) {
        listEl.innerHTML = '<p class="text-secondary">Keine KYC PDFs hochgeladen.</p>';
        if (pdfStatusEl) {
            const totalLabel = totalCount === null ? '0 gesamt' : `${totalCount} gesamt`;
            setKycPdfStatus(pdfStatusEl, totalLabel, roleFlags, 'muted');
        }
        return;
    }

    if (pdfStatusEl) {
        const totalLabel = totalCount === null ? `${data.length} gesamt` : `${totalCount} gesamt`;
        setKycPdfStatus(pdfStatusEl, totalLabel, roleFlags, 'success');
    }

    listEl.innerHTML = data.map(doc => `
        <div class="document-item">
            <div>
                <strong>${doc.file_name}</strong>
                <div class="text-secondary" style="font-size: 0.75rem;">
                    ${new Date(doc.uploaded_at).toLocaleString('de-DE')}
                </div>
            </div>
            <div class="document-actions">
                <button class="btn btn-sm btn-secondary" onclick="downloadDocumentFile('${doc.file_path}', '${doc.file_name}')">
                    <i class="ti ti-download"></i>
                </button>
            </div>
        </div>
    `).join('');
}

function setKycPdfStatus(el, totalLabel, roleFlags, state) {
    if (!el) return;
    el.className = 'text-secondary';
    const sellerClass = roleFlags.Seller > 0 ? 'status-success' : 'status-error';
    const producerClass = roleFlags.Producer > 0 ? 'status-success' : 'status-error';
    const buyerClass = roleFlags.Buyer > 0 ? 'status-success' : 'status-error';
    el.innerHTML = `<span class="text-secondary">KYC-PDFs: ${totalLabel}</span><br><span style="white-space:nowrap;"><span class="${sellerClass}">Seller</span> · <span class="${producerClass}">Producer</span> · <span class="${buyerClass}">Buyer</span></span>`;
}

async function upsertDealBankAccountFromKyc(contactId, dealId, kyc) {
    const bankName = (kyc.bank_name || '').trim();
    const iban = (kyc.iban || '').trim();
    const bic = (kyc.swift_bic || '').trim();
    const accountHolder = (kyc.account_name || kyc.account_signatory || '').trim();
    if (!bankName && !iban && !bic && !accountHolder) return;

    const { data: existing, error: findError } = await supabase
        .from('deal_bank_accounts')
        .select('id')
        .eq('deal_id', dealId)
        .eq('contact_id', contactId)
        .eq('bank_name', bankName)
        .eq('iban', iban)
        .eq('bic', bic)
        .eq('account_holder', accountHolder)
        .limit(1);

    if (!findError && existing && existing.length) {
        return;
    }

    const { error: insertError } = await supabase
        .from('deal_bank_accounts')
        .insert({
            deal_id: dealId,
            contact_id: contactId,
            bank_name: bankName || null,
            iban: iban || null,
            bic: bic || null,
            account_holder: accountHolder || null
        });
    if (insertError) {
        console.error('Error inserting bank info from KYC:', insertError);
    }
}

async function findOrCreateContact(entry) {
    const fullName = (entry.full_name || '').trim();
    const company = (entry.company || '').trim();
    if (!fullName && !company) return null;

    const { data: existing, error: findError } = await supabase
        .from('contacts')
        .select('id')
        .eq('full_name', fullName)
        .eq('company', company)
        .limit(1);

    if (!findError && existing && existing.length) {
        return existing[0].id;
    }

    const { data: created, error: insertError } = await supabase
        .from('contacts')
        .insert({
            full_name: fullName || company || 'Unbekannt',
            role: entry.role || null,
            company: company || null,
            email: entry.email || null,
            phone: entry.phone || null
        })
        .select('id')
        .single();

    if (insertError) {
        console.error('Error creating contact from KYC:', insertError);
        return null;
    }
    return created?.id || null;
}

async function linkContactToDeal(contactId, role, dealId, notes = null) {
    if (!contactId || !dealId) return;
    const { data: existing, error: findError } = await supabase
        .from('deal_contacts')
        .select('id, notes')
        .eq('deal_id', dealId)
        .eq('contact_id', contactId)
        .limit(1);
    if (!findError && existing && existing.length) {
        const existingNotes = existing[0].notes || '';
        if (notes && !existingNotes) {
            await supabase
                .from('deal_contacts')
                .update({ notes })
                .eq('id', existing[0].id);
        }
        return;
    }
    const { error: insertError } = await supabase
        .from('deal_contacts')
        .insert({
            deal_id: dealId,
            contact_id: contactId,
            role: role || null,
            notes: notes || null
        });
    if (insertError) {
        console.error('Error linking contact to deal:', insertError);
    }
}

function kycHasData(payload) {
    if (!payload) return false;
    const ignoredKeys = new Set(['deal_id', 'deal_no', 'party_role', 'id']);
    return Object.entries(payload).some(([key, value]) => {
        if (ignoredKeys.has(key)) return false;
        if (Array.isArray(value)) return value.length > 0;
        if (typeof value === 'boolean') return value === true;
        if (typeof value === 'number') return Number.isFinite(value);
        if (value && typeof value === 'object') return Object.keys(value).length > 0;
        return value !== null && value !== undefined && String(value).trim() !== '';
    });
}

async function maybeMoveKycProfile(dealId, fromRole, toRole) {
    if (!supabase || !dealId) return;
    if (!currentKycProfileId) return;
    const { data: target, error: targetError } = await supabase
        .from('kyc_profiles')
        .select('id')
        .eq('deal_id', dealId)
        .eq('party_role', toRole)
        .maybeSingle();
    if (targetError) {
        console.error('Error checking target KYC role:', targetError);
        return;
    }
    if (target?.id) {
        return;
    }
    const confirmMove = confirm(
        `KYC-Daten von ${fromRole} nach ${toRole} verschieben? (Zielrolle ist leer)`
    );
    if (!confirmMove) return;

    const { error: moveError } = await supabase
        .from('kyc_profiles')
        .update({ party_role: toRole })
        .eq('id', currentKycProfileId);
    if (moveError) {
        console.error('Error moving KYC profile role:', moveError);
        alert(`KYC-Rolle konnte nicht verschoben werden: ${moveError.message}`);
        return;
    }

    const fromDocType = `KYC_SIGNED_${String(fromRole || '').toUpperCase()}`;
    const toDocType = `KYC_SIGNED_${String(toRole || '').toUpperCase()}`;
    const { error: docMoveError } = await supabase
        .from('documents')
        .update({ doc_type: toDocType })
        .eq('deal_id', dealId)
        .eq('doc_type', fromDocType);
    if (docMoveError) {
        console.error('Error moving KYC signed PDFs:', docMoveError);
        alert(`KYC-PDF konnte nicht verschoben werden: ${docMoveError.message}`);
    }
}

async function cleanupKycSignedPdfs() {
    const panel = document.getElementById('kyc-pdf-panel');
    if (!panel) return;
    if (panel.style.display === 'none' || panel.style.display === '') {
        panel.style.display = 'block';
        await loadAllKycPdfs(currentDeal?.id);
    } else {
        panel.style.display = 'none';
    }
}

async function openGeneratorFromKyc() {
    const dealId = currentDeal?.id || lastGeneratorDealId;
    try {
        const { openGeneratorHub } = await import('./generator.js');
        await openGeneratorHub();
        if (dealId) {
            const select = document.getElementById('generator-deal-select');
            if (select) {
                select.value = dealId;
                select.dispatchEvent(new Event('change'));
            }
            if (typeof window.setGeneratorDealContext === 'function') {
                await window.setGeneratorDealContext(dealId);
            }
        }
    } catch (err) {
        console.error('Open generator from KYC failed:', err);
        alert(`Generator-Hub fehlgeschlagen: ${err.message || err}`);
    }
}

function printKycProfile() {
    if (!currentDeal?.id) {
        alert('Kein Geschäft ausgewählt');
        return;
    }
    if (!window.currentDealKyc) {
        alert('Keine KYC-Daten geladen');
        return;
    }
    const kyc = window.currentDealKyc;
    const roleLabel = currentKycRole || 'Buyer';
    const dealNo = currentDeal?.deal_no || '';

    const rows = (label, value) => `
        <tr>
            <td class="label">${label}</td>
            <td class="value">${value || ''}</td>
        </tr>
    `;

    const checkbox = checked => (checked ? '☒' : '☐');
    const roles = Array.isArray(kyc.company_roles) ? kyc.company_roles.map(role => String(role).toLowerCase()) : [];
    const hasRole = role => roles.includes(role);

    const products = Array.isArray(kyc.products) ? kyc.products.map(item => String(item).toLowerCase()) : [];
    const hasProduct = name => products.includes(String(name).toLowerCase());
    const productOptions = [
        'Gold', 'Ruthenium',
        'Silver', 'Other Refinery Machinery',
        'Platinum', '',
        'Palladium', '',
        'Rhodium', '',
        'Iridium', ''
    ];

    const tradeRefs = Array.isArray(kyc.trade_references) ? kyc.trade_references : [];
    const bankContacts = Array.isArray(kyc.bank_contacts) ? kyc.bank_contacts : [];
    const cifYes = kyc.cif_basis === true;
    const cifNo = kyc.cif_basis === false;
    const isKorasKyc = isKorasCompany(kyc.company_name);
    const korasLogoSrc = `${window.location.origin}/assets/koras-logo.png`;

    const formatSubsidiariesForPrint = (value) => {
        if (!value) return '';
        const items = value
            .split(/\r?\n|,/)
            .map(item => item.trim())
            .filter(Boolean)
            .map(item => item.replace('WE³Rec', 'WE<sup>3</sup>Rec'));
        if (items.length === 0) return '';
        return `<ul class="subsidiaries-list">${items.map(item => `<li>${item}</li>`).join('')}</ul>`;
    };
    const subsidiariesSource = (isKorasKyc && (!kyc.subsidiaries || !kyc.subsidiaries.trim()))
        ? KORAS_SUBSIDIARIES_LIST
        : kyc.subsidiaries;
    const subsidiariesHtml = formatSubsidiariesForPrint(subsidiariesSource);

    const bankOfficer1 = kyc.bank_officer || kyc.bank_officer_phone || kyc.bank_officer_email
        ? {
            function: 'Bank Officer 1',
            name: kyc.bank_officer || '',
            phone: kyc.bank_officer_phone || '',
            email: kyc.bank_officer_email || ''
        }
        : null;
    const normalizeContactField = value => (value || '').toString().trim().toLowerCase();
    const isSameContact = (a, b) => {
        if (!a || !b) return false;
        const nameMatch = normalizeContactField(a.name) === normalizeContactField(b.name);
        const phoneMatch = normalizeContactField(a.phone) === normalizeContactField(b.phone);
        const emailMatch = normalizeContactField(a.email) === normalizeContactField(b.email);
        return nameMatch && phoneMatch && emailMatch;
    };
    const officer2Candidate = bankContacts.find(contact => {
        if (!contact) return false;
        const hasData = normalizeContactField(contact.name) ||
            normalizeContactField(contact.phone) ||
            normalizeContactField(contact.email);
        return hasData && !isSameContact(bankOfficer1, contact);
    });
    const useOfficer2 = Boolean(officer2Candidate);
    const bankOfficer2 = useOfficer2
        ? { function: 'Bank Officer 2', ...officer2Candidate }
        : { function: 'Bank Officer 2', name: '', phone: '', email: '' };
    const extraBankContacts = bankContacts.filter(contact => {
        if (!contact) return false;
        const hasData = normalizeContactField(contact.name) ||
            normalizeContactField(contact.phone) ||
            normalizeContactField(contact.email);
        if (!hasData) return false;
        if (isSameContact(bankOfficer1, contact)) return false;
        if (useOfficer2 && isSameContact(bankOfficer2, contact)) return false;
        return true;
    });

    const html = `
        <html>
        <head>
            <title>KYC ${dealNo} – ${roleLabel}</title>
            <style>
                body { font-family: Arial, sans-serif; padding: 18px; color: #111; font-size: 11.5px; line-height: 1.25; }
                body.koras-kyc { padding-top: 70px; }
                .sheet-title { text-align: center; font-size: 15px; font-weight: 700; margin: 0 0 6px; }
                .koras-logo { position: fixed; top: 12px; right: 16px; width: 160px; }
                .meta-row { width: 100%; border-collapse: collapse; margin-bottom: 8px; }
                .meta-row td { border: 1px solid #000; padding: 5px 7px; }
                h2 { font-size: 11.5px; margin: 12px 0 5px; text-transform: uppercase; letter-spacing: 0.02em; }
                table { width: 100%; border-collapse: collapse; margin-top: 4px; }
                td, th { border: 1px solid #000; padding: 5px 7px; vertical-align: top; }
                th { background: #f3f3f3; text-align: left; }
                .two-col col.label-col { width: 34%; }
                .two-col col.value-col { width: 66%; }
                .label { font-weight: 700; background: #f3f3f3; }
                .value { }
                .section-note { font-size: 10.5px; margin-top: 5px; }
                .checkbox { display: inline-block; min-width: 18px; text-align: center; font-weight: 700; }
                .inline-pair { display: inline-block; margin-right: 14px; }
                .signature-row td { height: 52px; }
                .subsidiaries-list { margin: 0; padding-left: 18px; }
                .subsidiaries-list li { margin: 0 0 2px; }
            </style>
        </head>
        <body class="${isKorasKyc ? 'koras-kyc' : ''}">
            ${isKorasKyc ? `<img class="koras-logo" src="${korasLogoSrc}" alt="Koras Logo" />` : ''}
            <div class="sheet-title">KYC Sheet</div>
            <table class="meta-row two-col">
                <colgroup>
                    <col class="label-col" />
                    <col class="value-col" />
                </colgroup>
                <tr>
                    <td class="label">Date</td>
                    <td>${kyc.date || ''}</td>
                </tr>
            </table>

            <h2>Company Address</h2>
            <table class="two-col">
                <colgroup>
                    <col class="label-col" />
                    <col class="value-col" />
                </colgroup>
                ${rows('Company Name', kyc.company_name)}
                ${rows('Authorized Signatory; name + title', [kyc.authorized_signatory_name, kyc.authorized_signatory_title].filter(Boolean).join(', '))}
                ${rows('Passport No.', kyc.passport_no)}
                ${rows('Street', kyc.street)}
                ${rows('City', kyc.city)}
                ${rows('Postal Code', kyc.postal_code)}
                ${rows('Country', kyc.country)}
                ${rows('Phone No.', kyc.phone)}
                ${rows('Business Corporate E-mail Address', kyc.business_email)}
                ${rows('Business Website', kyc.business_website)}
                ${rows('Tax Identification Number', kyc.tax_id)}
                ${rows('VAT/BTW Number', kyc.vat_no)}
            </table>

            <h2>Company Data</h2>
            <table class="two-col">
                <colgroup>
                    <col class="label-col" />
                    <col class="value-col" />
                </colgroup>
                <tr>
                    <td class="label">Are you a Seller or Buyer</td>
                    <td class="value">
                        <span class="inline-pair"><span class="checkbox">${checkbox(hasRole('buyer'))}</span> Buyer</span>
                        <span class="inline-pair"><span class="checkbox">${checkbox(hasRole('seller'))}</span> Seller</span>
                        <span class="inline-pair"><span class="checkbox">${checkbox(hasRole('producer'))}</span> Producer</span>
                    </td>
                </tr>
                ${rows('Raw material of precious metal', kyc.raw_material)}
                ${rows('Refined bars of precious metals', kyc.refined_bars)}
                ${rows('Precious metal refining machinery', kyc.refining_machinery)}
                ${rows('Type of Business', kyc.type_of_business)}
                ${rows('Incorporation Date', kyc.incorporation_date || '')}
                ${rows('Shareholder/Owner', kyc.shareholder_owner)}
                ${rows('Total number of Employees', kyc.employees_count)}
                ${rows('Subsidiaries', subsidiariesHtml || (kyc.subsidiaries || ''))}
            </table>

            <h2>Primary Contact Person</h2>
            <table class="two-col">
                <colgroup>
                    <col class="label-col" />
                    <col class="value-col" />
                </colgroup>
                ${rows('First Name', kyc.primary_contact_first_name)}
                ${rows('Last Name', kyc.primary_contact_last_name)}
                ${rows('Function', kyc.primary_contact_function)}
                ${rows('Phone No.', kyc.primary_contact_phone)}
                ${rows('Business E-mail Address', kyc.primary_contact_email)}
            </table>

            <h2>Legal Counsel / Corporate Law Firm</h2>
            <table class="two-col">
                <colgroup>
                    <col class="label-col" />
                    <col class="value-col" />
                </colgroup>
                ${rows('Name', kyc.legal_counsel_name)}
                ${rows('Street', kyc.legal_counsel_street)}
                ${rows('Postal Code', kyc.legal_counsel_postal_code)}
                ${rows('City', kyc.legal_counsel_city)}
                ${rows('Country', kyc.legal_counsel_country)}
                ${rows('Phone', kyc.legal_counsel_phone)}
                ${rows('E-mail', kyc.legal_counsel_email)}
                ${rows('Website', kyc.legal_counsel_website)}
            </table>

            <h2>Bank</h2>
            <table class="two-col">
                <colgroup>
                    <col class="label-col" />
                    <col class="value-col" />
                </colgroup>
                ${rows('Name', kyc.bank_name)}
                ${rows('Street', kyc.bank_street)}
                ${rows('Postal Code', kyc.bank_postal_code)}
                ${rows('City', kyc.bank_city)}
                ${rows('Country', kyc.bank_country)}
                ${rows('Phone', kyc.bank_phone)}
                ${rows('Bank Officer', kyc.bank_officer)}
                ${rows('Direct Phone', kyc.bank_officer_phone)}
                ${rows('Direct E-mail address', kyc.bank_officer_email)}
                ${rows('Account Name', kyc.account_name)}
                ${rows('Account Number', kyc.account_number)}
                ${rows('IBAN', kyc.iban)}
                ${rows('SWIFT CODE / BIC', kyc.swift_bic)}
                ${rows('Account Signatory', kyc.account_signatory)}
            </table>
            <div class="section-note">*Please also add the bank reference letter in the appendix.</div>

            <h2>Bank Contact People</h2>
            <table>
                <tr>
                    <th>Function</th>
                    <th>Name</th>
                    <th>Direct Phone nr.</th>
                    <th>Email address</th>
                </tr>
                ${[
                    ...(bankOfficer1 ? [bankOfficer1] : []),
                    bankOfficer2,
                    ...extraBankContacts
                ].map(contact => `
                    <tr>
                        <td>${contact.function || ''}</td>
                        <td>${contact.name || ''}</td>
                        <td>${contact.phone || ''}</td>
                        <td>${contact.email || ''}</td>
                    </tr>
                `).join('')}
            </table>

            <h2>What kind of products can/will you supply/buy?</h2>
            <table>
                ${productOptions.reduce((rowsHtml, option, index) => {
                    if (index % 2 !== 0) return rowsHtml;
                    const left = option;
                    const right = productOptions[index + 1] || '';
                    return rowsHtml + `
                        <tr>
                            <td>${left ? `<span class="checkbox">${checkbox(hasProduct(left))}</span> ${left}` : ''}</td>
                            <td>${right ? `<span class="checkbox">${checkbox(hasProduct(right))}</span> ${right}` : ''}</td>
                        </tr>
                    `;
                }, '')}
            </table>

            <h2>Trade References</h2>
            <table>
                <tr>
                    <th>Main Customers</th>
                    <th>Country</th>
                </tr>
                ${tradeRefs.map(ref => `
                    <tr>
                        <td>${ref.customer || ''}</td>
                        <td>${ref.country || ''}</td>
                    </tr>
                `).join('')}
            </table>
            <table class="two-col" style="margin-top:8px;">
                <colgroup>
                    <col class="label-col" />
                    <col class="value-col" />
                </colgroup>
                <tr>
                    <td class="label">Did you ever do a deal on CIF basis?</td>
                    <td class="value">
                        <span class="inline-pair"><span class="checkbox">${checkbox(cifYes)}</span> Yes</span>
                        <span class="inline-pair"><span class="checkbox">${checkbox(cifNo)}</span> No</span>
                    </td>
                </tr>
                ${rows('If yes, please add the last three fixtures in the appendix.', kyc.fixtures_last_three)}
            </table>

            <table class="signature-row" style="margin-top:16px;">
                <tr>
                    <td style="width:50%"><strong>Signature:</strong></td>
                    <td style="width:50%"><strong>Corporate Seal:</strong></td>
                </tr>
            </table>
        </body>
        </html>
    `;

    const printWindow = window.open('', '_blank');
    if (printWindow) {
        printWindow.document.open();
        printWindow.document.write(html);
        printWindow.document.close();
        printWindow.focus();
        printWindow.onload = () => {
            printWindow.focus();
            printWindow.print();
        };
        return;
    }

    const iframe = document.createElement('iframe');
    iframe.style.position = 'fixed';
    iframe.style.right = '0';
    iframe.style.bottom = '0';
    iframe.style.width = '0';
    iframe.style.height = '0';
    iframe.style.border = '0';
    iframe.srcdoc = html;
    document.body.appendChild(iframe);
    iframe.onload = () => {
        iframe.contentWindow?.focus();
        iframe.contentWindow?.print();
        setTimeout(() => iframe.remove(), 1000);
    };
}

async function loadAllKycPdfs(dealId) {
    const listEl = document.getElementById('kyc-pdf-list');
    const uploadStatusEl = document.getElementById('kyc-upload-status');
    if (!listEl) return;
    if (!dealId) {
        listEl.innerHTML = '<p class="text-secondary">Kein Geschäft ausgewählt.</p>';
        if (uploadStatusEl) {
            uploadStatusEl.textContent = '';
            uploadStatusEl.classList.remove('status-success', 'status-error');
            uploadStatusEl.classList.add('status-muted');
        }
        return;
    }
    if (!supabase) return;

    const { data, error } = await supabase
        .from('documents')
        .select('id, doc_type, file_name, file_path, uploaded_at')
        .eq('deal_id', dealId)
        .like('doc_type', 'KYC_SIGNED_%')
        .order('uploaded_at', { ascending: false });

    if (error) {
        console.error('Error loading KYC PDFs:', error);
        listEl.innerHTML = '<p class="text-secondary">KYC-PDFs konnten nicht geladen werden.</p>';
        if (uploadStatusEl) {
            uploadStatusEl.textContent = 'KYC-PDFs: Fehler';
            uploadStatusEl.classList.remove('status-success', 'status-muted');
            uploadStatusEl.classList.add('status-error');
        }
        return;
    }

    const docs = data || [];
    if (docs.length === 0) {
        listEl.innerHTML = '<p class="text-secondary">Keine KYC-PDFs vorhanden.</p>';
        if (uploadStatusEl) {
            uploadStatusEl.textContent = 'KYC-PDFs: 0 gesamt';
            uploadStatusEl.classList.remove('status-success', 'status-error');
            uploadStatusEl.classList.add('status-muted');
        }
        return;
    }
    if (uploadStatusEl) {
        uploadStatusEl.textContent = `KYC-PDFs: ${docs.length} gesamt`;
        uploadStatusEl.classList.remove('status-error');
        uploadStatusEl.classList.add('status-success');
    }

    const roleOptions = ['Buyer', 'Seller', 'Producer']
        .map(role => `<option value="${role}">${role}</option>`)
        .join('');

    listEl.innerHTML = docs.map(doc => {
        const currentRole = (doc.doc_type || '').replace('KYC_SIGNED_', '') || '-';
        return `
            <div class="document-item">
                <div>
                    <strong>${doc.file_name}</strong>
                    <div class="text-secondary" style="font-size: 0.75rem;">
                        Rolle: ${currentRole} · ${new Date(doc.uploaded_at).toLocaleString('de-DE')}
                    </div>
                </div>
                <div class="document-actions" style="display:flex; gap:0.5rem; align-items:center;">
                    <select class="select select-sm" data-kyc-target="${doc.id}">
                        ${roleOptions}
                    </select>
                    <button class="btn btn-sm btn-secondary" data-kyc-move="${doc.id}">
                        <i class="ti ti-transfer"></i>
                    </button>
                    <button class="btn btn-sm btn-secondary" onclick="downloadDocumentFile('${doc.file_path}', '${doc.file_name}')">
                        <i class="ti ti-download"></i>
                    </button>
                </div>
            </div>
        `;
    }).join('');

    docs.forEach(doc => {
        const select = listEl.querySelector(`select[data-kyc-target="${doc.id}"]`);
        const currentRole = (doc.doc_type || '').replace('KYC_SIGNED_', '') || '';
        if (select && currentRole) {
            select.value = currentRole;
        }
    });

    listEl.querySelectorAll('[data-kyc-move]').forEach(btn => {
        btn.addEventListener('click', async () => {
            const docId = btn.getAttribute('data-kyc-move');
            const select = listEl.querySelector(`select[data-kyc-target="${docId}"]`);
            const targetRole = select?.value || '';
            await moveKycPdfDoc(docId, targetRole);
        });
    });
}

async function moveKycPdfDoc(docId, targetRole) {
    if (!supabase) return;
    if (!docId || !targetRole) return;
    const targetType = `KYC_SIGNED_${String(targetRole).toUpperCase()}`;
    const { error } = await supabase
        .from('documents')
        .update({ doc_type: targetType })
        .eq('id', docId);
    if (error) {
        console.error('Error moving KYC PDF:', error);
        alert(`KYC-PDF konnte nicht verschoben werden: ${error.message}`);
        return;
    }
    await loadKycUploads(currentDeal?.id, currentKycRole || 'Buyer');
    await loadAllKycPdfs(currentDeal?.id);
}

function renderDealContacts(links) {
    const list = document.getElementById('deal-contacts-list');
    if (!list) return;
    if (links.length === 0) {
        list.innerHTML = '<p class="text-secondary">Keine Kontakte zugeordnet.</p>';
        return;
    }

    const uniqueMap = new Map();
    links.forEach(link => {
        const contactId = link.contact?.id || `${link.contact?.full_name || ''}-${link.role || ''}`;
        const existing = uniqueMap.get(contactId);
        const roleLabel = [link.role, link.contact?.role].filter(Boolean).join(' · ');
        if (existing) {
            if (roleLabel) existing.roles.add(roleLabel);
            if (link.notes) existing.notes.push(link.notes);
        } else {
            uniqueMap.set(contactId, {
                contact: link.contact || {},
                roles: new Set(roleLabel ? [roleLabel] : []),
                notes: link.notes ? [link.notes] : []
            });
        }
    });
    const uniqueLinks = Array.from(uniqueMap.values());

    const participation = getDiscountParticipationForDeal(currentDeal || {});
    const requiredCounts = {
        seller: participation.allocations.sellerSide.filter(item => item.enabled).length,
        buyer: participation.allocations.buyerSide.filter(item => item.enabled).length +
            participation.allocations.netToBuyer.filter(item => item.enabled).length
    };

    const sections = [
        { key: 'seller', title: 'Seller' },
        { key: 'buyer', title: 'Buyer' },
        { key: 'bank', title: 'Bank+Customs' },
        { key: 'service', title: 'Service Provider' }
    ];

    const itemsWithSection = uniqueLinks.map(item => {
        const roleText = [
            Array.from(item.roles).join(' '),
            item.contact?.role || '',
            item.contact?.company || '',
            item.contact?.full_name || '',
            item.notes.join(' ')
        ].join(' ');
        return { ...item, sectionKey: getContactSectionKey(roleText) };
    });

    const sectionHtml = sections.map(section => {
        const items = itemsWithSection.filter(item => item.sectionKey === section.key);
        const missing = section.key === 'seller' || section.key === 'buyer'
            ? Math.max(0, (requiredCounts[section.key] || 0) - items.length)
            : 0;
        return renderContactSection(section.title, items, missing);
    }).join('');

    list.innerHTML = sectionHtml;
}

function normalizeCommodityTypeForDb(value) {
    if (value === 'Doré' || value === 'Hallmark') return value;
    if (value === 'Minted Bars') return 'Hallmark';
    if (value === 'Cast Bars') return 'Doré';
    return 'Doré';
}

function getCommodityLabelFromValue(value) {
    const map = {
        'Doré': 'Doré Gold Bars',
        'Hallmark': 'Gestempeltes Tafelgold/Hallmark',
        'Gold Dust / Nuggets / Lumps': 'Gold Dust / Nuggets / Lumps',
        'Scrap / Melt': 'Srap / Melt',
        'Granulat / Grain': 'Granulat / Grain',
        'Münzen / Medaillen': 'Münzen / Medaillen',
        'Cast Bars': 'Cast Bars (gegossene Barren)',
        'Minted Bars': 'Minted Bars (geprägte Barren)'
    };
    return map[value] || value || '';
}

function getDealCommodityLabel(deal) {
    const label = deal?.discount_participation?.commodityLabel;
    if (label) return label;
    return getCommodityLabelFromValue(deal?.discount_participation?.commodityValue || deal?.commodity_type);
}

function getDealCommodityDisplay(deal) {
    const label = getDealCommodityLabel(deal);
    if (deal?.commodity_type === 'Hallmark' && deal?.hallmark_age_bucket) {
        return `${label} (${deal.hallmark_age_bucket})`;
    }
    return label;
}

function getContactSectionKey(roleText) {
    const text = (roleText || '').toLowerCase();
    if (/(bank|banker|customs|zoll)/i.test(text)) return 'bank';
    if (/(importbeauftragter|goldhändler)/i.test(text)) return 'buyer';
    if (/(logistics|assay|transport|security)/i.test(text)) return 'service';
    if (/(seller-side|seller)/i.test(text)) return 'seller';
    if (/(buyer-side|buyer|offtaker|investor|vorfinanzierer)/i.test(text)) return 'buyer';
    return 'service';
}

function renderContactSection(title, items, missingCount) {
    const missingText = missingCount > 0
        ? `<span class="text-secondary">Noch ${missingCount} Kontakte nicht zugewiesen</span>`
        : `<span class="text-secondary">Alle Kontakte zugewiesen</span>`;
    const sortedItems = [...items].sort((a, b) => {
        const nameA = (a.contact?.full_name || '').toLowerCase();
        const nameB = (b.contact?.full_name || '').toLowerCase();
        const roleA = [...a.roles, ...a.notes].join(' ').toLowerCase();
        const roleB = [...b.roles, ...b.notes].join(' ').toLowerCase();
        const combinedA = `${roleA} ${nameA} ${(a.contact?.company || '').toLowerCase()}`;
        const combinedB = `${roleB} ${nameB} ${(b.contact?.company || '').toLowerCase()}`;
        if (title.toLowerCase() === 'seller') {
            const sellerRank = (text) => {
                if (/\bseller\b/.test(text) && !/intermediary|co-?broker|assignee|mandate|lead|facilitator|country rep/.test(text)) return 0;
                if (/intermediary.*seller-side|seller-side.*intermediary|lead|mandate/.test(text)) return 1;
                if (/co-?broker 1/.test(text)) return 2;
                if (/co-?broker 2/.test(text)) return 3;
                if (/local facilitator|country rep|country rep\./.test(text)) return 4;
                if (/assignee/.test(text)) return 5;
                return 99;
            };
            const rankA = sellerRank(combinedA);
            const rankB = sellerRank(combinedB);
            if (rankA !== rankB) return rankA - rankB;
        }
        if (title.toLowerCase() === 'buyer') {
            const buyerRank = (text) => {
                if (/investor|vorfinanzierer/.test(text)) return 0;
                if (/koras|pmr|buyer representative/.test(text)) return 1;
                if (/imp|eckart|paymaster|mandate holder|lead/.test(text)) return 2;
                if (/foge|wolf|transaction manager|pmo|documentation/.test(text)) return 3;
                if (/co-?broker 1/.test(text)) return 4;
                if (/co-?broker 2/.test(text)) return 5;
                if (/importbeauftragter|goldhändler|mergel/.test(text)) return 6;
                return 99;
            };
            const rankA = buyerRank(combinedA);
            const rankB = buyerRank(combinedB);
            if (rankA !== rankB) return rankA - rankB;
        }
        if (title.toLowerCase() === 'bank+customs') {
            const bankRank = (text) => {
                if (/banker.*seller|seller.*banker|seller-side.*bank/.test(text)) return 0;
                if (/banker.*buyer|buyer.*banker|buyer-side.*bank/.test(text)) return 1;
                if (/customs.*afrika|zoll.*afrika|customs.*abflug|customs.*origin/.test(text)) return 2;
                if (/customs.*fra|zoll.*fra|customs.*ankunft/.test(text)) return 3;
                return 99;
            };
            const rankA = bankRank(combinedA);
            const rankB = bankRank(combinedB);
            if (rankA !== rankB) return rankA - rankB;
        }
        if (title.toLowerCase() === 'dienstleister') {
            const serviceRank = (text) => {
                if (/logistics.*afrika|security transport.*afrika/.test(text)) return 0;
                if (/logistics.*deutschland|security transport.*deutschland/.test(text)) return 1;
                if (/2nd fire assay|second fire assay/.test(text)) return 2;
                return 99;
            };
            const rankA = serviceRank(combinedA);
            const rankB = serviceRank(combinedB);
            if (rankA !== rankB) return rankA - rankB;
        }
        return nameA.localeCompare(nameB);
    });
    const cards = sortedItems.length === 0
        ? '<p class="text-secondary">Keine Kontakte zugeordnet.</p>'
        : sortedItems.map(item => `
            <div class="contact-card">
                <h4>${escapeHtml(item.contact?.full_name || '-')}</h4>
                <p class="text-secondary">${escapeHtml(item.contact?.role || '')}</p>
                <p class="text-secondary">${escapeHtml(item.contact?.company || '')}</p>
                <div class="contact-actions">
                    ${item.contact?.email ? `<a class="btn btn-sm btn-secondary" href="mailto:${escapeHtml(item.contact.email)}"><i class="ti ti-mail"></i> Mail</a>` : ''}
                    ${item.contact?.mobile ? `<a class="btn btn-sm btn-secondary" href="tel:${escapeHtml(item.contact.mobile)}"><i class="ti ti-phone"></i> Anrufen</a>` : ''}
                </div>
                <p class="contact-detail-small">${escapeHtml(item.contact?.email || '-')}${item.contact?.mobile ? ` · ${escapeHtml(item.contact.mobile)}` : ''}</p>
                ${item.roles.size ? `<div class="badge badge-open">${escapeHtml(Array.from(item.roles).join(', '))}</div>` : ''}
                ${item.notes.length ? `<p class="text-secondary">${escapeHtml(item.notes.join(' · '))}</p>` : ''}
            </div>
        `).join('');
    return `
        <div class="contact-section-block">
            <div class="contact-section-header">
                <h4>${title}</h4>
                ${missingText}
            </div>
            <div class="contacts-grid">${cards}</div>
        </div>
    `;
}

function renderDealBanks(infos) {
    const list = document.getElementById('deal-bank-list');
    if (!list) return;
    if (infos.length === 0) {
        list.innerHTML = '<p class="text-secondary">Keine Bankinformationen zugeordnet.</p>';
        return;
    }
    list.innerHTML = infos.map(info => `
        <div class="contact-card">
            <h4>${escapeHtml(info.bank_name || '-')}</h4>
            ${info.contact?.full_name ? `<p class="text-secondary">Ansprechpartner: ${escapeHtml(info.contact.full_name)}</p>` : ''}
            <p class="text-secondary">IBAN: ${escapeHtml(info.iban || '-')}</p>
            <p class="text-secondary">BIC: ${escapeHtml(info.bic || '-')}</p>
            <p class="text-secondary">Kontoinhaber: ${escapeHtml(info.account_holder || '-')}</p>
        </div>
    `).join('');
}

function getDealStatusOptions(currentStatus) {
    const statuses = [
        'Draft',
        'In Progress',
        'On Hold',
        'Completed',
        'Aborted (IMP)',
        'Aborted (Seller)',
        'Aborted (Buyer)',
        'Cancelled (IMP)',
        'Cancelled (Seller)',
        'Cancelled (Buyer)'
    ];
    
    return statuses.map(status => `
        <option value="${status}" ${status === currentStatus ? 'selected' : ''}>${status}</option>
    `).join('');
}

function renderDealStatusSelect(deal) {
    const disabled = demoMode || window.demoMode ? 'disabled' : '';
    return `
        <select class="deal-status-select" data-deal-id="${deal.id}" ${disabled}>
            ${getDealStatusOptions(deal.status)}
        </select>
    `;
}

function attachDealStatusSelectHandlers(container) {
    container.querySelectorAll('.deal-status-select').forEach(select => {
        select.addEventListener('click', (e) => {
            e.stopPropagation();
        });
        select.addEventListener('change', async (e) => {
            e.stopPropagation();
            const dealId = select.dataset.dealId;
            const newStatus = select.value;
            const current = allDeals.find(deal => deal.id === dealId);
            const oldStatus = current?.status || '';
            
            if (!dealId || newStatus === oldStatus) return;
            
            const updated = await updateDealStatus(dealId, newStatus, oldStatus);
            if (!updated && oldStatus) {
                select.value = oldStatus;
            }
        });
    });
}

async function updateDealStatus(dealId, status, oldStatus) {
    if (demoMode || window.demoMode || !supabase) return false;
    
    const { error } = await supabase
        .from('deals')
        .update({
            status: status,
            updated_at: new Date().toISOString()
        })
        .eq('id', dealId);
    
    if (error) {
        console.error('Error updating deal status:', error);
        alert('Fehler beim Aktualisieren des Geschäftsstatus');
        return false;
    }
    
    const deal = allDeals.find(d => d.id === dealId);
    if (deal) {
        const before = { ...deal };
        deal.status = status;
        await logAudit(dealId, 'UPDATE', 'deal', dealId, { status: oldStatus || before.status }, { status });
    } else if (oldStatus) {
        await logAudit(dealId, 'UPDATE', 'deal', dealId, { status: oldStatus }, { status });
    }
    
    filterDeals();
    return true;
}

function getDealStatusClass(status) {
    if (!status) return 'draft';
    return status
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[()]/g, '')
        .replace(/[^a-z0-9-]/g, '');
}

function escapeHtml(value) {
    return String(value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

function formatDiscount(value) {
    const num = Number.isFinite(Number(value)) ? Number(value) : 0;
    return `${Math.round(num)}%`;
}

function getDiscountClass(value) {
    const num = Number.isFinite(Number(value)) ? Number(value) : 0;
    if (num === 12) return 'discount-ok';
    if (num > 12) return 'discount-high';
    return 'discount-low';
}

function parseDiscountValue(value) {
    const parsed = Number.parseInt(value, 10);
    if (Number.isNaN(parsed)) return 0;
    if (parsed < 0) return 0;
    if (parsed > 99) return 99;
    return parsed;
}

function setupModalDragging() {
    document.querySelectorAll('.modal-content').forEach((content) => {
        const header = content.querySelector('.modal-header');
        if (!header) return;
        header.classList.add('modal-drag-handle');
        
        let isDragging = false;
        let startX = 0;
        let startY = 0;
        let startLeft = 0;
        let startTop = 0;
        
        header.addEventListener('pointerdown', (e) => {
            if (e.button !== 0) return;
            if (e.target.closest('button, input, select, textarea')) return;
            
            const rect = content.getBoundingClientRect();
            content.style.position = 'absolute';
            content.style.left = `${rect.left}px`;
            content.style.top = `${rect.top}px`;
            content.style.margin = '0';
            
            startX = e.clientX;
            startY = e.clientY;
            startLeft = rect.left;
            startTop = rect.top;
            isDragging = true;
            header.setPointerCapture(e.pointerId);
            header.classList.add('dragging');
        });
        
        header.addEventListener('pointermove', (e) => {
            if (!isDragging) return;
            const dx = e.clientX - startX;
            const dy = e.clientY - startY;
            const maxLeft = window.innerWidth - content.offsetWidth;
            const maxTop = window.innerHeight - content.offsetHeight;
            const nextLeft = Math.min(Math.max(0, startLeft + dx), Math.max(0, maxLeft));
            const nextTop = Math.min(Math.max(0, startTop + dy), Math.max(0, maxTop));
            content.style.left = `${nextLeft}px`;
            content.style.top = `${nextTop}px`;
        });
        
        const stopDrag = (e) => {
            if (!isDragging) return;
            isDragging = false;
            header.classList.remove('dragging');
            header.releasePointerCapture(e.pointerId);
        };
        
        header.addEventListener('pointerup', stopDrag);
        header.addEventListener('pointercancel', stopDrag);
    });
}

function normalizeCountryKey(country) {
    return country?.trim().toLowerCase() || '';
}

function getPreferredRouteForCountry(country) {
    const raw = country?.trim();
    if (!raw) return '';
    const parts = raw.split(',');
    if (parts.length < 2) return '';
    const city = parts.slice(1).join(',').trim();
    if (!city) return '';
    const cityKey = city.toLowerCase();
    const cityMap = {
        'cape town': 'Kapstadt (CPT)',
        'kapstadt': 'Kapstadt (CPT)',
        'johannesburg': 'Johannesburg (JNB)',
        'accra': 'Accra (ACC)',
        'nairobi': 'Nairobi (NBO)',
        'dar es salaam': 'Daressalam (DAR)',
        'dar es-salaam': 'Daressalam (DAR)',
        'lagos': 'Lagos (LOS)',
        'kinshasa': 'Kinshasa (FIH)',
        'lusaka': 'Lusaka (LUN)',
        'kampala': 'Kampala (EBB)',
        'abidjan': 'Abidjan (ABJ)',
        'addis ababa': 'Addis Ababa (ADD)',
        'cairo': 'Kairo (CAI)'
    };
    const cityLabel = cityMap[cityKey] || city;
    return `${cityLabel} → Frankfurt → Pforzheim`;
}

function updateCountrySuggestionList() {
    const list = document.getElementById('country-suggestions');
    if (!list) return;
    const suggestions = new Map();
    allDeals.slice(0, 15).forEach(deal => {
        const label = deal?.country?.trim();
        if (!label) return;
        suggestions.set(label.toLowerCase(), label);
    });
    const raw = localStorage.getItem('dealCountryDefaults');
    if (raw) {
        try {
            const data = JSON.parse(raw) || {};
            Object.entries(data).forEach(([key, entry]) => {
                if (suggestions.has(key)) return;
                const label = entry?.label || key;
                suggestions.set(key, label);
            });
        } catch (err) {
            console.error('Error reading dealCountryDefaults for suggestions:', err);
        }
    }
    list.innerHTML = Array.from(suggestions.values())
        .map(value => `<option value="${escapeHtml(value)}"></option>`)
        .join('');
}

function seedCountryDefaultsFromDeals(deals) {
    if (!Array.isArray(deals) || deals.length === 0) return;
    const raw = localStorage.getItem('dealCountryDefaults');
    let data = {};
    if (raw) {
        try {
            data = JSON.parse(raw) || {};
        } catch (err) {
            data = {};
        }
    }
    deals.slice(0, 15).forEach(deal => {
        const key = normalizeCountryKey(deal.country);
        if (!key) return;
        const entry = data[key] || {};
        const routes = entry.routes || (entry.route ? [entry.route] : []);
        const offers = entry.offers || (entry.offer ? [entry.offer] : []);
        if (deal.route) {
            const normalized = deal.route.trim().toLowerCase();
            const existingIndex = routes.findIndex(item => item.toLowerCase() === normalized);
            if (existingIndex >= 0) routes.splice(existingIndex, 1);
            routes.unshift(deal.route);
        }
        if (deal.offer_terms) {
            const normalized = deal.offer_terms.trim().toLowerCase();
            const existingIndex = offers.findIndex(item => item.toLowerCase() === normalized);
            if (existingIndex >= 0) offers.splice(existingIndex, 1);
            offers.unshift(deal.offer_terms);
        }
        data[key] = {
            label: entry.label || deal.country.trim(),
            routes: routes.slice(0, 5),
            offers: offers.slice(0, 5)
        };
    });
    localStorage.setItem('dealCountryDefaults', JSON.stringify(data));
}

function setupDealSuggestions() {
    setupSuggestionsForForm(
        'new-deal-country',
        'new-deal-route',
        'new-deal-offer',
        'new-route-suggestions',
        'new-offer-suggestions'
    );
    setupSuggestionsForForm(
        'edit-deal-country',
        'edit-deal-route',
        'edit-deal-offer',
        'edit-route-suggestions',
        'edit-offer-suggestions'
    );
    updateCountrySuggestionList();
}

function setupSuggestionsForForm(countryId, routeId, offerId, routeContainerId, offerContainerId) {
    const countryInput = document.getElementById(countryId);
    const routeInput = document.getElementById(routeId);
    const offerInput = document.getElementById(offerId);
    if (!countryInput || !routeInput || !offerInput) return;
    
    const routeList = document.getElementById('route-suggestions');
    const offerList = document.getElementById('offer-suggestions');
    const routeContainer = document.getElementById(routeContainerId);
    const offerContainer = document.getElementById(offerContainerId);
    
    const updateSuggestions = () => {
        const defaults = getCountryDefaults(countryInput.value);
        const preferredRoute = getPreferredRouteForCountry(countryInput.value);
        const routes = defaults?.routes || [];
        const mergedRoutes = preferredRoute
            ? [preferredRoute, ...routes.filter(route => route.toLowerCase() !== preferredRoute.toLowerCase())]
            : routes;
        const offers = defaults?.offers || [];
        const routePlaceholder = mergedRoutes[0] || '';
        const offerPlaceholder = offers[0] || '50 kg/mo (M1-3) -> 100 kg/mo (M4-36), term 36 mo';
        
        if (!routeInput.value) routeInput.placeholder = routePlaceholder;
        if (!offerInput.value) offerInput.placeholder = offerPlaceholder;
        
        if (routeList) {
            routeList.innerHTML = mergedRoutes.map(route => `<option value="${escapeHtml(route)}"></option>`).join('');
        }
        if (offerList) {
            offerList.innerHTML = offers.map(offer => `<option value="${escapeHtml(offer)}"></option>`).join('');
        }
        if (routeContainer) {
            renderSuggestionChips(routeContainer, mergedRoutes, 'routes');
        }
        if (offerContainer) {
            renderSuggestionChips(offerContainer, offers, 'offers');
        }
    };
    
    if (routeContainer) {
        routeContainer.addEventListener('click', (e) => {
            const button = e.target.closest('button');
            if (!button) return;
            const action = button.dataset.action;
            const value = button.dataset.value || '';
            if (action === 'select') {
                routeInput.value = value;
            } else if (action === 'delete') {
                removeCountryDefault(countryInput.value, 'routes', value);
                updateSuggestions();
            }
        });
    }
    
    if (offerContainer) {
        offerContainer.addEventListener('click', (e) => {
            const button = e.target.closest('button');
            if (!button) return;
            const action = button.dataset.action;
            const value = button.dataset.value || '';
            if (action === 'select') {
                offerInput.value = value;
            } else if (action === 'delete') {
                removeCountryDefault(countryInput.value, 'offers', value);
                updateSuggestions();
            }
        });
    }
    
    countryInput.addEventListener('change', updateSuggestions);
    countryInput.addEventListener('blur', updateSuggestions);
    updateSuggestions();
}

function getCountryDefaults(country) {
    const key = normalizeCountryKey(country);
    if (!key) return null;
    const raw = localStorage.getItem('dealCountryDefaults');
    if (!raw) return null;
    try {
        const data = JSON.parse(raw);
        const entry = data[key];
        if (!entry) return null;
        const routes = entry.routes || (entry.route ? [entry.route] : []);
        const offers = entry.offers || (entry.offer ? [entry.offer] : []);
        return { routes, offers };
    } catch (err) {
        console.error('Error reading dealCountryDefaults:', err);
        return null;
    }
}

function saveCountryDefaults(country, route, offer) {
    const key = normalizeCountryKey(country);
    if (!key) return;
    const raw = localStorage.getItem('dealCountryDefaults');
    let data = {};
    if (raw) {
        try {
            data = JSON.parse(raw) || {};
        } catch (err) {
            data = {};
        }
    }
    const entry = data[key] || {};
    const routes = entry.routes || (entry.route ? [entry.route] : []);
    const offers = entry.offers || (entry.offer ? [entry.offer] : []);
    if (route) {
        const normalized = route.trim().toLowerCase();
        const existingIndex = routes.findIndex(item => item.toLowerCase() === normalized);
        if (existingIndex >= 0) routes.splice(existingIndex, 1);
        routes.unshift(route);
    }
    if (offer) {
        const normalized = offer.trim().toLowerCase();
        const existingIndex = offers.findIndex(item => item.toLowerCase() === normalized);
        if (existingIndex >= 0) offers.splice(existingIndex, 1);
        offers.unshift(offer);
    }
    data[key] = {
        label: country.trim(),
        routes: routes.slice(0, 5),
        offers: offers.slice(0, 5)
    };
    localStorage.setItem('dealCountryDefaults', JSON.stringify(data));
}

function removeCountryDefault(country, type, value) {
    const key = normalizeCountryKey(country);
    if (!key || !value) return;
    const raw = localStorage.getItem('dealCountryDefaults');
    if (!raw) return;
    let data = {};
    try {
        data = JSON.parse(raw) || {};
    } catch (err) {
        return;
    }
    const entry = data[key];
    if (!entry || !Array.isArray(entry[type])) return;
    entry[type] = entry[type].filter(item => item.toLowerCase() !== value.toLowerCase());
    data[key] = entry;
    localStorage.setItem('dealCountryDefaults', JSON.stringify(data));
}

function renderSuggestionChips(container, items, type) {
    if (!items || items.length === 0) {
        container.innerHTML = '';
        return;
    }
    container.innerHTML = items.map(item => `
        <div class="suggestion-chip">
            <button type="button" class="suggestion-select" data-action="select" data-type="${type}" data-value="${escapeHtml(item)}">
                ${escapeHtml(item)}
            </button>
            <button type="button" class="suggestion-delete" data-action="delete" data-type="${type}" data-value="${escapeHtml(item)}" aria-label="Vorschlag löschen">
                ×
            </button>
        </div>
    `).join('');
}

function setupContactHistory() {
    const roleInput = document.getElementById('contact-role');
    const companyInput = document.getElementById('contact-company');
    const notesInput = document.getElementById('contact-notes');
    const dealNotesInput = document.getElementById('contact-deal-notes');
    if (!roleInput || !companyInput || !notesInput) return;
    const roleList = document.getElementById('contact-role-suggestions');
    const companyList = document.getElementById('contact-company-suggestions');
    const notesList = document.getElementById('contact-notes-suggestions');
    const dealNotesList = document.getElementById('contact-deal-notes-suggestions');
    
    const update = () => {
        if (roleList) {
            roleList.innerHTML = getContactHistory('roles')
                .map(item => `<option value="${escapeHtml(item)}"></option>`).join('');
        }
        if (companyList) {
            companyList.innerHTML = getContactHistory('companies')
                .map(item => `<option value="${escapeHtml(item)}"></option>`).join('');
        }
        if (notesList) {
            notesList.innerHTML = getContactHistory('notes')
                .map(item => `<option value="${escapeHtml(item)}"></option>`).join('');
        }
        if (dealNotesList) {
            dealNotesList.innerHTML = getContactHistory('deal_notes')
                .map(item => `<option value="${escapeHtml(item)}"></option>`).join('');
        }
    };
    update();
    if (dealNotesInput && dealNotesList) {
        dealNotesInput.setAttribute('list', 'contact-deal-notes-suggestions');
    }
}

function getContactHistory(type) {
    const raw = localStorage.getItem('contactFieldHistory');
    if (!raw) return [];
    try {
        const data = JSON.parse(raw);
        const items = data[type];
        return Array.isArray(items) ? items : [];
    } catch (err) {
        console.error('Error reading contactFieldHistory:', err);
        return [];
    }
}

function saveContactHistory(role, company, notes) {
    const raw = localStorage.getItem('contactFieldHistory');
    let data = {};
    if (raw) {
        try {
            data = JSON.parse(raw) || {};
        } catch (err) {
            data = {};
        }
    }
    data.roles = updateHistoryList(data.roles, role);
    data.companies = updateHistoryList(data.companies, company);
    data.notes = updateHistoryList(data.notes, notes);
    localStorage.setItem('contactFieldHistory', JSON.stringify(data));
}

function updateHistoryList(list, value) {
    if (!value) return Array.isArray(list) ? list.slice(0, 8) : [];
    const items = Array.isArray(list) ? [...list] : [];
    const normalized = value.trim().toLowerCase();
    const existing = items.findIndex(item => item.toLowerCase() === normalized);
    if (existing >= 0) items.splice(existing, 1);
    items.unshift(value);
    return items.slice(0, 8);
}

function saveDealNotesHistory(notes) {
    const raw = localStorage.getItem('contactFieldHistory');
    let data = {};
    if (raw) {
        try {
            data = JSON.parse(raw) || {};
        } catch (err) {
            data = {};
        }
    }
    data.deal_notes = updateHistoryList(data.deal_notes, notes);
    localStorage.setItem('contactFieldHistory', JSON.stringify(data));
    setupContactHistory();
}

function seedContactHistoryFromContacts(contacts) {
    if (!Array.isArray(contacts) || contacts.length === 0) return;
    const raw = localStorage.getItem('contactFieldHistory');
    let data = {};
    if (raw) {
        try {
            data = JSON.parse(raw) || {};
        } catch (err) {
            data = {};
        }
    }
    contacts.forEach(contact => {
        data.roles = updateHistoryList(data.roles, contact.role);
        data.companies = updateHistoryList(data.companies, contact.company);
        data.notes = updateHistoryList(data.notes, contact.notes);
    });
    localStorage.setItem('contactFieldHistory', JSON.stringify(data));
}

function getStepStatusClass(status) {
    if (!status) return 'open';
    if (status === 'In Progress') return 'step-in-progress';
    return status
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[()]/g, '')
        .replace(/[^a-z0-9-]/g, '');
}

function getDocumentIcon(mimeType) {
    if (mimeType?.includes('pdf')) return '<i class="ti ti-file-type-pdf" style="color: #dc3545;"></i>';
    if (mimeType?.includes('image')) return '<i class="ti ti-photo" style="color: #198754;"></i>';
    if (mimeType?.includes('word') || mimeType?.includes('document')) return '<i class="ti ti-file-type-docx" style="color: #0d6efd;"></i>';
    if (mimeType?.includes('sheet') || mimeType?.includes('excel')) return '<i class="ti ti-file-type-xlsx" style="color: #198754;"></i>';
    return '<i class="ti ti-file" style="color: #6c757d;"></i>';
}

function filterDocuments() {
    const search = document.getElementById('search-documents').value.toLowerCase();
    const filtered = allDocuments.filter(doc => 
        doc.file_name.toLowerCase().includes(search) ||
        doc.doc_type.toLowerCase().includes(search)
    );
    renderDocuments(filtered);
}

// ============================================
// Upload Document Modal
// ============================================
function openUploadDocumentModal() {
    if (!currentDeal) {
        alert('Kein Geschäft ausgewählt');
        return;
    }
    
    // Populate step dropdown
    const stepSelect = document.getElementById('upload-document-step');
    stepSelect.innerHTML = '<option value="">Kein spezifischer Schritt</option>';
    
    currentDealSteps.forEach(step => {
        const option = document.createElement('option');
        option.value = step.step_no;
        option.textContent = `Schritt ${step.step_no}: ${step.title}`;
        stepSelect.appendChild(option);
    });
    
    // Reset form
    document.getElementById('upload-document-form').reset();
    document.getElementById('upload-file-info').style.display = 'none';
    document.getElementById('upload-zone-large').style.display = 'block';
    
    // Setup upload zone
    setupUploadZone();
    
    openModal('upload-document-modal');
}

function openUploadDocumentModalWithPreset(preset = {}) {
    openUploadDocumentModal();
    const stepSelect = document.getElementById('upload-document-step');
    const typeSelect = document.getElementById('upload-document-type');
    if (!typeSelect) return;
    if (preset.stepNo && stepSelect) {
        stepSelect.value = String(preset.stepNo);
    }
    const docNo = preset.stepNo && preset.subNo ? `S${preset.stepNo}.${preset.subNo}` : '';
    const docType = docNo ? `${docNo} ${preset.docCode || ''}`.trim() : (preset.docCode || '');
    if (docType) {
        let option = Array.from(typeSelect.options).find(item => item.value === docType);
        if (!option) {
            option = document.createElement('option');
            option.value = docType;
            option.textContent = docType;
            typeSelect.appendChild(option);
        }
        typeSelect.value = docType;
    }
}

function setupUploadZone() {
    const uploadZone = document.getElementById('upload-zone-large');
    const fileInput = document.getElementById('upload-document-file');
    const fileInfo = document.getElementById('upload-file-info');
    const fileName = document.getElementById('upload-file-name');
    const fileSize = document.getElementById('upload-file-size');
    
    // Remove existing listeners by cloning
    const newUploadZone = uploadZone.cloneNode(true);
    uploadZone.parentNode.replaceChild(newUploadZone, uploadZone);
    const newFileInput = fileInput.cloneNode(true);
    fileInput.parentNode.replaceChild(newFileInput, fileInput);
    
    const zone = document.getElementById('upload-zone-large');
    const input = document.getElementById('upload-document-file');
    
    zone.addEventListener('click', () => input.click());
    
    zone.addEventListener('dragover', (e) => {
        e.preventDefault();
        zone.classList.add('dragover');
    });
    
    zone.addEventListener('dragleave', () => {
        zone.classList.remove('dragover');
    });
    
    zone.addEventListener('drop', (e) => {
        e.preventDefault();
        zone.classList.remove('dragover');
        const files = Array.from(e.dataTransfer.files);
        if (files.length > 0) {
            handleFileSelect(files[0]);
        }
    });
    
    input.addEventListener('change', (e) => {
        if (e.target.files.length > 0) {
            handleFileSelect(e.target.files[0]);
        }
    });
}

function handleFileSelect(file) {
    // Validate file type
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png', 
                         'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                         'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'];
    if (!allowedTypes.includes(file.type) && !file.name.match(/\.(pdf|jpg|jpeg|png|docx|xlsx)$/i)) {
        alert(`Datei "${file.name}" hat ein nicht unterstütztes Format. Bitte verwenden Sie PDF, JPG, PNG, DOCX oder XLSX.`);
        return;
    }
    
    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
        alert(`Datei "${file.name}" ist zu groß (max. 10MB)`);
        return;
    }
    
    // Show file info
    document.getElementById('upload-file-name').textContent = file.name;
    document.getElementById('upload-file-size').textContent = formatFileSize(file.size);
    document.getElementById('upload-zone-large').style.display = 'none';
    document.getElementById('upload-file-info').style.display = 'block';
    
    // Set file in input (for form submission)
    const dataTransfer = new DataTransfer();
    dataTransfer.items.add(file);
    document.getElementById('upload-document-file').files = dataTransfer.files;
}

window.clearUploadFile = function() {
    document.getElementById('upload-document-file').value = '';
    document.getElementById('upload-file-info').style.display = 'none';
    document.getElementById('upload-zone-large').style.display = 'block';
};

function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

async function handleUploadDocumentForm(e) {
    e.preventDefault();
    
    if (demoMode) {
        alert('Demo-Modus: Dateien können nicht hochgeladen werden. Bitte melden Sie sich an, um die vollständige Funktionalität zu nutzen.');
        return;
    }
    
    const fileInput = document.getElementById('upload-document-file');
    const stepNo = document.getElementById('upload-document-step').value;
    const docType = document.getElementById('upload-document-type').value;
    
    if (!fileInput.files || fileInput.files.length === 0) {
        alert('Bitte wählen Sie eine Datei aus');
        return;
    }
    
    const file = fileInput.files[0];
    const stepNoInt = stepNo ? parseInt(stepNo) : null;
    
    showLoading(true);
    
    try {
        await uploadDocument(currentDeal.id, currentDeal.deal_no, stepNoInt, file, docType);
        
        let stepStatusUpdated = false;
        if (stepNoInt) {
            stepStatusUpdated = await markStepInProgress(stepNoInt);
        }
        
        if (stepStatusUpdated) {
            await loadDealDetail(currentDeal.id);
        } else {
            // Reload documents
            await loadDealDocuments(currentDeal.id);
            if (stepNoInt) {
                await loadStepDocuments(stepNoInt);
            }
        }
        
        closeModal('upload-document-modal');
        alert('Dokument erfolgreich hochgeladen');
    } catch (error) {
        console.error('Error uploading document:', error);
        alert('Fehler beim Hochladen: ' + (error.message || 'Unbekannter Fehler'));
    }
    
    showLoading(false);
}

// ============================================
// Risks
// ============================================
let allRisks = [];

async function loadDealRisks(dealId) {
    if (demoMode) {
        allRisks = [];
        renderRisks([]);
        return;
    }
    
    if (!supabase) {
        allRisks = [];
        renderRisks([]);
        return;
    }
    
    const { data: risks } = await supabase
        .from('risks')
        .select('*')
        .eq('deal_id', dealId)
        .order('created_at', { ascending: false });
    
    allRisks = risks || [];
    renderRisks(allRisks);
}

function renderRisks(risks) {
    const container = document.getElementById('risks-list');
    
    if (risks.length === 0) {
        container.innerHTML = '<div class="empty-state"><i class="ti ti-alert-triangle"></i><p>Keine Risiken vorhanden</p></div>';
        return;
    }
    
    container.innerHTML = risks.map(risk => {
        const riskScore = risk.severity * risk.probability;
        const riskLevel = riskScore >= 20 ? 'high' : riskScore >= 10 ? 'medium' : 'low';
        const riskClass = `risk-${riskLevel}`;
        
        return `
            <div class="risk-card ${riskClass}">
                <div class="risk-header">
                    <div>
                        <div class="risk-category">${risk.category}</div>
                        <span class="badge badge-risk-${riskLevel}">${riskLevel.toUpperCase()}</span>
                    </div>
                    <button class="btn btn-sm btn-secondary" onclick="openEditRiskModal('${risk.id}')" title="Risiko bearbeiten">
                        <i class="ti ti-edit"></i>
                    </button>
                </div>
                <div class="risk-description">${risk.description}</div>
                <div class="risk-meta">
                    <span>Schweregrad: ${risk.severity}/5</span>
                    <span>Wahrscheinlichkeit: ${risk.probability}/5</span>
                    <span>Score: ${riskScore}/25</span>
                </div>
                ${risk.mitigation ? `<p class="mt-sm"><strong>Mitigation:</strong> ${risk.mitigation}</p>` : ''}
                ${risk.owner ? `<p class="mt-sm"><strong>Owner:</strong> ${risk.owner}</p>` : ''}
                <p class="mt-sm"><span class="badge badge-${risk.status.toLowerCase()}">${risk.status}</span></p>
            </div>
        `;
    }).join('');
}

function filterRisks() {
    const categoryFilter = document.getElementById('filter-risk-category').value;
    let filtered = allRisks;
    
    if (categoryFilter) {
        filtered = filtered.filter(risk => risk.category === categoryFilter);
    }
    
    renderRisks(filtered);
}

async function handleAddRisk(e) {
    e.preventDefault();
    
    if (demoMode) {
        alert('Demo-Modus: Risiken können nicht gespeichert werden. Bitte melden Sie sich an, um die vollständige Funktionalität zu nutzen.');
        return;
    }
    
    if (!supabase || !currentDeal) {
        alert('Fehler: Keine Verbindung zur Datenbank oder kein Geschäft ausgewählt.');
        return;
    }
    
    showLoading(true);
    
    const riskId = document.getElementById('risk-id').value;
    const category = document.getElementById('risk-category').value;
    const description = document.getElementById('risk-description').value;
    const severity = parseInt(document.getElementById('risk-severity').value);
    const probability = parseInt(document.getElementById('risk-probability').value);
    const mitigation = document.getElementById('risk-mitigation').value;
    const owner = document.getElementById('risk-owner').value;
    const status = document.getElementById('risk-status').value;
    
    let error;
    let oldRisk = null;
    
    if (riskId) {
        // Update existing risk
        const { data: existingRisk } = await supabase
            .from('risks')
            .select('*')
            .eq('id', riskId)
            .single();
        
        oldRisk = existingRisk;
        
        const { error: updateError } = await supabase
            .from('risks')
            .update({
                category: category,
                description: description,
                severity: severity,
                probability: probability,
                mitigation: mitigation || null,
                owner: owner || null,
                status: status,
                updated_at: new Date().toISOString()
            })
            .eq('id', riskId);
        
        error = updateError;
        
        if (!error) {
            await logAudit(currentDeal.id, 'UPDATE', 'risk', riskId, oldRisk, { category, description, status });
        }
    } else {
        // Insert new risk
        const { error: insertError } = await supabase
            .from('risks')
            .insert({
                deal_id: currentDeal.id,
                category: category,
                description: description,
                severity: severity,
                probability: probability,
                mitigation: mitigation || null,
                owner: owner || null,
                status: status || 'Open'
            });
        
        error = insertError;
        
        if (!error) {
            await logAudit(currentDeal.id, 'CREATE', 'risk', null, null, { category, description });
        }
    }
    
    if (error) {
        console.error('Error saving risk:', error);
        alert('Fehler beim Speichern des Risikos: ' + (error.message || 'Unbekannter Fehler'));
        showLoading(false);
        return;
    }
    
    closeModal('add-risk-modal');
    document.getElementById('add-risk-form').reset();
    document.getElementById('risk-id').value = '';
    document.getElementById('risk-modal-title').textContent = 'Risiko hinzufügen';
    document.getElementById('risk-submit-btn').textContent = 'Hinzufügen';
    showLoading(false);
    
    await loadDealRisks(currentDeal.id);
}

window.openEditRiskModal = async function(riskId) {
    if (demoMode) {
        alert('Demo-Modus: Risiken können nicht bearbeitet werden. Bitte melden Sie sich an, um die vollständige Funktionalität zu nutzen.');
        return;
    }
    
    if (!supabase) {
        alert('Fehler: Keine Verbindung zur Datenbank.');
        return;
    }
    
    showLoading(true);
    
    try {
        const { data: risk, error } = await supabase
            .from('risks')
            .select('*')
            .eq('id', riskId)
            .single();
        
        showLoading(false);
        
        if (error || !risk) {
            console.error('Error loading risk:', error);
            alert('Fehler beim Laden des Risikos: ' + (error?.message || 'Risiko nicht gefunden'));
            return;
        }
        
        // Fill form with risk data
        document.getElementById('risk-id').value = risk.id;
        document.getElementById('risk-category').value = risk.category;
        document.getElementById('risk-description').value = risk.description || '';
        document.getElementById('risk-severity').value = risk.severity;
        document.getElementById('risk-probability').value = risk.probability;
        document.getElementById('risk-mitigation').value = risk.mitigation || '';
        document.getElementById('risk-owner').value = risk.owner || '';
        document.getElementById('risk-status').value = risk.status || 'Open';
        
        // Trigger category change to filter presets
        const categorySelect = document.getElementById('risk-category');
        if (categorySelect) {
            categorySelect.dispatchEvent(new Event('change'));
        }
        
        // Uncheck all preset checkboxes when editing
        document.querySelectorAll('.mitigation-preset').forEach(cb => cb.checked = false);
        
        // Update modal title and button
        document.getElementById('risk-modal-title').textContent = 'Risiko bearbeiten';
        document.getElementById('risk-submit-btn').textContent = 'Speichern';
        
        // Open modal
        openModal('add-risk-modal');
    } catch (err) {
        showLoading(false);
        console.error('Error in openEditRiskModal:', err);
        alert('Fehler beim Laden des Risikos: ' + (err.message || 'Unbekannter Fehler'));
    }
};

// ============================================
// Audit
// ============================================
async function loadDealAudit(dealId) {
    if (demoMode) {
        renderAudit([]);
        return;
    }
    
    if (!supabase) {
        renderAudit([]);
        return;
    }
    
    const { data: auditLogs } = await supabase
        .from('audit_log')
        .select('*')
        .eq('deal_id', dealId)
        .order('created_at', { ascending: false })
        .limit(100);
    
    renderAudit(auditLogs || []);
}

function renderAudit(logs) {
    const container = document.getElementById('audit-timeline');
    
    if (logs.length === 0) {
        container.innerHTML = '<div class="empty-state"><i class="ti ti-history"></i><p>Keine Audit-Einträge vorhanden</p></div>';
        return;
    }

    const stepMap = (currentDealSteps || []).reduce((acc, step) => {
        acc[step.id] = `Schritt ${step.step_no}: ${step.title}`;
        return acc;
    }, {});

    container.innerHTML = logs.map(log => `
        <div class="audit-item">
            <div class="audit-time">${new Date(log.created_at).toLocaleString('de-DE')}</div>
            <div class="audit-action">${log.action} - ${log.entity}${log.entity === 'deal_step' && log.entity_id ? ` (${stepMap[log.entity_id] || 'Unbekannter Schritt'})` : ''}</div>
            <div class="audit-details">
                ${log.after_json ? JSON.stringify(log.after_json, null, 2) : ''}
            </div>
        </div>
    `).join('');
}

// ============================================
// Tabs
// ============================================
function switchTab(tabName) {
    // Update tab buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.tab === tabName) {
            btn.classList.add('active');
        }
    });
    
    // Update tab panes
    document.querySelectorAll('.tab-pane').forEach(pane => {
        pane.classList.remove('active');
    });
    
    document.getElementById(`tab-${tabName}`).classList.add('active');
}

// ============================================
// Modals
// ============================================
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.classList.add('active');
    const content = modal.querySelector('.modal-content');
    if (content) {
        content.style.position = '';
        content.style.left = '';
        content.style.top = '';
        content.style.margin = '';
    }
}

function closeModal(modalId) {
    document.getElementById(modalId).classList.remove('active');
    if (modalId === 'contacts-modal') {
        clearSellerAssignmentMode();
    }
    if (modalId === 'discount-participation-modal') {
        discountParticipationDraft = null;
    }
}

// ============================================
// Dark Mode
// ============================================
function setupDarkMode() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateDarkModeIcon(savedTheme);
    updateBrandLogo(savedTheme);
    
    document.getElementById('dark-mode-toggle').addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateDarkModeIcon(newTheme);
        updateBrandLogo(newTheme);
    });
}

function updateBrandLogo(theme) {
    const isDark = (theme || document.documentElement.getAttribute('data-theme')) === 'dark';
    const brandLogo = document.getElementById('brand-logo');
    const loginLogo = document.getElementById('login-logo');
    const lightPath = resolveLogoPath(LOGO_BLACK_PATHS);
    const darkPath = resolveLogoPath(LOGO_TRANSPARENT_PATHS);
    const selected = isDark ? darkPath : lightPath;
    if (brandLogo) brandLogo.src = selected;
    if (loginLogo) loginLogo.src = selected;
}

function updateDarkModeIcon(theme) {
    const icon = document.querySelector('#dark-mode-toggle i');
    if (icon) {
        icon.className = theme === 'dark' ? 'ti ti-sun' : 'ti ti-moon';
    }
}

// ============================================
// Loading
// ============================================
function showLoading(show) {
    const overlay = document.getElementById('loading-overlay');
    if (show) {
        overlay.classList.add('active');
    } else {
        overlay.classList.remove('active');
    }
}
