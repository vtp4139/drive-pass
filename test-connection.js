// ===== TEST KẾT NỐI DATABASE =====
const { Pool } = require('pg');
require('dotenv').config();

console.log('🔍 Thông tin kết nối:');
console.log('DATABASE_URL:', process.env.DATABASE_URL ? '✓ Đã cấu hình' : '✗ Chưa cấu hình');
console.log('');

// Parse connection string để hiển thị thông tin (ẩn password)
if (process.env.DATABASE_URL) {
    try {
        const url = new URL(process.env.DATABASE_URL);
        console.log('Host:', url.hostname);
        console.log('Port:', url.port);
        console.log('Database:', url.pathname.substring(1));
        console.log('User:', url.username);
        console.log('Password:', '***' + url.password.slice(-4));
        console.log('');
    } catch (e) {
        console.log('⚠️ Không thể parse connection string');
    }
}

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    },
    connectionTimeoutMillis: 10000
});

async function testConnection() {
    console.log('📡 Đang thử kết nối...\n');

    try {
        const client = await pool.connect();
        console.log('✅ Kết nối thành công!');
        
        const result = await client.query('SELECT NOW(), version()');
        console.log('⏰ Thời gian server:', result.rows[0].now);
        console.log('📦 PostgreSQL version:', result.rows[0].version.split(',')[0]);
        
        client.release();
        
        console.log('\n🎉 Database đang hoạt động bình thường!');
        
    } catch (error) {
        console.error('❌ Lỗi kết nối:', error.message);
        console.error('\n💡 Các nguyên nhân có thể:');
        console.error('   1. Kiểm tra kết nối internet');
        console.error('   2. Kiểm tra firewall/antivirus');
        console.error('   3. Xác nhận connection string trong file .env');
        console.error('   4. Kiểm tra database có đang chạy trên Supabase');
        console.error('\n📝 Chi tiết lỗi:', error.code);
    } finally {
        await pool.end();
    }
}

testConnection();
