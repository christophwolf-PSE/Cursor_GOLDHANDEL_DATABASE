// Export Functions (CSV, Excel, Word, PDF)
import { supabase } from './supabase.js';

const LOGO_BLACK_PATHS = [
    'assets/Logo SCE black.png',
    'assets/SilberChrom Logo.jpeg',
    'assets/sce-logo-black.png'
];

// ============================================
// Export Handler
// ============================================
export async function handleExport() {
    const format = document.getElementById('export-format').value;
    const includeProcess = document.getElementById('export-process').checked;
    const includeRisks = document.getElementById('export-risks').checked;
    const includeContacts = document.getElementById('export-contacts').checked;
    const includeDocuments = document.getElementById('export-documents').checked;
    const includeDiscountParticipation = document.getElementById('export-discount-participation')?.checked;
    
    if (!includeProcess && !includeRisks && !includeContacts && !includeDocuments && !includeDiscountParticipation) {
        alert('Bitte wählen Sie mindestens einen Export-Inhalt aus');
        return;
    }
    
    // Get current deal data
    const deal = window.currentDeal;
    if (!deal) {
        alert('Kein Geschäft ausgewählt');
        return;
    }
    
    // Load all data
    const [steps, risks, contacts, documents, banks] = await Promise.all([
        includeProcess ? loadDealSteps(deal.id) : Promise.resolve([]),
        includeRisks ? loadDealRisks(deal.id) : Promise.resolve([]),
        includeContacts ? loadDealContacts(deal.id) : Promise.resolve([]),
        includeDocuments ? loadDealDocuments(deal.id) : Promise.resolve([]),
        includeContacts ? loadDealBanks(deal.id) : Promise.resolve([])
    ]);
    const stepsForDocs = includeDocuments
        ? (includeProcess ? steps : await loadDealSteps(deal.id))
        : [];
    
    // Export based on format
    switch (format) {
        case 'csv':
            exportToCSV(deal, steps, risks, contacts, documents, banks, stepsForDocs, includeProcess, includeRisks, includeContacts, includeDocuments, includeDiscountParticipation);
            break;
        case 'xlsx':
            exportToExcel(deal, steps, risks, contacts, documents, banks, stepsForDocs, includeProcess, includeRisks, includeContacts, includeDocuments, includeDiscountParticipation);
            break;
        case 'pdf':
            await exportToPDF(deal, steps, risks, contacts, documents, banks, stepsForDocs, includeProcess, includeRisks, includeContacts, includeDocuments, includeDiscountParticipation);
            break;
        case 'docx':
            await exportToWord(deal, steps, risks, contacts, documents, banks, stepsForDocs, includeProcess, includeRisks, includeContacts, includeDocuments, includeDiscountParticipation);
            break;
    }
    
    // Close modal
    document.getElementById('export-modal').classList.remove('active');
}

export async function exportDealsOverview(orientation = 'portrait') {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({ orientation });
    const deals = (window.getAllDeals && window.getAllDeals()) ? window.getAllDeals() : [];
    const sellerMap = await fetchSellerMapForDeals(deals);
    const progressMap = await fetchProgressMapForDeals(deals);
    const rows = deals.map(deal => ([
        deal.deal_no || '',
        deal.seller_name || sellerMap[deal.id] || deal.seller || '-',
        deal.commodity_type || '-',
        formatDiscountValue(deal.lbma_discount_pct),
        shortenOfferText(deal.offer_terms),
        formatProgressValue(resolveProgressValue(deal.started_progress, progressMap[deal.id]?.started)),
        formatProgressValue(resolveProgressValue(deal.progress, progressMap[deal.id]?.done))
    ]));
    doc.setFontSize(14);
    doc.text('Deal-Übersicht', 14, 18);
    const columnWidths = getOverviewColumnWidths(doc);
    doc.autoTable({
        startY: 24,
        head: [['Geschäftsnr.', 'Seller', 'Ware', 'Disc.%', 'Angebot', 'Begonnen', 'Abgeschlossen']],
        body: rows.length ? rows : [['-', '-', '-', '-', '-', '-', '-']],
        styles: { fontSize: 9, cellPadding: 3 },
        headStyles: { fillColor: [13, 110, 253], textColor: 255 },
        columnStyles: {
            0: { cellWidth: columnWidths[0], overflow: 'ellipsize' },
            1: { cellWidth: columnWidths[1], overflow: 'ellipsize' },
            2: { cellWidth: columnWidths[2], overflow: 'ellipsize' },
            3: { cellWidth: columnWidths[3], halign: 'center' },
            4: { cellWidth: columnWidths[4], overflow: 'ellipsize' },
            5: { cellWidth: columnWidths[5] },
            6: { cellWidth: columnWidths[6] }
        },
        didParseCell: (data) => {
            if (data.section !== 'body') return;
            if (data.column.index === 3) {
                const color = getDiscountColor(data.cell.raw);
                data.cell.styles.textColor = color;
                data.cell.styles.fontStyle = 'bold';
            }
            if (data.column.index === 5 || data.column.index === 6) {
                data.cell.styles.valign = 'top';
                data.cell.styles.cellPadding = { top: 2, right: 2, bottom: 6, left: 2 };
            }
        },
        didDrawCell: (data) => {
            if (data.section !== 'body') return;
            if (data.column.index !== 5 && data.column.index !== 6) return;
            const raw = String(data.cell.raw || '').replace('%', '');
            const value = Math.max(0, Math.min(100, Number(raw) || 0));
            const barHeight = 3;
            const padding = 2;
            const barWidth = Math.max(14, Math.min(28, data.cell.width - padding * 2));
            const barX = data.cell.x + (data.cell.width - barWidth) / 2;
            const barY = data.cell.y + data.cell.height - barHeight - 2;
            doc.setFillColor(230, 233, 237);
            doc.rect(barX, barY, barWidth, barHeight, 'F');
            doc.setFillColor(13, 110, 253);
            doc.rect(barX, barY, barWidth * (value / 100), barHeight, 'F');
        }
    });
    addOverviewFooter(doc);
    doc.save(`deal_overview_${new Date().toISOString().split('T')[0]}.pdf`);
}

function formatProgressValue(value) {
    const num = Number(value);
    if (!Number.isFinite(num)) return '0%';
    return `${Math.max(0, Math.min(100, Math.round(num)))}%`;
}

function resolveProgressValue(primary, fallback) {
    const primaryNum = Number(primary);
    if (Number.isFinite(primaryNum)) return primaryNum;
    const fallbackNum = Number(fallback);
    if (Number.isFinite(fallbackNum)) return fallbackNum;
    return 0;
}

function formatDiscountValue(value) {
    const num = Number.isFinite(Number(value)) ? Number(value) : 0;
    return `${Math.round(num)}%`;
}

function getDiscountColor(value) {
    const num = Number.isFinite(Number(String(value).replace('%', ''))) ? Number(String(value).replace('%', '')) : 0;
    if (num === 12) return [25, 135, 84];
    if (num > 12) return [13, 202, 240];
    return [220, 53, 69];
}

function shortenOfferText(value) {
    if (!value) return '-';
    let text = String(value).trim();
    if (!text) return '-';
    const matches = [];
    const regex = /(\d+(?:[.,]\d+)?)\s*kg\/?mo.*?\(M?(\d+)\s*-\s*(\d+)\)/gi;
    let match;
    while ((match = regex.exec(text)) !== null) {
        matches.push(`${match[1].replace(',', '.')} (${match[2]}->${match[3]})`);
    }
    if (matches.length) {
        return matches.join(', ');
    }
    text = text.replace(/[()]/g, '');
    text = text.replace(/\s*->\s*/g, ' -> ');
    text = text.replace(/\bterm\b/gi, 'T');
    text = text.replace(/\bmonths?\b/gi, 'mo');
    text = text.replace(/\bmonth\b/gi, 'mo');
    text = text.replace(/\s*kg\s*\/\s*mo/gi, 'kg/mo');
    text = text.replace(/\s*kg\s*\/\s*month/gi, 'kg/mo');
    text = text.replace(/,\s*/g, ' ');
    text = text.replace(/\s+/g, ' ').trim();
    const maxLen = 44;
    if (text.length <= maxLen) return text;
    return `${text.slice(0, maxLen - 1)}…`;
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
        const name = row.contact?.full_name || row.contact?.company || '';
        acc[row.deal_id] = name ? formatSellerName(name) : '-';
        return acc;
    }, {});
}

