import { Button, Paper, Stack } from "@mui/material";
import React, { useEffect, useState, useMemo, useCallback } from "react";
import { useDataContext } from "@Context/useDataContext";
import { GlobalConditionGroupData, AddConditionFunc } from "./types";
import { useTableContext } from "@Context/useTableContext";
import { generateConditionOrObject, generateNewConditionGroup } from "@Utils";
import { ConditionsOrObjectType } from "./types";
import { styled } from "@mui/system";

export const ConditionBuilder: React.FC = () => {
  const [conditionGroups, setConditionGroups] = useState<
    Array<GlobalConditionGroupData>
  >([]);

  /*
   * pulling vars from context,
   * isLoading: indicates if the data from the entered url is being loaded
   * columns, table columns
   * applyConditions, function that runs when conditionBuilder has valid conditions
   *  originalRows, variable that holds the original data. i.e if we add conditions, then remove them, we want to see the original data set.
   */
  const {
    isLoading,
    columns = [],
    applyConditions,
    originalRows,
  } = useTableContext();

  //todo, do i need this isReady check? might be able to piggyback off isLoading?
  const { isReady } = useDataContext();

  // This holds to columns for the "Left condition" dropdown field in the UI.
  // only recompute this value if columns change.
  const leftConditionOptions = useMemo(() => {
    return columns.map((col) => {
      return {
        value: col.field,
        label: col.field,
      };
    });
  }, [columns]);

  /*
    if we have valid data in the table, and we have No current condition groups, and we're ready, then we want to initialize
    our conditionGroup state with a new conditionsGroupObject.

    Note: this implementation causes us not to be able to remove the condition if only one exists. it gets removed then a new one is put back.
    Might need to re-think this. 
  */
  useEffect(() => {
    if (!isLoading && conditionGroups.length == 0 && isReady) {
      setConditionGroups([generateNewConditionGroup(0, leftConditionOptions)]);
    }
  }, [isLoading, conditionGroups.length, isReady, leftConditionOptions]);

  /**
   *  If we're in the ready state - we have valid data
   *  And we have condition groups, lets apply the conditions. i.e filter the data
   */
  useEffect(() => {
    if (isReady && conditionGroups.length) {
      applyConditions(conditionGroups);
    }
  }, [conditionGroups, isReady]);

  /**
   *  If our original rows change and are valid, we want to initialize condition groups.
   *  this might not be needed, todo
   *  TODO: double check impl - why would conditionGroups be an empty array instead of it's initialSate from line 51?
   */

  useEffect(() => {
    if (!originalRows.length) {
      setConditionGroups([]);
    }
  }, [originalRows]);

  /*
   * This function adds a new Condition group object to the conditionGroup state
   */
  const addNewAndGroup = useCallback(
    (position: number) => {
      setConditionGroups((existing) => [
        ...existing,
        generateNewConditionGroup(position, leftConditionOptions),
      ]);
    },
    [setConditionGroups]
  );

  /**
   *
   *  Adds new condition to an existing group. (Appends)
   */
  const addNewConditionToExistingGroup: AddConditionFunc = useCallback(
    ({ groupId }) => {
      setConditionGroups((conditionGroups) => {
        return conditionGroups.map((condition) => {
          if (condition.groupId === groupId) {
            return {
              ...condition,
              conditions: [
                ...condition.conditions,
                generateConditionOrObject(
                  condition.conditions.length,
                  leftConditionOptions,
                  groupId
                ),
              ],
            };
          } else {
            return condition;
          }
        });
      });
    },
    [setConditionGroups]
  );

  /**
   *
   * This function will update a particular conditionGroups conditions array by its groupId.
   * Requires the condition array to be passed already constructed and a valid groupId. This is passed down as a prop to child
   * components to send the updated conditions array. Since the parent has the context of 'all' the conditions
   * while the child only has access to its specific set of conditions. Separation of concerns between child / parent.
   *
   */

  const updateConditionsByGroupId = useCallback(
    ({
      groupId,
      conditionArr,
    }: {
      groupId: string;
      conditionArr: Array<ConditionsOrObjectType>;
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
    },
    [setConditionGroups]
  );

  const StyledConditionsGroupButtonWrapperDiv = useMemo(
    () =>
      styled("div")({
        marginBottom: "1em",
        marginTop: "1em",
      }),
    []
  );

  return (
    <>
      {isReady ? (
        <Stack>
          {conditionGroups.map(
            (
              /* The ConditionGroup component gets attached to the conditionsGroup object on object generation. see generateNewConditionGroup */
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
                    <StyledConditionsGroupButtonWrapperDiv>
                      <Button
                        variant={isDisabled ? "text" : "outlined"}
                        disabled={isDisabled}
                        sx={{ borderRadius: 0, minWidth: 0, py: 0 }}
                        onClick={() => addNewAndGroup(conditionGroups.length)}
                      >
                        {isDisabled ? "AND" : "+ AND"}
                      </Button>
                    </StyledConditionsGroupButtonWrapperDiv>
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
