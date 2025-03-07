import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { collection, getDocs } from "firebase/firestore";
import { db } from "./firebase";
import { Container, Typography, Card, CardContent, Button, CircularProgress, Grid } from "@mui/material";

function GroupList() {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);

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
        Group List
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
                    color="primary"
                    component={Link}
                    to={`/group/${group.id}`}
                    sx={{ mt: 1 }}
                  >
                    View Group
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

export default GroupList;
