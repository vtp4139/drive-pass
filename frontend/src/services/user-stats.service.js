// ===== USER STATS SERVICE (frontend facade) =====
// Backend dùng để đồng bộ qua nhiều thiết bị. Offline/local vẫn dùng LocalStatsService.
import { http } from './http-client';

export const UserStatsService = {
    get(userId) {
        return http.get(`/api/stats/${encodeURIComponent(userId)}`);
    },

    save(userId, stats) {
        return http.post(`/api/stats/${encodeURIComponent(userId)}`, stats);
    },
};
