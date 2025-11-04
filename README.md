# BÀI TẬP LỚN: LẬP TRÌNH MẠNG

## Voting System - Hệ thống bỏ phiếu trực tuyến

---

## 🧑‍💻 THÔNG TIN NHÓM

| STT | Họ và Tên         | MSSV       | Email                            | Đóng góp |
| --- | ----------------- | ---------- | -------------------------------- | -------- |
| 1   | Tạ Cao Sơn        | B22DCVT445 | tacaoson230804@gmail.com         | ...      |
| 2   | Nguyễn Minh Thắng | B22DCVT525 | ThangNM.B22VT525@stu.ptit.edu.vn | ...      |
| 3   | Trần Thu Thảo     | B22DCVT519 | thutrn1006@gmail.com             | ...      |

**Tên nhóm:** Nhóm 05 – Lập trình mạng  
**Chủ đề:** Hệ thống bỏ phiếu trực tuyến qua mạng LAN

---

## 🧠 MÔ TẢ HỆ THỐNG

Hệ thống voting realtime **đơn giản** cho các ngôn ngữ lập trình, cho phép nhiều thiết bị trong cùng mạng LAN kết nối và vote theo thời gian thực.

- **Client (React + Material UI)**: Single Page Application để vote/unvote
- **Server (Express + Socket.IO)**: Xử lý logic voting với realtime updates
- **Storage**: In-memory (Arrays/Objects) - đơn giản, không cần database

**Các tính năng chính:**

- ⚡ Vote/Unvote realtime với Socket.IO

**Cấu trúc logic:**

```
Client (React)  <--->  Socket.IO  <--->  Server (Express)
   (Port 5173)      (Realtime)         (Port 5000)
```

> **Lưu ý:** Dữ liệu lưu trong memory, sẽ mất khi restart server.

---

## ⚙️ CÔNG NGHỆ SỬ DỤNG

| Thành phần | Công nghệ                       | Ghi chú                |
| ---------- | ------------------------------- | ---------------------- |
| Client     | React 19 + Material UI + Vite   | SPA không router       |
| Server     | Node.js + Express 5 + Socket.IO | Realtime bidirectional |
| Storage    | In-Memory (Arrays/Objects/Map)  | Simple & fast          |

---

## 🚀 HƯỚNG DẪN CHẠY DỰ ÁN

### Yêu cầu hệ thống

- Node.js v18 trở lên
- MongoDB (local hoặc cloud)
- Yarn v4

### 1. Clone repository

```bash
git clone https://github.com/jnp2018/mid-project-525445519.git
cd mid-project-525445519
```

### 2. Cài đặt dependencies cả client và server

```bash
yarn install
yarn install:all
```

### 3. Chạy cả client và server (Realtime)

```bash
yarn dev
```

Server sẽ hiển thị:

```
Server running on:
  - Local:   http://localhost:5000
  - Network: http://<Your-LAN-IP>:5000
```

Client sẽ hiển thị:

```
VITE ready
  - Local: http://localhost:3000
  - Network: http://<Your-LAN-IP>:3000
```

### 4. Truy cập và sử dụng

- Mở browser: `http://<Your-LAN-IP>:3000`
- Click **Vote** cho ngôn ngữ yêu thích
- Xem kết quả **realtime**
- Click **Unvote** để hủy vote
- Mở nhiều tab/thiết bị khác để test realtime!
---

## 🔗 SOCKET.IO EVENTS

### Client → Server

| Event    | Params       | Mô tả             |
| -------- | ------------ | ----------------- |
| `vote`   | `languageId` | Vote cho ngôn ngữ |
| `unvote` | —            | Hủy vote hiện tại |

### Server → Client

| Event         | Data          | Mô tả                             |
| ------------- | ------------- | --------------------------------- |
| `initialData` | `languages[]` | Gửi data ban đầu khi connect      |
| `updateVotes` | `languages[]` | Broadcast updates đến ALL clients |
| `error`       | `{message}`   | Gửi error message                 |

### REST API

| Endpoint         | Method | Output             | Mô tả                  |
| ---------------- | ------ | ------------------ | ---------------------- |
| `/api/languages` | GET    | Array of languages | Lấy danh sách ngôn ngữ |

---

## 📊 CẤU TRÚC UI

**Single Page Application - Không có router**

- Header: Title + Total votes + Current vote
- Grid Cards: 6 cards cho 6 ngôn ngữ
- Progress Bars: Hiển thị % votes realtime
- Vote/Unvote Buttons: Material UI buttons với icons
- Snackbar: Notifications cho mọi action

---

## 🧩 CẤU TRÚC DỰ ÁN

```
mid-project-525445519/
├── README.md                   # Tài liệu chính
├── README_DETAILED.md          # Hướng dẫn chi tiết
├── VOTING_GUIDE.md             # Quick reference
├── INSTRUCTION.md
├── package.json                # Root scripts
└── source/
    ├── client/                 # React + Material UI
    │   ├── package.json
    │   ├── vite.config.js
    │   ├── index.html
    │   └── src/
    │       ├── main.jsx        # Entry point (no router)
    │       └── App.jsx         # Main voting component (single page)
    └── server/                 # Express + Socket.IO
        ├── package.json
        └── index.js            # Server với Socket.IO events
```

---

## 🧩 HƯỚNG PHÁT TRIỂN THÊM

- [x] **Cơ bản**: Vote/Unvote realtime
- [x] **Socket.IO**: Bidirectional communication
- [x] **Material UI**: Modern & responsive
- [x] **Single Page**: No router needed
- [x] **6 Languages**: JavaScript, Python, Java, C++, Go, Rust
- [ ] **Database**: MongoDB/PostgreSQL cho persistent data
- [ ] **Authentication**: Login/Register users
- [ ] **Admin Panel**: Reset votes, manage languages
- [ ] **Charts**: Visualization với Chart.js
- [ ] **Export**: Results to Excel/PDF
- [ ] **Themes**: Dark/Light mode
- [ ] **Deploy**: Vercel (client) + Railway (server)

---

## � TÀI LIỆU

- [Socket.IO Docs](https://socket.io/docs/v4/)
- [Material UI Docs](https://mui.com/)
- [React Docs](https://react.dev/)
- [Node.js Docs](https://nodejs.org/en/docs)
- [Express.js Docs](https://expressjs.com/)
