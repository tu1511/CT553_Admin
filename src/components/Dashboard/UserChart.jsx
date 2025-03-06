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
import { useEffect, useState } from "react";
import dayjs from "dayjs";

const generateUserData = (timeRange) => {
  const { from, to } = timeRange;
  const days = dayjs(to).diff(dayjs(from), "day") + 1;
  const data = [];

  for (let i = 0; i < days; i++) {
    data.push({
      date: dayjs(from).add(i, "day").format("DD"),
      users: Math.floor(Math.random() * 100 + 50) * (i + 1), // Tăng dần theo ngày
    });
  }
  return data;
};

const UserChart = ({ timeRange }) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    setData(generateUserData(timeRange));
  }, [timeRange]);

  return (
    <Card title="Số lượng tài khoản theo thời gian" className="shadow-md">
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="users"
            stroke="#FF6384"
            strokeWidth={3}
          />
        </LineChart>
      </ResponsiveContainer>
    </Card>
  );
};

export default UserChart;
