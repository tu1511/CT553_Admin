import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { Button, Table, Modal } from "antd";
import { Trash2, Edit, Plus } from "lucide-react";
import { toast } from "react-toastify";
import ActionHeader from "@components/common/ActionHeader";
import ProductPopup from "@components/Popup/ProductPopup";
import { getProducts } from "@redux/thunk/productThunk";

const ProductPage = () => {
  const dispatch = useDispatch();
  const { products, loading } = useSelector((state) => state.product);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  useEffect(() => {
    dispatch(getProducts({}));
  }, [dispatch]);

  console.log("products", products);

  const handleSelected = (selectedRowKeys, selectedRows) => {
    setSelectedRows(selectedRows);
  };

  const handleUpdate = () => {
    if (selectedRows.length !== 1) {
      toast.error("Vui lòng chọn 1 sản phẩm để cập nhật!");
    } else {
      setIsPopupOpen(true);
    }
  };

  const handleDelete = () => {
    if (selectedRows.length === 0) {
      toast.error("Vui lòng chọn ít nhất một sản phẩm để xóa");
      return;
    }

    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    // try {
    //   await dispatch(
    //     deleteProduct(selectedRows.map((row) => row._id))
    //   ).unwrap();
    //   toast.success("Xóa thành công!");
    //   setSelectedRows([]);
    // } catch (err) {
    //   toast.error("Có lỗi xảy ra!");
    // }
    // setIsDeleteModalOpen(false);
  };

  const columns = [
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
    {
      title: "Tên sản phẩm",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Danh mục",
      dataIndex: "categoryName",
      key: "categoryName",
    },
    {
      title: "Giá",
      dataIndex: "price",
      key: "price",
      align: "right",
      render: (price) => `${Number(price).toLocaleString("vi-VN")} đ`,
    },
    {
      title: "Số lượng",
      dataIndex: "quantity",
      key: "quantity",
      align: "center",
    },
  ];

  const dataSource = products?.products?.map((product) => ({
    ...product,
    key: product.id,
    categoryName: product?.categories?.[0]?.category?.name || "Chưa phân loại",
    productImage: product?.images[0]?.image?.path,
    price: product?.variants[0]?.price,
    quantity: product?.variants[0]?.quantity,
  }));

  return (
    <div>
      <ActionHeader
        title="Sản phẩm"
        onAdd={() => {
          setSelectedRows([]);
          setIsPopupOpen(true);
        }}
        onUpdate={handleUpdate}
        onDelete={handleDelete}
        selectedRows={selectedRows.map((row) => row._id)}
        icons={{ add: <Plus />, update: <Edit />, delete: <Trash2 /> }}
      />
      <Table
        loading={loading}
        rowSelection={{
          type: "checkbox",
          onChange: handleSelected,
        }}
        dataSource={dataSource}
        columns={columns}
        pagination={{ pageSize: 5 }}
      />
      {/* <ProductPopup
        isOpen={isPopupOpen}
        onClose={() => setIsPopupOpen(false)}
        data={selectedRows}
      /> */}
      <Modal
        title="Xác nhận xóa"
        open={isDeleteModalOpen}
        onOk={confirmDelete}
        onCancel={() => setIsDeleteModalOpen(false)}
        okText="Chắc chắn"
        cancelText="Hủy"
      >
        Bạn có chắc chắn muốn xóa những sản phẩm đã chọn không?
      </Modal>
    </div>
  );
};

export default ProductPage;
