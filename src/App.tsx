import "./App.css";
import { ConditionBuilder, DataLoader } from "@Components";
import { DataProvider } from "@Context/DataContext";
import { TableProvider } from "@Context/TableContext";
import { Grid } from "@mui/material";

function App() {
  return (
    <DataProvider>
      <TableProvider>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <h1>Condition Builder</h1>
          </Grid>
          <Grid item xs={10}>
            <DataLoader  />
          </Grid>
          <Grid item xs={8}>
            <ConditionBuilder />
          </Grid>
        </Grid>
      </TableProvider>
    </DataProvider>
  );
}

export default App;
