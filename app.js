// ===== DRIVING LICENSE THEORY APP =====
// Main application logic

// ===== STATE MANAGEMENT =====
const AppState = {
    mode: null,           // 'practice' | 'exam'
    currentIndex: 0,
    questions: [],
    answers: {},          // { questionId: selectedIndex }
    startTime: null,
    timerInterval: null,
    isAnswered: false,
    stats: loadStats()
};

// ===== STORAGE =====
function loadStats() {
    try {
        const saved = localStorage.getItem('drivingLicenseStats');
        return saved ? JSON.parse(saved) : {
            practiceProgress: 0,
            totalStudied: 0,
            correctAnswers: 0,
            examCount: 0,
            examScores: [],
            lastStudyDate: null,
            streakDays: 0
        };
    } catch {
        return {
            practiceProgress: 0,
            totalStudied: 0,
            correctAnswers: 0,
            examCount: 0,
            examScores: [],
            lastStudyDate: null,
            streakDays: 0
        };
    }
}

function saveStats() {
    try {
        localStorage.setItem('drivingLicenseStats', JSON.stringify(AppState.stats));
    } catch (e) {
        console.warn('Could not save stats:', e);
    }
}

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', () => {
    updateStreak();
    renderHomeStats();
    updateLearnedCount();
});

function updateStreak() {
    const today = new Date().toDateString();
    const lastDate = AppState.stats.lastStudyDate;

    if (lastDate) {
        const last = new Date(lastDate);
        const diff = Math.floor((new Date() - last) / (1000 * 60 * 60 * 24));
        if (diff === 1) {
            // Consecutive day
        } else if (diff > 1) {
            AppState.stats.streakDays = 0;
        }
    }
}

function renderHomeStats() {
    const stats = AppState.stats;
    const totalStudied = stats.totalStudied || 0;
    const correctAnswers = stats.correctAnswers || 0;
    const accuracy = totalStudied > 0 ? Math.round((correctAnswers / totalStudied) * 100) : 0;
    const examCount = stats.examCount || 0;
    const avgScore = examCount > 0
        ? Math.round(stats.examScores.reduce((a, b) => a + b, 0) / examCount)
        : 0;

    // Update stats display
    setTextContent('total-studied', totalStudied);
    setTextContent('correct-answers', correctAnswers);
    setTextContent('accuracy-rate', accuracy + '%');
    setTextContent('streak-days', stats.streakDays || 0);
    setTextContent('exam-count', examCount);
    setTextContent('avg-score', avgScore + '%');

    // Update practice progress
    const progress = stats.practiceProgress || 0;
    const progressPct = Math.round((progress / QUESTIONS.length) * 100);
    const progressBar = document.getElementById('practice-progress');
    if (progressBar) progressBar.style.width = progressPct + '%';
    setTextContent('practice-progress-text', `${progress}/${QUESTIONS.length} câu`);
}

function updateLearnedCount() {
    const progress = AppState.stats.practiceProgress || 0;
    setTextContent('learned-count', `${progress}/${QUESTIONS.length}`);
}

function setTextContent(id, value) {
    const el = document.getElementById(id);
    if (el) el.textContent = value;
}

// ===== SCREEN NAVIGATION =====
function showScreen(screenId) {
    ['home-screen', 'quiz-screen', 'result-screen'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.classList.add('hidden');
    });
    const target = document.getElementById(screenId);
    if (target) {
        target.classList.remove('hidden');
        target.classList.add('fade-in');
        setTimeout(() => target.classList.remove('fade-in'), 300);
    }
}

// ===== PRACTICE MODE =====
function startPracticeMode() {
    if (QUESTIONS.length === 0) {
        showToast('Chưa có câu hỏi! Vui lòng thêm câu hỏi vào file questions.js', 'error');
        return;
    }

    AppState.mode = 'practice';
    AppState.questions = [...QUESTIONS];
    AppState.currentIndex = AppState.stats.practiceProgress || 0;

    // If completed all, restart from beginning
    if (AppState.currentIndex >= AppState.questions.length) {
        AppState.currentIndex = 0;
    }

    AppState.answers = {};
    AppState.startTime = Date.now();

    setTextContent('quiz-mode-label', '📚 Ôn luyện');
    startTimer();
    showScreen('quiz-screen');
    renderQuestion();
}

