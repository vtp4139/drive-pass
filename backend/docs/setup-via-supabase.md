# Hướng dẫn tạo tables trên Supabase

## Phương án 1: Sử dụng Supabase Dashboard (Khuyến nghị)

### Bước 1: Truy cập Supabase Dashboard
1. Mở trình duyệt và truy cập: https://supabase.com
2. Đăng nhập vào tài khoản của bạn
3. Chọn project database của bạn

### Bước 2: Mở SQL Editor
1. Trong dashboard, click vào **SQL Editor** ở menu bên trái
2. Click nút **New query** để tạo query mới

### Bước 3: Copy và chạy SQL
1. Mở file `init-database.sql` trong project
2. Copy toàn bộ nội dung
3. Paste vào SQL Editor
4. Click nút **Run** (hoặc nhấn Ctrl+Enter)

### Bước 4: Kiểm tra kết quả
Sau khi chạy xong, bạn sẽ thấy:
- ✅ 3 bảng được tạo: `questions`, `user_stats`, `exam_history`
- ✅ 10 câu hỏi mẫu được thêm vào bảng `questions`
- ✅ Các index được tạo để tối ưu truy vấn

### Bước 5: Xác nhận
1. Click vào **Table Editor** ở menu bên trái
2. Bạn sẽ thấy 3 bảng mới:
   - `questions` (10 rows)
   - `user_stats` (0 rows)
   - `exam_history` (0 rows)

---

## Phương án 2: Sử dụng psql (Command line)

Nếu bạn có psql installed:

```bash
psql "postgresql://postgres:[YOUR_DB_PASSWORD]@db.[YOUR_PROJECT_REF].supabase.co:5432/postgres" -f init-database.sql
```

---

## Phương án 3: Sử dụng pgAdmin

1. Mở pgAdmin
2. Tạo connection mới với thông tin:
   - Host: `db.[YOUR_PROJECT_REF].supabase.co`
   - Port: `5432`
   - Database: `postgres`
   - Username: `postgres`
   - Password: `[YOUR_DB_PASSWORD]`
   - SSL Mode: `require`
3. Mở Query Tool
4. Copy nội dung file `init-database.sql` và chạy

---

## ⚠️ Lưu ý về lỗi kết nối

Nếu gặp lỗi `ENOTFOUND` khi chạy từ Node.js:

### Nguyên nhân có thể:
1. **Firewall/Antivirus**: Chặn kết nối đến Supabase
2. **DNS Issue**: Không resolve được hostname
3. **Network**: Vấn đề với kết nối internet
4. **VPN/Proxy**: Đang sử dụng VPN/Proxy chặn kết nối

### Giải pháp:
1. Tắt tạm thời Firewall/Antivirus
2. Thử đổi DNS sang Google DNS (8.8.8.8) hoặc Cloudflare (1.1.1.1)
3. Kiểm tra kết nối internet
4. Tắt VPN nếu đang dùng
5. Thử ping hostname:
   ```bash
   ping db.[YOUR_PROJECT_REF].supabase.co
   ```

### Kiểm tra kết nối:
```bash
# Test với curl
curl https://db.[YOUR_PROJECT_REF].supabase.co

# Test với telnet
telnet db.[YOUR_PROJECT_REF].supabase.co 5432
```

---

## 🎯 Sau khi tạo tables thành công

Bạn có thể chạy server:

```bash
npm start
```

Hoặc test lại kết nối:

```bash
node test-connection.js
```

Server sẽ chạy tại: http://localhost:3000

API endpoints:
- GET /api/health
- GET /api/questions
- GET /api/questions/:id
- POST /api/questions
- GET /api/stats/:userId
- POST /api/stats/:userId
