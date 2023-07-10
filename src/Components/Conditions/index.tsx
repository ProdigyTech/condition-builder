import { ConditionDropdown } from "./ConditionDropdowns";
import { Button, Paper } from "@mui/material";
import React, { useEffect, useState, ReactElement, useCallback } from "react";
import { v4 as uuidv4 } from "uuid";
import { useDataContext } from "@Context/DataContext";
import { ConditionBlock } from "./ConditionBlock";
import {
  GlobalConditionBlockData,
  ConditionsObject,
  AddConditionFunc,
} from "./types";

import { ConditionOptions } from "@Shared";
import { useTableContext } from "@Context/TableContext";

export const generateDefaultConditionObject = (
  pos,
  leftConditionOptions,
  ConditionOptions,
  blockId
) => {
  const result = {
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

const generateEmptyConditionBlock = (pos: number, leftConditionOptions) => {
  const newBlockId = uuidv4();
  return {
    blockId: newBlockId,
    position: pos,
    conditions: [
      generateDefaultConditionObject(
        0,
        leftConditionOptions,
        ConditionOptions,
        newBlockId
      ),
    ],
    Component: ConditionBlock,
  };
};

export const ConditionBuilder: React.FC = () => {
  const { isLoading, columns = [], applyFilter } = useTableContext();
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

  // this is the reason why we can't delete the last existing block. Need to rethink this.
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

  useEffect(() => {
    if (isReady && allConditionBlocks.length) {
      applyFilter(allConditionBlocks);
    }
  }, [allConditionBlocks, isReady]);

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
              ConditionOptions,
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
    // the condition array is empty for a specific block/group, all conditions were removed, we need to remove the "block"
    if (conditionArr.length === 0) {
      setConditionBlocks((globalConditions) => {
        return globalConditions.filter((gc) => gc.blockId !== blockId);
      });
    } else {
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
    }
  };

  return (
    <>
      {isReady ? (
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
                  <React.Fragment key={`${blockId}-outer`}>
                    <Component
                      {...rest}
                      key={blockId}
                      blockId={blockId}
                      conditions={conditions}
                      addCondition={addNewConditionToExistingBlock}
                      updateConditionsArray={updateConditionsByBlockId}
                    />

                    {allConditionBlocks.length > 0 && <span> AND </span>}
                  </React.Fragment>
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
