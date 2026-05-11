// ===== QUESTION CONTROLLER =====
// Chỉ làm 3 việc: (1) đọc input từ req, (2) gọi service, (3) format response.
const questionService = require('../services/question.service');
const asyncHandler = require('../utils/async-handler');

const getAll = asyncHandler(async (req, res) => {
    const data = await questionService.getAllQuestions();
    res.json({ success: true, data });
});

const getById = asyncHandler(async (req, res) => {
    const data = await questionService.getQuestionById(req.params.id);
    res.json({ success: true, data });
});

const getByCategory = asyncHandler(async (req, res) => {
    const data = await questionService.getQuestionsByCategory(req.params.category);
    res.json({ success: true, data });
});

const create = asyncHandler(async (req, res) => {
    const data = await questionService.addQuestion(req.body);
    res.status(201).json({ success: true, data });
});

module.exports = { getAll, getById, getByCategory, create };
