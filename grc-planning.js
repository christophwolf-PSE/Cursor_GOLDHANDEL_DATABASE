import { sendToN8NWebhook } from './supabase.js';

const GRC_PLAN_KEY = 'grc_planning_deals';
const GRC_CONFIG_KEY = 'grc_planning_config';
const GRC_STATE_KEY = 'grc_planning_state';

let grcConfig = null;
let grcPlans = [];
let grcDraft = null;
let selectedDealId = null;
let calendarMonth = null;

function getDefaultPlantConfig() {
    return {
        machines: 1,
        shiftsPerDay: 1,
        yieldTableKgPerDayPerMachine: [
            { shiftsPerDay: 1, kgPerDayPerMachine: 15 },
            { shiftsPerDay: 2, kgPerDayPerMachine: 30 },
            { shiftsPerDay: 3, kgPerDayPerMachine: 50 }
        ],
        workingDaysPerMonth: 22,
        insuredMonthlyCapKg: 400,
        insuranceCostMatrix: [
            { capKg: 400, monthlyEUR: 1200, source: 'estimated', confidence: 'estimated' },
            { capKg: 800, monthlyEUR: 2100, source: 'estimated', confidence: 'estimated' },
            { capKg: 1000, monthlyEUR: 2600, source: 'estimated', confidence: 'estimated' }
        ],
        extraCosts: {
            laborPerShiftEUR: 0,
            utilitiesPerMachineMonthlyEUR: 0,
            chemicalsPerKgEUR: 0,
            otherMonthlyEUR: 0
        },
        persistenceKey: GRC_CONFIG_KEY,
        lastUpdated: new Date().toISOString()
    };
}

function getDefaultPlan(deal) {
    return {
        dealId: deal?.deal_no || '',
        ware: deal?.commodity_type || 'Doré',
        arrivalDate: new Date().toISOString().slice(0, 10),
        monthlySchedule: [
            { fromMonthIndex: 1, toMonthIndex: 12, kgPerMonth: 0 }
        ],
        termMonths: 12,
        notes: '',
        computed: {
            queueStartDate: '',
            completionDate: '',
            totalKg: 0,
            monthlyAllocation: [],
            warnings: []
        }
    };
}

function loadConfig() {
    try {
        const raw = localStorage.getItem(GRC_CONFIG_KEY);
        if (!raw) return getDefaultPlantConfig();
        const parsed = JSON.parse(raw);
        return { ...getDefaultPlantConfig(), ...parsed };
    } catch (err) {
        console.warn('GRC config parse failed:', err);
        return getDefaultPlantConfig();
    }
}

function saveConfig(config) {
    localStorage.setItem(GRC_CONFIG_KEY, JSON.stringify(config));
}

function loadPlans() {
    try {
        const raw = localStorage.getItem(GRC_PLAN_KEY);
        if (!raw) return [];
        const parsed = JSON.parse(raw);
        return Array.isArray(parsed) ? parsed : [];
    } catch (err) {
        console.warn('GRC plans parse failed:', err);
        return [];
    }
}

function savePlans(plans) {
    localStorage.setItem(GRC_PLAN_KEY, JSON.stringify(plans));
}

function saveState(state) {
    localStorage.setItem(GRC_STATE_KEY, JSON.stringify(state));
}

function loadState() {
    try {
        const raw = localStorage.getItem(GRC_STATE_KEY);
        return raw ? JSON.parse(raw) : {};
    } catch (err) {
        return {};
    }
}

function getAllDeals() {
    if (typeof window.getAllDealsForPlanning === 'function') {
        return window.getAllDealsForPlanning() || [];
    }
    return window.allDeals || [];
}

function formatDate(date) {
    if (!date) return '';
    const d = new Date(date);
    if (Number.isNaN(d.getTime())) return '';
    return d.toLocaleDateString('de-DE');
}

function formatYearMonth(date) {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = `${d.getMonth() + 1}`.padStart(2, '0');
    return `${year}-${month}`;
}

function addMonths(date, months) {
    const d = new Date(date);
    return new Date(d.getFullYear(), d.getMonth() + months, 1);
}

function startOfMonth(date) {
    const d = new Date(date);
    return new Date(d.getFullYear(), d.getMonth(), 1);
}

function endOfMonth(date) {
    const d = new Date(date);
    return new Date(d.getFullYear(), d.getMonth() + 1, 0);
}

function isWeekend(date) {
    const day = date.getDay();
    return day === 0 || day === 6;
}

function nextWorkday(date) {
    const d = new Date(date);
    while (isWeekend(d)) {
        d.setDate(d.getDate() + 1);
    }
    return d;
}

function firstWorkdayOfMonth(date) {
    return nextWorkday(startOfMonth(date));
}

function lastWorkdayOfMonth(date) {
    const d = endOfMonth(date);
    while (isWeekend(d)) {
        d.setDate(d.getDate() - 1);
    }
    return d;
}

function getKgPerDay(config) {
    const entry = config.yieldTableKgPerDayPerMachine.find(item => Number(item.shiftsPerDay) === Number(config.shiftsPerDay));
    return entry ? Number(entry.kgPerDayPerMachine) : 0;
}

function getMonthlyCapacity(config) {
    const capByShifts = getKgPerDay(config) * Number(config.workingDaysPerMonth || 0) * Number(config.machines || 0);
    return Math.min(Number(config.insuredMonthlyCapKg || 0), capByShifts);
}

