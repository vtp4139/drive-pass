// ===== SCRIPT KHỞI TẠO DATABASE =====
const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Tạo connection pool
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

async function setupDatabase() {
    console.log('🚀 Bắt đầu khởi tạo database...\n');

    try {
        // Test connection
        console.log('📡 Đang kết nối với database...');
        await pool.query('SELECT NOW()');
        console.log('✅ Kết nối thành công!\n');

        // Đọc file SQL
        console.log('📄 Đang đọc file init-database.sql...');
        const sqlFile = fs.readFileSync(
            path.join(__dirname, 'init-database.sql'),
            'utf8'
        );
        console.log('✅ Đọc file thành công!\n');

        // Thực thi SQL
        console.log('🔨 Đang tạo các bảng...');
        await pool.query(sqlFile);
        console.log('✅ Tạo bảng thành công!\n');

        // Kiểm tra các bảng đã tạo
        console.log('🔍 Kiểm tra các bảng đã tạo:');
        const tablesResult = await pool.query(`
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public' 
            AND table_type = 'BASE TABLE'
            ORDER BY table_name;
        `);

        console.log('📋 Danh sách bảng:');
        tablesResult.rows.forEach(row => {
            console.log(`   ✓ ${row.table_name}`);
        });

        // Kiểm tra số lượng câu hỏi
        console.log('\n📊 Kiểm tra dữ liệu:');
        const questionsCount = await pool.query('SELECT COUNT(*) FROM questions');
        console.log(`   ✓ Số câu hỏi: ${questionsCount.rows[0].count}`);

        const userStatsCount = await pool.query('SELECT COUNT(*) FROM user_stats');
        console.log(`   ✓ Số user stats: ${userStatsCount.rows[0].count}`);

        const examHistoryCount = await pool.query('SELECT COUNT(*) FROM exam_history');
        console.log(`   ✓ Số exam history: ${examHistoryCount.rows[0].count}`);

        console.log('\n🎉 Khởi tạo database hoàn tất!');
        console.log('💡 Bạn có thể chạy server bằng lệnh: npm start\n');

    } catch (error) {
        console.error('❌ Lỗi:', error.message);
        console.error('\n📝 Chi tiết lỗi:', error);
        process.exit(1);
    } finally {
        await pool.end();
    }
}

// Chạy script
setupDatabase();
