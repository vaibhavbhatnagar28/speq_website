import React, { useState, useEffect } from "react";
import { Routes, Route, Link, useNavigate } from "react-router-dom";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "./firebase";
import Login from "./02_Login";
import GroupList from "./03_GroupList";
import GroupsReports from "./05_Groups_Reports";
import AllClients from "./07_All_Clients.js";
import GroupChatPage from "./04_GroupChatPage";
import Dashboard from "./01_Dashboard";
import ReportsPage from "./06_ReportsPage.js";
import { AppBar, Toolbar, Typography, Button, Container, CircularProgress, Box } from "@mui/material";

const App = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      navigate("/"); // Redirect to login page after logout
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
        bgcolor="linear-gradient(to right, #6a11cb, #2575fc)"
      >
        <CircularProgress size={60} />
      </Box>
    );
  }

  return (
    <div>
      {/* Navigation Bar */}
      {user && (
        <AppBar position="static" sx={{ backgroundColor: "#1e1e1e" }}>
          <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography variant="h6" sx={{ fontWeight: "bold" }}>
              Admin Dashboard
            </Typography>

            <Box>
              <Button color="inherit" component={Link} to="/">
                Group List
              </Button>
              <Button color="inherit" component={Link} to="/reports">
                Groups Reports
              </Button>
              <Button color="inherit" component={Link} to="/clients">
                Clients
              </Button>
            </Box>

            <Button color="secondary" variant="contained" onClick={handleLogout}>
              Logout
            </Button>
          </Toolbar>
        </AppBar>
      )}

      {/* Routes */}
      <Container sx={{ mt: 4 }}>
        <Routes>
          {user ? (
            <>
              <Route path="/" element={<GroupList />} />
              <Route path="/reports" element={<GroupsReports />} />
              <Route path="/clients" element={<AllClients />} />
              <Route path="/group/:groupId" element={<GroupChatPage />} />
              <Route path="/reports/:groupId" element={<ReportsPage />} />
            </>
          ) : (
            <Route path="/" element={<Login onLoginSuccess={() => setUser(auth.currentUser)} />} />
          )}
        </Routes>
      </Container>
    </div>
  );
};

export default App;
