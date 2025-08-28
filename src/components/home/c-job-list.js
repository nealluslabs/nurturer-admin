import React, { useEffect, useState } from "react";
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
import { Button, Grid, makeStyles } from "@material-ui/core";
import { Link, NavLink, useNavigate} from "react-router-dom";
//import SearchBar from "material-ui-search-bar";
//import useRequest from "../../hooks/use-request";
import { fetchJobs, getSingleStudent } from "../../redux/actions/job.action";
import { fetchAllUsers } from "../../redux/actions/user.action";
import Skeleton from '@mui/material/Skeleton';
import {Typography,CardMedia,} from '@material-ui/core';
//import CoolerBoxIMG from '../../assets/images/save-money.png';

import { notifyErrorFxn, notifySuccessFxn } from 'src/utils/toast-fxn';

import { useDispatch, useSelector } from "react-redux";

import { deleteSingleJob } from "../../redux/actions/job.action";

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
    width: '33.33%',
    textAlign: 'center',
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
    width: '33.33%',
    textAlign: 'center',
  },
}));

TablePaginationActions.propTypes = {
  count: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
  page: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired,
};

const originalJobList = [
  { id: 1, title: "Java Developer", fulldate: "01/01/2022" },
  { id: 2, title: "MERN Stack Developer", fulldate: "01/01/2022"},
  { id: 3, title: "Flutter Developer", fulldate: "01/01/2022"},
].sort((a, b) => (a.title < b.title ? -1 : 1));

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
});

