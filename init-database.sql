-- ===== KHỞI TẠO DATABASE CHO ỨNG DỤNG HỌC LÁI XE =====

-- Tạo bảng câu hỏi
CREATE TABLE IF NOT EXISTS questions (
    id INTEGER PRIMARY KEY,
    category VARCHAR(100) NOT NULL,
    question TEXT NOT NULL,
    answers JSONB NOT NULL,
    correct INTEGER NOT NULL,
    explanation TEXT,
    is_critical BOOLEAN DEFAULT FALSE,
    image VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tạo bảng thống kê người dùng
CREATE TABLE IF NOT EXISTS user_stats (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(100) UNIQUE NOT NULL,
    practice_progress INTEGER DEFAULT 0,
    total_studied INTEGER DEFAULT 0,
    correct_answers INTEGER DEFAULT 0,
    exam_count INTEGER DEFAULT 0,
    exam_scores JSONB DEFAULT '[]',
    last_study_date DATE,
    streak_days INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tạo bảng lịch sử làm bài
CREATE TABLE IF NOT EXISTS exam_history (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(100) NOT NULL,
    exam_type VARCHAR(20) NOT NULL, -- 'practice' hoặc 'exam'
    score INTEGER NOT NULL,
    total_questions INTEGER NOT NULL,
    correct_answers INTEGER NOT NULL,
    time_taken INTEGER, -- thời gian làm bài (giây)
    answers JSONB, -- lưu chi tiết câu trả lời
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tạo index để tăng tốc truy vấn
CREATE INDEX IF NOT EXISTS idx_questions_category ON questions(category);
CREATE INDEX IF NOT EXISTS idx_user_stats_user_id ON user_stats(user_id);
CREATE INDEX IF NOT EXISTS idx_exam_history_user_id ON exam_history(user_id);

-- Thêm dữ liệu mẫu (10 câu hỏi đầu tiên)
INSERT INTO questions (id, category, question, answers, correct, explanation, is_critical) VALUES
(1, 'Khái niệm và quy tắc giao thông', 'Khái niệm "Người điều khiển giao thông" được hiểu như thế nào trong các khái niệm dưới đây?', 
 '["A. Là người điều khiển phương tiện tham gia giao thông tham gia giao thông đường bộ.", "B. Là cảnh sát giao thông, người được giao nhiệm vụ hướng dẫn giao thông tại nơi thi công, nơi xảy ra ùn tắc giao thông, ở bến phà, tại cầu đường bộ đi chung với đường sắt.", "C. Là người tham gia giao thông tham gia giao thông đường bộ."]', 
 1, 'Theo Luật Giao thông đường bộ, người điều khiển giao thông là cảnh sát giao thông hoặc người được giao nhiệm vụ điều khiển, hướng dẫn giao thông.', false),

(2, 'Khái niệm và quy tắc giao thông', 'Người lái xe sử dụng rượu, bia có nồng độ cồn vượt quá quy định bị xử phạt như thế nào?',
 '["A. Phạt tiền và tước giấy phép lái xe từ 10-12 tháng.", "B. Phạt tiền và tước giấy phép lái xe từ 16-18 tháng.", "C. Phạt tiền và tước giấy phép lái xe từ 22-24 tháng."]',
 2, 'Đây là lỗi nghiêm trọng, vi phạm an toàn giao thông. Người lái xe vi phạm sẽ bị phạt tiền và tước GPLX từ 22-24 tháng.', true),

(3, 'Khái niệm và quy tắc giao thông', 'Khi tham gia giao thông, người lái xe phải mang theo các loại giấy tờ gì?',
 '["A. Giấy phép lái xe, giấy đăng ký xe, giấy chứng nhận bảo hiểm trách nhiệm dân sự.", "B. Giấy phép lái xe, giấy đăng ký xe.", "C. Giấy phép lái xe."]',
 0, 'Người lái xe phải mang đầy đủ 3 loại giấy tờ: GPLX, giấy đăng ký xe và giấy bảo hiểm trách nhiệm dân sự.', false),

(4, 'Khái niệm và quy tắc giao thông', 'Tốc độ tối đa cho phép xe ô tô con đi trong khu dân cư là bao nhiêu?',
 '["A. 40 km/h.", "B. 50 km/h.", "C. 60 km/h.", "D. 70 km/h."]',
 1, 'Trong khu dân cư, tốc độ tối đa cho phép xe ô tô con là 50 km/h theo quy định của Luật Giao thông đường bộ.', false),

(5, 'Khái niệm và quy tắc giao thông', 'Khi gặp đèn tín hiệu màu vàng, người điều khiển phương tiện phải làm gì?',
 '["A. Tăng tốc để vượt qua nhanh.", "B. Dừng lại trước vạch dừng, trừ trường hợp đã đi quá vạch dừng thì được đi tiếp.", "C. Tiếp tục đi bình thường.", "D. Giảm tốc độ và chuẩn bị dừng."]',
 1, 'Đèn vàng báo hiệu sắp chuyển sang đỏ. Người lái xe phải dừng trước vạch dừng, trừ khi đã vượt qua vạch dừng thì được đi tiếp.', false),

(6, 'Khái niệm và quy tắc giao thông', 'Khoảng cách an toàn tối thiểu giữa hai xe khi đi với tốc độ 60 km/h là bao nhiêu?',
 '["A. 25 mét.", "B. 35 mét.", "C. 50 mét.", "D. 70 mét."]',
 1, 'Ở tốc độ 60 km/h, khoảng cách an toàn tối thiểu là 35 mét để đảm bảo đủ thời gian phản ứng và phanh xe.', false),

(7, 'Khái niệm và quy tắc giao thông', 'Người điều khiển xe mô tô, xe gắn máy có nồng độ cồn trong máu vượt quá 50 miligam/100 mililít máu bị xử phạt như thế nào?',
 '["A. Phạt cảnh cáo.", "B. Phạt tiền từ 2.000.000 đến 3.000.000 đồng, tước GPLX 10-12 tháng.", "C. Phạt tiền từ 6.000.000 đến 8.000.000 đồng, tước GPLX 22-24 tháng.", "D. Phạt tiền từ 4.000.000 đến 5.000.000 đồng."]',
 2, 'Đây là vi phạm nghiêm trọng. Mức phạt cao nhất cho vi phạm nồng độ cồn vượt mức quy định là 6-8 triệu đồng và tước GPLX 22-24 tháng.', true),

(8, 'Khái niệm và quy tắc giao thông', 'Xe nào được ưu tiên đi trước tại nơi đường giao nhau không có tín hiệu đèn, biển báo?',
 '["A. Xe đi từ bên trái.", "B. Xe đi từ bên phải.", "C. Xe đi thẳng.", "D. Xe lớn hơn."]',
 1, 'Tại nơi đường giao nhau không có tín hiệu, xe đến từ bên phải được quyền ưu tiên đi trước.', false),

(9, 'Khái niệm và quy tắc giao thông', 'Người lái xe ô tô không được sử dụng điện thoại di động khi đang lái xe, trừ trường hợp nào?',
 '["A. Khi đang dừng chờ đèn đỏ.", "B. Khi sử dụng thiết bị tai nghe không dây.", "C. Khi đang đi trên đường vắng.", "D. Không có trường hợp ngoại lệ nào."]',
 3, 'Tuyệt đối không được sử dụng điện thoại khi lái xe, kể cả tai nghe không dây. Đây là quy định bắt buộc để đảm bảo an toàn.', false),

(10, 'Khái niệm và quy tắc giao thông', 'Khi muốn vượt xe phía trước, người lái xe phải làm gì trước tiên?',
 '["A. Tăng tốc và vượt ngay.", "B. Quan sát, bật xi nhan trái, đảm bảo an toàn rồi mới vượt.", "C. Bấm còi liên tục để báo hiệu.", "D. Chờ xe trước nhường đường."]',
 1, 'Trước khi vượt xe phải quan sát kỹ, bật xi nhan trái để báo hiệu, đảm bảo đủ khoảng cách an toàn và không có xe ngược chiều.', false)

ON CONFLICT (id) DO NOTHING;

-- Thông báo hoàn thành
SELECT 'Database đã được khởi tạo thành công!' as message;
