import React, {useEffect} from "react";
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
import { fetchAllContactForOneUser } from 'src/redux/actions/user.action';

const InteractionsPage = () => {
  const getStatusColor = (status) => {
    return status === "Sent" ? "success" : "error";
  };
  // const { jobs } = useSelector((state) => state.jobs);

  const { allContacts = [], candidateInFocus, filteredContacts } = useSelector(
    (state) => state.user ,
  );


  let onlyTouchpointMessagesData = [];
  let onlyEventsMessagesData = [];
// console.log("filteredContacts ON interaction PAGE----------->", filteredContacts);
  //   console.log("ALL CONTACTS IN INTERACTIONS PAGE ---------->", allContacts);
    if (allContacts.length > 0) {
      let allMessages = [];
      allContacts.forEach((contact) => {
        if (Array.isArray(contact.messageQueue)) {
          allMessages = allMessages.concat(
            contact.messageQueue.map((msg) => ({
              ...msg,
              contactName: contact.name,
              contactId: contact.id || contact.uid,
              uid: contact.uid,
              email: contact.email,
            })),
          );
        }
      });
  
      allMessages.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
      console.log("allMessages ON interaction PAGE----------->", allMessages);
  
      const filteredHistory = allMessages.filter(
        (item) =>
          item.messageStatus === "Cancelled" || item.messageStatus === "Sent",
      );
  
      onlyTouchpointMessagesData = filteredHistory
        .filter((item) => item.messageType !== "Event")
        .map((msg, idx) => ({
          id: msg.id || idx,
          title: msg.title || msg.subject || "No Title",
          email: msg.email,
          subtitle: msg.contactName
            ? `${msg.contactName}${msg.to ? " - " + msg.to : ""}`
            : msg.to || "",
          status: msg.messageStatus || "",
          messageType: msg.messageType,
          createdAt: msg.createdAt,
          iconColor: "#1976d2",
        }));
  
      onlyEventsMessagesData = filteredHistory
        .filter((item) => item.messageType === "Events")
        .map((msg, idx) => ({
          id: msg.id || idx,
          title: msg.title || msg.subject || "No Title",
          email: msg.email,
          subtitle: msg.contactName
            ? `${msg.contactName}${msg.to ? " - " + msg.to : ""}`
            : msg.to || "",
          status: msg.messageStatus || "",
          messageType: msg.messageType,
          createdAt: msg.createdAt,
          iconColor: "#1976d2",
        }));
    }

  const displayData = [
    ...onlyTouchpointMessagesData,
    ...onlyEventsMessagesData,
  ];
  // console.log("displayData ON interaction PAGE----------->", displayData);
  // console.log("allContacts ON interaction PAGE----------->", allContacts);

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
          <TableHead
            sx={{
              "& .MuiTableCell-head": {
                backgroundColor: "#20dbe4",
                color: "#ffffff",
                fontWeight: "bold",
              },
            }}
          >
            {" "}
            <TableRow>
              <TableCell sx={{ fontWeight: "bold" }}>
                <strong>User Email</strong>
              </TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>
                <strong>Email</strong>
              </TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>
                <strong>Timestamp</strong>
              </TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>
                <strong>Type</strong>
              </TableCell>
              {/* <TableCell sx={{ fontWeight: "bold" }}>
                <strong>Subject</strong>
              </TableCell> */}
              <TableCell sx={{ fontWeight: "bold" }}>
                <strong>Status</strong>
              </TableCell>
              <TableCell align="center" sx={{ fontWeight: "bold" }}>
                <strong>View</strong>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody sx={{ fontSize: 16 }}>
            {displayData.length > 0 ? (
              displayData.map((row) => (
                <TableRow key={row.id} hover>
                  <TableCell>
                    <Typography variant="body2">{row.email}</Typography>
                  </TableCell>
                  {/* <TableCell>
                    <Typography variant="body2">{row.companyEmail}</Typography>
                  </TableCell> */}
                  <TableCell>
                    <Typography variant="body2">
                      {row.createdAt && row.createdAt.seconds
                        ? new Date(
                            row.createdAt.seconds * 1000,
                          ).toLocaleString()
                        : "N/A"}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color="textSecondary">
                      {row.messageType}
                    </Typography>
                  </TableCell>
                <TableCell>
                    <Typography variant="body2">{row.title}</Typography>
                    <Typography variant="caption" color="textSecondary">
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
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} align="center" sx={{ py: 5 }}>
                  <Typography variant="h6" color="textSecondary">
                    No interactions found.
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Interactions that are Sent or Cancelled will appear here.
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default InteractionsPage;
