// ===== QUESTION SERVICE (frontend facade) =====
// Component/hook gọi các method này như gọi hàm local —
// không quan tâm bên dưới là fetch/HTTP.
import { http } from './http-client';

export const QuestionService = {
    getAll() {
        return http.get('/api/questions');
    },

    getById(id) {
        return http.get(`/api/questions/${id}`);
    },

    getByCategory(category) {
        return http.get(`/api/questions/category/${encodeURIComponent(category)}`);
    },

    create(question) {
        return http.post('/api/questions', question);
    },
};
