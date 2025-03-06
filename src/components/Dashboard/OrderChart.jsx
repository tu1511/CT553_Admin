import { Card } from "antd";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import dayjs from "dayjs";

const generateFakeData = (timeRange) => {
  const startDate = dayjs(timeRange.from);
  const endDate = dayjs(timeRange.to);
  const daysDiff = endDate.diff(startDate, "day");

  return Array.from({ length: daysDiff + 1 }, (_, i) => {
    return {
      date: startDate.add(i, "day").format("DD"),
      orders: Math.floor(Math.random() * 50) + 10,
    };
  });
};

const OrderChart = ({ timeRange }) => {
  const data = generateFakeData(timeRange);

  return (
    <Card title="Biểu đồ số đơn hàng" className="shadow-md">
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="orders" fill="#8884d8" barSize={30} />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
};

export default OrderChart;
