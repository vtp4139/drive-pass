// ===== CENTRALIZED ENV CONFIG =====
require('dotenv').config();

const env = {
    NODE_ENV: process.env.NODE_ENV || 'development',
    PORT: parseInt(process.env.PORT, 10) || 3000,
    DATABASE_URL: process.env.DATABASE_URL,
    CORS_ORIGIN: process.env.CORS_ORIGIN || '*',
};

function assertRequired() {
    const missing = [];
    if (!env.DATABASE_URL) missing.push('DATABASE_URL');
    if (missing.length) {
        throw new Error(
            `Thiếu biến môi trường bắt buộc: ${missing.join(', ')}. ` +
            `Hãy tạo file .env dựa theo .env.example.`
        );
    }
}

module.exports = { env, assertRequired };
