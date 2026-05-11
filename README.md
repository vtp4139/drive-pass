# 🚗 Trang Web Học Lý Thuyết Lái Xe

Ứng dụng web học lý thuyết giấy phép lái xe với bộ đề 600 câu hỏi chuẩn Bộ Công An Việt Nam.

## ✨ Tính năng

### 📚 Ôn Luyện
- Học tuần tự 600 câu hỏi theo thứ tự
- Lưu tiến độ học tập tự động
- Giải thích chi tiết cho mỗi câu hỏi
- Đánh dấu câu điểm liệt

### 📝 Thi Thử
- Random câu hỏi từ bộ đề 600 câu
- Đếm ngược thời gian thi (19 phút)
- Đánh giá kết quả theo chuẩn sát hạch
- Thống kê điểm số và độ chính xác

### 📊 Thống Kê
- Số câu đã học
- Tỷ lệ trả lời đúng
- Lịch sử điểm thi
- Chuỗi ngày học liên tiếp

## 🎨 Giao diện

- ✅ Thiết kế hiện đại, bắt mắt
- ✅ Responsive - tương thích mọi thiết bị
- ✅ Màu sắc dễ nhìn, không gây mỏi mắt
- ✅ Animation mượt mà
- ✅ Dark mode ready (có thể mở rộng)

## 🚀 Cài đặt

### Cách 1: Mở trực tiếp
1. Tải toàn bộ thư mục về máy
2. Mở file `index.html` bằng trình duyệt web
3. Bắt đầu học ngay!

### Cách 2: Chạy với Live Server (khuyến nghị)
```bash
# Nếu có Python
python -m http.server 8000

# Nếu có Node.js
npx serve

# Hoặc dùng VS Code extension "Live Server"
```

Sau đó truy cập: `http://localhost:8000`

## 📁 Cấu trúc thư mục

```
driving-license-theory/
├── index.html          # Giao diện chính
├── styles.css          # CSS styling
├── app.js              # Logic ứng dụng
├── questions.js        # Dữ liệu câu hỏi
├── images/             # Thư mục chứa hình ảnh câu hỏi (tạo thêm nếu cần)
└── README.md           # Hướng dẫn
```

## 📝 Thêm câu hỏi

### Bước 1: Mở file `questions.js`

### Bước 2: Thêm câu hỏi theo cấu trúc:

```javascript
{
    id: 10,                                    // Số thứ tự câu hỏi
    category: "Khái niệm và quy tắc giao thông", // Danh mục
    question: "Nội dung câu hỏi ở đây?",       // Câu hỏi
    answers: [                                  // Các đáp án
        "A. Đáp án 1",
        "B. Đáp án 2",
        "C. Đáp án 3",
        "D. Đáp án 4"
    ],
    correct: 0,                                 // Chỉ số đáp án đúng (0=A, 1=B, 2=C, 3=D)
    explanation: "Giải thích tại sao đáp án này đúng", // Giải thích
    isCritical: false,                          // true nếu là câu điểm liệt
    image: "images/question-10.jpg"            // Đường dẫn ảnh (nếu có)
}
```

### Bước 3: Các danh mục câu hỏi

1. **Khái niệm và quy tắc giao thông** (Câu 1-100)
   - Luật giao thông đường bộ
   - Quy tắc nhường đường
   - Tốc độ, khoảng cách

2. **Biển báo hiệu đường bộ** (Câu 101-250)
   - Biển báo nguy hiểm
   - Biển báo cấm
   - Biển báo hiệu lệnh
   - Biển chỉ dẫn

3. **Sa hình - Tình huống giao thông** (Câu 251-400)
   - Phân tích tình huống
   - Xử lý tình huống
   - Nhường đường

4. **Kỹ thuật lái xe** (Câu 401-500)
   - Kỹ thuật lái xe cơ bản
   - Xử lý tình huống khẩn cấp
   - Lái xe an toàn

5. **Cấu tạo và sửa chữa xe** (Câu 501-560)
   - Cấu tạo xe
   - Bảo dưỡng xe
   - Xử lý sự cố

6. **Đạo đức người lái xe** (Câu 561-600)
   - Văn hóa giao thông
   - Ý thức người lái xe

### Câu điểm liệt (isCritical: true)

Đánh dấu `isCritical: true` cho các câu hỏi về:
- ❌ Lái xe sau khi uống rượu, bia
- ❌ Sử dụng ma túy
- ❌ Vượt quá tốc độ quy định
- ❌ Vượt đèn đỏ
- ❌ Đi ngược chiều
- ❌ Không chấp hành hiệu lệnh CSGT

## 🎯 Nguồn câu hỏi hợp pháp

Để có bộ 600 câu hỏi đầy đủ, bạn có thể lấy từ:

