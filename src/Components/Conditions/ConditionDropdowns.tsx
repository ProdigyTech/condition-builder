import {
  Grid,
  TextField,
  Button,
  Paper,
  Skeleton,
  Container,
} from "@mui/material";

//TODO Update Imports
import { useCallback, useEffect, useState } from "react";
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
}) => {
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
          onChange={(e) => onDropdownChange(e.target.value, "filterOn", id)}
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
          onChange={(e) => onDropdownChange(e.target.value, "operator", id)} //TODO: NEED TO ADD new value to existing condition
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
          onChange={(e) =>
            onDropdownChange(e.target.value, "conditionValue", id)
          } //TODO: NEED TO ADD new value to existing condition
        />
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
          }}
        />

        <DeleteForeverIcon
          style={{
            padding: ".5em",
            fontSize: "2em",
            color: "red",
            cursor: "pointer",
          }}
          onClick={() => deleteCondition({ conditionIdToDelete: id, blockId, position})}
        >
          Delete
        </DeleteForeverIcon>
      </Grid>
    </>
  );
};
