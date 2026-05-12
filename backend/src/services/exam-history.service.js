const examHistoryRepository = require('../repositories/exam-history.repository');
const { ValidationError } = require('../utils/errors');

function validatePayload(userId, payload) {
    if (!userId) {
        throw new ValidationError('userId không hợp lệ');
    }

    if (!payload || typeof payload !== 'object') {
        throw new ValidationError('Dữ liệu lịch sử thi không hợp lệ');
    }

    const score = Number(payload.score);
    const totalQuestions = Number(payload.totalQuestions);
    const correctAnswers = Number(payload.correctAnswers);
    const timeTaken = Number(payload.timeTaken);

    if (!payload.examType || typeof payload.examType !== 'string') {
        throw new ValidationError('Thiếu examType');
    }

    if (!Number.isInteger(score) || score < 0 || score > 100) {
        throw new ValidationError('score phải là số nguyên từ 0 đến 100');
    }

    if (!Number.isInteger(totalQuestions) || totalQuestions <= 0) {
        throw new ValidationError('totalQuestions không hợp lệ');
    }

    if (!Number.isInteger(correctAnswers) || correctAnswers < 0 || correctAnswers > totalQuestions) {
        throw new ValidationError('correctAnswers không hợp lệ');
    }

    if (!Number.isInteger(timeTaken) || timeTaken < 0) {
        throw new ValidationError('timeTaken không hợp lệ');
    }

    if (!payload.answers || typeof payload.answers !== 'object' || Array.isArray(payload.answers)) {
        throw new ValidationError('answers phải là object');
    }

    return {
        userId,
        examType: payload.examType,
        score,
        totalQuestions,
        correctAnswers,
        timeTaken,
        answers: payload.answers,
    };
}

async function saveExamHistory(userId, payload) {
    return examHistoryRepository.create(validatePayload(userId, payload));
}

async function getExamHistory(userId) {
    if (!userId) {
        throw new ValidationError('userId không hợp lệ');
    }
    return examHistoryRepository.findByUserId(userId);
}

module.exports = {
    saveExamHistory,
    getExamHistory,
};
