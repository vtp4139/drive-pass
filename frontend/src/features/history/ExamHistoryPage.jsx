import { useEffect, useMemo, useState } from 'react';
import { Button } from '../../components/Button/Button';
import { useToast } from '../../components/Toast/ToastProvider';
import { EXAM_CONFIG } from '../../config/exam.config';
import { ExamHistoryService } from '../../services';
import { useAuth } from '../../store/AuthContext';
import { formatMMSS } from '../../utils/time';

function formatDateTime(value) {
    if (!value) return 'Không rõ thời gian';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return 'Không rõ thời gian';
    return new Intl.DateTimeFormat('vi-VN', {
        dateStyle: 'medium',
        timeStyle: 'short',
    }).format(date);
}

function normalizeHistoryRecord(record, fallbackQuestions = []) {
    const payload = record.answers || {};
    const selectedAnswers = payload.selectedAnswers || payload;
    const questionIds = payload.questionIds || Object.keys(selectedAnswers || {});
    const questions = Array.isArray(payload.questions) && payload.questions.length
        ? payload.questions
        : fallbackQuestions;

    const reviewItems = questionIds
        .map((questionId) => {
            const numericId = Number(questionId);
            const question = questions.find((item) => item.id === numericId);
            if (!question) return null;

            const selectedIndex = selectedAnswers[questionId] ?? selectedAnswers[numericId];
            const isCorrect = selectedIndex === question.correct;

            return {
                ...question,
                selectedIndex,
                isCorrect,
                isUnanswered: selectedIndex === undefined || selectedIndex === null,
            };
        })
        .filter(Boolean);

    const criticalFail = reviewItems.some(
        (item) => item.isCritical && !item.isUnanswered && !item.isCorrect
    );
    const passed = record.correctAnswers >= EXAM_CONFIG.passingScore && !criticalFail;

    return {
        ...record,
        reviewItems,
        criticalFail,
        passed,
        hasReviewData: reviewItems.length > 0,
    };
}

