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
import { Button } from "@material-ui/core";
import { useNavigate } from "react-router-dom";
import Skeleton from "@mui/material/Skeleton";

import { notifyErrorFxn } from "src/utils/toast-fxn";

import { useDispatch } from "react-redux";

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
    backgroundColor: "#20dbe4",
    color: theme.palette.common.white,
    width: "auto",
    textAlign: "left",
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
    width: "auto",
    textAlign: "left",
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
  { id: 2, title: "MERN Stack Developer", fulldate: "01/01/2022" },
  { id: 3, title: "Flutter Developer", fulldate: "01/01/2022" },
].sort((a, b) => (a.title < b.title ? -1 : 1));

export default function CJobList() {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const [companiesData, setCompaniesData] = useState([]);
  const [companiesLoading, setCompaniesLoading] = useState(true);

  const [companyPage, setCompanyPage] = React.useState(0);
  const [companyRowsPerPage, setCompanyRowsPerPage] = React.useState(5);

  useEffect(() => {
    const fetchCompaniesData = async () => {
      try {
        setCompaniesLoading(true);
        const snapshot = await db.collection("companies").get();
        const companies = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setCompaniesData(companies);
      } catch (error) {
        console.error("Error fetching companies data: ", error);
        notifyErrorFxn("Failed to fetch company data");
      } finally {
        setCompaniesLoading(false);
      }
    };

    fetchCompaniesData();
  }, []);

  const navigate = useNavigate();

  const handleCompanyChangePage = (event, newPage) => {
    setCompanyPage(newPage);
  };

  const handleCompanyChangeRowsPerPage = (event) => {
    setCompanyRowsPerPage(parseInt(event.target.value, 10));
    setCompanyPage(0);
  };

  const viewContactFxn = (company) => {
    const companyIdForMatching = company.companyID;

    if (!companyIdForMatching) {
      notifyErrorFxn("Company ID not found in company record");
      return;
    }

    navigate("/dashboard/company-users", {
      state: {
        companyId: companyIdForMatching,
        companyName: company.companyName || company.name,
      },
    });
  };

  const handleAddCompany = () => {
    navigate("/dashboard/add-company");
  };

  return (
    <>
      <br />
      <p
        style={{
          fontSize: "26px",
          marginLeft: "5px",
          marginBottom: "1rem",
          color: "black",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <b>COMPANIES</b>

        <Button
          type="button"
          variant="contained"
          style={{
            background: "#20dbe4",
            color: "white",
            width: "17%",
            fontSize: "15px",
          }}
          sx={{ mt: 7, mb: 2 }}
          onClick={handleAddCompany}
        >
          ADD COMPANY
        </Button>
      </p>
      <br />
      <hr />

      {companiesLoading ? (
        <center>
          <Box sx={{ width: 300 }}>
            <Skeleton />
            <Skeleton animation="wave" />
            <Skeleton animation={false} />
          </Box>
        </center>
      ) : (
        <TableContainer component={Paper}>
          <Table
            sx={{ maxWidth: 1500, tableLayout: "fixed" }}
            aria-label="companies pagination table"
          >
            <TableHead>
              <TableRow style={{ backgroundColor: "#20dbe4" }}>
                <StyledTableCell>Company Name</StyledTableCell>
                <StyledTableCell align="left">Email</StyledTableCell>
                <StyledTableCell align="left">Company ID</StyledTableCell>
                <StyledTableCell align="left">Date</StyledTableCell>
                <StyledTableCell align="left">View</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {(companyRowsPerPage > 0
                ? companiesData.slice(
                    companyPage * companyRowsPerPage,
                    companyPage * companyRowsPerPage + companyRowsPerPage,
                  )
                : companiesData
              ).map((company) => (
                <TableRow key={company.id || Math.random()}>
                  <StyledTableCell
                    style={{
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      maxWidth: 200,
                    }}
                    component="th"
                    scope="row"
                    align="left"
                  >
                    {company.companyName ||
                      company.name ||
                      (company.firstName &&
                        company.lastName &&
                        `${company.firstName} ${company.lastName}`) ||
                      company.fullName ||
                      company.displayName ||
                      company.email ||
                      "-"}
                  </StyledTableCell>
                  <StyledTableCell align="left">
                    {company.email || company.companyContact || "-"}
                  </StyledTableCell>
                  <StyledTableCell align="left">
                    {company.companyID || "-"}
                  </StyledTableCell>
                  <StyledTableCell align="left">
                    {company.createdAt && typeof company.createdAt !== "string"
                      ? new Date(
                          company.createdAt.seconds * 1000,
                        ).toDateString()
                      : (company.dateCreated &&
                        typeof company.dateCreated !== "string"
                          ? new Date(
                              company.dateCreated.seconds * 1000,
                            ).toDateString()
                          : typeof company.dateCreated === "string" &&
                            company.dateCreated) ||
                        company.date ||
                        "-"}
                  </StyledTableCell>
                  <StyledTableCell align="left">
                    <Button
                      variant="contained"
                      size="small"
                      style={{
                        background: "#20dbe4",
                        color: "white",
                        fontSize: "12px",
                      }}
                      onClick={() => viewContactFxn(company)}
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
                  count={companiesData.length}
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
    </>
  );
}
