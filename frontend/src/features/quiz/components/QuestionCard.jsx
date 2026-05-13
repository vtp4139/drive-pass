const LETTERS = ['A', 'B', 'C', 'D'];

export function QuestionCard({
    question,
    selectedIndex,
    onSelect,
    showExplanation,
    revealAnswer = false,
}) {
    const isAnswered = selectedIndex !== undefined && selectedIndex !== null;
    const displayNumber = question.displayNumber ?? question.id;

    return (
        <div className="question-card">
            <div className="question-number">
                Câu {displayNumber}
                {question.isCritical && (
                    <span
                        style={{
                            marginLeft: 8,
                            background: '#FEF2F2',
                            color: '#DC2626',
                            padding: '2px 8px',
                            borderRadius: 100,
                            fontSize: 11,
                            fontWeight: 600,
                        }}
                    >
                        ⚠️ Điểm liệt
                    </span>
                )}
            </div>
            <div className="question-text">{question.question}</div>

            {question.image && (
                <div className="question-image">
                    <img
                        src={question.image}
                        alt={`Hình minh họa câu ${displayNumber}`}
                        onError={(e) => (e.currentTarget.parentElement.style.display = 'none')}
                    />
                </div>
            )}

            <div className="answers">
                {question.answers.map((answer, index) => {
                    let className = 'answer-option';
                    if (isAnswered) {
                        className += ' disabled';
                        if (revealAnswer) {
                            if (index === question.correct) className += ' correct';
                            else if (index === selectedIndex) className += ' incorrect';
                        } else if (index === selectedIndex) {
                            className += ' selected';
                        }
                    } else if (index === selectedIndex) {
                        className += ' selected';
                    }

                    return (
                        <div
                            key={index}
                            className={className}
                            onClick={() => !isAnswered && onSelect(index)}
                            role="button"
                            tabIndex={0}
                        >
                            <div className="answer-letter">{LETTERS[index] || index + 1}</div>
                            <div className="answer-text">{answer.replace(/^[A-D]\.\s*/, '')}</div>
                        </div>
                    );
                })}
            </div>

            {showExplanation && question.explanation && (
                <div className="explanation">
                    <div className="explanation-header">
                        <span>💡</span>
                        <span>Giải thích</span>
                    </div>
                    <p>{question.explanation}</p>
                </div>
            )}
        </div>
    );
}
