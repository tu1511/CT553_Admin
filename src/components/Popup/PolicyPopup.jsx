import { useEffect, useState, useRef } from "react";
import { Modal, Form, Input, Button, Upload, Switch } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useDispatch } from "react-redux";
import uploadService from "@services/upload.service";
import { toast } from "react-toastify";
import slugify from "slugify";
import JoditEditor from "jodit-react";
import {
  createPolicy,
  deletePolicy,
  getAllPolicies,
  updatePolicy,
} from "@redux/thunk/policyThunk";

const PolicyPopup = ({ isOpen, onClose, data }) => {
  const dispatch = useDispatch();

  const accessToken = localStorage.getItem("accessToken");
  const [form] = Form.useForm();
  const editorRef = useRef(null);

  useEffect(() => {
    if (data) {
      form.setFieldsValue({
        title: data.title,
        slug: data.slug || "",
        content: data.content,
        visible: data.visible ?? false,
      });
    } else {
      form.resetFields();
      form.setFieldsValue({
        visible: false,
      });
      setFileList([]);
    }
  }, [data, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const formData = {
        title: values.title,
        slug: values.slug,
        content: values.content,
        visible: values.visible,
      };

      if (data && Object.keys(data).length !== 0) {
        await dispatch(
          updatePolicy({ accessToken, policyId: data?.id, data: formData })
        ).unwrap();
        toast.success("Cập nhật chính sách thành công!");
      } else {
        await dispatch(createPolicy({ accessToken, data: formData })).unwrap();
        toast.success("Thêm chính sách thành công!");
      }
      dispatch(getAllPolicies(accessToken));
      form.resetFields();
      onClose();
    } catch (error) {
      toast.error("Lỗi khi gửi form");
      console.log("Error", error);
    }
  };

  const handleValuesChange = (_, allValues) => {
    if (allValues.title) {
      const newSlug = slugify(allValues.title, {
        lower: true,
        strict: true,
        locale: "vi",
      });
      form.setFieldsValue({ slug: newSlug });
    }
  };

  return (
    <Modal
      title={
        data && Object.keys(data).length !== 0
          ? "Cập nhật chính sách"
          : "Thêm chính sách"
      }
      open={isOpen}
      onCancel={onClose}
      footer={null}
      width={1000}
    >
      <Form form={form} layout="vertical" onValuesChange={handleValuesChange}>
        <Form.Item
          label="Tiêu đề chính sách"
          name="title"
          rules={[
            { required: true, message: "Vui lòng nhập tiêu đề chính sách!" },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item label="Slug" name="slug">
          <Input disabled />
        </Form.Item>

        <div className="flex space-x-10">
          <Form.Item label="Hiển thị" name="visible" valuePropName="checked">
            <Switch />
          </Form.Item>
        </div>

        <Form.Item label="Nội dung" name="content">
          <JoditEditor ref={editorRef} />
        </Form.Item>

        <div style={{ textAlign: "right" }}>
          {data && Object.keys(data).length !== 0 && (
            <Button
              type="primary"
              danger
              style={{ marginRight: 8 }}
              onClick={async () => {
                await dispatch(
                  deletePolicy({ accessToken, policyId: data.id })
                ).unwrap();
                toast.success("Xóa danh mục thành công!");
                dispatch(getAllPolicies());
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
            {data && Object.keys(data).length !== 0 ? "Cập nhật" : "Thêm mới"}
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

export default PolicyPopup;
