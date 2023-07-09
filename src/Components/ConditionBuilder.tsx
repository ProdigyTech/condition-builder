/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */

import { Dropdown } from "@Components";
import { Grid, TextField, Button, Paper } from "@mui/material";
import { useState } from "react";
import { ConditionOptions } from "@Shared";
import { useConditionsContext } from "@Context/ConditionBuilderContext";
import { v4 as uuidv4 } from "uuid";

const Condition: React.FC = ({ id = 0, addOr, isLast }) => {
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
              blockId: 0,
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
              blockId: 0,
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
              blockId: 0,
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

export const ConditionBuilder: React.FC = () => {
  const { conditionBlocks = [] } = useConditionsContext();

  const [conditionArr, setConditionArr] = useState([Condition]);

  const addOr = () => {
    setConditionArr([...conditionArr, Condition]);
  };

  const addAnd = () => {};

  return (
    <>
      <Grid container>
        {conditionArr.map((Component, id) => (
          <>
            {id !== 0 && <> OR </>}
            <Component
              key={id}
              id={id}
              addOr={addOr}
              isLast={conditionArr.length - 1 == id}
            />
          </>
        ))}
      </Grid>
      {/* <Button onClick={() => {}}> And +</Button> */}
    </>
  );
};
