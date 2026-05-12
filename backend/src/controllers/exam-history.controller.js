const examHistoryService = require('../services/exam-history.service');
const asyncHandler = require('../utils/async-handler');

const getByUserId = asyncHandler(async (req, res) => {
    const data = await examHistoryService.getExamHistory(req.params.userId);
    res.json({ success: true, data });
});

const save = asyncHandler(async (req, res) => {
    const data = await examHistoryService.saveExamHistory(req.params.userId, req.body);
    res.status(201).json({ success: true, data });
});

module.exports = { getByUserId, save };