export function ExamHistoryPage({ questions = [], onBack }) {
    const { user } = useAuth();
    const toast = useToast();
    const [history, setHistory] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedId, setSelectedId] = useState(null);

    useEffect(() => {
        let active = true;

        async function loadHistory() {
            if (!user) {
                setHistory([]);
                setIsLoading(false);
                return;
            }

            setIsLoading(true);
            try {
                const data = await ExamHistoryService.getByUserId(user.id);
                if (!active) return;
                const normalized = (data || []).map((item) => normalizeHistoryRecord(item, questions));
                setHistory(normalized);
                setSelectedId((prev) => prev ?? normalized[0]?.id ?? null);
            } catch (error) {
                if (!active) return;
                toast.error(error.message || 'Không tải được lịch sử thi');
            } finally {
                if (active) setIsLoading(false);
            }
        }

        loadHistory();
        return () => {
            active = false;
        };
    }, [user, toast, questions]);

    const selectedExam = useMemo(
        () => history.find((item) => item.id === selectedId) || null,
        [history, selectedId]
    );

    if (!user) {
        return (
            <div className="history-screen fade-in">
                <div className="history-header">
                    <div>
                        <h2>Lịch sử thi</h2>
                        <p>Đăng nhập để xem lại các bài thi đã làm trên tài khoản của bạn.</p>
                    </div>
                    <Button variant="outline" onClick={onBack}>
                        Về trang chủ
                    </Button>
                </div>
                <div className="history-empty">
                    <div className="history-empty-icon">🔐</div>
                    <h3>Chưa đăng nhập</h3>
                    <p>Lịch sử thi chỉ khả dụng khi bạn đăng nhập và làm bài ở chế độ thi thử.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="history-screen fade-in">
            <div className="history-header">
                <div>
                    <h2>Lịch sử thi</h2>
                    <p>Xem lại từng bài thi, từng câu đúng sai và trạng thái đạt hay chưa đạt.</p>
                </div>
                <Button variant="outline" onClick={onBack}>
                    Về trang chủ
                </Button>
            </div>

            {isLoading && <div className="loader">Đang tải lịch sử thi…</div>}

            {!isLoading && history.length === 0 && (
                <div className="history-empty">
                    <div className="history-empty-icon">📝</div>
                    <h3>Chưa có bài thi nào</h3>
                    <p>Hãy làm một bài thi thử sau khi đăng nhập để bắt đầu lưu lịch sử.</p>
                </div>
            )}

            {!isLoading && history.length > 0 && (
                <div className="history-layout">
                    <div className="history-list">
                        {history.map((item, index) => (
                            <button
                                type="button"
                                key={item.id}
                                className={`history-card ${selectedId === item.id ? 'active' : ''}`.trim()}
                                onClick={() => setSelectedId(item.id)}
                            >
                                <div className="history-card-top">
                                    <span className={`history-badge ${item.passed ? 'pass' : 'fail'}`.trim()}>
                                        {item.passed ? 'Đạt' : 'Fail'}
                                    </span>
                                    <span className="history-index">Bài thi #{history.length - index}</span>
                                </div>
                                <div className="history-score-row">
                                    <strong>{item.correctAnswers}/{item.totalQuestions}</strong>
                                    <span>{item.score}%</span>
                                </div>
                                <div className="history-meta">
                                    <span>{formatMMSS(item.timeTaken)}</span>
                                    <span>{formatDateTime(item.createdAt)}</span>
                                </div>
                                {item.criticalFail && (
                                    <div className="history-critical">Sai câu điểm liệt</div>
                                )}
                            </button>
                        ))}
                    </div>

                    <div className="history-detail">
                        {selectedExam ? (
                            <ExamReview exam={selectedExam} />
                        ) : (
                            <div className="history-placeholder">
                                Chọn một bài thi ở bên trái để xem chi tiết.
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

function ExamReview({ exam }) {
    return (
        <div className="review-panel">
            <div className="review-summary">
                <div>
                    <span className={`history-badge ${exam.passed ? 'pass' : 'fail'}`.trim()}>
                        {exam.passed ? 'Đạt' : 'Fail'}
                    </span>
                    <h3>Bài thi ngày {formatDateTime(exam.createdAt)}</h3>
                </div>
                <div className="review-summary-grid">
                    <SummaryItem label="Số câu đúng" value={`${exam.correctAnswers}/${exam.totalQuestions}`} />
                    <SummaryItem label="Điểm số" value={`${exam.score}%`} />
                    <SummaryItem label="Thời gian" value={formatMMSS(exam.timeTaken)} />
                    <SummaryItem
                        label="Điểm liệt"
                        value={exam.criticalFail ? 'Bị sai' : 'An toàn'}
                        danger={exam.criticalFail}
                    />
                </div>
            </div>

            {!exam.hasReviewData && (
                <div className="history-placeholder">
                    Bài thi này được lưu theo định dạng cũ nên chưa đủ dữ liệu để xem lại từng câu hỏi.
                </div>
            )}

            {exam.hasReviewData && (
                <div className="review-questions">
                    {exam.reviewItems.map((item) => (
                        <div key={item.id} className="review-question-card">
                            <div className="review-question-head">
                                <div className="question-number">
                                    Câu {item.id}
                                    {item.isCritical && <span className="critical-pill">Điểm liệt</span>}
                                </div>
                                <span
                                    className={`review-status ${
                                        item.isUnanswered ? 'unanswered' : item.isCorrect ? 'correct' : 'incorrect'
                                    }`.trim()}
                                >
                                    {item.isUnanswered ? 'Bỏ trống' : item.isCorrect ? 'Đúng' : 'Sai'}
                                </span>
                            </div>

                            <div className="question-text">{item.question}</div>

                            {item.image && (
                                <div className="question-image">
                                    <img src={item.image} alt={`Hình minh họa câu ${item.id}`} />
                                </div>
                            )}

                            <div className="answers">
                                {item.answers.map((answer, index) => {
                                    let className = 'answer-option disabled';
                                    if (index === item.correct) className += ' correct';
                                    else if (index === item.selectedIndex) className += ' incorrect';

                                    return (
                                        <div key={index} className={className}>
                                            <div className="answer-letter">{String.fromCharCode(65 + index)}</div>
                                            <div className="answer-text">{answer.replace(/^[A-D]\.\s*/, '')}</div>
                                        </div>
                                    );
                                })}
                            </div>

                            {item.explanation && (
                                <div className="explanation">
                                    <div className="explanation-header">
                                        <span>💡</span>
                                        <span>Giải thích</span>
                                    </div>
                                    <p>{item.explanation}</p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

function SummaryItem({ label, value, danger = false }) {
    return (
        <div className="review-summary-item">
            <span>{label}</span>
            <strong className={danger ? 'danger-text' : ''}>{value}</strong>
        </div>
    );
}
