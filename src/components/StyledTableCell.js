import { styled } from "@mui/styles";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "#20dbe4",
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

export default StyledTableCell;