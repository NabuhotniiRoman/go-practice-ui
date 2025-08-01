import { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Container,
  Paper,
  Link,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
   const response = await fetch("/auth/register", {
      body: JSON.stringify({
        email: formData.email,
        name: formData.name,
        password: formData.password,
      }),
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.status === 201) {
      // Успішна реєстрація — редіректимо на логін
      console.log("✅ Реєстрація успішна, переходимо на логін...");
      window.location.href = "/login";
    } else {
      const data = await response.json();
      console.error("❌ Помилка реєстрації:", data);
      alert(data.error || "Registration failed");
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Paper
        elevation={3}
        sx={{
          p: 4,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          mt: 8,
        }}
      >
        <Typography component="h1" variant="h5">
          Реєстрація
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
          <Box sx={{ display: "flex", gap: 2 }}>

            <TextField
              required
              fullWidth
              id="name"
              label="Ім'я"
              name="name"
              autoComplete="given-name"
              value={formData.name}
              onChange={handleChange}
            />
          </Box>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email"
            name="email"
            autoComplete="email"
            value={formData.email}
            onChange={handleChange}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Пароль"
            type="password"
            id="password"
            autoComplete="new-password"
            value={formData.password}
            onChange={handleChange}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="confirmPassword"
            label="Підтвердження паролю"
            type="password"
            id="confirmPassword"
            autoComplete="new-password"
            value={formData.confirmPassword}
            onChange={handleChange}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Зареєструватися
          </Button>
          <Box sx={{ textAlign: "center" }}>
            <Link component="button" variant="body2" onClick={() => navigate('/login')}>
              Вже маєте акаунт? Увійти
            </Link>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default RegisterForm;
