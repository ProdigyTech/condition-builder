import {
  useMemo,
  createContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { useDataContext } from "./useDataContext";
import { GlobalConditionGroupData } from "../components/conditions/types";
import { ConditionOperator } from "../components/conditions/shared/index";
import { GridValidRowModel } from "@mui/x-data-grid";

type TableProviderProps = React.PropsWithChildren;

type ColumnTypes = {
  field: string;
  headerName: string;
  flex: number;
  editable: boolean;
};

export type ITableContext = {
  rows: GridValidRowModel[];
  originalRows: any[];
  columns: Array<ColumnTypes>;
  shouldDisplayGrid: boolean;
  total: number;
  filtered: number;
  isLoading: boolean;
  isReady: boolean;
  applyConditions: (conditions: Array<GlobalConditionGroupData>) => void;
};

// builds the row for the data grid
const rowBuilder = (
  keys: Array<string>,
  values: Array<string>,
  index: number
) => {
  let row = { id: index };
  values.forEach((val, i) => {
    row = { ...row, [keys[i]]: val };
  });

  return row;
};

export const TableContext = createContext<ITableContext | null>(null);

// The purpose of this context is to transform the data from the data provider for consumption by the table.
// and it exposes a method that conditions aka filters to the data.
export const TableProvider = ({ children }: TableProviderProps) => {
  const { isLoading, data, isUrlValid, isReady } = useDataContext();
  // the purpose of original rows is to store the original data set, so if we remove all conditions
  // we will see the original data.
  const [originalRows, setOriginalRows] = useState<any[]>([]);
  const [rows, setRows] = useState<any[]>([]);

  const [shouldDisplayGrid, setShouldDisplayGrid] = useState(false);

  const formatRows = useMemo(() => {
    if (isLoading) return [];

    if (data) {
      const formattedRows = data.map((k, i: number) => {
        const keys: string[] = Object.keys(k);
        const values: string[] = Object.values(k);

        // assuming order is the same between obj,keys and obj.values
        return rowBuilder(keys, values, i);
      });

      return formattedRows;
    }

    return [];
  }, [data, isLoading]);

  useEffect(() => {
    // Update the shouldDisplayGrid flag based on the URL validity
    // this will initiate the loading skeleton for the dataGrid
    setShouldDisplayGrid(isUrlValid);
  }, [isUrlValid]);

  useEffect(() => {
    // Reset the original rows when the data is null
    if (!data) {
      setOriginalRows([]);
    }
  }, [data]);

  useEffect(() => {
    // Update the rows when the formatted rows change or when the original rows are empty
    if (!originalRows.length) {
      setOriginalRows(formatRows);
    } else {
      setRows(formatRows);
    }
  }, [formatRows, originalRows.length]);

  // we only want to regenerate columns if the data changes or we change loading states
  const columns = useMemo(() => {
    // if we're in the loading state return an empty array
    if (isLoading) return [];

    // if we have data, we want to pull the keys off of the array of object data.
    // we're assuming each object will have the same shape therefore we only pull the keys from the first[0] index of the array.
    if (data?.length) {
      const keys = Object.keys(data[0]);
      return keys.map((key) => {
        return {
          field: key,
          headerName: key,
          flex: 1,
          editable: false,
        };
      });
    }

    return [];
  }, [data, isLoading]);

  /**  
   * This is where the magic happens. this function filters the data based on conditions.
   * This is a little convoluted, the data structure may need to be reworked 
   * i.e flattened since all conditions are linked to a group via group id and there's some nested for-loop action which isn't efficient 

   Example of the top level conditions object, which is generated in Conditions/index (ConditionBuilder component) 
   it's an array of objects. each object is an AND condition, 
   within the object, there are a series of other conditions which are the ORs. All the ANDs need to evaluate to true for a piece of data to be included. 
   Only one of the conditions within or need to evaluate to true. 
   *  [
   *    {
   *      conditionGroupId: UUID 
   *      conditionPosition (the position of the group within the ui. Not used)
   *      ConditionGroupComponent: A react component that's responsible for displaying the particular group.
   *      conditions: [
   *            {
   *              ConditionComponent: A react component that's responsible for displaying the row, i.e the particular or condition. 
                  id: the specific id of this OR condition.
                  conditionGroupId, (same groupId from the parent)
                  conditionPosition, not used, but the position of the specific or condition within the group. 
                  filterOn: string responsible telling us what we're filtering on, which left condition dropdown value is selected? 
                  operator: string this corresponds to which operator we're using, equal, less than etc. that definition can be found here src/utils/index -> ConditionOperators
                  conditionValue: the condition value, a string. This corresponds to the value input in the condition UI
                },
                {
                  ......
                }
  *      ]
  *     },
  *     {
          conditionGroupId,
   *      conditionPosition,
   *      ConditionGroupComponent,
   *      conditions: [
   *          {
   *           ....
  *           }
   *        ]
   *     },
   *      
   *     {
   *     ..... 
   *     }
   *   ]
   *
   *
   *
   */

  const applyConditions = useCallback(
    (conditionGroups: Array<GlobalConditionGroupData>) => {
      // when running conditions, we want to use original rows instead of the filtered rows to ensure we have all the results.
      const filtered = originalRows.filter((item) => {
        // each condition group in the array will return true / false. this is our AND value. we want all condition groups to evaluate to true to display the
        // potential value.
        return conditionGroups.every((conditionGroup) => {
          const { conditions } = conditionGroup;

          // this is each individual condition within a group. OR condition. One of these must evaluate to true for the condition to be true. We use some here
          // so that if we find a condition that meets some criteria, we stop iterating through the loop.
          return conditions.some((condition) => {
            const { filterOn, operator, conditionValue, isValid } = condition;

            // we ignore any invalid conditions.
            if (!isValid) {
              return true;
            }
            
            const itemValue = item[filterOn];

            switch (operator) {
              case ConditionOperator.Equals:
                if (Number.parseInt(conditionValue)) {
                  return (
                    Number.parseInt(itemValue) ===
                    Number.parseInt(conditionValue)
                  );
                } else {
                  return itemValue === conditionValue;
                }

              case ConditionOperator.Greater_Than:
                return (
                  Number.parseInt(itemValue) > Number.parseInt(conditionValue)
                );

              case ConditionOperator.Less_Than:
                return (
                  Number.parseInt(itemValue) < Number.parseInt(conditionValue)
                );

              case ConditionOperator.Contain:
                return itemValue.includes(conditionValue);
              case ConditionOperator.Not_Contain:
                return !itemValue.includes(conditionValue);
              case ConditionOperator.Regex:
                try {
                  const regex = new RegExp(conditionValue);
                  return regex.test(itemValue);
                } catch (e) {
                  return false;
                }
              default:
                return false;
            }
          });
        });
      });

      // once we have the filtered result of rows, we want to set it.
      setRows(filtered);
    },
    [originalRows]
  );

  const values: ITableContext = {
    rows,
    columns,
    shouldDisplayGrid,
    total: originalRows.length,
    filtered: rows.length,
    isLoading,
    isReady,
    applyConditions,
    originalRows,
  };

  return (
    <TableContext.Provider value={values}>{children}</TableContext.Provider>
  );
};
