import { useState, useEffect } from "react";
import { Dropdown, Badge, List, Button, Typography, Avatar } from "antd";
import { Mail } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import reviewService from "@services/review.service";

const UnsendReviewsNotification = () => {
  const [feedbackMessages, setFeedbackMessages] = useState([]);
  const [unsendReviews, setUnsendReviews] = useState([]);
  const [isDropdownVisible, setDropdownVisible] = useState(false);

  useEffect(() => {
    const fetchUnsendReviews = async () => {
      const response = await reviewService.getUnsendReviews();
      setUnsendReviews(response.metadata);
    };

    fetchUnsendReviews();
  }, []);

  const navigate = useNavigate();

  useEffect(() => {
    setTimeout(() => {
      setFeedbackMessages(unsendReviews);
    }, 10000);
  }, [unsendReviews]);

  const handleCloseDropdown = () => {
    setDropdownVisible(false);
  };

  const menuItems = (
    <div className="w-96 bg-white rounded-lg shadow-lg p-2">
      {feedbackMessages.length > 0 ? (
        <List
          itemLayout="horizontal"
          dataSource={feedbackMessages.slice(0, 3)}
          renderItem={(feedback) => (
            <Link to="danh-gia" onClick={handleCloseDropdown}>
              <List.Item className="border-b border-gray-200 last:border-b-0">
                <List.Item.Meta
                  avatar={
                    <Avatar
                      src={
                        feedback?.account?.avatar?.path ||
                        `https://ui-avatars.com/api/?name=${feedback?.account?.fullName}&size=128`
                      }
                    />
                  }
                  title={
                    <span className="font-semibold">
                      {feedback?.account?.fullName}
                    </span>
                  }
                  description={
                    <Typography.Text className="text-gray-600">
                      {feedback?.comment}
                    </Typography.Text>
                  }
                />
              </List.Item>
            </Link>
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
          onClick={() => {
            navigate("/danh-gia");
            handleCloseDropdown();
          }}
        >
          Xem chi tiết
        </Button>
      )}
    </div>
  );

  return (
    <Dropdown
      overlay={menuItems}
      trigger={["click"]}
      placement="bottomRight"
      visible={isDropdownVisible}
      onVisibleChange={setDropdownVisible}
    >
      <Badge count={unsendReviews.length} size="small">
        <Mail
          className="cursor-pointer text-gray-700 hover:text-blue-500"
          size={24}
          onClick={() => setDropdownVisible(!isDropdownVisible)}
        />
      </Badge>
    </Dropdown>
  );
};

export default UnsendReviewsNotification;