function parseOfferSchedule(offer) {
    if (!offer) return null;
    const termMatch = offer.match(/term\s+(\d+)/i);
    const termMonths = termMatch ? Number(termMatch[1]) : null;
    const schedule = [];
    const regex = /(\d+)\s*kg\/mo.*?M(\d+)\s*-\s*(\d+)/gi;
    let match = regex.exec(offer);
    while (match) {
        schedule.push({
            fromMonthIndex: Number(match[2]),
            toMonthIndex: Number(match[3]),
            kgPerMonth: Number(match[1])
        });
        match = regex.exec(offer);
    }
    if (!schedule.length) return null;
    return { termMonths: termMonths || schedule[schedule.length - 1].toMonthIndex, schedule };
}

function normalizeSchedule(schedule, termMonths) {
    const cleaned = (schedule || [])
        .map(row => ({
            fromMonthIndex: Number(row.fromMonthIndex) || 1,
            toMonthIndex: Number(row.toMonthIndex) || 1,
            kgPerMonth: Number(row.kgPerMonth) || 0
        }))
        .filter(row => row.fromMonthIndex >= 1 && row.toMonthIndex >= row.fromMonthIndex);
    if (!cleaned.length) {
        return [{ fromMonthIndex: 1, toMonthIndex: termMonths, kgPerMonth: 0 }];
    }
    return cleaned;
}

function buildMonthlyRequests(deal) {
    const term = Number(deal.termMonths) || 0;
    const requests = Array.from({ length: term }, () => 0);
    (deal.monthlySchedule || []).forEach(row => {
        for (let i = row.fromMonthIndex; i <= row.toMonthIndex; i += 1) {
            if (i >= 1 && i <= term) {
                requests[i - 1] += Number(row.kgPerMonth) || 0;
            }
        }
    });
    return requests;
}

function computePlanForDeal(deal, config, monthUsage) {
    const capacityPerMonth = getMonthlyCapacity(config);
    const arrivalDate = new Date(deal.arrivalDate || new Date());
    const requests = buildMonthlyRequests(deal);
    const totalKg = requests.reduce((sum, value) => sum + value, 0);
    let backlog = 0;
    let monthOffset = 0;
    let firstAllocMonth = null;
    let lastAllocMonth = null;
    const allocations = [];
    const warnings = [];
    while (monthOffset < requests.length || backlog > 0) {
        const monthDate = addMonths(arrivalDate, monthOffset);
        const yearMonth = formatYearMonth(monthDate);
        const requestedKg = monthOffset < requests.length ? requests[monthOffset] : 0;
        const required = requestedKg + backlog;
        const used = Number(monthUsage.get(yearMonth) || 0);
        const available = Math.max(0, capacityPerMonth - used);
        const allocated = Math.min(available, required);
        const nextUsed = used + allocated;
        monthUsage.set(yearMonth, nextUsed);
        if (allocated > 0 && !firstAllocMonth) {
            firstAllocMonth = monthDate;
        }
        if (allocated > 0) {
            lastAllocMonth = monthDate;
        }
        backlog = required - allocated;
        let status = 'OK';
        if (allocated === 0 && required > 0) status = 'QUEUED';
        else if (allocated < required) status = 'CAPPED';
        if (nextUsed >= capacityPerMonth && capacityPerMonth > 0) {
            warnings.push(`Versicherungslimit erreicht (Monat ${yearMonth})`);
        }
        allocations.push({
            yearMonth,
            requestedKg,
            allocatedKg: allocated,
            capacityUsedKg: nextUsed,
            capacityMaxKg: capacityPerMonth,
            status
        });
        monthOffset += 1;
        if (monthOffset > 240) break;
    }
    const queueStartDate = firstAllocMonth ? nextWorkday(Math.max(firstWorkdayOfMonth(firstAllocMonth).getTime(), arrivalDate.getTime())) : arrivalDate;
    const completionDate = lastAllocMonth ? lastWorkdayOfMonth(lastAllocMonth) : arrivalDate;
    if (queueStartDate > arrivalDate) {
        warnings.push('Warteschlange aktiv: Prozessstart verschoben');
    }
    if (!getKgPerDay(config) || !config.machines) {
        warnings.push('Konfigurationsannahmen prüfen (Yield/Schichtmodell)');
    }
    return {
        queueStartDate: queueStartDate.toISOString().slice(0, 10),
        completionDate: completionDate.toISOString().slice(0, 10),
        totalKg,
        monthlyAllocation: allocations,
        warnings
    };
}

function computeAllPlans(plans, config) {
    const monthUsage = new Map();
    const sorted = [...plans].sort((a, b) => {
        const dateA = new Date(a.arrivalDate).getTime();
        const dateB = new Date(b.arrivalDate).getTime();
        if (dateA !== dateB) return dateA - dateB;
        return (a.dealId || '').localeCompare(b.dealId || '');
    });
    const computed = sorted.map(deal => {
        const normalized = {
            ...deal,
            monthlySchedule: normalizeSchedule(deal.monthlySchedule || [], Number(deal.termMonths) || 1)
        };
        const computedDeal = computePlanForDeal(normalized, config, monthUsage);
        return { ...normalized, computed: computedDeal };
    });
    return computed;
}

function formatKg(value) {
    return `${Number(value || 0).toFixed(2)} kg`;
}

function formatStatus(status) {
    if (status === 'QUEUED') return 'QUEUED';
    if (status === 'CAPPED') return 'CAPPED';
    return 'OK';
}

