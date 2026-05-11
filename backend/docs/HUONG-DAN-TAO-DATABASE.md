# 🚀 HƯỚNG DẪN TẠO DATABASE TRÊN SUPABASE

## ⚡ Cách nhanh nhất (Khuyến nghị)

### Bước 1: Truy cập Supabase
1. Mở trình duyệt
2. Truy cập: **https://supabase.com**
3. Đăng nhập vào tài khoản

### Bước 2: Chọn Project
- Chọn project có database: `db.vliejziranmnbxgiguvy.supabase.co`

### Bước 3: Mở SQL Editor
1. Click vào **SQL Editor** ở menu bên trái
2. Click nút **New query**

### Bước 4: Copy và Run SQL
1. Mở file **`init-database.sql`** trong VS Code
2. **Ctrl+A** để chọn tất cả
3. **Ctrl+C** để copy
4. Quay lại Supabase SQL Editor
5. **Ctrl+V** để paste
6. Click nút **Run** (hoặc nhấn **Ctrl+Enter**)

### Bước 5: Kiểm tra kết quả ✅
Sau khi chạy xong, bạn sẽ thấy thông báo thành công.

Click vào **Table Editor** để xem:
- ✅ Bảng **questions** (10 câu hỏi mẫu)
- ✅ Bảng **user_stats** (trống)
- ✅ Bảng **exam_history** (trống)

---

## 📊 Cấu trúc Database đã tạo

### 1. Bảng `questions` - Lưu câu hỏi
```
- id (số thứ tự 1-600)
- category (danh mục)
- question (nội dung câu hỏi)
- answers (mảng đáp án JSON)
- correct (đáp án đúng 0-3)
- explanation (giải thích)
- is_critical (câu điểm liệt)
- image (hình ảnh nếu có)
```

### 2. Bảng `user_stats` - Thống kê người dùng
```
- user_id (ID người dùng)
- practice_progress (tiến độ học)
- total_studied (tổng câu đã học)
- correct_answers (số câu đúng)
- exam_count (số lần thi)
- exam_scores (điểm các lần thi)
- last_study_date (ngày học gần nhất)
- streak_days (chuỗi ngày học)
```

### 3. Bảng `exam_history` - Lịch sử làm bài
```
- user_id (ID người dùng)
- exam_type (practice/exam)
- score (điểm số)
- total_questions (tổng số câu)
- correct_answers (số câu đúng)
- time_taken (thời gian làm bài)
- answers (chi tiết câu trả lời)
```

---

## 🎯 Sau khi tạo xong

### Chạy server Node.js:
```bash
npm start
```

Server sẽ chạy tại: **http://localhost:3000**

### Test API:
Mở trình duyệt và truy cập:
- http://localhost:3000/api/health
- http://localhost:3000/api/questions

---

## ❓ Nếu gặp vấn đề

### Lỗi kết nối từ Node.js?
**Nguyên nhân:** Firewall/Antivirus chặn kết nối

**Giải pháp:**
1. Tạo tables trên Supabase Dashboard (như hướng dẫn trên) ✅
2. Server vẫn sẽ hoạt động bình thường
3. Không cần chạy script `setup-database.js`

### Cần thêm câu hỏi?
Hiện tại có 10 câu hỏi mẫu. Để thêm 590 câu còn lại:

**Cách 1:** Thêm trực tiếp trên Supabase
- Vào **Table Editor** > **questions**
- Click **Insert row** để thêm từng câu

**Cách 2:** Import từ file (sau khi fix kết nối)
```bash
node import-questions.js
```

---

## 📝 Lưu ý quan trọng

✅ File `.env` chứa thông tin database - **KHÔNG** chia sẻ
✅ File `.gitignore` đã được tạo để bảo vệ `.env`
✅ Database đã có 10 câu hỏi mẫu để test
✅ Bạn cần thêm 590 câu hỏi còn lại từ nguồn hợp pháp

---

## 🎉 Hoàn tất!

Sau khi tạo tables thành công, bạn có thể:
1. ✅ Chạy server: `npm start`
2. ✅ Test API: http://localhost:3000/api/questions
3. ✅ Mở ứng dụng: http://localhost:3000

**Chúc bạn thành công! 🚗💨**
