import { Input } from "@Components";
import { useDataContext } from "@Context/useDataContext";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import { Typography, Stack } from "@mui/material";

// DataLoader component
export const DataLoader: React.ElementType = () => {
  // Access data context
  const { url, setUrl, validate, error, setIsDirty, isDirty } =
    useDataContext();

  return (
    <>
      {/* Input component */}
      <Input
        fullWidth
        onBlur={validate}
        value={url}
        id={`data-loader-input`}
        label="Url"
        error={!!error}
        helperText={
          error ? (
            // Display error message and icon
            <Stack direction="row" alignItems="center" gap={1}>
              <ErrorOutlineIcon />
              <Typography component={"span"}>{error}</Typography>
            </Stack>
          ) : (
            // Display helper text
            <Stack direction="row" alignItems="center" gap={1}>
              <Typography component={"span"}>
                Insert data url. Returning data MUST be a json array where each
                element is a key/value pair
              </Typography>
            </Stack>
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

