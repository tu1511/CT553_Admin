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
  Upload,
} from "antd";
import { toast } from "react-toastify";
import { formatDateTime } from "@helpers/formatDateTime";
import { getAllReviews, replyComment } from "@redux/thunk/reviewThunk";
import { useDispatch } from "react-redux";
import { Plus } from "lucide-react";
import uploadService from "@services/upload.service";

const { Title, Text } = Typography;

const ReviewPopup = ({ isOpen, onClose, data }) => {
  const dispatch = useDispatch();
  const accessToken = localStorage.getItem("accessToken");
  const [reply, setReply] = useState("");
  const [visible, setVisible] = useState(data?.visible || true);
  const [fileList, setFileList] = useState([]);

  useEffect(() => {
    if (data) {
      setReply("");
      setVisible(data.visible);
    }
  }, [data]);

  const handleImageUpload = async ({ file, fileList: newFileList }) => {
    if (file.status === "removed") {
      setFileList(newFileList);
      return;
    }

    const toUpload = newFileList.filter((f) => f.originFileObj);
    if (!toUpload.length) return setFileList(newFileList);

    if (toUpload.some((file) => !file.type.startsWith("image/"))) {
      return toast.error("Chỉ được phép tải lên ảnh!");
    }

    try {
      const response = await uploadService.uploadImages(
        toUpload.map((f) => f.originFileObj)
      );
      if (response?.metadata) {
        const uploadedFiles = response.metadata.map((meta) => ({
          uid: meta.id,
          name: meta.filename || "image",
          url: meta.path,
        }));
        setFileList([
          ...newFileList.filter((f) => !f.originFileObj),
          ...uploadedFiles,
        ]);
        toast.success("Tải ảnh lên thành công");
      } else {
        toast.error("Lỗi khi tải ảnh lên");
      }
    } catch (error) {
      toast.error("Tải ảnh lên thất bại");
    }
  };

  const handleSubmit = async () => {
    if (!reply.trim()) {
      toast.warning("Vui lòng nhập phản hồi!");
      return;
    }

    const dataReply = {
      orderId: data.orderId,
      replyToReviewId: data.id,
      comment: reply,
      productId: data.productId,
      variantId: data.variantId,
      uploadedImageIds: fileList.map((file) => file.uid) || [],
    };
    console.log("Dữ liệu gửi đi:", dataReply);

    // Gửi phản hồi
    try {
      await dispatch(replyComment({ accessToken, data: dataReply })).unwrap();
      console.log("Gửi phản hồi thành công!");
      toast.success("Trả lời đánh giá thành công!");
      setReply("");
      setFileList([]);
    } catch (error) {
      console.log("Lỗi trả lời đánh giá:", error);
      if (error === "This review has already been replied") {
        toast.error("Đánh giá này đã được trả lời rồi!");
      } else {
        toast.error("Có lỗi xảy ra khi trả lời đánh giá!");
      }
      return;
    }
    dispatch(getAllReviews(accessToken));

    onClose();
  };

  const handleSwitchChange = (checked) => {
    setVisible(checked);
    console.log("Trạng thái hiển thị:", checked);
  };

  if (!data) return null;

  console.log("fileList:", fileList);
  console.log(
    "hehe",
    fileList.map((file) => file.uid)
  );

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
        <Text strong>Sản phẩm:</Text>{" "}
        <Text className="col-span-4">{data.productName}</Text>
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
        <div className="flex gap-3 my-4">
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

      {
        /* Phản hồi */
        Array.isArray(data.replyByReview) && data.replyByReview.length > 0 && (
          <>
            <Divider dashed />
            <Text strong>Phản hồi:</Text>
            <div style={{ marginTop: 5 }}>
              {data.replyByReview.map((reply, index) => (
                <Text
                  key={reply.id || index}
                  style={{
                    display: "block",
                    marginBottom: 8,
                    backgroundColor: "#f6f6f6",
                    padding: "8px",
                    borderRadius: "6px",
                  }}
                >
                  {reply.comment}
                </Text>
              ))}
            </div>
          </>
        )
      }

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

      {/* Tải ảnh lên */}
      <div className="mt-2">
        <Upload
          listType="picture-card"
          fileList={fileList}
          beforeUpload={() => false}
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
      </div>
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
