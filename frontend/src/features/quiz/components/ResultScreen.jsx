import { Button } from '../../../components/Button/Button';
import { EXAM_CONFIG } from '../../../config/exam.config';
import { formatMMSS } from '../../../utils/time';

export function ResultScreen({ result, onBack }) {
    const { correct, incorrect, total, accuracy, timeSeconds, criticalFail, isExam } = result;

    let icon = '📊';
    let title = 'Hoàn thành ôn luyện!';
    let message = accuracy >= 80 ? 'Bạn đang học rất tốt!' : 'Tiếp tục ôn luyện để cải thiện!';

    if (isExam) {
        const passed = correct >= EXAM_CONFIG.passingScore && !criticalFail;
        if (criticalFail) {
            icon = '❌';
            title = 'Không đạt - Sai câu điểm liệt';
            message = 'Bạn đã sai câu điểm liệt. Cần ôn luyện thêm!';
        } else if (passed) {
            icon = accuracy >= 90 ? '🏆' : '🎉';
            title = 'Đạt yêu cầu!';
            message = accuracy >= 90
                ? 'Xuất sắc! Bạn đã nắm vững lý thuyết.'
                : 'Chúc mừng! Bạn đã vượt qua bài thi thử.';
        } else {
            icon = '😔';
            title = 'Chưa đạt';
            message = `Cần đúng ít nhất ${EXAM_CONFIG.passingScore}/${total} câu. Hãy ôn luyện thêm!`;
        }
    } else {
        icon = accuracy >= 80 ? '🌟' : '📚';
    }

    return (
        <div className="result-screen">
            <div className="result-card">
                <div className="result-icon">{icon}</div>
                <h2>{title}</h2>
                <div className="result-score">
                    <span className="score-number">{correct}</span>
                    <span className="score-total">/{total}</span>
                </div>
                <p className="result-message">{message}</p>

                <div className="result-details">
                    <ResultItem label="Số câu đúng" value={correct} valueClass="correct" />
                    <ResultItem label="Số câu sai" value={incorrect} valueClass="incorrect" />
                    <ResultItem label="Thời gian" value={formatMMSS(timeSeconds)} />
                    <ResultItem label="Độ chính xác" value={`${accuracy}%`} />
                </div>

                <div className="result-actions">
                    <Button variant="primary" onClick={onBack}>
                        Về trang chủ
                    </Button>
                </div>
            </div>
        </div>
    );
}

function ResultItem({ label, value, valueClass = '' }) {
    return (
        <div className="result-item">
            <span className="result-label">{label}</span>
            <span className={`result-value ${valueClass}`.trim()}>{value}</span>
        </div>
    );
}
