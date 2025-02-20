import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState, useMemo } from "react";
import { Modal, Select, Switch } from "antd";
import { toast } from "react-toastify";
import { getAllAccount } from "@redux/thunk/accountThunk";
import TableComponent from "@components/common/TableComponent";

const AccountPage = () => {
  const dispatch = useDispatch();
  const { account, loading } = useSelector((state) => state.account);

  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState(null); // State lưu tài khoản được chọn
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  useEffect(() => {
    dispatch(getAllAccount({ limit: 10, page: -1 }));
  }, [dispatch]);

  const handleSelected = (keys) => {
    console.log("Selected keys:", keys);
    setSelectedRowKeys(keys);
  };

  const confirmDelete = async () => {
    console.log("Xóa tài khoản với ID:", selectedRowKeys);
    setIsDeleteModalOpen(false);
    toast.success("Xóa tài khoản thành công!");
  };

  const confirmUpdate = async () => {
    console.log("Cập nhật tài khoản:", selectedAccount);
    setIsUpdateModalOpen(false);
    toast.success("Cập nhật tài khoản thành công!");
  };

  const columns = [
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
    { title: "Số điện thoại", dataIndex: "phone", key: "phone" },
    {
      title: "Trạng thái",
      dataIndex: "active",
      key: "active",
      render: (active) => (active ? "Đang hoạt động" : "Đã khóa"),
    },
    {
      title: "Vai trò",
      dataIndex: "role",
      key: "role",
      align: "center",
      render: (roleId) => {
        const roleMap = { 1: "Quản trị viên", 2: "Nhân viên", 3: "Khách hàng" };
        return roleMap[roleId] || "Không xác định";
      },
    },
  ];

  const dataSource = useMemo(
    () =>
      account?.accounts?.map((acc) => ({
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
      <TableComponent
        loading={loading}
        rows={dataSource}
        columns={columns}
        pagination={{ pageSize: 5 }}
        onEdit={(record) => {
          console.log("Sửa tài khoản:", record);
          setSelectedRowKeys([record.key]);
          const accountToUpdate = account?.accounts?.find(
            (acc) => acc.id === record.key
          );
          setSelectedAccount(accountToUpdate);
          setIsUpdateModalOpen(true);
        }}
        onDelete={(record) => {
          console.log("Xóa tài khoản:", record);
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
      >
        {selectedAccount ? (
          <div>
            <p>
              <strong>Tên tài khoản:</strong> {selectedAccount.fullName}
            </p>
            <p>
              <strong>Email:</strong> {selectedAccount.email}
            </p>
            <p>
              <strong>Số điện thoại:</strong> {selectedAccount.phone}
            </p>
            <p>
              <strong>Trạng thái:</strong>{" "}
              <Switch
                checked={selectedAccount.active}
                onChange={(checked) =>
                  setSelectedAccount({ ...selectedAccount, active: checked })
                }
              />
              {selectedAccount.active ? " Đang hoạt động" : " Đã khóa"}
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
    </div>
  );
};

export default AccountPage;
