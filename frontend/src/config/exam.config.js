// ===== EXAM CONFIGURATION =====
export const EXAM_CONFIG = {
    totalQuestions: 600,
    examQuestions: 25,
    examDuration: 19, // phút
    passingScore: 21,
    criticalFailLimit: 1,
};

export const CATEGORIES = {
    'Khái niệm và quy tắc giao thông': { start: 1, end: 100, color: '#2563EB' },
    'Biển báo hiệu đường bộ': { start: 101, end: 250, color: '#EA580C' },
    'Sa hình - Tình huống giao thông': { start: 251, end: 400, color: '#16A34A' },
    'Kỹ thuật lái xe': { start: 401, end: 500, color: '#9333EA' },
    'Cấu tạo và sửa chữa xe': { start: 501, end: 560, color: '#DC2626' },
    'Đạo đức người lái xe': { start: 561, end: 600, color: '#0891B2' },
};
