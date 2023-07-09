/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  useMemo,
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";

import { useTableContext } from "./TableContext";

interface IConditionContext {}

const ConditionContext = createContext<IConditionContext | null>(null);

export const ConditionProvider: React.FC = ({ children }) => {
  const { applyFilter } = useTableContext();
  const [conditionBlocks, setConditionBlock] = useState([]);

  console.log(conditionBlocks);

  const addConditionToBlock = ({ blockId, id, value, fieldId }) => {
    let foundBlockId;
    let individualId;

    const foundBlock = conditionBlocks.find((cb) => {
      if (cb.blockId == blockId) {
        foundBlockId = cb.blockId;
        return true;
      }
    });


    if (foundBlock) {
      const individualConditionObject = foundBlock.conditions.find(
        (indvidualObj) => {
          if (indvidualObj.id === id) {
            individualId = indvidualObj.id;

            return true;
          }
        }
      );

      if (individualConditionObject) {
        const updatedConditionObject = {
          ...individualConditionObject,
          id: id,
          [fieldId]: value,
        };

        foundBlock.conditions[individualId] = {
          ...foundBlock.conditions[individualId],
          ...updatedConditionObject,
        };

        conditionBlocks[foundBlockId] = foundBlock;

        setConditionBlock(conditionBlocks);
      }

      // there's a group and we need to add the object to the group
      if (foundBlock && !individualConditionObject) {
        const conditionObject = {
          id: id,
          [fieldId]: value,
        };

        foundBlock.conditions.push(conditionObject);

        conditionBlocks[foundBlockId] = foundBlock;

        setConditionBlock(conditionBlocks);
      }
    } else {
      setConditionBlock((cb) => {
        return [
          ...cb,
          {
            blockId: blockId,
            conditions: [
              {
                id: id,
                [fieldId]: value,
              },
            ],
          },
        ];
      });
    }

    applyFilter(conditionBlocks);
}

 


  return (
    <ConditionContext.Provider
      value={{ conditionBlocks, setConditionBlock, addConditionToBlock }}
    >
      {children}
    </ConditionContext.Provider>
  );
};

export const useConditionsContext: IConditionContext = () => {
  const tableContext = useTableContext();
  const context = useContext(ConditionContext);

  if (!context || !tableContext) {
    throw new Error(
      "useConditionsContext must be used within a Condition Provider and a Table Provider"
    );
  }
  return { ...context, ...tableContext };
};
