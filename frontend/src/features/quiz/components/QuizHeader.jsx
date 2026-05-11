import { formatMMSS } from '../../../utils/time';

export function QuizHeader({ modeLabel, currentIndex, total, timerSeconds, warning, onExit }) {
    return (
        <div className="quiz-header">
            <button className="btn-back" onClick={onExit}>
                ← Thoát
            </button>
            <div className="quiz-info">
                <span className="quiz-mode">{modeLabel}</span>
                <span className="quiz-progress">
                    {currentIndex + 1}/{total}
                </span>
            </div>
            <div className={`timer ${warning ? 'warning' : ''}`}>{formatMMSS(timerSeconds)}</div>
        </div>
    );
}
