import { Dropdown } from "@Components";
import { Grid, TextField, Button, Paper } from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import { ConditionOptions } from "@Shared";
import { useConditionsContext } from "@Context/ConditionBuilderContext";
import { v4 as uuidv4 } from "uuid";

const Condition: React.FC = ({ id = 0, blockId, addOr, isLast }) => {
  const {
    columns = [],
    addConditionToBlock,
    conditionBlocks,
  } = useConditionsContext();

  const leftConditionOptions = columns?.map((col) => {
    return {
      value: col.field,
      label: col.field,
    };
  });

  return (
    <>
      <Grid item xs={2} sm={4} md={4}>
        <Dropdown
          id="filterOn"
          label={`Left Condition`}
          options={leftConditionOptions}
          onChange={(e) =>
            addConditionToBlock({
              blockId: blockId,
              value: e.target.value,
              fieldId: "filterOn",
              id: id,
            })
          }
        />
      </Grid>
      <Grid item xs={2} sm={4} md={4}>
        <Dropdown
          id="operator"
          label={`Operator`}
          options={ConditionOptions}
          onChange={(e) => {
            addConditionToBlock({
              blockId: blockId,
              value: e.target.value,
              fieldId: "operator",
              id: id,
            });
          }}
        />
      </Grid>
      <Grid item xs={2} sm={4} md={4}>
        <TextField
          id="conditionValue"
          label="Value"
          variant="filled"
          onChange={(e) =>
            addConditionToBlock({
              blockId: blockId,
              value: e.target.value,
              fieldId: "conditionValue",
              id: id,
            })
          }
        />
        {isLast && <Button onClick={addOr}>+</Button>}
      </Grid>
    </>
  );
};

const ConditionBlock: React.FC = ({ blockId }) => {
  const [conditionArr, setConditionArr] = useState([Condition]);

  const addOr = () => {
    setConditionArr([...conditionArr, Condition]);
  };

  return (
    <>
      <Grid container>
        {conditionArr.map((Component, id) => (
          <>
            {id !== 0 && <> OR </>}
            <Component
              key={id}
              id={id}
              blockId={blockId}
              addOr={addOr}
              isLast={conditionArr.length - 1 == id}
            />
          </>
        ))}
      </Grid>
    </>
  );
};

export const ConditionBuilder: React.FC = () => {
  const { conditionBlocks, setConditionBlock } = useConditionsContext();

  const [conditionBlockComponents, setConditionBlockComponents] = useState([
    ConditionBlock,
  ]);

  const addNewAndBlock = useCallback(() => {
    setConditionBlockComponents((cb) => [...cb, ConditionBlock]);
  }, [setConditionBlock]);

 

  return (
    <>
      {conditionBlockComponents.map((C, i) => {
        return (
          <>
            <C blockId={i} />
            {conditionBlocks.length > 0 && <span> AND </span>}
          </>
        );
      })}

      <Button onClick={addNewAndBlock}> And +</Button>
    </>
  );
};
