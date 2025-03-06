import { Card } from "antd";
import {
  LineChart,
  Line,
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
      revenue: Math.floor(Math.random() * 5000) + 500,
    };
  });
};

const RevenueChart = ({ timeRange }) => {
  const data = generateFakeData(timeRange);

  return (
    <Card title="Biểu đồ doanh thu" className="shadow-md">
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="revenue"
            stroke="#82ca9d"
            strokeWidth={3}
          />
        </LineChart>
      </ResponsiveContainer>
    </Card>
  );
};

export default RevenueChart;
