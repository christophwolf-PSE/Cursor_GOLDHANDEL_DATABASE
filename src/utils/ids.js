// Pure helpers (unused for now)
export function formatDocNo(stepNo, subNo) {
    const step = Number(stepNo) || 0;
    const sub = Number(subNo) || 0;
    return `S${step}.${sub}`;
}
