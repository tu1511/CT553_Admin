import { Table, Button, Input } from "antd";
import { FileSpreadsheet } from "lucide-react";
import * as XLSX from "xlsx";
import PropTypes from "prop-types";
import { useState } from "react";

const TableComponent = ({
  loading,
  rows,
  columns,
  pagination,
  checkbox = true,
  handleSelected = () => {},
}) => {
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  const handleExportExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Data");
    XLSX.writeFile(workbook, "data.xlsx");
  };

  const rowSelection = checkbox
    ? {
        selectedRowKeys,
        onChange: (keys) => {
          setSelectedRowKeys(keys);
          handleSelected(keys);
        },
      }
    : undefined;

  return (
    <div className="w-full overflow-x-auto p-4 bg-white shadow rounded-lg">
      {/* Thanh công cụ */}
      <div className="mb-4 flex justify-between items-center">
        <Input.Search placeholder="Tìm kiếm..." allowClear className="w-1/3" />
        <Button
          onClick={handleExportExcel}
          type="primary"
          icon={<FileSpreadsheet size={18} />}
        >
          Xuất Excel
        </Button>
      </div>

      {/* Bảng dữ liệu */}
      <Table
        loading={loading}
        rowSelection={rowSelection}
        columns={columns}
        dataSource={rows}
        pagination={pagination}
        rowClassName={(_, index) =>
          index % 2 === 0 ? "bg-gray-100" : "bg-white"
        }
        bordered
      />
    </div>
  );
};

TableComponent.propTypes = {
  loading: PropTypes.bool.isRequired,
  rows: PropTypes.array.isRequired,
  columns: PropTypes.array.isRequired,
  pagination: PropTypes.object.isRequired,
  handleSelected: PropTypes.func,
  checkbox: PropTypes.bool,
};

export default TableComponent;
