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
  isUrlValid: boolean;
  isReady: boolean;
}

interface ValidationResult {
  isValid: boolean;
  validationErrors: string[];
}

export const DataContext = createContext<IDataContext | null>(null);

export const DataProvider: React.FC = ({ children }) => {
  const [url, setUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<any>(null);
  const [isUrlValid, setIsUrlValid] = useState(false);
  const [isReady, setIsReady] = useState(false);

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
          setError(validationErrors.join(" "));
          setData([]);
          setIsUrlValid(false);
        }
        setIsLoading(false);
      })
      .catch((e) => {
        console.error(e.message);
        setError(e.message);
        setIsLoading(false);
      });
  };

  const isDataValid = (data: unknown[]): ValidationResult => {
    const validationResults: ValidationResult = {
      isValid: true,
      validationErrors: [],
    };

    if (!data) {
      validationResults.isValid = false;
      validationResults.validationErrors = [
        ...validationResults.validationErrors,
        "Data is Missing",
      ];
    }

    if (!Array.isArray(data)) {
      validationResults.isValid = false;
      validationResults.validationErrors = [
        ...validationResults.validationErrors,
        `Data is in the incorrect format! Data must be an array but is an ${typeof data}`,
      ];
    }

    if (validationResults.isValid) {
      const result = data.every((item: any) => {
        return typeof item === "object" && item !== null;
      });

      if (!result) {
        validationResults.isValid = false;
        validationResults.validationErrors = [
          ...validationResults.validationErrors,
          "Data is Missing",
        ];
      }
    }

    return validationResults;
  };

  const validate = () => {
    try {
      if (url.length) {
        new URL(url);
        setError(null);
        setIsLoading(true);
        loadData(url);
      } else {
        setError(null);
        setIsLoading(false);
      }
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
    isUrlValid,
    isReady,
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
