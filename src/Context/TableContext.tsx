import {
  useMemo,
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";

import { useDataContext } from "./DataContext";

type TableProviderProps = React.PropsWithChildren;

type ITableContext = {
  rows: [];
  columns: [];
  shouldDisplayGrid: boolean;
  total: number;
  filtered: number;
  isLoading: boolean;
  isReady: boolean;
};

// TODO: move to utils.
const rowBuilder = (keys, values, index) => {
  let row = { id: index };

  values.forEach((val, i) => {
    row = { ...row, [keys[i]]: val };
  });

  return row;
};

export const TableContext = createContext<ITableContext | null>(null);

export const TableProvider = ({ children }: TableProviderProps) => {
  const { isLoading, data, isUrlValid, isReady } = useDataContext();
  const [originalRows, setOriginalRows] = useState([]);
  const [shouldDisplayGrid, setShouldDisplayGrid] = useState(false);
  const [rows, setRows] = useState([]);

  useEffect(() => {
    if (isUrlValid) {
      setShouldDisplayGrid(true);
    } else {
      setShouldDisplayGrid(false);
    }
  }, [isUrlValid]);

  const formatRows = useMemo(() => {
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

  useEffect(() => {
    if (!originalRows.length) {
      setOriginalRows(formatRows);
    }
    setRows(formatRows);
  }, [formatRows, originalRows.length]);

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
  }, [data, isLoading]);

  const applyFilter = useCallback(
    (filters) => {
      const filtered = originalRows.filter((item: { [x: string]: any }) => {
        return filters.every((filter) => {
          const { conditions = [] } = filter;

          return conditions.some((f) => {
            const { filterOn, operator, conditionValue } = f;
            const itemValue = item[filterOn.value];

            if (!conditionValue?.length) {
              return true;
            }

            switch (operator?.value) {
              case "1": // Equals
                if (Number.parseInt(conditionValue)) {
                  return (
                    Number.parseInt(itemValue) ===
                    Number.parseInt(conditionValue)
                  );
                } else {
                  return (
                    itemValue.toLowerCase() === conditionValue.toLowerCase()
                  );
                }

              case "2": // Greater than TODO: Validation, only numbers
                return (
                  Number.parseInt(itemValue) > Number.parseInt(conditionValue)
                );

              case "3": // Less than TODO: Validation, only numbers
                return (
                  Number.parseInt(itemValue) < Number.parseInt(conditionValue)
                );

              case "4": // Contain
                return itemValue.includes(conditionValue);
              case "5": // Not Contain
                return !itemValue.includes(conditionValue);
              case "6": // Regex
                const regex = new RegExp(conditionValue);
                // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
                return regex.test(itemValue);
              default:
                return true;
            }
          });
        });
      });

      setRows(filtered);
    },
    [originalRows]
  );

  const values = {
    rows: rows,
    columns,
    shouldDisplayGrid,
    total: originalRows.length,
    filtered: rows.length,
    applyFilter,
    isLoading,
    isReady,
  };

  return (
    <TableContext.Provider value={values}>{children}</TableContext.Provider>
  );
};

export const useTableContext = (): ITableContext => {
  const context = useContext(TableContext);

  if (!context) {
    throw new Error("useTableContext must be used within a TableProvider");
  }
  return context;
};
