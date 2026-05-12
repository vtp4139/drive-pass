import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useStats } from '../../store/StatsContext';
import { useAuth } from '../../store/AuthContext';
import { useTimer } from '../../hooks/useTimer';
import { useToast } from '../../components/Toast/ToastProvider';
import { ExamHistoryService } from '../../services';
import { EXAM_CONFIG } from '../../config/exam.config';
import { QuestionCard } from './components/QuestionCard';
import { QuizHeader } from './components/QuizHeader';
import { QuizNavigation } from './components/QuizNavigation';
import { ResultScreen } from './components/ResultScreen';

function buildExamResult(questions, answers, mode, timer) {
    const correct = questions.filter((q) => answers[q.id] === q.correct).length;
    const answered = Object.keys(answers).length;
    const criticalFail = questions.some(
        (q) => q.isCritical && answers[q.id] !== undefined && answers[q.id] !== q.correct
    );
    const accuracy = Math.round((correct / questions.length) * 100);

    return {
        correct,
        incorrect: answered - correct,
        total: questions.length,
        accuracy,
        timeSeconds: mode === 'exam' ? EXAM_CONFIG.examDuration * 60 - timer.remaining : timer.elapsed,
        criticalFail,
        isExam: mode === 'exam',
    };
}

/**
 * Quiz cho cả mode practice và exam.
 * @param {'practice'|'exam'} mode
 */
export function QuizPage({ mode, questions, startIndex = 0, onExit }) {
    const [currentIndex, setCurrentIndex] = useState(startIndex);
    const [answers, setAnswers] = useState({});
    const [finished, setFinished] = useState(false);

    const { recordAnswer, advancePracticeProgress, recordExamScore } = useStats();
    const { user } = useAuth();
    const toast = useToast();
    const hasFinishedRef = useRef(false);

    const timer = useTimer(
        mode === 'exam'
            ? { mode: 'down', duration: EXAM_CONFIG.examDuration * 60, onExpire: () => handleFinish(true) }
            : { mode: 'up' }
    );

    useEffect(() => {
        timer.start();
        return () => timer.stop();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const currentQuestion = questions[currentIndex];

    const handleSelect = useCallback(
        (answerIndex) => {
            if (!currentQuestion) return;
            if (answers[currentQuestion.id] !== undefined) return;

            const isCorrect = answerIndex === currentQuestion.correct;
            setAnswers((prev) => ({ ...prev, [currentQuestion.id]: answerIndex }));
            recordAnswer(isCorrect);

            if (mode === 'practice') {
                advancePracticeProgress(currentIndex);
            }

            toast[isCorrect ? 'success' : 'error'](
                isCorrect ? '✅ Chính xác!' : '❌ Sai rồi! Xem giải thích bên dưới.'
            );
        },
        [answers, currentQuestion, mode, currentIndex, recordAnswer, advancePracticeProgress, toast]
    );

    const handleFinish = useCallback(
        (timeUp = false) => {
            if (hasFinishedRef.current) return;
            hasFinishedRef.current = true;

            timer.stop();
            if (timeUp) toast.error('⏰ Hết giờ! Bài thi đã kết thúc.');

            if (mode === 'exam') {
                const examResult = buildExamResult(questions, answers, mode, timer);
                recordExamScore(examResult.accuracy);

                if (user) {
                    ExamHistoryService.save(user.id, {
                        examType: 'mock_exam',
                        score: examResult.accuracy,
                        totalQuestions: examResult.total,
                        correctAnswers: examResult.correct,
                        timeTaken: examResult.timeSeconds,
                        answers: {
                            selectedAnswers: answers,
                            questionIds: questions.map((question) => question.id),
                            questions: questions.map((question) => ({
                                id: question.id,
                                question: question.question,
                                answers: question.answers,
                                correct: question.correct,
                                explanation: question.explanation,
                                isCritical: question.isCritical,
                                image: question.image || null,
                            })),
                        },
                    }).catch(() => {
                        toast.error('Không lưu được lịch sử thi lên server.');
                    });
                }
            }

            setFinished(true);
        },
        [timer, toast, mode, questions, answers, recordExamScore, user]
    );

    const handleNext = () => {
        if (currentIndex < questions.length - 1) {
            setCurrentIndex((i) => i + 1);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
            handleFinish(false);
        }
    };

    const handlePrev = () => {
        if (currentIndex > 0) {
            setCurrentIndex((i) => i - 1);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const handleExit = () => {
        // eslint-disable-next-line no-alert
        if (window.confirm('Bạn có chắc muốn thoát? Tiến độ hiện tại sẽ được lưu.')) {
            timer.stop();
            onExit?.();
        }
    };

    useEffect(() => {
        const handler = (e) => {
            if (finished) return;
            if (!currentQuestion) return;

            switch (e.key) {
                case 'ArrowRight':
                case 'Enter':
                    handleNext();
                    break;
                case 'ArrowLeft':
                    handlePrev();
                    break;
                case '1':
                case 'a':
                case 'A':
                    if (answers[currentQuestion.id] === undefined) handleSelect(0);
                    break;
                case '2':
                case 'b':
                case 'B':
                    if (answers[currentQuestion.id] === undefined) handleSelect(1);
                    break;
                case '3':
                case 'c':
                case 'C':
                    if (answers[currentQuestion.id] === undefined) handleSelect(2);
                    break;
                case '4':
                case 'd':
                case 'D':
                    if (
                        answers[currentQuestion.id] === undefined &&
                        currentQuestion.answers.length > 3
                    ) {
                        handleSelect(3);
                    }
                    break;
                case 'Escape':
                    handleExit();
                    break;
                default:
            }
        };
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentQuestion, answers, finished]);

    const result = useMemo(() => {
        if (!finished) return null;
        return buildExamResult(questions, answers, mode, timer);
    }, [finished, questions, answers, mode, timer]);

    if (finished && result) {
        return <ResultScreen result={result} onBack={onExit} />;
    }

    if (!currentQuestion) {
        return <div>Đang tải câu hỏi...</div>;
    }

    const warning = mode === 'exam' && timer.remaining <= 60;

    return (
        <div className="quiz-screen">
            <QuizHeader
                modeLabel={mode === 'practice' ? '📚 Ôn luyện' : '📝 Thi thử'}
                currentIndex={currentIndex}
                total={questions.length}
                timerSeconds={timer.display}
                warning={warning}
                onExit={handleExit}
            />
            <div className="quiz-content">
                <QuestionCard
                    question={currentQuestion}
                    selectedIndex={answers[currentQuestion.id]}
                    onSelect={handleSelect}
                    showExplanation={answers[currentQuestion.id] !== undefined}
                />
                <QuizNavigation
                    canGoBack={currentIndex > 0}
                    isLast={currentIndex === questions.length - 1}
                    onPrev={handlePrev}
                    onNext={handleNext}
                />
            </div>
        </div>
    );
}
