


import { useContext } from "react";
import { TableContext, ITableContext } from "./TableContext";

export const useTableContext = (): ITableContext => {
  const context = useContext(TableContext);

  if (!context) {
    throw new Error("useTableContext must be used within a TableProvider");
  }
  return context;
};
