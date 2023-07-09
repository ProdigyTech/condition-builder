/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */

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
  shouldDisplayGrid: boolean;
  total: number;
  filtered: number;
}

export const TableContext = createContext<ITableContext | null>(null);

export const TableProvider: React.FC = ({ children }) => {
  const { isLoading, data, isUrlValid } = useDataContext();

  const [originalRows, setOriginalRows] = useState([]);
  const [shouldDisplayGrid, setShouldDisplayGrid] = useState(false);
  const [filters, setFilter] = useState({ shouldFilter: false });
  const [filteredData, setFilteredData] = useState([]);
  const [rows, setRows] = useState([]);

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
  }, [data, isLoading, rowBuilder]);

  useEffect(() => {
    if (!originalRows.length) {
      setOriginalRows(formatRows);
    }
  }, [formatRows]);

  useEffect(() => {
    setRows(formatRows);
  }, [formatRows]);

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

  const applyFilter = (filters) => {
    console.log(filters)
    const filtered = originalRows.filter((item: { [x: string]: any }) => {
      return filters.every((filter) => {
        const { conditions = [] } = filter;
        return conditions.some((f) => {
          const { filterOn, operator, conditionValue } = f;
          const itemValue = item[filterOn];

          if (!conditionValue?.length) {
            return true;
          }

          switch (operator) {
            case "1": // Equals
              if (Number.parseInt(conditionValue)) {
                return (
                  Number.parseInt(itemValue) === Number.parseInt(conditionValue)
                );
              } else {
                return itemValue.toLowerCase() === conditionValue.toLowerCase();
              }

            case "2": // Greater than
              return (
                Number.parseInt(itemValue) > Number.parseInt(conditionValue)
              );

            case "3": // Less than
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
  };

  const values = {
    rows: rows,
    columns,
    shouldDisplayGrid,
    total: originalRows.length,
    filtered: rows.length,
    applyFilter,
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
