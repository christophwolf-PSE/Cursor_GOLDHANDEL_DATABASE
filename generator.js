// Generator Hub (templates list + basic selection)
import { supabase } from './supabase.js';
import { downloadStorageRef } from './src/services/storageDownload.js';

const CATALOG_SEED_PATH = './src/domain/documentCatalog.seed.json';
const TEMPLATE_SEED_MULTI_PATH = './src/domain/document_templates_seed.multi.json';
let catalogActionsReady = false;
const TOTAL_STEPS = 18;
let templateIndex = new Map();
let missingTemplateCodes = [];
const STEP_TITLES = {
    1: 'Kontaktanbahnung Seller/Intermediaries',
    2: 'Buyer-Placement',
    3: 'KYC/AML/Sanktions-/Embargoprüfung',
    4: 'Chain-of-Custody Dokumentation',
    5: 'SPA-Erstellung/Signatur',
    6: 'Vorab-Dokumente 72h vor Versand',
    7: 'Lufttransport (versichert, Zollversiegelung)',
    8: 'Zollbereich Frankfurt/Main: Vorprüfung',
    9: 'Sicherheitslogistik',
    10: 'Ankunft Pforzheim: Annahmebestätigung',
    11: 'Fire Assay + optional Second Assay',
    12: 'Verbindlicher Assay Report',
    13: 'Preisfestlegung (LBMA Fixing Bezug)',
    14: 'Zahlung innerhalb vertraglicher Frist',
    15: 'Ownership Transfer',
    16: 'Raffination zu 999,9',
    17: 'Lagerung/Abholung Buyer',
    18: 'Abschlussdokumentation'
};

function getSelectedDealId() {
    const select = document.getElementById('generator-deal-select');
    return select?.value || '';
}

async function ensureDealContext(dealId) {
    if (!dealId) return false;
    if (window.currentDeal?.id === dealId && window.currentDeal) return true;
    if (typeof window.setGeneratorDealContext === 'function') {
        return window.setGeneratorDealContext(dealId);
    }
    return false;
}

function getSelectedContacts() {
    const inputs = Array.from(document.querySelectorAll('.generator-contact:checked'));
    const selectedIds = inputs.map(input => String(input.value));
    const allContacts = window.getAllContacts ? window.getAllContacts() : [];
    return allContacts.filter(contact => selectedIds.includes(String(contact.id)));
}

function formatDate(value = new Date()) {
    const date = value instanceof Date ? value : new Date(value);
    if (Number.isNaN(date.getTime())) return '';
    return date.toISOString().slice(0, 10);
}

