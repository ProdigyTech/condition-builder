import {
  Grid,
  TextField,
  Button,
  Paper,
  Skeleton,
  Container,
} from "@mui/material";
import React, { useCallback, useEffect, useState, ReactElement } from "react";
import { ConditionOptions } from "@Shared";
import { useConditionsContext } from "@Context/ConditionBuilderContext";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import AddIcon from "@mui/icons-material/Add";
import { v4 as uuidv4 } from "uuid";
import { useDataContext } from "@Context/DataContext";
import { generateDefaultConditionObject } from "./index";

import { ConditionBlockProps } from "./types";

export const ConditionBlock = ({
  blockId,
  conditions = [],
  updateConditionsArray,
  addCondition,
}: ConditionBlockProps) => {
  const { columns = [] } = useConditionsContext();
  const leftConditionOptions = columns?.map((col) => {
    return {
      value: col.field,
      label: col.field,
    };
  });

  // handles the case of inserting new condition vs appending
  const insertNewConditionToExistingBlock = ({ blockId, insertPosition }) => {
    const updatedConditions = conditions.map((condition, index) => {
      if (index >= insertPosition) {
        return {
          ...condition,
          position: condition.position + 1,
        };
      }
      return condition;
    });

    const newCondition = generateDefaultConditionObject(
      insertPosition,
      leftConditionOptions,
      ConditionOptions,
      blockId
    );

    updatedConditions.splice(insertPosition, 0, newCondition);
    updateConditionsArray({ blockId, conditionArr: updatedConditions });
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

    updateConditionsArray({ conditionArr: updatedConditions, blockId });
  };

  return (
    <>
      <Grid container>
        {conditions.map(({ Component: Condition, id, position, ...rest }, index) => {
          console.log({isLast: conditions.length - 1 == position}, id, conditions)
          return (
            <React.Fragment key={`${id}-outer`}>
              {index !== 0 && (
                <Grid
                  style={{
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "1em",
                    fontWeight: "bold",
                  }}
                  item
                >
                  {" "}
                  OR{" "}
                </Grid>
              )}
              <Condition
                {...rest}
                key={id}
                id={id}
                blockId={blockId}
                addCondition={addCondition}
                isLast={conditions.length - 1 == position}
                onDropdownChange={onDropdownChange}
                // removeCondition={removeCondition}
                leftConditionOptions={leftConditionOptions}
                ConditionOptions={ConditionOptions}
                insertNewConditionToExistingBlock={
                  insertNewConditionToExistingBlock
                }
              />
            </React.Fragment>
          );
        })}
      </Grid>
    </>
  );
};