function getScheduleRowsFromDraft() {
    const tbody = document.querySelector('#grc-schedule-table tbody');
    if (!tbody) return [];
    return Array.from(tbody.querySelectorAll('tr')).map(row => {
        const from = row.querySelector('[data-field="from"]');
        const to = row.querySelector('[data-field="to"]');
        const kg = row.querySelector('[data-field="kg"]');
        return {
            fromMonthIndex: Number(from?.value) || 1,
            toMonthIndex: Number(to?.value) || 1,
            kgPerMonth: Number(kg?.value) || 0
        };
    });
}

function renderScheduleTable() {
    const tbody = document.querySelector('#grc-schedule-table tbody');
    if (!tbody || !grcDraft) return;
    tbody.innerHTML = grcDraft.monthlySchedule.map((row, index) => `
        <tr>
            <td><input type="number" min="1" data-field="from" value="${row.fromMonthIndex}"></td>
            <td><input type="number" min="1" data-field="to" value="${row.toMonthIndex}"></td>
            <td><input type="number" min="0" step="0.01" data-field="kg" value="${row.kgPerMonth}"></td>
            <td><button type="button" class="btn btn-secondary btn-sm" data-action="remove" data-index="${index}">Entfernen</button></td>
        </tr>
    `).join('');
}

function renderKPIs(plan, config) {
    const container = document.getElementById('grc-kpi-grid');
    if (!container || !plan?.computed) return;
    const capacity = getMonthlyCapacity(config);
    container.innerHTML = `
        <div class="grc-kpi-card">
            <h5>Gesamtmenge</h5>
            <p>${formatKg(plan.computed.totalKg)}</p>
        </div>
        <div class="grc-kpi-card">
            <h5>Prozessstart</h5>
            <p>${formatDate(plan.computed.queueStartDate)}</p>
        </div>
        <div class="grc-kpi-card">
            <h5>Abholdatum</h5>
            <p>${formatDate(plan.computed.completionDate)}</p>
        </div>
        <div class="grc-kpi-card">
            <h5>Kapazität/Monat</h5>
            <p>${formatKg(capacity)}</p>
        </div>
    `;
}

function renderWarnings(plan) {
    const container = document.getElementById('grc-warnings');
    if (!container || !plan?.computed) return;
    const warnings = plan.computed.warnings || [];
    if (!warnings.length) {
        container.innerHTML = '';
        return;
    }
    container.innerHTML = warnings.map(item => `<div class="grc-alert">${item}</div>`).join('');
}

function renderAllocationTable(plan) {
    const tbody = document.querySelector('#grc-allocation-table tbody');
    if (!tbody || !plan?.computed) return;
    tbody.innerHTML = plan.computed.monthlyAllocation.map(row => `
        <tr>
            <td>${row.yearMonth}</td>
            <td>${formatKg(row.requestedKg)}</td>
            <td>${formatKg(row.allocatedKg)}</td>
            <td>${formatKg(row.capacityMaxKg)}</td>
            <td>${formatKg(row.capacityUsedKg)}</td>
            <td>${formatStatus(row.status)}</td>
        </tr>
    `).join('');
}

function updateDraftFromInputs() {
    if (!grcDraft) return;
    grcDraft.arrivalDate = document.getElementById('grc-arrival-date')?.value || grcDraft.arrivalDate;
    grcDraft.ware = document.getElementById('grc-ware')?.value || grcDraft.ware;
    grcDraft.termMonths = Number(document.getElementById('grc-term-months')?.value) || grcDraft.termMonths;
    grcDraft.notes = document.getElementById('grc-notes')?.value || '';
    grcDraft.monthlySchedule = normalizeSchedule(getScheduleRowsFromDraft(), grcDraft.termMonths);
}

function replanAndRender() {
    const computed = computeAllPlans(grcPlans, grcConfig);
    grcPlans = computed;
    savePlans(grcPlans);
    if (grcDraft) {
        const current = grcPlans.find(item => item.dealId === grcDraft.dealId);
        if (current) grcDraft = { ...current };
    }
    renderScheduleTable();
    renderKPIs(grcDraft, grcConfig);
    renderWarnings(grcDraft);
    renderAllocationTable(grcDraft);
}

function applyDraftToPlans() {
    if (!grcDraft) return;
    const existingIndex = grcPlans.findIndex(item => item.dealId === grcDraft.dealId);
    if (existingIndex >= 0) {
        grcPlans[existingIndex] = { ...grcDraft };
    } else {
        grcPlans.push({ ...grcDraft });
    }
}

function selectDeal(dealId) {
    selectedDealId = dealId;
    const existing = grcPlans.find(item => item.dealId === dealId);
    if (existing) {
        grcDraft = { ...existing };
    } else {
        const deal = getAllDeals().find(item => item.deal_no === dealId);
        grcDraft = getDefaultPlan(deal);
        grcDraft.dealId = dealId;
        if (deal?.offer_terms) {
            const parsed = parseOfferSchedule(deal.offer_terms);
            if (parsed) {
                grcDraft.termMonths = parsed.termMonths;
                grcDraft.monthlySchedule = parsed.schedule;
            }
        }
    }
    document.getElementById('grc-deal-select').value = dealId;
    document.getElementById('grc-arrival-date').value = grcDraft.arrivalDate || '';
    document.getElementById('grc-ware').value = grcDraft.ware || 'Doré';
    document.getElementById('grc-term-months').value = grcDraft.termMonths || 12;
    document.getElementById('grc-notes').value = grcDraft.notes || '';
    renderScheduleTable();
    applyDraftToPlans();
    replanAndRender();
    saveState({ selectedDealId });
}

function addScheduleRow() {
    if (!grcDraft) return;
    grcDraft.monthlySchedule.push({ fromMonthIndex: 1, toMonthIndex: 1, kgPerMonth: 0 });
    renderScheduleTable();
}

