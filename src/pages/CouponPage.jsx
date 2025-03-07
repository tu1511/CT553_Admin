import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { Button, Modal } from "antd";
import { toast } from "react-toastify";
import TableComponent from "@components/common/TableComponent";
import { Plus } from "lucide-react";
import { getAllCoupons } from "@redux/thunk/couponThunk";
import { formatDate } from "@helpers/FormatDate";
import CouponPopup from "@components/Popup/CouponPopup";

const CouponPage = () => {
  const dispatch = useDispatch();
  const { coupons, loading } = useSelector((state) => state.coupon);

  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);

  const [editingCoupon, setEditingCoupon] = useState({});
  const accessToken = localStorage.getItem("accessToken");
  useEffect(() => {
    dispatch(getAllCoupons(accessToken));
  }, [dispatch, accessToken]);

  console.log("coupons", coupons);

  const handleSelected = (keys) => {
    const selected = coupons?.filter((coupon) => keys.includes(coupon.id));
    setSelectedRowKeys(keys);
    setSelectedRows(selected);
  };

  const confirmDelete = async () => {
    setIsDeleteModalOpen(false);
    toast.success("Xóa sản phẩm thành công!");
  };

  const columns = [
    {
      title: "STT",
      dataIndex: "stt",
      key: "stt",
      align: "center",
    },
    {
      title: "Mã giảm giá",
      dataIndex: "code",
      key: "code",
    },
    {
      title: "Phần trăm giảm",
      dataIndex: "discountValue",
      key: "discountValue",
    },
    {
      title: "Số lượng",
      dataIndex: "quantity",
      key: "quantity",
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
      title: "Ngày bắt đầu",
      dataIndex: "startDate",
      key: "startDate",
      render: (text) => <span>{formatDate(text)}</span>,
    },
    {
      title: "Ngày kết thúc",
      dataIndex: "endDate",
      key: "endDate",
      render: (text) => <span>{formatDate(text)}</span>,
    },
  ];

  const rows = coupons?.map((coupon, index) => ({
    stt: index + 1, // Số thứ tự bắt đầu từ 1
    ...coupon,
    key: coupon.id,
    code: coupon.code,
    discountValue: coupon.discountValue,
    quantity: coupon.quantity,
    visible: coupon.visible,
    startDate: coupon.startDate,
    endDate: coupon.endDate,
  }));

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <div className=""></div>
        <Button
          type="primary"
          icon={<Plus size={28} />}
          onClick={() => {
            setEditingCoupon({}); // Đối tượng rỗng cho chế độ tạo mới sản phẩm
            setIsUpdateModalOpen(true);
          }}
        >
          Thêm mã giảm giá
        </Button>
      </div>
      <TableComponent
        loading={loading}
        onEdit={(record) => {
          setEditingCoupon(record);
          // console.log("Sửa sản phẩm:", record);
          setIsUpdateModalOpen(true);
        }}
        onDelete={(record) => {
          // console.log("xóa sản phẩm:", record);

          setSelectedRowKeys([record.key]);
          setIsDeleteModalOpen(true);
        }}
        checkbox={false}
        rows={rows}
        columns={columns}
        pagination={{ pageSize: 5 }}
        handleSelected={handleSelected}
      />
      {/* Modal xác nhận xóa */}

      <Modal
        title="Xác nhận xóa"
        open={isDeleteModalOpen}
        onOk={confirmDelete}
        onCancel={() => setIsDeleteModalOpen(false)}
        okText="Xóa"
        cancelText="Hủy"
      >
        <p>Bạn có chắc chắn muốn xóa sản phẩm đã chọn không?</p>
      </Modal>
      {/* Modal xác nhận cập nhật */}

      <CouponPopup
        isOpen={isUpdateModalOpen}
        onClose={() => {
          setIsUpdateModalOpen(false);
        }}
        data={editingCoupon}
      />
    </div>
  );
};

export default CouponPage;
