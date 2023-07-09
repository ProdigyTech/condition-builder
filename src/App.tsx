import "./App.css";
import { DataLoader, Table } from "@Components";
import { ConditionBuilder } from "./Components/Conditions/";
import { DataProvider } from "@Context/DataContext";
import { TableProvider } from "@Context/TableContext";
import { Grid } from "@mui/material";

function App() {
  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <h1>Condition Builder</h1>
      </Grid>
      <DataProvider>
        <Grid item xs={10}>
          <DataLoader />
        </Grid>
        <TableProvider>
          <Grid item xs={10}>
            <ConditionBuilder />
          </Grid>
          <Grid item xs={12}>
            <Table />
          </Grid>
        </TableProvider>
      </DataProvider>
    </Grid>
  );
}

export default App;
