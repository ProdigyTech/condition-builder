import "./App.css";
import { ConditionBuilder, DataLoader, Table } from "@Components";
import { DataProvider } from "@Context/DataContext";
import { TableProvider } from "@Context/TableContext";
import { Grid } from "@mui/material";
import { ConditionProvider } from "@Context/ConditionBuilderContext";

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
            <ConditionProvider>
              <ConditionBuilder />
            </ConditionProvider>
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
