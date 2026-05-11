// ===== IMPORT CÂU HỎI TỪ questions.js VÀO DATABASE =====
const { Pool } = require('pg');
require('dotenv').config();

// Import câu hỏi từ file questions.js
const QUESTIONS = require('./questions-data.json');

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

async function importQuestions() {
    console.log('🚀 Bắt đầu import câu hỏi vào database...\n');

    try {
        // Test connection
        console.log('📡 Đang kết nối với database...');
        await pool.query('SELECT NOW()');
        console.log('✅ Kết nối thành công!\n');

        // Xóa dữ liệu cũ (nếu có)
        console.log('🗑️  Xóa dữ liệu cũ...');
        await pool.query('DELETE FROM questions');
        console.log('✅ Đã xóa dữ liệu cũ\n');

        // Import từng câu hỏi
        console.log(`📥 Đang import ${QUESTIONS.length} câu hỏi...`);
        let successCount = 0;
        let errorCount = 0;

        for (const question of QUESTIONS) {
            try {
                await pool.query(
                    `INSERT INTO questions (id, category, question, answers, correct, explanation, is_critical, image) 
                     VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
                    [
                        question.id,
                        question.category,
                        question.question,
                        JSON.stringify(question.answers),
                        question.correct,
                        question.explanation,
                        question.isCritical || false,
                        question.image || null
                    ]
                );
                successCount++;
                if (successCount % 50 === 0) {
                    console.log(`   ✓ Đã import ${successCount} câu...`);
                }
            } catch (error) {
                errorCount++;
                console.error(`   ✗ Lỗi câu ${question.id}:`, error.message);
            }
        }

        console.log(`\n📊 Kết quả:`);
        console.log(`   ✅ Thành công: ${successCount} câu`);
        console.log(`   ❌ Lỗi: ${errorCount} câu`);

        // Kiểm tra số lượng trong database
        const result = await pool.query('SELECT COUNT(*) FROM questions');
        console.log(`   📋 Tổng số câu trong database: ${result.rows[0].count}`);

        console.log('\n🎉 Import hoàn tất!');

    } catch (error) {
        console.error('❌ Lỗi:', error.message);
        process.exit(1);
    } finally {
        await pool.end();
    }
}

// Chạy script
importQuestions();
