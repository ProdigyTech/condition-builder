import axios from "axios";
import {
  useContext,
  useState,
  useMemo,
  useCallback,
  createContext,
} from "react";

interface IDataContext {
  url: string;
  setUrl: (url: string) => void;
  isLoading: boolean;
  error: string | null;
  validate: () => void;
  data: any;
}

const DataContext = createContext<IDataContext | null>(null);

export const DataProvider: React.FC = ({ children }) => {
  const [url, setUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<any>(null);

  const loadData = (url: string) => {
    axios
      .get(url)
      .then(({ data: responseData }) => {
        setIsLoading(false);
        setData(responseData);
        setIsLoading(false);
      })
      .catch((e) => {
        console.error(e.message);
        setError(e.message);
        setIsLoading(false);
      });
  };

  const validateData = (data) => {
    if (!data) throw new Error("Data is missing");

    if (typeof data !== 'Array') throw new Error("Data is in the incorrect format");
  };

  const validateURL = () => {
    try {
      new URL(url);
      setError(null);
      setIsLoading(true);
      loadData(url);
    } catch (e) {
      console.error(e.message);
      setError(e.message);
    }
  };

  const contextValue: IDataContext = {
    url,
    setUrl,
    isLoading,
    error,
    validate,
    data,
  };

  return (
    <DataContext.Provider value={contextValue}>{children}</DataContext.Provider>
  );
};

export const useDataContext = (): IDataContext => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error("useDataContext must be used within a DataProvider");
  }
  return context;
};
