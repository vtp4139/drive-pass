// ===== LOCAL STATS SERVICE =====
// Giữ logic cũ: lưu stats vào localStorage khi chạy offline / chưa có user.
const STORAGE_KEY = 'drivingLicenseStats';

export const createDefaultStats = () => ({
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
            return raw ? { ...createDefaultStats(), ...JSON.parse(raw) } : createDefaultStats();
        } catch {
            return createDefaultStats();
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
