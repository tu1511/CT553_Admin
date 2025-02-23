import { useState, useEffect } from "react";
import { Modal, Form, Input, Button, Col, Row, Select, Upload } from "antd";
import { Eye, Edit, Plus } from "lucide-react";
import slugify from "slugify";
import DescriptionPopup from "@components/Popup/DescriptionPopup";
import { useDispatch, useSelector } from "react-redux";
import { getCategories } from "@redux/thunk/categoryThunk";
import { createProduct, getProducts } from "@redux/thunk/productThunk";
import { toast } from "react-toastify";
import uploadService from "@services/upload.service";

const PopupProduct = ({ isOpen, onClose, product }) => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const { categories } = useSelector((state) => state.category);
  const cateChild = categories.flatMap((cate) => cate.children || []);

  // State fileList để quản lý ảnh sản phẩm
  const [fileList, setFileList] = useState([]);
  const [isDescriptionModalOpen, setDescriptionModalOpen] = useState(false);

  useEffect(() => {
    if (product) {
      form.setFieldsValue({
        ...product,
        categoryIds: product?.categories
          ? product.categories.map((cate) => cate.categoryId)
          : [],
        discounts: [],
        color: product.color || "",
        gender: product.gender || "",
        material: product.material || "",
        completion: product.completion || "",
        stone: product.stone || "",
        variants: product.variants || [],
        description: product.description || "",
      });
      // Nếu có ảnh, chuyển đổi thành fileList cho Upload
      if (product.images && Array.isArray(product.images)) {
        const initialFileList = product.images.map((img) => ({
          uid: img.imageId ? img.imageId : img.id,
          name: img.image?.filename || "image",
          url: img.image?.path,
        }));
        setFileList(initialFileList);
        form.setFieldsValue({
          images: initialFileList,
          uploadedImageIds: initialFileList.map((file) => file.uid),
        });
      } else {
        setFileList([]);
        form.setFieldsValue({ uploadedImageIds: [] });
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

  const handleImageUpload = async ({ file, fileList: newFileList }) => {
    // Lấy file gốc từ newFileList (originFileObj) để upload
    const filesToUpload = newFileList
      .map((f) => f.originFileObj)
      .filter(Boolean);

    // Kiểm tra loại file, nếu có file nào không phải image thì báo lỗi
    if (filesToUpload.some((file) => !file.type.startsWith("image/"))) {
      return toast.error("Chỉ được phép tải lên ảnh!");
    }

    try {
      // Gọi API uploadImages với mảng các file
      const response = await uploadService.uploadImages(filesToUpload);
      if (response?.metadata) {
        // response.metadata là mảng thông tin của các file đã upload
        const uploadedFiles = response.metadata.map((meta) => ({
          uid: meta.id,
          name: meta.filename || "image",
          url: meta.path,
        }));

        // Cập nhật state fileList để hiển thị ảnh đã upload
        setFileList(uploadedFiles);
        // Cập nhật trường uploadedImageIds trong form với mảng các uid
        form.setFieldsValue({
          uploadedImageIds: uploadedFiles.map((file) => file.uid),
          images: uploadedFiles,
        });
        toast.success("Tải ảnh lên thành công");
      } else {
        toast.error("Lỗi khi tải ảnh lên");
      }
    } catch (error) {
      toast.error("Tải ảnh lên thất bại");
    }
  };

  const accessToken = localStorage.getItem("accessToken");

  const handleSave = async () => {
    try {
      const formData = form.getFieldsValue();
      console.log("Updated Product Data:", formData);
      // Sử dụng unwrap() nếu bạn dùng createAsyncThunk để nhận lỗi rõ ràng
      await dispatch(
        createProduct({ accessToken, product: formData })
      ).unwrap();
      dispatch(getProducts({}));
      toast.success("Tạo sản phẩm thành công!");
    } catch (error) {
      console.error("Lỗi khi tạo sản phẩm:", error);
      toast.error("Lỗi khi tạo sản phẩm!");
    } finally {
      onClose();
    }
  };

  // console.log("description", form.getFieldValue("description"));

  return (
    <>
      <Modal
        title={
          <span className="flex items-center gap-2">
            {product && Object.keys(product).length > 0 ? (
              <>
                <Eye size={20} /> Chỉnh sửa sản phẩm
              </>
            ) : (
              <>
                <Plus size={20} /> Thêm sản phẩm
              </>
            )}
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
          <Form.Item label="Discount" name="discounts">
            <Input disabled />
          </Form.Item>

          {/* Nhóm 1: Thông tin chung */}
          <div className="mb-4 p-4 border rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold mb-2">Thông tin chung</h3>
            <Row gutter={16}>
              <Col span={8}>
                <Form.Item label="Danh mục" name="categoryIds">
                  <Select placeholder="Chọn danh mục" mode="multiple">
                    {cateChild.map((cate) => (
                      <Select.Option key={cate.id} value={cate.id}>
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
          <div className="mb-4 p-4 border rounded-lg shadow-sm">
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

          {/* Thông tin biến thể */}
          <Form.List name="variants">
            {(fields, { add, remove }) => (
              <>
                <h3 className="text-lg font-semibold mb-2">
                  Thông tin biến thể
                </h3>
                {fields.map((field) => (
                  <Row gutter={16} key={field.key}>
                    <Col span={8}>
                      <Form.Item
                        {...field}
                        label="Size"
                        name={[field.name, "size"]}
                        fieldKey={[field.fieldKey, "size"]}
                        rules={[{ required: true, message: "Nhập size" }]}
                      >
                        <Input />
                      </Form.Item>
                    </Col>
                    <Col span={8}>
                      <Form.Item
                        {...field}
                        label="Số lượng"
                        name={[field.name, "quantity"]}
                        fieldKey={[field.fieldKey, "quantity"]}
                        rules={[{ required: true, message: "Nhập số lượng" }]}
                      >
                        <Input type="number" />
                      </Form.Item>
                    </Col>
                    <Col span={8}>
                      <Form.Item
                        {...field}
                        label="Giá"
                        name={[field.name, "price"]}
                        fieldKey={[field.fieldKey, "price"]}
                        rules={[{ required: true, message: "Nhập giá" }]}
                      >
                        <Input type="number" />
                      </Form.Item>
                    </Col>
                  </Row>
                ))}
                <Button
                  type="dashed"
                  onClick={() => add()}
                  block
                  icon={<Plus />}
                >
                  Thêm biến thể
                </Button>
              </>
            )}
          </Form.List>

          <Form.Item label="Hình ảnh sản phẩm" name="uploadedImageIds">
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
            <Input.TextArea rows={3} />
          </Form.Item>

          <Form.Item label="Mô tả chi tiết" name="description">
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
