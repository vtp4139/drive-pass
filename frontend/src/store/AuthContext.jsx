import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { AuthService } from '../services';

const AUTH_STORAGE_KEY = 'drivePassCurrentUser';
const AuthContext = createContext(null);

function loadStoredUser() {
    try {
        const raw = localStorage.getItem(AUTH_STORAGE_KEY);
        return raw ? JSON.parse(raw) : null;
    } catch {
        return null;
    }
}

export function AuthProvider({ children }) {
    const [user, setUser] = useState(() => loadStoredUser());

    useEffect(() => {
        try {
            if (user) {
                localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
            } else {
                localStorage.removeItem(AUTH_STORAGE_KEY);
            }
        } catch {
            /* ignore */
        }
    }, [user]);

    const value = useMemo(
        () => ({
            user,
            isAuthenticated: Boolean(user),
            async login(credentials) {
                const nextUser = await AuthService.login(credentials);
                setUser(nextUser);
                return nextUser;
            },
            async register(credentials) {
                const nextUser = await AuthService.register(credentials);
                setUser(nextUser);
                return nextUser;
            },
            logout() {
                setUser(null);
            },
        }),
        [user]
    );

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used within AuthProvider');
    return ctx;
}
