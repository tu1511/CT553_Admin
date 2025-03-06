import { useState, useEffect } from "react";
import { Button, DatePicker, Space } from "antd";
import dayjs from "dayjs";

const { RangePicker } = DatePicker;

const DateFilter = ({ setDateRange }) => {
  const [timeRange, setTimeRange] = useState("7d"); // Mặc định là 7 ngày
  const [customRange, setCustomRange] = useState(null);

  // Tính toán khoảng thời gian dựa trên lựa chọn
  useEffect(() => {
    const today = dayjs(); // Ngày hiện tại
    let from,
      to = today;

    switch (timeRange) {
      case "7d":
        from = today.subtract(7, "day");
        break;
      case "1m":
        from = today.subtract(1, "month");
        break;
      case "3m":
        from = today.subtract(3, "month");
        break;
      case "custom":
        if (customRange) {
          from = customRange[0];
          to = customRange[1];
        }
        break;
      default:
        from = today;
    }

    setDateRange({ from: from.startOf("day"), to: to.endOf("day") });
  }, [timeRange, customRange, setDateRange]);

  console.log("DateFilter re-rendered", timeRange);
  console.log("DateFilter re-rendered", customRange);

  return (
    <div className="flex justify-end items-center gap-4 mb-4">
      {/* Các nút thời gian mặc định */}
      <Space>
        <Button
          className={`px-4 py-2 rounded-md transition-all ${
            timeRange === "7d"
              ? "bg-primary text-white border-primary"
              : "bg-white text-gray-700 border-gray-300 hover:bg-gray-300"
          }`}
          onClick={() => setTimeRange("7d")}
        >
          7 Ngày gần nhất
        </Button>

        <Button
          className={`px-4 py-2 rounded-md transition-all ${
            timeRange === "1m"
              ? "bg-primary text-white border-primary"
              : "bg-white text-gray-700 border-gray-300 hover:bg-gray-300"
          }`}
          onClick={() => setTimeRange("1m")}
        >
          1 Tháng gần nhất
        </Button>
        <Button
          className={`px-4 py-2 rounded-md transition-all ${
            timeRange === "3m"
              ? "bg-primary text-white border-primary"
              : "bg-white text-gray-700 border-gray-300 hover:bg-gray-300"
          }`}
          onClick={() => setTimeRange("3m")}
        >
          3 Tháng gần nhất
        </Button>
      </Space>

      {/* Bộ lọc tùy chỉnh thời gian */}
      <RangePicker
        value={timeRange === "custom" ? customRange : null}
        onChange={(dates) => {
          setCustomRange(dates);
          setTimeRange("custom");
        }}
        className="w-auto"
      />
    </div>
  );
};

export default DateFilter;
