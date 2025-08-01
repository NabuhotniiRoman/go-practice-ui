import React, { useState, useRef, useEffect } from "react";
import {
  Box,
  Paper,
  Typography,
  TextField,
  IconButton,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";

const ChatMock = () => {
  const [messages, setMessages] = useState([
    { id: 1, text: "Привіт! Я чат для пошуку користувачів." },
  ]);
  const [input, setInput] = useState("");
  const listRef = useRef(null);

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages((prev) => [...prev, { id: Date.now(), text: input }]);
    setInput("");
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        width: "100%",      // Займає всю ширину батьківського контейнера
      }}
    >
      <Box
        ref={listRef}
        sx={{
          flexGrow: 1,
          overflowY: "auto",
          p: 1,
          bgcolor: "background.default",
        }}
      >
        <List dense>
          {messages.map((msg) => (
            <ListItem key={msg.id}>
              <ListItemText
                primary={
                  <Typography variant="body2" sx={{ whiteSpace: "pre-line" }}>
                    {msg.text}
                  </Typography>
                }
              />
            </ListItem>
          ))}
        </List>
      </Box>

      <Box
        sx={{
          display: "flex",
          p: 1,
          borderTop: "1px solid",
          borderColor: "divider",
        }}
      >
        <TextField
          size="small"
          variant="outlined"
          placeholder="Напиши повідомлення..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          fullWidth
        />
        <IconButton
          color="primary"
          onClick={handleSend}
          disabled={!input.trim()}
          sx={{ ml: 1 }}
        >
          <SendIcon />
        </IconButton>
      </Box>
    </Box>
  );
};

export default ChatMock;
