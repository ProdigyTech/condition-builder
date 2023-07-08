import { Input } from "@Components";
import { useDataContext } from "@Context/DataContext";

export const DataLoader: React.FC = () => {
  const { url, setUrl, validate, error } = useDataContext();

  return (
    <>
      <Input
        fullWidth
        onBlur={validate}
        value={url}
        id={`data-loader`}
        label="URL"
        variant="filled"
        onChange={(e) => setUrl(e.target.value)}
      />
  
      <span>Insert data url. Returning data MUST be an array json with each element is key/value pair</span>
      {error && <span> {error} </span>}
    </>
  );
};
