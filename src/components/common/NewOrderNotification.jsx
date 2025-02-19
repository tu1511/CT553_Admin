import { useState, useEffect } from "react";
import { Dropdown, Badge, List, Avatar, Button } from "antd";
import {
  Bell,
  User,
  Calendar,
  DollarSign,
  MapPin,
  CreditCard,
} from "lucide-react";

const fakeOrders = [
  {
    _id: "1",
    user: { fullname: "Nguyễn Văn A" },
    orderDate: "2024-02-19",
    totalPrice: 1500000,
    shippingAddress: {
      fullname: "Nguyễn Văn A",
      phone: "0123456789",
      province: "Hà Nội",
      district: "Ba Đình",
    },
    paymentMethod: { paymentMethodName: "Thanh toán khi nhận hàng" },
  },
  {
    _id: "2",
    user: { fullname: "Trần Thị B" },
    orderDate: "2024-02-18",
    totalPrice: 2250000,
    shippingAddress: {
      fullname: "Trần Thị B",
      phone: "0987654321",
      province: "TP HCM",
      district: "Quận 1",
    },
    paymentMethod: { paymentMethodName: "Chuyển khoản" },
  },
  {
    _id: "3",
    user: { fullname: "Lê Văn C" },
    orderDate: "2024-02-17",
    totalPrice: 3200000,
    shippingAddress: {
      fullname: "Lê Văn C",
      phone: "0912345678",
      province: "Đà Nẵng",
      district: "Hải Châu",
    },
    paymentMethod: { paymentMethodName: "Ví điện tử" },
  },
];

const NewOrderNotification = () => {
  const [newOrders, setNewOrders] = useState([]);

  useEffect(() => {
    // Giả lập việc lấy đơn hàng mới
    setTimeout(() => {
      setNewOrders(fakeOrders);
    }, 1000);
  }, []);

  const menuItems = (
    <div className="w-96 bg-white rounded-lg shadow-lg p-2">
      {newOrders.length > 0 ? (
        <List
          itemLayout="horizontal"
          dataSource={newOrders.slice(0, 3)}
          renderItem={(order) => (
            <List.Item className="border-b border-gray-200 last:border-b-0">
              <List.Item.Meta
                avatar={<Avatar icon={<User />} />}
                title={
                  <span className="font-semibold">{order.user.fullname}</span>
                }
                description={
                  <div className="text-sm text-gray-600">
                    <div className="flex items-center justify-between gap-2">
                      <p className="flex items-center gap-1">
                        <Calendar size={16} className="text-blue-500" />{" "}
                        {order.orderDate}
                      </p>
                      <p className="flex items-center gap-1">
                        <DollarSign size={16} className="text-green-500" />{" "}
                        {order.totalPrice.toLocaleString()} VND
                      </p>
                    </div>

                    <p className="flex items-center gap-1">
                      <MapPin size={16} className="text-red-500" />{" "}
                      {order.shippingAddress.province},{" "}
                      {order.shippingAddress.district}
                    </p>
                    <p className="flex items-center gap-1">
                      <CreditCard size={16} className="text-yellow-500" />{" "}
                      {order.paymentMethod.paymentMethodName}
                    </p>
                  </div>
                }
              />
            </List.Item>
          )}
        />
      ) : (
        <p className="text-center py-4 text-gray-500">Không có đơn hàng mới</p>
      )}

      {newOrders.length > 3 && (
        <Button type="link" block className="mt-2 text-blue-500">
          Xem chi tiết
        </Button>
      )}
    </div>
  );

  return (
    <Dropdown overlay={menuItems} trigger={["click"]} placement="bottomRight">
      <Badge count={newOrders.length} size="small">
        <Bell
          className="cursor-pointer text-gray-700 hover:text-blue-500"
          size={24}
        />
      </Badge>
    </Dropdown>
  );
};

export default NewOrderNotification;
