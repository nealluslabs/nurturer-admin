import React, { useState } from "react";
import { Box, Typography } from "@mui/material";

export default function SettingsPage() {
  const [emailQuery, setEmailQuery] = useState('');
  const [eventQuery, setEventQuery] = useState('');
  const [birthdayQuery, setBirthdayQuery] = useState('');
  const [holidayQuery, setHolidayQuery] = useState('');
  const [frequency, setFrequency] = useState('7');
  const [loading, setLoading] = useState(false);

  return (
    <>
      <Box mx={2} pr={4} mt={0.5}>
        <Box sx={{ width: "100%", margin: "2px 0" }}>
          <Typography
            sx={{ 
              fontFamily: "inter", 
              fontWeight: "bold", 
              fontSize: "18px", 
              display: "inline-block", 
              borderBottom: "2px solid #000000" 
            }}
            mb={3}
            px={0.5}
          >SETTINGS</Typography>

          <Box>
            <Box sx={{ display: 'flex', alignItems: 'flex-start', marginBottom: '21px' }}>
              <Typography sx={{ minWidth: 120, fontSize: '15px', fontWeight: 500, mt: 1 }}>Email Query:</Typography>
              <textarea 
                value={emailQuery}
                onChange={(e) => setEmailQuery(e.target.value)}
                placeholder="Email Query" 
                rows="5"
                style={{ 
                  outline: "none", 
                  width: "100%", 
                  border: "1px solid #000000", 
                  padding: "7px 8px", 
                  fontSize: "14px",
                  resize: "vertical",
                  minHeight: "120px",
                  fontFamily: "inherit"
                }}
              />
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'flex-start', marginBottom: '21px' }}>
              <Typography sx={{ minWidth: 120, fontSize: '15px', fontWeight: 500, mt: 1 }}>Event Query:</Typography>
              <textarea 
                value={eventQuery}
                onChange={(e) => setEventQuery(e.target.value)}
                placeholder="Event Query" 
                rows="5"
                style={{ 
                  outline: "none", 
                  width: "100%", 
                  border: "1px solid #000000", 
                  padding: "7px 8px", 
                  fontSize: "14px",
                  resize: "vertical",
                  minHeight: "120px",
                  fontFamily: "inherit"
                }}
              />
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'flex-start', marginBottom: '21px' }}>
              <Typography sx={{ minWidth: 120, fontSize: '15px', fontWeight: 500, mt: 1 }}>Birthday Query:</Typography>
              <textarea 
                value={birthdayQuery}
                onChange={(e) => setBirthdayQuery(e.target.value)}
                placeholder="Birthday Query" 
                rows="5"
                style={{ 
                  outline: "none", 
                  width: "100%", 
                  border: "1px solid #000000", 
                  padding: "7px 8px", 
                  fontSize: "14px",
                  resize: "vertical",
                  minHeight: "120px",
                  fontFamily: "inherit"
                }}
              />
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'flex-start', marginBottom: '21px' }}>
              <Typography sx={{ minWidth: 120, fontSize: '15px', fontWeight: 500, mt: 1 }}>Holiday Query:</Typography>
              <textarea 
                value={holidayQuery}
                onChange={(e) => setHolidayQuery(e.target.value)}
                placeholder="Holiday Query" 
                rows="5"
                style={{ 
                  outline: "none", 
                  width: "100%", 
                  border: "1px solid #000000", 
                  padding: "7px 8px", 
                  fontSize: "14px",
                  resize: "vertical",
                  minHeight: "120px",
                  fontFamily: "inherit"
                }}
              />
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: '21px' }}>
              <Typography sx={{ minWidth: 120, fontSize: '15px', fontWeight: 500 }}>Frequency:</Typography>
              <input 
                value={frequency}
                onChange={(e) => setFrequency(e.target.value)}
                placeholder="Frequency (Default 7 days)" 
                type="number" 
                style={{ outline: "none", width: "100%", border: "1px solid #000000", padding: "7px 8px", fontSize: "14px" }}
              />
            </Box>

            <Box sx={{ width: "100%" }}>
              <Box
                sx={{ 
                  background: "linear-gradient(to right, #000000, #333333)", 
                  width: "128px", 
                  margin: "21px auto", 
                  borderRadius: "12px", 
                  cursor: "pointer", 
                  marginTop: "42px", 
                  marginBottom: "42px" 
                }}
                p={1}
              >
                <Typography 
                  sx={{ 
                    textAlign: "center", 
                    color: "white", 
                    fontWeight: "bold", 
                    marginTop: "2px", 
                    fontSize: "14px", 
                    fontFamily: "inter" 
                  }}
                >
                  {loading ? "Loading..." : "SAVE"}
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </>
  );
}
