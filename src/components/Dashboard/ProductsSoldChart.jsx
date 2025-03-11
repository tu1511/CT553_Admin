import { formatDate } from "@helpers/FormatDate";
import { Card } from "antd";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  AreaChart,
  Area,
} from "recharts";

const ProductsSoldChart = ({ data }) => {
  const formattedData = data.map((item) => ({
    ...item,
    date: formatDate(item.date), // Chuyển đổi định dạng ngày
  }));
  return (
    <Card
      title={`Sản phẩm bán ra từ ${formattedData[0]?.date} - ${
        formattedData[formattedData.length - 1]?.date
      }`}
      className="shadow-md"
    >
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={formattedData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Area
            type="monotone"
            dataKey="totalProducts"
            stroke="#82ca9d"
            fill="#82ca9d"
            name="Sản phẩm bán ra"
          />
        </AreaChart>
      </ResponsiveContainer>
    </Card>
  );
};

export default ProductsSoldChart;
