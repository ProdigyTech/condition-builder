import { Dropdown } from "@Components";
import { Grid, TextField, Button } from "@mui/material";
import { useState } from "react";
import { ConditionOptions } from "@Shared";
import { useTableContext } from "@Context/TableContext";

const Condition: React.FC = ({ leftCondition }) => {
  return (
    <>
      <Grid item xs={2} sm={4} md={4}>
        <Dropdown
          id="filterOn"
          label={`Left Condition`}
          options={leftCondition}
        />
      </Grid>
      <Grid item xs={2} sm={4} md={4}>
        <Dropdown id="operator" label={`Operator`} options={ConditionOptions} />
      </Grid>
      <Grid item xs={2} sm={4} md={4}>
        <TextField id="conditionValue" label="Value" variant="filled" />
      </Grid>
      <Button> +</Button>
    </>
  );
};

export const ConditionBuilder: React.FC = () => {
  const { columns } = useTableContext();
  const [conditions, setConditions] = useState([]);

  const addCondition = () => {
    setConditions((prevConditions) => [
      ...prevConditions,
      <Condition key={prevConditions.length + 1} leftCondition={columns} />,
    ]);
  };

  return (
    <Grid container>
      {conditions.map((condition, index) => {
        return condition;
      })}
      <Button onClick={addCondition}>Add +</Button>
    </Grid>
  );
};
