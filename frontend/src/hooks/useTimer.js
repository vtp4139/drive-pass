// ===== useTimer =====
// Có 2 chế độ: count-up (practice) và countdown (exam).
import { useEffect, useRef, useState } from 'react';

export function useTimer({ mode = 'up', duration = 0, onExpire } = {}) {
    const [elapsed, setElapsed] = useState(0);
    const [remaining, setRemaining] = useState(duration);
    const [isRunning, setIsRunning] = useState(false);
    const onExpireRef = useRef(onExpire);

    useEffect(() => {
        onExpireRef.current = onExpire;
    }, [onExpire]);

    useEffect(() => {
        if (!isRunning) return undefined;

        const startedAt = Date.now();
        const baseRemaining = remaining;

        const id = setInterval(() => {
            if (mode === 'up') {
                setElapsed((v) => v + 1);
            } else {
                const elapsedSec = Math.floor((Date.now() - startedAt) / 1000);
                const next = baseRemaining - elapsedSec;
                if (next <= 0) {
                    setRemaining(0);
                    setIsRunning(false);
                    onExpireRef.current?.();
                } else {
                    setRemaining(next);
                }
            }
        }, 1000);

        return () => clearInterval(id);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isRunning, mode]);

    const start = () => {
        if (mode === 'down') setRemaining(duration);
        else setElapsed(0);
        setIsRunning(true);
    };

    const stop = () => setIsRunning(false);

    return {
        elapsed,
        remaining,
        isRunning,
        start,
        stop,
        display: mode === 'up' ? elapsed : remaining,
    };
}
