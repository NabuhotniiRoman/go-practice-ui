import { useState } from 'react';
import { 
  Box,
  Button,
  TextField,
  Typography,
  Container,
  Paper,
  Link
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import API_BASE_URL from '../../config/api.js';

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
   const response = await fetch(API_BASE_URL + "/auth/register", {
      body: JSON.stringify({
        email: formData.email,
        name: formData.firstName + " " + formData.lastName,
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
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Paper
          elevation={3}
          sx={{
            padding: 4,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            width: "100%",
          }}
        >
          <Typography component="h1" variant="h4" gutterBottom>
            Sign Up
          </Typography>

          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{ mt: 1, width: "100%" }}
          >
            <TextField
              margin="normal"
              required
              fullWidth
              id="firstName"
              label="First Name"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
            />

            <TextField
              margin="normal"
              required
              fullWidth
              id="lastName"
              label="Last Name"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
            />

            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
            />

            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              value={formData.password}
              onChange={handleChange}
            />

            <TextField
              margin="normal"
              required
              fullWidth
              name="confirmPassword"
              label="Confirm Password"
              type="password"
              id="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign Up
            </Button>

            <Box sx={{ textAlign: "center" }}>
              <Link
                onClick={() => navigate("/login")}
                variant="body2"
                sx={{ cursor: "pointer" }}
              >
                Already have an account? Sign In
              </Link>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default RegisterForm;
