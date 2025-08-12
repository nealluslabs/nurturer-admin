import React, { useState } from "react";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TextField } from "@mui/material";
import { styled } from "@mui/styles";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.MuiTableCell-head`]: {
    backgroundColor: '#000000',
    color: '#fff',
    width: '20%',
    textAlign: 'center',
  },
  [`&.MuiTableCell-body`]: {
    fontSize: 14,
    width: '20%',
    textAlign: 'center',
  },
}));

export default function SettingsPage() {
  // Example random data
  const rows = [
    {
      email: 'john.doe@example.com',
      event: 'Conference',
      birthday: '1990-05-12',
      holiday: 'Christmas',
      frequency: 7,
    },
    {
      email: 'jane.smith@example.com',
      event: 'Webinar',
      birthday: '1985-11-23',
      holiday: 'Easter',
      frequency: 14,
    },
    {
      email: 'alice.wang@example.com',
      event: 'Workshop',
      birthday: '1992-03-08',
      holiday: 'Thanksgiving',
      frequency: 30,
    },
    {
      email: 'bob.jones@example.com',
      event: 'Seminar',
      birthday: '1988-07-19',
      holiday: 'New Year',
      frequency: 7,
    },
    {
      email: 'lucy.lee@example.com',
      event: 'Meetup',
      birthday: '1995-09-15',
      holiday: 'Independence Day',
      frequency: 21,
    },
  ];

  return (
    <TableContainer component={Paper} style={{ maxWidth: 900, margin: '2rem auto' }}>
      <Table sx={{ tableLayout: 'fixed' }} aria-label="settings table">
        <TableHead>
          <TableRow>
            <StyledTableCell>Email</StyledTableCell>
            <StyledTableCell>Event</StyledTableCell>
            <StyledTableCell>Birthday</StyledTableCell>
            <StyledTableCell>Holiday</StyledTableCell>
            <StyledTableCell>Frequency (days)</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row, idx) => (
            <TableRow key={idx}>
              <StyledTableCell>{row.email}</StyledTableCell>
              <StyledTableCell>{row.event}</StyledTableCell>
              <StyledTableCell>{row.birthday}</StyledTableCell>
              <StyledTableCell>{row.holiday}</StyledTableCell>
              <StyledTableCell>{row.frequency}</StyledTableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
