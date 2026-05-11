// ===== LOCAL STATS SERVICE =====
// Giữ logic cũ: lưu stats vào localStorage khi chạy offline / chưa có user.
const STORAGE_KEY = 'drivingLicenseStats';

const defaultStats = () => ({
    practiceProgress: 0,
    totalStudied: 0,
    correctAnswers: 0,
    examCount: 0,
    examScores: [],
    lastStudyDate: null,
    streakDays: 0,
});

export const LocalStatsService = {
    load() {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            return raw ? { ...defaultStats(), ...JSON.parse(raw) } : defaultStats();
        } catch {
            return defaultStats();
        }
    },

    save(stats) {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
        } catch (e) {
            console.warn('Không thể lưu stats:', e);
        }
    },

    clear() {
        try {
            localStorage.removeItem(STORAGE_KEY);
        } catch {
            /* ignore */
        }
    },
};
