import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { Button, Modal } from "antd";
import { toast } from "react-toastify";
import TableComponent from "@components/common/TableComponent";
import { getProducts } from "@redux/thunk/productThunk";
import PopupProduct from "@components/Popup/ProductPopup";
import { Plus } from "lucide-react";
import { StarFilled } from "@ant-design/icons";

const ProductPage = () => {
  const dispatch = useDispatch();
  const { products, loading } = useSelector((state) => state.product);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  useEffect(() => {
    dispatch(getProducts({}));
  }, [dispatch]);

  const handleSelected = (keys) => {
    const selected = products?.products?.filter((product) =>
      keys.includes(product.id)
    );
    setSelectedRowKeys(keys);
    setSelectedRows(selected);
  };

  const confirmDelete = async () => {
    setIsDeleteModalOpen(false);
    toast.success("Xóa sản phẩm thành công!");
  };

  const columns = [
    {
      title: "STT",
      dataIndex: "stt",
      key: "stt",
      width: 50,
      align: "center",
    },
    {
      title: "Hình ảnh",
      dataIndex: "productImage",
      key: "productImage",
      align: "center",
      render: (text) => (
        <img
          src={text}
          alt="Product"
          style={{
            width: 50,
            height: 50,
            objectFit: "cover",
            borderRadius: 10,
          }}
        />
      ),
    },
    { title: "Tên sản phẩm", dataIndex: "name", key: "name" },
    {
      title: "Trạng thái",
      dataIndex: "visible",
      key: "visible",
      render: (visible) => (
        <span
          className={
            visible === true
              ? "text-green-600 font-semibold"
              : "text-red-500 font-semibold"
          }
        >
          {visible ? "Hiển thị" : "Đã ẩn"}
        </span>
      ),
    },

    {
      title: "Giá",
      dataIndex: "price",
      key: "price",
      align: "right",
      width: 120,
      render: (price) => `${Number(price).toLocaleString("vi-VN")} đ`,
    },
    {
      title: "Số lượng còn lại",
      dataIndex: "quantity",
      key: "quantity",
      align: "center",
      width: 130,
    },
    {
      title: "Đánh giá",
      dataIndex: "rating",
      key: "rating",
      align: "center",
      width: 80,
      render: (text) => (
        <span className="flex items-center gap-1">
          {text}

          <StarFilled className="text-yellow-400 text-lg" />
        </span>
      ),
    },
  ];

  const calculateAverageRating = (reviews = []) => {
    const validReviews = reviews.filter(
      (review) => review.rating !== null && review.rating !== undefined
    );
    if (validReviews.length === 0) return 0; // Mặc định 5 nếu không có rating hợp lệ
    const totalRating = validReviews.reduce(
      (sum, review) => sum + review.rating,
      0
    );
    return totalRating / validReviews.length;
  };

  const rows = products?.products?.map((product, index) => ({
    stt: index + 1,
    ...product,
    key: product.id,
    visible: product?.visible,
    productImage: product?.images[0]?.image?.path,
    rating: calculateAverageRating(product?.reviews),
    price: product?.variants[0]?.price,
    quantity: product?.totalQuantity - product?.soldNumber,
  }));

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <div className=""></div>
        <Button
          type="primary"
          icon={<Plus size={28} />}
          onClick={() => {
            setEditingProduct({}); // Đối tượng rỗng cho chế độ tạo mới sản phẩm
            setIsUpdateModalOpen(true);
          }}
        >
          Thêm sản phẩm
        </Button>
      </div>
      <TableComponent
        loading={loading}
        onEdit={(record) => {
          setEditingProduct(record);
          // console.log("Sửa sản phẩm:", record);
          setIsUpdateModalOpen(true);
        }}
        checkbox={false}
        rows={rows}
        columns={columns}
        pagination={{ pageSize: 5 }}
        handleSelected={handleSelected}
      />
      {/* Modal xác nhận xóa */}

      <Modal
        title="Xác nhận xóa"
        open={isDeleteModalOpen}
        onOk={confirmDelete}
        onCancel={() => setIsDeleteModalOpen(false)}
        okText="Xóa"
        cancelText="Hủy"
      >
        <p>Bạn có chắc chắn muốn xóa sản phẩm đã chọn không?</p>
      </Modal>
      {/* Modal xác nhận cập nhật */}

      <PopupProduct
        isOpen={isUpdateModalOpen}
        onClose={() => {
          setIsUpdateModalOpen(false);
        }}
        product={editingProduct}
      />
    </div>
  );
};

export default ProductPage;
