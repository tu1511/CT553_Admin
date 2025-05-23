import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Input, Button, Typography } from "antd";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { loginThunk } from "@redux/thunk/authThunk"; // Import Redux thunk

const { Title } = Typography;

const LoginPage = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const onSuccess = async (values) => {
    try {
      setLoading(true);
      const resultAction = await dispatch(loginThunk(values));

      if (loginThunk.rejected.match(resultAction)) {
        throw new Error(
          resultAction.payload || "Bạn không có quyền truy cập vào hệ thống!"
        );
      }

      toast.success("Đăng nhập thành công!");
      navigate("/");
    } catch (error) {
      let message = "Đăng nhập không thành công!";
      if (error.message === "Not permission to access this account") {
        message = "Bạn không có quyền truy cập vào hệ thống!";
      } else if (error.message === "Invalid credentials") {
        message = "Email hoặc mật khẩu không đúng!";
      } else if (error.message === "Account is blocked") {
        message = "Tài khoản của bạn đã bị khóa!";
      }
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="flex max-w-4xl w-full bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Hình minh họa */}
        <div className="hidden lg:block w-1/2 bg-secondary p-4">
          <img
            src="/src/assets/login.png"
            alt="Login Illustration"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Form đăng nhập */}
        <div className="w-full lg:w-1/2 p-8">
          <Title level={2} className="text-center">
            Đăng Nhập
          </Title>

          <Form form={form} layout="vertical" onFinish={onSuccess}>
            {/* Email */}
            <Form.Item
              label="Email"
              name="email"
              rules={[
                {
                  required: true,
                  type: "email",
                  message: "Vui lòng nhập email hợp lệ!",
                },
              ]}
            >
              <Input />
            </Form.Item>

            {/* Mật khẩu */}
            <Form.Item
              label="Mật khẩu"
              name="password"
              rules={[{ required: true, message: "Vui lòng nhập mật khẩu!" }]}
            >
              <Input.Password />
            </Form.Item>

            {/* Nút đăng nhập */}
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                className="w-full"
                loading={loading}
                style={{
                  backgroundColor: "#c60018",
                  borderColor: "#ffffff",
                  color: "white",
                }}
              >
                Đăng Nhập
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
