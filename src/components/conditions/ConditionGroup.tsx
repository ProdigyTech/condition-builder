import { Grid, Stack, Typography } from "@mui/material";
import { styled } from "@mui/system";
import { ConditionOperators } from "./shared/index";
import { generateConditionOrObject } from "../../utils";
import { useCallback } from "react";
import { ConditionGroupProps } from "./types";
import { ConditionRow } from "./ConditionRow";
import { Draggable } from "react-beautiful-dnd";

const StyledTypography = styled(Typography)({
  alignItems: "center",
  justifyContent: "center",
  padding: "1rem",
  fontWeight: "bold",
  color: "rgb(25, 118, 210)",
});

/**
 *
 * This component renders a single condition group.
 *  A single group can contain many OR conditions.
 *
 */
export const ConditionGroup = ({
  groupId,
  conditions = [],
  updateConditionsByGroupId,
  addCondition,
  leftConditionOptions,
}: ConditionGroupProps) => {
  // handles the case of inserting new condition to the group, vs appending.
  const insertNewConditionToExistingGroup = useCallback(
    ({
      groupId,
      insertPosition,
    }: {
      groupId: string;
      insertPosition: number;
    }) => {
      const updatedConditions = conditions.map((condition, index) => {
        if (index >= insertPosition) {
          return {
            ...condition,
            conditionPosition: condition.conditionPosition + 1, // if we insert, we want to reshuffle positions at the insert point
          };
        }
        return condition;
      });

      // generate a new empty condition object
      const newCondition = generateConditionOrObject(
        insertPosition,
        leftConditionOptions,
        groupId
      );

      // we insert the new conditionObject at the specific insert point.
      updatedConditions.splice(insertPosition, 0, newCondition);
      updateConditionsByGroupId({ groupId, updatedConditions });
    },
    [conditions, leftConditionOptions, updateConditionsByGroupId]
  );

  // this deletes a condition from an array by its condition id.
  const deleteCondition = useCallback(
    ({
      conditionIdToDelete,
      groupId,
    }: {
      conditionIdToDelete: string;
      groupId: string;
    }) => {
      const updatedConditions = conditions
        .filter((condition) => condition.id !== conditionIdToDelete)
        .map((condition, index) => ({
          ...condition,
          conditionPosition: index,
        }));

      updateConditionsByGroupId({
        groupId,
        updatedConditions,
      });
    },
    [conditions, updateConditionsByGroupId]
  );

  // If a condition value changes, the left condition dropdown, operator dropdown or the value input, we fire an update.
  const onValueChange = useCallback(
    (value: string, field: string, id: string) => {
      const updatedConditions = conditions.map((dropdownConditionObject) => {
        if (id === dropdownConditionObject.id) {
          let obj = {
            ...dropdownConditionObject,
            [field]: value,
          };

          if (field === "conditionValue" && value.length > 0) {
            obj = { ...obj, isValid: true };
          } else if (field === "conditionValue" && value.length === 0) {
            obj = { ...obj, isValid: false };
          }
          return obj;
        } else {
          return dropdownConditionObject;
        }
      });

      updateConditionsByGroupId({ updatedConditions, groupId });
    },
    [updateConditionsByGroupId, conditions, groupId]
  );

  return (
    <>
      <Grid container>
        {conditions.map(({ id, conditionPosition, ...rest }, index) => {
          return (
            <Stack
              direction="row"
              spacing={5}
              width={"100%"}
              key={`${id}-outer`}
              sx={{ m: 2 }}
            >
              {index !== 0 && <StyledTypography>OR</StyledTypography>}

              <Draggable
                key={`draggable-${id}`}
                draggableId={`draggable-${id}`}
                index={index}
              >
                {(provided) => (
                  <ConditionRow
                    {...rest}
                    id={id}
                    index={index}
                    groupId={groupId}
                    addCondition={addCondition}
                    isLast={conditions.length - 1 === conditionPosition} // is the last condition in a group?
                    onValueChange={onValueChange}
                    deleteCondition={deleteCondition}
                    leftConditionOptions={leftConditionOptions}
                    ConditionOperators={ConditionOperators}
                    conditionPosition={conditionPosition} // position of the condition within the group.
                    insertNewConditionToExistingGroup={
                      insertNewConditionToExistingGroup
                    }
                    draggleProps={provided.draggableProps}
                    dragHandleProps={provided.dragHandleProps}
                    innerRef={provided.innerRef}
                  />
                )}
              </Draggable>
            </Stack>
          );
        })}
      </Grid>
    </>
  );
};
