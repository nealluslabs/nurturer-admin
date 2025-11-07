import React from "react";
import { Box, Typography, IconButton } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const LogDetailsHeader = ({ created, logId, usersAffected, onBackToLogs }) => {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
      <IconButton
        onClick={onBackToLogs}
        sx={{ mr: 2 }}
      >
        <ArrowBackIcon />
      </IconButton>
      <Box>
        <Typography
          sx={{
            fontFamily: "inter",
            fontWeight: "bold",
            fontSize: "24px",
            display: "inline-block",
            borderBottom: "2px solid #000000"
          }}
          px={0.5}
        >
          LOG DETAILS - {created ? new Date(created).toLocaleString() : logId}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Users Affected: {usersAffected || 0}
        </Typography>
      </Box>
    </Box>
  );
};

export default LogDetailsHeader;