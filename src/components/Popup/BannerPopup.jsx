import { useEffect, useState, useRef } from "react";
import { Modal, Form, Input, Button, Upload, Switch } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useDispatch } from "react-redux";
import uploadService from "@services/upload.service";
import { toast } from "react-toastify";
import {
  createBanner,
  getAdminBanners,
  updateBanner,
} from "@redux/thunk/bannerThunk";

const BannerPopup = ({ isOpen, onClose, data }) => {
  const dispatch = useDispatch();

  const accessToken = localStorage.getItem("accessToken");
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);

  useEffect(() => {
    if (data) {
      form.setFieldsValue({
        name: data.name,
        priority: data.priority,
        visible: data.visible ?? false,
      });

      setFileList(data.image ? [{ uid: data?.imageId, url: data?.image }] : []);
    } else {
      form.resetFields();
      form.setFieldsValue({
        visible: false,
      });
      setFileList([]);
    }
  }, [data, form]);

  const handleUploadChange = async ({ file }) => {
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
        imageId: fileList.length ? fileList[0].uid : "",
        priority: values.priority,
        name: values.name,
        visible: values.visible,
      };
      console.log("formData", formData);

      if (data && Object.keys(data).length !== 0) {
        await dispatch(
          updateBanner({ accessToken, id: data?.id, data: formData })
        ).unwrap();
        toast.success("Cập nhật bài viết thành công!");
      } else {
        await dispatch(createBanner({ accessToken, data: formData })).unwrap();
        toast.success("Thêm bài viết thành công!");
      }
      dispatch(getAdminBanners(accessToken));
      form.resetFields();
      setFileList([]);
      onClose();
    } catch (error) {
      toast.error("Lỗi khi gửi form");
      console.log("Error", error);
    }
  };

  return (
    <Modal
      title={
        data && Object.keys(data).length ? "Cập nhật banner" : "Thêm banner"
      }
      open={isOpen}
      onCancel={onClose}
      footer={null}
      width={900}
      className="p-4"
    >
      <Form form={form} layout="vertical">
        <div className="grid grid-cols-2 gap-6">
          <Form.Item
            label="Tên banner"
            name="name"
            rules={[{ required: true, message: "Vui lòng nhập tên banner!" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Độ ưu tiên"
            name="priority"
            rules={[{ required: true, message: "Vui lòng nhập độ ưu tiên!" }]}
          >
            <Input />
          </Form.Item>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <Form.Item label="Ảnh bìa">
            <Upload
              listType="picture-card"
              fileList={fileList}
              beforeUpload={(file) => {
                handleUploadChange({ file });
                return false;
              }}
              onRemove={() => setFileList([])}
              maxCount={1}
            >
              {fileList.length === 0 && <UploadOutlined />}
            </Upload>
          </Form.Item>

          <Form.Item label="Hiển thị" name="visible" valuePropName="checked">
            <Switch />
          </Form.Item>
        </div>

        <div className="flex justify-end gap-3 mt-4">
          {data && Object.keys(data).length !== 0 && (
            <Button type="primary" danger onClick={onClose}>
              Xóa
            </Button>
          )}
          <Button onClick={onClose}>Hủy</Button>
          <Button type="primary" onClick={handleSubmit}>
            {data && Object.keys(data).length !== 0 ? "Cập nhật" : "Thêm mới"}
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

export default BannerPopup;
