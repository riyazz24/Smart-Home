export const DAYS = [
    { short: 'Sun', full: 'SUNDAY', cron: 'SUN' },
    { short: 'Mon', full: 'MONDAY', cron: 'MON' },
    { short: 'Tue', full: 'TUESDAY', cron: 'TUE' },
    { short: 'Wed', full: 'WEDNESDAY', cron: 'WED' },
    { short: 'Thu', full: 'THURSDAY', cron: 'THU' },
    { short: 'Fri', full: 'FRIDAY', cron: 'FRI' },
    { short: 'Sat', full: 'SATURDAY', cron: 'SAT' },
];

const FULL_TO_CRON = Object.fromEntries(DAYS.map(d => [d.full, d.cron]));
const CRON_TO_FULL = Object.fromEntries(DAYS.map(d => [d.cron, d.full]));

// "08:30" + ['MONDAY', 'WEDNESDAY'] -> "0 30 8 ? * MON,WED"
export const buildCronExpression = (time24h, dayFullList) => {
    if (!time24h || !dayFullList || dayFullList.length === 0) return null;
    const [hourStr, minuteStr] = time24h.split(':');
    const hour = parseInt(hourStr, 10);
    const minute = parseInt(minuteStr, 10);
    if (Number.isNaN(hour) || Number.isNaN(minute)) return null;
    const dayField = dayFullList.map(d => FULL_TO_CRON[d]).filter(Boolean).join(',');
    if (!dayField) return null;
    return `0 ${minute} ${hour} ? * ${dayField}`;
};

// "0 30 8 ? * MON,WED" -> { time: '08:30', days: ['MONDAY', 'WEDNESDAY'] }
export const parseCronExpression = (cronExpression) => {
    if (!cronExpression) return { time: '', days: [] };
    const parts = cronExpression.trim().split(/\s+/);
    if (parts.length < 6) return { time: '', days: [] };
    const [, minute, hour, , , dayField] = parts;
    const hh = String(hour).padStart(2, '0');
    const mm = String(minute).padStart(2, '0');
    const days = (dayField || '').split(',').map(d => CRON_TO_FULL[d]).filter(Boolean);
    return { time: `${hh}:${mm}`, days };
};

// "2025-06-25" -> "25/06/2025"
export const formatDateForDisplay = (isoDate) => {
    if (!isoDate) return '';
    const [year, month, day] = isoDate.split('-');
    if (!year || !month || !day) return isoDate;
    return `${day}/${month}/${year}`;
};

export const buildCronExpressionsForDates = (time24h, dateList) => {
    if (!time24h || !Array.isArray(dateList) || dateList.length === 0) return [];

    const [hourStr, minuteStr] = time24h.split(':');
    const hour = parseInt(hourStr, 10);
    const minute = parseInt(minuteStr, 10);
    if (Number.isNaN(hour) || Number.isNaN(minute)) return [];

    const groupsByYearMonth = new Map(); // "YYYY-M" -> { year, month, days: Set<number> }

    dateList.forEach((isoDate) => {
        if (!isoDate) return;
        const [yearStr, monthStr, dayStr] = isoDate.split('-');
        const year = parseInt(yearStr, 10);
        const month = parseInt(monthStr, 10);
        const day = parseInt(dayStr, 10);
        if (Number.isNaN(year) || Number.isNaN(month) || Number.isNaN(day)) return;

        const key = `${year}-${month}`;
        if (!groupsByYearMonth.has(key)) {
            groupsByYearMonth.set(key, { year, month, days: new Set() });
        }
        groupsByYearMonth.get(key).days.add(day);
    });

    return Array.from(groupsByYearMonth.values())
        .sort((a, b) => (a.year - b.year) || (a.month - b.month))
        .map(({ year, month, days }) => {
            const dayField = Array.from(days).sort((a, b) => a - b).join(',');
            return `0 ${minute} ${hour} ${dayField} ${month} ? ${year}`;
        });
};

export const parseDatesFromCronExpression = (cronExpression) => {
    if (!cronExpression) return [];
    const parts = cronExpression.trim().split(/\s+/);
    if (parts.length < 7) return [];
    const [, , , dayOfMonthField, monthField, , yearField] = parts;
    if (!dayOfMonthField || dayOfMonthField === '?' || dayOfMonthField === '*') return [];

    const month = parseInt(monthField, 10);
    const year = parseInt(yearField, 10);
    if (Number.isNaN(month) || Number.isNaN(year)) return [];

    return dayOfMonthField
        .split(',')
        .map((d) => parseInt(d, 10))
        .filter((d) => !Number.isNaN(d))
        .map((day) => `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`);
};
