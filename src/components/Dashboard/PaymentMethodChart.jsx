import { formatDate } from "@helpers/FormatDate";
import { Card } from "antd";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const COLORS = ["#41AB5D", "#4292C6"]; // Xanh dương nhạt & xanh lá nhạt

const PaymentMethodChart = ({ data, startDate, endDate }) => {
  if (!data || data.length === 0) return null;

  const totalQuantity = data.reduce((sum, item) => sum + item.quantity, 0);

  // Chuyển đổi số lượng thành phần trăm
  const formattedData = data.map((item) => ({
    paymentMethodName: item.paymentMethodName,
    percentage: (item.quantity / totalQuantity) * 100, // Làm tròn 2 số thập phân
  }));

  return (
    <Card
      title={`Phương thức thanh toán từ ${formatDate(startDate)} - ${formatDate(
        endDate
      )}`}
      className="shadow-md"
    >
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={formattedData}
            dataKey="percentage"
            nameKey="paymentMethodName"
            cx="50%"
            cy="50%"
            outerRadius={100}
            label={({ name, percent }) => `${name}: ${percent * 100}%`} // Hiển thị % trực tiếp trên biểu đồ
          >
            {formattedData.map((_, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip formatter={(value) => `${value}%`} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </Card>
  );
};

export default PaymentMethodChart;
