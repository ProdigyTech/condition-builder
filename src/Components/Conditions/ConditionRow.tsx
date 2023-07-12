import React, { useEffect, useState, ElementType } from "react";
import { Grid, TextField, Skeleton, Box } from "@mui/material";
import { styled } from "@mui/system";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import AddIcon from "@mui/icons-material/Add";
import { Dropdown } from "../Select";
import { ConditionOperators, OperatorsToTriggerNumberValidation } from "./shared/index";

const StyledDeleteIcon = styled(DeleteForeverIcon)({
  color: "red",
  cursor: "pointer",
  fontSize: "2rem",
});

const StyledAddIcon = styled(AddIcon)({
  color: "#1976d2",
  cursor: "pointer",
  marginRight: "0.5rem",
});

const StyledPendingSkeleton = styled(Skeleton)({
  width: "100%",
  height: "3rem",
});

/**
 *
 * Component that renders one condition row / one OR condition within a group.
 *
 *
 */

export const ConditionRow: ElementType = ({
  id,
  groupId,
  conditionPosition,
  filterOn,
  operator,
  leftConditionOptions,
  addCondition,
  onValueChange,
  insertNewConditionToExistingGroup,
  deleteCondition,
  isLast,
}) => {
  // state for input validation
  const [error, setValidationError] = useState(false);

  // state for input value
  const [inputValue, setInputValue] = useState("");

  // state to show the skeleton if we hover over the add button
  const [showPendingSkeleton, setShowPendingSkeleton] = useState(false);

  // useEffect for input validation when dropdown operator changes or value changes
  useEffect(() => {
    if (inputValue.length) {
      (OperatorsToTriggerNumberValidation.includes(operator)) && isNaN(+inputValue)
        ? setValidationError(true)
        : setValidationError(false);
      return;
    }

    setValidationError(false);
  }, [inputValue, setValidationError, operator]);

  return (
    <Grid container spacing={1} alignItems="center">
      <Grid item xs={4}>
        <Dropdown
          id="filterOn"
          label={`Left Condition`}
          options={leftConditionOptions}
          defaultValue={filterOn}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            // updates condition state for "filterOn" with the new value for the specific condition by id
            onValueChange(e.target.value, "filterOn", id);
          }}
        />
      </Grid>
      <Grid item xs={3}>
        <Dropdown
          id="operator"
          label={`Operator`}
          options={ConditionOperators}
          defaultValue={operator}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            // updates condition state for "operator" with the new value for the specific condition by id
            onValueChange(e.target.value, "operator", id);
          }}
        />
      </Grid>
      <Grid item xs={3}>
        <TextField
          id="conditionValue"
          label="Value"
          variant="filled"
          error={error}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            // sets the input value
            setInputValue(e.target.value);
            // updates condition state for "conditionValue" with the new value for the specific condition by id
            onValueChange(e.target.value, "conditionValue", id);
          }}
        />
      </Grid>
      <Grid item xs={2}>
        <Box display="flex" justifyContent="flex-end" alignItems="center">
          <StyledAddIcon
            onClick={() => {
              if (isLast) {
                // if this button is clicked on the last condition in the group, append a new condition.
                addCondition({ groupId });
              } else {
                // if the add button is clicked anywhere else, insert the new or condition to the position after this condition
                insertNewConditionToExistingGroup({
                  groupId,
                  insertPosition: conditionPosition + 1,
                });
              }
              // if the add button is clicked, turn off the loading skeleton
              setShowPendingSkeleton(false);
            }}
            // show / hide the loading skeleton if the mouse enters or leaves the add button
            onMouseEnter={() => setShowPendingSkeleton(true)}
            onMouseLeave={() => setShowPendingSkeleton(false)}
          />

          <StyledDeleteIcon
            onClick={() => {
              // remove the condition from the conditions array by conditionId and groupId.
              deleteCondition({
                conditionIdToDelete: id,
                groupId,
              });
            }}
          >
            Delete
          </StyledDeleteIcon>
        </Box>
      </Grid>
      {/* if we're in a hover state, show the rectangular skeleton */}
      {showPendingSkeleton && (
        <StyledPendingSkeleton variant="rectangular" sx={{ my: 2 }} />
      )}
    </Grid>
  );
};
