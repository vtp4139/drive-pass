# Backend — Drive Pass API

Backend Express theo kiến trúc phân tầng (Routes → Controllers → Services → Repositories → Database).

## Cấu trúc

```
backend/
├── src/
│   ├── config/            # Env & config tập trung
│   ├── database/          # Pool, schema.sql, seeds/
│   ├── repositories/      # Truy cập DB (SQL, không business logic)
│   ├── services/          # Business logic (được scripts & controllers dùng chung)
│   ├── controllers/       # Điều phối request/response
│   ├── routes/            # Định nghĩa endpoint, gắn controller
│   ├── middlewares/       # Error handler, v.v.
│   ├── utils/             # Errors, async-handler
│   ├── app.js             # Khởi tạo Express
│   └── server.js          # Entry point
└── scripts/               # CLI scripts (setup DB, import, test)
```

## Chạy

```bash
npm install
cp .env.example .env     # chỉnh DATABASE_URL
npm run db:test          # test connection
npm run db:setup         # tạo bảng
npm run db:import        # seed câu hỏi mẫu
npm run dev              # chạy server dev (nodemon)
```

## API

| Method | Endpoint                         | Mô tả                    |
| ------ | -------------------------------- | ------------------------ |
| GET    | `/api/health`                    | Health check             |
| GET    | `/api/questions`                 | Lấy tất cả câu hỏi       |
| GET    | `/api/questions/:id`             | Lấy câu hỏi theo ID      |
| GET    | `/api/questions/category/:name`  | Lấy theo danh mục        |
| POST   | `/api/questions`                 | Thêm câu hỏi             |
| GET    | `/api/stats/:userId`             | Lấy thống kê user        |
| POST   | `/api/stats/:userId`             | Lưu thống kê user        |
