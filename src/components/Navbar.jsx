import React, { useEffect, useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Avatar,
  IconButton,
  Menu,
  MenuItem,
  Box,
  Modal,
  Paper,
  TextField,
  Button,
  CircularProgress,
} from "@mui/material";
import UserSearch from "./UserSearch";
import fetchWithRefresh from "../authFetch.js"; // Функція для автоматичного оновлення токена
import MoreVertIcon from "@mui/icons-material/MoreVert";

const Navbar = () => {
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [settingsModalOpen, setSettingsModalOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [saving, setSaving] = useState(false);

  // Для форми налаштувань
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    picture: "",
  });

  const menuOpen = Boolean(menuAnchorEl);

  useEffect(() => {
    async function fetchUserInfo() {
      try {
        const response = await fetchWithRefresh("/auth/userinfo");
        if (!response.ok) throw new Error("Failed to fetch user info");
        const data = await response.json();
        setUser(data);
      } catch (err) {
        console.error(err);
      }
    }
    fetchUserInfo();
  }, []);

  // Відкриття модалки профілю
  const handleAvatarClick = () => {
    setProfileModalOpen(true);
  };

  // Закриття профілю
  const handleProfileModalClose = () => {
    setProfileModalOpen(false);
  };

  // Відкриття модалки налаштувань
  const handleSettingsOpen = () => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        picture: user.picture || "",
      });
    }
    setSettingsModalOpen(true);
    setMenuAnchorEl(null);
  };

  // Закриття модалки налаштувань
  const handleSettingsClose = () => {
    setSettingsModalOpen(false);
  };

  // Закриття меню
  const handleMenuClose = () => {
    setMenuAnchorEl(null);
  };

  // Відкриття меню
  const handleMenuClick = (event) => {
    setMenuAnchorEl(event.currentTarget);
  };

  // Вихід
  const exit = () => {
    document.cookie = "access_token=; Max-Age=0; path=/;";
    sessionStorage.clear();
    window.location.href = "/login";
  };

  // Обробник зміни полів форми
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Збереження змін у налаштуваннях
  const handleSaveSettings = async () => {
    setSaving(true);
    try {
      // Приклад запиту оновлення даних
      const response = await fetchWithRefresh("/auth/userinfo/update", {
        method: "POST", // або PUT залежно від API
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Failed to update user info");

      const updatedUser = await response.json();
      setUser(updatedUser);
      setSettingsModalOpen(false);
    } catch (error) {
      console.error("Error updating user info:", error);
      alert("Не вдалося зберегти зміни");
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <AppBar position="fixed" elevation={1} sx={{ backgroundColor: "#1976d2" }}>
        <Toolbar sx={{ display: "flex", alignItems: "center" }}>
          <Typography variant="h6" sx={{ fontWeight: "bold", minWidth: 100 }}>
            NBHTN
          </Typography>

          <Box
            sx={{
              ml: 3,
              width: 300,
              maxWidth: "40vw",
            }}
          >
            <UserSearch />
          </Box>

          <Box sx={{ flexGrow: 1 }} />

          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <IconButton onClick={handleAvatarClick}>
              <Avatar alt={user?.name || "User"} src={user?.picture || "https://i.pravatar.cc/40"} />
            </IconButton>

            <Typography noWrap sx={{ maxWidth: 120 }}>
              {user?.name || "..."}
            </Typography>

            <IconButton onClick={handleMenuClick} color="inherit">
              <MoreVertIcon />
            </IconButton>

            <Menu
              anchorEl={menuAnchorEl}
              open={menuOpen}
              onClose={handleMenuClose}
              anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
              transformOrigin={{ vertical: "top", horizontal: "right" }}
            >
              <MenuItem onClick={() => { handleMenuClose(); setProfileModalOpen(true); }}>Профіль</MenuItem>
              <MenuItem onClick={handleSettingsOpen}>Налаштування</MenuItem>
              <MenuItem onClick={exit}>Вийти</MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Modal — профіль */}
      <Modal open={profileModalOpen} onClose={handleProfileModalClose}>
        <Paper
          elevation={3}
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 320,
            p: 4,
            borderRadius: 2,
            outline: "none",
          }}
        >
          {user ? (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Avatar
                src={user.picture ? user.picture : "https://i.pravatar.cc/100"}
                sx={{ width: 80, height: 80, mb: 2 }}
              />
              <Typography variant="h6" gutterBottom>{user.name}</Typography>
              <Typography variant="body2" color="text.secondary">{user.email}</Typography>
              <Typography variant="body2" color="text.secondary" mt={1}>
                ID: {user.sub}
              </Typography>
            </Box>
          ) : (
            <Typography>Завантаження...</Typography>
          )}
        </Paper>
      </Modal>

      {/* Modal — налаштування */}
      <Modal open={settingsModalOpen} onClose={handleSettingsClose}>
        <Paper
          elevation={3}
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 360,
            p: 4,
            borderRadius: 2,
            outline: "none",
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          <Typography variant="h6" mb={1}>Налаштування профілю</Typography>

          <TextField
            label="Ім'я"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            fullWidth
          />

          <TextField
            label="Email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            fullWidth
          />

          <TextField
            label="URL фото"
            name="picture"
            value={formData.picture}
            onChange={handleInputChange}
            fullWidth
          />

          <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1 }}>
            <Button variant="outlined" onClick={handleSettingsClose} disabled={saving}>
              Відмінити
            </Button>

            <Button
              variant="contained"
              onClick={handleSaveSettings}
              disabled={saving}
            >
              {saving ? <CircularProgress size={24} color="inherit" /> : "Зберегти"}
            </Button>
          </Box>
        </Paper>
      </Modal>
    </>
  );
};

export default Navbar;
