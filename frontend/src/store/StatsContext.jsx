// ===== STATS STORE =====
// Thống kê học tập. Hiện tại dùng LocalStatsService (localStorage).
// Nếu muốn đồng bộ qua backend: swap sang UserStatsService — component không đổi.
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { LocalStatsService } from '../services';

const StatsContext = createContext(null);

export function StatsProvider({ children }) {
    const [stats, setStats] = useState(() => LocalStatsService.load());

    // Mỗi khi stats đổi, persist ngay lập tức
    useEffect(() => {
        LocalStatsService.save(stats);
    }, [stats]);

    const updateStats = useCallback((updater) => {
        setStats((prev) => (typeof updater === 'function' ? updater(prev) : { ...prev, ...updater }));
    }, []);

    const recordAnswer = useCallback((isCorrect) => {
        setStats((prev) => ({
            ...prev,
            totalStudied: (prev.totalStudied || 0) + 1,
            correctAnswers: (prev.correctAnswers || 0) + (isCorrect ? 1 : 0),
            lastStudyDate: new Date().toDateString(),
        }));
    }, []);

    const advancePracticeProgress = useCallback((index) => {
        setStats((prev) => ({
            ...prev,
            practiceProgress: Math.max(prev.practiceProgress || 0, index + 1),
        }));
    }, []);

    const recordExamScore = useCallback((percent) => {
        setStats((prev) => {
            const scores = [...(prev.examScores || []), percent];
            if (scores.length > 20) scores.shift();
            return {
                ...prev,
                examCount: (prev.examCount || 0) + 1,
                examScores: scores,
            };
        });
    }, []);

    const value = useMemo(
        () => ({ stats, updateStats, recordAnswer, advancePracticeProgress, recordExamScore }),
        [stats, updateStats, recordAnswer, advancePracticeProgress, recordExamScore]
    );

    return <StatsContext.Provider value={value}>{children}</StatsContext.Provider>;
}

export function useStats() {
    const ctx = useContext(StatsContext);
    if (!ctx) throw new Error('useStats must be used within StatsProvider');
    return ctx;
}