// ===== EXAM MODE =====
function startExamMode() {
    if (QUESTIONS.length === 0) {
        showToast('Chưa có câu hỏi! Vui lòng thêm câu hỏi vào file questions.js', 'error');
        return;
    }

    AppState.mode = 'exam';

    // Shuffle and pick exam questions
    const shuffled = shuffleArray([...QUESTIONS]);
    const examCount = Math.min(EXAM_CONFIG.examQuestions, shuffled.length);
    AppState.questions = shuffled.slice(0, examCount);
    AppState.currentIndex = 0;
    AppState.answers = {};
    AppState.startTime = Date.now();

    setTextContent('quiz-mode-label', '📝 Thi thử');
    startTimer(EXAM_CONFIG.examDuration * 60);
    showScreen('quiz-screen');
    renderQuestion();
}

// ===== QUESTION RENDERING =====
function renderQuestion() {
    const question = AppState.questions[AppState.currentIndex];
    if (!question) return;

    const total = AppState.questions.length;
    const current = AppState.currentIndex + 1;

    // Update header
    setTextContent('question-number', question.id);
    setTextContent('quiz-progress', `${current}/${total}`);

    // Update question text
    const questionEl = document.getElementById('question-text');
    if (questionEl) {
        questionEl.textContent = question.question;
        questionEl.classList.add('slide-in');
        setTimeout(() => questionEl.classList.remove('slide-in'), 300);
    }

    // Handle image
    const imageContainer = document.getElementById('question-image-container');
    if (imageContainer) {
        if (question.image) {
            imageContainer.innerHTML = `<img src="${question.image}" alt="Hình minh họa câu ${question.id}" onerror="this.parentElement.style.display='none'">`;
            imageContainer.style.display = 'block';
        } else {
            imageContainer.innerHTML = '';
            imageContainer.style.display = 'none';
        }
    }

    // Render answers
    renderAnswers(question);

    // Show/hide explanation
    const explanationEl = document.getElementById('explanation');
    if (explanationEl) {
        const isAnswered = AppState.answers[question.id] !== undefined;
        if (isAnswered && question.explanation) {
            explanationEl.classList.remove('hidden');
            setTextContent('explanation-text', question.explanation);
        } else {
            explanationEl.classList.add('hidden');
        }
    }

    // Update navigation buttons
    updateNavButtons();

    // Add critical badge if needed
    addCategoryBadge(question);
}

function addCategoryBadge(question) {
    const questionNumber = document.querySelector('.question-number');
    if (!questionNumber) return;

    let badge = '';
    if (question.isCritical) {
        badge = `<span style="margin-left:8px; background:#FEF2F2; color:#DC2626; padding:2px 8px; border-radius:100px; font-size:11px; font-weight:600;">⚠️ Điểm liệt</span>`;
    }
    questionNumber.innerHTML = `Câu ${question.id}${badge}`;
}

function renderAnswers(question) {
    const container = document.getElementById('answers-container');
    if (!container) return;

    const selectedAnswer = AppState.answers[question.id];
    const isAnswered = selectedAnswer !== undefined;
    const letters = ['A', 'B', 'C', 'D'];

    container.innerHTML = question.answers.map((answer, index) => {
        let className = 'answer-option';
        if (isAnswered) {
            className += ' disabled';
            if (index === question.correct) {
                className += ' correct';
            } else if (index === selectedAnswer && index !== question.correct) {
                className += ' incorrect';
            }
        } else if (index === selectedAnswer) {
            className += ' selected';
        }

        return `
            <div class="${className}" onclick="${isAnswered ? '' : `selectAnswer(${index})`}">
                <div class="answer-letter">${letters[index] || index + 1}</div>
                <div class="answer-text">${answer.replace(/^[A-D]\.\s*/, '')}</div>
            </div>
        `;
    }).join('');
}

