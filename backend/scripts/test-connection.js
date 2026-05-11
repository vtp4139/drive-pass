// ===== TEST DATABASE CONNECTION =====
const { assertRequired, env } = require('../src/config/env');
const { getPool, closePool } = require('../src/database/pool');

async function main() {
    console.log('🔍 Thông tin kết nối:');
    console.log('DATABASE_URL:', env.DATABASE_URL ? '✓ Đã cấu hình' : '✗ Chưa cấu hình');
    console.log('');

    try {
        assertRequired();
    } catch (error) {
        console.error('❌', error.message);
        process.exit(1);
    }

    try {
        const url = new URL(env.DATABASE_URL);
        console.log('Host:', url.hostname);
        console.log('Port:', url.port);
        console.log('Database:', url.pathname.substring(1));
        console.log('User:', url.username);
        console.log('Password:', '***' + url.password.slice(-4));
        console.log('');
    } catch {
        console.log('⚠️ Không parse được connection string');
    }

    const pool = getPool();
    try {
        const client = await pool.connect();
        console.log('✅ Kết nối thành công!');
        const result = await client.query('SELECT NOW(), version()');
        console.log('⏰ Thời gian server:', result.rows[0].now);
        console.log('📦 PostgreSQL:', result.rows[0].version.split(',')[0]);
        client.release();
    } catch (error) {
        console.error('❌ Lỗi kết nối:', error.message);
        process.exitCode = 1;
    } finally {
        await closePool();
    }
}

main();
