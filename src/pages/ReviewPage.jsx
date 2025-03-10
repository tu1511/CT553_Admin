import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState, useMemo } from "react";
import { Modal } from "antd";
import TableComponent from "@components/common/TableComponent";
import { getAllOrder } from "@redux/thunk/orderThunk";
import { formatDate } from "@helpers/FormatDate";
import OrderPopup from "@components/Popup/OrderPopup";
import { getAllReviews } from "@redux/thunk/reviewThunk";
import { StarFilled } from "@ant-design/icons";
import ReviewPopup from "@components/Popup/ReviewPopup";

const ReviewPage = () => {
  const dispatch = useDispatch();
  // const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);

  const accessToken = localStorage.getItem("accessToken");

  const { reviews, loading } = useSelector((state) => state.reviews);

  useEffect(() => {
    dispatch(getAllReviews(accessToken));
  }, [dispatch, accessToken]);

  // console.log("reviews:", reviews?.reviews);

  useEffect(() => {
    dispatch(getAllOrder({ accessToken, limit: 10, page: 1 }));
  }, [dispatch, accessToken]);

  const handleSelected = (selectedRowKeys) => {
    const selectedData = reviews.filter((row) =>
      selectedRowKeys.includes(row.id)
    );
    setSelectedRows(selectedData);
  };

  const rows = reviews?.reviews?.map((review) => ({
    ...review,
    key: review.id,
    orderId: review.orderId,
    buyerName: review?.account?.fullName,
    createAt: review?.createdAt,
    productName: review?.product?.name,
    rating: review.rating,
    comment: review.comment,
    visible: review.visible,
    replyByReview: review.replyByReview,
  }));
  const columns = useMemo(
    () => [
      {
        title: "Mã đánh giá",
        dataIndex: "key",
        align: "center",
        width: 50,
        render: (text) => <span>#{text}</span>,
      },
      {
        title: "Mã đơn hàng",
        dataIndex: "orderId",
        align: "center",
        width: 50,
        render: (text) => <span className="font-bold">#{text}</span>,
      },
      {
        title: "Tên khách hàng",
        dataIndex: "buyerName",
        width: 180,
      },
      {
        title: "Tên sản phẩm",
        dataIndex: "productName",
        width: 300,
      },
      {
        title: "Thời gian",
        dataIndex: "createAt",
        align: "center",
        render: (text) => <span>{formatDate(text)}</span>,
      },
      {
        title: "Đánh giá",
        dataIndex: "rating",
        align: "center",
        width: 50,
        render: (text) => (
          <span className="flex items-center gap-1">
            {text}

            <StarFilled className="text-yellow-400 text-lg" />
          </span>
        ),
      },

      {
        title: "Trạng thái",
        dataIndex: "visible",
        key: "visible",
        render: (visible) => (
          <span
            className={
              visible === true
                ? "text-green-500 bg-green-100 px-2 py-1 rounded-full font-semibold"
                : "text-red-500 bg-red-100 px-2 py-1 rounded-full font-semibold"
            }
          >
            {visible ? "Hiển thị" : "Đã ẩn"}
          </span>
        ),
      },
      {
        title: "Phản hồi",
        dataIndex: "replyByReview",
        width: 150,
        render: (replyByReview) => (
          <span
            className={
              replyByReview?.length > 0
                ? "text-green-500 bg-green-100 px-2 py-1 rounded-full font-semibold"
                : "text-red-500 bg-red-100 px-2 py-1 rounded-full font-semibold"
            }
          >
            {replyByReview?.length > 0 ? "Đã phản hồi" : "Chưa phản hồi"}
          </span>
        ),
      },
    ],
    []
  );

  return (
    <div>
      <TableComponent
        loading={loading}
        rows={rows}
        columns={columns}
        pagination={{ pageSize: 5 }}
        onEdit={(record) => {
          // console.log("Sửa danh mục:", record);
          setSelectedRows([record]);
          setIsUpdateModalOpen(true);
        }}
        onDelete={(record) => {
          // console.log("Xóa danh mục:", record);
          setSelectedRows([record]);
        }}
        checkbox={false}
        handleSelected={handleSelected}
      />

      {/* Popup Thêm / Cập nhật danh mục */}
      <ReviewPopup
        isOpen={isUpdateModalOpen}
        onClose={() => {
          setIsUpdateModalOpen(false);
        }}
        data={selectedRows[0] || null}
      />
    </div>
  );
};

export default ReviewPage;
