// ===== QUESTION SERVICE =====
// Tầng nghiệp vụ của "câu hỏi". Được controllers sử dụng và cũng có thể
// tái sử dụng từ scripts (import/seed). KHÔNG đụng trực tiếp DB — chỉ qua repository.
const questionRepository = require('../repositories/question.repository');
const { NotFoundError, ValidationError } = require('../utils/errors');

async function getAllQuestions() {
    return questionRepository.findAll();
}

async function getQuestionById(id) {
    const numericId = Number(id);
    if (!Number.isInteger(numericId) || numericId <= 0) {
        throw new ValidationError('ID câu hỏi không hợp lệ');
    }
    const question = await questionRepository.findById(numericId);
    if (!question) throw new NotFoundError('Không tìm thấy câu hỏi');
    return question;
}

async function getQuestionsByCategory(category) {
    if (!category || typeof category !== 'string') {
        throw new ValidationError('Danh mục không hợp lệ');
    }
    return questionRepository.findByCategory(category);
}

function validateQuestionPayload(payload) {
    if (!payload || typeof payload !== 'object') {
        throw new ValidationError('Dữ liệu câu hỏi không hợp lệ');
    }
    const { id, category, question, answers, correct } = payload;
    if (!Number.isInteger(id)) throw new ValidationError('Thiếu "id" hoặc không phải số nguyên');
    if (!category) throw new ValidationError('Thiếu "category"');
    if (!question) throw new ValidationError('Thiếu nội dung "question"');
    if (!Array.isArray(answers) || answers.length < 2) {
        throw new ValidationError('"answers" phải là mảng có ít nhất 2 đáp án');
    }
    if (!Number.isInteger(correct) || correct < 0 || correct >= answers.length) {
        throw new ValidationError('"correct" phải trỏ tới một đáp án hợp lệ');
    }
}

async function addQuestion(payload) {
    validateQuestionPayload(payload);
    return questionRepository.create(payload);
}

async function bulkReplace(questions) {
    if (!Array.isArray(questions)) {
        throw new ValidationError('Danh sách câu hỏi phải là mảng');
    }
    await questionRepository.deleteAll();
    const results = { success: 0, errors: [] };
    for (const q of questions) {
        try {
            validateQuestionPayload(q);
            await questionRepository.create(q);
            results.success += 1;
        } catch (error) {
            results.errors.push({ id: q?.id, message: error.message });
        }
    }
    return results;
}

module.exports = {
    getAllQuestions,
    getQuestionById,
    getQuestionsByCategory,
    addQuestion,
    bulkReplace,
};
