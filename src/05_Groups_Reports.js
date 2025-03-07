import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { collection, getDocs } from "firebase/firestore";
import { db } from "./firebase";
import { Container, Typography, Card, CardContent, Button, CircularProgress, Grid } from "@mui/material";

function ReportsGroups() {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchGroups = async () => {
      const querySnapshot = await getDocs(collection(db, "groups"));
      const groupList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setGroups(groupList);
      setLoading(false);
    };

    fetchGroups();
  }, []);

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom align="center">
        Admin Reports
      </Typography>

      {loading ? (
        <CircularProgress sx={{ display: "block", margin: "auto" }} />
      ) : groups.length === 0 ? (
        <Typography variant="body1" align="center">
          No groups available.
        </Typography>
      ) : (
        <Grid container spacing={3} justifyContent="center">
          {groups.map((group) => (
            <Grid item key={group.id} xs={12} sm={6} md={4}>
              <Card sx={{ textAlign: "center", boxShadow: 3 }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {group.groupName}
                  </Typography>
                  <Button
                    variant="contained"
                    color="success"
                    onClick={() => navigate(`/reports/${group.id}`)}
                    sx={{ mt: 1 }}
                  >
                    View Reports
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
}

export default ReportsGroups;
