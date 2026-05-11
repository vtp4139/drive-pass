// ===== POSTGRES CONNECTION POOL (Singleton) =====
const { Pool } = require('pg');
const { env } = require('../config/env');

let pool;

function getPool() {
    if (!pool) {
        pool = new Pool({
            connectionString: env.DATABASE_URL,
            ssl: { rejectUnauthorized: false }, // Cần cho Supabase
        });

        pool.on('connect', () => {
            console.log('✅ Đã kết nối với PostgreSQL database');
        });

        pool.on('error', (err) => {
            console.error('❌ Lỗi kết nối database:', err);
        });
    }
    return pool;
}

async function closePool() {
    if (pool) {
        await pool.end();
        pool = undefined;
    }
}

module.exports = { getPool, closePool };
