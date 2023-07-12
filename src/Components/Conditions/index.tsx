import { ConditionRow } from "./ConditionRow";
import { Button, Paper, Stack } from "@mui/material";
import React, { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { useDataContext } from "@Context/useDataContext";
import { ConditionGroup } from "./ConditionGroup";
import {
  GlobalConditionGroupData,
  ConditionsObject,
  AddConditionFunc,
  generateDefaultConditionObjectFunc,
  operatorType,
} from "./types";

import { ConditionOptions } from "@Shared";
import { useTableContext } from "@Context/useTableContext";

export const generateDefaultConditionObject: generateDefaultConditionObjectFunc =
  (
    pos: number,
    leftConditionOptions: Array<operatorType>,
    ConditionOptions: Array<operatorType>,
    groupId: string
  ) => {
    const id: string = uuidv4();
    return {
      Component: ConditionRow,
      id,
      groupId: groupId,
      conditionPosition: pos,
      filterOn: leftConditionOptions[0],
      operator: ConditionOptions[0],
      conditionValue: "",
    };
  };

const generateNewConditionGroup = (pos: number, leftConditionOptions: Array<operatorType>,) => {
  const newGroupId = uuidv4();
  return {
    groupId: newGroupId,
    groupPosition: pos,
    conditions: [
      generateDefaultConditionObject(
        0,
        leftConditionOptions,
        ConditionOptions,
        newGroupId
      ),
    ],
    Component: ConditionGroup,
  };
};

export const ConditionBuilder: React.FC = () => {
  const {
    isLoading,
    columns = [],
    applyFilter,
    originalRows,
  } = useTableContext();
  const { isReady } = useDataContext();

  const leftConditionOptions = columns?.map((col) => {
    return {
      value: col.field,
      label: col.field,
    };
  });

  const [conditionGroups, setConditionGroups] = useState<
    Array<GlobalConditionGroupData>
  >([]);

  // this is the reason why we can't delete the last existing group. Need to rethink this.
  useEffect(() => {
    if (!isLoading && conditionGroups.length == 0 && isReady) {
      setConditionGroups([generateNewConditionGroup(0, leftConditionOptions)]);
    }
  }, [
    isLoading,
    setConditionGroups,
    conditionGroups.length,
    isReady,
    leftConditionOptions,
  ]);

  useEffect(() => {
    if (isReady && conditionGroups.length) {
      applyFilter(conditionGroups);
    }
  }, [conditionGroups, isReady]);

  useEffect(() => {
    if (!originalRows.length) {
      setConditionGroups([]);
    }
  }, [originalRows]);

  const addNewAndGroup = (pos: number, leftConditionOptions) => {
    setConditionGroups((existing) => [
      ...existing,
      generateNewConditionGroup(pos, leftConditionOptions),
    ]);
  };

  const addNewConditionToExistingGroup: AddConditionFunc = ({
    groupId,
    leftConditionOptions,
  }) => {
    const newConditions = conditionGroups.map((condition) => {
      let result = condition;
      if (condition.groupId === groupId) {
        result = {
          ...condition,
          conditions: [
            ...condition.conditions,
            generateDefaultConditionObject(
              condition.conditions.length,
              leftConditionOptions,
              ConditionOptions,
              groupId
            ),
          ],
        };
      }
      return result;
    });

    setConditionGroups(newConditions);
  };

  const updateConditionsByGroupId = ({
    groupId,
    conditionArr,
  }: {
    groupId: string;
    conditionArr: Array<ConditionsObject>;
  }) => {
    // the condition array is empty for a specific group, all conditions were removed, we need to remove the "group"
    if (conditionArr.length === 0) {
      setConditionGroups((globalConditions) => {
        return globalConditions.filter((gc) => gc.groupId !== groupId);
      });
    } else {
      setConditionGroups((globalConditions) => {
        return globalConditions.map((gc) => {
          if (gc.groupId === groupId) {
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
        <Stack>
          {conditionGroups.map(
            (
              { groupId, Component: ConditionGroup, conditions, ...rest },
              i
            ) => {
              const isDisabled = i !== conditionGroups.length - 1;
              return (
                <div
                  key={`${groupId}-outer`}
                  className={`condition-group condition-group-${groupId}`}
                >
                  <Paper elevation={2} sx={{ p: 2 }}>
                    <ConditionGroup
                      {...rest}
                      key={groupId}
                      groupId={groupId}
                      conditions={conditions}
                      addCondition={addNewConditionToExistingGroup}
                      updateConditionsArray={updateConditionsByGroupId}
                    />
                  </Paper>

                  <Stack direction="row" alignItems="center" spacing={1}>
                    <div style={{ marginBottom: "1em", marginTop: "1em" }}>
                      <Button
                        variant={isDisabled ? "text" : "outlined"}
                        disabled={isDisabled}
                        sx={{ borderRadius: 0, minWidth: 0, py: 0 }}
                        onClick={() =>
                          addNewAndGroup(
                            conditionGroups.length,
                            leftConditionOptions
                          )
                        }
                      >
                        {isDisabled ? "AND" : "+ AND"}
                      </Button>
                    </div>
                  </Stack>
                </div>
              );
            }
          )}
        </Stack>
      ) : (
        <></>
      )}
    </>
  );
};
