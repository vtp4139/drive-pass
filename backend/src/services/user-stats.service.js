// ===== USER STATS SERVICE =====
const userStatsRepository = require('../repositories/user-stats.repository');
const { NotFoundError, ValidationError } = require('../utils/errors');

async function getUserStats(userId) {
    if (!userId) throw new ValidationError('userId không hợp lệ');
    const stats = await userStatsRepository.findByUserId(userId);
    if (!stats) throw new NotFoundError('Không tìm thấy thống kê');
    return stats;
}

async function saveUserStats(userId, payload) {
    if (!userId) throw new ValidationError('userId không hợp lệ');
    if (!payload || typeof payload !== 'object') {
        throw new ValidationError('Dữ liệu stats không hợp lệ');
    }
    return userStatsRepository.upsert(userId, payload);
}

module.exports = {
    getUserStats,
    saveUserStats,
};
