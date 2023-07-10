import { DataGrid } from "@mui/x-data-grid";
import { Box, Skeleton, Chip } from "@mui/material";
import { useTableContext } from "@Context/TableContext";
export const Table: React.FC = () => {
  const { columns, rows, shouldDisplayGrid, total, filtered, isLoading } =
    useTableContext();

  const LoadingSkeleton = () => (
    <Box
      sx={{
        height: "max-content",
      }}
    >
      {[...Array(10)].map((_) => (
        <Skeleton variant="rectangular" sx={{ my: 4, mx: 1 }} />
      ))}
    </Box>
  );

  return shouldDisplayGrid || isLoading ? (
    <>
      <h2>
        {" "}
        {isLoading ? (
          <Skeleton variant="rectangular" sx={{ my: 4, mx: 1 }} />
        ) : (
          "Result"
        )}
      </h2>
      {isLoading ? (
        <Skeleton variant="rectangular" sx={{ my: 4, mx: 1 }} />
      ) : (
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
        rows={rows || []}
        columns={columns || []}
        components={{
          LoadingOverlay: LoadingSkeleton,
        }}
        loading={isLoading}
      />
    </>
  ) : (
    <></>
  );
};
