import { useEffect, useState } from 'react';
import { Button } from '../../../components/Button/Button';
import { useToast } from '../../../components/Toast/ToastProvider';
import { useAuth } from '../../../store/AuthContext';

export function AuthPanel() {
    const { user } = useAuth();
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <div className="header-auth">
                {user ? (
                    <Button variant="outline" className="header-auth-btn" onClick={() => setIsOpen(true)}>
                        @{user.username}
                    </Button>
                ) : (
                    <Button variant="primary" className="header-auth-btn" onClick={() => setIsOpen(true)}>
                        Đăng nhập
                    </Button>
                )}
            </div>

            {isOpen && <AuthModal onClose={() => setIsOpen(false)} />}
        </>
    );
}

function AuthModal({ onClose }) {
    const { user, login, register, logout } = useAuth();
    const toast = useToast();
    const [mode, setMode] = useState(user ? 'account' : 'login');
    const [username, setUsername] = useState(user?.username || '');
    const [password, setPassword] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key === 'Escape') onClose();
        };

        document.body.style.overflow = 'hidden';
        window.addEventListener('keydown', handleKeyDown);

        return () => {
            document.body.style.overflow = '';
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [onClose]);

    async function handleSubmit(event) {
        event.preventDefault();
        setIsSubmitting(true);

        try {
            const credentials = { username, password };
            const account = mode === 'register'
                ? await register(credentials)
                : await login(credentials);

            toast.success(
                mode === 'register'
                    ? `Tạo tài khoản ${account.username} thành công`
                    : `Chào mừng ${account.username} quay lại`
            );
            setPassword('');
            onClose();
        } catch (error) {
            toast.error(error.message || 'Không thể đăng nhập');
        } finally {
            setIsSubmitting(false);
        }
    }

    if (mode === 'account' && user) {
        return (
            <div className="auth-modal-backdrop" onClick={onClose} role="presentation">
                <div
                    className="auth-modal"
                    onClick={(event) => event.stopPropagation()}
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="auth-modal-title"
                >
                    <button type="button" className="auth-modal-close" onClick={onClose} aria-label="Đóng">
                        ×
                    </button>

                    <div className="auth-modal-copy">
                        <p className="auth-modal-kicker">Tài khoản</p>
                        <h3 id="auth-modal-title">@{user.username}</h3>
                        <p className="auth-subtitle">
                            Bạn đang đăng nhập và tiến độ học tập đang được đồng bộ với tài khoản này.
                        </p>
                    </div>

                    <div className="account-summary">
                        <div className="account-summary-row">
                            <span className="account-summary-label">Trạng thái</span>
                            <span className="account-summary-value">Đang đồng bộ</span>
                        </div>
                        <div className="account-summary-row">
                            <span className="account-summary-label">Tài khoản</span>
                            <span className="account-summary-value">@{user.username}</span>
                        </div>
                    </div>

                    <div className="account-actions">
                        <Button
                            type="button"
                            variant="danger"
                            className="logout-btn"
                            onClick={() => {
                                logout();
                                onClose();
                                toast.success('Đã đăng xuất, app quay về lưu local');
                            }}
                        >
                            <span aria-hidden="true">↩</span>
                            Đăng xuất
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="auth-modal-backdrop" onClick={onClose} role="presentation">
            <div
                className="auth-modal"
                onClick={(event) => event.stopPropagation()}
                role="dialog"
                aria-modal="true"
                aria-labelledby="auth-modal-title"
            >
                <button type="button" className="auth-modal-close" onClick={onClose} aria-label="Đóng">
                    ×
                </button>

                <div className="auth-modal-copy">
                    <p className="auth-modal-kicker">Tài khoản</p>
                    <h3 id="auth-modal-title">
                        {user ? 'Đăng nhập tài khoản khác' : 'Đăng nhập để đồng bộ tiến độ'}
                    </h3>
                    <p className="auth-subtitle">
                        Đăng nhập hoặc tạo tài khoản riêng để lưu tiến độ học tập trên nhiều thiết bị.
                    </p>
                </div>

                <div className="auth-switch">
                    <button
                        type="button"
                        className={`auth-switch-btn ${mode === 'login' ? 'active' : ''}`.trim()}
                        onClick={() => setMode('login')}
                    >
                        Đăng nhập
                    </button>
                    <button
                        type="button"
                        className={`auth-switch-btn ${mode === 'register' ? 'active' : ''}`.trim()}
                        onClick={() => setMode('register')}
                    >
                        Tạo tài khoản
                    </button>
                </div>

                <form className="auth-form auth-form-modal" onSubmit={handleSubmit}>
                    <input
                        className="auth-input"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        autoComplete="username"
                    />
                    <input
                        className="auth-input"
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        autoComplete={mode === 'register' ? 'new-password' : 'current-password'}
                    />
                    <Button
                        type="submit"
                        variant={mode === 'login' ? 'primary' : 'secondary'}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Đang xử lý...' : mode === 'login' ? 'Đăng nhập' : 'Tạo tài khoản'}
                    </Button>
                </form>
            </div>
        </div>
    );
}
