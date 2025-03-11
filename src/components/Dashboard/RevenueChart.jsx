import { toVietnamCurrencyFormat } from "@helpers/ConvertCurrency";
import { formatDate } from "@helpers/FormatDate";
import { Card } from "antd";
import {
  AreaChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Area,
} from "recharts";

const RevenueChart = ({ data }) => {
  const formattedData = data.map((item) => ({
    ...item,
    date: formatDate(item.date), // Định dạng ngày
  }));

  return (
    <Card
      title={`Doanh thu từ ${formattedData[0]?.date} - ${
        formattedData[formattedData.length - 1]?.date
      }`}
      className="shadow-md"
    >
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={formattedData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis width={80} tickFormatter={toVietnamCurrencyFormat} />
          <Tooltip formatter={(value) => toVietnamCurrencyFormat(value)} />
          <Legend />
          <Area
            type="monotone"
            dataKey="totalSales"
            stroke="#8884d8"
            fill="#8884d8"
            strokeWidth={2}
            name="Tổng doanh thu"
          />
          <Area
            type="monotone"
            dataKey="paidSales"
            stroke="#82ca9d"
            fill="#82ca9d"
            strokeWidth={2}
            name="Doanh thu đã thanh toán"
          />
        </AreaChart>
      </ResponsiveContainer>
    </Card>
  );
};

export default RevenueChart;
