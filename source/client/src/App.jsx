import { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Button,
  Grid,
  LinearProgress,
  Chip,
  Paper,
  Snackbar,
  Alert,
} from "@mui/material";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";

const getServerURL = () => {
  const currentHost = window.location.hostname;
  const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
  
  if (currentHost !== 'localhost' && currentHost !== '127.0.0.1') {
    return `${protocol}//${currentHost}:5000`;
  }
  return "ws://localhost:5000";
};

const SERVER_URL = getServerURL();

function App() {
  const [socket, setSocket] = useState(null);
  const [languages, setLanguages] = useState([]);
  const [myVote, setMyVote] = useState(null);
  const [totalVotes, setTotalVotes] = useState(0);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  useEffect(() => {
    // Tạo WebSocket connection
    const ws = new WebSocket(SERVER_URL);

    ws.onopen = () => {
      console.log('WebSocket connected');
    };

    ws.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        const { type, data } = message;

        switch (type) {
          case 'initialData':
            setLanguages(data);
            setTotalVotes(data.reduce((sum, l) => sum + l.votes, 0));
            break;
          
          case 'updateVotes':
            setLanguages(data);
            setTotalVotes(data.reduce((sum, l) => sum + l.votes, 0));
            break;
          
          case 'error':
            setSnackbar({ open: true, message: data.message, severity: "error" });
            break;
          
          default:
            console.warn('Unknown message type:', type);
        }
      } catch (error) {
        console.error('Error parsing message:', error);
      }
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      setSnackbar({ open: true, message: "Lỗi kết nối WebSocket", severity: "error" });
    };

    ws.onclose = () => {
      console.log('WebSocket disconnected');
    };

    setSocket(ws);

    // Cleanup khi component unmount
    return () => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.close();
      }
    };
  }, []);

  const handleVote = (id) => {
    if (socket && socket.readyState === WebSocket.OPEN && !myVote) {
      socket.send(JSON.stringify({
        type: 'vote',
        data: id
      }));
      setMyVote(id);
      const lang = languages.find((l) => l.id === id);
      setSnackbar({
        open: true,
        message: `Bạn đã vote cho ${lang.name}!`,
        severity: "success",
      });
    }
  };

  const handleUnvote = () => {
    if (socket && socket.readyState === WebSocket.OPEN && myVote) {
      socket.send(JSON.stringify({
        type: 'unvote'
      }));
      setMyVote(null);
      setSnackbar({ open: true, message: "Đã hủy vote!", severity: "info" });
    }
  };

  const getPercent = (votes) => {
    if (totalVotes === 0) return 0;
    return ((votes / totalVotes) * 100).toFixed(1);
  };

  return (
    <Box sx={{ overflow: "auto", py: 6, background: "#fff" }}>
      <Container maxWidth="lg">
        {/* HEADER */}
        <Paper
          elevation={6}
          sx={{
            p: 4,
            mb: 5,
            textAlign: "center",
            borderRadius: 4,
            background: "#f7f9fc",
            boxShadow: "0 8px 20px rgba(0, 0, 0, 0.21)",
          }}
        >
          <Typography
            variant="h3"
            fontWeight="900"
            sx={{ letterSpacing: 1, color: "#1e3c72" }}
          >
            🚀 REALTIME CODER VOTE
          </Typography>
          <Typography variant="h6" sx={{ color: "#333", opacity: 0.8 }}>
            Hãy chọn ngôn ngữ bạn yêu thích nhất!
          </Typography>

          <Box sx={{ mt: 3 }}>
            <Chip
              label={`Tổng số vote: ${totalVotes}`}
              color="primary"
              size="large"
              sx={{ fontSize: "1.1rem", px: 2 }}
            />
            {myVote && (
              <Chip
                label={`Bạn đã vote: ${
                  languages.find((l) => l.id === myVote)?.name
                }`}
                color="success"
                size="large"
                onDelete={handleUnvote}
                deleteIcon={<ThumbDownIcon />}
                sx={{ ml: 2, fontSize: "1.1rem", px: 2 }}
              />
            )}
          </Box>
        </Paper>

        {/* LIST */}
        <Grid container spacing={4} justifyContent="center">
          {languages.map((lang) => {
            const percent = getPercent(lang.votes);
            const isMine = myVote === lang.id;

            return (
              <Grid item xs={12} sm={6} md={4} key={lang.id}>
                <Card
                  sx={{
                    height: "100%",
                    transition: "0.3s",
                    borderRadius: 3,
                    background: "white",
                    border: isMine
                      ? `3px solid ${lang.color}`
                      : "1px solid #e5e7eb",
                    boxShadow: isMine
                      ? "0 6px 25px rgba(0,0,0,0.2)"
                      : "0 4px 15px rgba(0,0,0,0.08)",
                    transform: isMine ? "scale(1.05)" : "scale(1)",
                    "&:hover": {
                      transform: isMine ? "scale(1.06)" : "scale(1.03)",
                    },
                  }}
                >
                  <CardContent>
                    <Typography variant="h2" align="center">
                      {lang.icon}
                    </Typography>
                    <Typography
                      variant="h5"
                      align="center"
                      fontWeight="bold"
                      sx={{ color: "#222" }}
                    >
                      {lang.name}
                    </Typography>

                    <Box sx={{ mt: 2 }}>
                      <LinearProgress
                        variant="determinate"
                        value={parseFloat(percent)}
                        sx={{
                          height: 12,
                          borderRadius: 5,
                          background: "#e0e0e0",
                          "& .MuiLinearProgress-bar": {
                            backgroundColor: lang.color,
                          },
                        }}
                      />
                      <Typography
                        variant="body2"
                        align="right"
                        sx={{ mt: 1, fontWeight: 600, color: "#444" }}
                      >
                        {percent}% • {lang.votes} votes
                      </Typography>
                    </Box>

                    <Button
                      fullWidth
                      sx={{
                        mt: 2,
                        py: 1.2,
                        fontWeight: 900,
                        borderRadius: 2,
                        fontSize: "1rem",
                      }}
                      variant={isMine ? "contained" : "outlined"}
                      color={isMine ? "success" : "primary"}
                      startIcon={isMine ? <ThumbDownIcon /> : <ThumbUpIcon />}
                      onClick={() =>
                        isMine ? handleUnvote() : handleVote(lang.id)
                      }
                      disabled={myVote && !isMine}
                    >
                      {isMine ? "Bỏ vote" : "Vote ngay ✅"}
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      </Container>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={2500}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity} sx={{ fontSize: "1rem" }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default App;
