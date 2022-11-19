import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import Verify from "./pages/Auth/Verify";
import Groups from "./pages/Groups";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import { getCurrentUser } from "./redux/actions/userAction";
import { isAuthenticated } from "./utils/isAuthenticated";

function App() {
  const dispatch = useDispatch();

  const location = useLocation();

  useEffect(() => {
    if (
      !(
        location.pathname === "/login" ||
        location.pathname === "/register" ||
        location.pathname.startsWith("/verify")
      )
    )
      dispatch(getCurrentUser());
  }, []);

  return (
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
    </Routes>
  );
}

export default App;
