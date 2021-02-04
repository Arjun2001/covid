import React from 'react';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@material-ui/core';

const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  body: {
    fontSize: 14,
  },
}))(TableCell);

const StyledTableRow = withStyles((theme) => ({
  root: {
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.action.hover,
    },
  },
}))(TableRow);

function createData(name, total, active, cured, death) {
  return { name, total, active, cured, death };
}


const useStyles = makeStyles({
  table: {
    minWidth: 700,
  },
});

export default function CustomizedTables({ states }) {
  const classes = useStyles();

  const rows = [];

//   const sortData = (data) => {
//     const sortedData = [...data];
//     sortedData.sort((a, b) => {
//         if(a.cases > b.cases) {
//             return -1;
//         } else {
//             return 1;
//         }
//     });
//     return sortedData;
// };

    const sorted = [...states];
    sorted.sort((a, b) => {
        if(a.total > b.total) {
            return -1;
        } else {
            return 1;
        }
    });

  sorted.map((state, index) => {
      if ( index !==0 )
      rows.push(createData(state.name, state.total, state.active, state.cured, state.death));
  });

  return (
    <TableContainer component={Paper} className="india-table">
      <Table className={classes.table} aria-label="customized table" stickyHeader >
        <TableHead>
          <TableRow>
            <StyledTableCell>Name of the state</StyledTableCell>
            <StyledTableCell align="right">Total</StyledTableCell>
            <StyledTableCell align="right">Active</StyledTableCell>
            <StyledTableCell align="right">Cured</StyledTableCell>
            <StyledTableCell align="right">Death</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <StyledTableRow key={row.name}>
              <StyledTableCell component="th" scope="row">
                {row.name}
              </StyledTableCell>
              <StyledTableCell align="right">{row.total}</StyledTableCell>
              <StyledTableCell align="right">{row.active}</StyledTableCell>
              <StyledTableCell align="right">{row.cured}</StyledTableCell>
              <StyledTableCell align="right">{row.death}</StyledTableCell>
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
