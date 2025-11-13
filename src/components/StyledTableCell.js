import { styled } from "@mui/styles";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";

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

export default StyledTableCell;