import { useEffect, useState } from "react";
import { Modal, Select, Divider, Table, Button } from "antd";
import { useDispatch } from "react-redux";
import { getAllOrder, updateOrderStatus } from "@redux/thunk/orderThunk";
import { toVietnamCurrencyFormat } from "@helpers/ConvertCurrency";
import { formatDateTime } from "@helpers/formatDateTime";
import { toast } from "react-toastify";
import orderService from "@services/order.service";
import { PDFDownloadLink } from "@react-pdf/renderer";
import OrderPDF from "@components/Popup/OrderPDF";

const { Option } = Select;

const OrderPopup = ({ isOpen, onClose, data }) => {
  const dispatch = useDispatch();

  const [selectedStatus, setSelectedStatus] = useState("");

  const accessToken = localStorage.getItem("accessToken");

  console.log("Data received:", data);

  const [orders, setOrders] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await orderService.getOrderById(accessToken, data.id);
        setOrders(response?.metadata); // Đảm bảo state không bị undefined
      } catch (error) {
        console.error("Error fetching order:", error);
      }
    };

    if (accessToken && data?.id) {
      fetchData();
    }
  }, [accessToken, data?.id]);

  // console.log("order data:", orders);

  const STATUS_MAP = [
    { id: 1, key: "AWAITING_CONFIRM", label: "Chờ xác nhận" },
    { id: 2, key: "AWAITING_FULFILLMENT", label: "Chờ xử lý" },
    { id: 3, key: "DELIVERING", label: "Đang giao hàng" },
    { id: 4, key: "DELIVERED", label: "Đã giao hàng" },
    { id: 5, key: "CANCELED", label: "Đã hủy" },
  ];

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

  const productData = orders?.orderDetail?.map((item) => ({
    key: item.variant?.id,
    images: item.variant?.product?.images[0]?.image?.path,
    productName: item.variant?.product?.name,
    size: item.variant?.size,
    quantity: item?.quantity,
    price: item?.price,
    discount: item.variant?.product.productDiscount?.[0]?.discountValue || 0,
  }));

  useEffect(() => {
    if (orders?.currentStatus?.name) {
      // Tìm trạng thái có key trùng với name từ API
      const matchedStatus = STATUS_MAP.find(
        (status) => status.key === orders.currentStatus.name
      );
      setSelectedStatus(matchedStatus?.id || ""); // Gán id để khớp với Select
    }
  }, [orders]);

  const handleStatusChange = async (newStatus) => {
    if (!orders?.id || !orders?.currentStatus?.id) {
      toast.error("Thông tin đơn hàng không hợp lệ!");
      return;
    }

    const currentStatus = orders.currentStatus.name?.toUpperCase();
    if (currentStatus === "DELIVERED" || currentStatus === "CANCELED") {
      toast.warning(
        "Không thể thay đổi trạng thái của đơn hàng đã hoàn tất hoặc đã huỷ!"
      );
      return;
    }

    setSelectedStatus(newStatus);

    try {
      await dispatch(
        updateOrderStatus({
          accessToken,
          orderId: orders.id,
          fromStatus: orders.currentStatus.id,
          toStatus: newStatus,
        })
      ).unwrap();

      toast.success("Cập nhật trạng thái đơn hàng thành công!");
      dispatch(getAllOrder({ accessToken, limit: 300, page: 1 }));
    } catch (error) {
      toast.error("Có lỗi xảy ra khi cập nhật trạng thái!");
      console.error("Update status error:", error);
    }
  };

  return (
    <Modal
      title={"Chi tiết đơn hàng"}
      open={isOpen}
      onCancel={onClose}
      footer={null}
      width={1200}
    >
      <div className="space-y-4 p-4" id="order-popup-content">
        <div className="grid grid-cols-2 gap-4 text-gray-700">
          <p>
            <strong className="text-gray-900">Người mua:</strong>{" "}
            {orders.buyer?.fullName}
          </p>
          <p>
            <strong className="text-gray-900">Ngày đặt hàng:</strong>{" "}
            {formatDateTime(orders?.createdAt)}
          </p>

          <p>
            <strong className="text-gray-900">Email:</strong>{" "}
            {orders.buyer?.email}
          </p>
          <p>
            <strong className="text-gray-900">Điện thoại:</strong>{" "}
            {orders.deliveryAddress?.contactPhone}
          </p>

          <p>
            <strong className="text-gray-900">Địa chỉ giao hàng:</strong>{" "}
            {orders.deliveryAddress?.detailAddress},{" "}
            {orders.deliveryAddress?.wardName},{" "}
            {orders.deliveryAddress?.districtName},{" "}
            {orders.deliveryAddress?.provinceName}
          </p>
          <p>
            <strong className="text-gray-900">Phương thức thanh toán:</strong>{" "}
            {orders?.payment?.paymentMethod?.name}
          </p>
          <p>
            <strong className="text-gray-900">Trạng thái thanh toán:</strong>{" "}
            <span
              className={`px-2 py-1 rounded-full ${
                statusPaymentClasses[orders?.payment?.paymentStatus?.name] ||
                "text-gray-600 bg-gray-200"
              }`}
            >
              {PAYMENT_STATUS_MAP[orders?.payment?.paymentStatus?.name]}
            </span>
          </p>
          <p>
            <strong className="text-gray-900">Trạng thái đơn hàng:</strong>{" "}
            <Select
              value={selectedStatus}
              onChange={handleStatusChange}
              style={{ width: 200 }}
            >
              {STATUS_MAP.map((status) => (
                <Option key={status.id} value={status.id}>
                  {status.label}
                </Option>
              ))}
            </Select>
          </p>
        </div>

        <Divider />

        <h3 className="text-lg font-semibold text-gray-900">
          Chi tiết đơn hàng
        </h3>
        <Table
          columns={[
            {
              title: "Hình ảnh",
              dataIndex: "images",
              key: "images",
              render: (images) => (
                <div className="flex justify-center">
                  <img
                    src={images}
                    alt="product"
                    className="w-16 h-16 rounded-md shadow-sm border"
                  />
                </div>
              ),
            },
            {
              title: "Tên sản phẩm",
              dataIndex: "productName",
              key: "productName",
            },
            {
              title: "Size",
              dataIndex: "size",
              key: "size",
              align: "center",
            },
            {
              title: "Số lượng",
              dataIndex: "quantity",
              key: "quantity",
              align: "center",
            },
            {
              title: "Giá",
              dataIndex: "price",
              key: "price",
              render: toVietnamCurrencyFormat,
              align: "right",
            },
          ]}
          dataSource={productData}
          pagination={false}
          className="custom-table"
        />

        <Divider />
        <div className="space-y-2 text-lg">
          <div className="flex justify-between border-b pb-1">
            <span className="text-gray-700">Tổng tiền:</span>
            <span className="text-black font-semibold">
              {toVietnamCurrencyFormat(orders.totalPrice)}
            </span>
          </div>
          <div className="flex justify-between border-b pb-1">
            <span className="text-gray-700">Giá giảm:</span>
            <span className="text-black font-medium">
              {toVietnamCurrencyFormat(orders?.totalDiscount)}
            </span>
          </div>

          <div className="flex justify-between border-b pb-1">
            <span className="text-gray-700">Phí giao hàng:</span>
            <span className="text-black font-medium">
              {toVietnamCurrencyFormat(orders?.shippingFee)}
            </span>
          </div>

          <div className="flex justify-between text-xl font-bold">
            <span className="text-gray-900">Thành tiền:</span>
            <span className="text-primary">
              {toVietnamCurrencyFormat(orders.finalPrice)}
            </span>
          </div>
        </div>
      </div>
      <div className="space-y-4 p-4" id="order-popup-content">
        {/* Nội dung đơn hàng */}

        <Divider />

        {/* Nút Xuất PDF */}
        <div className="flex justify-between">
          <div className=""></div>
          <PDFDownloadLink
            document={<OrderPDF order={orders} />}
            fileName={`don-hang-${orders?.id}.pdf`}
          >
            {({ loading }) =>
              loading ? (
                <Button loading>Đang tạo PDF...</Button>
              ) : (
                <Button type="primary">Xuất hóa đơn</Button>
              )
            }
          </PDFDownloadLink>
        </div>
      </div>
    </Modal>
  );
};

export default OrderPopup;
