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
import { useNavigate } from "react-router-dom";
import orderService from "@services/order.service";
import { toVietnamCurrencyFormat } from "@helpers/ConvertCurrency";
import { formatDate } from "@helpers/FormatDate";

const NewOrderNotification = () => {
  const [newOrders, setNewOrders] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await orderService.getWaitingConfirmOrder();
        setNewOrders(response?.metadata || []);
      } catch (error) {
        console.error("Lỗi khi lấy danh sách đơn hàng:", error);
      }
    };

    fetchOrders();
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
                  <span className="font-semibold">
                    {order?.buyer?.fullName ?? "Khách hàng"}
                  </span>
                }
                description={
                  <div className="text-sm text-gray-600">
                    <div className="flex items-center justify-between gap-2">
                      <p className="flex items-center gap-1">
                        <Calendar size={16} className="text-blue-500" />{" "}
                        {formatDate(order?.createdAt)}
                      </p>
                      <p className="flex items-center gap-1">
                        <DollarSign size={16} className="text-green-500" />{" "}
                        {toVietnamCurrencyFormat(order?.finalPrice)}
                      </p>
                    </div>

                    <p className="flex items-center gap-1">
                      <MapPin size={16} className="text-red-500" />{" "}
                      {order?.deliveryAddress?.provinceName ?? "?"},{" "}
                      {order?.deliveryAddress?.districtName ?? "?"}
                    </p>
                    <p className="flex items-center gap-1">
                      <CreditCard size={16} className="text-yellow-500" />{" "}
                      {order?.payment?.paymentMethod?.name ?? "?"}
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
        <Button
          type="link"
          block
          className="mt-2 text-blue-500"
          onClick={() => navigate("/don-hang")}
        >
          Xem tất cả đơn chờ xác nhận
        </Button>
      )}
    </div>
  );

  return (
    <Dropdown overlay={menuItems} trigger={["click"]} placement="bottomRight">
      <Badge count={newOrders.length} size="default">
        <Bell
          className="cursor-pointer text-gray-700 hover:text-blue-500"
          size={24}
        />
      </Badge>
    </Dropdown>
  );
};

export default NewOrderNotification;
