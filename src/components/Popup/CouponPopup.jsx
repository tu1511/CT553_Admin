import { useEffect } from "react";
import {
  Modal,
  Form,
  Input,
  Button,
  DatePicker,
  InputNumber,
  Switch,
  Row,
  Col,
} from "antd";
import dayjs from "dayjs";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import {
  createCoupon,
  deleteCoupon,
  getAllCoupons,
  updateCoupon,
} from "@redux/thunk/couponThunk";

const CouponPopup = ({ isOpen, onClose, data }) => {
  const dispatch = useDispatch();
  const [form] = Form.useForm();

  const accessToken = localStorage.getItem("accessToken");

  console.log("data", data);

  useEffect(() => {
    if (data) {
      form.setFieldsValue({
        code: data.code,
        discountValue: data.discountValue,
        startDate: data.startDate ? dayjs(data.startDate) : null,
        endDate: data.endDate ? dayjs(data.endDate) : null,
        quantity: data.quantity,
        minimumPriceToUse: data.minimumPriceToUse,
        visible: data.visible ?? false,
      });
    } else {
      form.resetFields();
      form.setFieldsValue({
        visible: false,
      });
    }
  }, [data, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const payload = {
        ...values,
        startDate: values.startDate
          ? values.startDate.format("YYYY-MM-DD")
          : null,
        endDate: values.endDate ? values.endDate.format("YYYY-MM-DD") : null,
      };

      console.log("Submitted Data:", payload);

      if (data && Object.keys(data).length !== 0) {
        await dispatch(
          updateCoupon({ accessToken, couponId: data.id, data: payload })
        ).unwrap();
        toast.success("Cập nhật mã giảm giá thành công!");
      } else {
        await dispatch(createCoupon({ accessToken, data: payload })).unwrap();
        toast.success("Thêm mã giảm giá thành công!");
      }
      dispatch(getAllCoupons(accessToken));
      form.resetFields();
      onClose();
    } catch (error) {
      console.error("Validation failed:", error);
    }
  };

  return (
    <Modal
      title={
        <div
          style={{ textAlign: "center", fontSize: "18px", fontWeight: "bold" }}
        >
          {data && Object.keys(data).length !== 0
            ? "Cập nhật mã giảm giá"
            : "Thêm mã giảm giá"}
        </div>
      }
      open={isOpen}
      onCancel={onClose}
      footer={null}
      width={600}
    >
      <Form form={form} layout="vertical">
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="Mã giảm giá"
              name="code"
              rules={[
                { required: true, message: "Vui lòng nhập mã giảm giá!" },
              ]}
            >
              <Input placeholder="Nhập mã giảm giá" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Giá trị giảm (%)"
              name="discountValue"
              rules={[
                { required: true, message: "Vui lòng nhập giá trị giảm!" },
              ]}
            >
              <InputNumber
                min={1}
                max={100}
                style={{ width: "100%" }}
                placeholder="Nhập % giảm"
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="Ngày bắt đầu"
              name="startDate"
              rules={[
                { required: true, message: "Vui lòng chọn ngày bắt đầu!" },
              ]}
            >
              <DatePicker style={{ width: "100%" }} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Ngày kết thúc"
              name="endDate"
              rules={[
                { required: true, message: "Vui lòng chọn ngày kết thúc!" },
              ]}
            >
              <DatePicker style={{ width: "100%" }} />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="Số lượng mã"
              name="quantity"
              rules={[
                { required: true, message: "Vui lòng nhập số lượng mã!" },
              ]}
            >
              <InputNumber
                min={1}
                style={{ width: "100%" }}
                placeholder="Nhập số lượng"
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Giá trị tối thiểu để sử dụng"
              name="minimumPriceToUse"
              rules={[
                { required: true, message: "Vui lòng nhập giá trị tối thiểu!" },
              ]}
            >
              <InputNumber
                min={0}
                style={{ width: "100%" }}
                placeholder="Nhập giá trị tối thiểu"
              />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item label="Hiển thị" name="visible" valuePropName="checked">
          <Switch />
        </Form.Item>

        <div style={{ textAlign: "right", marginTop: "16px" }}>
          {data && Object.keys(data).length !== 0 && (
            <Button
              type="primary"
              danger
              style={{ marginRight: 8 }}
              onClick={async () => {
                await dispatch(
                  deleteCoupon({ accessToken, couponId: data.id })
                ).unwrap();
                toast.success("Xóa mã giảm giá thành công!");
                dispatch(getAllCoupons(accessToken));
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

export default CouponPopup;
