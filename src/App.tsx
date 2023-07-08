//import "./App.css";
import { ConditionBuilder, DataLoader } from "@Components";
import { DataProvider } from "@Context/DataContext";
function App() {
  return (
    <DataProvider>
      <DataLoader />
      <ConditionBuilder />
    </DataProvider>
  );
}

export default App;
