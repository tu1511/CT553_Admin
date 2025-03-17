import { getInfo, updateShopInfo } from "@redux/thunk/shopInfoThunk";
import { Upload, Form, Input, Button, Card } from "antd";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { UploadOutlined } from "@ant-design/icons";
import uploadService from "@services/upload.service";
import { toast } from "react-toastify";

const ShopInfoPage = () => {
  const dispatch = useDispatch();
  const shopInfo = useSelector((state) => state.shopInfo?.shopInfo);
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);
  const accessToken = localStorage.getItem("accessToken");

  useEffect(() => {
    dispatch(getInfo());
  }, [dispatch]);

  useEffect(() => {
    if (shopInfo) {
      form.setFieldsValue({
        name: shopInfo.name,
        detailAddress: shopInfo.detailAddress,
        phone: shopInfo.phone,
        email: shopInfo.email,
        workingTime: shopInfo.workingTime,
        slogan: shopInfo.slogan,
      });

      setFileList(
        shopInfo.logo?.path
          ? [{ uid: shopInfo.logoId || "1", url: shopInfo.logo.path }]
          : []
      );
    }
  }, [shopInfo, form]);

  const handleUploadChange = async (file) => {
    if (!file.type.startsWith("image/")) {
      return toast.error("Chỉ được phép tải lên ảnh!");
    }
    try {
      const response = await uploadService.uploadImage(file);
      if (response?.metadata) {
        const uploadedImage = response.metadata;
        setFileList([{ uid: uploadedImage.id, url: uploadedImage.path }]);
        toast.success("Tải ảnh lên thành công");
      } else {
        toast.error("Lỗi khi tải ảnh lên");
      }
    } catch (error) {
      toast.error("Tải ảnh lên thất bại");
    }
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const formData = {
        name: values.name,
        detailAddress: values.detailAddress,
        phone: values.phone,
        email: values.email,
        workingTime: values.workingTime,
        slogan: values.slogan,
        logoId: fileList.length ? fileList[0].uid : "",
      };

      console.log("Dữ liệu gửi:", formData);

      // Gửi formData lên API (cập nhật thông tin shop)
      await dispatch(
        updateShopInfo({ accessToken, id: shopInfo?.id, data: formData })
      ).unwrap();
      toast.success("Cập nhật thông tin thành công!");

      dispatch(getInfo());

      form.resetFields();
      setFileList([]);
    } catch (error) {
      toast.error("Lỗi khi gửi form");
      console.log("Error", error);
    }
  };

  if (!shopInfo) return <p>Loading...</p>;

  return (
    <Card
      title="Thông tin cửa hàng"
      className="container px-10 mx-auto shadow-lg"
    >
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        {/* Upload Logo */}
        <Form.Item label="Logo cửa hàng">
          <Upload
            listType="picture-card"
            fileList={fileList}
            beforeUpload={(file) => {
              handleUploadChange(file);
              return false;
            }}
            onRemove={() => setFileList([])}
            maxCount={1}
          >
            {fileList.length === 0 && <UploadOutlined />}
          </Upload>
        </Form.Item>

        <Form.Item
          name="name"
          label="Tên cửa hàng"
          rules={[{ required: true }]}
        >
          <Input />
        </Form.Item>

        <Form.Item name="detailAddress" label="Địa chỉ">
          <Input />
        </Form.Item>

        <Form.Item name="phone" label="Số điện thoại">
          <Input />
        </Form.Item>

        <Form.Item name="email" label="Email" rules={[{ type: "email" }]}>
          <Input />
        </Form.Item>

        <Form.Item name="workingTime" label="Giờ làm việc">
          <Input />
        </Form.Item>

        <Form.Item name="slogan" label="Slogan">
          <Input.TextArea rows={4} />
        </Form.Item>

        <div className="flex justify-end">
          <Button type="primary" htmlType="submit">
            Cập nhật thông tin
          </Button>
        </div>
      </Form>
    </Card>
  );
};

export default ShopInfoPage;
