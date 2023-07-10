import { Grid } from "@mui/material";
import React, { useState } from "react";
import { ConditionOptions } from "@Shared";
import { generateDefaultConditionObject } from "./index";
import { ConditionBlockProps } from "./types";
import { useTableContext } from "@Context/TableContext";
import { Skeleton } from "@mui/material";

export const ConditionBlock = ({
  blockId,
  conditions = [],
  updateConditionsArray,
  addCondition,
}: ConditionBlockProps) => {
  const [showPendingSkeleton, setShowPendingSkeleton] = useState({index: 0});

  const { columns = [] } = useTableContext();
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

  const deleteCondition = ({ conditionIdToDelete, blockId }) => {
    const updatedConditions = conditions
      .filter((condition) => condition.id !== conditionIdToDelete)
      .map((condition, index) => ({
        ...condition,
        position: index,
      }));

    updateConditionsArray({
      blockId,
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

    updateConditionsArray({ conditionArr: updatedConditions, blockId });
  };

  return (
    <>
      <Grid container>
        {conditions.map(
          ({ Component: Condition, id, position, ...rest }, index) => {
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
                  deleteCondition={deleteCondition}
                  leftConditionOptions={leftConditionOptions}
                  ConditionOptions={ConditionOptions}
                  position={position}
                  insertNewConditionToExistingBlock={
                    insertNewConditionToExistingBlock
                  }
                  setShowPendingSkeleton={setShowPendingSkeleton}
                />

                {showPendingSkeleton && showPendingSkeleton.index === index && (
                  <Skeleton variant="rectangular" style={{width: "100%", height: "3em"}}sx={{ my: 4, mx: 1 }} />
                )}
              </React.Fragment>
            );
          }
        )}
      </Grid>
    </>
  );
};