export default function CJobList({ jobs }) {
  //search function
  const dispatch = useDispatch();
  const [jobList, setJobList] = useState(jobs);
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);
  
  // Company/Contacts state
  const [contactsData, setContactsData] = useState([]);
  const [contactsLoading, setContactsLoading] = useState(true);
  
  // Pagination for companies table
  const [companyPage, setCompanyPage] = React.useState(0);
  const [companyRowsPerPage, setCompanyRowsPerPage] = React.useState(5);


  useEffect(() => {
    // Fetch users from firebase using redux action (pattern used in codebase)
    const fetchData = async () => {
      try {
        // You may need to pass the current user's uid if required by fetchAllUsers
        const res = await dispatch(fetchAllUsers());
        if (res && res.payload) {
          setUsers(res.payload);
        }
      } catch (err) {
        // Optionally handle error
      }
    };
    fetchData();
  }, [dispatch]);

  // Fetch contacts data from Firestore
  useEffect(() => {
    const fetchContactsData = async () => {
      try {
        setContactsLoading(true);
        const snapshot = await db.collection("contacts").get();
        const contacts = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        console.log("Contacts data fetched successfully:", contacts);
        setContactsData(contacts);
      } catch (error) {
        console.error("Error fetching contacts data: ", error);
        notifyErrorFxn("Failed to fetch company data");
      } finally {
        setContactsLoading(false);
      }
    };

    fetchContactsData();
  }, []);

  const [searched, setSearched] = useState("");
  const classes = useStyles();
  const requestSearch = (searchedVal) => {
    const filteredRows = jobs?.filter((row) => {
      return row.title.toLowerCase().includes(searchedVal.toLowerCase());
    });
    setJobList(filteredRows);
  };

  const cancelSearch = () => {
    setSearched("");
    requestSearch(searched);
  };
  //search function end

  const navigate = useNavigate();
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - jobList.length) : 0;

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Company table pagination handlers
  const handleCompanyChangePage = (event, newPage) => {
    setCompanyPage(newPage);
  };

  const handleCompanyChangeRowsPerPage = (event) => {
    setCompanyRowsPerPage(parseInt(event.target.value, 10));
    setCompanyPage(0);
  };

  const viewContactFxn = (id) => {
    console.log("View contact:", id);
    // Add navigation logic for viewing contact details
  };
  const viewStudentFxn = (id) => {

    setLoading(true)
    dispatch(getSingleStudent(id))

   setTimeout(() =>{navigate(`/dashboard/student-stats/`,{ state: { id:id } })},2500);
  };

  const deleteJobFxn = (id) => {
   const preserveId = id
    
  if(window.confirm("are you sure you want to delete this user?")){
   
    //dispatch(deleteSingleJob(id)); 
    
    notifySuccessFxn("Employee Successfully Deleted!");
    
   setTimeout(function(){window.location.reload()},3000);
     
  }
}
  



  return (
    <>
        {
          jobs ? 
          <>
      
      {/* COMPANY TABLE */}
      <br/>
      <p 
        style={{
          fontSize: '26px', marginLeft: '5px',marginBottom:"1rem", color: 'black',display:"flex",justifyContent:"space-between"
        }}
      >
        <b>COMPANIES</b>   
      
      <Button
        type="button"
        variant="contained"
        style={{
          background: "linear-gradient(to right, #000000, #333333)",
          color: "white",
          width: "17%",
          fontSize: "15px",
        }}
        sx={{ mt: 7, mb: 2 }}
      >
        FILTER
      </Button></p><br/>
      <hr />
      
      {contactsLoading ? (
        <center>
          <Box sx={{ width: 300 }}>
            <Skeleton />
            <Skeleton animation="wave" />
            <Skeleton animation={false} />
          </Box>
        </center>
      ) : (
        <TableContainer component={Paper}>
          <Table sx={{ maxWidth: 1500,tableLayout:"fixed" }} aria-label="companies pagination table">
            <TableHead>
              <TableRow>
                <StyledTableCell>Name</StyledTableCell>
                <StyledTableCell align="right">Email</StyledTableCell>
                <StyledTableCell align="right">Date</StyledTableCell>
                <StyledTableCell align="right">View</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {(companyRowsPerPage > 0
                ? contactsData.slice(
                    companyPage * companyRowsPerPage,
                    companyPage * companyRowsPerPage + companyRowsPerPage
                  )
                : contactsData
              ).map((contact) => (
                <TableRow key={contact.id || Math.random()}>
                  <StyledTableCell component="th" scope="row">
                    {contact.name 
                      || contact.companyName 
                      || contact.firstName && contact.lastName && `${contact.firstName} ${contact.lastName}`
                      || contact.fullName
                      || contact.displayName
                      || contact.email
                      || "-"}
                  </StyledTableCell>
                  <StyledTableCell>
                    {contact.email || "-"}
                  </StyledTableCell>
                  <StyledTableCell>
                    {contact.createdAt && typeof contact.createdAt !== "string"
                      ? new Date(contact.createdAt.seconds * 1000).toDateString()
                      : (contact.dateCreated && typeof contact.dateCreated !== "string"
                          ? new Date(contact.dateCreated.seconds * 1000).toDateString()
                          : (typeof contact.dateCreated === "string" && contact.dateCreated)
                        ) || contact.date || "-"}
                  </StyledTableCell>
                  <StyledTableCell>
                    <Button
                      variant="contained"
                      size="small"
                      style={{
                        background: "linear-gradient(to right, #000000, #333333)",
                        color: "white",
                        fontSize: "12px",
                      }}
                      onClick={() => viewContactFxn(contact.id)}
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
                  colSpan={4}
                  count={contactsData.length}
                  rowsPerPage={companyRowsPerPage}
                  page={companyPage}
                  SelectProps={{
                    inputProps: {
                      "aria-label": "rows per page",
                    },
                    native: true,
                  }}
                  onPageChange={handleCompanyChangePage}
                  onRowsPerPageChange={handleCompanyChangeRowsPerPage}
                  ActionsComponent={TablePaginationActions}
                />
              </TableRow>
            </TableFooter>
          </Table>
        </TableContainer>
      )}

      {/* USERS TABLE */}      
      <br/><br/>
      <p 
        style={{
          fontSize: '26px', marginLeft: '5px',marginBottom:"1rem", color: 'black',display:"flex",justifyContent:"space-between"
        }}
      >
        <b>ALL USERS</b>   
      
      <Button
                   
        type="button"
        // fullWidth
        variant="contained"
        style={{
          background: "linear-gradient(to right, #000000, #333333)",
          color: "white",
          width: "17%",
          fontSize: "15px",
        }}
        sx={{ mt: 7, mb: 2 }}
        
      >
        FILTER
      </Button></p><br/>
      <hr />
      <TableContainer component={Paper}>
        <Table sx={{ maxWidth: 1500,tableLayout:"fixed" }} aria-label="custom pagination table">
          <TableHead>
            <TableRow>
              <StyledTableCell>Name</StyledTableCell>
              <StyledTableCell align="right">Email</StyledTableCell>
              <StyledTableCell align="right">Date</StyledTableCell>
              {/*<StyledTableCell align="right">Industry</StyledTableCell>
              <StyledTableCell align="center">State</StyledTableCell>*/}
            </TableRow>
          </TableHead>
          <TableBody>
            {(rowsPerPage > 0
              ? jobs.slice(
                  page * rowsPerPage,
                  page * rowsPerPage + rowsPerPage
                )
              : jobs
            ).map((job) => (
              <TableRow key={job.id || Math.random()}>
                <StyledTableCell component="th" scope="row">
                  {job.fullName
                    || (job.firstName && job.lastName && `${job.firstName} ${job.lastName}`)
                    || job.displayName
                    || job.name
                    || job.username
                    || job.title
                    || job.email
                    || "-"}
                </StyledTableCell>
                <StyledTableCell>
                  {job.email || "-"}
                </StyledTableCell>
                <StyledTableCell>
                  {job.registeredOn && typeof job.registeredOn !== "string"
                    ? new Date(job.registeredOn.seconds * 1000).toDateString()
                    : (job.accountCreated && typeof job.accountCreated !== "string"
                        ? new Date(job.accountCreated.seconds * 1000).toDateString()
                        : (typeof job.accountCreated === "string" && job.accountCreated)
                      ) || job.fulldate || "-"}
                </StyledTableCell>
              </TableRow>
            ))}

            {/*emptyRows > 0 && (
              <TableRow style={{ height: 53 * emptyRows }}>
                <TableCell colSpan={6} />
              </TableRow>
            )*/}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TablePagination
                rowsPerPageOptions={[5, 10, 25, { label: "All", value: -1 }]}
                colSpan={3}
                count={jobList.length}
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
     
          </>
          :
          <center>
          <Box sx={{ width: 300 }}>
          <Skeleton />
          <Skeleton animation="wave" />
          <Skeleton animation={false} />
        </Box>
        </center>
        }

    </>
  );
}
