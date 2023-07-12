import {
  useMemo,
  createContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { useDataContext } from "./useDataContext";
import { GlobalConditionGroupData } from "Components/Conditions/types";

type TableProviderProps = React.PropsWithChildren;

export type columnTypes = {
  field: string;
  headerName: string;
  width: number;
  editable: boolean;
};

export type ITableContext = {
  rows: unknown[];
  originalRows: unknown[];
  columns: Array<columnTypes>;
  shouldDisplayGrid: boolean;
  total: number;
  filtered: number;
  isLoading: boolean;
  isReady: boolean;
  applyConditions: (conditions: Array<GlobalConditionGroupData>) => void;
};

export const TableContext = createContext<ITableContext | null>(null);


// The purpose of this context is to transform the data from the data provider for consumption by the table. 
// and it exposes a method that applies the filters to the data. 
export const TableProvider = ({ children }: TableProviderProps) => {
  const { isLoading, data, isUrlValid, isReady } = useDataContext();
  // the purpose of original rows is to store the original data set, so if we remove all conditions
  // we will see the original data.
  const [originalRows, setOriginalRows] = useState<unknown[]>([]);
  const [rows, setRows] = useState<unknown[]>([]);

  const [shouldDisplayGrid, setShouldDisplayGrid] = useState(false);

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
    if (!originalRows.length && data) {
      setOriginalRows(data);
    }
    if (data) {
      setRows(data);
    }
  }, [data, originalRows.length]);

  // we only want to regenerate columns if the data changes or we change loading states
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
                  filterOn: {  : object responsible telling us what we're filtering on, which left condition dropdown value is selected? 
                    label: both label and value are the same. 
                    value: 
                  },
                  operator: {  this corresponds to which operator we're using, equal, less than etc. that definition can be found here src/utils/index -> ConditionOptions
                    label, 
                    value,
                  },
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
        return conditionGroups.every((filter) => {
          const { conditions = [] } = filter;

          // this is each individual condition within a group. OR condition. One of these must evaluate to true for the condition to be true. We use some here
          // so that if we find a condidion that meets some creteria, we stop iterating through the loop.

          return conditions.some((f) => {
            const { filterOn, operator, conditionValue } = f;
            const itemValue = item[filterOn.value];

            if (!conditionValue?.length) {
              return true;
            }

            switch (operator.value) {
              case "1": // Equals
                if (Number.parseInt(conditionValue)) {
                  return (
                    Number.parseInt(itemValue) ===
                    Number.parseInt(conditionValue)
                  );
                } else {
                  return itemValue === conditionValue;
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
