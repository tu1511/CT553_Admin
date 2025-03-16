import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { Button, Modal } from "antd";
import { toast } from "react-toastify";
import TableComponent from "@components/common/TableComponent";
import { Plus } from "lucide-react";
import { formatDate } from "@helpers/FormatDate";
import { getAdminBanners } from "@redux/thunk/bannerThunk";
import BannerPopup from "@components/Popup/BannerPopup";
import { render } from "@react-pdf/renderer";

const BannerPage = () => {
  const dispatch = useDispatch();

  const { banners, loading } = useSelector((state) => state.banners);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);

  const [editingBanner, setEditingBanner] = useState({});
  const accessToken = localStorage.getItem("accessToken");
  useEffect(() => {
    dispatch(getAdminBanners(accessToken));
  }, [dispatch, accessToken]);

  console.log("Banners:", banners?.banners);

  const handleSelected = (keys) => {
    const selected = banners?.banners?.filter((banner) =>
      keys.includes(banner.id)
    );
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
      width: 50,
      align: "center",
      render: (text) => <span className="font-semibold">#{text}</span>,
    },
    {
      title: "Ảnh banner",
      dataIndex: "image",
      align: "center",
      key: "image",
      width: 300,
      render: (image) =>
        image ? (
          <img
            src={image}
            alt="image"
            style={{
              width: 300,
              height: 120,
              objectFit: "cover",
              borderRadius: 4,
            }}
          />
        ) : (
          "Không có ảnh"
        ),
    },
    {
      title: "Tên banner",
      dataIndex: "name",
      key: "name",
      width: 200,
    },
    {
      title: "Thứ tự",
      dataIndex: "priority",
      key: "priority",
      align: "center",
      width: 100,
    },
    {
      title: "Trạng thái",
      dataIndex: "visible",
      key: "visible",
      width: 130,
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
      title: "Ngày thêm",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 150,
      render: (date) => formatDate(date),
    },
  ];

  const rows = banners?.banners?.map((banner, index) => ({
    stt: index + 1, // Số thứ tự bắt đầu từ 1
    ...banner,
    key: banner.id,
    imageId: banner.imageId,
    image: banner.image ? banner.image?.path : null,
    name: banner.name,
    priority: banner.priority,
    visible: banner.visible,
    createdAt: banner.createdAt,
  }));

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <div className=""></div>
        <Button
          type="primary"
          icon={<Plus size={28} />}
          onClick={() => {
            setEditingBanner({}); // Đối tượng rỗng cho chế độ tạo mới sản phẩm
            setIsUpdateModalOpen(true);
          }}
        >
          Thêm banner
        </Button>
      </div>
      <TableComponent
        loading={loading}
        onEdit={(record) => {
          setEditingBanner(record);
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

      <BannerPopup
        isOpen={isUpdateModalOpen}
        onClose={() => {
          setIsUpdateModalOpen(false);
        }}
        data={editingBanner}
      />
    </div>
  );
};

export default BannerPage;
