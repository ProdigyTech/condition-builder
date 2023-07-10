import "./App.css";
import { DataLoader, Table } from "@Components";
import { ConditionBuilder } from "./Components/Conditions/";
import { DataProvider } from "@Context/DataContext";
import { TableProvider } from "@Context/TableContext";
import { Grid } from "@mui/material";

function App() {
  return (
  
      <Grid container style={{ marginLeft: "2em" }} rowSpacing={2}>
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
      </Grid>
  );
}

export default App;
