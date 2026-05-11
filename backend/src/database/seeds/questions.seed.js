// ===== QUESTIONS SEED DATA =====
// Tách data khỏi logic. Import-script sẽ đọc mảng này.
module.exports = [
    {
        id: 1,
        category: 'Khái niệm và quy tắc giao thông',
        question: "Khái niệm 'Người điều khiển giao thông' được hiểu như thế nào trong các khái niệm dưới đây?",
        answers: [
            'A. Là người điều khiển phương tiện tham gia giao thông tham gia giao thông đường bộ.',
            'B. Là cảnh sát giao thông, người được giao nhiệm vụ hướng dẫn giao thông tại nơi thi công, nơi xảy ra ùn tắc giao thông, ở bến phà, tại cầu đường bộ đi chung với đường sắt.',
            'C. Là người tham gia giao thông tham gia giao thông đường bộ.',
        ],
        correct: 1,
        explanation:
            'Theo Luật Giao thông đường bộ, người điều khiển giao thông là cảnh sát giao thông hoặc người được giao nhiệm vụ điều khiển, hướng dẫn giao thông.',
        isCritical: false,
    },
    {
        id: 2,
        category: 'Khái niệm và quy tắc giao thông',
        question: 'Người lái xe sử dụng rượu, bia có nồng độ cồn vượt quá quy định bị xử phạt như thế nào?',
        answers: [
            'A. Phạt tiền và tước giấy phép lái xe từ 10-12 tháng.',
            'B. Phạt tiền và tước giấy phép lái xe từ 16-18 tháng.',
            'C. Phạt tiền và tước giấy phép lái xe từ 22-24 tháng.',
        ],
        correct: 2,
        explanation:
            'Đây là lỗi nghiêm trọng, vi phạm an toàn giao thông. Người lái xe vi phạm sẽ bị phạt tiền và tước GPLX từ 22-24 tháng.',
        isCritical: true,
    },
    {
        id: 3,
        category: 'Khái niệm và quy tắc giao thông',
        question: 'Khi tham gia giao thông, người lái xe phải mang theo các loại giấy tờ gì?',
        answers: [
            'A. Giấy phép lái xe, giấy đăng ký xe, giấy chứng nhận bảo hiểm trách nhiệm dân sự.',
            'B. Giấy phép lái xe, giấy đăng ký xe.',
            'C. Giấy phép lái xe.',
        ],
        correct: 0,
        explanation:
            'Người lái xe phải mang đầy đủ 3 loại giấy tờ: GPLX, giấy đăng ký xe và giấy bảo hiểm trách nhiệm dân sự.',
        isCritical: false,
    },
    {
        id: 4,
        category: 'Khái niệm và quy tắc giao thông',
        question: 'Tốc độ tối đa cho phép xe ô tô con đi trong khu dân cư là bao nhiêu?',
        answers: ['A. 40 km/h.', 'B. 50 km/h.', 'C. 60 km/h.', 'D. 70 km/h.'],
        correct: 1,
        explanation:
            'Trong khu dân cư, tốc độ tối đa cho phép xe ô tô con là 50 km/h theo quy định của Luật Giao thông đường bộ.',
        isCritical: false,
    },
    {
        id: 5,
        category: 'Khái niệm và quy tắc giao thông',
        question: 'Khi gặp đèn tín hiệu màu vàng, người điều khiển phương tiện phải làm gì?',
        answers: [
            'A. Tăng tốc để vượt qua nhanh.',
            'B. Dừng lại trước vạch dừng, trừ trường hợp đã đi quá vạch dừng thì được đi tiếp.',
            'C. Tiếp tục đi bình thường.',
            'D. Giảm tốc độ và chuẩn bị dừng.',
        ],
        correct: 1,
        explanation:
            'Đèn vàng báo hiệu sắp chuyển sang đỏ. Người lái xe phải dừng trước vạch dừng, trừ khi đã vượt qua vạch dừng thì được đi tiếp.',
        isCritical: false,
    },
    {
        id: 6,
        category: 'Khái niệm và quy tắc giao thông',
        question: 'Khoảng cách an toàn tối thiểu giữa hai xe khi đi với tốc độ 60 km/h là bao nhiêu?',
        answers: ['A. 25 mét.', 'B. 35 mét.', 'C. 50 mét.', 'D. 70 mét.'],
        correct: 1,
        explanation:
            'Ở tốc độ 60 km/h, khoảng cách an toàn tối thiểu là 35 mét để đảm bảo đủ thời gian phản ứng và phanh xe.',
        isCritical: false,
    },
    {
        id: 7,
        category: 'Khái niệm và quy tắc giao thông',
        question:
            'Người điều khiển xe mô tô, xe gắn máy có nồng độ cồn trong máu vượt quá 50 miligam/100 mililít máu bị xử phạt như thế nào?',
        answers: [
            'A. Phạt cảnh cáo.',
            'B. Phạt tiền từ 2.000.000 đến 3.000.000 đồng, tước GPLX 10-12 tháng.',
            'C. Phạt tiền từ 6.000.000 đến 8.000.000 đồng, tước GPLX 22-24 tháng.',
            'D. Phạt tiền từ 4.000.000 đến 5.000.000 đồng.',
        ],
        correct: 2,
        explanation:
            'Đây là vi phạm nghiêm trọng. Mức phạt cao nhất cho vi phạm nồng độ cồn vượt mức quy định là 6-8 triệu đồng và tước GPLX 22-24 tháng.',
        isCritical: true,
    },
    {
        id: 8,
        category: 'Khái niệm và quy tắc giao thông',
        question: 'Xe nào được ưu tiên đi trước tại nơi đường giao nhau không có tín hiệu đèn, biển báo?',
        answers: [
            'A. Xe đi từ bên trái.',
            'B. Xe đi từ bên phải.',
            'C. Xe đi thẳng.',
            'D. Xe lớn hơn.',
        ],
        correct: 1,
        explanation: 'Tại nơi đường giao nhau không có tín hiệu, xe đến từ bên phải được quyền ưu tiên đi trước.',
        isCritical: false,
    },
    {
        id: 9,
        category: 'Khái niệm và quy tắc giao thông',
        question: 'Người lái xe ô tô không được sử dụng điện thoại di động khi đang lái xe, trừ trường hợp nào?',
        answers: [
            'A. Khi đang dừng chờ đèn đỏ.',
            'B. Khi sử dụng thiết bị tai nghe không dây.',
            'C. Khi đang đi trên đường vắng.',
            'D. Không có trường hợp ngoại lệ nào.',
        ],
        correct: 3,
        explanation:
            'Tuyệt đối không được sử dụng điện thoại khi lái xe, kể cả tai nghe không dây. Đây là quy định bắt buộc để đảm bảo an toàn.',
        isCritical: false,
    },
    {
        id: 10,
        category: 'Khái niệm và quy tắc giao thông',
        question: 'Khi muốn vượt xe phía trước, người lái xe phải làm gì trước tiên?',
        answers: [
            'A. Tăng tốc và vượt ngay.',
            'B. Quan sát, bật xi nhan trái, đảm bảo an toàn rồi mới vượt.',
            'C. Bấm còi liên tục để báo hiệu.',
            'D. Chờ xe trước nhường đường.',
        ],
        correct: 1,
        explanation:
            'Trước khi vượt xe phải quan sát kỹ, bật xi nhan trái để báo hiệu, đảm bảo đủ khoảng cách an toàn và không có xe ngược chiều.',
        isCritical: false,
    },
    {
        id: 101,
        category: 'Biển báo hiệu đường bộ',
        question: 'Biển báo hình tam giác đều, viền đỏ, nền màu vàng hoặc trắng thuộc nhóm biển báo nào?',
        answers: [
            'A. Biển báo nguy hiểm.',
            'B. Biển báo cấm.',
            'C. Biển báo hiệu lệnh.',
            'D. Biển báo chỉ dẫn.',
        ],
        correct: 0,
        explanation:
            'Biển báo nguy hiểm có hình tam giác đều, viền đỏ, nền vàng hoặc trắng để cảnh báo các tình huống nguy hiểm.',
        isCritical: false,
    },
    {
        id: 102,
        category: 'Biển báo hiệu đường bộ',
        question: 'Biển báo hình tròn, viền đỏ, nền trắng, có thanh sọc đỏ chéo góc từ trên xuống có ý nghĩa gì?',
        answers: ['A. Cấm đỗ xe.', 'B. Cấm dừng xe và đỗ xe.', 'C. Hết cấm dừng xe và đỗ xe.'],
        correct: 1,
        explanation: 'Biển này cấm cả dừng xe và đỗ xe. Nếu chỉ có 1 sọc chéo thì chỉ cấm đỗ xe.',
        isCritical: false,
    },
    {
        id: 103,
        category: 'Biển báo hiệu đường bộ',
        question: 'Biển báo hình tròn, nền xanh lam, có mũi tên trắng chỉ hướng có ý nghĩa gì?',
        answers: [
            'A. Cấm đi theo hướng mũi tên.',
            'B. Bắt buộc đi theo hướng mũi tên.',
            'C. Được phép đi theo hướng mũi tên.',
            'D. Đường một chiều.',
        ],
        correct: 1,
        explanation:
            'Biển hình tròn nền xanh là biển hiệu lệnh, bắt buộc người tham gia giao thông phải thực hiện theo.',
        isCritical: false,
    },
    {
        id: 104,
        category: 'Biển báo hiệu đường bộ',
        question: "Biển báo 'P' màu xanh có ý nghĩa gì?",
        answers: [
            'A. Cấm đỗ xe.',
            'B. Nơi đỗ xe.',
            'C. Bãi đỗ xe trả phí.',
            'D. Khu vực dừng xe.',
        ],
        correct: 1,
        explanation: "Biển 'P' màu xanh là biển chỉ dẫn nơi đỗ xe, cho phép đỗ xe tại khu vực đó.",
        isCritical: false,
    },
    {
        id: 105,
        category: 'Biển báo hiệu đường bộ',
        question: "Biển báo số '40' trong hình tròn viền đỏ có ý nghĩa gì?",
        answers: [
            'A. Tốc độ tối thiểu 40 km/h.',
            'B. Tốc độ tối đa 40 km/h.',
            'C. Cách 40 km đến điểm tiếp theo.',
            'D. Đường rộng 40 mét.',
        ],
        correct: 1,
        explanation:
            'Biển hình tròn viền đỏ với số là biển cấm, quy định tốc độ tối đa không được vượt quá con số đó.',
        isCritical: false,
    },
    {
        id: 251,
        category: 'Sa hình - Tình huống giao thông',
        question: 'Xe nào được quyền đi trước trong tình huống này?',
        answers: ['A. Xe con.', 'B. Xe tải.', 'C. Xe mô tô.'],
        correct: 0,
        explanation: 'Theo quy tắc nhường đường, xe đi từ bên phải được quyền ưu tiên đi trước.',
        isCritical: false,
        image: 'images/question-251.jpg',
    },
    {
        id: 252,
        category: 'Sa hình - Tình huống giao thông',
        question: 'Khi đang lái xe trên đường cao tốc, xe bị nổ lốp, bạn phải làm gì?',
        answers: [
            'A. Phanh gấp ngay lập tức.',
            'B. Giữ vô lăng thẳng, từ từ giảm tốc, đưa xe vào lề đường an toàn.',
            'C. Đánh lái sang làn khác.',
            'D. Tăng tốc để thoát khỏi tình huống.',
        ],
        correct: 1,
        explanation:
            'Khi nổ lốp, không phanh gấp vì dễ mất lái. Cần giữ vô lăng thẳng, từ từ nhả ga và đưa xe vào lề an toàn.',
        isCritical: false,
    },
    {
        id: 253,
        category: 'Sa hình - Tình huống giao thông',
        question: 'Khi lái xe trong điều kiện trời mưa lớn, tầm nhìn hạn chế, bạn cần làm gì?',
        answers: [
            'A. Bật đèn pha và tăng tốc để qua nhanh.',
            'B. Giảm tốc độ, bật đèn sương mù, tăng khoảng cách an toàn.',
            'C. Dừng xe ngay lập tức.',
            'D. Đi sát lề đường bên phải.',
        ],
        correct: 1,
        explanation:
            'Trong điều kiện tầm nhìn kém, cần giảm tốc độ, bật đèn sương mù và tăng khoảng cách an toàn với xe phía trước.',
        isCritical: false,
    },
    {
        id: 401,
        category: 'Kỹ thuật lái xe',
        question: 'Khi xuống dốc dài, người lái xe cần thực hiện các thao tác nào để đảm bảo an toàn?',
        answers: [
            'A. Nhả hết chân ga, tắt máy, về số 0 để xe tự lăn.',
            'B. Sử dụng phanh liên tục.',
            'C. Giữ chân ga vừa phải, kết hợp phanh và sử dụng phanh động cơ.',
        ],
        correct: 2,
        explanation:
            'Khi xuống dốc dài cần kết hợp phanh và phanh động cơ, tránh phanh liên tục gây quá nhiệt.',
        isCritical: false,
    },
    {
        id: 402,
        category: 'Kỹ thuật lái xe',
        question: 'Khi lái xe lên dốc, người lái xe cần lưu ý điều gì?',
        answers: [
            'A. Tăng tốc mạnh để leo dốc nhanh.',
            'B. Chuyển số thấp hơn trước khi lên dốc, không sang số khi đang leo dốc.',
            'C. Giữ nguyên số đang đi.',
            'D. Tắt máy lạnh để tiết kiệm nhiên liệu.',
        ],
        correct: 1,
        explanation:
            'Trước khi lên dốc cần chuyển về số thấp để có đủ lực kéo. Không sang số khi đang leo dốc vì dễ mất đà.',
        isCritical: false,
    },
    {
        id: 403,
        category: 'Kỹ thuật lái xe',
        question: 'Khi phanh xe trên đường trơn ướt, kỹ thuật nào sau đây là đúng?',
        answers: [
            'A. Đạp phanh thật mạnh và giữ nguyên.',
            'B. Phanh nhẹ và nhịp nhàng, tránh khóa bánh xe.',
            'C. Chỉ sử dụng phanh tay.',
            'D. Không phanh, chỉ nhả ga.',
        ],
        correct: 1,
        explanation:
            'Trên đường trơn, phanh nhẹ và nhịp nhàng giúp tránh khóa bánh xe, duy trì khả năng lái và giảm tốc hiệu quả.',
        isCritical: false,
    },
    {
        id: 501,
        category: 'Cấu tạo và sửa chữa xe',
        question: 'Công dụng của hệ thống treo trên ô tô là gì?',
        answers: [
            'A. Giảm chấn động từ mặt đường truyền lên thân xe.',
            'B. Tăng độ bám đường của bánh xe.',
            'C. Cả A và B đều đúng.',
        ],
        correct: 2,
        explanation: 'Hệ thống treo có cả hai chức năng: giảm chấn động và tăng độ bám đường.',
        isCritical: false,
    },
    {
        id: 502,
        category: 'Cấu tạo và sửa chữa xe',
        question: 'Đèn báo nhiệt độ nước làm mát sáng đỏ khi đang lái xe, bạn phải làm gì?',
        answers: [
            'A. Tiếp tục lái xe bình thường.',
            'B. Tắt máy lạnh, dừng xe an toàn, tắt máy và kiểm tra.',
            'C. Tăng tốc để làm mát động cơ nhanh hơn.',
            'D. Đổ thêm nước vào két nước ngay lập tức.',
        ],
        correct: 1,
        explanation:
            'Đèn nhiệt độ đỏ báo hiệu động cơ quá nóng. Cần dừng xe ngay, tắt máy và để nguội trước khi kiểm tra. Không mở nắp két nước khi máy còn nóng.',
        isCritical: false,
    },
    {
        id: 503,
        category: 'Cấu tạo và sửa chữa xe',
        question: 'Áp suất lốp xe không đủ ảnh hưởng như thế nào đến xe?',
        answers: [
            'A. Tăng độ bám đường.',
            'B. Tăng tiêu hao nhiên liệu, giảm tuổi thọ lốp, ảnh hưởng khả năng lái.',
            'C. Không ảnh hưởng gì.',
            'D. Giảm tiêu hao nhiên liệu.',
        ],
        correct: 1,
        explanation:
            'Lốp thiếu áp suất làm tăng ma sát, tiêu hao nhiên liệu nhiều hơn, lốp mòn nhanh và giảm khả năng kiểm soát xe.',
        isCritical: false,
    },
    {
        id: 561,
        category: 'Đạo đức người lái xe',
        question: 'Người lái xe cần có thái độ như thế nào khi tham gia giao thông?',
        answers: [
            'A. Chấp hành nghiêm chỉnh luật giao thông, tôn trọng người khác.',
            'B. Lái xe nhanh để tiết kiệm thời gian.',
            'C. Chỉ cần tuân thủ khi có cảnh sát.',
            'D. Ưu tiên lợi ích cá nhân.',
        ],
        correct: 0,
        explanation: 'Người lái xe cần có ý thức chấp hành luật và tôn trọng người tham gia giao thông khác.',
        isCritical: false,
    },
    {
        id: 562,
        category: 'Đạo đức người lái xe',
        question: 'Khi gặp tai nạn giao thông, người lái xe có trách nhiệm gì?',
        answers: [
            'A. Bỏ đi để tránh rắc rối.',
            'B. Dừng xe, sơ cứu nạn nhân, báo cơ quan chức năng và ở lại hiện trường.',
            'C. Chỉ cần gọi điện báo cảnh sát.',
            'D. Tiếp tục đi và báo cáo sau.',
        ],
        correct: 1,
        explanation:
            'Người lái xe có trách nhiệm pháp lý và đạo đức phải dừng lại, sơ cứu nạn nhân, báo cơ quan chức năng và ở lại hiện trường.',
        isCritical: false,
    },
];
