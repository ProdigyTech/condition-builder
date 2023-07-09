import { ConditionDropdown } from "./Conditions/ConditionDropdowns";
import { Button, Paper } from "@mui/material";
import { useEffect, useState, ReactElement } from "react";
import { ConditionOptions } from "@Shared";
import { useConditionsContext } from "@Context/ConditionBuilderContext";
import { v4 as uuidv4 } from "uuid";
import { useDataContext } from "@Context/DataContext";
import { ConditionBlock } from "./Conditions/ConditionBlock";

type ConditionsObject = {
  Component: ReactElement;
  id: string;
  blockId: string;
  position: number;
  filterOn: string;
  operator: string;
  conditionValue: string;
};

type GlobalConditionBlockData = {
  blockId: string;
  position: number;
  conditions: Array<ConditionsObject>;
  Component: typeof ConditionBlock;
};

type filterOnType = {
  label: string;
  value: string;
};

type operatorType = {
  label: string;
  value: string;
};

type DefaultConditionObjectType = {
  Component: ReactElement;
  id: string;
  blockId: string;
  position: number;
  filterOn: filterOnType;
  operator: operatorType;
  conditionValue: string;
};

const generateEmptyConditionBlock = (pos: number, leftConditionOptions) => {
  const newBlockId = uuidv4();
  return {
    blockId: newBlockId,
    position: pos,
    conditions: [
      generateDefaultConditionObject(0, leftConditionOptions, newBlockId),
    ],
    Component: ConditionBlock,
  };
};

export const generateDefaultConditionObject = (
  pos: number,
  leftConditionOptions: Array<operatorType>,
  blockId: string
) => {
  const result: DefaultConditionObjectType = {
    Component: ConditionDropdown,
    id: uuidv4(),
    blockId: blockId,
    position: pos,
    filterOn: leftConditionOptions[0],
    operator: ConditionOptions[0],
    conditionValue: "",
  };

  return result;
};

export const ConditionBuilder: React.FC = () => {
  const { rows, isLoading, columns = [] } = useConditionsContext();
  const { isReady } = useDataContext();

  const leftConditionOptions = columns?.map((col) => {
    return {
      value: col.field,
      label: col.field,
    };
  });

  const [allConditionBlocks, setConditionBlocks] = useState<
    Array<GlobalConditionBlockData>
  >([]);

  console.log(allConditionBlocks);

  useEffect(() => {
    if (!isLoading && allConditionBlocks.length == 0 && isReady) {
      setConditionBlocks([
        generateEmptyConditionBlock(0, leftConditionOptions),
      ]);
    }
  }, [
    isLoading,
    setConditionBlocks,
    allConditionBlocks.length,
    isReady,
    leftConditionOptions,
  ]);

  const addNewAndBlock = (pos: number, leftConditionOptions) => {
    setConditionBlocks((existing) => [
      ...existing,
      generateEmptyConditionBlock(pos, leftConditionOptions),
    ]);
  };

  const addNewConditionToExistingBlock: AddConditionFunc = ({
    blockId,
    leftConditionOptions,
  }) => {
    const newConditions = allConditionBlocks.map((condition) => {
      let result = condition;
      if (condition.blockId === blockId) {
        result = {
          ...condition,
          conditions: [
            ...condition.conditions,
            generateDefaultConditionObject(
              condition.conditions.length,
              leftConditionOptions,
              blockId
            ),
          ],
        };
      }
      return result;
    });

    setConditionBlocks(newConditions);
  };

  const updateConditionsByBlockId = ({
    blockId,
    conditionArr,
  }: {
    blockId: string;
    conditionArr: Array<ConditionsObject>;
  }) => {
    setConditionBlocks((globalConditions) => {
      return globalConditions.map((gc) => {
        if (gc.blockId === blockId) {
          return {
            ...gc,
            conditions: conditionArr,
          };
        }
        return gc;
      });
    });
  };


  return (
    <>
      {rows.length > 0 ? (
        <Paper
          elevation={2}
          style={{
            padding: "2em",
          }}
        >
          <>
            {allConditionBlocks.map(
              ({ blockId, Component, conditions, ...rest }) => {
                return (
                  <>
                    <Component
                      {...rest}
                      key={blockId}
                      blockId={blockId}
                      conditions={conditions}
                      addCondition={addNewConditionToExistingBlock}
                      updateConditionsArray={updateConditionsByBlockId}
                    />

                    {allConditionBlocks.length > 0 && <span> AND </span>}
                  </>
                );
              }
            )}

            <Button
              onClick={() =>
                addNewAndBlock(allConditionBlocks.length, leftConditionOptions)
              }
            >
              {allConditionBlocks.length === 0 ? "Add Condition + " : "And +"}
            </Button>
          </>
        </Paper>
      ) : (
        <></>
      )}
    </>
  );
};
