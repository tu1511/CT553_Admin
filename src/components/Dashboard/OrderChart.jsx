import { formatDate } from "@helpers/FormatDate";
import { Card } from "antd";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const OrderChart = ({ data }) => {
  const formattedData = data.map((item) => ({
    ...item,
    date: formatDate(item.date), // Định dạng ngày
  }));
  return (
    <Card
      title={`Đơn hàng từ ${formattedData[0]?.date} - ${
        formattedData[formattedData.length - 1]?.date
      }`}
      className="shadow-md"
    >
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={formattedData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Legend />
          {/* Hai cột: Đã thanh toán và chưa thanh toán */}
          <Bar
            dataKey="totalAlreadyPaid"
            stackId="a"
            fill="#8884d8"
            barSize={40}
            name="Đã thanh toán"
          />
          <Bar
            dataKey="totalUnpaid"
            stackId="a"
            fill="#82ca9d"
            barSize={40}
            name="Chưa thanh toán"
          />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
};

export default OrderChart;
