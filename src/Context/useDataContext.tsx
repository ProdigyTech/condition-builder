import { useContext } from "react";
import { DataContext, IDataContext } from "./DataContext";

export const useDataContext = (): IDataContext => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error("useDataContext must be used within a DataProvider");
  }
  return context;
};
