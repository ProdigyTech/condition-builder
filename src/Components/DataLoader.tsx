import { Input } from "@Components";
import { useDataContext } from "@Context/DataContext";

export const DataLoader: React.FC = () => {
  const { url, setUrl, validate, error } = useDataContext();

  return (
    <>
      <Input
        onBlur={validate}
        value={url}
        id={`data-loader`}
        label="URL"
        variant="filled"
        onChange={(e) => setUrl(e.target.value)}
      />
      {error && <span> {error} </span>}
    </>
  );
};
