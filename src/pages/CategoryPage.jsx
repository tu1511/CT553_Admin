import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState, useMemo } from "react";
import { Button, Modal, Table, message, Tooltip } from "antd";
import { getCategories } from "@redux/thunk/categoryThunk";
import ActionHeader from "@components/common/ActionHeader";
import CategoryPopup from "@components/Popup/CategoryPopup";

const CategoryPage = () => {
  const dispatch = useDispatch();
  const { categories, loading } = useSelector((state) => state.category);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    dispatch(getCategories());
  }, [dispatch]);

  const handleSelected = (selectedRowKeys, selectedRows) => {
    setSelectedRows(selectedRows);
  };

  const handleUpdate = () => {
    if (selectedRows.length !== 1) {
      message.error("Vui lòng chọn 1 danh mục để cập nhật!");
      return;
    }
    setIsPopupOpen(true);
  };

  const handleDelete = () => {
    if (selectedRows.length === 0) {
      message.error("Vui lòng chọn ít nhất một danh mục để xóa");
      return;
    }
    setIsModalOpen(true);
  };

  const confirmDelete = async () => {
    setIsModalOpen(false);
    // TODO: Xử lý xóa danh mục (hiện tại đang bị comment)
  };

  // Chuyển danh mục sang dạng danh sách phẳng
  const flatCategories = useMemo(() => {
    return categories.reduce((acc, category) => {
      acc.push({
        id: acc.length + 1,
        _id: category.id,
        categoryName: category.name,
        categoryParent: category.parent ? category.parent.name : "Không có",
        thumbnail: category.thumbnailImage
          ? category.thumbnailImage.path
          : null,
        updatedAt: category.updatedAt
          ? new Date(category.updatedAt).toLocaleDateString("vi-VN")
          : "",
        createdAt: category.createdAt
          ? new Date(category.createdAt).toLocaleDateString("vi-VN")
          : "",
      });

      if (category.children && category.children.length > 0) {
        category.children.forEach((child) => {
          acc.push({
            id: acc.length + 1,
            _id: child.id,
            categoryName: child.name,
            categoryParent: category.name,
            thumbnail: child.thumbnailImage ? child.thumbnailImage.path : null,
            updatedAt: child.updatedAt
              ? new Date(child.updatedAt).toLocaleDateString("vi-VN")
              : "",
            createdAt: child.createdAt
              ? new Date(child.createdAt).toLocaleDateString("vi-VN")
              : "",
          });
        });
      }

      return acc;
    }, []);
  }, [categories]);

  const columns = useMemo(
    () => [
      {
        title: "STT",
        dataIndex: "id",
        align: "center",
        width: 60,
      },
      {
        title: "Ảnh",
        dataIndex: "thumbnail",
        align: "center",
        render: (thumbnail) =>
          thumbnail ? (
            <Tooltip title={<img src={thumbnail} alt="Preview" width={150} />}>
              <img
                src={thumbnail}
                alt="Thumbnail"
                style={{
                  width: 50,
                  height: 50,
                  objectFit: "cover",
                  borderRadius: 4,
                }}
              />
            </Tooltip>
          ) : (
            "Không có ảnh"
          ),
      },
      {
        title: "Tên danh mục",
        dataIndex: "categoryName",
        ellipsis: true,
      },
      {
        title: "Danh mục cha",
        dataIndex: "categoryParent",
        align: "center",
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
        selectedRows={selectedRows.map((row) => row.id)}
      />

      <Table
        loading={loading}
        rowSelection={{
          type: "checkbox",
          onChange: handleSelected,
        }}
        columns={columns}
        dataSource={flatCategories}
        pagination={{ pageSize: 5 }}
        rowKey="id"
      />

      {/* Popup Thêm / Cập nhật danh mục */}
      {/* <CategoryPopup
        isOpen={isPopupOpen}
        onClose={() => setIsPopupOpen(false)}
        data={selectedRows[0] || null}
      /> */}

      {/* Modal Xác nhận Xóa */}
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
