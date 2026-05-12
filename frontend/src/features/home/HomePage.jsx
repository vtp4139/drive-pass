import { useMemo } from 'react';
import { Button } from '../../components/Button/Button';
import { EXAM_CONFIG } from '../../config/exam.config';
import { useStats } from '../../store/StatsContext';

export function HomePage({ onStartPractice, onStartExam, onViewHistory, totalQuestions }) {
    const { stats } = useStats();
    const feedbackEmail = 'tuanphuong4139@gmail.com';

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
            <div className="site-warning" role="status" aria-live="polite">
                <strong>{'\u26A0\uFE0F Website \u0111ang trong qu\u00E1 tr\u00ECnh x\u00E2y d\u1EF1ng'}</strong>
                <p>
                    {'Website ch\u01B0a \u0111\u01B0\u1EE3c ho\u00E0n thi\u1EC7n. B\u1EA1n v\u1EABn c\u00F3 th\u1EC3 s\u1EED d\u1EE5ng c\u00E1c ch\u1EE9c n\u0103ng, nh\u01B0ng b\u1ED9 c\u00E2u h\u1ECFi hi\u1EC7n ch\u01B0a \u0111\u1EA7y \u0111\u1EE7. N\u1EBFu c\u00F3 g\u00F3p \u00FD, vui l\u00F2ng g\u1EEDi v\u1EC1 email '}
                    <a href={`mailto:${feedbackEmail}`}>{feedbackEmail}</a>.
                </p>
            </div>
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

                <div className="mode-card mode-card-history" onClick={onViewHistory} role="button" tabIndex={0}>
                    <div className="mode-icon history">🗂️</div>
                    <h3>Lịch Sử Thi</h3>
                    <p>Xem lại các lần thi trước, câu đúng sai và trạng thái đạt hay fail</p>
                    <div className="history-preview">
                        <span className="history-preview-pill">Xem từng câu hỏi</span>
                        <span className="history-preview-pill">Phân tích đạt / fail</span>
                    </div>
                    <Button variant="outline">Mở lịch sử</Button>
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
