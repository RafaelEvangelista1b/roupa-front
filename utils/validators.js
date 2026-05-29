function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email || '').trim());
}

function requiredFields(body, fields) {
    return fields.filter((field) => {
        const value = body[field];
        return value === undefined || value === null || String(value).trim() === '';
    });
}

function parsePositiveInt(value, fallback) {
    const parsed = Number.parseInt(value, 10);
    return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

module.exports = {
    isValidEmail,
    requiredFields,
    parsePositiveInt
};
