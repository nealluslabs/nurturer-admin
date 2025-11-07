import React from "react";
import { Box, Typography } from "@mui/material";

const PageHeader = ({ title, subtitle }) => {
  return (
    <Box sx={{ mb: 3 }}>
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
        {title}
      </Typography>
      {subtitle && (
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          {subtitle}
        </Typography>
      )}
    </Box>
  );
};

export default PageHeader;