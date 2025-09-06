import React, { use, useEffect, useState } from "react";
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

// Firestore DB
import { db } from "src/config/firebase";

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
    backgroundColor: '#000000',
    color: theme.palette.common.white,
    width: 'auto',
    textAlign: 'center',
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
    width: 'auto',
    textAlign: 'center',
  },
}));

TablePaginationActions.propTypes = {
  count: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
  page: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired,
};

export default function CompanyUsersPage() {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Get company data from navigation state
  const { companyId, companyName } = location.state || {};
  
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  console.log("Users:", users);

  // Fetch users belonging to the specific company
  useEffect(() => {
    const fetchCompanyUsers = async () => {
      if (!companyId) {
        notifyErrorFxn("No company selected");
        navigate('/dashboard/user');
        return;
      }

      try {
        setLoading(true);
        
        const snapshot = await db.collection("users").get();
        
        const allUsers = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        console.log("All users fetched from database:", allUsers);

        console.log(companyId)
        
        const companyUsers = allUsers.filter(user => user.companyId != companyId);
        
        companyUsers.forEach(user => {
          console.log(`User ${user.id} has companyId: "${user.companyId}"`);
        });
        
        setUsers(companyUsers);
      } catch (error) {
        console.error("Error fetching company users: ", error);
        notifyErrorFxn("Failed to fetch company users");
      } finally {
        setLoading(false);
      }
    };

    fetchCompanyUsers();
  }, [companyId, navigate]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleBackToCompanies = () => {
    navigate('/dashboard/user');
  };

  if (!companyId) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h6" color="error">
          No company selected. Please go back and select a company.
        </Typography>
        <Button 
          variant="contained" 
          onClick={handleBackToCompanies}
          sx={{ mt: 2 }}
        >
          Back to Companies
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* Header with back button */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <IconButton 
          onClick={handleBackToCompanies}
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
            USERS TABLE
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
      ) : users.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" color="text.secondary">
            No users found for this company
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Company ID: {companyId}
          </Typography>
        </Paper>
      ) : (
        <TableContainer component={Paper}>
          <Table sx={{ maxWidth: 1500, tableLayout: "fixed" }} aria-label="company users table">
            <TableHead>
              <TableRow>
                <StyledTableCell>Name</StyledTableCell>
                <StyledTableCell align="right">Email</StyledTableCell>
                <StyledTableCell align="right">Company ID</StyledTableCell>
                <StyledTableCell align="right">Date Registered</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {(rowsPerPage > 0
                ? users.slice(
                    page * rowsPerPage,
                    page * rowsPerPage + rowsPerPage
                  )
                : users
              ).map((user) => (
                <TableRow key={user.id || Math.random()}>
                  <StyledTableCell component="th" scope="row">
                    {user.fullName
                      || (user.firstName && user.lastName && `${user.firstName} ${user.lastName}`)
                      || user.displayName
                      || user.name
                      || user.username
                      || user.email
                      || "-"}
                  </StyledTableCell>
                  <StyledTableCell>
                    {user.email || "-"}
                  </StyledTableCell>
                  <StyledTableCell>
                    {user.companyId || "-"}
                  </StyledTableCell>
                  <StyledTableCell>
                    {user.registeredOn && typeof user.registeredOn !== "string"
                      ? new Date(user.registeredOn.seconds * 1000).toDateString()
                      : (user.accountCreated && typeof user.accountCreated !== "string"
                          ? new Date(user.accountCreated.seconds * 1000).toDateString()
                          : (typeof user.accountCreated === "string" && user.accountCreated)
                        ) || user.fulldate || "-"}
                  </StyledTableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TablePagination
                  rowsPerPageOptions={[5, 10, 25, { label: "All", value: -1 }]}
                  colSpan={4}
                  count={users.length}
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
