import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState, useMemo } from "react";
import { Button, Modal, Tooltip } from "antd";
import TableComponent from "@components/common/TableComponent";
// import { Plus } from "lucide-react";
// import { toast } from "react-toastify";
import { getAllOrder } from "@redux/thunk/orderThunk";
import { toVietnamCurrencyFormat } from "@helpers/ConvertCurrency";
import { formatDate } from "@helpers/FormatDate";
import OrderPopup from "@components/Popup/OrderPopup";

const OrderPage = () => {
  const dispatch = useDispatch();
  // const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const accessToken = localStorage.getItem("accessToken");

  const { orders, loading } = useSelector((state) => state.orders);

  useEffect(() => {
    dispatch(getAllOrder({ accessToken, limit: 10, page: 1 }));
  }, [dispatch, accessToken]);

  console.log("Danh sách đơn hàng:", orders?.orders);

  const handleSelected = (selectedRowKeys) => {
    const selectedData = orders.filter((row) =>
      selectedRowKeys.includes(row.id)
    );
    setSelectedRows(selectedData);
  };

  const confirmDelete = async () => {
    setIsDeleteModalOpen(false);
    // try {
    //   const categoryId = selectedRows[0]?._id;
    //   // Dispatch deleteCategory và sử dụng unwrap() để nhận lỗi nếu có
    //   await dispatch(deleteCategory({ id: categoryId, accessToken })).unwrap();
    //   dispatch(getCategories());
    //   toast.success("Xóa danh mục thành công!");
    // } catch (error) {
    //   console.error("Lỗi khi xóa danh mục:", error);
    //   toast.error("Lỗi khi xóa danh mục!");
    // }
  };

  const STATUS_MAP = {
    AWAITING_CONFIRM: "Chờ xác nhận",
    AWAITING_FULFILLMENT: "Chờ xử lý",
    DELIVERING: "Đang giao hàng",
    DELIVERED: "Đã giao hàng",
    CANCELED: "Đã hủy",
    // RETURNED: "Đã trả hàng",
  };

  const statusClasses = {
    AWAITING_CONFIRM: "text-gray-600 bg-gray-200 px-2 py-1 rounded-full",
    AWAITING_FULFILLMENT:
      "text-yellow-500 bg-yellow-100 px-2 py-1 rounded-full",
    DELIVERING: "text-blue-500 bg-blue-100 px-2 py-1 rounded-full",
    DELIVERED: "text-green-500 bg-green-100 px-2 py-1 rounded-full",
    CANCELED: "text-red-500 bg-red-100 px-2 py-1 rounded-full",
    // RETURNED: "text-purple-500 bg-purple-100 px-2 py-1 rounded-full",
  };

  const PAYMENT_STATUS_MAP = {
    PENDING: "Chưa thanh toán",
    SUCCESS: "Đã thanh toán",
    FAILED: "Thất bại",
  };

  const statusPaymentClasses = {
    PENDING: "text-blue-500 bg-blue-100 px-2 py-1 rounded-full",
    SUCCESS: "text-green-500 bg-green-100 px-2 py-1 rounded-full",
    FAILED: "text-red-500 bg-red-100 px-2 py-1 rounded-full",
  };

  const statusPaymentMethodClasses = {
    COD: "text-blue-500 bg-blue-100 px-2 py-1 rounded-full",
    VNPAY: "text-green-500 bg-green-100 px-2 py-1 rounded-full",
  };

  const rows = orders?.orders?.map((order) => ({
    ...order,
    key: order.id,
    buyerId: order?.buyer?.id,
    buyerName: order?.buyer?.fullName,
    createAt: order?.createdAt,
    finalPrice: order?.finalPrice,
    paymentMethod: order?.payment?.paymentMethod?.name,
    statusPayment: order?.payment?.paymentStatus?.name,
    statusOrder: order?.currentStatus?.name,
  }));
  const columns = useMemo(
    () => [
      {
        title: "Mã đơn hàng",
        dataIndex: "key",
        align: "center",
        width: 50,
        render: (text) => <span>#{text}</span>,
      },
      {
        title: "Mã khách hàng",
        dataIndex: "buyerId",
        align: "center",
        width: 50,
        render: (text) => <span>#{text}</span>,
      },
      {
        title: "Tên khách hàng",
        dataIndex: "buyerName",
      },
      {
        title: "Ngày đặt hàng",
        dataIndex: "createAt",
        align: "center",
        render: (text) => <span>{formatDate(text)}</span>,
      },
      {
        title: "Tổng thanh toán",
        dataIndex: "finalPrice",
        align: "center",
        render: (text) => <span>{toVietnamCurrencyFormat(text)}</span>,
      },
      {
        title: "Phương thức thanh toán",
        dataIndex: "paymentMethod",
        align: "center",
        render: (status) => (
          <span
            className={`px-2 py-1 rounded-full ${
              statusPaymentMethodClasses[status] || "text-gray-600 bg-gray-200"
            }`}
          >
            {status}
          </span>
        ),
      },
      {
        title: "Trạng thái thanh toán",
        dataIndex: "statusPayment",
        align: "center",
        render: (payment) => (
          <span
            className={`px-2 py-1 rounded-full ${
              statusPaymentClasses[payment] || "text-gray-600 bg-gray-200"
            }`}
          >
            {PAYMENT_STATUS_MAP[payment] || "Không xác định"}
          </span>
        ),
      },
      {
        title: "Trạng thái đơn hàng",
        dataIndex: "statusOrder",
        align: "center",
        render: (status) => (
          <span
            className={`px-2 py-1 rounded-full ${
              statusClasses[status] || "text-gray-600 bg-gray-200"
            }`}
          >
            {STATUS_MAP[status] || "Không xác định"}
          </span>
        ),
      },
    ],
    []
  );

  return (
    <div>
      <TableComponent
        loading={loading}
        rows={rows}
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
      <OrderPopup
        isOpen={isUpdateModalOpen}
        onClose={() => {
          setIsUpdateModalOpen(false);
        }}
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

export default OrderPage;
