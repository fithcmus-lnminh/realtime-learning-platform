import React, { useEffect, useState } from "react";
import { Alert, Box, Button, Snackbar, Typography } from "@mui/material";
import { useDispatch } from "react-redux";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { notificationSocket } from "./utils/socket";
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
import PresentationTeacher from "./pages/PresentationTeacher";
import PresentPresentation from "./pages/PresentPresentation";
import PresentationJoin from "./pages/Presentations/PresentationJoin";
import PresentationPlay from "./pages/Presentations/PresentationPlay";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import VerifyCollaborator from "./pages/VerifyCollaborator";

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

  const [presentationInfo, setPresentationInfo] = useState({});
  const [message, setMessage] = useState({
    data: "",
    open: false
  });

  const handleCloseAlert = () => {
    setMessage({
      data: "",
      open: false
    });
  };

  useEffect(() => {
    if (
      !(
        location.pathname === "/login" ||
        location.pathname === "/register" ||
        location.pathname.startsWith("/verify") ||
        location.pathname.startsWith("/invite") ||
        location.pathname.startsWith("/play") ||
        location.pathname.startsWith("/forgot-password") ||
        location.pathname.startsWith("/reset-password") ||
        location.pathname.startsWith("/collaborator") ||
        location.pathname === "/google-login"
      )
    ) {
      dispatch(getCurrentUser());

      notificationSocket.on("new-notification", (notification) => {
        console.log("notification:", notification);
        const { message: messageTitle, data } = notification;

        setMessage({
          data: messageTitle,
          open: true
        });

        if (data.type === "presentation") {
          setPresentationInfo(data);
        }
      });
    }
    return () => {
      notificationSocket.off("new-notification");
    };
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
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/collaborator/:token" element={<VerifyCollaborator />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/groups" element={<Groups />} />
        <Route path="/group/:id" element={<GroupDetails />} />
        <Route path="/presentations" element={<Presentations />} />
        <Route path="/play" element={<PresentationJoin />} />
        <Route path="/play/:code" element={<PresentationPlay />} />
        <Route path="/invite/:groupId" element={<Invite />} />
        <Route path="/google-login" element={<GoogleLogin />} />
        <Route path="/presentation/:id" element={<PresentationTeacher />} />
        <Route
          path="/presentation/:id/present"
          element={<PresentPresentation />}
        />
        <Route path="/403" element={<PermissionDeniedPage />} />
        <Route path="/*" element={<Navigate to="/" />} />
      </Routes>

      <Snackbar
        open={message.open}
        autoHideDuration={5000}
        onClose={handleCloseAlert}
      >
        <Alert
          variant="filled"
          onClose={handleCloseAlert}
          severity="info"
          sx={{ width: "100%", display: "flex", alignItems: "center" }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: "12px"
            }}
          >
            <Typography variant="body2">
              {message.data}. Do you want to join?
            </Typography>
            <Button
              size="small"
              sx={{
                width: "100px",
                backgroundColor: "#fff",
                "&:hover": {
                  backgroundColor: "#fff"
                }
              }}
              onClick={() => {
                if (presentationInfo.presentation_id) {
                  handleCloseAlert();
                  window.location.href = `/play/${presentationInfo.access_code}`;
                }
              }}
            >
              Join now
            </Button>
          </Box>
        </Alert>
      </Snackbar>
    </ThemeProvider>
  );
}

export default App;