function buildPlaceholderMap(docCode, contacts) {
    const deal = window.currentDeal || {};
    const kyc = window.currentDealKyc || {};
    const contactNames = contacts.map(contact => contact.full_name || contact.company || '').filter(Boolean);
    const companyRoles = Array.isArray(kyc.company_roles) ? kyc.company_roles : [];
    const tradeRefs = Array.isArray(kyc.trade_references) ? kyc.trade_references : [];
    const tradeRefList = tradeRefs.map(item => {
        const customer = item?.customer || '';
        const country = item?.country || '';
        if (customer && country) return `${customer} (${country})`;
        return customer || country || '';
    }).filter(Boolean).join('; ');
    const tradeRefTable = tradeRefs.map(item => {
        const customer = item?.customer || '';
        const country = item?.country || '';
        return [customer, country].filter(Boolean).join(' | ');
    }).filter(Boolean).join('\n');
    const bankContacts = Array.isArray(kyc.bank_contacts) ? kyc.bank_contacts : [];
    const bankContactsTable = bankContacts.map(item => {
        const fn = item?.function || '';
        const name = item?.name || '';
        const phone = item?.phone || '';
        const email = item?.email || '';
        return [fn, name, phone, email].filter(Boolean).join(' | ');
    }).filter(Boolean).join('\n');
    return {
        doc_code: docCode || '',
        date: formatDate(),
        deal_no: deal.deal_no || '',
        'seller.name': deal.seller_name || deal.seller || '',
        'buyer.name': deal.buyer_name || deal.buyer || '',
        'seller.address': deal.seller_address || '',
        'buyer.address': deal.buyer_address || '',
        'signatures.seller': deal.signature_seller || '',
        'signatures.buyer': deal.signature_buyer || '',
        'intermediaries.names': contactNames.join(', '),
        'contacts.names': contactNames.join(', '),
        'contacts.list': contactNames.join(', '),
        commodity: deal.commodity_type || deal.commodity || '',
        commodity_form: deal.commodity_form || '',
        commodity_purity: deal.commodity_purity || '',
        quantity_kg: deal.quantity_kg || deal.quantity || '',
        'origin.country': deal.origin_country || deal.country || '',
        'shipment.route': deal.shipment_route || deal.route || '',
        price_fixing: deal.price_fixing || '',
        lbma_discount_pct: deal.lbma_discount_pct ?? '',
        currency: deal.currency || '',
        consignments: deal.consignments || '',
        'bank.name': deal.bank_name || '',
        'bank.iban': deal.bank_iban || '',
        'bank.bic': deal.bank_bic || '',
        'bank.account_holder': deal.bank_account_holder || '',
        'company.name': kyc.company_name || '',
        'company.authorized_signatory.name': kyc.authorized_signatory_name || '',
        'company.authorized_signatory.title': kyc.authorized_signatory_title || '',
        'company.authorized_signatory.passport_no': kyc.passport_no || '',
        'company.address.street': kyc.street || '',
        'company.address.postal_code': kyc.postal_code || '',
        'company.address.city': kyc.city || '',
        'company.address.country': kyc.country || '',
        'company.phone': kyc.phone || '',
        'company.email': kyc.business_email || '',
        'company.website': kyc.business_website || '',
        'company.tax_id': kyc.tax_id || '',
        'company.vat_id': kyc.vat_no || '',
        'company.role.buyer': companyRoles.includes('Buyer') ? 'Yes' : 'No',
        'company.role.seller': companyRoles.includes('Seller') ? 'Yes' : 'No',
        'company.role.producer': companyRoles.includes('Producer') ? 'Yes' : 'No',
        'company.product.raw_material': kyc.product_raw_material ? 'Yes' : 'No',
        'company.product.refined_bars': kyc.product_refined_bars ? 'Yes' : 'No',
        'company.product.machinery': kyc.product_refinery_machinery ? 'Yes' : 'No',
        'company.type_of_business': kyc.type_of_business || '',
        'company.incorporation_date': kyc.incorporation_date || '',
        'company.shareholder_owner': kyc.shareholder_owner || '',
        'company.total_employees': kyc.employees_count ?? '',
        'company.subsidiaries': kyc.subsidiaries || '',
        'primary_contact.first_name': kyc.primary_contact_first_name || '',
        'primary_contact.last_name': kyc.primary_contact_last_name || '',
        'primary_contact.function': kyc.primary_contact_function || '',
        'primary_contact.phone': kyc.primary_contact_phone || '',
        'primary_contact.email': kyc.primary_contact_email || '',
        'legal_counsel.name': kyc.legal_counsel_name || '',
        'legal_counsel.street': kyc.legal_counsel_street || '',
        'legal_counsel.postal_code': kyc.legal_counsel_postal_code || '',
        'legal_counsel.city': kyc.legal_counsel_city || '',
        'legal_counsel.country': kyc.legal_counsel_country || '',
        'legal_counsel.phone': kyc.legal_counsel_phone || '',
        'legal_counsel.email': kyc.legal_counsel_email || '',
        'legal_counsel.website': kyc.legal_counsel_website || '',
        'bank.street': kyc.bank_street || '',
        'bank.postal_code': kyc.bank_postal_code || '',
        'bank.city': kyc.bank_city || '',
        'bank.country': kyc.bank_country || '',
        'bank.phone': kyc.bank_phone || '',
        'bank.officer.name': kyc.bank_officer || '',
        'bank.officer.direct_phone': kyc.bank_officer_phone || '',
        'bank.officer.email': kyc.bank_officer_email || '',
        'bank.account_name': kyc.account_name || '',
        'bank.account_number': kyc.account_number || '',
        'bank.swift_bic': kyc.swift_bic || '',
        'bank.account_signatory': kyc.account_signatory || '',
        'bank.reference_letter_appendix': kyc.bank_reference_letter_appendix ? 'Yes' : 'No',
        'bank.contacts.table': bankContactsTable,
        'trade_references.table': tradeRefTable,
        'trade_references.list': tradeRefList,
        cif_basis: kyc.cif_basis === true ? 'Yes' : (kyc.cif_basis === false ? 'No' : ''),
        'fixtures.last_three': kyc.fixtures_last_three || ''
    };
}

function applyTemplate(body, placeholderValues) {
    if (!body) return '';
    return body.replace(/{{\s*([^}]+)\s*}}/g, (match, key) => {
        const normalizedKey = key.trim();
        if (Object.prototype.hasOwnProperty.call(placeholderValues, normalizedKey)) {
            const value = placeholderValues[normalizedKey];
            if (value !== null && value !== undefined) {
                return String(value);
            }
        }
        return match;
    });
}

