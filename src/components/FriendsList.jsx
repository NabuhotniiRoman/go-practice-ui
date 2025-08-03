import React, { useState, useEffect } from "react";
import {
  Box,
  Avatar,
  Typography,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Badge,
  Divider,
  IconButton,
  CircularProgress,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import fetchWithRefresh from "../authFetch";
import { useNavigate } from "react-router-dom";

const FriendsList = () => {
  const [open, setOpen] = useState(true);
  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFriends = async () => {
      setLoading(true);
      try {
        const res = await fetchWithRefresh("/api/v1/friends");
        if (res.ok) {
          const data = await res.json();
          if (data?.data){
            setFriends(data.data);
          } else {
            setFriends(Array.isArray(data) ? data : []);
          }
        } else {
          console.error("Помилка при отриманні друзів:", await res.text());
        }
      } catch (err) {
        console.error("Помилка при завантаженні користувачів:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchFriends();
  }, []);

  return (
    <>
      {/* Кнопка переключення */}
      <IconButton
        onClick={() => setOpen(!open)}
        aria-label={open ? "Закрити друзів" : "Відкрити друзів"}
        sx={{
          position: "fixed",
          top: 80,
          left: open ? 320 : 0,
          zIndex: 1500,
          backgroundColor: "rgba(25, 118, 210, 0.85)",
          color: "#fff",
          borderRadius: "0 8px 8px 0",
          boxShadow: "0 0 8px rgba(25, 118, 210, 0.7)",
          transition: "left 0.3s ease",
          "&:hover": {
            backgroundColor: "rgba(25, 118, 210, 1)",
            boxShadow: "0 0 12px rgba(25, 118, 210, 1)",
          },
        }}
      >
        {open ? <ChevronLeftIcon /> : <MenuIcon />}
      </IconButton>

      {/* Панель друзів */}
      <Box
        sx={{
          position: "fixed",
          top: 64,
          left: 0,
          width: 320,
          height: "calc(100vh - 64px)",
          borderRight: "1px solid #444",
          backgroundColor: "#121212",
          boxSizing: "border-box",
          padding: 2,
          overflowY: "auto",
          transform: open ? "translateX(0)" : "translateX(-100%)",
          transition: "transform 0.3s ease",
          zIndex: 1400,
        }}
      >
        <Box
          sx={{
            mb: 2,
            textAlign: "center",
            cursor: "default",
            color: "#eee",
          }}
        >
          <Typography
            variant="h5"
            sx={{
              fontWeight: "700",
              letterSpacing: 1.2,
              userSelect: "none",
              marginBottom: 1,
            }}
          >
            Друзі
          </Typography>
          <Divider sx={{ backgroundColor: "#90caf9", height: 3, borderRadius: 2 }} />
        </Box>

        {loading ? (
          <Box sx={{ textAlign: "center", mt: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <List>
            {friends.map(({ id, name, is_active }) => (
              <ListItem
                key={id}
                divider
                sx={{
                  transition: "background-color 0.3s ease",
                  borderRadius: 1,
                  cursor: "pointer",
                  "&:hover": { backgroundColor: "#263238" },
                }}
                onClick={() => navigate(`/user/${id}`)} // Ось тут додаємо навігацію при кліку
              >
                <ListItemAvatar>
                  <Badge
                    overlap="circular"
                    variant="dot"
                    color={is_active ? "success" : "default"}
                    anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                  >
                    <Avatar src={`https://i.pravatar.cc/40?u=${id}`} alt={name} />
                  </Badge>
                </ListItemAvatar>
                <ListItemText
                  primary={name}
                  secondary={is_active ? "Онлайн" : "Офлайн"}
                  secondaryTypographyProps={{
                    color: is_active ? "#81c784" : "#ef5350",
                    fontWeight: 600,
                  }}
                  primaryTypographyProps={{ fontWeight: 600, color: "#eee" }}
                />
              </ListItem>
            ))}
          </List>
        )}
      </Box>
    </>
  );
};

export default FriendsList;
