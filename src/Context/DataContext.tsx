import axios from "axios";
import { useContext, useState, createContext } from "react";

interface IDataContext {
  url: string;
  setUrl: (url: string) => void;
  isLoading: boolean;
  error: string | null;
  validate: () => void;
  data: any;
  isUrlValid: boolean;
  isReady: boolean;
  isDirty: boolean;
  setIsDirty: () => void;
}

interface ValidationResult {
  isValid: boolean;
  validationError: string;
}

export const DataContext = createContext<IDataContext | null>(null);

//TODO: Clean up this file add types
export const DataProvider: React.FC = ({ children }) => {
  const [url, setUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<any>(null);
  const [isUrlValid, setIsUrlValid] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [isDirty, setIsDirty] = useState(false);

  const reset = () => {
    setUrl("");
    setIsLoading(false);
    setError(null);
    setData(null);
    setIsUrlValid(false);
    setIsReady(false);
    setIsDirty(false);
  };

  const loadData = (url: string) => {
    axios
      .get(url)
      .then(({ data: responseData }) => {
        setIsLoading(false);
        const { isValid, validationErrors } = isDataValid(responseData);
        if (isValid) {
          setData(responseData);
          setIsUrlValid(isValid);
          setIsReady(true);
        } else {
          setError(validationErrors);
          setData([]);
          setIsUrlValid(false);
        }
        setIsLoading(false);
        setIsDirty(false);
      })
      .catch((e) => {
        console.error(e.message);
        setError(e.message);
        setData(null);
        setIsReady(false);
        setIsLoading(false);
        setIsUrlValid(false);
      });
  };

  const isDataValid = (data: unknown[]): ValidationResult => {
    const validationResults: ValidationResult = {
      isValid: true,
      validationError: "",
    };

    if (!data) {
      validationResults.isValid = false;
      validationResults.validationError = "Data is Missing";
      return validationResults;
    }

    if (!Array.isArray(data)) {
      validationResults.isValid = false;
      validationResults.validationError = `Data is in the incorrect format! Data must be an array but is an ${typeof data}`;

      return validationResults;
    }

    if (validationResults.isValid) {
      const result = data.every((item: any) => {
        return typeof item === "object" && item !== null;
      });

      if (!result) {
        validationResults.isValid = false;
        validationResults.validationError = "Data is Missing";
        return validationResults;
      }
    }

    return validationResults;
  };

  const validate = () => {
    try {
      if (!url.length) {
        return reset();
      }

      if (url.length && isDirty) {
        new URL(url);
        setError(null);
        setIsLoading(true);
        loadData(url);
      }
    } catch (e) {
      setError(e.message);
      setError(null);
      setIsLoading(false);
      setIsReady(false);
    }
  };

  const contextValue: IDataContext = {
    url,
    setUrl,
    isLoading,
    error,
    validate,
    data,
    isUrlValid,
    isReady,
    isDirty,
    setIsDirty,
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
