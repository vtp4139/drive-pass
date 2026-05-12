import { useMemo } from 'react';
import { Button } from '../../components/Button/Button';
import { EXAM_CONFIG } from '../../config/exam.config';
import { useStats } from '../../store/StatsContext';
import { AuthPanel } from './components/AuthPanel';

export function HomePage({ onStartPractice, onStartExam, totalQuestions }) {
    const { stats } = useStats();

    const derived = useMemo(() => {
        const totalStudied = stats.totalStudied || 0;
        const correct = stats.correctAnswers || 0;
        const accuracy = totalStudied > 0 ? Math.round((correct / totalStudied) * 100) : 0;
        const examCount = stats.examCount || 0;
        const avgScore = examCount > 0
            ? Math.round((stats.examScores || []).reduce((a, b) => a + b, 0) / examCount)
            : 0;
        const progress = stats.practiceProgress || 0;
        const progressPct = totalQuestions > 0 ? Math.round((progress / totalQuestions) * 100) : 0;
        return { totalStudied, correct, accuracy, examCount, avgScore, progress, progressPct };
    }, [stats, totalQuestions]);

    return (
        <div className="home-screen fade-in">
            <div className="welcome-section">
                <h2>Chào mừng đến với hệ thống ôn thi GPLX</h2>
                <p>Bộ đề {EXAM_CONFIG.totalQuestions} câu hỏi chuẩn Bộ Công An</p>
            </div>

            <AuthPanel />

            <div className="mode-cards">
                <div className="mode-card" onClick={onStartPractice} role="button" tabIndex={0}>
                    <div className="mode-icon practice">📘</div>
                    <h3>Ôn Luyện</h3>
                    <p>Học tuần tự các câu hỏi theo thứ tự</p>
                    <div className="progress-info">
                        <div className="progress-bar">
                            <div className="progress-fill" style={{ width: `${derived.progressPct}%` }} />
                        </div>
                        <span className="progress-text">
                            {derived.progress}/{totalQuestions} câu
                        </span>
                    </div>
                    <Button variant="primary">Bắt đầu học</Button>
                </div>

                <div className="mode-card" onClick={onStartExam} role="button" tabIndex={0}>
                    <div className="mode-icon exam">📝</div>
                    <h3>Thi Thử</h3>
                    <p>Làm bài thi với câu hỏi ngẫu nhiên</p>
                    <div className="exam-stats">
                        <div className="stat">
                            <span className="stat-number">{derived.examCount}</span>
                            <span className="stat-label-small">Lần thi</span>
                        </div>
                        <div className="stat">
                            <span className="stat-number">{derived.avgScore}%</span>
                            <span className="stat-label-small">Điểm TB</span>
                        </div>
                    </div>
                    <Button variant="secondary">Thi ngay</Button>
                </div>
            </div>

            <div className="stats-section">
                <h3>Thống kê học tập</h3>
                <div className="stats-grid">
                    <StatCard icon="📚" number={derived.totalStudied} label="Câu đã học" />
                    <StatCard icon="✅" number={derived.correct} label="Câu trả lời đúng" />
                    <StatCard icon="🎯" number={`${derived.accuracy}%`} label="Độ chính xác" />
                    <StatCard icon="🔥" number={stats.streakDays || 0} label="Ngày liên tiếp" />
                </div>
            </div>
        </div>
    );
}

function StatCard({ icon, number, label }) {
    return (
        <div className="stat-card">
            <div className="stat-icon">{icon}</div>
            <div className="stat-content">
                <span className="stat-number-large">{number}</span>
                <span className="stat-label">{label}</span>
            </div>
        </div>
    );
}
