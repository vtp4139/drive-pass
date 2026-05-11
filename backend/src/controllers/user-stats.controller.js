// ===== USER STATS CONTROLLER =====
const userStatsService = require('../services/user-stats.service');
const asyncHandler = require('../utils/async-handler');

const getByUserId = asyncHandler(async (req, res) => {
    const data = await userStatsService.getUserStats(req.params.userId);
    res.json({ success: true, data });
});

const save = asyncHandler(async (req, res) => {
    const data = await userStatsService.saveUserStats(req.params.userId, req.body);
    res.json({ success: true, data });
});

module.exports = { getByUserId, save };
