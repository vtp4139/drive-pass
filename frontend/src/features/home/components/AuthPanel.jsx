import { useState } from 'react';
import { Button } from '../../../components/Button/Button';
import { useToast } from '../../../components/Toast/ToastProvider';
import { useAuth } from '../../../store/AuthContext';

export function AuthPanel() {
    const { user, login, register, logout } = useAuth();
    const toast = useToast();
    const [mode, setMode] = useState('login');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

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
        } catch (error) {
            toast.error(error.message || 'Không thể đăng nhập');
        } finally {
            setIsSubmitting(false);
        }
    }

    if (user) {
        return (
            <div className="auth-panel auth-panel-logged-in">
                <div>
                    <p className="auth-title">Đã đăng nhập</p>
                    <p className="auth-subtitle">@{user.username} đang đồng bộ tiến độ qua database</p>
                </div>
                <Button
                    variant="outline"
                    onClick={() => {
                        logout();
                        toast.success('Đã đăng xuất, app quay về lưu local');
                    }}
                >
                    Đăng xuất
                </Button>
            </div>
        );
    }

    return (
        <div className="auth-panel">
            <div className="auth-copy">
                <p className="auth-title">Đăng nhập để đồng bộ tiến độ</p>
                <p className="auth-subtitle">
                    Chưa đăng nhập thì app vẫn học bình thường và chỉ lưu ở trình duyệt này.
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

            <form className="auth-form" onSubmit={handleSubmit}>
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
    );
}
