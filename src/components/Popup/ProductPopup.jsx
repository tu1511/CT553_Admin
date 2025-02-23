import { useState, useEffect } from "react";
import { Modal, Form, Input, Button, Col, Row, Select, Upload } from "antd";
import { Eye, Edit, Plus } from "lucide-react";
import slugify from "slugify";
import DescriptionPopup from "@components/Popup/DescriptionPopup";
import { useDispatch, useSelector } from "react-redux";
import { getCategories } from "@redux/thunk/categoryThunk";

const PopupProduct = ({ isOpen, onClose, product }) => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();

  const { categories } = useSelector((state) => state.category);
  // Lấy danh mục con từ danh mục cha nếu có
  const cateChild = categories.flatMap((cate) => cate.children || []);

  // State để quản lý danh sách ảnh, nếu product có ảnh thì khởi tạo fileList từ đó
  const [fileList, setFileList] = useState(
    product && product.images && Array.isArray(product.images)
      ? product.images.map((img) => ({
          uid: img.imageId ? img.imageId.toString() : img.id.toString(),
          name: img.image?.filename || "image",
          url: img.image?.path,
        }))
      : []
  );

  const [isDescriptionModalOpen, setDescriptionModalOpen] = useState(false);

  useEffect(() => {
    if (product) {
      form.setFieldsValue({
        ...product,
        categoryName: product.categoryName || "",
        color: product.color || "",
        gender: product.gender || "",
        material: product.material || "",
        completion: product.completion || "",
        stone: product.stone || "",
      });
      // Cập nhật fileList nếu có thay đổi product.images
      if (product.images && Array.isArray(product.images)) {
        const initialFileList = product.images.map((img) => ({
          uid: img.imageId ? img.imageId.toString() : img.id.toString(),
          name: img.image?.filename || "image",
          url: img.image?.path,
        }));
        setFileList(initialFileList);
        form.setFieldsValue({ images: initialFileList });
      }
    } else {
      form.resetFields();
      setFileList([]);
    }
    dispatch(getCategories());
  }, [product, form, dispatch]);

  useEffect(() => {
    if (form.getFieldValue("name")) {
      const newSlug = slugify(form.getFieldValue("name"), {
        lower: true,
        strict: true,
        locale: "vi",
      });
      form.setFieldsValue({ slug: newSlug });
    }
  }, [form.getFieldValue("name"), form]);

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

  // Xử lý tải lên ảnh: Chuyển file thành DataURL để hiển thị và cập nhật vào form
  const handleImageUpload = ({ file, fileList: newFileList }) => {
    // Vì beforeUpload trả về false nên file không được upload tự động.
    setFileList(newFileList);
    form.setFieldsValue({ images: newFileList });
  };

  const handleSave = () => {
    console.log("Updated Product Data:", form.getFieldsValue());
    onClose();
  };

  return (
    <>
      <Modal
        title={
          <span className="flex items-center gap-2">
            <Eye size={20} /> Chỉnh sửa sản phẩm
          </span>
        }
        open={isOpen}
        onCancel={onClose}
        footer={null}
        width={1000}
      >
        <Form form={form} layout="vertical" onValuesChange={handleValuesChange}>
          <Form.Item label="Tên sản phẩm" name="name">
            <Input />
          </Form.Item>
          <Form.Item label="Slug" name="slug">
            <Input disabled />
          </Form.Item>

          {/* Nhóm 1: Thông tin chung */}
          <div className="mb-3 p-3 border rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold mb-2">Thông tin chung</h3>
            <Row gutter={16}>
              <Col span={8}>
                <Form.Item label="Danh mục" name="categoryName">
                  <Select placeholder="Chọn danh mục">
                    {cateChild.map((cate) => (
                      <Select.Option key={cate.id} value={cate.name}>
                        {cate.name}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="Màu sắc" name="color">
                  <Input />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="Giới tính" name="gender">
                  <Input />
                </Form.Item>
              </Col>
            </Row>
          </div>

          {/* Nhóm 2: Chất liệu & Hoàn thiện */}
          <div className="mb-3 p-3 border rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold mb-2">
              Chất liệu & Hoàn thiện
            </h3>
            <Row gutter={16}>
              <Col span={8}>
                <Form.Item label="Chất liệu" name="material">
                  <Input />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="Hoàn thiện" name="completion">
                  <Input />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="Loại đá" name="stone">
                  <Input />
                </Form.Item>
              </Col>
            </Row>
          </div>

          <Form.Item label="Hình ảnh sản phẩm" name="images">
            <Upload
              listType="picture-card"
              fileList={fileList}
              beforeUpload={() => false} // Ngăn upload tự động, xử lý theo API nếu cần
              onChange={handleImageUpload}
              multiple
            >
              {fileList.length >= 8 ? null : (
                <div>
                  <Plus />
                  <div style={{ marginTop: 8 }}>Tải ảnh lên</div>
                </div>
              )}
            </Upload>
          </Form.Item>

          <Form.Item label="Mô tả tổng quan" name="overview">
            <Input.TextArea rows={4} />
          </Form.Item>

          <Form.Item label="Mô tả chi tiết">
            <Button
              icon={<Edit size={16} />}
              onClick={() => setDescriptionModalOpen(true)}
            >
              Chỉnh sửa mô tả
            </Button>
          </Form.Item>

          <div className="flex justify-end gap-2 mt-4">
            <Button onClick={onClose}>Hủy</Button>
            <Button type="primary" onClick={handleSave}>
              Lưu
            </Button>
          </div>
        </Form>
      </Modal>

      {/* Modal chỉnh sửa mô tả */}
      <DescriptionPopup
        isOpen={isDescriptionModalOpen}
        onClose={() => setDescriptionModalOpen(false)}
        description={form.getFieldValue("description")}
        onSave={(newDescription) =>
          form.setFieldsValue({ description: newDescription })
        }
      />
    </>
  );
};

export default PopupProduct;
