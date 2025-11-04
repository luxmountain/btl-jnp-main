const express = require('express');
const cors = require('cors');
const http = require('http');
const WebSocket = require('ws');
require('dotenv').config();

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// Create HTTP server and WebSocket server
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

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

// Map để lưu vote của mỗi client (1 user chỉ vote 1 lần)
let userVotes = new Map(); // clientId -> languageId
let clientIdCounter = 0;

// Helper function để broadcast tới tất cả clients
function broadcastToAll(data) {
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(data));
    }
  });
}

// Get all languages
app.get('/api/languages', (req, res) => {
  try {
    res.json(languages);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching languages', error: error.message });
  }
});

// WebSocket connection
wss.on('connection', (ws) => {
  // Gán ID duy nhất cho mỗi client
  const clientId = ++clientIdCounter;
  ws.clientId = clientId;
  
  console.log(`User connected: ${clientId}`);

  // Send initial data khi user kết nối
  ws.send(JSON.stringify({
    type: 'initialData',
    data: languages
  }));

  // Nhận message từ client
  ws.on('message', (message) => {
    try {
      const parsed = JSON.parse(message);
      const { type, data } = parsed;

      switch (type) {
        case 'vote':
          handleVote(ws, data);
          break;
        case 'unvote':
          handleUnvote(ws);
          break;
        default:
          ws.send(JSON.stringify({
            type: 'error',
            data: { message: 'Unknown message type' }
          }));
      }
    } catch (error) {
      ws.send(JSON.stringify({
        type: 'error',
        data: { message: 'Invalid message format' }
      }));
    }
  });

  // Handle vote
  function handleVote(ws, languageId) {
    try {
      // Check if user already voted
      const existingVote = userVotes.get(ws.clientId);
      if (existingVote) {
        ws.send(JSON.stringify({
          type: 'error',
          data: { message: 'Bạn đã vote rồi!' }
        }));
        return;
      }

      // Find language
      const language = languages.find(l => l.id === languageId);
      if (!language) {
        ws.send(JSON.stringify({
          type: 'error',
          data: { message: 'Ngôn ngữ không tồn tại!' }
        }));
        return;
      }

      // Record vote
      userVotes.set(ws.clientId, languageId);
      language.votes += 1;

      // Broadcast updated data to all clients
      broadcastToAll({
        type: 'updateVotes',
        data: languages
      });

      console.log(`User ${ws.clientId} voted for ${language.name}`);
    } catch (error) {
      ws.send(JSON.stringify({
        type: 'error',
        data: { message: 'Lỗi khi vote', error: error.message }
      }));
    }
  }

  // Handle unvote
  function handleUnvote(ws) {
    try {
      const languageId = userVotes.get(ws.clientId);

      if (!languageId) {
        ws.send(JSON.stringify({
          type: 'error',
          data: { message: 'Bạn chưa vote!' }
        }));
        return;
      }

      // Find language and decrease vote
      const language = languages.find(l => l.id === languageId);
      if (language) {
        language.votes -= 1;
        if (language.votes < 0) language.votes = 0; // Safety check
      }

      // Remove vote record
      userVotes.delete(ws.clientId);

      // Broadcast updated data to all clients
      broadcastToAll({
        type: 'updateVotes',
        data: languages
      });

      console.log(`User ${ws.clientId} unvoted`);
    } catch (error) {
      ws.send(JSON.stringify({
        type: 'error',
        data: { message: 'Lỗi khi unvote', error: error.message }
      }));
    }
  }

  // Handle disconnect
  ws.on('close', () => {
    console.log(`User disconnected: ${ws.clientId}`);
    // Optional: Auto unvote when disconnect
    // handleUnvote(ws);
  });

  ws.on('error', (error) => {
    console.error(`WebSocket error for client ${ws.clientId}:`, error);
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
