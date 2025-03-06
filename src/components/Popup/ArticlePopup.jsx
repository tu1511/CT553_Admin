import { useEffect, useState, useRef } from "react";
import { Modal, Form, Input, Button, Upload, Switch } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import {
  createCategory,
  updateCategory,
  getCategories,
} from "@redux/thunk/categoryThunk";
import uploadService from "@services/upload.service";
import { toast } from "react-toastify";
import slugify from "slugify";
import JoditEditor from "jodit-react";
import {
  createArticle,
  deleteArticle,
  getAllArticles,
  updateArticle,
} from "@redux/thunk/articleThunk";

const ArticlePopup = ({ isOpen, onClose, data }) => {
  const dispatch = useDispatch();

  const accessToken = localStorage.getItem("accessToken");
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);
  const editorRef = useRef(null);

  useEffect(() => {
    if (data) {
      form.setFieldsValue({
        title: data.title,
        slug: data.slug || "",
        author: data.author,
        content: data.content,
        visible: data.visible ?? false,
      });

      setFileList(
        data.thumbnail
          ? [{ uid: data?.thumbnailImageId, url: data?.thumbnail }]
          : []
      );
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
        title: values.title,
        slug: values.slug,
        thumbnailImageId: fileList.length ? fileList[0].uid : "",
        author: values.author,
        content: values.content,
        visible: values.visible,
      };

      if (data && Object.keys(data).length !== 0) {
        await dispatch(
          updateArticle({ accessToken, articleId: data?.id, data: formData })
        ).unwrap();
        toast.success("Cập nhật bài viết thành công!");
      } else {
        await dispatch(createArticle({ accessToken, data: formData })).unwrap();
        toast.success("Thêm bài viết thành công!");
      }
      dispatch(getAllArticles(accessToken));
      form.resetFields();
      setFileList([]);
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
          ? "Cập nhật bài viết"
          : "Thêm bài viết"
      }
      open={isOpen}
      onCancel={onClose}
      footer={null}
      width={1000}
    >
      <Form form={form} layout="vertical" onValuesChange={handleValuesChange}>
        <Form.Item
          label="Tiêu đề bài viết"
          name="title"
          rules={[
            { required: true, message: "Vui lòng nhập tiêu đề bài viết!" },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item label="Slug" name="slug">
          <Input disabled />
        </Form.Item>

        <Form.Item
          label="Tên tác giả"
          name="author"
          rules={[{ required: true, message: "Vui lòng nhập tên tác giả!" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item label="Hiển thị" name="visible" valuePropName="checked">
          <Switch />
        </Form.Item>

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
                  deleteArticle({ accessToken, articleId: data.id })
                ).unwrap();
                toast.success("Xóa danh mục thành công!");
                dispatch(getAllArticles());
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

export default ArticlePopup;
