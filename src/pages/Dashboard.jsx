import DashboardSummary from "@components/Dashboard/DashboardSummary";
import DateFilter from "@components/Dashboard/DateFilter";
import RevenueChart from "@components/Dashboard/RevenueChart";
import OrderChart from "@components/Dashboard/OrderChart";
import { useEffect, useRef, useState } from "react";
import CategoryChart from "@components/Dashboard/CategoryChart";
import UserChart from "@components/Dashboard/UserChart";

import dayjs from "dayjs";
import orderService from "@services/order.service";
import PaymentMethodChart from "@components/Dashboard/PaymentMethodChart";
import ProductsSoldChart from "@components/Dashboard/ProductsSoldChart";
import { Button } from "antd";
import { Download } from "lucide-react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const Dashboard = () => {
  const [dateRange, setDateRange] = useState({
    from: dayjs().subtract(7, "day"),
    to: dayjs(),
  });

  console.log("dateRange", dateRange.from.toISOString().split("T")[0]);
  console.log("dateRange", dateRange.to.toISOString().split("T")[0]);

  const startDate = dateRange.from.toISOString().split("T")[0];
  const endDate = dateRange.to.toISOString().split("T")[0];

  const accessToken = localStorage.getItem("accessToken");

  const [reportData, setReportData] = useState(null);

  useEffect(() => {
    const fetchReportData = async () => {
      const response = await orderService.getAllReport(
        accessToken,
        startDate,
        endDate
      );
      console.log("response", response?.metadata);
      setReportData(response?.metadata);
    };

    fetchReportData();
  }, [accessToken, startDate, endDate]);

  console.log("reportData", reportData);

  const revenue =
    reportData?.salesByDate?.reduce(
      (total, revenue) => total + revenue.paidSales + revenue.totalSales,
      0
    ) || 0;
  const orders =
    reportData?.ordersByDate?.reduce(
      (total, order) => total + order.totalAlreadyPaid + order.totalUnpaid,
      0
    ) || 0;
  const totalProductsSold =
    reportData?.productsSoldByDate?.reduce(
      (total, product) => total + product.totalProducts,
      0
    ) || 0;

  const users =
    reportData?.usersByDate?.[reportData.usersByDate.length - 1]?.totalUsers ||
    0;

  const revenueData = reportData?.salesByDate || [];

  const paymentData = reportData?.paymentMethodQuantity || [];

  const orderData = reportData?.ordersByDate || [];

  const categoryData = reportData?.parentCategoryQuantity || [];

  const userData = reportData?.usersByDate || [];

  const productsSoldData = reportData?.productsSoldByDate || [];

  // const dashboardRef = useRef(null); // Tham chiếu đến phần Dashboard cần xuất PDF

  const dashboardTopRef = useRef(null);
  const dashboardBottomRef = useRef(null);

  const exportToPDF = async () => {
    const inputTop = dashboardTopRef.current;
    const inputBottom = dashboardBottomRef.current;
    if (!inputTop || !inputBottom) return;

    const pdf = new jsPDF("p", "mm", "a4");
    const imgWidth = 210; // Chiều rộng trang A4 (mm)
    const pageHeight = pdf.internal.pageSize.getHeight(); // Lấy chiều cao trang A4

    // Chụp ảnh phần trên
    const canvasTop = await html2canvas(inputTop, { scale: 1.5 });
    const imgTop = canvasTop.toDataURL("image/png");
    let imgHeightTop = (canvasTop.height * imgWidth) / canvasTop.width;

    if (imgHeightTop > pageHeight) imgHeightTop = pageHeight - 10; // Giới hạn chiều cao ảnh để tránh tràn trang

    pdf.addImage(imgTop, "PNG", 0, 10, imgWidth, imgHeightTop); // Bắt đầu từ vị trí y = 10 để không dính mép trên

    // Thêm trang mới
    pdf.addPage();

    // Chụp ảnh phần dưới
    const canvasBottom = await html2canvas(inputBottom, { scale: 1.5 });
    const imgBottom = canvasBottom.toDataURL("image/png");
    let imgHeightBottom = (canvasBottom.height * imgWidth) / canvasBottom.width;

    if (imgHeightBottom > pageHeight) imgHeightBottom = pageHeight - 10;

    pdf.addImage(imgBottom, "PNG", 0, 10, imgWidth, imgHeightBottom);

    // Lưu file
    pdf.save(`Báo cáo doanh số từ ${startDate} đến ${endDate}.pdf`);
  };

  return (
    <div>
      <div className="p-4 space-y-6" ref={dashboardTopRef}>
        {/* Bộ lọc thời gian */}
        <DateFilter setDateRange={setDateRange} />

        {/* Thống kê tổng quan */}
        <DashboardSummary
          revenue={revenue}
          orders={orders}
          productsSold={totalProductsSold}
          users={users}
        />

        {/* Biểu đồ */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mt-6">
          <div className="col-span-3">
            <RevenueChart data={revenueData} />
          </div>
          <div className="col-span-2">
            <PaymentMethodChart
              data={paymentData}
              startDate={startDate}
              endDate={endDate}
            />
          </div>
          <div className="col-span-3">
            {" "}
            <OrderChart data={orderData} />
          </div>

          <div className="col-span-2">
            <CategoryChart
              data={categoryData}
              startDate={startDate}
              endDate={endDate}
            />
          </div>
        </div>
        <div>
          {/* Hai biểu đồ trên cùng một hàng */}

          <ProductsSoldChart data={productsSoldData} />
        </div>
      </div>
      <div className="grid grid-cols-1 p-4 gap-6 " ref={dashboardBottomRef}>
        <UserChart data={userData} />{" "}
        <div className="flex justify-end">
          <Button
            type="primary"
            style={{
              backgroundColor: "#c60018",
              borderColor: "#c60018",
              color: "#fff",
            }}
            onClick={exportToPDF} // Gọi hàm khi bấm nút
          >
            <Download />
            Tải file PDF
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
