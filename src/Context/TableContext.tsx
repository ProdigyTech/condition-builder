import { useMemo, createContext, useContext } from "react";

import { useDataContext, DataContext } from "./DataContext";

interface ITableContext {
  transformedData: [];
  columns: [];
}

const TableContext = createContext<ITableContext | null>(null);

export const TableProvider: React.FC = ({ children }) => {
  const { isLoading, data } = useDataContext();

  const transformedData = useMemo(() => {
    if (isLoading) return {};

    if (data) {
      const formattedData = data.reduce((acc, k) => {
        const arr = Object.entries(k);
        // todo, nested loop, find a better way to handle this.
        arr.forEach((kv) => {
          const [k, v] = kv;

          if (acc[k]) {
            acc[k] = [...acc[k], v];
          } else {
            acc[k] = [v];
          }
        });

        return acc;
      }, {});

      return formattedData;
    }

    return {};
  }, [data, isLoading]);

  const columns = useMemo(() => {
    const keys = Object.keys(transformedData);

    return keys.map((k) => ({
      value: k,
      label: k,
    }));
  }, [transformedData]);

  const values = {
    transformedData,
    columns,
  };

  return (
    <TableContext.Provider value={values}>{children}</TableContext.Provider>
  );
};

export const useTableContext = (): ITableContext => {
  const context = useContext(TableContext);
  const dataContext = useContext(DataContext);

  if (!context || !dataContext) {
    throw new Error("useTableContext must be used within a TableProvider and DataProvider");
  }
  return context;
};
