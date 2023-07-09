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
  position,
  addCondition,
}: ConditionBlockProps) => {
  const { columns = [] } = useConditionsContext();
  const leftConditionOptions = columns?.map((col) => {
    return {
      value: col.field,
      label: col.field,
    };
  });

  const addOrCondition = () => {
    updateConditionsArray({
      blockId,
      conditionArr: [
        ...conditions,
        generateDefaultConditionObject(
          conditions.length,
          leftConditionOptions,
          blockId
        ),
      ],
    });
  };

  return (
    <>
      <Grid container>
        {conditions.map(({ Component: Condition, id, ...rest }, index) => {
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
                blockId={blockId}
                addOrCondition={addOrCondition}
                isLast={conditions.length - 1 == position}
                // removeCondition={removeCondition}
                leftConditionOptions={leftConditionOptions}
                ConditionOptions={ConditionOptions}
                addCondition={addCondition}
              />
            </React.Fragment>
          );
        })}
      </Grid>
    </>
  );
};
