import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import Verify from "./pages/Auth/Verify";
import Groups from "./pages/Groups";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import { getCurrentUser } from "./redux/actions/userAction";
import { isAuthenticated } from "./utils/isAuthenticated";
import GroupDetails from "./pages/Groups/GroupDetails";
import Invite from "./pages/Invite";
import GoogleLogin from "./pages/GoogleLogin";
import PermissionDeniedPage from "./pages/Error/403";
import Presentations from "./pages/Presentations";

function App() {
  const theme = createTheme({
    palette: {
      primary: {
        main: "#2a518f"
      },
      secondary: {
        main: "#3a4856"
      }
    }
  });

  const dispatch = useDispatch();

  const location = useLocation();

  useEffect(() => {
    if (
      !(
        location.pathname === "/login" ||
        location.pathname === "/register" ||
        location.pathname.startsWith("/verify") ||
        location.pathname.startsWith("/invite") ||
        location.pathname === "/google-login"
      )
    )
      dispatch(getCurrentUser());
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/login"
          element={isAuthenticated() ? <Navigate to="/" /> : <Login />}
        />
        <Route
          path="/register"
          element={isAuthenticated() ? <Navigate to="/" /> : <Register />}
        />
        <Route path="/verify/:token" element={<Verify />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/groups" element={<Groups />} />
        <Route path="/group/:id" element={<GroupDetails />} />
        <Route path="/presentations" element={<Presentations />} />
        <Route path="/invite/:groupId" element={<Invite />} />
        <Route path="/google-login" element={<GoogleLogin />} />
        <Route path="/403" element={<PermissionDeniedPage />} />
        <Route path="/*" element={<Navigate to="/" />} />
      </Routes>
    </ThemeProvider>
  );
}

export default App;
