import React from "react";
import { Container, Card, CardContent, Typography, Button, Table, TableBody,Stack, TableCell, TableContainer, TableHead, TableRow, Paper, Avatar, Chip, Grid } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { useNavigate } from "react-router-dom";

const user = {
  name: "Mithun",
  status: "Active",
  employeeId: "8D6589",
  designation: "Admin",
  email: "Mithun@usc.edu",
  mobile: "(455) 444-7206",
  addedOn: "29 April 2021",
};

const activities = [
  { date: "Jan 11 2024 12:30 AM", action: "User Approval", channel: "Web", ip: "148.117.239.122" },
  { date: "Jan 10 2024 04:30 PM", action: "Changed Password", channel: "Mobile", ip: "148.117.239.122" },
  { date: "Jan 10 2024 10:30 AM", action: "User Created", channel: "Web", ip: "148.117.239.122" },
  { date: "Jan 9 2024 12:30 AM", action: "Enquiry Visit", channel: "Web", ip: "148.117.239.122" },
  { date: "Jan 5 2024 09:30 AM", action: "User Approval", channel: "Web", ip: "148.117.239.122" },
];

const UserProfile = () => {
    const navigate=useNavigate()
  return (
    <Container maxWidth="full" sx={{ mt: 4 }}>
    <Card variant="outlined" sx={{ p: 2, borderRadius: 1.5, boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1)' }}>
  <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
    <Typography variant="h6" fontWeight="bold">
      {user.name} <Chip label={user.status} color="success" size="small" />
    </Typography>
    <Button startIcon={<EditIcon />} size="small" onclick={()=>navigate("/adduser")}>
      Edit
    </Button>
  </Stack>

  <CardContent sx={{ p: 0, "&:last-child": { pb: 0 } }}>
    <Grid container spacing={2}>
      <Grid item xs={6} sm={4}>
        <Typography variant="body2" color="textSecondary">
          <strong>Employee ID:</strong> {user.employeeId}
        </Typography>
      </Grid>
      <Grid item xs={6} sm={4}>
        <Typography variant="body2" color="textSecondary">
          <strong>Designation:</strong> {user.designation}
        </Typography>
      </Grid>
      <Grid item xs={6} sm={4}>
        <Typography variant="body2" color="textSecondary">
          <strong>Email ID:</strong> {user.email}
        </Typography>
      </Grid>
      <Grid item xs={6} sm={4}>
        <Typography variant="body2" color="textSecondary">
          <strong>Mobile:</strong> {user.mobile}
        </Typography>
      </Grid>
      <Grid item xs={6} sm={4}>
        <Typography variant="body2" color="textSecondary">
          <strong>Added On:</strong> {user.addedOn}
        </Typography>
      </Grid>
    </Grid>
  </CardContent>
</Card>

      
      <Typography variant="h6" sx={{ mt: 3, mb: 2 }}>Activity</Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>Date and Time</strong></TableCell>
              <TableCell><strong>Action</strong></TableCell>
              <TableCell><strong>Channel</strong></TableCell>
              <TableCell><strong>IP Address</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {activities.map((activity, index) => (
              <TableRow key={index}>
                <TableCell>{activity.date}</TableCell>
                <TableCell>{activity.action}</TableCell>
                <TableCell>{activity.channel}</TableCell>
                <TableCell>{activity.ip}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default UserProfile;
