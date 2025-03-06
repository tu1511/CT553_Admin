import { Card, Statistic } from "antd";
import {
  DollarSign,
  ShoppingCart,
  Package,
  Users,
  CircleDollarSign,
} from "lucide-react";

const generateFakeData = (timeRange) => {
  const multiplier = Math.random() * 0.5 + 0.75; // Dao động từ 0.75 - 1.25

  return {
    revenue: Math.round(12000000 * multiplier),
    orders: Math.round(320 * multiplier),
    productsSold: Math.round(1500 * multiplier),
    users: Math.round(980 * multiplier),
  };
};

const DashboardSummary = ({ timeRange }) => {
  const { revenue, orders, productsSold, users } = generateFakeData(timeRange);

  const cardStyle = "rounded-xl shadow-md p-4 transition-all hover:shadow-lg";

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
      <Card className={cardStyle} style={{ background: "#f0fdfa" }}>
        <Statistic
          title="Doanh thu"
          value={revenue}
          prefix={<CircleDollarSign className="text-green-500" />}
          valueStyle={{ color: "#10b981", fontWeight: "bold" }}
        />
      </Card>
      <Card className={cardStyle} style={{ background: "#eff6ff" }}>
        <Statistic
          title="Số đơn hàng"
          value={orders}
          prefix={<ShoppingCart className="text-blue-500" />}
          valueStyle={{ color: "#3b82f6", fontWeight: "bold" }}
        />
      </Card>
      <Card className={cardStyle} style={{ background: "#f5f3ff" }}>
        <Statistic
          title="Sản phẩm đã bán"
          value={productsSold}
          prefix={<Package className="text-purple-500" />}
          valueStyle={{ color: "#8b5cf6", fontWeight: "bold" }}
        />
      </Card>
      <Card className={cardStyle} style={{ background: "#fef2f2" }}>
        <Statistic
          title="Người dùng"
          value={users}
          prefix={<Users className="text-red-500" />}
          valueStyle={{ color: "#ef4444", fontWeight: "bold" }}
        />
      </Card>
    </div>
  );
};

export default DashboardSummary;
