import FeedbackNotification from "@components/common/FeedbackNotification";
import NewOrderNotification from "@components/common/NewOrderNotification";
import PropTypes from "prop-types";
import { UserCircle } from "lucide-react";

const Header = ({ currentPage, loggedInUserName }) => {
  return (
    <div className="absolute right-0 top-0 w-4/5 h-[75px] border-l bg-white shadow-md p-6 flex items-center justify-between">
      {/* Tiêu đề trang */}
      <h2 className="text-2xl font-bold text-gray-800">{currentPage}</h2>

      {/* Khu vực thông báo và thông tin user */}
      <div className="flex items-center gap-6">
        {/* Thông báo đơn hàng mới */}
        <NewOrderNotification />

        {/* Thông báo phản hồi */}
        <FeedbackNotification />

        {/* User Info */}
        <div className="flex items-center gap-3 bg-gray-100 px-4 py-2 rounded-full shadow-sm">
          <UserCircle className="w-8 h-8 text-gray-600" />
          <span className="text-lg font-medium text-gray-700">
            Xin chào,{" "}
            <span className="text-gray-900 font-semibold">
              {loggedInUserName}
            </span>
          </span>
        </div>
      </div>
    </div>
  );
};

Header.propTypes = {
  currentPage: PropTypes.string,
  loggedInUserName: PropTypes.string,
};

export default Header;
