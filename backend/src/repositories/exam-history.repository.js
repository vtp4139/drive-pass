const { getPool } = require('../database/pool');

function mapRow(row) {
    if (!row) return null;
    return {
        id: row.id,
        userId: row.user_id,
        examType: row.exam_type,
        score: row.score,
        totalQuestions: row.total_questions,
        correctAnswers: row.correct_answers,
        timeTaken: row.time_taken,
        answers: row.answers,
        createdAt: row.created_at,
    };
}

async function create(payload) {
    const pool = getPool();
    const result = await pool.query(
        `INSERT INTO exam_history (user_id, exam_type, score, total_questions, correct_answers, time_taken, answers)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         RETURNING *`,
        [
            payload.userId,
            payload.examType,
            payload.score,
            payload.totalQuestions,
            payload.correctAnswers,
            payload.timeTaken,
            JSON.stringify(payload.answers),
        ]
    );
    return mapRow(result.rows[0]);
}

async function findByUserId(userId) {
    const pool = getPool();
    const result = await pool.query(
        'SELECT * FROM exam_history WHERE user_id = $1 ORDER BY created_at DESC',
        [userId]
    );
    return result.rows.map(mapRow);
}

module.exports = {
    create,
    findByUserId,
};
