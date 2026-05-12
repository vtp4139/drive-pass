# Hướng dẫn kết nối PostgreSQL Database

## 📋 Yêu cầu
- Node.js (phiên bản 14 trở lên)
- PostgreSQL database (đã có sẵn trên Supabase)

## 🚀 Cài đặt

### 1. Cài đặt các package cần thiết
```bash
npm install
```

### 2. Khởi tạo database
Truy cập Supabase Dashboard và chạy file `init-database.sql` trong SQL Editor:
- Đăng nhập vào https://supabase.com
- Chọn project của bạn
- Vào mục "SQL Editor"
- Copy nội dung file `init-database.sql` và chạy

Hoặc sử dụng psql:
```bash
psql "postgresql://postgres:[YOUR_DB_PASSWORD]@db.[YOUR_PROJECT_REF].supabase.co:5432/postgres" -f init-database.sql
```

### 3. Chạy server
```bash
npm start
```

Hoặc chạy ở chế độ development (tự động restart khi có thay đổi):
```bash
npm run dev
```

## 📡 API Endpoints

### Health Check
```
GET /api/health
```

### Câu hỏi
```
GET /api/questions              - Lấy tất cả câu hỏi
GET /api/questions/:id          - Lấy câu hỏi theo ID
GET /api/questions/category/:category - Lấy câu hỏi theo danh mục
POST /api/questions             - Thêm câu hỏi mới
```

### Thống kê người dùng
```
GET /api/stats/:userId          - Lấy thống kê người dùng
POST /api/stats/:userId         - Lưu thống kê người dùng
```

## 🗄️ Cấu trúc Database

### Bảng `questions`
- `id`: ID câu hỏi (1-600)
- `category`: Danh mục câu hỏi
- `question`: Nội dung câu hỏi
- `answers`: Mảng các đáp án (JSONB)
- `correct`: Chỉ số đáp án đúng (0-3)
- `explanation`: Giải thích
- `is_critical`: Câu điểm liệt (true/false)
- `image`: Đường dẫn hình ảnh (nếu có)

### Bảng `user_stats`
- `user_id`: ID người dùng
- `practice_progress`: Tiến độ ôn luyện
- `total_studied`: Tổng số câu đã học
- `correct_answers`: Số câu trả lời đúng
- `exam_count`: Số lần thi
- `exam_scores`: Mảng điểm các lần thi (JSONB)
- `last_study_date`: Ngày học gần nhất
- `streak_days`: Số ngày học liên tiếp

### Bảng `exam_history`
- `user_id`: ID người dùng
- `exam_type`: Loại bài thi ('practice' hoặc 'exam')
- `score`: Điểm số
- `total_questions`: Tổng số câu
- `correct_answers`: Số câu đúng
- `time_taken`: Thời gian làm bài (giây)
- `answers`: Chi tiết câu trả lời (JSONB)

## 🔧 Cấu hình

File `.env` chứa thông tin kết nối:
```
DATABASE_URL=postgresql://postgres:[YOUR_DB_PASSWORD]@db.[YOUR_PROJECT_REF].supabase.co:5432/postgres
PORT=3000
```

## 📝 Ghi chú

- Database đã được cấu hình SSL cho Supabase
- Connection pool được sử dụng để tối ưu hiệu suất
- Dữ liệu mẫu (10 câu hỏi) đã được thêm vào khi khởi tạo
- Bạn cần thêm 590 câu hỏi còn lại vào database

## 🔐 Bảo mật

**QUAN TRỌNG**: File `.env` chứa thông tin nhạy cảm. Đảm bảo:
- Không commit file `.env` lên Git
- Thêm `.env` vào file `.gitignore`
- Thay đổi mật khẩu database nếu cần thiết

## 🆘 Xử lý lỗi

Nếu gặp lỗi kết nối:
1. Kiểm tra connection string trong file `.env`
2. Đảm bảo database đang chạy
3. Kiểm tra firewall/network settings
4. Xem log trong console để biết chi tiết lỗi
