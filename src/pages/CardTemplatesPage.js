import React from 'react';
import { Box, Typography } from '@mui/material';
import CollectionsIcon from '@mui/icons-material/Collections';
import AddIcon from '@mui/icons-material/Add';
import CakeIcon from '@mui/icons-material/Cake';
import StarIcon from '@mui/icons-material/Star';
import DeleteIcon from '@mui/icons-material/Delete';

// Sample images - you can replace with actual images
import BirthdayOne from "../assets/Birthday_1.png";
import BirthdayTwo from "../assets/Birthday_2.png";
import Holiday from "../assets/Holiday_1.png"; 

export default function CardTemplatesPage() {
  return (
    <div style={{ padding: '24px' }}>
      <Box
        sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}
      >
        <Typography variant="h4" sx={{ display: 'flex', alignItems: 'center' }}>
          <CollectionsIcon sx={{ fontSize: 64, mr: 2 }} />
          Card Templates
        </Typography>

        <button 
          style={{ 
            background: 'linear-gradient(to right, #6a11cb, #b13cff)',
            color: 'white',
            padding: '10px 20px',
            borderRadius: '8px',
            textTransform: 'none',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center'
          }}
        >
          <AddIcon sx={{ marginRight: '8px' }} />
          Add new templates
        </button>
      </Box>

      <div style={{ marginTop: "42px", display: "flex", justifyContent: "space-between", flexWrap: "wrap" }}>
        
        <div style={{ width: "50%", backgroundColor: "white", padding: "6px", borderRadius: "8px" }}>

          <div 
            style={{ 
              display: "flex", justifyContent: "space-between", alignItems: "center", 
              borderBottom: "1px solid grey", padding: "8px 12px", backgroundColor: "#f0f0f0",
            }}
          >
            <div style={{ display: "flex", alignItems: "center" }}>
              <CakeIcon sx={{ mr: 1.5 }} />
              <p style={{ fontSize: "18px", fontWeight: 700, margin: 0 }}>Birthday Cards</p>
            </div>
            <p 
              style={{ 
                color: "white", backgroundColor: "gray", padding: "4px 8px", 
                borderRadius: "8px", margin: 0
              }}
            >
              2 templates
            </p>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", padding: "21px 12px", paddingBottom: "24px" }}>
            
            <div style={{ width: "47%" }}>
              <img 
                src={BirthdayOne}
                alt="No image"
                style={{ borderRadius: "4px", width: '100%', height: '120px', objectFit: 'cover', backgroundColor: '#f0f0f0' }} 
              />
              <p style={{ fontSize: "18px", marginTop: "12px", margin: '12px 0 0 0' }}>
                Candles and Confetti
              </p>

              <div style={{ display: "flex", alignItems: "center", marginTop: "12px" }}>
                <div
                  style={{ 
                    display: "flex", alignItems: "center", cursor: "pointer", 
                    border: "1px solid blue", padding: "8px", borderRadius: "4px",
                  }}
                >
                  <StarIcon sx={{ mr: 1.5, color: "blue" }} />
                  <p style={{ color: "blue", paddingRight: "2px", margin: 0 }}>Set Default</p>
                </div>

                <div
                  style={{ 
                    display: "flex", alignItems: "center", cursor: "pointer", marginLeft: "8px",
                    border: "1px solid red", padding: "8px", borderRadius: "4px", 
                  }}
                >
                  <DeleteIcon sx={{ mr: 1.5, color: "red" }} />
                </div>
              </div>
            </div>

            <div style={{ width: "47%" }}>
              <img 
                src={BirthdayTwo}
                alt="No image"
                style={{ borderRadius: "4px", width: '100%', height: '120px', objectFit: 'cover', backgroundColor: '#f0f0f0' }} 
              />
              <p style={{ fontSize: "18px", marginTop: "12px", margin: '12px 0 0 0' }}>
                Candles and Confetti
              </p>

              <div style={{ display: "flex", alignItems: "center", marginTop: "12px" }}>
                <div
                  style={{ 
                    display: "flex", alignItems: "center", cursor: "pointer", 
                    border: "1px solid blue", padding: "8px", borderRadius: "4px",
                  }}
                >
                  <StarIcon sx={{ mr: 1.5, color: "blue" }} />
                  <p style={{ color: "blue", paddingRight: "2px", margin: 0 }}>Set Default</p>
                </div>

                <div
                  style={{ 
                    display: "flex", alignItems: "center", cursor: "pointer", marginLeft: "8px",
                    border: "1px solid red", padding: "8px", borderRadius: "4px", 
                  }}
                >
                  <DeleteIcon sx={{ mr: 1.5, color: "red" }} />
                </div>
              </div>
            </div>

          </div>

        </div>

        <div style={{ width: "45%", backgroundColor: "white", padding: "6px", borderRadius: "8px" }}>

          <div 
            style={{ 
              display: "flex", justifyContent: "space-between", alignItems: "center", 
              borderBottom: "1px solid grey", padding: "8px 12px", backgroundColor: "#f0f0f0",
            }}
          >
            <div style={{ display: "flex", alignItems: "center" }}>
              <CakeIcon sx={{ mr: 1.5 }} />
              <p style={{ fontSize: "18px", fontWeight: 700, margin: 0 }}>Anniversary Cards</p>
            </div>
            <p 
              style={{ 
                color: "white", backgroundColor: "gray", padding: "4px 8px", 
                borderRadius: "8px", margin: 0
              }}
            >
              2 templates
            </p>
          </div>

          <div style={{ padding: "21px 12px", paddingBottom: "24px", textAlign: "center" }}>
            
            <CollectionsIcon sx={{ fontSize: "64px", mt: 2 }} />
            
            <p style={{ fontSize: "18px", marginBottom: "12px", marginTop: "2%" }}>
              No anniversary templates yet
            </p>

            <p style={{ fontSize: "16px", color: "gray", marginBottom: "24px" }}>
              Upload your first Canva design for anniversary cards
            </p>

            <button
              style={{ 
                background: 'linear-gradient(to right, #6a11cb, #b13cff)',
                color: 'white',
                padding: '10px 20px',
                borderRadius: '8px',
                textTransform: 'none',
                border: 'none',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center'
              }}
            >
              <AddIcon sx={{ marginRight: '8px' }} />
              Add template
            </button>

          </div>

        </div>

        <div 
          style={{ 
            width: "50%", backgroundColor: "white", padding: "6px", borderRadius: "8px",  
            marginTop: "24px" 
          }}
        >

          <div 
            style={{ 
              display: "flex", justifyContent: "space-between", alignItems: "center", 
              borderBottom: "1px solid grey", padding: "8px 12px", backgroundColor: "#f0f0f0",
            }}
          >
            <div style={{ display: "flex", alignItems: "center" }}>
              <CakeIcon sx={{ mr: 1.5 }} />
              <p style={{ fontSize: "18px", fontWeight: 700, margin: 0 }}>Holiday Cards</p>
            </div>
            <p 
              style={{ 
                color: "white", backgroundColor: "gray", padding: "4px 8px", 
                borderRadius: "8px", margin: 0
              }}
            >
              2 templates
            </p>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", padding: "21px 12px", paddingBottom: "24px" }}>

            <div style={{ width: "47%" }}>
              <img 
                src={Holiday}
                alt="No image"
                style={{ borderRadius: "4px", width: '100%', height: '120px', objectFit: 'cover', backgroundColor: '#f0f0f0' }} 
              />
              <p style={{ fontSize: "18px", marginTop: "12px", margin: '12px 0 0 0' }}>
                Holiday Greetings
              </p>

              <div style={{ display: "flex", alignItems: "center", marginTop: "12px" }}>
                <div
                  style={{ 
                    display: "flex", alignItems: "center", cursor: "pointer", 
                    border: "1px solid blue", padding: "8px", borderRadius: "4px",
                  }}
                >
                  <StarIcon sx={{ mr: 1.5, color: "blue" }} />
                  <p style={{ color: "blue", paddingRight: "2px", margin: 0 }}>Set Default</p>
                </div>

                <div
                  style={{ 
                    display: "flex", alignItems: "center", cursor: "pointer", marginLeft: "8px",
                    border: "1px solid red", padding: "8px", borderRadius: "4px", 
                  }}
                >
                  <DeleteIcon sx={{ mr: 1.5, color: "red" }} />
                </div>
              </div>
            </div>

          </div>

        </div>

        <div style={{ width: "45%", backgroundColor: "white", padding: "6px", borderRadius: "8px", marginTop: "24px" }}>

          <div 
            style={{ 
              display: "flex", justifyContent: "space-between", alignItems: "center", 
              borderBottom: "1px solid grey", padding: "8px 12px", backgroundColor: "#f0f0f0",
            }}
          >
            <div style={{ display: "flex", alignItems: "center" }}>
              <CakeIcon sx={{ mr: 1.5 }} />
              <p style={{ fontSize: "18px", fontWeight: 700, margin: 0 }}>Thank you Cards</p>
            </div>
            <p 
              style={{ 
                color: "white", backgroundColor: "gray", padding: "4px 8px", 
                borderRadius: "8px", margin: 0
              }}
            >
              0 templates
            </p>
          </div>

          <div style={{ padding: "21px 12px", paddingBottom: "24px", textAlign: "center" }}>

            <CollectionsIcon sx={{ fontSize: "64px", mt: 2 }} />
            
            <p style={{ fontSize: "18px", marginBottom: "12px", marginTop: "2%" }}>
              No thank you templates yet
            </p>

            <p style={{ fontSize: "16px", color: "gray", marginBottom: "24px" }}>
              Upload your first Canva design for thank you cards
            </p>

            <button
              style={{ 
                background: 'linear-gradient(to right, #6a11cb, #b13cff)',
                color: 'white',
                padding: '10px 20px',
                borderRadius: '8px',
                textTransform: 'none',
                border: 'none',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center'
              }}
            >
              <AddIcon sx={{ marginRight: '8px' }} />
              Add template
            </button>

          </div>

        </div>

      </div>
    </div>
  );
}