function selectAnswer(answerIndex) {
    const question = AppState.questions[AppState.currentIndex];
    if (!question) return;
    if (AppState.answers[question.id] !== undefined) return;

    AppState.answers[question.id] = answerIndex;
    const isCorrect = answerIndex === question.correct;

    // Update stats
    AppState.stats.totalStudied = (AppState.stats.totalStudied || 0) + 1;
    if (isCorrect) {
        AppState.stats.correctAnswers = (AppState.stats.correctAnswers || 0) + 1;
    }

    // Update last study date
    AppState.stats.lastStudyDate = new Date().toDateString();

    // Update practice progress
    if (AppState.mode === 'practice') {
        const newProgress = Math.max(AppState.stats.practiceProgress || 0, AppState.currentIndex + 1);
        AppState.stats.practiceProgress = newProgress;
    }

    saveStats();
    renderAnswers(question);

    // Show explanation
    const explanationEl = document.getElementById('explanation');
    if (explanationEl && question.explanation) {
        explanationEl.classList.remove('hidden');
        setTextContent('explanation-text', question.explanation);
    }

    // Show feedback toast
    if (isCorrect) {
        showToast('✅ Chính xác!', 'success');
    } else {
        showToast('❌ Sai rồi! Xem giải thích bên dưới.', 'error');
    }

    // Auto-advance in practice mode after delay
    if (AppState.mode === 'practice') {
        setTimeout(() => {
            if (AppState.currentIndex < AppState.questions.length - 1) {
                // Don't auto-advance, let user click next
            }
        }, 1500);
    }
}

// ===== NAVIGATION =====
function nextQuestion() {
    if (AppState.currentIndex < AppState.questions.length - 1) {
        AppState.currentIndex++;
        renderQuestion();
        scrollToTop();
    } else {
        // Last question - finish
        finishQuiz();
    }
}

function previousQuestion() {
    if (AppState.currentIndex > 0) {
        AppState.currentIndex--;
        renderQuestion();
        scrollToTop();
    }
}

function updateNavButtons() {
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const isLast = AppState.currentIndex === AppState.questions.length - 1;

    if (prevBtn) {
        prevBtn.disabled = AppState.currentIndex === 0;
        prevBtn.style.opacity = AppState.currentIndex === 0 ? '0.4' : '1';
    }

    if (nextBtn) {
        if (isLast) {
            nextBtn.innerHTML = `Nộp bài <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 13l4 4L19 7"/></svg>`;
        } else {
            nextBtn.innerHTML = `Câu tiếp <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 18l6-6-6-6"/></svg>`;
        }
    }
}

function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ===== TIMER =====
function startTimer(durationSeconds = null) {
    clearInterval(AppState.timerInterval);
    const timerEl = document.getElementById('timer');
    if (!timerEl) return;

    if (durationSeconds) {
        // Countdown timer for exam
        let remaining = durationSeconds;
        AppState.timerInterval = setInterval(() => {
            remaining--;
            const mins = Math.floor(remaining / 60);
            const secs = remaining % 60;
            timerEl.textContent = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;

            if (remaining <= 60) {
                timerEl.classList.add('warning');
            }

            if (remaining <= 0) {
                clearInterval(AppState.timerInterval);
                showToast('⏰ Hết giờ! Bài thi đã kết thúc.', 'error');
                finishQuiz();
            }
        }, 1000);
    } else {
        // Count-up timer for practice
        AppState.timerInterval = setInterval(() => {
            const elapsed = Math.floor((Date.now() - AppState.startTime) / 1000);
            const mins = Math.floor(elapsed / 60);
            const secs = elapsed % 60;
            timerEl.textContent = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
        }, 1000);
    }
}

function stopTimer() {
    clearInterval(AppState.timerInterval);
}

