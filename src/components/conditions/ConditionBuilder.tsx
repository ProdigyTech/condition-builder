import { Button, Paper, Stack } from "@mui/material";
import React, { useEffect, useState, useMemo, useCallback } from "react";
import { useDataContext } from "../../context/useDataContext";
import { GlobalConditionGroupData, AddConditionFunc } from "./types";
import { useTableContext } from "../../context/useTableContext";
import {
  generateConditionOrObject,
  generateNewConditionGroup,
} from "../../utils";
import { ConditionsOrObjectType } from "./types";
import { styled } from "@mui/system";
import { ConditionGroup } from "./ConditionGroup";
import { DragDropContext } from "react-beautiful-dnd";
import { Droppable } from "react-beautiful-dnd";

const StyledConditionsGroupButtonWrapperDiv = styled("div")({
  marginBottom: "1em",
  marginTop: "1em",
});

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
  }, [isLoading, conditionGroups, isReady, leftConditionOptions]);

  /**
   *  If we're in the ready state - we have valid data
   *  And we have condition groups, lets apply the conditions. i.e filter the data
   */
  useEffect(() => {
    if (isReady && conditionGroups.length) {
      applyConditions(conditionGroups);
    }
  }, [conditionGroups, isReady, applyConditions]);

  /**
   *  If our original rows change and are not valid, we want to clear out our condition group state.
   *
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
    [setConditionGroups, leftConditionOptions]
  );

  /**
   *
   *  Adds new condition to an existing group. (Appends)
   */
  const addNewConditionToExistingGroup: AddConditionFunc = useCallback(
    ({ groupId }: { groupId: string }) => {
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
    [setConditionGroups, leftConditionOptions]
  );

  /**
   *
   * This function will update a particular conditionGroup conditions array by its groupId.
   * Requires the condition array to be passed already constructed and a valid groupId. This is passed down as a prop to child
   * components to send the updated conditions array. Since the parent has the context of 'all' the conditions
   * while the child only has access to its specific set of conditions. Separation of concerns between child / parent.
   *
   */

  const updateConditionsByGroupId = useCallback(
    ({
      groupId,
      updatedConditions,
    }: {
      groupId: string;
      updatedConditions: Array<ConditionsOrObjectType>;
    }) => {
      // the condition array is empty for a specific group, all conditions were removed, we need to remove the "group"
      if (updatedConditions.length === 0) {
        setConditionGroups((globalConditions) => {
          return globalConditions.filter((gc) => gc.groupId !== groupId);
        });
      } else {
        setConditionGroups((globalConditions) => {
          return globalConditions.map((gc) => {
            if (gc.groupId === groupId) {
              return {
                ...gc,
                conditions: updatedConditions,
              };
            }
            return gc;
          });
        });
      }
    },
    [setConditionGroups]
  );

  const updateConditionGroupsOnDragEnd = useCallback(
    (newCondition, oldCondition, oldGroupIndex, newGroupIndex) => {
      const conditionsToReShuffle = conditionGroups[newGroupIndex].conditions;
      const updatedConditions = conditionsToReShuffle.map(
        (condition, index) => {
          if (index >= newCondition.conditionPosition) {
            return {
              ...condition,
              conditionPosition: condition.conditionPosition + 1, // if we insert, we want to reshuffle positions at the insert point
            };
          }
          return condition;
        }
      );
      // we insert the new conditionObject at the specific insert point.
      updatedConditions.splice(newCondition.conditionPosition, 0, newCondition);

      const conditionsToFilter = conditionGroups[oldGroupIndex].conditions;

      const filteredConditions = conditionsToFilter
        .filter((c) => c.conditionPosition !== oldCondition.conditionPosition)
        .map((c, i) => {
          return { ...c, conditionPosition: i };
        });

      const newConditions = [...conditionGroups];

      newConditions[oldGroupIndex].conditions = filteredConditions;
      newConditions[newGroupIndex].conditions = updatedConditions;

      return newConditions;
    },
    [conditionGroups]
  );

  const onDragEnd = useCallback(
    (e) => {
      const { destination, source } = e;

      if (!destination?.droppableId || !source?.droppableId) {
        return;
      }

      if (destination.droppableId === source.droppableId) {
        const oldGroupIndex = conditionGroups.findIndex(
          (group) => group.groupId === source.droppableId
        );

        const cond = conditionGroups[oldGroupIndex].conditions;

        const foundCondition = cond[source.index];

        const fil = cond.filter((c) => c.conditionPosition !== source.index);

        const newCondition = {
          ...foundCondition,
          conditionPosition: destination.index,
        };

        // we insert the new conditionObject at the specific insert point.
        fil.splice(newCondition.conditionPosition, 0, newCondition);

        const reIndexed = fil.map((c, i) => {
          return { ...c, conditionPosition: i };
        });

        const cloned = [...conditionGroups];

        cloned[oldGroupIndex].conditions = reIndexed;

        const shouldCleanUp = cloned.some((c) => c?.conditions?.length === 0);

        if (shouldCleanUp) {
          const cleanedUp = cloned
            .filter((c) => c?.conditions?.length > 0)
            .map((c, i) => ({ ...c, groupPosition: i }));

          setConditionGroups(cleanedUp);
        } else {
          setConditionGroups(cloned);
        }
      } else {
        const oldGroupIndex = conditionGroups.findIndex(
          (group) => group.groupId === source.droppableId
        );

        const newGroupIndex = conditionGroups.findIndex(
          (group) => group.groupId === destination.droppableId
        );

        const foundGroup = conditionGroups.find(
          (group) => group.groupId === source.droppableId
        );

        const foundCondition = foundGroup.conditions[source.index];

        const newCondition = {
          ...foundCondition,
          groupId: destination.droppableId,
          conditionPosition: destination.index,
        };

        const newConditionGroups = updateConditionGroupsOnDragEnd(
          newCondition,
          foundCondition,
          oldGroupIndex,
          newGroupIndex
        );

        const shouldCleanUp = newConditionGroups.some(
          (c) => c?.conditions?.length === 0
        );

        if (shouldCleanUp) {
          const cleanedUp = newConditionGroups
            .filter((c) => c?.conditions?.length > 0)
            .map((c, i) => ({ ...c, groupPosition: i }));

          setConditionGroups(cleanedUp);
        } else {
          setConditionGroups(newConditionGroups);
        }
      }
    },
    [conditionGroups]
  );

  const onBeforeCapture = useCallback(() => {
    /*...*/
  }, []);
  const onBeforeDragStart = useCallback(() => {
    /*...*/
  }, []);
  const onDragStart = useCallback(() => {
    /*...*/
  }, []);
  const onDragUpdate = useCallback(() => {
    /*...*/
  }, []);

  return (
    <DragDropContext
      onBeforeCapture={onBeforeCapture}
      onBeforeDragStart={onBeforeDragStart}
      onDragStart={onDragStart}
      onDragUpdate={onDragUpdate}
      onDragEnd={onDragEnd}
    >
      {isReady ? (
        <Stack>
          {conditionGroups.map(
            (
              /* The ConditionGroup component gets attached to the conditionsGroup object on object generation. see generateNewConditionGroup */
              { groupId, conditions, groupPosition },
              i
            ) => {
              /* State to check if the and button is disabled. i.e we show the "AND" button greyed out between groups but active on the last group */
              const isAndDisabled = i !== conditionGroups.length - 1;
              return (
                <div
                  key={`${groupId}-outer`}
                  className={`condition-group condition-group-${groupId}`}
                >
                  <Paper elevation={2} sx={{ p: 2 }}>
                    <Droppable droppableId={groupId} type="AND">
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.droppableProps}
                        >
                          <ConditionGroup
                            style={{
                              backgroundColor: snapshot.isDraggingOver
                                ? "blue"
                                : "grey",
                            }}
                            groupId={groupId}
                            groupPosition={groupPosition}
                            conditions={conditions}
                            addCondition={addNewConditionToExistingGroup}
                            updateConditionsByGroupId={
                              updateConditionsByGroupId
                            }
                            leftConditionOptions={leftConditionOptions}
                          />
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                  </Paper>

                  <Stack direction="row" alignItems="center" spacing={1}>
                    <StyledConditionsGroupButtonWrapperDiv>
                      <Button
                        variant={isAndDisabled ? "text" : "outlined"}
                        disabled={isAndDisabled}
                        sx={{ borderRadius: 0, minWidth: 0, py: 0 }}
                        onClick={() => addNewAndGroup(conditionGroups.length)}
                        title={`AND`}
                      >
                        {isAndDisabled ? "AND" : "+ AND"}
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
    </DragDropContext>
  );
};
