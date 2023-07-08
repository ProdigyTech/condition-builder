//import "./App.css";
import { ConditionBuilder, DataLoader } from "@Components";
import { DataProvider } from "@Context/DataContext";
import { TableProvider } from "@Context/TableContext";

function App() {
  return (
    <DataProvider>
      <TableProvider>
        <DataLoader />
        <ConditionBuilder />
      </TableProvider>
    </DataProvider>
  );
}

export default App;
