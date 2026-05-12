import { http } from './http-client';

export const ExamHistoryService = {
    getByUserId(userId) {
        return http.get(`/api/exams/${encodeURIComponent(userId)}`);
    },

    save(userId, payload) {
        return http.post(`/api/exams/${encodeURIComponent(userId)}`, payload);
    },
};
