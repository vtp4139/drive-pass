import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { createDefaultStats, HttpError, LocalStatsService, UserStatsService } from '../services';
import { useAuth } from './AuthContext';

const StatsContext = createContext(null);

export function StatsProvider({ children }) {
    const { user } = useAuth();
    const [stats, setStats] = useState(() => createDefaultStats());
    const [isHydrating, setIsHydrating] = useState(true);
    const hasHydratedRef = useRef(false);

    useEffect(() => {
        let active = true;

        async function hydrateStats() {
            setIsHydrating(true);
            const localStats = LocalStatsService.load();

            if (!user) {
                if (!active) return;
                setStats(localStats);
                setIsHydrating(false);
                hasHydratedRef.current = true;
                return;
            }

            try {
                const remoteStats = await UserStatsService.get(user.id);
                if (!active) return;
                setStats({ ...createDefaultStats(), ...remoteStats });
            } catch (error) {
                if (!active) return;

                if (error instanceof HttpError && error.status === 404) {
                    await UserStatsService.save(user.id, localStats);
                    if (!active) return;
                }

                setStats(localStats);
            } finally {
                if (!active) return;
                setIsHydrating(false);
                hasHydratedRef.current = true;
            }
        }

        hydrateStats();

        return () => {
            active = false;
        };
    }, [user]);

    useEffect(() => {
        if (!hasHydratedRef.current || isHydrating) return;

        LocalStatsService.save(stats);

        if (!user) {
            return;
        }

        const timeoutId = setTimeout(() => {
            UserStatsService.save(user.id, stats).catch(() => {});
        }, 250);

        return () => clearTimeout(timeoutId);
    }, [stats, user, isHydrating]);

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
        () => ({
            stats,
            isHydrating,
            isRemoteSync: Boolean(user),
            updateStats,
            recordAnswer,
            advancePracticeProgress,
            recordExamScore,
        }),
        [stats, isHydrating, user, updateStats, recordAnswer, advancePracticeProgress, recordExamScore]
    );

    return <StatsContext.Provider value={value}>{children}</StatsContext.Provider>;
}

export function useStats() {
    const ctx = useContext(StatsContext);
    if (!ctx) throw new Error('useStats must be used within StatsProvider');
    return ctx;
}
