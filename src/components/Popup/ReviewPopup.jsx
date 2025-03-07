import { useEffect, useState } from "react";
import {
  Modal,
  Input,
  Button,
  Rate,
  Typography,
  Divider,
  Image,
  Switch,
  Avatar,
} from "antd";
import { toast } from "react-toastify";
import { formatDateTime } from "@helpers/formatDateTime";

const { Title, Text } = Typography;

const ReviewPopup = ({ isOpen, onClose, data }) => {
  const [reply, setReply] = useState("");
  const [visible, setVisible] = useState(data?.visible || true);

  useEffect(() => {
    if (data) {
      setReply("");
      setVisible(data.visible);
    }
  }, [data]);

  const handleSubmit = async () => {
    if (!reply.trim()) {
      toast.error("Vui lòng nhập phản hồi!");
      return;
    }
    console.log("Dữ liệu gửi đi:", { reply });
    toast.success("Trả lời đánh giá thành công!");
    onClose();
  };

  const handleSwitchChange = (checked) => {
    setVisible(checked);
    console.log("Trạng thái hiển thị:", checked);
  };

  if (!data) return null;

  return (
    <Modal
      title={
        <Title level={4} style={{ textAlign: "center" }}>
          Chi tiết đánh giá
        </Title>
      }
      open={isOpen}
      onCancel={onClose}
      footer={null}
      width={800}
    >
      {/* Người đánh giá */}
      <div className="flex justify-between items-center gap-4 mb-4">
        <div className="flex items-center gap-3">
          <Avatar src={data.account?.avatar?.path} size={60} />
          <div>
            <Text strong style={{ fontSize: "16px" }}>
              {data.buyerName}
            </Text>
            <br />
            <Text type="secondary" style={{ fontSize: "13px" }}>
              {formatDateTime(data.createdAt)}
            </Text>
          </div>
        </div>

        {/* Trạng thái hiển thị đánh giá */}
        <div className="flex gap-4 items-center">
          <Text strong>Hiển thị đánh giá:</Text>
          <Switch checked={visible} onChange={handleSwitchChange} />
        </div>
      </div>

      <Divider dashed />
      {/* Thông tin đánh giá */}
      <div className="grid grid-cols-5 gap-2 text-gray-700">
        <Text strong className="col-span-1">
          Mã đơn hàng:
        </Text>{" "}
        <Text className="col-span-4">{data.orderId}</Text>
        <Text strong>Sản phẩm:</Text> <Text>{data.productName}</Text>
      </div>
      <Divider dashed />

      {/* Điểm đánh giá */}
      <div className="flex items-center gap-2 mb-2">
        <Text strong style={{ fontSize: "15px" }}>
          Đánh giá:
        </Text>
        <Rate disabled value={data.rating} />
      </div>

      {/* Bình luận */}
      <Text strong>Bình luận:</Text>
      <Text
        style={{
          display: "block",
          marginTop: 5,
          backgroundColor: "#f6f6f6",
          padding: "8px",
          borderRadius: "6px",
        }}
      >
        {data.comment}
      </Text>

      {/* Hình ảnh đánh giá */}
      {data.reviewImage && data.reviewImage.length > 0 && (
        <div className="grid grid-cols-3 gap-3 my-4">
          {data.reviewImage.map((img) => (
            <Image
              key={img.id}
              src={img.image.path}
              alt="Hình ảnh đánh giá"
              style={{
                borderRadius: 10,
                boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
              }}
              width={100}
              height={100}
            />
          ))}
        </div>
      )}

      {/* Nhập phản hồi */}
      <Text strong>Trả lời đánh giá:</Text>
      <Input.TextArea
        rows={3}
        placeholder="Nhập phản hồi của bạn..."
        value={reply}
        onChange={(e) => setReply(e.target.value)}
        style={{
          marginTop: 8,
          borderRadius: 8,
          padding: 10,
          fontSize: "14px",
        }}
      />
      <div className="flex justify-end mt-4 gap-2">
        <Button onClick={onClose} style={{ borderRadius: 8 }}>
          Hủy
        </Button>
        <Button
          type="primary"
          onClick={handleSubmit}
          style={{ borderRadius: 8 }}
        >
          Gửi phản hồi
        </Button>
      </div>
    </Modal>
  );
};

export default ReviewPopup;
