import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Typography,
  Box,
} from "@mui/material";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import { useDispatch, useSelector } from "react-redux";

const InteractionsPage = () => {
  const getStatusColor = (status) => {
    return status === "Sent" ? "success" : "error";
  };
  const { jobs } = useSelector((state) => state.jobs);

  let touchpointData = [];

  let onlyTouchpointMessagesData = [];
  let onlyEventsMessagesData = [];

if (jobs.length > 0) {
    let allMessages = [];
    
    jobs.forEach((contact) => {
      if (contact.message && typeof contact.message === 'object' && !Array.isArray(contact.message)) {
        allMessages.push({
          ...contact.message,
          contactName: contact.name,
          contactId: contact.id || contact.uid,
          email: contact.email,
          contactEmail: contact.companyEmail,
        });
      }

      if (Array.isArray(contact.queryMsg)) {
        contact.queryMsg.forEach(msg => {
          allMessages.push({
            ...msg,
            contactName: contact.name,
            contactId: contact.id || contact.uid,
            email: contact.email,
            contactEmail: contact.companyEmail,
          });
        });
      }
    });

    allMessages.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));

    const filteredHistory = allMessages.filter(
      (item) =>
        item.messageStatus === "Cancelled" || 
        item.messageStatus === "Sent" ||
        item.messageStatus === "Failed" ||
        item.messageStatus === "Pending"
    );

    onlyTouchpointMessagesData = filteredHistory
      .filter((item) => item.messageType)
      .map((msg, idx) => ({
        id: msg.id || idx,
        title: msg.subject || msg.title || "No Title",
        email: msg.email,
        companyEmail: msg.companyEmail || "N/A",
        subtitle: msg.contactName || "",
        status: msg.messageStatus || "",
        messageType: msg.messageType || "",
        createdAt: msg.createdAt,
        iconColor: "#1976d2",
      }));

    // onlyEventsMessagesData = filteredHistory
    //   .filter((item) => item.messageType === "Events" )
    //   .map((msg, idx) => ({
    //     id: msg.id || idx,
    //     title: msg.subject || msg.title || "No Title",
    //     email: msg.email,
    //     companyEmail: msg.companyEmail || "N/A",
    //     subtitle: msg.contactName || "",
    //     status: msg.messageStatus || "",
    //     messageType: msg.messageType,
    //     createdAt: msg.createdAt,
    //     iconColor: "#1976d2",
    //   }));
  }
  const displayData = [
    ...onlyTouchpointMessagesData,
    // ...onlyEventsMessagesData,
  ];
  console.log("displayData ON interaction PAGE----------->", displayData);
  console.log("jobs ON interaction PAGE----------->", jobs);
  console.log("onlyTouchpointMessagesData ON interaction PAGE----------->", onlyTouchpointMessagesData);
    console.log("onlyEventsMessagesData ON interaction PAGE----------->", onlyEventsMessagesData);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" sx={{ mb: 3, fontWeight: "bold", fontSize: 20 }}>
        Interactions
      </Typography>

      <TableContainer
        component={Paper}
        elevation={2}
        sx={{ borderRadius: 2, fontSize: "4rem" }}
      >
        <Table sx={{ minWidth: 650 }}>
          <TableHead sx={{ backgroundColor: "#f5f5f5", fontSize: "4rem" }}>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold" }}>
                <strong>User Email</strong>
              </TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>
                <strong>Contact Email</strong>
              </TableCell>
              <TableCell sx={{  fontWeight: "bold" }}>
                <strong>Timestamp</strong>
              </TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>
                <strong>Type</strong>
              </TableCell>
              <TableCell sx={{  fontWeight: "bold" }}>
                <strong>Subject</strong>
              </TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>
                <strong>Status</strong>
              </TableCell>
              <TableCell
                align="center"
                sx={{ fontWeight: "bold" }}
              >
                <strong>View</strong>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody sx={{ fontSize: 16 }}>
            {displayData.map((row) => (
              <TableRow key={row.id} hover>
                <TableCell>
                  <Typography variant="body2" >
                    {row.email}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" >
                    {row.companyEmail}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" >
                    {row.createdAt && row.createdAt.seconds
                      ? new Date(row.createdAt.seconds * 1000).toLocaleString()
                      : "N/A"}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography
                    variant="body2"
                    color="textSecondary"
                  >
                    {row.messageType}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2">
                    {row.title}
                  </Typography>
                  <Typography
                    variant="caption"
                    color="textSecondary"
                  >
                    {row.subtitle}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Chip
                    label={row.status}
                    color={getStatusColor(row.status)}
                    variant="outlined"
                    size="medium"
                  />
                </TableCell>
                <TableCell align="center">
                  <IconButton sx={{ color: row.iconColor }} size="medium">
                    <VisibilityOutlinedIcon fontSize="medium" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}{" "}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default InteractionsPage;
