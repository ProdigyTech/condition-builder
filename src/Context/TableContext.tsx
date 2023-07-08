import { useMemo, createContext } from "react";

import { useDataContext } from "./DataContext";

interface ITableContext {}

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
    return Object.keys(transformedData);
  }, [transformedData]);

  const values = {
    transformedData,
    columns,
  };

  return (
    <TableContext.Provider value={values}>{children}</TableContext.Provider>
  );
};
