// ===== USER STATS REPOSITORY =====
const { getPool } = require('../database/pool');

function mapRow(row) {
    if (!row) return null;
    return {
        userId: row.user_id,
        practiceProgress: row.practice_progress,
        totalStudied: row.total_studied,
        correctAnswers: row.correct_answers,
        examCount: row.exam_count,
        examScores: row.exam_scores,
        lastStudyDate: row.last_study_date,
        streakDays: row.streak_days,
        updatedAt: row.updated_at,
    };
}

async function findByUserId(userId) {
    const pool = getPool();
    const result = await pool.query('SELECT * FROM user_stats WHERE user_id = $1', [userId]);
    return mapRow(result.rows[0]);
}

async function upsert(userId, stats) {
    const pool = getPool();
    const result = await pool.query(
        `INSERT INTO user_stats (user_id, practice_progress, total_studied, correct_answers, exam_count, exam_scores, last_study_date, streak_days)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
         ON CONFLICT (user_id)
         DO UPDATE SET
             practice_progress = EXCLUDED.practice_progress,
             total_studied = EXCLUDED.total_studied,
             correct_answers = EXCLUDED.correct_answers,
             exam_count = EXCLUDED.exam_count,
             exam_scores = EXCLUDED.exam_scores,
             last_study_date = EXCLUDED.last_study_date,
             streak_days = EXCLUDED.streak_days,
             updated_at = CURRENT_TIMESTAMP
         RETURNING *`,
        [
            userId,
            stats.practiceProgress || 0,
            stats.totalStudied || 0,
            stats.correctAnswers || 0,
            stats.examCount || 0,
            JSON.stringify(stats.examScores || []),
            stats.lastStudyDate || null,
            stats.streakDays || 0,
        ]
    );
    return mapRow(result.rows[0]);
}

module.exports = {
    findByUserId,
    upsert,
};
