import { useState } from "react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { DatePicker, Select } from "antd";
import dayjs from "dayjs";

const { RangePicker } = DatePicker;
const { Option } = Select;

const generateFakeData = (rangeType) => {
  const today = dayjs();
  let data = [];

  if (rangeType === "7days") {
    for (let i = 6; i >= 0; i--) {
      data.push({
        date: today.subtract(i, "day").format("DD/MM"),
        sales: Math.floor(Math.random() * 1000) + 500,
        orders: Math.floor(Math.random() * 200) + 50,
      });
    }
  } else if (rangeType === "month") {
    for (let i = 0; i < 30; i++) {
      data.push({
        date: today.subtract(i, "day").format("DD/MM"),
        sales: Math.floor(Math.random() * 1000) + 500,
        orders: Math.floor(Math.random() * 200) + 50,
      });
    }
  } else if (rangeType === "year") {
    for (let i = 11; i >= 0; i--) {
      data.push({
        date: today.subtract(i, "month").format("MM/YYYY"),
        sales: Math.floor(Math.random() * 30000) + 5000,
        orders: Math.floor(Math.random() * 5000) + 1000,
      });
    }
  }
  return data;
};

const HomePage = () => {
  const [rangeType, setRangeType] = useState("7days");
  const [data, setData] = useState(generateFakeData("7days"));

  const handleRangeChange = (value) => {
    setRangeType(value);
    setData(generateFakeData(value));
  };

  return (
    <div className="p-6">
      {/* <h1 className="text-2xl font-bold mb-4">HomePage Thống kê</h1> */}
      <div className="mb-6 flex items-center gap-4">
        <Select value={rangeType} onChange={handleRangeChange} className="w-48">
          <Option value="7days">7 ngày gần nhất</Option>
          <Option value="month">Tháng gần nhất</Option>
          <Option value="year">Năm gần nhất</Option>
        </Select>
        <RangePicker className="w-80" />
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded-xl shadow">
          <h2 className="text-lg font-semibold">Doanh thu</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data}>
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <CartesianGrid strokeDasharray="3 3" />
              <Bar dataKey="sales" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-4 rounded-xl shadow">
          <h2 className="text-lg font-semibold">Đơn hàng</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data}>
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <CartesianGrid strokeDasharray="3 3" />
              <Line type="monotone" dataKey="orders" stroke="#82ca9d" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-4 rounded-xl shadow">
          <h2 className="text-lg font-semibold">Tỉ lệ đơn hàng</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={data}
                dataKey="orders"
                nameKey="date"
                fill="#ffc658"
                label
              >
                {data.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={index % 2 === 0 ? "#ffc658" : "#82ca9d"}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-4 rounded-xl shadow">
          <h2 className="text-lg font-semibold">Lợi nhuận</h2>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={data}>
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <CartesianGrid strokeDasharray="3 3" />
              <Area
                type="monotone"
                dataKey="sales"
                stroke="#ff7300"
                fill="#ff7300"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