function removeScheduleRow(index) {
    if (!grcDraft) return;
    grcDraft.monthlySchedule.splice(index, 1);
    if (!grcDraft.monthlySchedule.length) {
        grcDraft.monthlySchedule = [{ fromMonthIndex: 1, toMonthIndex: grcDraft.termMonths, kgPerMonth: 0 }];
    }
    renderScheduleTable();
    updateDraftFromInputs();
    applyDraftToPlans();
    replanAndRender();
}

function refreshDealSelect() {
    const select = document.getElementById('grc-deal-select');
    if (!select) return;
    const deals = getAllDeals();
    const options = deals.map(deal => `<option value="${deal.deal_no}">${deal.deal_no}</option>`).join('');
    select.innerHTML = options;
    if (!selectedDealId && deals.length) {
        selectedDealId = deals[0].deal_no;
    }
    if (selectedDealId) {
        selectDeal(selectedDealId);
    }
}

function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (!modal) return;
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
    const modal = document.getElementById(modalId);
    if (!modal) return;
    modal.classList.remove('active');
}

function renderPreferences() {
    document.getElementById('grc-pref-machines').value = grcConfig.machines;
    document.getElementById('grc-pref-shifts').value = grcConfig.shiftsPerDay;
    document.getElementById('grc-pref-working-days').value = grcConfig.workingDaysPerMonth;
    document.getElementById('grc-pref-insured-cap').value = grcConfig.insuredMonthlyCapKg;
    document.getElementById('grc-pref-labor').value = grcConfig.extraCosts.laborPerShiftEUR || 0;
    document.getElementById('grc-pref-utilities').value = grcConfig.extraCosts.utilitiesPerMachineMonthlyEUR || 0;
    document.getElementById('grc-pref-chemicals').value = grcConfig.extraCosts.chemicalsPerKgEUR || 0;
    document.getElementById('grc-pref-other').value = grcConfig.extraCosts.otherMonthlyEUR || 0;
    const yieldTbody = document.querySelector('#grc-yield-table tbody');
    if (yieldTbody) {
        yieldTbody.innerHTML = grcConfig.yieldTableKgPerDayPerMachine.map(row => `
            <tr>
                <td>${row.shiftsPerDay}</td>
                <td><input type="number" min="0" step="0.01" data-shifts="${row.shiftsPerDay}" value="${row.kgPerDayPerMachine}"></td>
            </tr>
        `).join('');
    }
    const insuranceTbody = document.querySelector('#grc-insurance-table tbody');
    if (insuranceTbody) {
        insuranceTbody.innerHTML = grcConfig.insuranceCostMatrix.map((row, index) => `
            <tr>
                <td><input type="number" min="0" data-field="cap" data-index="${index}" value="${row.capKg}"></td>
                <td><input type="number" min="0" step="0.01" data-field="eur" data-index="${index}" value="${row.monthlyEUR}"></td>
                <td><input type="text" data-field="source" data-index="${index}" value="${row.source}"></td>
                <td>
                    <select data-field="confidence" data-index="${index}">
                        <option value="researched" ${row.confidence === 'researched' ? 'selected' : ''}>researched</option>
                        <option value="estimated" ${row.confidence === 'estimated' ? 'selected' : ''}>estimated</option>
                    </select>
                </td>
            </tr>
        `).join('');
    }
}

function savePreferences() {
    grcConfig.machines = Number(document.getElementById('grc-pref-machines').value) || 1;
    grcConfig.shiftsPerDay = Number(document.getElementById('grc-pref-shifts').value) || 1;
    grcConfig.workingDaysPerMonth = Number(document.getElementById('grc-pref-working-days').value) || 22;
    grcConfig.insuredMonthlyCapKg = Number(document.getElementById('grc-pref-insured-cap').value) || 400;
    grcConfig.extraCosts.laborPerShiftEUR = Number(document.getElementById('grc-pref-labor').value) || 0;
    grcConfig.extraCosts.utilitiesPerMachineMonthlyEUR = Number(document.getElementById('grc-pref-utilities').value) || 0;
    grcConfig.extraCosts.chemicalsPerKgEUR = Number(document.getElementById('grc-pref-chemicals').value) || 0;
    grcConfig.extraCosts.otherMonthlyEUR = Number(document.getElementById('grc-pref-other').value) || 0;
    const yieldInputs = document.querySelectorAll('#grc-yield-table tbody input[data-shifts]');
    grcConfig.yieldTableKgPerDayPerMachine = Array.from(yieldInputs).map(input => ({
        shiftsPerDay: Number(input.dataset.shifts),
        kgPerDayPerMachine: Number(input.value) || 0
    }));
    const insuranceRows = document.querySelectorAll('#grc-insurance-table tbody tr');
    grcConfig.insuranceCostMatrix = Array.from(insuranceRows).map(row => ({
        capKg: Number(row.querySelector('[data-field="cap"]').value) || 0,
        monthlyEUR: Number(row.querySelector('[data-field="eur"]').value) || 0,
        source: row.querySelector('[data-field="source"]').value || 'estimated',
        confidence: row.querySelector('[data-field="confidence"]').value || 'estimated'
    }));
    grcConfig.lastUpdated = new Date().toISOString();
    saveConfig(grcConfig);
    replanAndRender();
    closeModal('grc-preferences-modal');
}

function resetPreferences() {
    grcConfig = getDefaultPlantConfig();
    saveConfig(grcConfig);
    renderPreferences();
    replanAndRender();
}

function setCalendarMonth(date) {
    calendarMonth = startOfMonth(date);
    renderCalendar();
}

