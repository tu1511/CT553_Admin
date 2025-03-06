import DashboardSummary from "@components/Dashboard/DashboardSummary";
import DateFilter from "@components/Dashboard/DateFilter";
import ProductChart from "@components/Dashboard/ProductChart";
import RevenueChart from "@components/Dashboard/RevenueChart";
import OrderChart from "@components/Dashboard/OrderChart";
import { useState } from "react";
import CategoryChart from "@components/Dashboard/CategoryChart";
import UserChart from "@components/Dashboard/UserChart";

import dayjs from "dayjs";

const Dashboard = () => {
  const [dateRange, setDateRange] = useState({
    from: dayjs().subtract(7, "day"),
    to: dayjs(),
  });

  return (
    <div className="p-6 space-y-6">
      {/* Bộ lọc thời gian */}
      <DateFilter setDateRange={setDateRange} />

      {/* Thống kê tổng quan */}
      <DashboardSummary timeRange={dateRange} />

      {/* Biểu đồ */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-6">
        {/* Hai biểu đồ trên cùng một hàng */}
        <RevenueChart timeRange={dateRange} />
        <OrderChart timeRange={dateRange} />

        {/* Hai biểu đồ trên cùng một hàng */}
        <ProductChart timeRange={dateRange} />
        <CategoryChart timeRange={dateRange} />

        {/* Một biểu đồ chiếm nguyên hàng */}
        <div className="col-span-1 md:col-span-2">
          <UserChart timeRange={dateRange} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
