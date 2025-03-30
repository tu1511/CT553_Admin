import { Modal, Form, Input, Button } from "antd";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { getAllAccount } from "@redux/thunk/accountThunk";
import { registerThunk } from "@redux/thunk/authThunk";

const AccountPopup = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const [form] = Form.useForm();

  const accessToken = localStorage.getItem("accessToken");

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();

      console.log("Submitted Data:", values);

      await dispatch(registerThunk(values)).unwrap();
      toast.success("Thêm tài khoản thành công!");
      // Gọi lại API để lấy dữ liệu mới
      dispatch(getAllAccount({ limit: 100, page: -1, accessToken }));
      form.resetFields();
      onClose();
    } catch (error) {
      console.error("Validation failed:", error);
    }
  };

  return (
    <Modal
      title={
        <div
          style={{ textAlign: "center", fontSize: "18px", fontWeight: "bold" }}
        >
          {"Tạo tài khoản"}
        </div>
      }
      open={isOpen}
      onCancel={onClose}
      footer={null}
      width={600}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          label="Tên tài khoản"
          name="fullName"
          rules={[{ required: true, message: "Vui lòng nhập tên tài khoản!" }]}
        >
          <Input placeholder="Nhập tên tài khoản" />
        </Form.Item>

        <Form.Item
          label="Email"
          name="email"
          rules={[{ required: true, message: "Vui lòng nhập email!" }]}
        >
          <Input placeholder="Nhập email" />
        </Form.Item>

        <Form.Item
          label="Số điện thoại"
          name="phone"
          rules={[{ required: true, message: "Vui lòng nhập số điện thoại!" }]}
        >
          <Input placeholder="Nhập số điện thoại" />
        </Form.Item>

        <Form.Item
          label="Mật khẩu"
          name="password"
          rules={[
            { required: true, message: "Vui lòng nhập password!" },
            { min: 8, message: "Mật khẩu phải có ít nhất 8 kí tự!" },
          ]}
        >
          <Input placeholder="Nhập password" />
        </Form.Item>

        <div style={{ textAlign: "right", marginTop: "16px" }}>
          <Button onClick={onClose} style={{ marginRight: 8 }}>
            Hủy
          </Button>
          <Button type="primary" onClick={handleSubmit}>
            {"Tạo tài khoản"}
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

export default AccountPopup;