function renderCalendar() {
    const grid = document.getElementById('grc-calendar-grid');
    const title = document.getElementById('grc-calendar-title');
    if (!grid || !calendarMonth) return;
    const monthStart = startOfMonth(calendarMonth);
    const monthEnd = endOfMonth(calendarMonth);
    const startWeekday = (monthStart.getDay() + 6) % 7;
    const daysInMonth = monthEnd.getDate();
    const cells = [];
    for (let i = 0; i < startWeekday; i += 1) {
        cells.push({ date: null, deals: [] });
    }
    for (let day = 1; day <= daysInMonth; day += 1) {
        const date = new Date(monthStart.getFullYear(), monthStart.getMonth(), day);
        const deals = grcPlans.filter(plan => {
            const start = new Date(plan.computed.queueStartDate || plan.arrivalDate);
            const end = new Date(plan.computed.completionDate || plan.arrivalDate);
            return date >= start && date <= end;
        }).map(plan => {
            const total = plan.computed.totalKg || 0;
            return `${plan.dealId} | ${plan.ware} | ${total.toFixed(0)} kg`;
        });
        cells.push({ date, deals });
    }
    while (cells.length % 7 !== 0) {
        cells.push({ date: null, deals: [] });
    }
    title.textContent = calendarMonth.toLocaleDateString('de-DE', { month: 'long', year: 'numeric' });
    grid.innerHTML = cells.map(cell => {
        if (!cell.date) {
            return `<div class="grc-calendar-cell"></div>`;
        }
        const dateLabel = cell.date.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit' });
        const lanes = cell.deals.map(item => `<div class="grc-calendar-lane">${item}</div>`).join('');
        return `
            <div class="grc-calendar-cell">
                <div class="grc-calendar-date">${dateLabel}</div>
                ${lanes}
            </div>
        `;
    }).join('');
    document.getElementById('grc-calendar-jump').value = `${calendarMonth.getFullYear()}-${String(calendarMonth.getMonth() + 1).padStart(2, '0')}`;
}

function addChatMessage(text, isUser = false) {
    const container = document.getElementById('grc-chatbot-messages');
    if (!container) return;
    const div = document.createElement('div');
    div.className = `grc-chatbot-message ${isUser ? 'user' : ''}`;
    div.textContent = text;
    container.appendChild(div);
    container.scrollTop = container.scrollHeight;
}

async function sendChatMessage() {
    const input = document.getElementById('grc-chatbot-input');
    if (!input) return;
    const text = input.value.trim();
    if (!text) return;
    input.value = '';
    addChatMessage(text, true);
    const payload = {
        planConfig: grcConfig,
        deal: grcDraft,
        warnings: grcDraft?.computed?.warnings || [],
        mode: 'grc_planning',
        webSearch: true
    };
    try {
        const response = await sendToN8NWebhook(text, 'grc_planning', payload);
        const answer = response?.response || response?.message || 'Antwort nicht verfügbar.';
        addChatMessage(answer, false);
    } catch (err) {
        addChatMessage('Fehler beim Chatbot-Aufruf.', false);
    }
}

function exportFilename(prefix, ext) {
    const stamp = new Date().toISOString().slice(0, 10);
    return `${prefix}_${stamp}.${ext}`;
}