1. **Sách giáo trình chính thức**
   - Mua tại trung tâm đào tạo lái xe
   - Sách "600 câu hỏi lý thuyết lái xe" có bản quyền

2. **Ứng dụng có giấy phép**
   - App "600 câu hỏi GPLX" trên App Store/Google Play
   - Các app học lái xe đã mua

3. **Trung tâm đào tạo**
   - Tài liệu từ trung tâm dạy lái xe bạn đăng ký
   - Đề thi mẫu từ giáo viên

## ⚙️ Cấu hình

Trong file `questions.js`, bạn có thể điều chỉnh:

```javascript
const EXAM_CONFIG = {
    totalQuestions: 600,    // Tổng số câu trong bộ đề
    examQuestions: 25,      // Số câu trong 1 bài thi
    examDuration: 19,       // Thời gian thi (phút)
    passingScore: 21,       // Điểm đạt (21/25 = 84%)
    criticalFailLimit: 1    // Sai tối đa 1 câu điểm liệt
};
```

## 🎮 Phím tắt

Khi đang làm bài:
- `→` hoặc `Enter`: Câu tiếp theo
- `←`: Câu trước
- `1` hoặc `A`: Chọn đáp án A
- `2` hoặc `B`: Chọn đáp án B
- `3` hoặc `C`: Chọn đáp án C
- `4` hoặc `D`: Chọn đáp án D
- `Esc`: Thoát

## 💾 Lưu trữ dữ liệu

Ứng dụng sử dụng `localStorage` để lưu:
- ✅ Tiến độ học tập
- ✅ Thống kê câu trả lời
- ✅ Lịch sử điểm thi
- ✅ Chuỗi ngày học liên tiếp

**Lưu ý:** Dữ liệu chỉ lưu trên trình duyệt. Nếu xóa cache/cookies sẽ mất dữ liệu.

## 🌐 Trình duyệt hỗ trợ

- ✅ Chrome/Edge (khuyến nghị)
- ✅ Firefox
- ✅ Safari
- ✅ Opera
- ⚠️ IE11 (không hỗ trợ)

## 📱 Responsive Design

Giao diện tự động điều chỉnh cho:
- 💻 Desktop (1024px+)
- 📱 Tablet (768px - 1023px)
- 📱 Mobile (< 768px)

## 🔧 Tùy chỉnh giao diện

### Thay đổi màu chủ đạo

Mở file `styles.css` và chỉnh sửa:

```css
:root {
    --primary: #4F46E5;        /* Màu chính */
    --secondary: #10B981;      /* Màu phụ */
    --danger: #EF4444;         /* Màu lỗi */
    /* ... */
}
```

### Thêm logo riêng

Thay thế SVG trong file `index.html` tại phần `.logo`

## 🐛 Xử lý lỗi

### Không hiển thị câu hỏi
- Kiểm tra file `questions.js` có đúng cú pháp
- Mở Console (F12) để xem lỗi

### Không lưu tiến độ
- Kiểm tra trình duyệt có bật localStorage
- Không dùng chế độ ẩn danh (Incognito)

### Hình ảnh không hiển thị
- Đảm bảo đường dẫn ảnh đúng
- Tạo thư mục `images/` và thêm ảnh vào

## 📄 License

Mã nguồn ứng dụng: MIT License (tự do sử dụng, chỉnh sửa)

**Lưu ý:** Nội dung 600 câu hỏi thuộc bản quyền của Bộ Công An Việt Nam. Chỉ sử dụng cho mục đích học tập cá nhân.

## 🤝 Đóng góp

Nếu bạn muốn cải thiện ứng dụng:
1. Fork repository
2. Tạo branch mới
3. Commit thay đổi
4. Tạo Pull Request

## 📞 Hỗ trợ

Nếu gặp vấn đề, vui lòng:
- Kiểm tra phần "Xử lý lỗi" ở trên
- Mở Console (F12) để xem lỗi chi tiết
- Đảm bảo đã thêm đủ câu hỏi vào `questions.js`

## 🎓 Lời khuyên học tập

1. **Ôn luyện đều đặn**: Học 50-100 câu mỗi ngày
2. **Tập trung câu điểm liệt**: Không được sai câu này
3. **Làm nhiều đề thi thử**: Làm quen với áp lực thời gian
4. **Hiểu, không học vẹt**: Đọc kỹ giải thích
5. **Ôn lại câu sai**: Tập trung vào điểm yếu

## 🎯 Mục tiêu

- ✅ Đạt 21/25 câu trở lên
- ✅ Không sai câu điểm liệt
- ✅ Hoàn thành trong 19 phút
- ✅ Tự tin khi thi thật

---

**Chúc bạn học tốt và thi đạt! 🚗💨**

Made with ❤️ for Vietnamese drivers
