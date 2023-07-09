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
import { useConditionsContext } from "@Context/ConditionBuilderContext";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import AddIcon from "@mui/icons-material/Add";
import { v4 as uuidv4 } from "uuid";
import { useDataContext } from "@Context/DataContext";
import { Dropdown } from "../Select";


//Todo: Add type

export const ConditionDropdown = ({
  id = 0,
  blockId,
  position,
  filterOn,
  operator,
  leftConditionOptions,
  addOrCondition,
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
          onChange={() => {}} //TODO: NEED TO ADD new value to existing condition
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
          onChange={() => {}} //TODO: NEED TO ADD new value to existing condition
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
          onChange={() => {}} //TODO: NEED TO ADD new value to existing condition
        />
        <AddIcon
          style={{
            padding: ".5em",
            fontSize: "2em",
            color: "#1976d2",
            cursor: "pointer",
          }}
          onClick={() => addOrCondition({ blockId })}
        />

        <DeleteForeverIcon
          style={{
            padding: ".5em",
            fontSize: "2em",
            color: "red",
            cursor: "pointer",
          }}
        >
          Delete
        </DeleteForeverIcon>
      </Grid>
    </>
  );
};
