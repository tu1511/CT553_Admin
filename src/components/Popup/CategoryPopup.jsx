import { useEffect, useState } from "react";
import { Modal, Form, Input, Button, Select, Upload } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import {
  createCategory,
  deleteCategory,
  getCategories,
  updateCategory,
} from "@redux/thunk/categoryThunk";
import uploadService from "@services/upload.service";
import { toast } from "react-toastify";
import slugify from "slugify";

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
        parentId: data.idParent,
      });

      setFileList(
        data.thumbnail ? [{ uid: data?.thumbnailId, url: data?.thumbnail }] : []
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
        parentId: values.parentId ? values.parentId : null,
      };

      console.log("Form data:", formData);

      if (data) {
        await dispatch(
          updateCategory({ id: data._id, data: formData, accessToken })
        ).unwrap();
        dispatch(getCategories());
        toast.success("Cập nhật danh mục thành công!");
      } else {
        await dispatch(
          createCategory({ data: formData, accessToken })
        ).unwrap();
        dispatch(getCategories());
        toast.success("Thêm danh mục thành công!");
      }

      form.resetFields();
      setFileList([]);
      onClose();
    } catch (error) {
      console.error("Lỗi khi gửi form:", error);
      toast.error("Lỗi khi gửi form");
    }
  };

  const handleValuesChange = (_, allValues) => {
    if (allValues.name) {
      const newSlug = slugify(allValues.name, {
        lower: true,
        strict: true,
        locale: "vi",
      });
      form.setFieldsValue({ slug: newSlug });
    }
  };

  return (
    <Modal
      title={data ? "Cập nhật danh mục" : "Thêm danh mục"}
      open={isOpen}
      onCancel={onClose}
      footer={null}
    >
      <Form form={form} layout="vertical" onValuesChange={handleValuesChange}>
        <Form.Item
          label="Tên danh mục"
          name="name"
          rules={[{ required: true, message: "Vui lòng nhập tên danh mục!" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item label="Slug" name="slug">
          <Input disabled />
        </Form.Item>
        <Form.Item label="Danh mục cha" name="parentId">
          <Select allowClear placeholder="Chọn danh mục cha">
            <Option key="none" value={null}>
              Không có
            </Option>
            {categories.map(({ id, name }) => (
              <Option key={id} value={id}>
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
          {data && Object.keys(data).length !== 0 && (
            <Button
              type="primary"
              danger
              style={{ marginRight: 8 }}
              onClick={async () => {
                await dispatch(
                  deleteCategory({ id: data._id, accessToken })
                ).unwrap();
                toast.success("Xóa danh mục thành công!");
                dispatch(getCategories());
                onClose();
              }}
            >
              Xóa
            </Button>
          )}
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
