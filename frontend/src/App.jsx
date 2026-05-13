import { useState } from 'react';
import logoUrl from './assets/drive-pass-logo.svg';
import { useQuestions } from './hooks/useQuestions';
import { useStats } from './store/StatsContext';
import { useToast } from './components/Toast/ToastProvider';
import { AuthPanel } from './features/home/components/AuthPanel';
import { ExamHistoryPage } from './features/history/ExamHistoryPage';
import { HomePage } from './features/home/HomePage';
import { QuizPage } from './features/quiz/QuizPage';
import { EXAM_CONFIG } from './config/exam.config';
import { shuffleArray } from './utils/array';

export function App() {
    const { questions, isLoading, error } = useQuestions();
    const { stats, isHydrating } = useStats();
    const toast = useToast();

    const [mode, setMode] = useState(null);
    const [quizQuestions, setQuizQuestions] = useState([]);
    const [startIndex, setStartIndex] = useState(0);

    const totalQuestions = questions.length;

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
        const examQuestions = shuffleArray(questions)
            .slice(0, count)
            .map((question, index) => ({
                ...question,
                displayNumber: index + 1,
            }));
        setQuizQuestions(examQuestions);
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
                    <img src={logoUrl} alt="Drive Pass" className="logo-mark" />
                    <div className="logo-copy">
                        <span className="logo-eyebrow">Drive Pass</span>
                        <h1>Ôn luyện lý thuyết lái xe</h1>
                    </div>
                </div>
                <div className="header-actions">
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
                        onViewHistory={() => setMode('history')}
                        totalQuestions={totalQuestions || EXAM_CONFIG.totalQuestions}
                    />
                )}

                {(mode === 'practice' || mode === 'exam') && (
                    <QuizPage
                        mode={mode}
                        questions={quizQuestions}
                        startIndex={startIndex}
                        onExit={handleExit}
                    />
                )}

                {mode === 'history' && <ExamHistoryPage questions={questions} onBack={handleExit} />}
            </main>

            <footer className="site-footer">
                <div className="site-footer-brand">
                    <img src={logoUrl} alt="Drive Pass" className="site-footer-logo" />
                    <div>
                        <strong>Drive Pass</strong>
                        <p>Nền tảng ôn luyện lý thuyết lái xe với thi thử, thống kê tiến độ và lịch sử thi.</p>
                    </div>
                </div>
                <div className="site-footer-meta">
                    <span>Tác giả: Vo Tuan Phuong</span>
                    <span>© Drive Pass</span>
                </div>
            </footer>
        </div>
    );
}
