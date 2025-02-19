import { useState, useEffect } from "react";
import { Dropdown, Badge, List, Button, Typography, Avatar } from "antd";
import { Mail, User } from "lucide-react";
import { useNavigate } from "react-router-dom";

const fakeFeedbacks = [
  {
    _id: "1",
    senderName: "Nguyễn Văn A",
    message: "Tôi cần hỗ trợ về đơn hàng.",
  },
  {
    _id: "2",
    senderName: "Trần Thị B",
    message: "Sản phẩm bị lỗi, tôi cần đổi hàng.",
  },
  { _id: "3", senderName: "Lê Văn C", message: "Dịch vụ giao hàng quá chậm." },
];

const FeedbackNotification = () => {
  const [feedbackMessages, setFeedbackMessages] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    setTimeout(() => {
      setFeedbackMessages(fakeFeedbacks);
    }, 1000);
  }, []);

  const menuItems = (
    <div className="w-96 bg-white rounded-lg shadow-lg p-2">
      {feedbackMessages.length > 0 ? (
        <List
          itemLayout="horizontal"
          dataSource={feedbackMessages.slice(0, 3)}
          renderItem={(feedback) => (
            <List.Item className="border-b border-gray-200 last:border-b-0">
              <List.Item.Meta
                avatar={<Avatar icon={<User />} />}
                title={
                  <span className="font-semibold">{feedback.senderName}</span>
                }
                description={
                  <Typography.Text className="text-gray-600">
                    {feedback.message}
                  </Typography.Text>
                }
              />
            </List.Item>
          )}
        />
      ) : (
        <p className="text-center py-4 text-gray-500">Không có tin nhắn mới</p>
      )}

      {feedbackMessages.length > 3 && (
        <Button
          type="link"
          block
          className="mt-2 text-blue-500"
          onClick={() => navigate("/feedback")}
        >
          Xem chi tiết
        </Button>
      )}
    </div>
  );

  return (
    <Dropdown overlay={menuItems} trigger={["click"]} placement="bottomRight">
      <Badge count={feedbackMessages.length} size="small">
        <Mail
          className="cursor-pointer text-gray-700 hover:text-blue-500"
          size={24}
        />
      </Badge>
    </Dropdown>
  );
};

export default FeedbackNotification;
