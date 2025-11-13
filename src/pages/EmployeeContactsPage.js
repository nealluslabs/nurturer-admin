import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from 'react-router-dom';
import PropTypes from "prop-types";
import { useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableFooter from "@mui/material/TableFooter";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import IconButton from "@mui/material/IconButton";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import LastPageIcon from "@mui/icons-material/LastPage";
import { styled } from "@mui/styles";
import { Button, Container, Typography } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Skeleton from '@mui/material/Skeleton';
import { notifyErrorFxn } from 'src/utils/toast-fxn';
import { useDispatch, useSelector } from 'react-redux';
import { fetchEmployeeContacts } from 'src/redux/actions/user.action';

function TablePaginationActions(props) {
  const theme = useTheme();
  const { count, page, rowsPerPage, onPageChange } = props;

  const handleFirstPageButtonClick = (event) => {
    onPageChange(event, 0);
  };

  const handleBackButtonClick = (event) => {
    onPageChange(event, page - 1);
  };

  const handleNextButtonClick = (event) => {
    onPageChange(event, page + 1);
  };

  const handleLastPageButtonClick = (event) => {
    onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
  };

  return (
    <Box sx={{ flexShrink: 0, ml: 2.5 }}>
      <IconButton
        onClick={handleFirstPageButtonClick}
        disabled={page === 0}
        aria-label="first page"
      >
        {theme.direction === "rtl" ? <LastPageIcon /> : <FirstPageIcon />}
      </IconButton>
      <IconButton
        onClick={handleBackButtonClick}
        disabled={page === 0}
        aria-label="previous page"
      >
        {theme.direction === "rtl" ? (
          <KeyboardArrowRight />
        ) : (
          <KeyboardArrowLeft />
        )}
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="next page"
      >
        {theme.direction === "rtl" ? (
          <KeyboardArrowLeft />
        ) : (
          <KeyboardArrowRight />
        )}
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="last page"
      >
        {theme.direction === "rtl" ? <FirstPageIcon /> : <LastPageIcon />}
      </IconButton>
    </Box>
  );
}

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "#20dbe4",
    color: theme.palette.common.white,
    width: 'auto',
    textAlign: 'left',
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
    width: 'auto',
    textAlign: 'left',
  },
}));

TablePaginationActions.propTypes = {
  count: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
  page: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired,
};

export default function EmployeeContactsPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { contacterId, userName } = location.state || {};

  const { employeeContacts, loading, error } = useSelector(state => state.contacts);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  useEffect(() => {
    if (contacterId) {
      dispatch(fetchEmployeeContacts(contacterId));
    }
  }, [contacterId, dispatch]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleBackToUsers = () => {
    navigate('/dashboard/company-users');
  };

  if (!contacterId) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h6" color="error">
          No user selected. Please go back and select a user.
        </Typography>
        <Button
          variant="contained"
          onClick={handleBackToUsers}
          sx={{ mt: 2 }}
        >
          Back to Users
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <IconButton
          onClick={handleBackToUsers}
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
            {userName || contacterId} (Contacts)
          </Typography>
        </Box>
      </Box>

      {loading ? (
        <center>
          <Box sx={{ width: 300 }}>
            <Skeleton />
            <Skeleton animation="wave" />
            <Skeleton animation={false} />
          </Box>
        </center>
      ) : employeeContacts.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'left' }}>
          <Typography variant="h6" color="text.secondary">
            No contacts found for {userName || `User ID: ${contacterId}`}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Contacter ID: {contacterId}
          </Typography>
        </Paper>
      ) : (
        <TableContainer component={Paper}>
          <Table sx={{ maxWidth: 1500, tableLayout: "fixed" }} aria-label="employee contacts table">
            <TableHead>
              <TableRow style={{ backgroundColor: "#20dbe4" }}>
                <StyledTableCell>Contact Name</StyledTableCell>
                <StyledTableCell align="left">Email</StyledTableCell>
                <StyledTableCell align="left">Phone</StyledTableCell>
                <StyledTableCell align="left">Company</StyledTableCell>
                <StyledTableCell align="left">Date Added</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {(rowsPerPage > 0
                ? employeeContacts.slice(
                    page * rowsPerPage,
                    page * rowsPerPage + rowsPerPage
                  )
                : employeeContacts
              ).map((contact) => (
                <TableRow key={contact.id || Math.random()}>
                  <StyledTableCell component="th" scope="row">
                    {contact.fullName
                      || (contact.firstName && contact.lastName && `${contact.firstName} ${contact.lastName}`)
                      || contact.displayName
                      || contact.name
                      || contact.email
                      || "-"}
                  </StyledTableCell>
                  <StyledTableCell>
                    {contact.email || "-"}
                  </StyledTableCell>
                  <StyledTableCell>
                    {contact.phone || contact.phoneNumber || "-"}
                  </StyledTableCell>
                  <StyledTableCell>
                    {contact.company || contact.companyName || "-"}
                  </StyledTableCell>
                  <StyledTableCell>
                    {contact.createdAt && typeof contact.createdAt !== "string"
                      ? new Date(contact.createdAt.seconds * 1000).toDateString()
                      : (contact.dateAdded && typeof contact.dateAdded !== "string"
                          ? new Date(contact.dateAdded.seconds * 1000).toDateString()
                          : (typeof contact.dateAdded === "string" && contact.dateAdded)
                        ) || contact.date || "-"}
                  </StyledTableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TablePagination
                  rowsPerPageOptions={[5, 10, 25, { label: "All", value: -1 }]}
                  colSpan={5}
                  count={employeeContacts.length}
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
      )}
    </Container>
  );
}