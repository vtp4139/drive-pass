# Drive Pass — Ứng dụng học lý thuyết lái xe

Monorepo gồm **backend** (Node.js + Express) và **frontend** (React + Vite). Dùng npm workspaces.

## Kiến trúc

```
drive-pass/
├── backend/       # Express API — Routes → Controllers → Services → Repositories → DB
└── frontend/      # React SPA — Features + Service layer (component KHÔNG fetch trực tiếp)
```

### Tại sao phân layer như vậy

**Backend**
- `routes/` định nghĩa URL, không chứa logic.
- `controllers/` mỏng — chỉ đọc req, gọi service, trả response.
- `services/` chứa nghiệp vụ, validation — được controllers và cả CLI scripts (seed, import) dùng chung.
- `repositories/` duy nhất đụng SQL. Đổi DB chỉ sửa tầng này.

**Frontend**
- `services/` là facade bao bọc HTTP. Component gọi `QuestionService.getAll()` như gọi function. Nếu sau này đổi REST → tRPC/GraphQL, component không cần đổi.
- `features/` tổ chức theo tính năng (home, quiz), mỗi feature có `components/` riêng.
- `hooks/`, `store/`, `utils/` là phần dùng chung.

## Chạy dự án

### 1. Cài dependencies
```bash
npm run install:all
```

### 2. Cấu hình env
```bash
# backend/.env
DATABASE_URL=postgresql://...
PORT=3000
CORS_ORIGIN=http://localhost:5173
```

### 3. Setup DB (lần đầu)
```bash
npm run db:test      # kiểm tra connection
npm run db:setup     # tạo bảng
npm run db:import    # import câu hỏi mẫu (seed)
```

### 4. Dev
```bash
npm run dev          # chạy cả backend (3000) và frontend (5173)
```

### 5. Build production
```bash
npm run build        # build frontend ra frontend/dist
npm run start        # chạy backend production
```

## API Endpoints

| Method | Path                              | Mô tả                    |
| ------ | --------------------------------- | ------------------------ |
| GET    | `/api/health`                     | Health check             |
| GET    | `/api/questions`                  | Tất cả câu hỏi           |
| GET    | `/api/questions/:id`              | Chi tiết câu hỏi         |
| GET    | `/api/questions/category/:name`   | Theo danh mục            |
| POST   | `/api/questions`                  | Thêm câu hỏi             |
| GET    | `/api/stats/:userId`              | Thống kê user            |
| POST   | `/api/stats/:userId`              | Lưu thống kê user        |
