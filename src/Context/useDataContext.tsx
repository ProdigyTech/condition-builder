import { useContext } from "react";
import { DataContext } from "./DataContext";

interface DataContextReturnType {
  url: string;
  setUrl: (url: string) => void;
  validate: () => void;
  error: string | null;
  setIsDirty: (isDirty: boolean) => void;
  isDirty: boolean;
  isLoading: boolean
  data: Array<unknown>;
  isUrlValid: boolean,
  isReady: boolean,
}

export const useDataContext = (): DataContextReturnType => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error("useDataContext must be used within a DataProvider");
  }
  return context;
};