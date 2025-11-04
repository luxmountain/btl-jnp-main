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

Hệ thống bỏ phiếu trực tuyến theo thời gian thực cho các ngôn ngữ lập trình. Nhiều người dùng trong cùng mạng LAN có thể kết nối và bỏ phiếu đồng thời.

**Kiến trúc hệ thống:**

- **Client (React + Material UI)**: Giao diện web để vote và unvote
- **Server (Express + WebSocket)**: Xử lý logic voting và cập nhật realtime
- **Storage**: Lưu trữ tạm thời trên RAM (dữ liệu sẽ mất khi tắt server)

**Tính năng:**

- ⚡ Cập nhật kết quả bỏ phiếu tức thì với WebSocket
- 🔄 Mỗi người chỉ vote được 1 lần
- 📊 Hiển thị % và số lượng vote theo thời gian thực

**Sơ đồ kết nối:**

```
Client (React)  <--->  WebSocket  <--->  Server (Express)
   (Port 3000)      (Realtime)         (Port 5000)
```

> **⚠️ Lưu ý:** Dữ liệu chỉ lưu trên RAM, khi restart server thì tất cả votes sẽ bị reset về 0.

---

## ⚙️ CÔNG NGHỆ SỬ DỤNG

| Thành phần     | Công nghệ                       | Vai trò                           |
| -------------- | ------------------------------- | --------------------------------- |
| **Client**     | React 19 + Material UI + Vite   | Giao diện web hiện đại, responsive |
| **Server**     | Node.js + Express 5 + WebSocket | Xử lý logic và realtime updates    |
| **Lưu trữ**    | In-Memory (Map, Array)          | Lưu tạm trên RAM, nhanh và đơn giản |
| **Giao tiếp**  | WebSocket (ws)                  | Kết nối 2 chiều client ↔ server   |

---

## 🚀 HƯỚNG DẪN CHẠY DỰ ÁN

### Yêu cầu hệ thống

- Node.js v18 trở lên
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

### 3. Chạy cả client và server cùng lúc

```bash
yarn dev
```

**Kết quả hiển thị trên terminal:**

Server:
```
Server running on:
  - Local:   http://localhost:5000
  - Network: http://<Your-LAN-IP>:5000
```

Client:
```
VITE ready
  - Local: http://localhost:3000
  - Network: http://<Your-LAN-IP>:3000
```

### 4. Tìm địa chỉ IP mạng LAN

> **💡 Tip:** Nếu địa chỉ IP hiển thị trên terminal của client và server giống nhau thì bỏ qua bước này!

**Cách 1: Xem trên terminal (Nhanh nhất)**

Khi chạy `yarn dev`, địa chỉ IP đã tự động hiển thị:

```
Server running on:
  - Network: http://192.168.1.36:5000  ← Đây là địa chỉ IP mạng LAN
```

**Cách 2: Tìm thủ công**

**Windows:**
```powershell
ipconfig
```
Tìm dòng **IPv4 Address** trong mục:
- **Wireless LAN adapter Wi-Fi** (nếu dùng WiFi)
- **Ethernet adapter** (nếu dùng dây mạng)

Ví dụ: `192.168.1.36`

**macOS/Linux:**
```bash
ifconfig | grep "inet " | grep -v 127.0.0.1
```

Hoặc:
```bash
ip addr show
```

### 5. Truy cập và sử dụng hệ thống

**Bước 1: Mở trình duyệt**
- Truy cập: `http://<Your-LAN-IP>:3000`
- Ví dụ: `http://192.168.1.36:3000`

**Bước 2: Bỏ phiếu**
- Click nút **Vote** cho ngôn ngữ bạn yêu thích
- Kết quả cập nhật **tức thì** trên tất cả thiết bị

**Bước 3: Hủy phiếu (nếu muốn)**
- Click nút **Bỏ vote** để hủy

