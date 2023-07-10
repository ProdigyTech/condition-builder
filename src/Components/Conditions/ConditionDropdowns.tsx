import {
  Grid,
  TextField,
  Button,
  Paper,
  Skeleton,
  Container,
} from "@mui/material";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";

//TODO Update Imports
import { useCallback, useEffect, useState, useRef } from "react";
import { ConditionOptions } from "@Shared";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import AddIcon from "@mui/icons-material/Add";
import { Dropdown } from "../Select";

//Todo: Add types

export const ConditionDropdown = ({
  id,
  blockId,
  position,
  filterOn,
  operator,
  leftConditionOptions,
  addCondition,
  onDropdownChange,
  insertNewConditionToExistingBlock,
  deleteCondition,
  isLast,
  setShowPendingSkeleton,
}) => {
  const [error, setValidationError] = useState(false);
  const inputRef = useRef();

  // input validation when dropdown operator changes or value changes
  useEffect(() => {
    if (inputRef?.current?.value) {
      (operator.value === "2" || operator.value === "3") &&
      isNaN(inputRef.current.value)
        ? setValidationError(true)
        : setValidationError(false);
      return;
    }

    setValidationError(false);
  }, [inputRef, filterOn, setValidationError, operator]);

  return (
    <>
      <Grid
        item
        xs={position == 0 ? 4 : 3}
        sm={position == 0 ? 4 : 3}
        md={position == 0 ? 4 : 3}
      >
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
      <Grid
        item
        xs={position == 0 ? 4 : 3}
        sm={position == 0 ? 4 : 3}
        md={position == 0 ? 4 : 3}
      >
        <Dropdown
          id="operator"
          label={`Operator`}
          options={ConditionOptions}
          defaultValue={operator}
          onChange={(e) => {
            onDropdownChange(e.target.value, "operator", id);
          }} //TODO: NEED TO ADD new value to existing condition
        />
      </Grid>
      <Grid
        item
        xs={position == 0 ? 4 : 3}
        sm={position == 0 ? 4 : 3}
        md={position == 0 ? 4 : 3}
      >
        <TextField
          id="conditionValue"
          label="Value"
          variant="filled"
          inputRef={inputRef}
          onChange={(e) => {
            onDropdownChange(e.target.value, "conditionValue", id);
          }}
        />
        {error && (
          <>
            {" "}
            <ErrorOutlineIcon />
            <p> Value must be a number when using comparison operator</p>
          </>
        )}

        <AddIcon
          style={{
            padding: ".5em",
            fontSize: "2em",
            color: "#1976d2",
            cursor: "pointer",
          }}
          onClick={() => {
            if (isLast) {
              addCondition({ blockId, leftConditionOptions });
            } else {
              insertNewConditionToExistingBlock({
                blockId,
                insertPosition: position + 1,
              });
            }
            setShowPendingSkeleton(null)
          }}
          onMouseEnter={() => setShowPendingSkeleton({ index: position })}
          onMouseLeave={() => setShowPendingSkeleton(null)}
        />

        <DeleteForeverIcon
          style={{
            padding: ".5em",
            fontSize: "2em",
            color: "red",
            cursor: "pointer",
          }}
          onClick={() =>
            deleteCondition({ conditionIdToDelete: id, blockId, position })
          }
        >
          Delete
        </DeleteForeverIcon>
      </Grid>
    </>
  );
};