function exportDealReport(format, options) {
    if (!grcDraft) return;
    const plan = grcDraft;
    const dealRow = [
        ['DealId', plan.dealId],
        ['Ware', plan.ware],
        ['ArrivalDate', plan.arrivalDate],
        ['QueueStartDate', plan.computed.queueStartDate],
        ['CompletionDate', plan.computed.completionDate],
        ['TermMonths', plan.termMonths],
        ['TotalKg', plan.computed.totalKg]
    ];
    if (format === 'csv') {
        let csv = 'Deal Report\n';
        dealRow.forEach(row => {
            csv += `${row[0]},${row[1]}\n`;
        });
        if (!options.summary) {
            csv += 'Monthly Allocation\n';
            csv += 'YYYY-MM,Requested,Allocated,Cap,Used,Status\n';
            plan.computed.monthlyAllocation.forEach(row => {
                csv += `${row.yearMonth},${row.requestedKg},${row.allocatedKg},${row.capacityMaxKg},${row.capacityUsedKg},${row.status}\n`;
            });
        }
        downloadBlob(csv, exportFilename(`grc_deal_${plan.dealId}`, 'csv'), 'text/csv;charset=utf-8;');
        return;
    }
    if (format === 'xlsx') {
        const wb = XLSX.utils.book_new();
        const sheet = XLSX.utils.aoa_to_sheet(dealRow);
        XLSX.utils.book_append_sheet(wb, sheet, 'Deal Report');
        if (!options.summary) {
            const alloc = [
                ['YYYY-MM', 'Requested', 'Allocated', 'Cap', 'Used', 'Status'],
                ...plan.computed.monthlyAllocation.map(row => [
                    row.yearMonth, row.requestedKg, row.allocatedKg, row.capacityMaxKg, row.capacityUsedKg, row.status
                ])
            ];
            const allocSheet = XLSX.utils.aoa_to_sheet(alloc);
            XLSX.utils.book_append_sheet(wb, allocSheet, 'Allocation');
        }
        XLSX.writeFile(wb, exportFilename(`grc_deal_${plan.dealId}`, 'xlsx'));
        return;
    }
    if (format === 'pdf') {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        doc.setFontSize(14);
        doc.text('GRC 5000 Deal Report', 14, 14);
        doc.setFontSize(10);
        let y = 24;
        dealRow.forEach(row => {
            doc.text(`${row[0]}: ${row[1]}`, 14, y);
            y += 6;
        });
        if (!options.summary) {
            doc.autoTable({
                startY: y + 4,
                head: [['YYYY-MM', 'Requested', 'Allocated', 'Cap', 'Used', 'Status']],
                body: plan.computed.monthlyAllocation.map(row => [
                    row.yearMonth,
                    row.requestedKg.toFixed(2),
                    row.allocatedKg.toFixed(2),
                    row.capacityMaxKg.toFixed(2),
                    row.capacityUsedKg.toFixed(2),
                    row.status
                ]),
                styles: { fontSize: 8 },
                margin: { left: 14, right: 14 }
            });
        }
        doc.save(exportFilename(`grc_deal_${plan.dealId}`, 'pdf'));
        return;
    }
    if (format === 'docx') {
        const { Document, Packer, Paragraph, Table, TableRow, TableCell, WidthType, TextRun } = window.docx;
        const rows = dealRow.map(row => new TableRow({
            children: [
                new TableCell({ children: [new Paragraph(row[0])] }),
                new TableCell({ children: [new Paragraph(String(row[1]))] })
            ]
        }));
        const children = [
            new Paragraph({ text: 'GRC 5000 Deal Report', heading: 'Heading1' }),
            new Table({ width: { size: 100, type: WidthType.PERCENTAGE }, rows })
        ];
        if (!options.summary) {
            const allocRows = [
                new TableRow({ children: ['YYYY-MM', 'Requested', 'Allocated', 'Cap', 'Used', 'Status'].map(text => new TableCell({ children: [new Paragraph(text)] })) })
            ];
            plan.computed.monthlyAllocation.forEach(row => {
                allocRows.push(new TableRow({
                    children: [
                        row.yearMonth,
                        row.requestedKg.toFixed(2),
                        row.allocatedKg.toFixed(2),
                        row.capacityMaxKg.toFixed(2),
                        row.capacityUsedKg.toFixed(2),
                        row.status
                    ].map(text => new TableCell({ children: [new Paragraph(String(text))] }))
                }));
            });
            children.push(new Paragraph('Monthly Allocation'));
            children.push(new Table({ width: { size: 100, type: WidthType.PERCENTAGE }, rows: allocRows }));
        }
        const doc = new Document({ sections: [{ properties: {}, children }] });
        Packer.toBlob(doc).then(blob => downloadBlob(blob, exportFilename(`grc_deal_${plan.dealId}`, 'docx')));
    }
}

function exportAllDeals(format) {
    const rows = [
        ['DealId', 'Arrival', 'Start', 'Completion', 'TotalKg']
    ];
    grcPlans.forEach(plan => {
        rows.push([
            plan.dealId,
            plan.arrivalDate,
            plan.computed.queueStartDate,
            plan.computed.completionDate,
            plan.computed.totalKg
        ]);
    });
    if (format === 'csv') {
        let csv = 'All Deals\n';
        rows.forEach(row => {
            csv += row.join(',') + '\n';
        });
        downloadBlob(csv, exportFilename('grc_all_deals', 'csv'), 'text/csv;charset=utf-8;');
        return;
    }
    if (format === 'xlsx') {
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(rows), 'All Deals');
        XLSX.writeFile(wb, exportFilename('grc_all_deals', 'xlsx'));
        return;
    }
    if (format === 'pdf') {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        doc.setFontSize(14);
        doc.text('GRC 5000 - Alle Geschäfte', 14, 14);
        doc.autoTable({
            startY: 22,
            head: [rows[0]],
            body: rows.slice(1),
            styles: { fontSize: 8 },
            margin: { left: 14, right: 14 }
        });
        doc.save(exportFilename('grc_all_deals', 'pdf'));
        return;
    }
    if (format === 'docx') {
        const { Document, Packer, Paragraph, Table, TableRow, TableCell, WidthType } = window.docx;
        const tableRows = rows.map(row => new TableRow({
            children: row.map(text => new TableCell({ children: [new Paragraph(String(text))] }))
        }));
        const doc = new Document({
            sections: [{
                properties: {},
                children: [
                    new Paragraph({ text: 'GRC 5000 - Alle Geschäfte', heading: 'Heading1' }),
                    new Table({ width: { size: 100, type: WidthType.PERCENTAGE }, rows: tableRows })
                ]
            }]
        });
        Packer.toBlob(doc).then(blob => downloadBlob(blob, exportFilename('grc_all_deals', 'docx')));
    }
}

