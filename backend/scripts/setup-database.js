// ===== SETUP DATABASE =====
// Tạo bảng theo schema.sql. Không import data (xem import-questions.js).
const fs = require('fs');
const path = require('path');
const { getPool, closePool } = require('../src/database/pool');
const { assertRequired } = require('../src/config/env');

async function main() {
    assertRequired();
    console.log('🚀 Bắt đầu khởi tạo database...\n');

    const pool = getPool();

    try {
        console.log('📡 Đang kết nối với database...');
        await pool.query('SELECT NOW()');
        console.log('✅ Kết nối thành công!\n');

        console.log('📄 Đang đọc schema.sql...');
        const sqlPath = path.join(__dirname, '..', 'src', 'database', 'schema.sql');
        const sql = fs.readFileSync(sqlPath, 'utf8');

        console.log('🔨 Đang tạo các bảng...');
        await pool.query(sql);
        console.log('✅ Tạo bảng thành công!\n');

        const tablesResult = await pool.query(`
            SELECT table_name FROM information_schema.tables
            WHERE table_schema = 'public' AND table_type = 'BASE TABLE'
            ORDER BY table_name;
        `);
        console.log('📋 Danh sách bảng:');
        tablesResult.rows.forEach((row) => console.log(`   ✓ ${row.table_name}`));

        console.log('\n🎉 Khởi tạo database hoàn tất!');
        console.log('💡 Import câu hỏi mẫu: npm run db:import\n');
    } catch (error) {
        console.error('❌ Lỗi:', error.message);
        process.exitCode = 1;
    } finally {
        await closePool();
    }
}

main();
