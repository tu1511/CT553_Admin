import { Table, Button, Input, Space } from "antd";
import { FileSpreadsheet, Edit, Trash } from "lucide-react";
import * as XLSX from "xlsx";
import PropTypes from "prop-types";
import { useState, useEffect } from "react";

const TableComponent = ({
  loading,
  rows,
  columns,
  pagination,
  checkbox = true,
  handleSelected = () => {},
  onEdit = () => {},
  onDelete = () => {},
}) => {
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [filteredRows, setFilteredRows] = useState(rows);
  const [searchFilters, setSearchFilters] = useState({});

  useEffect(() => {
    setFilteredRows(rows);
  }, [rows]);

  const handleSearch = (value, dataIndex) => {
    const updatedFilters = { ...searchFilters, [dataIndex]: value };
    setSearchFilters(updatedFilters);

    const filteredData = rows.filter((row) =>
      Object.entries(updatedFilters).every(([key, searchValue]) =>
        searchValue
          ? String(row[key] || "")
              .toLowerCase()
              .includes(searchValue.toLowerCase())
          : true
      )
    );
    setFilteredRows(filteredData);
  };

  const handleExportExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredRows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Filtered Data");
    XLSX.writeFile(workbook, "filtered_data.xlsx");
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

  const enhancedColumns = [
    ...columns.map((col) => ({
      ...col,
      sorter:
        col.sorter !== undefined
          ? col.sorter
          : (a, b) => {
              if (!a[col.dataIndex] || !b[col.dataIndex]) return 0;
              return String(a[col.dataIndex]).localeCompare(
                String(b[col.dataIndex]),
                "vi",
                { numeric: true }
              );
            },
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm }) => (
        <div style={{ padding: 8 }}>
          <Input
            placeholder={`Tìm ${col.title}`}
            value={selectedKeys[0]}
            onChange={(e) =>
              setSelectedKeys(e.target.value ? [e.target.value] : [])
            }
            onPressEnter={() => confirm()}
            style={{ width: 188, marginBottom: 8, display: "block" }}
          />
          <Space>
            <Button
              type="primary"
              onClick={() => confirm()}
              size="small"
              style={{ width: 90 }}
            >
              Tìm
            </Button>
            <Button
              onClick={() => {
                setSelectedKeys([]);
                handleSearch("", col.dataIndex);
                confirm();
              }}
              size="small"
              style={{ width: 90 }}
            >
              Xóa
            </Button>
          </Space>
        </div>
      ),
      onFilter: (value, record) =>
        String(record[col.dataIndex] || "")
          .toLowerCase()
          .includes(value.toLowerCase()),
    })),

    // Cột "Thao tác"
    {
      title: "Thao tác",
      key: "actions",
      width: 120,
      render: (_, record) => (
        <div className="flex gap-3">
          <Edit
            size={20}
            className="text-blue-500 cursor-pointer hover:text-blue-700"
            onClick={() => onEdit(record)}
          />
          <Trash
            size={20}
            className="text-red-500 cursor-pointer hover:text-red-700"
            onClick={() => onDelete(record)}
          />
        </div>
      ),
    },
  ];

  return (
    <div className="w-full overflow-x-auto p-4 bg-white shadow rounded-lg">
      <Table
        loading={loading}
        rowSelection={rowSelection}
        columns={enhancedColumns}
        dataSource={filteredRows}
        pagination={pagination}
        rowClassName={(_, index) =>
          index % 2 === 0 ? "bg-gray-100" : "bg-white"
        }
        bordered
      />
      <div className="flex justify-between items-center">
        <Button
          onClick={handleExportExcel}
          type="primary"
          icon={<FileSpreadsheet size={18} />}
        >
          Xuất Excel
        </Button>
      </div>
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
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
};

export default TableComponent;
