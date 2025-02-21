import { useEffect, useState } from "react";
import { Modal, Form, Input, Button, Select, Upload } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import {
  createCategory,
  getCategories,
  updateCategory,
} from "@redux/thunk/categoryThunk";
import uploadService from "@services/upload.service";
import { toast } from "react-toastify";

const { Option } = Select;

const CategoryPopup = ({ isOpen, onClose, data }) => {
  const dispatch = useDispatch();
  const { categories } = useSelector((state) => state.category);
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);

  useEffect(() => {
    console.log("Data received:", data);
    if (data) {
      form.setFieldsValue({
        name: data.categoryName,
        slug: data.slug || "",
        parentId:
          data.categoryParent !== "Không có" ? data.idParent : "Không có",
      });

      setFileList(
        data.thumbnail
          ? [{ uid: "-1", name: "Ảnh hiện tại", url: data?.thumbnail }]
          : []
      );
    } else {
      form.resetFields();
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
        setFileList([
          {
            uid: uploadedImage.id,
            name: uploadedImage.filename,
            url: uploadedImage.path,
          },
        ]);
        toast.success("Tải ảnh lên thành công");
      } else {
        toast.error("Lỗi khi tải ảnh lên");
      }
    } catch (error) {
      toast.error("Tải ảnh lên thất bại");
    }
  };

  const accessToken = localStorage.getItem("accessToken");

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const formData = {
        name: values.name,
        slug: values.slug,
        thumbnailImageId: fileList.length ? fileList[0].uid : "",
        ...(values.parentId &&
          values.parentId !== "Không có" && { parentId: values.parentId }),
      };

      if (data) {
        await dispatch(
          updateCategory({ id: data._id, data: formData, accessToken })
        ).unwrap();
        dispatch(getCategories());
        toast.success("Cập nhật danh mục thành công!");
      } else {
        await dispatch(createCategory(formData, accessToken)).unwrap();
        dispatch(getCategories());
        toast.success("Thêm danh mục thành công!");
      }
      onClose();
    } catch (error) {
      console.error("Lỗi khi gửi form:", error);
      toast.error("Lỗi khi gửi form");
    }
  };

  return (
    <Modal
      title={data ? "Cập nhật danh mục" : "Thêm danh mục"}
      open={isOpen}
      onCancel={onClose}
      footer={null}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          label="Tên danh mục"
          name="name"
          rules={[{ required: true, message: "Vui lòng nhập tên danh mục!" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Slug"
          name="slug"
          rules={[{ required: true, message: "Vui lòng nhập slug!" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item label="Danh mục cha" name="parentId">
          <Select allowClear placeholder="Chọn danh mục cha">
            {categories.map(({ _id, name }) => (
              <Option key={_id} value={_id}>
                {name}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item label="Hình ảnh">
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

        <div style={{ textAlign: "right" }}>
          <Button onClick={onClose} style={{ marginRight: 8 }}>
            Hủy
          </Button>
          <Button type="primary" onClick={handleSubmit}>
            {data ? "Cập nhật" : "Thêm mới"}
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

export default CategoryPopup;
