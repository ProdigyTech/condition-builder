import {
  useMemo,
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";

import { useDataContext, DataContext } from "./DataContext";

interface ITableContext {
  rows: [];
  columns: [];
}

const TableContext = createContext<ITableContext | null>(null);

export const TableProvider: React.FC = ({ children }) => {
  const { isLoading, data, isUrlValid } = useDataContext();

  const [shouldDisplayGrid, setShouldDisplayGrid] = useState(false);

  useEffect(() => {
    if (isUrlValid) {
      setShouldDisplayGrid(true);
    } else {
      setShouldDisplayGrid(false);
    }
  }, [isUrlValid]);

  // rowBuilder takes params, don't use scoped values. generate function sig only once
  const rowBuilder = useCallback((keys, values, index) => {
    let row = { id: index };

    values.forEach((val, i) => {
      row = { ...row, [keys[i]]: val };
    });

    return row;
  }, []);

  const rows = useMemo(() => {
    if (isLoading) return [];

    if (data) {
      const formattedRows = data.map((k, i) => {
        // do we need to grab the keys every time?
        const keys = Object.keys(k);
        const values = Object.values(k);

        // assuming order is the same between obj,keys and obj.values
        return rowBuilder(keys, values, i);
      });

      return formattedRows;
    }

    return [];
  }, [data, isLoading]);

  const columns = useMemo(() => {
    if (isLoading) return [];

    if (data) {
      const keys = Object.keys(data[0]);
      return keys.map((k) => {
        return {
          field: k,
          headerName: k,
          width: 150,
          editable: false,
        };
      });
    }
  }, [data]);

  const values = {
    rows,
    columns,
    shouldDisplayGrid,
  };

  return (
    <TableContext.Provider value={values}>{children}</TableContext.Provider>
  );
};

export const useTableContext = (): ITableContext => {
  const context = useContext(TableContext);
  const dataContext = useContext(DataContext);

  if (!context || !dataContext) {
    throw new Error(
      "useTableContext must be used within a TableProvider and DataProvider"
    );
  }
  return context;
};
