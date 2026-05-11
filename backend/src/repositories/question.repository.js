// ===== QUESTION REPOSITORY =====
// Chỉ làm việc trực tiếp với DB, không chứa business logic.
const { getPool } = require('../database/pool');

function mapRow(row) {
    if (!row) return null;
    return {
        id: row.id,
        category: row.category,
        question: row.question,
        answers: row.answers,
        correct: row.correct,
        explanation: row.explanation,
        isCritical: row.is_critical,
        image: row.image,
    };
}

async function findAll() {
    const pool = getPool();
    const result = await pool.query('SELECT * FROM questions ORDER BY id');
    return result.rows.map(mapRow);
}

async function findById(id) {
    const pool = getPool();
    const result = await pool.query('SELECT * FROM questions WHERE id = $1', [id]);
    return mapRow(result.rows[0]);
}

async function findByCategory(category) {
    const pool = getPool();
    const result = await pool.query(
        'SELECT * FROM questions WHERE category = $1 ORDER BY id',
        [category]
    );
    return result.rows.map(mapRow);
}

async function create(question) {
    const pool = getPool();
    const {
        id,
        category,
        question: questionText,
        answers,
        correct,
        explanation,
        isCritical,
        image,
    } = question;

    const result = await pool.query(
        `INSERT INTO questions (id, category, question, answers, correct, explanation, is_critical, image)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
         RETURNING *`,
        [
            id,
            category,
            questionText,
            JSON.stringify(answers),
            correct,
            explanation,
            isCritical || false,
            image || null,
        ]
    );
    return mapRow(result.rows[0]);
}

async function deleteAll() {
    const pool = getPool();
    await pool.query('DELETE FROM questions');
}

module.exports = {
    findAll,
    findById,
    findByCategory,
    create,
    deleteAll,
};