**Bước 4: Test với nhiều thiết bị**
- Mở nhiều tab trên cùng máy HOẶC
- Mở trên điện thoại/máy tính khác trong cùng mạng WiFi
- Quan sát kết quả cập nhật đồng bộ!

> **💡 Lưu ý quan trọng:**
>
> - ✅ Client **tự động kết nối** đến server qua địa chỉ IP hiện tại
> - ✅ Truy cập `http://192.168.1.36:3000` → tự động kết nối `http://192.168.1.36:5000`
> - ❌ **KHÔNG dùng** `localhost` khi muốn nhiều thiết bị cùng truy cập
> - ✅ Đảm bảo tất cả thiết bị kết nối **cùng mạng WiFi/LAN**
> - ⚠️ Nếu thiết bị khác không truy cập được: tắt Firewall hoặc cho phép port 3000 và 5000

---

## 🔗 API DOCUMENTATION

### WebSocket Messages (Giao tiếp Realtime)

**📤 Client gửi lên Server:**

| Type     | Data         | Mô tả                             |
| -------- | ------------ | --------------------------------- |
| `vote`   | `languageId` | Bỏ phiếu cho ngôn ngữ theo ID     |
| `unvote` | —            | Hủy phiếu bầu hiện tại            |

**Format message gửi:**
```json
{
  "type": "vote",
  "data": 1
}
```

**📥 Server gửi xuống Client:**

| Type          | Data          | Mô tả                                      |
| ------------- | ------------- | ------------------------------------------ |
| `initialData` | `languages[]` | Gửi danh sách ngôn ngữ khi user kết nối    |
| `updateVotes` | `languages[]` | Cập nhật số votes cho TẤT CẢ client        |
| `error`       | `{message}`   | Thông báo lỗi (ví dụ: đã vote rồi)         |

**Format message nhận:**
```json
{
  "type": "updateVotes",
  "data": [...]
}
```

### REST API Endpoints (HTTP)

| Endpoint         | Protocol | Method | Input       | Output              | Mô tả                               |
| ---------------- | -------- | ------ | ----------- | ------------------- | ----------------------------------- |
| `/api/languages` | HTTP     | GET    | Không có    | Mảng danh sách      | Lấy tất cả ngôn ngữ và số votes     |

**Ví dụ Response:**

```json
[
  {
    "id": 1,
    "name": "JavaScript",
    "votes": 5,
    "color": "#F7DF1E",
    "icon": "🟨"
  },
  { 
    "id": 2, 
    "name": "Python", 
    "votes": 3, 
    "color": "#3776AB", 
    "icon": "🐍" 
  }
]
```

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

**✅ Đã hoàn thành:**
- Vote/Unvote theo thời gian thực
- Giao tiếp 2 chiều với WebSocket
- Giao diện hiện đại với Material UI
- Tự động phát hiện địa chỉ mạng LAN
- Hỗ trợ 8 ngôn ngữ lập trình

**📋 Kế hoạch phát triển:**
- [ ] **Cơ sở dữ liệu**: Lưu trữ vĩnh viễn với MongoDB/PostgreSQL
- [ ] **Xác thực người dùng**: Đăng ký/Đăng nhập
- [ ] **Trang quản trị**: Reset votes, quản lý ngôn ngữ
- [ ] **Biểu đồ**: Trực quan hóa với Chart.js
- [ ] **Xuất báo cáo**: Export kết quả ra Excel/PDF
- [ ] **Giao diện**: Chế độ Dark/Light mode
- [ ] **Triển khai**: Deploy lên Vercel (client) + Railway (server)

---

## 📚 TÀI LIỆU THAM KHẢO

- [WebSocket API (MDN)](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket)
- [ws - Node.js WebSocket Library](https://github.com/websockets/ws)
- [Material UI Docs](https://mui.com/)
- [React Docs](https://react.dev/)
- [Node.js Docs](https://nodejs.org/en/docs)
- [Express.js Docs](https://expressjs.com/)
