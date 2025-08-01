import { useState, useEffect } from 'react';
import { 
  Box,
  Button,
  TextField,
  Typography,
  Container,
  Paper,
  Link,
  Divider
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import GoogleButton from './GoogleButton';
import API_BASE_URL from '../../config/api.js';

const LoginForm = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const navigate = useNavigate();

  useEffect(() => {
    // Перевіряємо чи є кука access_token
    const accessToken = document.cookie
      .split('; ')
      .find(row => row.startsWith('access_token='));
    
    if (accessToken) {
      // Якщо токен є — редірект на головну сторінку
      navigate('/');
    }
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

   const response = await fetch(API_BASE_URL + '/auth/default/login', {
      method: 'POST',
      body: JSON.stringify(formData),
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (response.ok) {
      // Успішний вхід
      console.log('Login successful');
      const data = await response.json();
      document.cookie = `access_token=${data.access_token}; path=/;`;
      navigate('/');
    } else {
      // Обробка помилки
      console.error('Login failed');
    }
  };

 const handleGoogleLogin = async () => {
  console.log("eoeok");
  
  try {
    const response = await fetch(API_BASE_URL + '/auth/login', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error('Помилка при спробі входу через Google');
    }
    
    console.log('Response:', response);
    const data = await response.json();
    sessionStorage.setItem('oidc_state', data.state);
    window.location.href = data.auth_url;
    
  } catch (error) {
    console.error('Login failed:', error);
  }
};

  return (
    <Container component="main" maxWidth="xs">
      <Paper elevation={3} sx={{ p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 8 }}>
        <Typography component="h1" variant="h5">
          Увійти
        </Typography>
        <Box sx={{ mt: 3, width: '100%' }}>
          <GoogleButton onClick={handleGoogleLogin} />
          <Box sx={{ display: 'flex', alignItems: 'center', my: 2 }}>
            <Divider sx={{ flex: 1 }} />
            <Typography variant="body2" sx={{ mx: 2, color: 'text.secondary' }}>
              або
            </Typography>
            <Divider sx={{ flex: 1 }} />
          </Box>
        </Box>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1, width: '100%' }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email"
            name="email"
            autoComplete="email"
            autoFocus
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
            autoComplete="current-password"
            value={formData.password}
            onChange={handleChange}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Увійти
          </Button>
          <Box sx={{ textAlign: 'center' }}>
            <Link
              component="span"
              variant="body2"
              onClick={() => navigate('/register')}
            >
              Немає акаунту? Зареєструватися
            </Link>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default LoginForm;