function getElapsedTime() {
    const elapsed = Math.floor((Date.now() - AppState.startTime) / 1000);
    const mins = Math.floor(elapsed / 60);
    const secs = elapsed % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

// ===== FINISH QUIZ =====
function finishQuiz() {
    stopTimer();

    const questions = AppState.questions;
    const answers = AppState.answers;
    let correct = 0;
    let criticalFail = false;

    questions.forEach(q => {
        const selected = answers[q.id];
        if (selected === q.correct) {
            correct++;
        } else if (q.isCritical && selected !== undefined) {
            criticalFail = true;
        }
    });

    const total = questions.length;
    const incorrect = Object.keys(answers).length - correct;
    const accuracy = total > 0 ? Math.round((correct / total) * 100) : 0;
    const timeTaken = getElapsedTime();

    // Update exam stats
    if (AppState.mode === 'exam') {
        AppState.stats.examCount = (AppState.stats.examCount || 0) + 1;
        AppState.stats.examScores = AppState.stats.examScores || [];
        AppState.stats.examScores.push(accuracy);
        if (AppState.stats.examScores.length > 20) {
            AppState.stats.examScores.shift();
        }
        saveStats();
    }

    // Determine pass/fail for exam
    let passed = false;
    let resultIcon = '📊';
    let resultTitle = 'Kết quả ôn luyện';
    let resultMessage = '';

    if (AppState.mode === 'exam') {
        const passingScore = EXAM_CONFIG.passingScore;
        passed = correct >= passingScore && !criticalFail;

        if (criticalFail) {
            resultIcon = '❌';
            resultTitle = 'Không đạt - Sai câu điểm liệt';
            resultMessage = 'Bạn đã sai câu điểm liệt. Cần ôn luyện thêm!';
        } else if (passed) {
            resultIcon = accuracy >= 90 ? '🏆' : '🎉';
            resultTitle = 'Đạt yêu cầu!';
            resultMessage = accuracy >= 90 ? 'Xuất sắc! Bạn đã nắm vững lý thuyết.' : 'Chúc mừng! Bạn đã vượt qua bài thi thử.';
        } else {
            resultIcon = '😔';
            resultTitle = 'Chưa đạt';
            resultMessage = `Cần đúng ít nhất ${passingScore}/${total} câu. Hãy ôn luyện thêm!`;
        }
    } else {
        resultIcon = accuracy >= 80 ? '🌟' : '📚';
        resultTitle = 'Hoàn thành ôn luyện!';
        resultMessage = accuracy >= 80 ? 'Bạn đang học rất tốt!' : 'Tiếp tục ôn luyện để cải thiện!';
    }

    // Render result screen
    setTextContent('result-icon', resultIcon);
    setTextContent('result-title', resultTitle);
    setTextContent('result-score', correct);
    setTextContent('result-message', resultMessage);
    setTextContent('correct-count', correct);
    setTextContent('incorrect-count', Object.keys(answers).length - correct);
    setTextContent('time-taken', timeTaken);
    setTextContent('accuracy-percent', accuracy + '%');

    // Update score total display
    const scoreTotal = document.querySelector('.score-total');
    if (scoreTotal) scoreTotal.textContent = `/${total}`;

    showScreen('result-screen');
}

// ===== EXIT QUIZ =====
function exitQuiz() {
    if (confirm('Bạn có chắc muốn thoát? Tiến độ hiện tại sẽ được lưu.')) {
        stopTimer();
        backToHome();
    }
}

// ===== BACK TO HOME =====
function backToHome() {
    stopTimer();
    AppState.mode = null;
    AppState.questions = [];
    AppState.answers = {};
    renderHomeStats();
    updateLearnedCount();
    showScreen('home-screen');
}

// ===== REVIEW ANSWERS =====
function reviewAnswers() {
    AppState.currentIndex = 0;
    setTextContent('quiz-mode-label', '🔍 Xem lại');
    showScreen('quiz-screen');
    renderQuestion();
}

// ===== UTILITY FUNCTIONS =====
function shuffleArray(array) {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

function showToast(message, type = 'default') {
    // Remove existing toasts
    document.querySelectorAll('.toast').forEach(t => t.remove());

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    document.body.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(100px)';
        toast.style.transition = 'all 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, 2500);
}

// ===== KEYBOARD SHORTCUTS =====
document.addEventListener('keydown', (e) => {
    const quizScreen = document.getElementById('quiz-screen');
    if (!quizScreen || quizScreen.classList.contains('hidden')) return;

    const question = AppState.questions[AppState.currentIndex];
    if (!question) return;

    switch (e.key) {
        case 'ArrowRight':
        case 'Enter':
            nextQuestion();
            break;
        case 'ArrowLeft':
            previousQuestion();
            break;
        case '1':
        case 'a':
        case 'A':
            if (AppState.answers[question.id] === undefined) selectAnswer(0);
            break;
        case '2':
        case 'b':
        case 'B':
            if (AppState.answers[question.id] === undefined) selectAnswer(1);
            break;
        case '3':
        case 'c':
        case 'C':
            if (AppState.answers[question.id] === undefined) selectAnswer(2);
            break;
        case '4':
        case 'd':
        case 'D':
            if (AppState.answers[question.id] === undefined && question.answers.length > 3) selectAnswer(3);
            break;
        case 'Escape':
            exitQuiz();
            break;
    }
});
