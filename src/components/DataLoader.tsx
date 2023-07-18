import { Input } from "./index";
import { useDataContext } from "../context/useDataContext";
import { Typography } from "@mui/material";

// DataLoader component
export const DataLoader: React.ElementType = () => {
  // Access data context
  const { url, setUrl, validateAndLoad, error, setIsDirty, isDirty } =
    useDataContext();

  return (
    <>
      {/* Input component */}
      <Input
        fullWidth
        onBlur={validateAndLoad}
        value={url}
        id={`data-loader-input`}
        label="Url"
        error={!!error}
        helperText={
          error ? (
            // Display error message
            <Typography component={"span"}>{error}</Typography>
          ) : (
            // Display helper text
            <Typography component={"span"}>
              Insert data url. Returning data MUST be a json array where each
              element is a key/value pair
            </Typography>
          )
        }
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          // Update URL state
          setUrl(e.target.value);
          // Set isDirty flag if not already set
          if (!isDirty) {
            setIsDirty(true);
          }
        }}
      />
    </>
  );
};
