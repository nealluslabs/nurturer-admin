import React, { useEffect, useMemo, useState } from "react";
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
  TablePagination,
} from "@mui/material";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllContacts } from "src/redux/actions/user.action";

const InteractionsPage = () => {
  const dispatch = useDispatch();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const getStatusColor = (status) => {
    return status === "Sent" ? "success" : "error";
  };
  const { allContacts = [] } = useSelector((state) => state.user);

  useEffect(() => {
    dispatch(fetchAllContacts());
  }, [dispatch]);

  const displayData = useMemo(() => {
    const toMillis = (createdAt) => {
      if (!createdAt) return 0;
      if (typeof createdAt === "number") return createdAt;
      if (typeof createdAt.toDate === "function") {
        return createdAt.toDate().getTime();
      }
      if (createdAt.seconds) return createdAt.seconds * 1000;
      const parsed = new Date(createdAt).getTime();
      return Number.isNaN(parsed) ? 0 : parsed;
    };

    const isEventType = (messageType) => {
      const normalizedType = String(messageType || "").toLowerCase();
      return normalizedType === "event" || normalizedType === "events";
    };

    if (!Array.isArray(allContacts) || allContacts.length === 0) return [];

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

    allMessages.sort((a, b) => toMillis(b.createdAt) - toMillis(a.createdAt));

    const filteredHistory = allMessages.filter(
      (item) =>
        item.messageStatus === "Cancelled" || item.messageStatus === "Sent",
    );

    const onlyTouchpointMessagesData = filteredHistory
      .filter((item) => !isEventType(item.messageType))
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

    const onlyEventsMessagesData = filteredHistory
      .filter((item) => isEventType(item.messageType))
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

    return [...onlyTouchpointMessagesData, ...onlyEventsMessagesData];
  }, [allContacts]);

  useEffect(() => {
    const maxPage = Math.max(0, Math.ceil(displayData.length / rowsPerPage) - 1);
    if (page > maxPage) {
      setPage(maxPage);
    }
  }, [displayData.length, page, rowsPerPage]);

  const paginatedData = useMemo(() => {
    const start = page * rowsPerPage;
    return displayData.slice(start, start + rowsPerPage);
  }, [displayData, page, rowsPerPage]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

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
              paginatedData.map((row) => (
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
        <TablePagination
          rowsPerPageOptions={[10, 25, 50]}
          component="div"
          count={displayData.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>
    </Box>
  );
};

export default InteractionsPage;
