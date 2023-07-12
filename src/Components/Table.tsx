import { DataGrid, GridRowsProp } from "@mui/x-data-grid";
import { Box, Skeleton, Chip } from "@mui/material";
import { useTableContext } from "../context/useTableContext";
import { ReactElement } from "react";

export const Table: React.FC = (): ReactElement => {
  // Get table-related data from the table context
  const { columns, rows, shouldDisplayGrid, total, filtered, isLoading } =
    useTableContext();

  // Component to render loading skeleton
  const LoadingSkeleton: React.FC = () => (
    <Box
      sx={{
        height: "max-content",
      }}
    >
      {[...Array(10)].map((_, i) => (
        <Skeleton key={i} variant="rectangular" sx={{ my: 4, mx: 1 }} />
      ))}
    </Box>
  );

  // Render the table if shouldDisplayGrid is true or if data is loading
  return shouldDisplayGrid || isLoading ? (
    <>
      <h2>
        {" "}
        {isLoading ? (
          // Render a skeleton for the heading if data is loading
          <Skeleton variant="rectangular" sx={{ my: 4, mx: 1 }} />
        ) : (
          // Render the actual heading if data is not loading
          "Result"
        )}
      </h2>
      {isLoading ? (
        // Render a skeleton for the chip section if data is loading
        <Skeleton variant="rectangular" sx={{ my: 4, mx: 1 }} />
      ) : (
        // Render the actual chips with total and filtered counts if data is not loading
        <div style={{ marginBottom: "1em" }}>
          <Chip
            style={{ color: "black", marginRight: "1em" }}
            label={`Total: ${total}`}
          />
          <Chip
            style={{ backgroundColor: "#1976d2", color: "white" }}
            label={`Filtered:  ${filtered}`}
          />
        </div>
      )}

      <DataGrid
        style={{ height: 500 }}
        rows={rows || ([] as GridRowsProp)}
        columns={columns || ([])}
        components={{
          // Use the LoadingSkeleton component as the loading overlay for the DataGrid
          LoadingOverlay: LoadingSkeleton,
        }}
        loading={isLoading}
      />
    </>
  ) : (
    // If shouldDisplayGrid is false and data is not loading, render nothing
    <></>
  );
};
