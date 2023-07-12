import { Grid, Stack, Typography } from "@mui/material";
import { ConditionOptions } from "@Shared";
import { generateConditionOrObject } from "@Utils";
import { ConditionGroupProps } from "./types";
import { useTableContext } from "@Context/useTableContext";


export const ConditionGroup = ({
  groupId,
  conditions = [],
  updateConditionsArray,
  addCondition,
}: ConditionGroupProps) => {
  const { columns = [] } = useTableContext();
  const leftConditionOptions = columns?.map((col) => {
    return {
      value: col.field,
      label: col.field,
    };
  });

  // handles the case of inserting new condition vs appending
  const insertNewConditionToExistingGroup = ({ groupId, insertPosition }) => {
    const updatedConditions = conditions.map((condition, index) => {
      if (index >= insertPosition) {
        return {
          ...condition,
          conditionPosition: condition.conditionPosition + 1,
        };
      }
      return condition;
    });

    const newCondition = generateConditionOrObject(
      insertPosition,
      leftConditionOptions,
      ConditionOptions,
      groupId
    );

    updatedConditions.splice(insertPosition, 0, newCondition);
    updateConditionsArray({ groupId, conditionArr: updatedConditions });
  };

  const deleteCondition = ({ conditionIdToDelete, groupId }) => {
    const updatedConditions = conditions
      .filter((condition) => condition.id !== conditionIdToDelete)
      .map((condition, index) => ({
        ...condition,
        conditionPosition: index,
      }));

    updateConditionsArray({
      groupId,
      conditionArr: updatedConditions,
    });
  };

  // we need to update the specific condition object and keys in state
  const onDropdownChange = (value, field, id) => {
    const updatedConditions = conditions.map((dropdownConditionObject) => {
      if (id === dropdownConditionObject.id) {
        return {
          ...dropdownConditionObject,
          [field]: field === "conditionValue" ? value : { label: value, value },
        };
      } else {
        return dropdownConditionObject;
      }
    });

    updateConditionsArray({ conditionArr: updatedConditions, groupId });
  };

  return (
    <>
      <Grid container>
        {conditions.map(
          ({ Component: Condition, id, conditionPosition, ...rest }, index) => {
            return (
              <Stack
                direction="row"
                spacing={5}
                width={"100%"}
                key={`${id}-outer`}
                sx={{ m: 2 }}
              >
                {index !== 0 && (
                  <Typography
                    style={{
                      alignItems: "center",
                      justifyContent: "center",
                      padding: "1em",
                      fontWeight: "bold",
                      color: "rgb(25, 118, 210)",
                    }}
                    item
                  >
                    OR
                  </Typography>
                )}

                <Condition
                  {...rest}
                  key={id}
                  id={id}
                  index={index}
                  groupId={groupId}
                  addCondition={addCondition}
                  isLast={conditions.length - 1 == conditionPosition}
                  onDropdownChange={onDropdownChange}
                  deleteCondition={deleteCondition}
                  leftConditionOptions={leftConditionOptions}
                  ConditionOptions={ConditionOptions}
                  conditionPosition={conditionPosition}
                  insertNewConditionToExistingGroup={
                    insertNewConditionToExistingGroup
                  }
                />
              </Stack>
            );
          }
        )}
      </Grid>
    </>
  );
};
