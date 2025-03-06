import { Card } from "antd";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

const COLORS = ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0"];

const generateFakeData = (timeRange) => {
  // Giả lập số lượng sản phẩm bán theo thời gian
  const baseValues = {
    Nhẫn: 100,
    "Vòng tay": 80,
    "Dây chuyền": 120,
    "Bông tai": 90,
  };

  // Tạo biến đổi dựa vào timeRange
  const multiplier = Math.random() * 0.5 + 0.75; // Hệ số dao động từ 0.75 - 1.25
  return Object.keys(baseValues).map((name) => ({
    name,
    value: Math.round(baseValues[name] * multiplier),
  }));
};

const ProductChart = ({ timeRange }) => {
  const data = generateFakeData(timeRange);

  return (
    <Card title="Biểu đồ trang sức bạc đã bán" className="shadow-md">
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={100}
            fill="#8884d8"
          >
            {data.map((_, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </Card>
  );
};

export default ProductChart;
