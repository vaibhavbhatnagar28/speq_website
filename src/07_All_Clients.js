import { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Alert,
  Box,
} from "@mui/material";

export default function ClientsList() {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("http://localhost:5000/api/data")
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log("Fetched Data:", data);

        if (!Array.isArray(data.users)) {
          console.error("API did not return a valid users array:", data);
          throw new Error("Invalid API response");
        }

        const users = data.users.filter((user) => user.role === "user");
        console.log("Filtered Users:", users);
        setClients(users);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setError(error.message);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" fontWeight="bold" align="center" gutterBottom>
        All Clients
      </Typography>

      {/* Loading State */}
      {loading && (
        <Box display="flex" justifyContent="center" mt={4}>
          <CircularProgress />
        </Box>
      )}

      {/* Error Message */}
      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}

      {/* No Clients Found */}
      {!loading && !error && clients.length === 0 && (
        <Typography variant="body1" align="center" mt={2} color="textSecondary">
          No clients found.
        </Typography>
      )}

      {/* Client Table */}
      {!loading && !error && clients.length > 0 && (
        <TableContainer component={Paper} sx={{ mt: 3, borderRadius: 3, overflow: "hidden" }}>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: "#1e88e5" }}>
                <TableCell sx={{ color: "white", fontWeight: "bold" }}>S.No</TableCell>
                <TableCell sx={{ color: "white", fontWeight: "bold" }}>Name</TableCell>
                <TableCell sx={{ color: "white", fontWeight: "bold" }}>Client ID</TableCell>
                <TableCell sx={{ color: "white", fontWeight: "bold" }}>Relationship Manager</TableCell>
                <TableCell sx={{ color: "white", fontWeight: "bold" }}>Joining Date</TableCell>
                <TableCell sx={{ color: "white", fontWeight: "bold" }}>Subscription Validity</TableCell>
                <TableCell sx={{ color: "white", fontWeight: "bold" }}>No. of Calls</TableCell>
                <TableCell sx={{ color: "white", fontWeight: "bold" }}>Avg Calls (30 Days)</TableCell>
                <TableCell sx={{ color: "white", fontWeight: "bold" }}>No. of Reports</TableCell>
                <TableCell sx={{ color: "white", fontWeight: "bold" }}>Total P&L %</TableCell>
                <TableCell sx={{ color: "white", fontWeight: "bold" }}>Total P&L (Abs)</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {clients.map((client, index) => (
                <TableRow key={client.id} hover>
                  <TableCell>{index + 1}</TableCell> {/* Auto-incrementing S.No */}
                  <TableCell>{client.name}</TableCell>
                  <TableCell>{client.client_id}</TableCell>
                  <TableCell>{client.relationship_manager}</TableCell>
                  <TableCell>
  {client.joining_date? 
    new Date(client.joining_date._seconds * 1000).toLocaleDateString() : "N/A"}
</TableCell>

                  <TableCell>{new Date(client.subscription_validity._seconds * 1000).toLocaleDateString()}</TableCell>
                  <TableCell>{client.totalCalls}</TableCell>
                  <TableCell>{(client.totalCalls / 30).toFixed(2)}</TableCell>
                  <TableCell>{client.totalReports}</TableCell>
                  <TableCell>{client.totalPLPercentage.toFixed(2)}%</TableCell>
                  <TableCell>{client.totalPLAbs.toLocaleString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Container>
  );
}
