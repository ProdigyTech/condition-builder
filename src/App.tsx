import "./App.css";
import { DataLoader, Table, ConditionBuilder } from "@Components";
import { DataProvider } from "@Context/DataContext";
import { TableProvider } from "@Context/TableContext";
import { Grid } from "@mui/material";
import { styled } from "@mui/system";


const StyledGrid = styled(Grid)({
 margin: "2rem",
})


function App() {
  return (
    <StyledGrid className="app-grid" container rowSpacing={2}>
      <Grid item xs={8}>
        <h1>Condition Builder</h1>
      </Grid>
      <DataProvider>
        <Grid item xs={8}>
          <DataLoader />
        </Grid>
        <TableProvider>
          <Grid style={{ marginTop: "2em" }} item xs={8}>
            <ConditionBuilder />
          </Grid>
          <Grid item xs={8}>
            <Table />
          </Grid>
        </TableProvider>
      </DataProvider>
    </StyledGrid>
  );
}

export default App;
