import { Input } from "@Components";
import { useDataContext } from "@Context/DataContext";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";

export const DataLoader: React.ElementType = () => {
  const { url, setUrl, validate, error, setIsDirty, isDirty } = useDataContext();

  return (
    <>
      <Input
        fullWidth
        onBlur={validate}
        value={url}
        id={`data-loader`}
        label="URL"
        variant="filled"
        onChange={(e) => {
          setUrl(e.target.value);
          if (!isDirty) {
            setIsDirty(true);
          }
        }}
      />

      <span>
        Insert data url. Returning data MUST be an array json with each element
        is key/value pair
      </span>
      {error && <span> <ErrorOutlineIcon/> {error} </span>}
    </>
  );
};