async function fetchProgressMapForDeals(deals) {
    if (!supabase || !Array.isArray(deals) || deals.length === 0) {
        return {};
    }
    const dealIds = deals.map(deal => deal.id).filter(Boolean);
    if (dealIds.length === 0) {
        return {};
    }
    const { data, error } = await supabase
        .from('deal_steps')
        .select('deal_id, status')
        .in('deal_id', dealIds);
    if (error) {
        console.error('Error loading deal steps for overview:', error);
        return {};
    }
    const map = {};
    (data || []).forEach(row => {
        if (!map[row.deal_id]) {
            map[row.deal_id] = { total: 0, done: 0, started: 0 };
        }
        const entry = map[row.deal_id];
        entry.total += 1;
        if (row.status === 'Done' || row.status === 'Verified') {
            entry.done += 1;
        }
        if (['In Progress', 'Done', 'Verified', 'Blocked'].includes(row.status)) {
            entry.started += 1;
        }
    });
    Object.keys(map).forEach(dealId => {
        const entry = map[dealId];
        const total = entry.total || 0;
        map[dealId] = {
            done: total ? Math.round((entry.done / total) * 100) : 0,
            started: total ? Math.round((entry.started / total) * 100) : 0
        };
    });
    return map;
}

function getOverviewColumnWidths(doc) {
    const available = doc.internal.pageSize.getWidth() - 28;
    const isLandscape = available > 190;
    const desired = isLandscape
        ? [29, 48, 22, 18, 91, 33, 33]
        : [18, 20, 16, 18, 40, 50, 50];
    const total = desired.reduce((sum, value) => sum + value, 0);
    if (total <= available) {
        return desired;
    }
    const scale = available / total;
    return desired.map(value => Math.max(10, value * scale));
}

function addOverviewFooter(doc) {
    const pageCount = doc.getNumberOfPages();
    const printedAt = new Date().toLocaleString('de-DE');
    const pageHeight = doc.internal.pageSize.getHeight();
    const pageWidth = doc.internal.pageSize.getWidth();
    const colWidth = (pageWidth - 28) / 5;
    doc.setFontSize(7);
    for (let page = 1; page <= pageCount; page += 1) {
        doc.setPage(page);
        const y = pageHeight - 6;
        const leftX = 14;
        const rightX = pageWidth - 14;
        doc.text('© SilberChrom', leftX, y, { align: 'left' });
        doc.text('Deal-Übersicht', leftX + colWidth, y, { align: 'left' });
        doc.text('Report', leftX + colWidth * 2, y, { align: 'left' });
        doc.text(`Ausdruck: ${printedAt}`, leftX + colWidth * 3, y, { align: 'left' });
        doc.text(`Seite ${page} von ${pageCount}`, rightX, y, { align: 'right' });
    }
    doc.setFontSize(10);
}

function formatSellerName(name) {
    const trimmed = String(name || '').trim();
    return trimmed || '-';
}

async function loadDealSteps(dealId) {
    const { data } = await supabase
        .from('deal_steps')
        .select('*')
        .eq('deal_id', dealId)
        .order('step_no', { ascending: true });
    return data || [];
}

async function loadDealRisks(dealId) {
    const { data } = await supabase
        .from('risks')
        .select('*')
        .eq('deal_id', dealId)
        .order('created_at', { ascending: false });
    return data || [];
}

async function loadDealDocuments(dealId) {
    const { data } = await supabase
        .from('documents')
        .select('*')
        .eq('deal_id', dealId)
        .order('uploaded_at', { ascending: false });
    return data || [];
}

async function loadDealContacts(dealId) {
    const { data } = await supabase
        .from('deal_contacts')
        .select('role, notes, contact:contacts(id, full_name, role, company, email, phone, mobile)')
        .eq('deal_id', dealId)
        .order('created_at', { ascending: false });
    return data || [];
}

async function loadDealBanks(dealId) {
    const { data } = await supabase
        .from('deal_bank_accounts')
        .select('bank_name, contact_id')
        .eq('deal_id', dealId)
        .order('created_at', { ascending: false });
    return data || [];
}

const DISCOUNT_GROUPS = [
    { key: 'netToBuyer', title: 'Net to Buyer' },
    { key: 'buyerSide', title: 'Buyer-Side' },
    { key: 'sellerSide', title: 'Seller-Side' },
    { key: 'service', title: 'Service' }
];

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
    const VAT_RATE = 0.19;
    return providers.reduce((acc, item) => {
        const gross = Number(item.amountEUR) || 0;
        const vatIncluded = Boolean(item.vatIncluded);
        const net = vatIncluded ? gross / (1 + VAT_RATE) : gross;
        acc.gross += gross;
        acc.net += net;
        if (item.costBearer === 'Seller') {
            acc.seller.gross += gross;
            acc.seller.net += net;
        }
        if (item.costBearer === 'Representative') {
            acc.representative.gross += gross;
            acc.representative.net += net;
        }
        if (item.costBearer === 'Buyer') {
            acc.buyer.gross += gross;
            acc.buyer.net += net;
        }
        return acc;
    }, {
        gross: 0,
        net: 0,
        seller: { gross: 0, net: 0 },
        representative: { gross: 0, net: 0 },
        buyer: { gross: 0, net: 0 }
    });
}

