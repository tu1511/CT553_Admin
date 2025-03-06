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
import { useEffect, useState } from "react";
import dayjs from "dayjs";

const generateCategoryData = (timeRange) => {
  const { from, to } = timeRange;
  const days = dayjs(to).diff(dayjs(from), "day") + 1;
  const categories = ["Vợt", "Balo", "Áo", "Giày"];

  return categories.map((category) => ({
    category,
    sales: Math.floor(Math.random() * 50 + 50) * days, // Số lượng bán thay đổi theo số ngày
  }));
};

const CategoryChart = ({ timeRange }) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    setData(generateCategoryData(timeRange));
  }, [timeRange]);

  return (
    <Card title="Thống kê loại sản phẩm bán ra" className="shadow-md">
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="category" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="sales" fill="#FFA726" barSize={40} />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
};

export default CategoryChart;
