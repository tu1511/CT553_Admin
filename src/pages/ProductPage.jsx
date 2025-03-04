import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { Button, Modal } from "antd";
import { toast } from "react-toastify";
import TableComponent from "@components/common/TableComponent";
import { getProducts } from "@redux/thunk/productThunk";
import PopupProduct from "@components/Popup/ProductPopup";
import { Plus } from "lucide-react";

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
    { title: "Danh mục", dataIndex: "categoryName", key: "categoryName" },
    {
      title: "Giá",
      dataIndex: "price",
      key: "price",
      align: "right",
      width: 120,
      render: (price) => `${Number(price).toLocaleString("vi-VN")} đ`,
    },
    {
      title: "Số lượng",
      dataIndex: "quantity",
      key: "quantity",
      align: "center",
      width: 80,
    },
  ];

  const rows = products?.products?.map((product, index) => ({
    stt: index + 1,
    ...product,
    key: product.id,
    categoryName: product?.categories?.[0]?.category?.name || "Chưa phân loại",
    visible: product?.visible,
    productImage: product?.images[0]?.image?.path,
    price: product?.variants[0]?.price,
    quantity: product?.variants[0]?.quantity,
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
        onDelete={(record) => {
          // console.log("xóa sản phẩm:", record);

          setSelectedRowKeys([record.key]);
          setIsDeleteModalOpen(true);
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
