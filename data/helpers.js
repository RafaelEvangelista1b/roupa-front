function success(res, message, data = null, statusCode = 200) {
    return res.status(statusCode).json({
        success: true,
        message,
        data,
        error: null
    });
}

function error(res, message, statusCode = 500, details = null) {
    return res.status(statusCode).json({
        success: false,
        message,
        data: null,
        error: details || message
    });
}

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email || '').trim());
}

function requiredFields(body, fields) {
    return fields.filter((field) => {
        const value = body[field];
        return value === undefined || value === null || String(value).trim() === '';
    });
}

module.exports = {
    success,
    error,
    isValidEmail,
    requiredFields
};
