import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { Button, Modal, Tooltip } from "antd";
import { toast } from "react-toastify";
import TableComponent from "@components/common/TableComponent";
import { Plus } from "lucide-react";
import { formatDate } from "@helpers/FormatDate";
import { getAllPolicies } from "@redux/thunk/policyThunk";
import PolicyPopup from "@components/Popup/PolicyPopup";
import { render } from "@react-pdf/renderer";

const PolicyPage = () => {
  const dispatch = useDispatch();
  const { policies, loading } = useSelector((state) => state.policies);

  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);

  const [editingPolicy, setEditingPolicy] = useState({});
  useEffect(() => {
    dispatch(getAllPolicies());
  }, [dispatch]);

  const handleSelected = (keys) => {
    const selected = policies?.filter((policy) => keys.includes(policy.id));
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
    },
    {
      title: "Tiêu đề",
      dataIndex: "title",
      key: "title",
      width: 230,
    },
    {
      title: "Nội dung",
      dataIndex: "content",
      key: "content",
      render: (content) => (
        <span
          className="line-clamp-1"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      ),
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
      title: "Ngày tạo",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 150,
      render: (date) => formatDate(date),
    },
    {
      title: "Ngày cập nhật",
      dataIndex: "updatedAt",
      key: "updatedAt",
      width: 160,
      render: (date) => formatDate(date),
    },
  ];

  const rows = policies?.map((policy, index) => ({
    stt: index + 1, // Số thứ tự bắt đầu từ 1
    ...policy,
    key: policy.id,
    title: policy.title,
    content: policy.content,
    visible: policy.visible,
    createdAt: policy.createdAt,
    updatedAt: policy.updatedAt,
  }));

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <div className=""></div>
        <Button
          type="primary"
          icon={<Plus size={28} />}
          onClick={() => {
            setEditingPolicy({}); // Đối tượng rỗng cho chế độ tạo mới sản phẩm
            setIsUpdateModalOpen(true);
          }}
        >
          Thêm chính sách
        </Button>
      </div>
      <TableComponent
        loading={loading}
        onEdit={(record) => {
          setEditingPolicy(record);
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

      <PolicyPopup
        isOpen={isUpdateModalOpen}
        onClose={() => {
          setIsUpdateModalOpen(false);
        }}
        data={editingPolicy}
      />
    </div>
  );
};

export default PolicyPage;
