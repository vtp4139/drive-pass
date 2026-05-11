// ===== DOMAIN ERRORS =====
class AppError extends Error {
    constructor(message, statusCode = 500) {
        super(message);
        this.name = this.constructor.name;
        this.statusCode = statusCode;
    }
}

class ValidationError extends AppError {
    constructor(message = 'Dữ liệu không hợp lệ') {
        super(message, 400);
    }
}

class NotFoundError extends AppError {
    constructor(message = 'Không tìm thấy') {
        super(message, 404);
    }
}

module.exports = { AppError, ValidationError, NotFoundError };
