/**
 * Context for Data Management
 *
 * This context provides state and functions related to data management, including
 * loading data from a URL, validation, and tracking dirty state.
 *
 * Context properties:
 *   - url: The URL to load data from
 *   - setUrl: Function to update the URL
 *   - isLoading: Boolean indicating if data is currently being loaded
 *   - error: Error message if data loading or validation fails
 *   - validate: Function to trigger data validation and loading
 *   - data: The loaded data
 *   - isUrlValid: Boolean indicating if the URL is valid
 *   - isReady: Boolean indicating if the data is ready for display
 *   - isDirty: Boolean indicating if the input has been modified
 *   - setIsDirty: Function to update the dirty state
 *
 */

import axios from "axios";
import { useState, createContext } from "react";
import { flushSync } from "react-dom";

export interface IDataContext {
  url: string;
  setUrl: (url: string) => void;
  isLoading: boolean;
  error: string | null;
  validate: () => void;
  data: Array<>;
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
  const [data, setData] = useState(null);
  const [isUrlValid, setIsUrlValid] = useState(false);
  const [isReady, setIsReady] = useState(false);
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
        const { isValid, validationError } = isDataValid(responseData);

        if (isValid) {
          setData(responseData);
          setIsUrlValid(true);
          setIsReady(true);
        } else {
          setError(validationError || "Invalid data");
          setData([]);
          setIsUrlValid(false);
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
  const isDataValid: ValidationResult = (data) => {
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
        });
        loadData(url);
      } catch (error) {
        setError(error.message);
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

