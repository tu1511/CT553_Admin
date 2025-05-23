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
import { formatDate } from "@helpers/FormatDate";

const UserChart = ({ data }) => {
  // Format lại dữ liệu ngày tháng trước khi hiển thị
  const formattedData = data.map((item) => ({
    ...item,
    date: formatDate(item.date), // Chuyển đổi định dạng ngày
  }));

  return (
    <Card
      title={`Người dùng mới từ ${formattedData[0]?.date} - ${
        formattedData[formattedData.length - 1]?.date
      }`}
      className="shadow-md"
    >
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={formattedData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="newUsers"
            name="Tài khoản mới"
            stroke="#c60018"
            strokeWidth={2}
          />
        </LineChart>
      </ResponsiveContainer>
    </Card>
  );
};

export default UserChart;
