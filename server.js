// ===== SERVER SETUP =====
const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const db = require('./db');

const app = express();
const PORT = process.env.PORT || 3000;

// ===== MIDDLEWARE =====
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));

// ===== API ROUTES =====

// Test endpoint
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', message: 'Server đang chạy' });
});

// Lấy tất cả câu hỏi
app.get('/api/questions', async (req, res) => {
    try {
        const questions = await db.getAllQuestions();
        res.json({ success: true, data: questions });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Lấy câu hỏi theo ID
app.get('/api/questions/:id', async (req, res) => {
    try {
        const question = await db.getQuestionById(req.params.id);
        if (question) {
            res.json({ success: true, data: question });
        } else {
            res.status(404).json({ success: false, error: 'Không tìm thấy câu hỏi' });
        }
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Lấy câu hỏi theo danh mục
app.get('/api/questions/category/:category', async (req, res) => {
    try {
        const questions = await db.getQuestionsByCategory(req.params.category);
        res.json({ success: true, data: questions });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Thêm câu hỏi mới
app.post('/api/questions', async (req, res) => {
    try {
        const question = await db.addQuestion(req.body);
        res.status(201).json({ success: true, data: question });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Lưu thống kê người dùng
app.post('/api/stats/:userId', async (req, res) => {
    try {
        const stats = await db.saveUserStats(req.params.userId, req.body);
        res.json({ success: true, data: stats });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Lấy thống kê người dùng
app.get('/api/stats/:userId', async (req, res) => {
    try {
        const stats = await db.getUserStats(req.params.userId);
        if (stats) {
            res.json({ success: true, data: stats });
        } else {
            res.status(404).json({ success: false, error: 'Không tìm thấy thống kê' });
        }
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Serve HTML file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// ===== START SERVER =====
app.listen(PORT, () => {
    console.log(`🚀 Server đang chạy tại http://localhost:${PORT}`);
    console.log(`📊 API endpoint: http://localhost:${PORT}/api`);
});
