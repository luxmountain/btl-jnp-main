const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Create HTTP server and Socket.IO
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// In-memory data storage - 6 ngôn ngữ lập trình
let languages = [
  { id: 1, name: "JavaScript", votes: 0, color: "#F7DF1E", icon: "🟨" },  // JS vàng
  { id: 2, name: "Python", votes: 0, color: "#3776AB", icon: "🐍" },     // Python rắn xanh
  { id: 3, name: "Java", votes: 0, color: "#EA2D2E", icon: "☕" },       // Java đỏ lửa
  { id: 4, name: "C++", votes: 0, color: "#00599C", icon: "➕" },        // C++ xanh dương
  { id: 5, name: "Go", votes: 0, color: "#00ADD8", icon: "💨" },        // Go turbo
  { id: 6, name: "Rust", votes: 0, color: "#DE4C36", icon: "🦀" },      // Rust cua đỏ
  { id: 7, name: "PHP", votes: 0, color: "#777BB4", icon: "🐘" },       // PHP voi tím
  { id: 8, name: "Ruby", votes: 0, color: "#CC342D", icon: "💎" }       // Ruby viên ngọc
];

// Map để lưu vote của mỗi socket (1 user chỉ vote 1 lần)
let userVotes = new Map(); // socketId -> languageId

// Get all languages
app.get('/api/languages', (req, res) => {
  try {
    res.json(languages);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching languages', error: error.message });
  }
});

// Socket.IO connection
io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);

  // Send current data when user connects
  socket.emit('initialData', languages);

  // Vote for a language
  socket.on('vote', (languageId) => {
    try {
      // Check if user already voted
      const existingVote = userVotes.get(socket.id);
      if (existingVote) {
        socket.emit('error', { message: 'Bạn đã vote rồi!' });
        return;
      }

      // Find language
      const language = languages.find(l => l.id === languageId);
      if (!language) {
        socket.emit('error', { message: 'Ngôn ngữ không tồn tại!' });
        return;
      }

      // Record vote
      userVotes.set(socket.id, languageId);
      language.votes += 1;

      // Broadcast updated data to all clients
      io.emit('updateVotes', languages);

      console.log(`User ${socket.id} voted for ${language.name}`);
    } catch (error) {
      socket.emit('error', { message: 'Lỗi khi vote', error: error.message });
    }
  });

  // Unvote
  socket.on('unvote', () => {
    try {
      const languageId = userVotes.get(socket.id);

      if (!languageId) {
        socket.emit('error', { message: 'Bạn chưa vote!' });
        return;
      }

      // Find language and decrease vote
      const language = languages.find(l => l.id === languageId);
      if (language) {
        language.votes -= 1;
        if (language.votes < 0) language.votes = 0; // Safety check
      }

      // Remove vote record
      userVotes.delete(socket.id);

      // Broadcast updated data to all clients
      io.emit('updateVotes', languages);

      console.log(`User ${socket.id} unvoted`);
    } catch (error) {
      socket.emit('error', { message: 'Lỗi khi unvote', error: error.message });
    }
  });

  // Disconnect
  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});

// Get server IP address
const os = require('os');
function getLocalIPAddress() {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address;
      }
    }
  }
  return 'localhost';
}

server.listen(PORT, '0.0.0.0', () => {
  const ipAddress = getLocalIPAddress();
  console.log(`Server running on:`);
  console.log(`  - Local:   http://localhost:${PORT}`);
  console.log(`  - Network: http://${ipAddress}:${PORT}`);
  console.log(`\nOther devices can connect using: http://${ipAddress}:${PORT}`);
});
