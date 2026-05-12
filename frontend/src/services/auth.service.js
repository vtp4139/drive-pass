import { http } from './http-client';

export const AuthService = {
    register(credentials) {
        return http.post('/api/auth/register', credentials);
    },

    login(credentials) {
        return http.post('/api/auth/login', credentials);
    },
};
