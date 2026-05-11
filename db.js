// ===== DATABASE CONNECTION =====
const { Pool } = require('pg');
require('dotenv').config();

// Tạo connection pool
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false // Cần thiết cho Supabase
    }
});

// Test connection
pool.on('connect', () => {
    console.log('✅ Đã kết nối với PostgreSQL database');
});

pool.on('error', (err) => {
    console.error('❌ Lỗi kết nối database:', err);
});

// ===== DATABASE QUERIES =====

// Lấy tất cả câu hỏi
async function getAllQuestions() {
    try {
        const result = await pool.query('SELECT * FROM questions ORDER BY id');
        return result.rows;
    } catch (error) {
        console.error('Lỗi khi lấy câu hỏi:', error);
        throw error;
    }
}

// Lấy câu hỏi theo ID
async function getQuestionById(id) {
    try {
        const result = await pool.query('SELECT * FROM questions WHERE id = $1', [id]);
        return result.rows[0];
    } catch (error) {
        console.error('Lỗi khi lấy câu hỏi:', error);
        throw error;
    }
}

// Lấy câu hỏi theo danh mục
async function getQuestionsByCategory(category) {
    try {
        const result = await pool.query(
            'SELECT * FROM questions WHERE category = $1 ORDER BY id',
            [category]
        );
        return result.rows;
    } catch (error) {
        console.error('Lỗi khi lấy câu hỏi theo danh mục:', error);
        throw error;
    }
}

// Thêm câu hỏi mới
async function addQuestion(question) {
    try {
        const { id, category, question: questionText, answers, correct, explanation, isCritical, image } = question;
        const result = await pool.query(
            `INSERT INTO questions (id, category, question, answers, correct, explanation, is_critical, image) 
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8) 
             RETURNING *`,
            [id, category, questionText, JSON.stringify(answers), correct, explanation, isCritical, image]
        );
        return result.rows[0];
    } catch (error) {
        console.error('Lỗi khi thêm câu hỏi:', error);
        throw error;
    }
}

// Lưu thống kê người dùng
async function saveUserStats(userId, stats) {
    try {
        const result = await pool.query(
            `INSERT INTO user_stats (user_id, practice_progress, total_studied, correct_answers, exam_count, exam_scores, last_study_date, streak_days)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
             ON CONFLICT (user_id) 
             DO UPDATE SET 
                practice_progress = $2,
                total_studied = $3,
                correct_answers = $4,
                exam_count = $5,
                exam_scores = $6,
                last_study_date = $7,
                streak_days = $8,
                updated_at = CURRENT_TIMESTAMP
             RETURNING *`,
            [
                userId,
                stats.practiceProgress,
                stats.totalStudied,
                stats.correctAnswers,
                stats.examCount,
                JSON.stringify(stats.examScores),
                stats.lastStudyDate,
                stats.streakDays
            ]
        );
        return result.rows[0];
    } catch (error) {
        console.error('Lỗi khi lưu thống kê:', error);
        throw error;
    }
}

// Lấy thống kê người dùng
async function getUserStats(userId) {
    try {
        const result = await pool.query('SELECT * FROM user_stats WHERE user_id = $1', [userId]);
        return result.rows[0];
    } catch (error) {
        console.error('Lỗi khi lấy thống kê:', error);
        throw error;
    }
}

module.exports = {
    pool,
    getAllQuestions,
    getQuestionById,
    getQuestionsByCategory,
    addQuestion,
    saveUserStats,
    getUserStats
};
