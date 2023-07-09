import { useEffect, useState } from "react";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Box from "@mui/material/Box";
import Select, { SelectChangeEvent } from "@mui/material/Select";

interface Option {
  value: string;
  label: string;
}

interface DropdownProps {
  options: Option[];
  label: string;
  id: string;
}

export const Dropdown: React.FC<DropdownProps> = ({
  options,
  label,
  id,
  onChange,
  defaultValue,
}) => {
  const [selectValue, setSelectValue] = useState(defaultValue.value);

  const handleChange = (event: SelectChangeEvent) => {
    setSelectValue(event.target.value as string);

    if (typeof onChange === "function") {
      onChange(event);
    }
  };

  return (
    <Box sx={{ minWidth: 120 }}>
      <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">{label}</InputLabel>
        <Select
          labelId="demo-simple-select-label"
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
