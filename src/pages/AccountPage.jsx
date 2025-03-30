import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState, useMemo } from "react";
import { Avatar, Button, Modal, Select, Switch } from "antd";
import { toast } from "react-toastify";
import { getAllAccount, updateAccountThunk } from "@redux/thunk/accountThunk";
import TableComponent from "@components/common/TableComponent";
import { Plus } from "lucide-react";
import AccountPopup from "@components/Popup/AccountPopup";
import { getTagClass } from "@helpers/getTagClass";

const AccountPage = () => {
  const dispatch = useDispatch();
  const { account, loading } = useSelector((state) => state.account);

  const accessToken = localStorage.getItem("accessToken");

  // console.log("Danh sách tài khoản:", account);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState(null); // State lưu tài khoản được chọn
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const [isUpdateModaCreate, setIsUpdateModalCreate] = useState(false);

  useEffect(() => {
    dispatch(getAllAccount({ limit: 100, page: -1, accessToken }));
  }, [dispatch, accessToken]);

  // toggle active account
  const toggleActive = async () => {
    if (!selectedAccount?.id) {
      toast.error("Không tìm thấy tài khoản để cập nhật!");
      return;
    }

    // Cập nhật UI trước khi dispatch action
    setSelectedAccount((prev) => ({ ...prev, active: !prev.active }));
  };

  const handleSelected = (keys) => {
    setSelectedRowKeys(keys);
  };

  const confirmDelete = async () => {
    console.log("Xóa tài khoản với ID:", selectedRowKeys);
    setIsDeleteModalOpen(false);
    toast.success("Xóa tài khoản thành công!");
  };

  const confirmUpdate = async () => {
    setIsUpdateModalOpen(false);

    if (!selectedAccount?.id) {
      toast.error("Không tìm thấy tài khoản để cập nhật!");
      return;
    }

    try {
      // Gọi API cập nhật trạng thái
      await dispatch(
        updateAccountThunk({
          id: selectedAccount.id,
          data: {
            roleId: selectedAccount.roleId,
            active: selectedAccount.active,
          },
          accessToken,
        })
      ).unwrap();

      // Gọi lại API để lấy dữ liệu mới
      dispatch(getAllAccount({ limit: 100, page: -1, accessToken }));

      toast.success("Cập nhật tài khoản thành công!");
    } catch (error) {
      toast.error("Lỗi khi cập nhật tài khoản!");
    }
  };

  const columns = [
    {
      title: "STT",
      dataIndex: "stt",
      key: "stt",
      align: "center",
      width: 10,
    },
    {
      title: "Ảnh đại diện",
      dataIndex: "avatar",
      key: "avatar",
      align: "center",

      render: (avatar, record) => (
        <img
          src={
            avatar ||
            `https://ui-avatars.com/api/?name=${record.fullName}&size=128`
          }
          alt="avatar"
          style={{
            width: 50,
            height: 50,
            objectFit: "cover",
            borderRadius: 10,
          }}
        />
      ),
    },
    { title: "Tên tài khoản", dataIndex: "fullName", key: "fullName" },
    { title: "Email", dataIndex: "email", key: "email" },
    // {
    //   title: "Số điện thoại",
    //   dataIndex: "phone",
    //   key: "phone",
    //   render: (phone) => <span>{phone || "Chưa cập nhật"}</span>,
    // },
    {
      title: "Trạng thái",
      dataIndex: "active",
      key: "active",
      render: (active) => (
        <span className={getTagClass(active ? "green" : "red")}>
          {active ? "Đang hoạt động" : "Đã khóa"}
        </span>
      ),
    },
    {
      title: "Vai trò",
      dataIndex: "role",
      key: "role",
      align: "center",
      render: (roleId) => {
        const roleMap = { 1: "Quản trị viên", 2: "Nhân viên", 3: "Khách hàng" };
        return (
          <span
            className={getTagClass(
              roleId === 1 ? "green" : roleId === 2 ? "blue" : "yellow"
            )}
          >
            {roleMap[roleId] || "Không xác định"}
          </span>
        );
      },
    },
  ];

  const dataSource = useMemo(
    () =>
      account?.accounts?.map((acc, index) => ({
        stt: index + 1,
        key: acc.id,
        avatar: acc.avatar?.path,
        fullName: acc.fullName,
        email: acc.email,
        phone: acc.phone,
        active: acc.active,
        role: acc.roleId,
      })) || [],
    [account]
  );

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <div className=""></div>
        <Button
          type="primary"
          icon={<Plus size={28} />}
          onClick={() => {
            setIsUpdateModalCreate(true);
          }}
        >
          Tạo tài khoản
        </Button>
      </div>
      <TableComponent
        loading={loading}
        rows={dataSource}
        columns={columns}
        pagination={{ pageSize: 5 }}
        onEdit={(record) => {
          setSelectedRowKeys([record.key]);
          const accountToUpdate = account?.accounts?.find(
            (acc) => acc.id === record.key
          );
          setSelectedAccount(accountToUpdate);

          setIsUpdateModalOpen(true);
        }}
        onDelete={(record) => {
          setSelectedRowKeys([record.key]);
          setIsDeleteModalOpen(true);
        }}
        checkbox={false}
        handleSelected={handleSelected}
      />

      {/* Modal xác nhận xóa */}
      <Modal
        title="Xác nhận xóa"
        open={isDeleteModalOpen}
        onOk={confirmDelete}
        onCancel={() => setIsDeleteModalOpen(false)}
        okText="Chắc chắn"
        cancelText="Hủy"
      >
        <p>
          Bạn có chắc chắn muốn xóa {selectedRowKeys.length} tài khoản đã chọn
          không?
        </p>
      </Modal>

      {/* Modal cập nhật tài khoản */}
      <Modal
        title="Cập nhật tài khoản"
        open={isUpdateModalOpen}
        onCancel={() => setIsUpdateModalOpen(false)}
        onOk={confirmUpdate}
        okText="Lưu thay đổi"
        cancelText="Hủy"
        width={650}
      >
        {selectedAccount ? (
          <div className="space-y-4">
            <p>
              <strong>Ảnh đại diện: </strong>
              <Avatar
                src={
                  selectedAccount?.avatar?.path ||
                  `https://ui-avatars.com/api/?name=${selectedAccount.fullName}&size=128`
                }
                size={80}
                className="border border-gray-300"
              />{" "}
            </p>
            <p>
              <strong>Tên tài khoản:</strong> {selectedAccount.fullName}
            </p>

            <p>
              <strong>Email:</strong> {selectedAccount.email}
            </p>
            <p>
              <strong>Phương thức đăng nhập:</strong>{" "}
              {selectedAccount.isGoogleLogin ? "Google" : "Email"}
            </p>
            <p>
              <strong>Số điện thoại:</strong>{" "}
              {selectedAccount.phone || "Chưa cập nhật"}
            </p>
            <p>
              <strong>Trạng thái:</strong>{" "}
              <Switch
                checked={selectedAccount.active}
                onChange={toggleActive}
              />
              {selectedAccount?.active ? " Đang hoạt động" : " Đã khóa"}
            </p>

            <p>
              <strong>Vai trò:</strong>{" "}
              <Select
                value={selectedAccount.roleId}
                style={{ width: "100%" }}
                onChange={(value) =>
                  setSelectedAccount({ ...selectedAccount, roleId: value })
                }
              >
                <Select.Option value={1}>Quản trị viên</Select.Option>
                <Select.Option value={2}>Nhân viên</Select.Option>
                <Select.Option value={3}>Khách hàng</Select.Option>
              </Select>
            </p>
          </div>
        ) : (
          <p>Không có dữ liệu</p>
        )}
      </Modal>

      <AccountPopup
        isOpen={isUpdateModaCreate}
        onClose={() => {
          setIsUpdateModalCreate(false);
        }}
      />
    </div>
  );
};

export default AccountPage;