function exportPreferences(format) {
    const rows = [
        ['Maschinen', grcConfig.machines],
        ['Schichten/Tag', grcConfig.shiftsPerDay],
        ['Arbeitstage/Monat', grcConfig.workingDaysPerMonth],
        ['Versicherungslimit (kg)', grcConfig.insuredMonthlyCapKg]
    ];
    if (format === 'csv') {
        let csv = 'Preferences\n';
        rows.forEach(row => {
            csv += row.join(',') + '\n';
        });
        downloadBlob(csv, exportFilename('grc_preferences', 'csv'), 'text/csv;charset=utf-8;');
        return;
    }
    if (format === 'xlsx') {
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(rows), 'Preferences');
        XLSX.writeFile(wb, exportFilename('grc_preferences', 'xlsx'));
        return;
    }
    if (format === 'pdf') {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        doc.setFontSize(14);
        doc.text('GRC 5000 Preferences', 14, 14);
        doc.autoTable({
            startY: 22,
            head: [['Parameter', 'Wert']],
            body: rows,
            styles: { fontSize: 8 },
            margin: { left: 14, right: 14 }
        });
        doc.autoTable({
            startY: doc.lastAutoTable.finalY + 6,
            head: [['Cap (kg)', 'EUR/Monat', 'Quelle', 'Confidence']],
            body: grcConfig.insuranceCostMatrix.map(row => [row.capKg, row.monthlyEUR, row.source, row.confidence]),
            styles: { fontSize: 8 },
            margin: { left: 14, right: 14 }
        });
        doc.save(exportFilename('grc_preferences', 'pdf'));
        return;
    }
    if (format === 'docx') {
        const { Document, Packer, Paragraph, Table, TableRow, TableCell, WidthType } = window.docx;
        const tableRows = [
            new TableRow({ children: ['Parameter', 'Wert'].map(text => new TableCell({ children: [new Paragraph(text)] })) }),
            ...rows.map(row => new TableRow({ children: row.map(text => new TableCell({ children: [new Paragraph(String(text))] })) }))
        ];
        const insuranceRows = [
            new TableRow({ children: ['Cap (kg)', 'EUR/Monat', 'Quelle', 'Confidence'].map(text => new TableCell({ children: [new Paragraph(text)] })) }),
            ...grcConfig.insuranceCostMatrix.map(row => new TableRow({
                children: [row.capKg, row.monthlyEUR, row.source, row.confidence].map(text => new TableCell({ children: [new Paragraph(String(text))] }))
            }))
        ];
        const doc = new Document({
            sections: [{
                properties: {},
                children: [
                    new Paragraph({ text: 'GRC 5000 Preferences', heading: 'Heading1' }),
                    new Table({ width: { size: 100, type: WidthType.PERCENTAGE }, rows: tableRows }),
                    new Paragraph('Versicherungskosten'),
                    new Table({ width: { size: 100, type: WidthType.PERCENTAGE }, rows: insuranceRows })
                ]
            }]
        });
        Packer.toBlob(doc).then(blob => downloadBlob(blob, exportFilename('grc_preferences', 'docx')));
    }
}

function exportCalendar(format) {
    const monthLabel = calendarMonth.toLocaleDateString('de-DE', { month: 'long', year: 'numeric' });
    const monthStart = startOfMonth(calendarMonth);
    const monthEnd = endOfMonth(calendarMonth);
    const daysInMonth = monthEnd.getDate();
    const rows = [];
    for (let day = 1; day <= daysInMonth; day += 1) {
        const date = new Date(monthStart.getFullYear(), monthStart.getMonth(), day);
        const deals = grcPlans.filter(plan => {
            const start = new Date(plan.computed.queueStartDate || plan.arrivalDate);
            const end = new Date(plan.computed.completionDate || plan.arrivalDate);
            return date >= start && date <= end;
        }).map(plan => `${plan.dealId} | ${plan.ware} | ${Math.round(plan.computed.totalKg || 0)} kg`);
        rows.push([date.toLocaleDateString('de-DE'), deals.join(' | ')]);
    }
    if (format === 'csv') {
        let csv = `Kalender ${monthLabel}\nDatum,Deals\n`;
        rows.forEach(row => {
            csv += `"${row[0]}","${row[1]}"\n`;
        });
        downloadBlob(csv, exportFilename(`grc_calendar_${formatYearMonth(calendarMonth)}`, 'csv'), 'text/csv;charset=utf-8;');
        return;
    }
    if (format === 'xlsx') {
        const wb = XLSX.utils.book_new();
        const sheet = XLSX.utils.aoa_to_sheet([['Datum', 'Deals'], ...rows]);
        XLSX.utils.book_append_sheet(wb, sheet, `Calendar ${formatYearMonth(calendarMonth)}`);
        XLSX.writeFile(wb, exportFilename(`grc_calendar_${formatYearMonth(calendarMonth)}`, 'xlsx'));
        return;
    }
    if (format === 'pdf') {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF({ orientation: 'landscape' });
        doc.setFontSize(14);
        doc.text(`Monatsübersicht ${monthLabel}`, 14, 14);
        doc.autoTable({
            startY: 22,
            head: [['Datum', 'Deals']],
            body: rows,
            styles: { fontSize: 8 },
            margin: { left: 14, right: 14 }
        });
        doc.save(exportFilename(`grc_calendar_${formatYearMonth(calendarMonth)}`, 'pdf'));
        return;
    }
    if (format === 'docx') {
        const { Document, Packer, Paragraph, Table, TableRow, TableCell, WidthType } = window.docx;
        const tableRows = [
            new TableRow({ children: ['Datum', 'Deals'].map(text => new TableCell({ children: [new Paragraph(text)] })) }),
            ...rows.map(row => new TableRow({ children: row.map(text => new TableCell({ children: [new Paragraph(String(text))] })) }))
        ];
        const doc = new Document({
            sections: [{
                properties: { page: { size: { orientation: 'landscape' } } },
                children: [
                    new Paragraph({ text: `Monatsübersicht ${monthLabel}`, heading: 'Heading1' }),
                    new Table({ width: { size: 100, type: WidthType.PERCENTAGE }, rows: tableRows })
                ]
            }]
        });
        Packer.toBlob(doc).then(blob => downloadBlob(blob, exportFilename(`grc_calendar_${formatYearMonth(calendarMonth)}`, 'docx')));
    }
}

