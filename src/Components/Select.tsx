import { useState } from "react";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Box from "@mui/material/Box";
import Select from "@mui/material/Select";

type Option = {
  value: string;
  label: string;
};

type onChangeFunc = (e: React.ChangeEvent<HTMLInputElement>) => void;

type DropdownProps = {
  options: Option[];
  label: string;
  id: string;
  onChange: onChangeFunc;
  defaultValue: string;
};

export const Dropdown: React.FC<DropdownProps> = ({
  options,
  label,
  id,
  onChange,
  defaultValue = "",
}) => {
  const [selectValue, setSelectValue] = useState(defaultValue);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectValue(event.target.value as string);

    if (typeof onChange === "function") {
      onChange(event);
    }
  };

  return (
    <Box sx={{ minWidth: 120 }}>
      <FormControl fullWidth>
        <InputLabel id="">{label}</InputLabel>
        <Select
          labelId=""
          id={id}
          value={selectValue}
          label={label}
          onChange={handleChange}
          autoWidth
        >
          {options.map((option, index) => {
            return (
              <MenuItem value={option.value} key={`${option.value}-${index}`}>
                {option.label}
              </MenuItem>
            );
          })}
        </Select>
      </FormControl>
    </Box>
  );
};