function escapeHtmlText(text) {
    return (text || '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
}

function markdownToHtml(markdown) {
    const lines = (markdown || '').split('\n');
    const htmlLines = lines.map(line => {
        if (/^###\s+/.test(line)) return `<h3>${escapeHtmlText(line.replace(/^###\s+/, ''))}</h3>`;
        if (/^##\s+/.test(line)) return `<h2>${escapeHtmlText(line.replace(/^##\s+/, ''))}</h2>`;
        if (/^#\s+/.test(line)) return `<h1>${escapeHtmlText(line.replace(/^#\s+/, ''))}</h1>`;
        const escaped = escapeHtmlText(line);
        const bolded = escaped.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
        const italicized = bolded.replace(/\*(.+?)\*/g, '<em>$1</em>');
        return italicized.length ? `<p>${italicized}</p>` : '<br />';
    });
    return htmlLines.join('\n');
}

function markdownToPlainText(markdown) {
    return (markdown || '')
        .replace(/^###\s+/gm, '')
        .replace(/^##\s+/gm, '')
        .replace(/^#\s+/gm, '')
        .replace(/\*\*(.+?)\*\*/g, '$1')
        .replace(/\*(.+?)\*/g, '$1');
}

function openPdfPreview(content, filename, usedContacts) {
    if (!window.jspdf) {
        alert('PDF-Vorschau nicht verfuegbar (jsPDF fehlt).');
        return false;
    }
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 12;
    let cursorY = margin + 2;

    if (usedContacts.length) {
        doc.setFontSize(10);
        doc.text(`Kontakte: ${usedContacts.join(', ')}`, margin, cursorY);
        cursorY += 8;
    }
    doc.setFontSize(12);
    const plainText = markdownToPlainText(content);
    const lines = doc.splitTextToSize(plainText, pageWidth - margin * 2);
    lines.forEach((line) => {
        if (cursorY > doc.internal.pageSize.getHeight() - margin) {
            doc.addPage();
            cursorY = margin;
        }
        doc.text(line, margin, cursorY);
        cursorY += 6;
    });
    const pdfBlob = doc.output('blob');
    const url = URL.createObjectURL(pdfBlob);
    const popup = window.open(url, '_blank');
    if (!popup) {
        const link = document.createElement('a');
        link.href = url;
        link.download = filename.replace(/\.doc$/i, '.pdf');
        document.body.appendChild(link);
        link.click();
        link.remove();
        alert('Popup blockiert. PDF wurde heruntergeladen.');
    }
    setTimeout(() => URL.revokeObjectURL(url), 5000);
    return true;
}

async function loadDealContactsForGenerator(dealId) {
    if (!supabase || !dealId) return [];
    try {
        const { data, error } = await supabase
            .from('deal_contacts')
            .select('contact:contacts(id, full_name, company)')
            .eq('deal_id', dealId);
        if (error) {
            console.warn('Generator deal contacts load failed:', error);
            return [];
        }
        return (data || []).map(row => row.contact).filter(Boolean);
    } catch (err) {
        console.warn('Generator deal contacts error:', err);
        return [];
    }
}

async function resolveContactsForDocument(dealId) {
    const selected = getSelectedContacts();
    if (selected.length) return selected;
    return loadDealContactsForGenerator(dealId);
}

function addContactsSectionIfMissing(body, contacts, language) {
    if (!contacts.length) return body;
    if (body.includes('{{intermediaries.names}}')) return body;
    const label = language === 'DE' ? 'Intermediaries' : language === 'FR' ? 'Intermediaries' : 'Intermediaries';
    const list = contacts.map(name => `- ${name}`).join('\n');
    return `${body}\n\n## ${label}\n${list}`;
}

function downloadMarkdown(content, filename) {
    const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 0);
}

function downloadBlobFile(blob, filename) {
    if (!blob) return;
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename || 'template';
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 0);
}

function getFileExtension(filename) {
    const match = (filename || '').toLowerCase().match(/\.([a-z0-9]+)$/);
    return match ? match[1] : '';
}

function setGeneratorInfoNote(message) {
    const note = document.getElementById('generator-language-note');
    if (note) {
        note.textContent = message || '';
        return;
    }
    if (message) {
        alert(message);
    }
}

function sanitizeFilename(value) {
    return (value || 'document')
        .toString()
        .trim()
        .replace(/\s+/g, '_')
        .replace(/[^A-Za-z0-9_-]/g, '_');
}

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

function normalizeDocType(value) {
    const type = (value || '').toString().toUpperCase();
    if (type === 'GENERATE' || type === 'GENERATED') return 'GENERATE';
    if (type === 'UPLOAD_SLOT') return 'UPLOAD_SLOT';
    if (type === 'SOURCE_UPLOADED') return 'SOURCE_UPLOADED';
    if (type === 'EXTERNAL') return 'EXTERNAL';
    return 'GENERATE';
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
            <div class="generator-step-title">Schritt ${stepNo}${STEP_TITLES[stepNo] ? ` – ${STEP_TITLES[stepNo]}` : ''}</div>
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
    const docType = normalizeDocType(item.doc_type);
    const sourceRef = escapeHtml(item.source_ref || '');
    if (docType === 'UPLOAD_SLOT') {
        return `<button class="btn btn-sm btn-secondary generator-upload-btn" data-step="${item.step_no}" data-sub="${item.default_sub_no}" data-doc="${escapeHtml(item.doc_code)}">Upload</button>`;
    }
    if (docType === 'EXTERNAL') {
        return `<span class="text-secondary">Auto-Export</span>`;
    }
    if (docType === 'SOURCE_UPLOADED') {
        return `<button class="btn btn-sm btn-secondary generator-generate-btn" data-doc="${escapeHtml(item.doc_code)}" data-doc-type="${docType}" data-source-ref="${sourceRef}">Download</button>`;
    }
    return `<button class="btn btn-sm btn-secondary generator-generate-btn" data-doc="${escapeHtml(item.doc_code)}" data-doc-type="${docType}" data-source-ref="${sourceRef}">Erstellen</button>`;
}

function getDocTypeLabel(type) {
    if (type === 'UPLOAD_SLOT') return 'Upload';
    if (type === 'EXTERNAL') return 'Auto';
    if (type === 'SOURCE_UPLOADED') return 'Original template file';
    return 'Generated';
}

async function loadCatalog() {
    const supabaseCatalog = await loadCatalogFromSupabase();
    if (supabaseCatalog.length) {
        return supabaseCatalog;
    }
    return loadCatalogFromSeed();
}

function getGenerateDocCodes(catalog) {
    return catalog
        .filter(item => normalizeDocType(item.doc_type) === 'GENERATE')
        .map(item => item.doc_code)
        .filter(Boolean);
}

async function loadTemplates(docCodes) {
    const supabaseTemplates = await loadTemplatesFromSupabase(docCodes);
    if (supabaseTemplates.length) {
        return supabaseTemplates;
    }
    return loadTemplatesFromSeed();
}

async function loadTemplatesFromSupabase(docCodes) {
    if (!supabase) return [];
    if (!docCodes.length) return [];
    try {
        const { data, error } = await supabase
            .from('document_templates')
            .select('doc_code, language, version, locked_text, placeholders, body_md')
            .in('doc_code', docCodes)
            .in('language', ['EN', 'DE', 'FR']);
        if (error) {
            console.warn('Generator templates Supabase load failed:', error);
            return [];
        }
        return data || [];
    } catch (err) {
        console.warn('Generator templates Supabase error:', err);
        return [];
    }
}

async function loadTemplatesFromSeed() {
    try {
        const response = await fetch(TEMPLATE_SEED_MULTI_PATH);
        if (!response.ok) {
            throw new Error(`Seed fetch failed (${response.status})`);
        }
        const data = await response.json();
        return Array.isArray(data) ? data : [];
    } catch (err) {
        console.warn('Generator templates seed load failed:', err);
        return [];
    }
}

function indexTemplates(templates, catalogDocCodes) {
    templateIndex = new Map();
    missingTemplateCodes = [];
    templates.forEach(item => {
        const key = `${item.doc_code}::${item.language}`;
        templateIndex.set(key, item);
    });
    const catalogSet = new Set(catalogDocCodes);
    const templateCodes = new Set(templates.map(item => item.doc_code));
    catalogSet.forEach(code => {
        if (!templateCodes.has(code)) {
            missingTemplateCodes.push(code);
        }
    });
    if (missingTemplateCodes.length) {
        console.warn('Generator templates missing for catalog doc_codes:', missingTemplateCodes);
    }
    const missingInCatalog = [];
    templateCodes.forEach(code => {
        if (!catalogSet.has(code)) {
            missingInCatalog.push(code);
        }
    });
    if (missingInCatalog.length) {
        console.warn('Generator templates not present in catalog (ignored until catalog updated):', missingInCatalog);
    }
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
        required: Boolean(item.is_required ?? item.required),
        doc_type: normalizeDocType(item.doc_kind || item.doc_type),
        locked_text: Boolean(item.locked_text),
        source_ref: item.source_ref || null
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
    const docCodes = getGenerateDocCodes(catalog);
    const templates = await loadTemplates(docCodes);
    indexTemplates(templates, docCodes);
    renderCatalog(catalog);
    setupCatalogActions();
    await Promise.all([loadDeals(), loadContacts()]);
    bindDealSelect();
    modal.classList.add('active');
}

function setupCatalogActions() {
    const container = document.getElementById('generator-step-list');
    if (!container) return;
    if (catalogActionsReady) return;
    catalogActionsReady = true;
    container.addEventListener('click', async (event) => {
        const uploadBtn = event.target.closest('.generator-upload-btn');
        if (uploadBtn) {
            const dealId = getSelectedDealId();
            if (!dealId) {
                alert('Bitte zuerst ein Geschäft auswählen.');
                return;
            }
            const ready = await ensureDealContext(dealId);
            if (!ready) {
                alert('Geschäft konnte nicht geladen werden.');
                return;
            }
            const stepNo = Number(uploadBtn.dataset.step) || null;
            const subNo = Number(uploadBtn.dataset.sub) || null;
            const docCode = uploadBtn.dataset.doc || 'UPLOAD';
            const detail = { stepNo, subNo, docCode };
            window.dispatchEvent(new CustomEvent('generator:upload', { detail }));
            return;
        }
        const generateBtn = event.target.closest('.generator-generate-btn');
        if (generateBtn) {
            const dealId = getSelectedDealId();
            if (!dealId) {
                alert('Bitte zuerst ein Geschäft auswählen.');
                return;
            }
            const ready = await ensureDealContext(dealId);
            if (!ready) {
                alert('Geschäft konnte nicht geladen werden.');
                return;
            }
            const docType = normalizeDocType(generateBtn.dataset.docType);
            if (docType === 'SOURCE_UPLOADED') {
                try {
                    const sourceRef = generateBtn.dataset.sourceRef || '';
                    const { blob, filename } = await downloadStorageRef(sourceRef);
                    const extension = getFileExtension(filename);
                    if (extension !== 'pdf') {
                        setGeneratorInfoNote('PDF not available for this source template');
                    } else {
                        setGeneratorInfoNote('');
                    }
                    downloadBlobFile(blob, filename);
                } catch (err) {
                    console.error('Generator source template download failed:', err);
                    setGeneratorInfoNote('Template file not found in Supabase Storage. Please upload it to bucket \'templates\' or check source_ref.');
                }
                return;
            }
            const selectedLanguage = getSelectedLanguage();
            const docCode = generateBtn.dataset.doc;
            const templateResult = getTemplateForLanguage(docCode, selectedLanguage);
            const note = document.getElementById('generator-language-note');
            if (templateResult?.fallback && note) {
                note.textContent = 'Template fehlt in der gewählten Sprache. Fallback auf EN.';
            } else if (note) {
                note.textContent = '';
            }
            if (!templateResult?.template) {
                alert('Kein Template verfügbar.');
                return;
            }
            const contacts = await resolveContactsForDocument(dealId);
            const contactNames = contacts.map(contact => contact.full_name || contact.company || '').filter(Boolean);
            const placeholderValues = buildPlaceholderMap(docCode, contacts);
            let filledBody = applyTemplate(templateResult.template.body_md, placeholderValues);
            if (!templateResult.template.locked_text) {
                filledBody = addContactsSectionIfMissing(filledBody, contactNames, selectedLanguage);
            }
            const dealNo = window.currentDeal?.deal_no || 'deal';
            const filename = `${sanitizeFilename(dealNo)}_${sanitizeFilename(docCode)}_${selectedLanguage}.pdf`;
            openPdfPreview(filledBody, filename, contactNames);
        }
    });
}

function bindDealSelect() {
    const select = document.getElementById('generator-deal-select');
    if (!select || select.dataset.bound === 'true') return;
    select.dataset.bound = 'true';
    select.addEventListener('change', async () => {
        const dealId = getSelectedDealId();
        if (!dealId) {
            return;
        }
        await ensureDealContext(dealId);
    });
}

function getSelectedLanguage() {
    const select = document.getElementById('generator-language-select');
    const value = select?.value || 'EN';
    return ['EN', 'DE', 'FR'].includes(value) ? value : 'EN';
}

function getTemplateForLanguage(docCode, language) {
    if (!docCode) return null;
    const exact = templateIndex.get(`${docCode}::${language}`);
    if (exact) return { template: exact, fallback: false };
    const fallback = templateIndex.get(`${docCode}::EN`);
    if (fallback) return { template: fallback, fallback: true };
    return null;
}
