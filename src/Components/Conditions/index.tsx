import { ConditionDropdown } from "./ConditionDropdowns";
import { Button, Paper } from "@mui/material";
import React, { useEffect, useState, ReactElement, useCallback } from "react";
import { v4 as uuidv4 } from "uuid";
import { useDataContext } from "@Context/DataContext";
import { ConditionGroup } from "./ConditionGroup";
import {
  GlobalConditionGroupData,
  ConditionsObject,
  AddConditionFunc,
} from "./types";

import { ConditionOptions } from "@Shared";
import { useTableContext } from "@Context/TableContext";

export const generateDefaultConditionObject = (
  pos,
  leftConditionOptions,
  ConditionOptions,
  groupId
) => {
  const result = {
    Component: ConditionDropdown,
    id: uuidv4(),
    groupId: groupId,
    position: pos,
    filterOn: leftConditionOptions[0],
    operator: ConditionOptions[0],
    conditionValue: "",
  };

  return result;
};

const generateNewConditionGroup = (pos: number, leftConditionOptions) => {
  const newGroupId = uuidv4();
  return {
    groupId: newGroupId,
    position: pos,
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
  const { isLoading, columns = [], applyFilter } = useTableContext();
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
        <Paper
          elevation={2}
          style={{
            padding: "2em",
          }}
        >
          <>
            {conditionGroups.map(
              ({ groupId, Component: ConditionGroup, conditions, ...rest }) => {
                return (
                  <React.Fragment key={`${groupId}-outer`}>
                    <ConditionGroup
                      {...rest}
                      key={groupId}
                      groupId={groupId}
                      conditions={conditions}
                      addCondition={addNewConditionToExistingGroup}
                      updateConditionsArray={updateConditionsByGroupId}
                    />

                    {conditionGroups.length > 0 && <span> AND </span>}
                  </React.Fragment>
                );
              }
            )}

            <Button
              onClick={() =>
                addNewAndGroup(conditionGroups.length, leftConditionOptions)
              }
            >
              {conditionGroups.length === 0 ? "Add Condition + " : "And +"}
            </Button>
          </>
        </Paper>
      ) : (
        <></>
      )}
    </>
  );
};