function formatPercent(value) {
    const number = Number(value) || 0;
    return number.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function formatAmount(value) {
    const number = Number(value) || 0;
    return number.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
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

function getDealCommodityDisplay(deal) {
    const label = deal?.discount_participation?.commodityLabel
        || getCommodityLabelFromValue(deal?.discount_participation?.commodityValue || deal?.commodity_type);
    if (deal?.commodity_type === 'Hallmark' && deal?.hallmark_age_bucket) {
        return `${label} (${deal.hallmark_age_bucket})`;
    }
    return label;
}

function formatUsd(value) {
    const number = Number(value) || 0;
    return number.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function getLbmaUsdPerOz() {
    try {
        const cached = JSON.parse(localStorage.getItem('lbma_quote') || 'null');
        const usd = Number(cached?.usd);
        return Number.isFinite(usd) ? usd : null;
    } catch (err) {
        return null;
    }
}

function getLbmaUsdPerKg() {
    const usdPerOz = getLbmaUsdPerOz();
    if (!usdPerOz) return null;
    return usdPerOz * 32.1507466;
}

function calculateAllocationUsd(participation, percent) {
    const usdPerKg = getLbmaUsdPerKg();
    if (!usdPerKg) return null;
    const goldAmountKg = Number(participation?.goldAmountKg) || 0;
    return goldAmountKg * usdPerKg * (Number(percent) || 0) / 100;
}

function buildStepLabelMap(steps) {
    return (steps || []).reduce((acc, step) => {
        acc[step.id] = `Schritt ${step.step_no}: ${step.title}`;
        return acc;
    }, {});
}

function getDiscountHighlightColor(discountValue) {
    const discount = Number.isFinite(Number(discountValue)) ? Number(discountValue) : 0;
    if (discount === 12) return [25, 135, 84];
    if (discount > 12) return [13, 202, 240];
    return [220, 53, 69];
}

function getContactSectionForExport(link) {
    const combined = [
        link.role || '',
        link.contact?.role || '',
        link.contact?.company || '',
        link.contact?.full_name || '',
        link.notes || ''
    ].join(' ').toLowerCase();
    if (/(bank|banker|customs|zoll)/i.test(combined)) return 'bank';
    if (/(importbeauftragter|goldhändler)/i.test(combined)) return 'buyer';
    if (/(logistics|assay|transport|security)/i.test(combined)) return 'service';
    if (/(seller-side|seller)/i.test(combined)) return 'seller';
    if (/(buyer-side|buyer|offtaker|investor|vorfinanzierer)/i.test(combined)) return 'buyer';
    return 'service';
}

function sortContactsForExport(contacts) {
    const sectionOrder = ['seller', 'buyer', 'bank', 'service'];
    return [...contacts].sort((a, b) => {
        const combinedA = [
            a.role || '',
            a.contact?.role || '',
            a.contact?.company || '',
            a.contact?.full_name || '',
            a.notes || ''
        ].join(' ').toLowerCase();
        const combinedB = [
            b.role || '',
            b.contact?.role || '',
            b.contact?.company || '',
            b.contact?.full_name || '',
            b.notes || ''
        ].join(' ').toLowerCase();
        const sectionA = getContactSectionForExport(a);
        const sectionB = getContactSectionForExport(b);
        if (sectionA !== sectionB) {
            return sectionOrder.indexOf(sectionA) - sectionOrder.indexOf(sectionB);
        }
        if (sectionA === 'seller') {
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
        if (sectionA === 'buyer') {
            const buyerRank = (text, name) => {
                if (/investor|vorfinanzierer/.test(text)) return 0;
                if (/koras|pmr|buyer representative/.test(text)) return 1;
                if (/imp|eckart|paymaster/.test(text)) return 2;
                if (/harald|foge/.test(name)) return 3;
                if (/christoph|wolf/.test(name)) return 4;
                if (/harald|foge/.test(text)) return 3;
                if (/christoph|wolf/.test(text)) return 4;
                if (/importbeauftragter|goldhändler|mergel/.test(text)) return 5;
                if (/co-?broker 1/.test(text)) return 6;
                if (/co-?broker 2/.test(text)) return 7;
                return 99;
            };
            const rankA = buyerRank(combinedA, (a.contact?.full_name || '').toLowerCase());
            const rankB = buyerRank(combinedB, (b.contact?.full_name || '').toLowerCase());
            if (rankA !== rankB) return rankA - rankB;
        }
        if (sectionA === 'bank') {
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
        if (sectionA === 'service') {
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
        return (a.contact?.full_name || '').localeCompare(b.contact?.full_name || '');
    });
}

function addPdfFooter(doc, deal) {
    const pageCount = doc.getNumberOfPages();
    const createdAt = new Date(deal.created_at).toLocaleString('de-DE');
    const printedAt = new Date().toLocaleString('de-DE');
    const pageHeight = doc.internal.pageSize.getHeight();
    const pageWidth = doc.internal.pageSize.getWidth();
    const colWidth = (pageWidth - 28) / 5;
    doc.setFontSize(7);
    for (let page = 1; page <= pageCount; page += 1) {
        doc.setPage(page);
        const y = pageHeight - 6;
        const leftX = 14;
        const rightX = pageWidth - 14;
        doc.text('© SilberChrom', leftX, y, { align: 'left' });
        doc.text(deal.deal_no, leftX + colWidth, y, { align: 'left' });
        doc.text(`Angelegt: ${createdAt}`, leftX + colWidth * 2, y, { align: 'left' });
        doc.text(`Ausdruck: ${printedAt}`, leftX + colWidth * 3, y, { align: 'left' });
        doc.text(`Seite ${page} von ${pageCount}`, rightX, y, { align: 'right' });
    }
    doc.setFontSize(10);
}

function getFullWidthTableOptions(doc) {
    const pageWidth = doc.internal.pageSize.getWidth();
    return {
        tableWidth: pageWidth - 28,
        margin: { left: 14, right: 14 }
    };
}

function renderDiscountParticipationPdf(doc, participation, startY) {
    let yPos = startY;
    const fullWidth = getFullWidthTableOptions(doc);
    const { sum, remaining } = calculateAllocationTotals(participation);
    const usdPerOz = getLbmaUsdPerOz();
    const usdPerKg = getLbmaUsdPerKg();
    const labelX = 14;
    const valueX = 54;
    const renderLine = (label, value, options = {}) => {
        doc.setFontSize(10);
        doc.setTextColor(0, 0, 0);
        doc.text(`${label}:`, labelX, yPos);
        if (options.color) {
            doc.setTextColor(...options.color);
        }
        doc.text(`${value}`, valueX, yPos);
        doc.setTextColor(0, 0, 0);
        yPos += 6;
    };
    if (yPos > 245) {
        doc.addPage();
        yPos = 20;
    }
    doc.setFontSize(14);
    doc.text('Discount Participation Table', 14, yPos);
    yPos += 8;
    renderLine('Gross Discount %', `${formatPercent(participation.grossDiscountPercent)}%`, {
        color: getDiscountHighlightColor(participation.grossDiscountPercent)
    });
    renderLine('Goldmenge (kg)', formatAmount(participation.goldAmountKg || 0));
    renderLine('LBMA USD/oz', usdPerOz ? `$ ${formatUsd(usdPerOz)}` : '-');
    renderLine('LBMA USD/kg', usdPerKg ? `$ ${formatUsd(usdPerKg)}` : '-');
    renderLine('Summe verteilt %', `${formatPercent(sum)}%`);
    const remainingLabel = remaining >= 0 ? 'Rest %' : 'Überzeichnet %';
    renderLine(remainingLabel, `${formatPercent(Math.abs(remaining))}%`);
    const statusLabel = remaining > 0
        ? `Noch ${formatPercent(remaining)}% zu verteilen`
        : remaining < 0
            ? `Überzeichnet um ${formatPercent(Math.abs(remaining))}%`
            : 'Verteilung vollständig';
    renderLine('Status', statusLabel);

    DISCOUNT_GROUPS.forEach((group, index) => {
        const activeItems = participation.allocations[group.key].filter(item => item.enabled);
        if (activeItems.length === 0) {
            return;
        }
        if (yPos > 245) {
            doc.addPage();
            yPos = 20;
        }
        if (index === 0) {
            yPos += 6;
        }
        doc.setFontSize(12);
        doc.text(group.title, 14, yPos);
        yPos += 6;
        const body = activeItems.map(item => [
            item.label,
            item.enabled ? 'Ja' : 'Nein',
            `${formatPercent(item.percent)}%`,
            (() => {
                const allocationUsd = calculateAllocationUsd(participation, item.percent);
                return allocationUsd ? `$ ${formatUsd(allocationUsd)}` : '-';
            })()
        ]);
        if (typeof doc.setCharSpace === 'function') {
            doc.setCharSpace(0);
        }
        doc.autoTable({
            startY: yPos,
            head: [['Position', 'Aktiv', 'Prozent', 'USD Anteil']],
            body,
            styles: { fontSize: 8, halign: 'left' },
            headStyles: { fillColor: [13, 110, 253] },
            columnStyles: {
                0: { cellWidth: (() => {
                    const tableWidth = doc.internal.pageSize.getWidth() - 28;
                    const activeW = 20;
                    const percentW = 28;
                    const usdW = 40;
                    return tableWidth - (activeW + percentW + usdW);
                })() },
                1: { cellWidth: 20, halign: 'left' },
                2: { cellWidth: 28, halign: 'left' },
                3: { cellWidth: 40, halign: 'left' }
            },
            ...fullWidth
        });
        yPos = doc.lastAutoTable.finalY + 6;
    });

    if (yPos > 245) {
        doc.addPage();
        yPos = 20;
    }
    doc.setFontSize(12);
    doc.text('Service Provider Kosten (EUR)', 14, yPos);
    yPos += 6;
    const providerTableWidth = doc.internal.pageSize.getWidth() - 28;
    const providerCol2 = 35;
    const providerCol3 = 40;
    const providerCol1 = providerTableWidth - (providerCol2 + providerCol3);
    const providerBody = participation.providers.map(item => [
        item.name,
        `€ ${formatAmount(item.amountEUR)}`,
        item.costBearer
    ]);
    if (typeof doc.setCharSpace === 'function') {
        doc.setCharSpace(0);
    }
    doc.autoTable({
        startY: yPos,
        head: [['Service Provider', 'Betrag', 'Kostenträger']],
        body: providerBody,
        styles: { fontSize: 8 },
        headStyles: { fillColor: [25, 135, 84] },
        columnStyles: {
            0: { cellWidth: providerCol1 },
            1: { cellWidth: providerCol2 },
            2: { cellWidth: providerCol3 }
        },
        ...fullWidth
    });
    yPos = doc.lastAutoTable.finalY + 6;
    const totals = calculateProviderTotals(participation);
    doc.setFontSize(10);
    const totalsStart = yPos;
    const leftX = 14;
    const boxPadding = 2;
    const grossX = leftX + providerCol1 + boxPadding;
    const netX = leftX + providerCol1 + providerCol2 + boxPadding;
    doc.setFontSize(9);
    doc.text('Brutto', grossX, yPos);
    doc.text('Netto', netX, yPos);
    yPos += 5;
    doc.setFontSize(10);
    doc.text('Seller', leftX + boxPadding, yPos);
    doc.text(`€ ${formatAmount(totals.seller.gross)}`, grossX, yPos);
    doc.text(`€ ${formatAmount(totals.seller.net)}`, netX, yPos);
    yPos += 5;
    doc.text('Representative', leftX + boxPadding, yPos);
    doc.text(`€ ${formatAmount(totals.representative.gross)}`, grossX, yPos);
    doc.text(`€ ${formatAmount(totals.representative.net)}`, netX, yPos);
    yPos += 5;
    doc.text('Buyer', leftX + boxPadding, yPos);
    doc.text(`€ ${formatAmount(totals.buyer.gross)}`, grossX, yPos);
    doc.text(`€ ${formatAmount(totals.buyer.net)}`, netX, yPos);
    yPos += 5;
    doc.text('Gesamt', leftX + boxPadding, yPos);
    doc.text(`€ ${formatAmount(totals.gross)}`, grossX, yPos);
    doc.text(`€ ${formatAmount(totals.net)}`, netX, yPos);
    yPos += 6;
    doc.setFontSize(8);
    doc.text('USD-Berechnung basiert auf LBMA USD/oz und der Mengenangabe im Modal', leftX + boxPadding, yPos);
    const boxHeight = (yPos - totalsStart) + 6;
    doc.rect(leftX, totalsStart - 4, providerTableWidth, boxHeight);
    yPos += 8;
    return yPos;
}

// ============================================
// CSV Export
// ============================================
function exportToCSV(deal, steps, risks, contacts, documents, banks, stepsForDocs, includeProcess, includeRisks, includeContacts, includeDocuments, includeDiscountParticipation) {
    let csvContent = '';
    
    // Deal Info
    csvContent += 'Geschäftsinformationen\n\n';
    csvContent += `Geschäftsnummer,${deal.deal_no}\n`;
    csvContent += `Status,${deal.status}\n`;
    csvContent += `Land,${deal.country}\n`;
    csvContent += `Route,${deal.route || ''}\n`;
    csvContent += `Ware,${getDealCommodityDisplay(deal)}\n`;
    csvContent += `Angebot,${deal.offer_terms || ''}\n`;
    csvContent += `LBMA disc. %,${deal.lbma_discount_pct ?? 0}\n`;
    csvContent += `Erstellt,${new Date(deal.created_at).toLocaleString('de-DE')}\n`;

    // Process Steps
    if (includeProcess && steps.length > 0) {
        csvContent += 'Prozessschritte\n';
        csvContent += 'Schritt, Titel, Beschreibung, Status, Verantwortliche Rolle, Fälligkeitsdatum, Erledigt am, Verifiziert am\n';
        steps.forEach(step => {
            csvContent += `${step.step_no},"${step.title}","${(step.description || '').replace(/"/g, '""')}",${step.status},${step.responsible_role},${step.due_date ? new Date(step.due_date).toLocaleDateString('de-DE') : ''},${step.done_at ? new Date(step.done_at).toLocaleString('de-DE') : ''},${step.verified_at ? new Date(step.verified_at).toLocaleString('de-DE') : ''}\n`;
        });
        csvContent += '\n';
    }
    
    // Risks
    if (includeRisks && risks.length > 0) {
        csvContent += 'Risiko-Register\n';
        csvContent += 'Kategorie, Beschreibung, Schweregrad, Wahrscheinlichkeit, Score, Mitigation, Owner, Status\n';
        risks.forEach(risk => {
            const score = risk.severity * risk.probability;
            csvContent += `${risk.category},"${(risk.description || '').replace(/"/g, '""')}",${risk.severity},${risk.probability},${score},"${(risk.mitigation || '').replace(/"/g, '""')}",${risk.owner || ''},${risk.status}\n`;
        });
        csvContent += '\n';
    }

    if (includeContacts && contacts.length > 0) {
        const sortedContacts = sortContactsForExport(contacts);
        csvContent += 'Beteiligte Kontakte\n';
        csvContent += 'Name, Rolle im Deal, Funktion, Firma, E-Mail, Telefon, Mobil, Notiz\n';
        sortedContacts.forEach(link => {
            csvContent += `"${link.contact?.full_name || ''}",${link.role || ''},${link.contact?.role || ''},"${link.contact?.company || ''}",${link.contact?.email || ''},${link.contact?.phone || ''},${link.contact?.mobile || ''},"${(link.notes || '').replace(/"/g, '""')}"\n`;
        });
        csvContent += '\n';
    }

    if (includeDiscountParticipation) {
        const participation = normalizeDiscountParticipation(deal.discount_participation);
        const { sum, remaining } = calculateAllocationTotals(participation);
        const usdPerOz = getLbmaUsdPerOz();
        const usdPerKg = getLbmaUsdPerKg();
        csvContent += 'Discount Participation Table\n';
        csvContent += `Gross Discount %,${formatPercent(participation.grossDiscountPercent)}\n`;
        csvContent += `Goldmenge (kg),${formatAmount(participation.goldAmountKg || 0)}\n`;
        csvContent += `LBMA USD/oz,${usdPerOz ? formatUsd(usdPerOz) : ''}\n`;
        csvContent += `LBMA USD/kg,${usdPerKg ? formatUsd(usdPerKg) : ''}\n`;
        const statusLabel = remaining > 0
            ? `Noch ${formatPercent(remaining)}% zu verteilen`
            : remaining < 0
                ? `Überzeichnet um ${formatPercent(Math.abs(remaining))}%`
                : 'Verteilung vollständig';
        csvContent += `Summe verteilt %,${formatPercent(sum)}\n`;
        csvContent += `Rest %,${formatPercent(remaining)}\n`;
        csvContent += `Status,${statusLabel}\n`;

        DISCOUNT_GROUPS.forEach(group => {
            csvContent += `${group.title}\n`;
            csvContent += 'Position,Aktiv,Prozent,USD Anteil\n';
            participation.allocations[group.key].forEach(item => {
                const allocationUsd = calculateAllocationUsd(participation, item.percent);
                csvContent += `"${item.label.replace(/"/g, '""')}",${item.enabled ? 'Ja' : 'Nein'},${formatPercent(item.percent)},${allocationUsd ? formatUsd(allocationUsd) : ''}\n`;
            });
            csvContent += '\n';
        });

        csvContent += 'Service Provider Kosten (EUR)\n';
        csvContent += 'Service Provider,Betrag EUR,Kostentraeger\n';
        participation.providers.forEach(item => {
            csvContent += `"${item.name.replace(/"/g, '""')}",${formatAmount(item.amountEUR)},${item.costBearer}\n`;
        });
        const totals = calculateProviderTotals(participation);
        csvContent += `Summen,Seller Brutto,${formatAmount(totals.seller.gross)}\n`;
        csvContent += `Summen,Seller Netto,${formatAmount(totals.seller.net)}\n`;
        csvContent += `Summen,Representative Brutto,${formatAmount(totals.representative.gross)}\n`;
        csvContent += `Summen,Representative Netto,${formatAmount(totals.representative.net)}\n`;
        csvContent += `Summen,Buyer Brutto,${formatAmount(totals.buyer.gross)}\n`;
        csvContent += `Summen,Buyer Netto,${formatAmount(totals.buyer.net)}\n`;
        csvContent += `Summen,Gesamt Brutto,${formatAmount(totals.gross)}\n`;
        csvContent += `Summen,Gesamt Netto,${formatAmount(totals.net)}\n`;
        csvContent += 'Hinweis,USD-Berechnung basiert auf LBMA USD/oz und der Mengenangabe im Modal\n';
    }
    
    // Documents
    if (includeDocuments && documents.length > 0) {
        const stepMap = buildStepLabelMap(stepsForDocs);
        csvContent += 'Dokumentindex\n';
        csvContent += 'Dateiname, Schritt, Typ, Hochgeladen am\n';
        documents.forEach(doc => {
            const stepLabel = doc.step_id ? (stepMap[doc.step_id] || '') : '';
            csvContent += `"${doc.file_name}","${stepLabel}",${doc.doc_type},${new Date(doc.uploaded_at).toLocaleString('de-DE')}\n`;
        });
        csvContent += '\n';
    }
    
    // Download
    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${deal.deal_no}_export_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(link.href);
}

// ============================================
// Excel Export (using SheetJS)
// ============================================
function exportToExcel(deal, steps, risks, contacts, documents, banks, stepsForDocs, includeProcess, includeRisks, includeContacts, includeDocuments, includeDiscountParticipation) {
    const workbook = XLSX.utils.book_new();
    
    // Deal Info Sheet
    const dealData = [
        ['Geschäftsinformationen'],
        [],
        ['Geschäftsnummer', deal.deal_no],
        ['Status', deal.status],
        ['Land', deal.country],
        ['Route', deal.route || ''],
        ['Ware', getDealCommodityDisplay(deal)],
        ['Angebot', deal.offer_terms || ''],
        ['LBMA disc. %', deal.lbma_discount_pct ?? 0],
        ['Erstellt', new Date(deal.created_at).toLocaleString('de-DE')]
    ];
    const dealSheet = XLSX.utils.aoa_to_sheet(dealData);
    XLSX.utils.book_append_sheet(workbook, dealSheet, 'Geschäft');
    
    // Process Steps Sheet
    if (includeProcess && steps.length > 0) {
        const stepsData = [
            ['Schritt', 'Titel', 'Beschreibung', 'Status', 'Verantwortliche Rolle', 'Fälligkeitsdatum', 'Erledigt am', 'Verifiziert am', 'Verifikationsnotiz']
        ];
        steps.forEach(step => {
            stepsData.push([
                step.step_no,
                step.title,
                step.description || '',
                step.status,
                step.responsible_role,
                step.due_date ? new Date(step.due_date).toLocaleDateString('de-DE') : '',
                step.done_at ? new Date(step.done_at).toLocaleString('de-DE') : '',
                step.verified_at ? new Date(step.verified_at).toLocaleString('de-DE') : '',
                step.verification_note || ''
            ]);
        });
        const stepsSheet = XLSX.utils.aoa_to_sheet(stepsData);
        XLSX.utils.book_append_sheet(workbook, stepsSheet, 'Prozessschritte');
    }
    
    // Risks Sheet
    if (includeRisks && risks.length > 0) {
        const risksData = [
            ['Kategorie', 'Beschreibung', 'Schweregrad', 'Wahrscheinlichkeit', 'Score', 'Mitigation', 'Owner', 'Status', 'Erstellt am']
        ];
        risks.forEach(risk => {
            const score = risk.severity * risk.probability;
            risksData.push([
                risk.category,
                risk.description,
                risk.severity,
                risk.probability,
                score,
                risk.mitigation || '',
                risk.owner || '',
                risk.status,
                new Date(risk.created_at).toLocaleString('de-DE')
            ]);
        });
        const risksSheet = XLSX.utils.aoa_to_sheet(risksData);
        XLSX.utils.book_append_sheet(workbook, risksSheet, 'Risiken');
    }

    if (includeContacts && contacts.length > 0) {
        const sortedContacts = sortContactsForExport(contacts);
        const contactsData = [
            ['Name', 'Rolle im Deal', 'Funktion', 'Firma', 'E-Mail', 'Telefon', 'Mobil', 'Notiz']
        ];
        sortedContacts.forEach(link => {
            contactsData.push([
                link.contact?.full_name || '',
                link.role || '',
                link.contact?.role || '',
                link.contact?.company || '',
                link.contact?.email || '',
                link.contact?.phone || '',
                link.contact?.mobile || '',
                link.notes || ''
            ]);
        });
        const contactsSheet = XLSX.utils.aoa_to_sheet(contactsData);
        XLSX.utils.book_append_sheet(workbook, contactsSheet, 'Kontakte');
    }

    if (includeDiscountParticipation) {
        const participation = normalizeDiscountParticipation(deal.discount_participation);
        const { sum, remaining } = calculateAllocationTotals(participation);
        const usdPerOz = getLbmaUsdPerOz();
        const usdPerKg = getLbmaUsdPerKg();
        const statusLabel = remaining > 0
            ? `Noch ${formatPercent(remaining)}% zu verteilen`
            : remaining < 0
                ? `Überzeichnet um ${formatPercent(Math.abs(remaining))}%`
                : 'Verteilung vollständig';
        const data = [
            ['Discount Participation Table'],
            ['Gross Discount %', formatPercent(participation.grossDiscountPercent)],
            ['Goldmenge (kg)', formatAmount(participation.goldAmountKg || 0)],
            ['LBMA USD/oz', usdPerOz ? formatUsd(usdPerOz) : '-'],
            ['LBMA USD/kg', usdPerKg ? formatUsd(usdPerKg) : '-'],
            ['Summe verteilt %', formatPercent(sum)],
            ['Rest %', formatPercent(remaining)],
            ['Status', statusLabel]
        ];
        DISCOUNT_GROUPS.forEach(group => {
            data.push([group.title]);
            data.push(['Position', 'Aktiv', 'Prozent', 'USD Anteil']);
            participation.allocations[group.key].forEach(item => {
                const allocationUsd = calculateAllocationUsd(participation, item.percent);
                data.push([item.label, item.enabled ? 'Ja' : 'Nein', formatPercent(item.percent), allocationUsd ? formatUsd(allocationUsd) : '-']);
            });
        });
        data.push(['Service Provider Kosten (EUR)']);
        data.push(['Service Provider', 'Betrag EUR', 'Kostenträger']);
        participation.providers.forEach(item => {
            data.push([item.name, formatAmount(item.amountEUR), item.costBearer]);
        });
        const totals = calculateProviderTotals(participation);
        data.push(['Summen', 'Seller Brutto', formatAmount(totals.seller.gross)]);
        data.push(['Summen', 'Seller Netto', formatAmount(totals.seller.net)]);
        data.push(['Summen', 'Representative Brutto', formatAmount(totals.representative.gross)]);
        data.push(['Summen', 'Representative Netto', formatAmount(totals.representative.net)]);
        data.push(['Summen', 'Buyer Brutto', formatAmount(totals.buyer.gross)]);
        data.push(['Summen', 'Buyer Netto', formatAmount(totals.buyer.net)]);
        data.push(['Summen', 'Gesamt Brutto', formatAmount(totals.gross)]);
        data.push(['Summen', 'Gesamt Netto', formatAmount(totals.net)]);
        data.push(['Hinweis', 'USD-Berechnung basiert auf LBMA USD/oz und der Mengenangabe im Modal']);
        const sheet = XLSX.utils.aoa_to_sheet(data);
        XLSX.utils.book_append_sheet(workbook, sheet, 'Discount Participation');
    }

    // Documents Sheet
    if (includeDocuments && documents.length > 0) {
        const stepMap = buildStepLabelMap(stepsForDocs);
        const docsData = [
            ['Dateiname', 'Schritt', 'Typ', 'Hochgeladen am', 'Uploader']
        ];
        documents.forEach(doc => {
            docsData.push([
                doc.file_name,
                doc.step_id ? (stepMap[doc.step_id] || '') : '',
                doc.doc_type,
                new Date(doc.uploaded_at).toLocaleString('de-DE'),
                doc.uploaded_by || ''
            ]);
        });
        const docsSheet = XLSX.utils.aoa_to_sheet(docsData);
        XLSX.utils.book_append_sheet(workbook, docsSheet, 'Dokumente');
    }
    
    // Download
    XLSX.writeFile(workbook, `${deal.deal_no}_export_${new Date().toISOString().split('T')[0]}.xlsx`);
}

// ============================================
// PDF Export (using jsPDF)
// ============================================
async function exportToPDF(deal, steps, risks, contacts, documents, banks, stepsForDocs, includeProcess, includeRisks, includeContacts, includeDocuments, includeDiscountParticipation) {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    
    let yPos = 20;
    
    const logo = await loadLogoImage(LOGO_BLACK_PATHS);
    if (logo) {
        const pageWidth = doc.internal.pageSize.getWidth();
        const maxWidth = 60;
        const ratio = logo.height / logo.width;
        const logoWidth = Math.min(maxWidth, pageWidth - 28);
        const logoHeight = logoWidth * ratio;
        const x = (pageWidth - logoWidth) / 2;
        doc.addImage(logo.dataUrl, logo.format, x, 10, logoWidth, logoHeight);
        yPos = 10 + logoHeight + 8;
    }
    
    // Deal Info
    doc.setFontSize(16);
    const titleY = yPos;
    doc.text('Geschäftsinformationen', 14, titleY);
    const pageWidth = doc.internal.pageSize.getWidth();
    doc.setFontSize(9);
    doc.text(`Erstellt: ${new Date(deal.created_at).toLocaleString('de-DE')}`, pageWidth - 14, titleY, { align: 'right' });
    yPos += 10;
    
    doc.setFontSize(10);
    if (typeof doc.setCharSpace === 'function') {
        doc.setCharSpace(0);
    }
    const infoRows = [
        { label: 'Geschäftsnummer', value: deal.deal_no },
        { label: 'Status', value: deal.status },
        { label: 'Land', value: deal.country },
        { label: 'Route', value: deal.route || '' },
        { label: 'Ware', value: getDealCommodityDisplay(deal) },
        { label: 'Angebot', value: deal.offer_terms ? deal.offer_terms.replace(/\s+/g, ' ').trim() : '' },
        { label: 'Seller', value: deal.seller_name || '' },
        { label: 'LBMA disc. %', value: `${Math.round(Number(deal.lbma_discount_pct) || 0)}%`, highlight: true }
    ];
    const labelX = 14;
    const valueX = 54;
    infoRows.forEach(row => {
        doc.setTextColor(0, 0, 0);
        doc.text(`${row.label}:`, labelX, yPos);
        if (row.highlight) {
            doc.setTextColor(...getDiscountHighlightColor(deal.lbma_discount_pct));
        }
        const maxWidth = pageWidth - valueX - 14;
        const lines = row.value ? doc.splitTextToSize(`${row.value}`, maxWidth) : [''];
        doc.text(lines[0] || '', valueX, yPos);
        doc.setTextColor(0, 0, 0);
        for (let i = 1; i < lines.length; i += 1) {
            yPos += 6;
            doc.text(lines[i], valueX, yPos);
        }
        yPos += 6;
    });
    yPos += 16;
    
    // Process Steps Table
    if (includeProcess && steps.length > 0) {
        if (yPos > 250) {
            doc.addPage();
            yPos = 20;
        }
        
        doc.setFontSize(14);
        doc.text('Prozessschritte', 14, yPos);
        yPos += 4;
        
        const stepsTableData = steps.map(step => [
            step.step_no.toString(),
            step.title,
            step.status,
            step.responsible_role,
            step.due_date ? new Date(step.due_date).toLocaleDateString('de-DE') : ''
        ]);
        const stepsTableWidth = doc.internal.pageSize.getWidth() - 28;
        const stepCol1 = 18;
        const stepCol3 = 22;
        const stepCol4 = 30;
        const stepCol5 = 22;
        const stepCol2 = stepsTableWidth - (stepCol1 + stepCol3 + stepCol4 + stepCol5);
        
        doc.autoTable({
            startY: yPos,
            head: [['Schritt', 'Titel', 'Status', 'Rolle', 'Fällig']],
            body: stepsTableData,
            styles: { fontSize: 8 },
            headStyles: { fillColor: [13, 110, 253] },
            columnStyles: {
                0: { cellWidth: stepCol1 },
                1: { cellWidth: stepCol2 },
                2: { cellWidth: stepCol3 },
                3: { cellWidth: stepCol4 },
                4: { cellWidth: stepCol5 }
            },
            ...getFullWidthTableOptions(doc)
        });
        
        yPos = doc.lastAutoTable.finalY + 22;
    }
    
    // Risks Table
    if (includeRisks && risks.length > 0) {
        if (yPos > 250) {
            doc.addPage();
            yPos = 20;
        }
        
        doc.setFontSize(14);
        doc.text('Risiko-Register', 14, yPos);
        yPos += 4;
        
        const risksTableWidth = doc.internal.pageSize.getWidth() - 28;
        const riskCol1 = 24;
        const riskCol2 = 60;
        const riskCol3 = 14;
        const riskCol4 = 18;
        const riskCol5 = risksTableWidth - (riskCol1 + riskCol2 + riskCol3 + riskCol4);
        const risksTableData = risks.map(risk => {
            const detailsParts = [];
            if (risk.mitigation) detailsParts.push(`Mitigation: ${risk.mitigation}`);
            if (risk.owner) detailsParts.push(`Owner: ${risk.owner}`);
            return [
                risk.category,
                risk.description,
                `${risk.severity}/${risk.probability}`,
                risk.status,
                detailsParts.join(' | ')
            ];
        });
        
        doc.autoTable({
            startY: yPos,
            head: [['Kategorie', 'Beschreibung', 'S/P', 'Status', 'Details']],
            body: risksTableData,
            styles: { fontSize: 7 },
            headStyles: { fillColor: [220, 53, 69] },
            columnStyles: {
                0: { cellWidth: riskCol1 },
                1: { cellWidth: riskCol2 },
                2: { cellWidth: riskCol3 },
                3: { cellWidth: riskCol4 },
                4: { cellWidth: riskCol5 }
            },
            ...getFullWidthTableOptions(doc)
        });
        
        yPos = doc.lastAutoTable.finalY + 22;
    }
    
    if (includeContacts && contacts.length > 0) {
        if (yPos > 250) {
            doc.addPage();
            yPos = 20;
        }
        
        doc.setFontSize(14);
        doc.text('Beteiligte Kontakte', 14, yPos);
        yPos += 4;
        
        const pageWidth = doc.internal.pageSize.getWidth();
        const gap = 4;
        const cardWidth = (pageWidth - 28 - gap * 3) / 4;
        const cardHeight = 26;
        let x = 14;
        let col = 0;
        const bankMap = (banks || []).reduce((acc, bank) => {
            if (!bank.contact_id) return acc;
            if (!acc[bank.contact_id]) acc[bank.contact_id] = [];
            acc[bank.contact_id].push(bank.bank_name);
            return acc;
        }, {});
        const sortedContacts = sortContactsForExport(contacts);
        const grouped = { seller: [], buyer: [], bank: [], service: [] };
        sortedContacts.forEach(link => {
            const section = getContactSectionForExport(link);
            grouped[section]?.push(link);
        });
        const sections = [
            { key: 'seller', title: 'Seller' },
            { key: 'buyer', title: 'Buyer' },
            { key: 'bank', title: 'Bank+Customs' },
            { key: 'service', title: 'Service Provider' }
        ];
        sections.forEach((section, index) => {
            const items = grouped[section.key] || [];
            if (items.length === 0) return;
            if (yPos + 10 > 275) {
                doc.addPage();
                yPos = 20;
            }
            if (index === 0) {
                yPos += 6;
            }
            doc.setFontSize(11);
            doc.setTextColor(0, 0, 0);
            doc.text(section.title, 14, yPos);
            yPos += 4;
            x = 14;
            col = 0;
            items.forEach(link => {
                if (yPos + cardHeight > 275) {
                    doc.addPage();
                    yPos = 20;
                    x = 14;
                    col = 0;
                }
                doc.setDrawColor(225, 228, 235);
                doc.rect(x, yPos, cardWidth, cardHeight);
                doc.setFontSize(7);
                const roleLabel = link.contact?.role || '';
                const dealRole = link.role || '';
                const roleLine = [dealRole, roleLabel].filter(Boolean).join(' · ') || '-';
                const bankLabel = link.contact?.id ? (bankMap[link.contact.id]?.join(', ') || '') : '';
                doc.setTextColor(80, 86, 94);
                doc.text(roleLine, x + 2, yPos + 4);
                doc.setFontSize(8);
                doc.setTextColor(20, 24, 28);
                doc.text(`${link.contact?.full_name || '-'}`, x + 2, yPos + 8);
                doc.setFontSize(7);
                doc.setTextColor(80, 86, 94);
                doc.text(`${link.contact?.company || ''}`, x + 2, yPos + 12);
                doc.text(`${link.contact?.email || ''}`, x + 2, yPos + 16);
                doc.text(`${link.contact?.mobile || ''}`, x + 2, yPos + 20);
                if (bankLabel) {
                    doc.text(bankLabel, x + 2, yPos + 24);
                }
                if (col < 3) {
                    col += 1;
                    x = x + cardWidth + gap;
                } else {
                    col = 0;
                    x = 14;
                    yPos += cardHeight + gap;
                }
            });
            if (col !== 0) {
                yPos += cardHeight + gap;
            }
            const hasNextSection = sections.slice(index + 1).some(nextSection => (grouped[nextSection.key] || []).length > 0);
            if (hasNextSection) {
                yPos += 2;
            }
        });
    }

    if (includeDiscountParticipation) {
        const participation = normalizeDiscountParticipation(deal.discount_participation);
        yPos = renderDiscountParticipationPdf(doc, participation, yPos);
        yPos += 12;
    }
    
    // Documents Table
    if (includeDocuments && documents.length > 0) {
        if (yPos > 250) {
            doc.addPage();
            yPos = 20;
        }
        
        doc.setFontSize(14);
        doc.text('Dokumentindex', 14, yPos);
        yPos += 4;
        if (typeof doc.setCharSpace === 'function') {
            doc.setCharSpace(0);
        }

        const stepMap = buildStepLabelMap(stepsForDocs);
        const docsTableData = documents.map(doc => [
            doc.file_name.substring(0, 35),
            doc.step_id ? (stepMap[doc.step_id] || '') : '',
            doc.doc_type,
            new Date(doc.uploaded_at).toLocaleDateString('de-DE')
        ]);
        const docTableWidth = doc.internal.pageSize.getWidth() - 28;
        const docCol1 = 70;
        const docCol2 = 75;
        const docCol3 = 12;
        const docCol4 = docTableWidth - (docCol1 + docCol2 + docCol3);

        doc.autoTable({
            startY: yPos,
            head: [['Dateiname', 'Schritt', 'Typ', 'Hochgeladen']],
            body: docsTableData,
            styles: { fontSize: 8 },
            headStyles: { fillColor: [25, 135, 84] },
            columnStyles: {
                0: { cellWidth: docCol1 },
                1: { cellWidth: docCol2 },
                2: { cellWidth: docCol3 },
                3: { cellWidth: docCol4 }
            },
            ...getFullWidthTableOptions(doc)
        });
    }
    addPdfFooter(doc, deal);

    // Download
    doc.save(`${deal.deal_no}_export_${new Date().toISOString().split('T')[0]}.pdf`);
}

// ============================================
// Word Export (using docx.js)
// ============================================
async function exportToWord(deal, steps, risks, contacts, documents, banks, stepsForDocs, includeProcess, includeRisks, includeContacts, includeDocuments, includeDiscountParticipation) {
    // Note: docx.js requires a different approach - we'll create a simple HTML-based Word export
    // For a more robust solution, you might want to use a different library or server-side generation
    
    const logo = await loadLogoImage(LOGO_BLACK_PATHS);
    const logoHtml = logo
        ? `<div style="text-align:center;margin-bottom:12px;">
            <img src="${logo.dataUrl}" style="max-width:240px;height:auto;" />
           </div>`
        : '';
    
    let htmlContent = `
        <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
        <head>
            <meta charset='utf-8'>
            <title>${deal.deal_no} Export</title>
        </head>
        <body>
            ${logoHtml}
            <h1>Geschäftsinformationen</h1>
            <br>
            <table border='1' cellpadding='5' cellspacing='0'>
                <tr><td><strong>Geschäftsnummer</strong></td><td>${deal.deal_no}</td></tr>
                <tr><td><strong>Status</strong></td><td>${deal.status}</td></tr>
                <tr><td><strong>Land</strong></td><td>${deal.country}</td></tr>
                <tr><td><strong>Route</strong></td><td>${deal.route || ''}</td></tr>
                <tr><td><strong>Ware</strong></td><td>${getDealCommodityDisplay(deal)}</td></tr>
                <tr><td><strong>Angebot</strong></td><td>${deal.offer_terms || ''}</td></tr>
                <tr><td><strong>LBMA disc. %</strong></td><td>${deal.lbma_discount_pct ?? 0}%</td></tr>
                <tr><td><strong>Erstellt</strong></td><td>${new Date(deal.created_at).toLocaleString('de-DE')}</td></tr>
            </table>
    `;

    // Process Steps
    if (includeProcess && steps.length > 0) {
        htmlContent += '<h1>Prozessschritte</h1><table border="1" cellpadding="5" cellspacing="0"><tr><th>Schritt</th><th>Titel</th><th>Beschreibung</th><th>Status</th><th>Rolle</th><th>Fällig</th></tr>';
        steps.forEach(step => {
            htmlContent += `<tr>
                <td>${step.step_no}</td>
                <td>${step.title}</td>
                <td>${step.description || ''}</td>
                <td>${step.status}</td>
                <td>${step.responsible_role}</td>
                <td>${step.due_date ? new Date(step.due_date).toLocaleDateString('de-DE') : ''}</td>
            </tr>`;
        });
        htmlContent += '</table><br>';
    }
    
    // Risks
    if (includeRisks && risks.length > 0) {
        htmlContent += '<h1>Risiko-Register</h1><table border="1" cellpadding="5" cellspacing="0"><tr><th>Kategorie</th><th>Beschreibung</th><th>Schweregrad</th><th>Wahrscheinlichkeit</th><th>Score</th><th>Mitigation</th><th>Owner</th><th>Status</th></tr>';
        risks.forEach(risk => {
            const score = risk.severity * risk.probability;
            htmlContent += `<tr>
                <td>${risk.category}</td>
                <td>${risk.description}</td>
                <td>${risk.severity}/5</td>
                <td>${risk.probability}/5</td>
                <td>${score}/25</td>
                <td>${risk.mitigation || ''}</td>
                <td>${risk.owner || ''}</td>
                <td>${risk.status}</td>
            </tr>`;
        });
        htmlContent += '</table><br>';
    }

    if (includeContacts && contacts.length > 0) {
        const sortedContacts = sortContactsForExport(contacts);
        htmlContent += '<h1>Beteiligte Kontakte</h1><table border="1" cellpadding="5" cellspacing="0"><tr><th>Name</th><th>Rolle</th><th>Firma</th><th>E-Mail</th><th>Telefon</th><th>Mobil</th><th>Notiz</th></tr>';
        sortedContacts.forEach(link => {
            htmlContent += `<tr>
                <td>${link.contact?.full_name || ''}</td>
                <td>${link.role || ''}</td>
                <td>${link.contact?.company || ''}</td>
                <td>${link.contact?.email || ''}</td>
                <td>${link.contact?.phone || ''}</td>
                <td>${link.contact?.mobile || ''}</td>
                <td>${link.notes || ''}</td>
            </tr>`;
        });
        htmlContent += '</table><br>';
    }

    if (includeDiscountParticipation) {
        const participation = normalizeDiscountParticipation(deal.discount_participation);
        const { sum, remaining } = calculateAllocationTotals(participation);
        const usdPerOz = getLbmaUsdPerOz();
        const usdPerKg = getLbmaUsdPerKg();
        const statusLabel = remaining > 0
            ? `Noch ${formatPercent(remaining)}% zu verteilen`
            : remaining < 0
                ? `Überzeichnet um ${formatPercent(Math.abs(remaining))}%`
                : 'Verteilung vollständig';
        htmlContent += `
            <h1>Discount Participation Table</h1>
            <table border='1' cellpadding='5' cellspacing='0'>
                <tr><td><strong>Gross Discount %</strong></td><td>${formatPercent(participation.grossDiscountPercent)}%</td></tr>
                <tr><td><strong>Goldmenge (kg)</strong></td><td>${formatAmount(participation.goldAmountKg || 0)}</td></tr>
                <tr><td><strong>LBMA USD/oz</strong></td><td>${usdPerOz ? `$ ${formatUsd(usdPerOz)}` : '-'}</td></tr>
                <tr><td><strong>LBMA USD/kg</strong></td><td>${usdPerKg ? `$ ${formatUsd(usdPerKg)}` : '-'}</td></tr>
                <tr><td><strong>Summe verteilt %</strong></td><td>${formatPercent(sum)}%</td></tr>
                <tr><td><strong>Rest %</strong></td><td>${formatPercent(remaining)}%</td></tr>
                <tr><td><strong>Status</strong></td><td>${statusLabel}</td></tr>
            </table>
        `;
        DISCOUNT_GROUPS.forEach(group => {
            htmlContent += `<h2>${group.title}</h2><table border="1" cellpadding="5" cellspacing="0"><tr><th>Position</th><th>Aktiv</th><th>Prozent</th><th>USD Anteil</th></tr>`;
            participation.allocations[group.key].forEach(item => {
                const allocationUsd = calculateAllocationUsd(participation, item.percent);
                htmlContent += `<tr>
                    <td>${item.label}</td>
                    <td>${item.enabled ? 'Ja' : 'Nein'}</td>
                    <td>${formatPercent(item.percent)}%</td>
                    <td>${allocationUsd ? `$ ${formatUsd(allocationUsd)}` : '-'}</td>
                </tr>`;
            });
            htmlContent += '</table><br>';
        });
        htmlContent += '<h2>Service Provider Kosten (EUR)</h2><table border="1" cellpadding="5" cellspacing="0"><tr><th>Service Provider</th><th>Betrag</th><th>Kostenträger</th></tr>';
        participation.providers.forEach(item => {
            htmlContent += `<tr>
                <td>${item.name}</td>
                <td>€ ${formatAmount(item.amountEUR)}</td>
                <td>${item.costBearer}</td>
            </tr>`;
        });
        const totals = calculateProviderTotals(participation);
        htmlContent += `<tr><td><strong>Seller Brutto</strong></td><td colspan="2">€ ${formatAmount(totals.seller.gross)}</td></tr>`;
        htmlContent += `<tr><td><strong>Seller Netto</strong></td><td colspan="2">€ ${formatAmount(totals.seller.net)}</td></tr>`;
        htmlContent += `<tr><td><strong>Representative Brutto</strong></td><td colspan="2">€ ${formatAmount(totals.representative.gross)}</td></tr>`;
        htmlContent += `<tr><td><strong>Representative Netto</strong></td><td colspan="2">€ ${formatAmount(totals.representative.net)}</td></tr>`;
        htmlContent += `<tr><td><strong>Buyer Brutto</strong></td><td colspan="2">€ ${formatAmount(totals.buyer.gross)}</td></tr>`;
        htmlContent += `<tr><td><strong>Buyer Netto</strong></td><td colspan="2">€ ${formatAmount(totals.buyer.net)}</td></tr>`;
        htmlContent += `<tr><td><strong>Gesamt Brutto</strong></td><td colspan="2">€ ${formatAmount(totals.gross)}</td></tr>`;
        htmlContent += `<tr><td><strong>Gesamt Netto</strong></td><td colspan="2">€ ${formatAmount(totals.net)}</td></tr></table>`;
        htmlContent += `<p><em>USD-Berechnung basiert auf LBMA USD/oz und der Mengenangabe im Modal</em></p><br>`;
    }
    
    // Documents
    if (includeDocuments && documents.length > 0) {
        const stepMap = buildStepLabelMap(stepsForDocs);
        htmlContent += '<h1>Dokumentindex</h1><table border="1" cellpadding="5" cellspacing="0"><tr><th>Dateiname</th><th>Schritt</th><th>Typ</th><th>Hochgeladen</th></tr>';
        documents.forEach(doc => {
            const stepLabel = doc.step_id ? (stepMap[doc.step_id] || '') : '';
            htmlContent += `<tr>
                <td>${doc.file_name}</td>
                <td>${stepLabel}</td>
                <td>${doc.doc_type}</td>
                <td>${new Date(doc.uploaded_at).toLocaleString('de-DE')}</td>
            </tr>`;
        });
        htmlContent += '</table><br>';
    }
    
    htmlContent += '</body></html>';
    
    // Create blob and download
    const blob = new Blob(['\ufeff' + htmlContent], { type: 'application/msword' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${deal.deal_no}_export_${new Date().toISOString().split('T')[0]}.doc`;
    link.click();
    URL.revokeObjectURL(link.href);
}

async function loadLogoImage(paths) {
    const list = Array.isArray(paths) ? paths : [paths];
    for (const path of list) {
        const encoded = encodeURI(path);
        try {
            const response = await fetch(encoded);
            if (!response.ok) continue;
            const blob = await response.blob();
            const dataUrl = await blobToDataUrl(blob);
            const image = await dataUrlToImage(dataUrl);
            const format = dataUrl.startsWith('data:image/jpeg') ? 'JPEG' : 'PNG';
            return {
                dataUrl,
                width: image.width,
                height: image.height,
                format
            };
        } catch (err) {
            console.error('Error loading logo:', err);
        }
    }
    return null;
}

function blobToDataUrl(blob) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
    });
}

function dataUrlToImage(dataUrl) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = dataUrl;
    });
}

// Make handleExport available globally
window.handleExport = handleExport;
