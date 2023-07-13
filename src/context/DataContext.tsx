/**
 * Context for Data Management
 *
 * This context provides state and functions related to data management, including
 * loading data from a URL, validation, and tracking dirty state of the url input.
 *
 * Context properties:
 *   - url: The URL to load data from
 *   - setUrl: Function to update the URL state
 *   - isLoading: Boolean indicating if data is currently being fetched from the url
 *   - error: Error message if data loading or validation fails
 *   - validate: Function that validates the URL, making sure it's valid and validates the data from the axios call.
 *   - data: The loaded data from the URL.
 *   - isUrlValid: Boolean indicating if the URL is valid
 *   - isReady: Boolean indicating if the data is ready for display
 *   - isDirty: Boolean indicating if the input has been modified
 *   - setIsDirty: Function to update the dirty state
 *
 */

import axios from "axios";
import { useState, createContext } from "react";
import { flushSync } from "react-dom";

export type IDataContext = {
  url: string;
  setUrl: React.Dispatch<React.SetStateAction<string>>;
  isLoading: boolean;
  error: string | null;
  validate: () => void;
  data: any[];
  isUrlValid: boolean;
  isReady: boolean;
  isDirty: boolean;
  setIsDirty: React.Dispatch<React.SetStateAction<boolean>>;
};

type DataProviderProps = {
  children: React.ReactNode;
};

type ValidationResult = {
  isValid: boolean;
  validationError: string | null;
};

export const DataContext = createContext<IDataContext | null>(null);

export const DataProvider: React.FC<DataProviderProps> = ({ children }) => {
  const [url, setUrl] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<any>(null);
  const [isUrlValid, setIsUrlValid] = useState<boolean>(false);
  const [isReady, setIsReady] = useState<boolean>(false);
  const [isDirty, setIsDirty] = useState<boolean>(false);

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
    setIsReady(false);
    axios
      .get(url)
      .then(({ data: responseData }) => {
        const { isValid: isResponseValid, validationError } = isDataValid(
          responseData
        );
        if (isResponseValid) {
          setData(responseData);
          setIsReady(true);
        } else {
          setError(validationError || "Invalid data");
          setData([]);
        }
      })
      .catch((error) => {
        console.error("Error during data loading:", error);
        setError("Error occurred while loading data");
        setData(null);
      })
      .finally(() => {
        setIsLoading(false);
        setIsDirty(false);
      });
  };

  // Checks to make sure the data is defined and is in the correct format
  const isDataValid: (data: any) => ValidationResult = (data) => {
    if (!data) {
      return { isValid: false, validationError: "Data is missing" };
    }

    if (!Array.isArray(data)) {
      return { isValid: false, validationError: "Data must be an array" };
    }

    if (data.length === 0) {
      return { isValid: false, validationError: "Data is empty" };
    }

    for (let i = 0; i < data.length; i++) {
      const item = data[i];
      if (typeof item !== "object" || item === null) {
        return {
          isValid: false,
          validationError: `Invalid item at index ${i}`,
        };
      }
    }

    return { isValid: true, validationError: null };
  };

  // Validation function that runs onBlur
  const validate = () => {
  
    if (!url.length) {
      return reset();
    }

    if (url.length && isDirty) {
      try {
        new URL(url);
        // don't batch useStates, with the rest, fire immediately flushSync.
        // resolves issue where filters are sticky when you load another data set from a cached resource
        flushSync(() => {
          setData(null);
          setError(null);
          setIsLoading(true);
          setIsUrlValid(true);
        });
        loadData(url);
      } catch (err) {
        setError((err as Error).message);
        setIsLoading(false);
        setIsReady(false);
      }
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
