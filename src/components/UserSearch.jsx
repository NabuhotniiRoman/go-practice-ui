import React, { useState, useRef } from "react";
import {
  Box,
  TextField,
  Avatar,
  CircularProgress,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Popper,
  Paper,
  ClickAwayListener,
  Typography,
  IconButton,
  Tooltip,
} from "@mui/material";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import PersonRemoveIcon from "@mui/icons-material/PersonRemove";
import MessageIcon from "@mui/icons-material/Message";
import { useNavigate } from "react-router-dom";

import fetchWithRefresh from "../authFetch.js";

const UserSearch = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [hoveredUserId, setHoveredUserId] = useState(null);
  const anchorRef = useRef(null);
  const navigate = useNavigate();

  const handleSearch = async (e) => {
    const value = e.target.value;
    setQuery(value);

    if (value.length < 2) {
      setResults([]);
      setOpen(false);
      return;
    }

    setLoading(true);
    try {
      const res = await fetchWithRefresh("api/v1/users/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_name: value }),
      });

      if (res.ok) {
        const data = await res.json();
          setResults(data.data);
          setOpen(true);
      } else {
        setResults([]);
        setOpen(false);
      }
    } catch (error) {
      console.error("Search error:", error);
      setResults([]);
      setOpen(false);
    } finally {
      setLoading(false);
    }
  };

  const handleClickAway = () => setOpen(false);

  const handleAddFriend = (user) => alert(`Додати у друзі: ${user.name}`);
  const handleRemoveFriend = (user) => alert(`Видалити з друзів: ${user.name}`);
  const handleSendMessage = (user) =>
    alert(`Написати повідомлення: ${user.name}`);

  return (
    <ClickAwayListener onClickAway={handleClickAway}>
      <Box sx={{ position: "relative" }}>
        <TextField
          size="small"
          placeholder="Пошук користувача..."
          variant="outlined"
          inputRef={anchorRef}
          value={query}
          onChange={handleSearch}
          sx={{
            backgroundColor: "white",
            borderRadius: 1,
            minWidth: 300,
            boxShadow: 1,
          }}
        />

        <Popper
          open={open}
          anchorEl={anchorRef.current}
          placement="bottom-start"
          sx={{ zIndex: 1300 }}
        >
          <Paper sx={{ mt: 1, width: 360, maxHeight: 400, overflowY: "auto" }}>
            {loading ? (
              <Box sx={{ p: 2, textAlign: "center" }}>
                <CircularProgress size={24} />
              </Box>
            ) : results.length > 0 ? (
              <List dense>
                {results.map((user) => (
                  <ListItem
                    key={user.id}
                    divider
                    button
                    onClick={() => navigate(`/user/${user.id}`)}
                    onMouseEnter={() => setHoveredUserId(user.id)}
                    onMouseLeave={() => setHoveredUserId(null)}
                    sx={{
                      position: "relative",
                      px: 2,
                      py: 1.5,
                      display: "flex",
                      alignItems: "center",
                      minHeight: 60,
                    }}
                  >
                    {/* Статус у правому верхньому куті */}
                    <Box
                      sx={{
                        position: "absolute",
                        top: 8,
                        right: 8,
                        fontSize: 12,
                        fontWeight: "bold",
                        color: user.is_active ? "green" : "gray",
                        userSelect: "none",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {user.is_active ? "🟢 Активний" : "🔴 Неактивний"}
                    </Box>

                    {/* Аватар + текст */}
                    <Box
                      sx={{
                        flexGrow: 1,
                        display: "flex",
                        alignItems: "center",
                        minWidth: 0,
                        pr: 6,
                      }}
                    >
                      <ListItemAvatar>
                        <Avatar src={`https://i.pravatar.cc/40?u=${user.id}`} />
                      </ListItemAvatar>

                      <ListItemText
                        primary={
                          <Typography
                            component="span"
                            noWrap
                            sx={{ fontWeight: 600, maxWidth: 200 }}
                          >
                            {user.name}
                          </Typography>
                        }
                        secondary={
                          <>
                            <Typography
                              component="div"
                              variant="body2"
                              color="text.primary"
                              noWrap
                              sx={{ maxWidth: 280 }}
                            >
                              📧 {user.email}
                            </Typography>
                            <Typography
                              component="div"
                              variant="caption"
                              color="text.secondary"
                            >
                              🕒 Створено:{" "}
                              {new Date(user.created_at).toLocaleString(
                                "uk-UA"
                              )}
                            </Typography>
                          </>
                        }
                      />
                    </Box>

                    {/* Кнопки справа */}
                    <Box
                      sx={{
                        position: "absolute",
                        right: 8,
                        top: "50%",
                        transform: "translateY(-50%)",
                        display: hoveredUserId === user.id ? "flex" : "none",
                        gap: 1,
                      }}
                    >
                      <Tooltip title="Додати у друзі">
                        <IconButton
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAddFriend(user);
                          }}
                        >
                          <PersonAddIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>

                      <Tooltip title="Видалити з друзів">
                        <IconButton
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveFriend(user);
                          }}
                        >
                          <PersonRemoveIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>

                      <Tooltip title="Написати повідомлення">
                        <IconButton
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSendMessage(user);
                          }}
                        >
                          <MessageIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </ListItem>
                ))}
              </List>
            ) : (
              <Box sx={{ p: 2, textAlign: "center" }}>Нічого не знайдено</Box>
            )}
          </Paper>
        </Popper>
      </Box>
    </ClickAwayListener>
  );
};

export default UserSearch;
