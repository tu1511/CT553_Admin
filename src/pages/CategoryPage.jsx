import { useDispatch, useSelector } from "react-redux";
// import { getCategories, deleteCategory } from "../../redux/thunk/categoryThunk";
import { useEffect, useState, useMemo } from "react";
import { Button, Modal, Table, message } from "antd";
import { Trash2, Edit } from "lucide-react";
import ActionHeader from "@components/common/ActionHeader";
import CategoryPopup from "@components/Popup/CategoryPopup";

const CategoryPage = () => {
  //   const dispatch = useDispatch();
  const { categories, loading } = useSelector((state) => state.category);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  //   useEffect(() => {
  //     dispatch(getCategories());
  //   }, [dispatch]);

  const handleSelected = (selectedRowKeys, selectedRows) => {
    setSelectedRows(selectedRows);
  };

  const handleUpdate = () => {
    if (selectedRows.length !== 1) {
      message.error("Vui lòng chọn 1 danh mục để cập nhật!");
    } else {
      setIsPopupOpen(true);
    }
  };

  const handleDelete = () => {
    if (selectedRows.length === 0) {
      message.error("Vui lòng chọn ít nhất một danh mục để xóa");
      return;
    }

    setIsModalOpen(true);
  };

  const confirmDelete = async () => {
    // try {
    //   await Promise.all(
    //     selectedRows.map(async (row) => {
    //       await dispatch(deleteCategory(row._id)).unwrap();
    //     })
    //   );
    //   message.success("Xóa thành công!");
    //   setSelectedRows([]);
    // } catch (err) {
    //   message.error("Có lỗi xảy ra!");
    // }
    setIsModalOpen(false);
  };

  const columns = useMemo(
    () => [
      {
        title: "STT",
        dataIndex: "id",
        align: "center",
        width: 60,
      },
      {
        title: "Tên danh mục",
        dataIndex: "categoryName",
      },
      {
        title: "Ngày cập nhật",
        dataIndex: "updatedAt",
        align: "center",
      },
      {
        title: "Ngày tạo",
        dataIndex: "createdAt",
        align: "center",
      },
    ],
    []
  );

  const rows = useMemo(
    () =>
      categories.map((category, index) => ({
        ...category,
        id: index + 1,
        updatedAt: category.updatedAt
          ? new Date(category.updatedAt).toLocaleDateString("vi-VN")
          : "",
        createdAt: category.createdAt
          ? new Date(category.createdAt).toLocaleDateString("vi-VN")
          : "",
      })),
    [categories]
  );

  return (
    <div>
      <ActionHeader
        title="Danh mục"
        onAdd={() => {
          setSelectedRows([]);
          setIsPopupOpen(true);
        }}
        onUpdate={handleUpdate}
        onDelete={handleDelete}
        selectedRows={selectedRows.map((row) => row._id)}
      />
      <Table
        loading={loading}
        rowSelection={{
          type: "checkbox",
          onChange: handleSelected,
        }}
        columns={columns}
        dataSource={rows}
        pagination={{ pageSize: 5 }}
        rowKey="_id"
      />
      <CategoryPopup
        isOpen={isPopupOpen}
        onClose={() => setIsPopupOpen(false)}
        data={selectedRows}
      />
      <Modal
        title="Xác nhận xóa"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={confirmDelete}
        okText="Chắc chắn"
        cancelText="Hủy"
      >
        Bạn có chắc chắn muốn xóa những danh mục đã chọn không?
      </Modal>
    </div>
  );
};

export default CategoryPage;
