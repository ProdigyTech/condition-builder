import { DataGrid } from "@mui/x-data-grid";
import { useTableContext } from "@Context/TableContext";
export const Table: React.FC = () => {
  const { columns, rows, shouldDisplayGrid, total, filtered } =
    useTableContext();

  return shouldDisplayGrid ? (
    <>
      <h2> Result</h2>
      <p>Total: {total} </p> <p> Filtered: {filtered} </p>
      <div style={{ height: 500, width: "85%" }}>
        <DataGrid rows={rows} columns={columns} />
      </div>
    </>
  ) : (
    <></>
  );
};
