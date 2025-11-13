import React from "react";
import { Button, Box, Typography, Paper, Table, TableHead, TableBody, TableFooter, TableRow, TableContainer, TablePagination } from "@mui/material";
import Skeleton from '@mui/material/Skeleton';
import StyledTableCell from "../components/StyledTableCell";
import TablePaginationActions from "../components/TablePaginationActions";

const LogsTable = ({
  logs,
  loading,
  page,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange,
  onViewLog
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

  if (logs.length === 0) {
    return (
      <Paper sx={{ p: 4, textAlign: 'left' }}>
        <Typography variant="h6" color="text.secondary">
          No logs found
        </Typography>
      </Paper>
    );
  }

  return (
    <TableContainer component={Paper}>
      <Table sx={{ maxWidth: 1500, tableLayout: "fixed" }} aria-label="logs table">
        <TableHead>
          <TableRow style={{ backgroundColor: "#20dbe4" }}>
            <StyledTableCell align="left">Created</StyledTableCell>
            <StyledTableCell align="left">Users Affected</StyledTableCell>
            <StyledTableCell align="left">View</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {(rowsPerPage > 0
            ? logs.slice(
                page * rowsPerPage,
                page * rowsPerPage + rowsPerPage
              )
            : logs
          ).map((log) => (
            <TableRow key={log.id}>
              <StyledTableCell component="th" scope="row" align="left">
                {log.createdAt?.toLocaleString() || 'N/A'}
              </StyledTableCell>
              <StyledTableCell align="left">
                {log.contacts?.length || 0}
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
                    padding: "0xp 8px"
                  }}
                  onClick={() => onViewLog(log)}
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
              colSpan={3}
              count={logs.length}
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

export default LogsTable;