const { getPool } = require('../database/pool');

function mapRow(row) {
    if (!row) return null;
    return {
        id: row.id,
        username: row.username,
        passwordHash: row.password_hash,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
    };
}

async function findByUsername(username) {
    const pool = getPool();
    const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
    return mapRow(result.rows[0]);
}

async function create({ username, passwordHash }) {
    const pool = getPool();
    const result = await pool.query(
        `INSERT INTO users (username, password_hash)
         VALUES ($1, $2)
         RETURNING *`,
        [username, passwordHash]
    );
    return mapRow(result.rows[0]);
}

module.exports = {
    findByUsername,
    create,
};
