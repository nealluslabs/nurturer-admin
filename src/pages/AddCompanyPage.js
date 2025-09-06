import React, { useState } from "react";
import { 
  Box, 
  Typography, 
  Alert, 
  Button, 
  Grid, 
  TextField, 
  Container,
  Paper
} from "@mui/material";
import { useNavigate } from 'react-router-dom';
import { db } from "src/config/firebase";
import { notifyErrorFxn, notifySuccessFxn } from 'src/utils/toast-fxn';

export default function AddCompanyPage() {
  const [formData, setFormData] = useState({
    companyName: '',
    emailAddress: '',
    companyId: ''
  });
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.companyName.trim()) {
      setError('Company Name is required');
      return;
    }
    if (!formData.emailAddress.trim()) {
      setError('Email Address is required');
      return;
    }
    if (!formData.companyId.trim()) {
      setError('Company ID is required');
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.emailAddress)) {
      setError('Please enter a valid email address');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // Check if company ID already exists
      const existingCompany = await db.collection("companies").doc(formData.companyId).get();
      if (existingCompany.exists) {
        setError('Company ID already exists. Please choose a different ID.');
        setIsLoading(false);
        return;
      }

      // Add company to Firestore with custom document ID
      await db.collection("companies").doc(formData.companyId).set({
        companyName: formData.companyName.trim(),
        emailAddress: formData.emailAddress.trim(),
        companyId: formData.companyId.trim(),
        createdAt: new Date(),
        dateCreated: new Date().toISOString()
      });

      notifySuccessFxn('Company added successfully!');
      setMessage('Company added successfully!');
      
      // Reset form
      setFormData({
        companyName: '',
        emailAddress: '',
        companyId: ''
      });

      // Navigate back to users page after a delay
      setTimeout(() => {
        navigate('/dashboard/user');
      }, 2000);

    } catch (error) {
      console.error("Error adding company: ", error);
      setError('Failed to add company. Please try again.');
      notifyErrorFxn('Failed to add company');
    } finally {
      setIsLoading(false);
    }
  };

  const resetMsg = () => {
    setError('');
    setMessage('');
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Box sx={{ width: "100%", margin: "2px 0" }}>
          <Typography
            sx={{ 
              fontFamily: "inter", 
              fontWeight: "bold", 
              fontSize: "24px", 
              display: "inline-block", 
              borderBottom: "2px solid #000000",
              mb: 3
            }}
            px={0.5}
          >
            ADD COMPANY
          </Typography>

          <form onSubmit={handleSubmit}>
            {error && (
              <Box mb={2}>
                <Alert
                  severity="error" 
                  color="error"
                  action={
                    <Button 
                      color="inherit" 
                      size="small" 
                      style={{ fontSize: '15px' }} 
                      onClick={resetMsg}
                    >
                      <b>X</b>
                    </Button>
                  }
                >
                  <Typography style={{ fontSize: '14px' }}><b>{error}</b></Typography>
                </Alert>
              </Box>
            )}

            {message && (
              <Box mb={2}>
                <Alert
                  severity="success" 
                  color="success"
                  action={
                    <Button 
                      color="inherit" 
                      size="small" 
                      style={{ fontSize: '15px' }} 
                      onClick={resetMsg}
                    >
                      <b>X</b>
                    </Button>
                  }
                >
                  <Typography style={{ fontSize: '14px' }}><b>{message}</b></Typography>
                </Alert>
              </Box>
            )}

            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Company Name"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleInputChange}
                  fullWidth
                  variant="outlined"
                  required
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': {
                        borderColor: '#000000',
                      },
                      '&:hover fieldset': {
                        borderColor: '#000000',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#000000',
                      },
                    },
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  label="Email Address"
                  name="emailAddress"
                  type="email"
                  value={formData.emailAddress}
                  onChange={handleInputChange}
                  fullWidth
                  variant="outlined"
                  required
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': {
                        borderColor: '#000000',
                      },
                      '&:hover fieldset': {
                        borderColor: '#000000',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#000000',
                      },
                    },
                  }}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  label="Company ID"
                  name="companyId"
                  value={formData.companyId}
                  onChange={handleInputChange}
                  fullWidth
                  variant="outlined"
                  required
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': {
                        borderColor: '#000000',
                      },
                      '&:hover fieldset': {
                        borderColor: '#000000',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#000000',
                      },
                    },
                  }}
                />
              </Grid>
            </Grid>

            <Box 
              display="flex" 
              justifyContent="center"
              gap={2}
              mt={4}
            >
              <Button
                type="submit"
                disabled={isLoading}
                variant="contained"
                sx={{
                  background: "linear-gradient(to right, #000000, #333333)",
                  color: "white",
                  borderRadius: "8px",
                  padding: "12px 32px",
                  fontWeight: "bold",
                  fontSize: "16px",
                  fontFamily: "inter",
                  minWidth: "120px",
                  '&:hover': {
                    background: "linear-gradient(to right, #333333, #555555)",
                  },
                  '&:disabled': {
                    background: "#cccccc",
                    color: "#666666",
                  }
                }}
              >
                {isLoading ? 'Adding...' : 'Submit'}
              </Button>

              <Button
                type="button"
                variant="outlined"
                onClick={() => navigate('/dashboard/user')}
                sx={{
                  borderColor: "#000000",
                  color: "#000000",
                  borderRadius: "8px",
                  padding: "12px 32px",
                  fontWeight: "bold",
                  fontSize: "16px",
                  fontFamily: "inter",
                  minWidth: "120px",
                  '&:hover': {
                    borderColor: "#333333",
                    backgroundColor: "#f5f5f5",
                  }
                }}
              >
                Cancel
              </Button>
            </Box>
          </form>
        </Box>
      </Paper>
    </Container>
  );
}
