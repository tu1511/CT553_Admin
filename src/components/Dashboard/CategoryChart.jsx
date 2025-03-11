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

const shuffleColors = (colors) => [...colors].sort(() => Math.random() - 0.5);

const CategoryChart = ({ data, startDate, endDate }) => {
  const randomizedColors = shuffleColors([
    "#FF6384",
    "#36A2EB",
    "#FFCE56",
    "#4BC0C0",
    "#9966FF",
    "#FF9F40",
    "#8D44AD",
  ]);
  return (
    <Card
      title={`Danh mục sản phẩm bán ra từ ${formatDate(
        startDate
      )} - ${formatDate(endDate)}`}
      className="shadow-md"
    >
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            dataKey="quantity"
            nameKey="categoryName"
            cx="50%"
            cy="50%"
            outerRadius={100}
            label={({ quantity }) => `${quantity} sản phẩm`}
          >
            {data.map((_, index) => (
              <Cell
                key={`cell-${index}`}
                fill={randomizedColors[index % randomizedColors.length]}
              />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </Card>
  );
};

export default CategoryChart;