function downloadBlob(content, filename, type) {
    const blob = content instanceof Blob ? content : new Blob([content], { type: type || 'application/octet-stream' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
    URL.revokeObjectURL(link.href);
}

function runExport() {
    const format = document.querySelector('input[name="grc-export-format"]:checked')?.value || 'pdf';
    const scope = document.querySelector('input[name="grc-export-scope"]:checked')?.value || 'deal';
    const options = {
        summary: document.getElementById('grc-export-summary')?.checked,
        warnings: document.getElementById('grc-export-warnings')?.checked,
        header: document.getElementById('grc-export-header')?.checked
    };
    if (scope === 'deal') {
        exportDealReport(format, options);
    } else if (scope === 'all') {
        exportAllDeals(format);
    } else if (scope === 'calendar') {
        exportCalendar(format);
    } else if (scope === 'prefs') {
        exportPreferences(format);
    }
    closeModal('grc-export-modal');
}

export function initGrcPlanning() {
    grcConfig = loadConfig();
    grcPlans = loadPlans();
    const state = loadState();
    selectedDealId = state.selectedDealId || null;
    calendarMonth = state.calendarMonth ? new Date(state.calendarMonth) : startOfMonth(new Date());
    const openButtons = [
        document.getElementById('grc-planning-btn'),
        document.getElementById('edit-deal-grc-btn')
    ].filter(Boolean);
    openButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            openModal('grc-planning-modal');
            refreshDealSelect();
        });
    });
    document.getElementById('grc-deal-select')?.addEventListener('change', (e) => {
        selectDeal(e.target.value);
    });
    document.getElementById('grc-add-schedule-row')?.addEventListener('click', () => {
        addScheduleRow();
    });
    document.querySelector('#grc-schedule-table tbody')?.addEventListener('click', (e) => {
        const button = e.target.closest('[data-action="remove"]');
        if (button) {
            removeScheduleRow(Number(button.dataset.index));
        }
    });
    document.querySelector('#grc-schedule-table tbody')?.addEventListener('change', () => {
        updateDraftFromInputs();
        applyDraftToPlans();
        replanAndRender();
    });
    ['grc-arrival-date', 'grc-ware', 'grc-term-months', 'grc-notes'].forEach(id => {
        document.getElementById(id)?.addEventListener('change', () => {
            updateDraftFromInputs();
            applyDraftToPlans();
            replanAndRender();
        });
    });
    document.getElementById('grc-save-btn')?.addEventListener('click', () => {
        updateDraftFromInputs();
        applyDraftToPlans();
        replanAndRender();
    });
    document.getElementById('grc-new-btn')?.addEventListener('click', () => {
        const deals = getAllDeals();
        if (deals.length) {
            selectDeal(deals[0].deal_no);
        }
    });
    document.getElementById('grc-duplicate-btn')?.addEventListener('click', () => {
        if (!grcDraft) return;
        const copy = { ...grcDraft, dealId: `${grcDraft.dealId}-COPY` };
        grcPlans.push(copy);
        savePlans(grcPlans);
        refreshDealSelect();
        selectDeal(copy.dealId);
    });
    document.getElementById('grc-delete-btn')?.addEventListener('click', () => {
        if (!grcDraft) return;
        grcPlans = grcPlans.filter(plan => plan.dealId !== grcDraft.dealId);
        savePlans(grcPlans);
        refreshDealSelect();
    });
    document.getElementById('grc-preferences-btn')?.addEventListener('click', () => {
        renderPreferences();
        openModal('grc-preferences-modal');
    });
    document.getElementById('grc-pref-save')?.addEventListener('click', savePreferences);
    document.getElementById('grc-pref-reset')?.addEventListener('click', resetPreferences);
    document.getElementById('grc-calendar-btn')?.addEventListener('click', () => {
        setCalendarMonth(calendarMonth || new Date());
        openModal('grc-calendar-modal');
    });
    document.getElementById('grc-calendar-prev')?.addEventListener('click', () => {
        setCalendarMonth(addMonths(calendarMonth, -1));
        saveState({ selectedDealId, calendarMonth: calendarMonth.toISOString() });
    });
    document.getElementById('grc-calendar-next')?.addEventListener('click', () => {
        setCalendarMonth(addMonths(calendarMonth, 1));
        saveState({ selectedDealId, calendarMonth: calendarMonth.toISOString() });
    });
    document.getElementById('grc-calendar-jump-btn')?.addEventListener('click', () => {
        const value = document.getElementById('grc-calendar-jump').value;
        if (value) {
            const date = new Date(`${value}-01`);
            setCalendarMonth(date);
            saveState({ selectedDealId, calendarMonth: calendarMonth.toISOString() });
        }
    });
    document.getElementById('grc-calendar-export')?.addEventListener('click', () => {
        openModal('grc-export-modal');
        document.querySelector('input[name="grc-export-scope"][value="calendar"]').checked = true;
    });
    document.getElementById('grc-export-btn')?.addEventListener('click', () => {
        openModal('grc-export-modal');
    });
    document.getElementById('grc-export-run')?.addEventListener('click', runExport);
    document.getElementById('grc-reset-btn')?.addEventListener('click', resetPreferences);
    document.getElementById('grc-chatbot-btn')?.addEventListener('click', () => {
        document.getElementById('grc-chatbot-panel').classList.toggle('active');
    });
    document.getElementById('grc-chatbot-close')?.addEventListener('click', () => {
        document.getElementById('grc-chatbot-panel').classList.remove('active');
    });
    document.getElementById('grc-chatbot-send')?.addEventListener('click', sendChatMessage);
    refreshDealSelect();
    replanAndRender();
}

export function refreshGrcPlanningDealOptions() {
    refreshDealSelect();
}

export function openGrcPlanningModal(dealId) {
    openModal('grc-planning-modal');
    refreshDealSelect();
    if (dealId) {
        selectDeal(dealId);
    }
}
