import { Button } from '../../../components/Button/Button';

export function QuizNavigation({ canGoBack, isLast, onPrev, onNext }) {
    return (
        <div className="quiz-navigation">
            <Button variant="outline" onClick={onPrev} disabled={!canGoBack}>
                ← Câu trước
            </Button>
            <Button variant="primary" onClick={onNext}>
                {isLast ? 'Nộp bài' : 'Câu tiếp →'}
            </Button>
        </div>
    );
}
