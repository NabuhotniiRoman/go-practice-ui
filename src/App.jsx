import { ThemeProvider, createTheme } from "@mui/material";
import LoginForm from "./components/AuthForms/LoginForm";
import RegisterForm from "./components/AuthForms/RegisterForm";
import MainPage from "./components/MainPage";
import PrivateRoute from "./components/PrivateRoute";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { useEffect } from "react";
import UserProfile from "./components/UserProfile";
import "./App.css";

const theme = createTheme({
  palette: {
    primary: {
      main: "#1976d2",
    },
  },
});

function AppWrapper() {
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const accessToken = params.get("access_token");
    const refreshToken = params.get("refresh_token");

    console.log("Access Token from URL:", accessToken);
    console.log("Refresh Token from URL:", refreshToken);

    if (accessToken) {
      document.cookie = `access_token=${accessToken}; path=/;`;
    }

    if (refreshToken) {
      document.cookie = `refresh_token=${refreshToken}; path=/;`;
    }

    if (accessToken || refreshToken) {
      window.history.replaceState({}, document.title, "/");
    }
  }, [location]);

  return (
    <ThemeProvider theme={theme}>
      <Routes>
        <Route path="/login" element={<LoginForm />} />
        <Route path="/register" element={<RegisterForm />} />

        <Route
          path="/"
          element={
            <PrivateRoute>
              <MainPage />
            </PrivateRoute>
          }
        >
          <Route path="user/:id" element={<UserProfile />} />
        </Route>

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </ThemeProvider>
  );
}

// Щоб `useLocation()` працював — потрібно загорнути в `BrowserRouter` вище
function App() {
  return (
    <BrowserRouter>
      <AppWrapper />
    </BrowserRouter>
  );
}

export default App;
