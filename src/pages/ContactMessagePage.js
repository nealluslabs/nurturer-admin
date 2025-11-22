import React from "react";
import { useLocation, useNavigate } from 'react-router-dom';
import { Container, Paper, Typography, Button, Box, Divider } from "@mui/material";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

export default function ContactMessagePage() {
  const location = useLocation();
  const navigate = useNavigate();

  const { contact, logId } = location.state || {};

  const handleBackToLogDetails = () => {
    navigate(-1);
  };

  if (!contact) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" color="text.secondary">
            No contact information found
          </Typography>
          <Button
            variant="contained"
            onClick={handleBackToLogDetails}
            sx={{ mt: 2, background: "#20dbe4", '&:hover': { background: "#1bc5ce" } }}
          >
            Go Back
          </Button>
        </Paper>
      </Container>
    );
  }

  const hasGeneratedMessage = contact.generatedMessage && 
    (contact.generatedMessage.subject || 
     contact.generatedMessage.firstParagragph || 
     contact.generatedMessage.secondParagragph);

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={handleBackToLogDetails}
          sx={{ 
            mr: 2,
            borderColor: "#20dbe4",
            color: "#20dbe4",
            '&:hover': {
              borderColor: "#1bc5ce",
              background: "rgba(32, 219, 228, 0.04)"
            }
          }}
        >
          Back
        </Button>
        <Typography variant="h4" component="h1">
          Contact Message Details
        </Typography>
      </Box>

      <Paper sx={{ p: 3, mb: 1 }}>
        <Typography variant="h6" sx={{ mb: 2, color: "#20dbe4" }}>
          Contact Information
        </Typography>
        <Box sx={{ mb: 1 }}>
          <Typography variant="body1">
            <strong>Name:</strong> {contact.contactName || contact.name || 'N/A'}
          </Typography>
        </Box>
        <Box sx={{ mb: 1 }}>
          <Typography variant="body1">
            <strong>Email:</strong> {contact.contactEmail || contact.email || 'N/A'}
          </Typography>
        </Box>
      </Paper>

      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" sx={{ mb: 3, color: "#20dbe4" }}>
          Generated Message
        </Typography>

        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1, color: "#555" }}>
            Subject
          </Typography>
          <Typography
            variant="body1"
            sx={{
              p: 2,
              backgroundColor: '#f5f5f5',
              borderRadius: 1,
              fontStyle: contact.generatedMessage?.subject ? 'italic' : 'normal',
              color: contact.generatedMessage?.subject ? 'inherit' : 'text.secondary'
            }}
          >
            {contact.generatedMessage?.subject ? contact.generatedMessage.subject : 'empty'}
          </Typography>
        </Box>

        <Divider sx={{ my: 2 }} />

        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1, color: "#555" }}>
            First Paragraph
          </Typography>
          <Typography
            variant="body1"
            sx={{
              p: 2,
              backgroundColor: '#f5f5f5',
              borderRadius: 1,
              lineHeight: 1.8,
              color: contact.generatedMessage?.firstParagragph ? 'inherit' : 'text.secondary'
            }}
          >
            {contact.generatedMessage?.firstParagragph ? contact.generatedMessage.firstParagragph : 'empty'}
          </Typography>
        </Box>

        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1, color: "#555" }}>
            Second Paragraph
          </Typography>
          <Typography
            variant="body1"
            sx={{
              p: 2,
              backgroundColor: '#f5f5f5',
              borderRadius: 1,
              lineHeight: 1.8,
              color: contact.generatedMessage?.secondParagragph ? 'inherit' : 'text.secondary'
            }}
          >
            {contact.generatedMessage?.secondParagragph ? contact.generatedMessage.secondParagragph : 'empty'}
          </Typography>
        </Box>

        {contact.generatedMessage?.messageType && (
          <Box sx={{ mt: 3, pt: 2, borderTop: '1px solid #e0e0e0' }}>
            <Typography variant="body2" color="text.secondary">
              <strong>Message Type:</strong> {contact.generatedMessage.messageType}
            </Typography>
          </Box>
        )}
      </Paper>
    </Container>
  );
}
