import { useEffect, useState } from "react";
import { Modal, Input, Button, Rate, Typography, Divider, Image } from "antd";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";

const { Title, Text } = Typography;

const ReviewPopup = ({ isOpen, onClose, data }) => {
  const dispatch = useDispatch();
  const [reply, setReply] = useState("");

  useEffect(() => {
    if (data) {
      setReply(""); // Reset reply khi mở modal
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

  if (!data) return null;

  return (
    <Modal
      title={<Title level={4}>Chi tiết đánh giá</Title>}
      open={isOpen}
      onCancel={onClose}
      footer={null}
      width={600}
    >
      <Text strong>Mã đơn hàng:</Text> <Text>{data.orderId}</Text>
      <Divider dashed />
      <Text strong>Người mua:</Text> <Text>{data.buyerName}</Text>
      <Divider dashed />
      <Text strong>Sản phẩm:</Text> <Text>{data.productName}</Text>
      <Divider dashed />
      <Text strong>Đánh giá:</Text> <Rate disabled value={data.rating} />
      <Divider dashed />
      <Text strong>Bình luận:</Text>
      <Text block style={{ display: "block", marginTop: 4 }}>
        {data.comment}
      </Text>
      {data.image && (
        <Image
          src={data.image}
          alt="Hình ảnh đánh giá"
          style={{ marginTop: 10, borderRadius: 8 }}
          width={200}
        />
      )}
      <Divider dashed />
      <Text strong>Trả lời đánh giá:</Text>
      <Input.TextArea
        rows={3}
        placeholder="Nhập phản hồi của bạn..."
        value={reply}
        onChange={(e) => setReply(e.target.value)}
        style={{ marginTop: 8 }}
      />
      <div style={{ textAlign: "right", marginTop: 16 }}>
        <Button onClick={onClose} style={{ marginRight: 8 }}>
          Hủy
        </Button>
        <Button type="primary" onClick={handleSubmit}>
          Gửi phản hồi
        </Button>
      </div>
    </Modal>
  );
};

export default ReviewPopup;
