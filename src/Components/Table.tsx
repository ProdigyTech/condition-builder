import { DataGrid } from "@mui/x-data-grid";
import { useTableContext } from "@Context/TableContext";
export const Table: React.FC = () => {

    const { columns, transformedData } = useTableContext()

    console.log(columns, transformedData)

  return (
    <div style={{ height: 300, width: "100%" }}>
      <DataGrid rows={[]} columns={columns} />
    </div>
  );

};
