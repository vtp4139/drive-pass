# Frontend — Drive Pass (React + Vite)

Frontend theo feature-based architecture. Component **không gọi `fetch` trực tiếp** — tất cả đi qua tầng `services/`.

## Cấu trúc

```
frontend/
├── src/
│   ├── assets/            # Ảnh, icons, fonts
│   ├── components/        # UI components tái sử dụng (Button, Toast, ...)
│   ├── config/            # Config (exam config, categories)
│   ├── features/          # Feature-based folders
│   │   ├── home/
│   │   └── quiz/          # components/ + QuizPage
│   ├── hooks/             # Custom hooks dùng chung (useQuestions, useTimer)
│   ├── services/          # ⭐ TẦNG GIAO TIẾP BACKEND
│   │   ├── http-client.js        # private, chỉ services dùng
│   │   ├── question.service.js   # QuestionService.getAll()...
│   │   ├── user-stats.service.js
│   │   └── local-stats.service.js
│   ├── store/             # Context / state (StatsContext)
│   ├── styles/            # global.css
│   ├── utils/             # helpers (array, time)
│   ├── App.jsx
│   └── main.jsx
├── index.html
└── vite.config.js
```

## Nguyên tắc service layer

```jsx
// ✅ ĐÚNG — component gọi service
import { QuestionService } from '../services';
const data = await QuestionService.getAll();

// ❌ SAI — không gọi fetch trực tiếp trong component/hook UI
const res = await fetch('/api/questions');
```

Khi muốn đổi backend (REST → tRPC/GraphQL), chỉ cần sửa file trong `services/`. Component không đổi.

## Chạy

```bash
npm install
npm run dev     # http://localhost:5173 (proxy /api -> http://localhost:3000)
npm run build
```
