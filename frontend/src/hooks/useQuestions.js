// ===== useQuestions =====
// Hook tải danh sách câu hỏi qua QuestionService. Component không cần biết API bên dưới.
import { useEffect, useState } from 'react';
import { QuestionService } from '../services';

export function useQuestions() {
    const [questions, setQuestions] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        let mounted = true;
        setIsLoading(true);

        QuestionService.getAll()
            .then((data) => {
                if (mounted) setQuestions(data || []);
            })
            .catch((err) => {
                if (mounted) setError(err);
            })
            .finally(() => {
                if (mounted) setIsLoading(false);
            });

        return () => {
            mounted = false;
        };
    }, []);

    return { questions, isLoading, error };
}
