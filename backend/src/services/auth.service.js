const authRepository = require('../repositories/auth.repository');
const { ValidationError } = require('../utils/errors');
const { hashPassword, verifyPassword } = require('../utils/password');

function sanitizeUser(user) {
    if (!user) return null;
    return {
        id: String(user.id),
        username: user.username,
        createdAt: user.createdAt,
    };
}

function validateCredentials(payload) {
    const username = payload?.username?.trim();
    const password = payload?.password;

    if (!username || username.length < 3) {
        throw new ValidationError('Username phải có ít nhất 3 ký tự');
    }

    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
        throw new ValidationError('Username chỉ được gồm chữ, số và dấu gạch dưới');
    }

    if (typeof password !== 'string' || password.length < 4) {
        throw new ValidationError('Password phải có ít nhất 4 ký tự');
    }

    return { username, password };
}

async function register(payload) {
    const { username, password } = validateCredentials(payload);
    const existingUser = await authRepository.findByUsername(username);
    if (existingUser) {
        throw new ValidationError('Username đã tồn tại');
    }

    const user = await authRepository.create({
        username,
        passwordHash: hashPassword(password),
    });

    return sanitizeUser(user);
}

async function login(payload) {
    const { username, password } = validateCredentials(payload);
    const user = await authRepository.findByUsername(username);

    if (!user || !verifyPassword(password, user.passwordHash)) {
        throw new ValidationError('Sai username hoặc password');
    }

    return sanitizeUser(user);
}

module.exports = {
    register,
    login,
};
