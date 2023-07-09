import { ConditionDropdown } from "./Conditions/ConditionDropdowns";
import {
  Grid,
  TextField,
  Button,
  Paper,
  Skeleton,
  Container,
} from "@mui/material";
import { useCallback, useEffect, useState, ReactElement } from "react";
import { ConditionOptions } from "@Shared";
import { useConditionsContext } from "@Context/ConditionBuilderContext";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import AddIcon from "@mui/icons-material/Add";
import { v4 as uuidv4 } from "uuid";
import { useDataContext } from "@Context/DataContext";
import { generateDefaultConditionObject } from "./index";


type ConditionsObject = {
  Component: ReactElement;
  id: string;
  blockId: string;
  position: number;
  filterOn: string;
  operator: string;
  conditionValue: string;
};


type ConditionBlockProps = {
  blockId: number;
  conditions: Array<ConditionsObject>;
  updateConditionsArray: UpdateConditionsArrayFunc;
  position: number;
  addCondition: AddConditionFunc;
};

type UpdateConditionsArrayFunc = (arg: {
  blockId: string;
  conditionArr: Array<ConditionsObject>;
}) => void;


type AddConditionFunc = (arg: { blockId: string }) => void;

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
            <>
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
            </>
          );
        })}
      </Grid>
    </>
  );
};
