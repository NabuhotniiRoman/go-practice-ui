import React, { useState } from "react";
import { Typography, Box, Paper, Collapse } from "@mui/material";
import ChatMock from "./ChatMock";
import FriendsList from "./FriendsList";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";

const friendsData = [
  {
    id: 1,
    name: "Олег",
    avatar: "https://i.pravatar.cc/40?img=1",
    online: true,
  },
  {
    id: 2,
    name: "Марія",
    avatar: "https://i.pravatar.cc/40?img=2",
    online: false,
  },
  {
    id: 3,
    name: "Іван",
    avatar: "https://i.pravatar.cc/40?img=3",
    online: true,
  },
  {
    id: 4,
    name: "Світлана",
    avatar: "https://i.pravatar.cc/40?img=4",
    online: false,
  },
  {
    id: 5,
    name: "Петро",
    avatar: "https://i.pravatar.cc/40?img=5",
    online: true,
  },
  // додай ще, якщо потрібно
];

const MainPage = () => {
  const [friendsOpen] = useState(true); // для прикладу, якщо потрібна кнопка ховати друзів
  const [chatOpen] = useState(true);

  return (
    <>
      <Navbar />
      <Box
        sx={{
          display: "flex",
          height: "100vh",
          width: "100vw",
          pt: "64px",
          boxSizing: "border-box",
          position: "relative",
        }}
      >
        {/* Список друзів зліва */}
        <Collapse in={friendsOpen} orientation="horizontal" collapsedSize={40}>
          <Box
            sx={{
              height: "calc(100vh - 64px - 8px)",
              borderRight: "1px solid #ccc",
              boxSizing: "border-box",
              overflowY: "auto",
              width: 280,
            }}
          >
            <FriendsList friends={friendsData} />
          </Box>
        </Collapse>

        {/* Чат посередині */}
        <Collapse in={chatOpen} orientation="horizontal" collapsedSize={40}>
          <Box
            sx={{
              width: 320,
              height: "calc(100vh - 64px)",
              borderRight: "1px solid #ccc",
              display: "flex",
              flexDirection: "column",
              boxSizing: "border-box",
              transition: "width 0.3s ease",
            }}
          >
            <Paper
              elevation={3}
              sx={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                p: 2,
                overflowY: "auto",
                width: "100%",
              }}
            >
              <Typography variant="h6" gutterBottom>
                Чат
              </Typography>
              <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
                <ChatMock />
              </Box>
            </Paper>
          </Box>
        </Collapse>

        {/* Основний контент справа */}
        <Box sx={{ flex: 1, overflowY: "auto" }}>
          <Outlet />
        </Box>
      </Box>
    </>
  );
};

export default MainPage;
