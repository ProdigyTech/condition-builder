import { Dropdown } from "@Components";
import {
  Grid,
  TextField,
  Button,
  Paper,
  Skeleton,
  Container,
} from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import { ConditionOptions } from "@Shared";
import { useConditionsContext } from "@Context/ConditionBuilderContext";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import AddIcon from "@mui/icons-material/Add";
import { v4 as uuidv4 } from "uuid";
import { useDataContext } from "@Context/DataContext";

// type ConditionBlockProp = {
//    blockId: number
//   conditions:
//   updateConditionsArray,
//   position,
//   addCondition,
// }

// type Conditions

const Condition = ({
  id = 0,
  blockId,
  position,
  filterOn,
  operator,
  leftConditionOptions,
  addCondition,
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
          onClick={() => addCondition({ blockId })}
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

const ConditionBlock: React.FC = ({
  blockId,
  conditions = [],
  updateConditionsArray,
  position,
  addCondition,
}) => {
  const { columns = [] } = useConditionsContext();
  const leftConditionOptions = columns?.map((col) => {
    return {
      value: col.field,
      label: col.field,
    };
  });



  const addOr = () => {
    updateConditionsArray({
      blockId,
      conditionArr: [
        ...conditions,
        generateDefaultConditionObject(conditionArr.length),
      ],
    });
  }


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
                  addOr={addOr}
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

const generateEmptyConditionBlock = (pos: number, leftConditionOptions) => {
  const newBlockId = uuidv4();
  return {
    blockId: newBlockId,
    position: pos,
    conditions: [
      generateDefaultConditionObject(0, leftConditionOptions, newBlockId),
    ],
    Component: ConditionBlock,
  };
};

const generateDefaultConditionObject = (
  pos: number,
  leftConditionOptions,
  blockId
) => {
  return {
    Component: Condition,
    id: uuidv4(),
    blockId: blockId,
    position: pos,
    filterOn: leftConditionOptions[0],
    operator: ConditionOptions[0],
    conditionValue: "",
  };
};

export const ConditionBuilder: React.FC = () => {
  const { rows, isLoading, columns = [] } = useConditionsContext();
  const { isReady } = useDataContext();

  const leftConditionOptions = columns?.map((col) => {
    return {
      value: col.field,
      label: col.field,
    };
  });



  const [allConditionBlocks, setConditionBlocks] = useState([]);


  useEffect(() => {
    if (!isLoading && allConditionBlocks.length == 0 && isReady) {
      setConditionBlocks([
        generateEmptyConditionBlock(0, leftConditionOptions),
      ]);
    }
  }, [
    isLoading,
    setConditionBlocks,
    allConditionBlocks.length,
    isReady,
    leftConditionOptions,
  ]);

  const addNewAndBlock = (pos: number) => {
    setConditionBlocks((existing) => [
      ...existing,
      generateEmptyConditionBlock(pos),
    ]);
  };

  const addNewConditionToExistingBlock = ({ blockId }) => {
    const newConditions = allConditionBlocks.map((condition) => {
      if (condition.blockId === blockId) {
        return {
          ...condition,
          conditions: [
            ...condition.conditions,
            generateDefaultConditionObject(
              condition.conditions.length,
              leftConditionOptions,
              blockId
            ),
          ],
        };
      }
      return condition;
    });

    setConditionBlocks(newConditions);
  };

  const updateConditionsArray = ({ blockId, conditionArr }) => {
    /// TODO: can't i just do all of this in a map?
    const index = allConditionBlocks.findIndex((singularBlock) => {
      singularBlock.blockId === blockId;
    });

    if (index) {
      const updatedBlock = {
        ...allConditionBlocks[index],
        conditions: conditionArr,
      };

      const updatedConditions = [...allConditionBlocks];
      updatedConditions[index] = updatedBlock;
    }
  };

  return (
    <>
      {rows.length > 0 ? (
        <Paper
          elevation={2}
          style={{
            padding: "2em",
          }}
        >
          <>
            {allConditionBlocks.map(
              ({ blockId, Component, conditions, ...rest }) => {

                return (
                  <>
                    <Component
                      {...rest}
                      key={blockId}
                      blockId={blockId}
                      conditions={conditions}
                      addCondition={addNewConditionToExistingBlock}
                      updateConditionsArray={updateConditionsArray}
                    />

                    {allConditionBlocks.length > 0 && <span> AND </span>}
                  </>
                );
              }
            )}

            <Button onClick={() => addNewAndBlock(allConditionBlocks.length)}>
              {allConditionBlocks.length === 0 ? "Add Condition + " : "And +"}
            </Button>
          </>
        </Paper>
      ) : (
        <></>
      )}
    </>
  );
};
