// ===== CENTRAL ERROR HANDLER =====
const { AppError } = require('../utils/errors');

function notFoundHandler(req, res, next) {
    res.status(404).json({ success: false, error: `Endpoint không tồn tại: ${req.method} ${req.originalUrl}` });
}

// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
    if (err instanceof AppError) {
        return res.status(err.statusCode).json({ success: false, error: err.message });
    }
    console.error('[Unhandled Error]', err);
    res.status(500).json({ success: false, error: err.message || 'Lỗi máy chủ' });
}

module.exports = { notFoundHandler, errorHandler };
