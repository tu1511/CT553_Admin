import { useState, useEffect } from "react";
import moment from "moment";
import {
  Modal,
  Form,
  Input,
  Button,
  Col,
  Row,
  Select,
  Upload,
  DatePicker,
} from "antd";
import { Eye, Edit, Plus } from "lucide-react";
import slugify from "slugify";
import DescriptionPopup from "@components/Popup/DescriptionPopup";
import { useDispatch, useSelector } from "react-redux";
import { getCategories } from "@redux/thunk/categoryThunk";
import {
  createProduct,
  createProductDiscount,
  // createProductDiscount,
  getProducts,
  updateDiscounts,
  updateProduct,
} from "@redux/thunk/productThunk";
import { toast } from "react-toastify";
import uploadService from "@services/upload.service";

const PopupProduct = ({ isOpen, onClose, product }) => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const { categories } = useSelector((state) => state.category);
  const cateChild = categories.flatMap((cate) => cate.children || []);

  // State fileList để quản lý ảnh sản phẩm
  const [fileList, setFileList] = useState([]);

  // State riêng để quản lý discount (tách riêng khỏi form)
  const [discounts, setDiscounts] = useState([]);

  console.log("discounts", discounts);

  const [isDescriptionModalOpen, setDescriptionModalOpen] = useState(false);
  console.log("product", product);

  useEffect(() => {
    if (product) {
      form.setFieldsValue({
        ...product,
        id: product.id,

        categoryIds: product?.categories
          ? product.categories.map((cate) => cate.categoryId)
          : [],
        discounts: product.productDiscount
          ? product.productDiscount.map((discount) => ({
              ...discount,
              discountValue: discount.discountValue,
              startDate: discount.startDate ? moment(discount.startDate) : null,
              endDate: discount.endDate ? moment(discount.endDate) : null,
            }))
          : [],

        color: product.color || "",
        gender: product.gender || "",
        material: product.material || "",
        completion: product.completion || "",
        stone: product.stone || "",
        variants: product.variants || [],
        discount: product.productDiscount || [],
        overview: product.overview || "",
        description: product.description || "",
      });

      if (product.productDiscount && Array.isArray(product.productDiscount)) {
        const discountData = product.productDiscount.map((discount) => ({
          ...discount,
          discountValue: discount.discountValue,
          startDate: discount.startDate ? moment(discount.startDate) : null,
          endDate: discount.endDate ? moment(discount.endDate) : null,
        }));
        setDiscounts(discountData);
      } else {
        setDiscounts([]);
      }

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

  console.log("discounts", discounts);

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

    if (allValues.discounts !== undefined) {
      // Nếu người dùng thay đổi giá trị discount, cập nhật state discounts
      setDiscounts(allValues.discounts || []);
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

      if (product && Object.keys(product).length > 0) {
        // Loại bỏ trường discounts khỏi formData (vì discount được quản lý riêng)
        const {
          discounts: _ignored,
          categoryIds: _cat,
          variants: _variants,
          uploadedImageIds: _ignored2,
          ...updatedFormData
        } = formData;

        // Sau đó, nếu có discount cần cập nhật, gọi API updateDiscounts riêng
        if (discounts && discounts.length > 0) {
          // Tách các discount đã có id và chưa có id
          const existingDiscounts = discounts.filter((d) => d.id);
          const newDiscounts = discounts.filter((d) => !d.id);

          // Cập nhật các discount đã tồn tại
          for (let discount of existingDiscounts) {
            const discountPayload = {
              discountValue: Number(discount.discountValue),
              startDate: discount.startDate
                ? typeof discount.startDate.format === "function"
                  ? discount.startDate.format("YYYY-MM-DD")
                  : moment(discount.startDate).format("YYYY-MM-DD")
                : null,
              endDate: discount.endDate
                ? typeof discount.endDate.format === "function"
                  ? discount.endDate.format("YYYY-MM-DD")
                  : moment(discount.endDate).format("YYYY-MM-DD")
                : null,
            };

            console.log("Updating discountPayload", discountPayload);

            await dispatch(
              updateDiscounts({
                accessToken,
                productId: product.id,
                ...discountPayload,
              })
            ).unwrap();
          }

          // Tạo mới các discount chưa có id
          for (let discount of newDiscounts) {
            const discountPayload = {
              discountValue: Number(discount.discountValue),
              startDate: discount.startDate
                ? typeof discount.startDate.format === "function"
                  ? discount.startDate.format("YYYY-MM-DD")
                  : moment(discount.startDate).format("YYYY-MM-DD")
                : null,
              endDate: discount.endDate
                ? typeof discount.endDate.format === "function"
                  ? discount.endDate.format("YYYY-MM-DD")
                  : moment(discount.endDate).format("YYYY-MM-DD")
                : null,
            };

            console.log("Creating discountPayload", discountPayload);

            await dispatch(
              createProductDiscount({
                accessToken,
                productId: product.id,
                ...discountPayload,
              })
            ).unwrap();
          }
          toast.success("Discount đã được cập nhật và tạo mới thành công!");
        }

        // Cập nhật dữ liệu sản phẩm trước
        await dispatch(
          updateProduct({ accessToken, product: updatedFormData })
        ).unwrap();
        toast.success("Cập nhật sản phẩm thành công!");
      } else {
        // Nếu không có sản phẩm, tạo sản phẩm mới
        await dispatch(
          createProduct({ accessToken, product: formData })
        ).unwrap();
        toast.success("Tạo sản phẩm thành công!");
        // Trong trường hợp tạo mới, bạn có thể gọi API tạo discount riêng sau nếu cần.
      }
      dispatch(getProducts({}));
    } catch (error) {
      console.error("Lỗi khi gửi sản phẩm:", error);
      toast.error("Lỗi khi gửi sản phẩm!");
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

          <Form.List name="discounts">
            {(fields, { add, remove }) => (
              <>
                <h3 className="text-lg font-semibold mb-2">Discount</h3>
                {fields.map((field) => (
                  <Row gutter={16} key={field.key}>
                    <Col span={8}>
                      <Form.Item
                        {...field}
                        label="Discount Value"
                        name={[field.name, "discountValue"]}
                        fieldKey={[field.fieldKey, "discountValue"]}
                        rules={[
                          { required: true, message: "Nhập discount value" },
                        ]}
                      >
                        <Input type="number" placeholder="10" />
                      </Form.Item>
                    </Col>
                    <Col span={8}>
                      <Form.Item
                        {...field}
                        label="Start Date"
                        name={[field.name, "startDate"]}
                        fieldKey={[field.fieldKey, "startDate"]}
                        rules={[
                          { required: true, message: "Chọn ngày bắt đầu" },
                        ]}
                        // Nếu cần thiết lập initialValue, bạn có thể chuyển đổi bằng moment
                      >
                        <DatePicker
                          format="YYYY-MM-DD"
                          style={{ width: "100%" }}
                        />
                      </Form.Item>
                    </Col>
                    <Col span={8}>
                      <Form.Item
                        {...field}
                        label="End Date"
                        name={[field.name, "endDate"]}
                        fieldKey={[field.fieldKey, "endDate"]}
                        rules={[
                          { required: true, message: "Chọn ngày kết thúc" },
                        ]}
                      >
                        <DatePicker
                          format="YYYY-MM-DD"
                          style={{ width: "100%" }}
                        />
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
                  Thêm discount
                </Button>
              </>
            )}
          </Form.List>

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
          <Form.Item name="id" hidden>
            <Input />
          </Form.Item>

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
