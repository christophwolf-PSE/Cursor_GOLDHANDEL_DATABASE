// Pure helpers (unused for now)
export function formatPercent(value) {
    const num = Number(value);
    if (!Number.isFinite(num)) return '0%';
    return `${Math.round(num)}%`;
}
