import React, { useEffect, useState } from "react";
import { Grid, TextField, Skeleton, Box } from "@mui/material";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import AddIcon from "@mui/icons-material/Add";
import { Dropdown } from "../Select";
import { ConditionOptions } from "@Shared";

export const ConditionRow = ({
  id,
  groupId,
  conditionPosition,
  filterOn,
  operator,
  leftConditionOptions,
  addCondition,
  onDropdownChange,
  insertNewConditionToExistingGroup,
  deleteCondition,
  isLast,
}) => {
  const [error, setValidationError] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [showPendingSkeleton, setShowPendingSkeleton] = useState(false);

  // input validation when dropdown operator changes or value changes
  useEffect(() => {
    if (inputValue.length) {
      (operator.value === "2" || operator.value === "3") && isNaN(inputValue)
        ? setValidationError(true)
        : setValidationError(false);
      return;
    }

    setValidationError(false);
  }, [inputValue, filterOn, setValidationError, operator]);

  return (
    <Grid container spacing={1} alignItems="center">
      <Grid item xs={4}>
        <Dropdown
          id="filterOn"
          label={`Left Condition`}
          options={leftConditionOptions}
          defaultValue={filterOn}
          onChange={(e) => {
            onDropdownChange(e.target.value, "filterOn", id);
          }}
        />
      </Grid>
      <Grid item xs={3}>
        <Dropdown
          id="operator"
          label={`Operator`}
          options={ConditionOptions}
          defaultValue={operator}
          onChange={(e) => {
            onDropdownChange(e.target.value, "operator", id);
          }}
        />
      </Grid>
      <Grid item xs={3}>
        <TextField
          id="conditionValue"
          label="Value"
          variant="filled"
          error={error}
          onChange={(e) => {
            setInputValue(e.target.value);
            onDropdownChange(e.target.value, "conditionValue", id);
          }}
        />
      </Grid>
      <Grid item xs={2}>
        <Box display="flex" justifyContent="flex-end" alignItems="center">
          <AddIcon
            style={{
              color: "#1976d2",
              cursor: "pointer",
              marginRight: "8px",
            }}
            onClick={() => {
              if (isLast) {
                addCondition({ groupId, leftConditionOptions });
              } else {
                insertNewConditionToExistingGroup({
                  groupId,
                  insertPosition: conditionPosition + 1,
                });
              }
              setShowPendingSkeleton(false);
            }}
            onMouseEnter={() => setShowPendingSkeleton(true)}
            onMouseLeave={() => setShowPendingSkeleton(false)}
          />

          <DeleteForeverIcon
            style={{
              color: "red",
              cursor: "pointer",
              fontSize: "2em",
            }}
            onClick={() => {
           
                deleteCondition({
                  conditionIdToDelete: id,
                  groupId,
                  conditionPosition,
                });
            
            }}
          >
            Delete
          </DeleteForeverIcon>
        </Box>
      </Grid>
      {showPendingSkeleton && (
        <Skeleton
          variant="rectangular"
          style={{
            width: "100%",
            height: "3em",
          }}
          sx={{ my: 2 }}
        />
      )}
    </Grid>
  );
};
