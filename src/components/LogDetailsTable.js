import React from "react";
import { Button, Box, Typography, Paper, Table, TableHead, TableBody, TableFooter, TableRow, TableContainer, TablePagination } from "@mui/material";
import Skeleton from '@mui/material/Skeleton';
import StyledTableCell from "../components/StyledTableCell";
import TablePaginationActions from "../components/TablePaginationActions";

const LogDetailsTable = ({
  logDetails,
  loading,
  page,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange,
  onViewUser
}) => {
  const handleChangePage = (event, newPage) => {
    onPageChange(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    onRowsPerPageChange(parseInt(event.target.value, 10));
    onPageChange(0);
  };

  if (loading) {
    return (
      <center>
        <Box sx={{ width: 300 }}>
          <Skeleton />
          <Skeleton animation="wave" />
          <Skeleton animation={false} />
        </Box>
      </center>
    );
  }

  if (logDetails.length === 0) {
    return (
      <Paper sx={{ p: 4, textAlign: 'left' }}>
        <Typography variant="h6" color="text.secondary">
          No log details found
        </Typography>
      </Paper>
    );
  }

  return (
    <TableContainer component={Paper}>
      <Table sx={{ maxWidth: 1500, tableLayout: "fixed" }} aria-label="log details table">
        <TableHead>
          <TableRow style={{ backgroundColor: "#20dbe4" }}>
            <StyledTableCell align="left">Email</StyledTableCell>
            <StyledTableCell align="left">Name</StyledTableCell>
            <StyledTableCell align="left">Birthday</StyledTableCell>
            <StyledTableCell align="left">Send Date</StyledTableCell>
            <StyledTableCell align="left">View</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {(rowsPerPage > 0
            ? logDetails.slice(
                page * rowsPerPage,
                page * rowsPerPage + rowsPerPage
              )
            : logDetails
          ).map((detail) => (
            <TableRow key={detail.contactId || detail.id}>
              <StyledTableCell component="th" scope="row" align="left">
                {detail.contactEmail || detail.email}
              </StyledTableCell>
              <StyledTableCell align="left">
                {detail.contactName || detail.name}
              </StyledTableCell>
              <StyledTableCell align="left">
                {detail.birthday || 'N/A'}
              </StyledTableCell>
              <StyledTableCell align="left">
                {detail.sendDate ? new Date(detail.sendDate).toLocaleString() : 'N/A'}
              </StyledTableCell>
              <StyledTableCell align="left">
                <Button
                  variant="contained"
                  size="small"
                  style={{
                    background: "#20dbe4",
                    color: "white",
                    fontSize: "12px",
                    boxShadow: 'none',
                  }}
                  onClick={() => onViewUser(detail)}
                >
                  VIEW
                </Button>
              </StyledTableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25, { label: "All", value: -1 }]}
              colSpan={5}
              count={logDetails.length}
              rowsPerPage={rowsPerPage}
              page={page}
              SelectProps={{
                inputProps: {
                  "aria-label": "rows per page",
                },
                native: true,
              }}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              ActionsComponent={TablePaginationActions}
            />
          </TableRow>
        </TableFooter>
      </Table>
    </TableContainer>
  );
};

export default LogDetailsTable;