import { DataGrid } from "@mui/x-data-grid";
import { useTableContext } from "@Context/TableContext";
export const Table: React.FC = () => {
  const { columns, rows, shouldDisplayGrid } = useTableContext();

  return Object.keys(rows).length ? (
    <div style={{ height: 500, width: "85%" }}>
      <DataGrid rows={rows} columns={columns} />
    </div>
  ) : (
    <></>
  );
};
