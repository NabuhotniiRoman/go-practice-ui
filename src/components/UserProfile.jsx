import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Typography,
  Box,
  Avatar,
  CircularProgress,
  IconButton,
  Paper,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import fetchWithRefresh from "../authFetch";

const UserProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetchWithRefresh(`/api/v1/users/${id}`);
        if (res.ok) {
          const data = await res.json();
          setUser(data);
        } else {
          console.error("Помилка завантаження:", await res.text());
        }
      } catch (e) {
        console.error("Error fetching user:", e);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id]);

  if (loading) {
    return (
      <Box
        sx={{
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!user) {
    return (
      <Box
        sx={{
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Typography>Користувача не знайдено</Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#f5f5f5",
      }}
    >
      <Paper
        elevation={4}
        sx={{
          position: "relative",
          width: "100%",
          maxWidth: 420,
          padding: 3,
          borderRadius: 4,
        }}
      >
        {/* Хрестик для закриття */}
        <IconButton
          onClick={() => navigate("/")}
          sx={{ position: "absolute", top: 10, right: 10 }}
        >
          <CloseIcon />
        </IconButton>

        {/* Дані користувача */}
        <Box sx={{ textAlign: "center", mb: 2 }}>
          <Avatar
            src={`https://i.pravatar.cc/100?u=${user.id}`}
            sx={{ width: 80, height: 80, margin: "0 auto" }}
          />
          <Typography variant="h6" sx={{ mt: 1 }}>
            👤 {user.name}
          </Typography>
        </Box>

        <Box sx={{ pl: 1 }}>
          <Typography sx={{ mb: 1 }}>📧 {user.email}</Typography>
          <Typography sx={{ mb: 1 }}>
            🕒 Створено: {new Date(user.created_at).toLocaleString("uk-UA")}
          </Typography>
          <Typography>
            📶 Статус:{" "}
            <b style={{ color: user.is_active ? "green" : "gray" }}>
              {user.is_active ? "Активний" : "Неактивний"}
            </b>
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
};

export default UserProfile;
