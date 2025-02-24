import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState, useMemo } from "react";
import { Button, Modal, Tooltip } from "antd";
import { deleteCategory, getCategories } from "@redux/thunk/categoryThunk";
import CategoryPopup from "@components/Popup/CategoryPopup";
import TableComponent from "@components/common/TableComponent";
import { Plus } from "lucide-react";
import { toast } from "react-toastify";

const CategoryPage = () => {
  const dispatch = useDispatch();
  const { categories, loading } = useSelector((state) => state.category);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const accessToken = localStorage.getItem("accessToken");

  useEffect(() => {
    dispatch(getCategories());
  }, [dispatch]);

  const handleSelected = (selectedRowKeys) => {
    const selectedData = flatCategories.filter((row) =>
      selectedRowKeys.includes(row.id)
    );
    setSelectedRows(selectedData);
  };

  const confirmDelete = async () => {
    setIsDeleteModalOpen(false);
    try {
      const categoryId = selectedRows[0]?._id;
      // Dispatch deleteCategory và sử dụng unwrap() để nhận lỗi nếu có
      await dispatch(deleteCategory({ id: categoryId, accessToken })).unwrap();
      dispatch(getCategories());
      toast.success("Xóa danh mục thành công!");
    } catch (error) {
      console.error("Lỗi khi xóa danh mục:", error);
      toast.error("Lỗi khi xóa danh mục!");
    }
  };

  const flatCategories = useMemo(() => {
    return categories.reduce((acc, category) => {
      acc.push({
        id: acc.length + 1,
        _id: category.id,
        categoryName: category.name,
        categoryParent: category.parent ? category.parent.name : "Không có",
        slug: category.slug,
        thumbnailId: category.thumbnailImageId,
        idParent: category.parent ? category.parent.id : null,
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
            slug: child.slug,
            idParent: category.id,
            categoryParent: category.name,
            thumbnailId: child.thumbnailImageId,
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

  // console.log("Danh sách danh mục:", flatCategories);

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
      <div className="flex justify-between items-center mb-4">
        <div className=""></div>
        <Button
          type="primary"
          icon={<Plus size={28} />}
          onClick={() => {
            setIsUpdateModalOpen(true);
          }}
        >
          Thêm danh mục
        </Button>
      </div>
      <TableComponent
        loading={loading}
        rows={flatCategories}
        columns={columns}
        pagination={{ pageSize: 5 }}
        onEdit={(record) => {
          // console.log("Sửa danh mục:", record);
          setSelectedRows([record]);
          setIsUpdateModalOpen(true);
        }}
        onDelete={(record) => {
          // console.log("Xóa danh mục:", record);
          setSelectedRows([record]);
          setIsDeleteModalOpen(true);
        }}
        checkbox={false}
        handleSelected={handleSelected}
      />

      {/* Popup Thêm / Cập nhật danh mục */}
      <CategoryPopup
        isOpen={isUpdateModalOpen}
        onClose={() => setIsUpdateModalOpen(false)}
        data={selectedRows[0] || null}
      />

      {/* Modal Xác nhận Xóa */}
      <Modal
        title="Xác nhận xóa"
        open={isDeleteModalOpen}
        onCancel={() => setIsDeleteModalOpen(false)}
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
