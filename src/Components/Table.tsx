import { DataGrid } from "@mui/x-data-grid";
import { Box, Skeleton } from "@mui/material";
import { useTableContext } from "@Context/TableContext";
export const Table: React.FC = () => {
  const {
    columns,
    rows,
    shouldDisplayGrid,
    total,
    filtered,
    isLoading,
  } = useTableContext();

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
      <p>
        {isLoading ? (
          <Skeleton variant="rectangular" sx={{ my: 4, mx: 1 }} />
        ) : (
          `Total: ${total}`
        )}
      </p>{" "}
      <p>
        {" "}
        {isLoading ? (
          <Skeleton variant="rectangular" sx={{ my: 4, mx: 1 }} />
        ) : (
          `Filtered: ${filtered}`
        )}{" "}
      </p>
      <div style={{ height: 500, width: "85%" }}>
        <DataGrid
          rows={rows || []}
          columns={columns || []}
          components={{
            LoadingOverlay: LoadingSkeleton,
          }}
          loading={isLoading}
        />
      </div>
    </>
  ) : (
    <></>
  );
};
