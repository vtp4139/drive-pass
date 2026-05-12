import { useMemo, useState } from 'react';
import { useQuestions } from './hooks/useQuestions';
import { useStats } from './store/StatsContext';
import { useAuth } from './store/AuthContext';
import { useToast } from './components/Toast/ToastProvider';
import { AuthPanel } from './features/home/components/AuthPanel';
import { HomePage } from './features/home/HomePage';
import { QuizPage } from './features/quiz/QuizPage';
import { EXAM_CONFIG } from './config/exam.config';
import { shuffleArray } from './utils/array';

export function App() {
    const { questions, isLoading, error } = useQuestions();
    const { stats, isHydrating, isRemoteSync } = useStats();
    const { user } = useAuth();
    const toast = useToast();

    const [mode, setMode] = useState(null);
    const [quizQuestions, setQuizQuestions] = useState([]);
    const [startIndex, setStartIndex] = useState(0);

    const totalLearned = stats.practiceProgress || 0;
    const totalQuestions = questions.length;

    const headerLabel = useMemo(() => {
        return totalQuestions > 0
            ? `${totalLearned}/${totalQuestions}`
            : `${totalLearned}/${EXAM_CONFIG.totalQuestions}`;
    }, [totalLearned, totalQuestions]);

    const handleStartPractice = () => {
        if (!questions.length) {
            toast.error('Chưa có câu hỏi! Vui lòng chạy script import-questions.');
            return;
        }
        let idx = stats.practiceProgress || 0;
        if (idx >= questions.length) idx = 0;
        setQuizQuestions(questions);
        setStartIndex(idx);
        setMode('practice');
    };

    const handleStartExam = () => {
        if (!questions.length) {
            toast.error('Chưa có câu hỏi! Vui lòng chạy script import-questions.');
            return;
        }
        const count = Math.min(EXAM_CONFIG.examQuestions, questions.length);
        setQuizQuestions(shuffleArray(questions).slice(0, count));
        setStartIndex(0);
        setMode('exam');
    };

    const handleExit = () => {
        setMode(null);
        setQuizQuestions([]);
        setStartIndex(0);
    };

    return (
        <div className="container">
            <header className="header">
                <div className="logo">
                    <span style={{ fontSize: 28 }}>🚗</span>
                    <h1>Lý Thuyết Lái Xe</h1>
                </div>
                <div className="header-stats">
                    <div className="stat-item">
                        <span className="stat-label">Lưu tiến độ</span>
                        <span className="stat-value">
                            {isRemoteSync && user ? `@${user.username}` : 'Thiết bị này'}
                        </span>
                    </div>
                    <div className="stat-item">
                        <span className="stat-label">Đã học</span>
                        <span className="stat-value">{headerLabel}</span>
                    </div>
                    <AuthPanel />
                </div>
            </header>

            <main className="main-content">
                {isLoading && <div className="loader">Đang tải câu hỏi…</div>}
                {!isLoading && isHydrating && <div className="loader">Đang tải tiến độ học tập…</div>}
                {error && (
                    <div className="error-banner">
                        ❌ Không tải được câu hỏi: {error.message}. Kiểm tra backend đang chạy.
                    </div>
                )}

                {!isLoading && !isHydrating && !mode && (
                    <HomePage
                        onStartPractice={handleStartPractice}
                        onStartExam={handleStartExam}
                        totalQuestions={totalQuestions || EXAM_CONFIG.totalQuestions}
                    />
                )}

                {mode && (
                    <QuizPage
                        mode={mode}
                        questions={quizQuestions}
                        startIndex={startIndex}
                        onExit={handleExit}
                    />
                )}
            </main>
        </div>
    );
}
