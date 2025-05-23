import NewOrderNotification from "@components/common/NewOrderNotification";
import PropTypes from "prop-types";
import { UserCircle } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { getLoggedInUserThunk } from "@redux/thunk/authThunk";
import LoadingPage from "@pages/LoadingPage";
import UnsendReviewsNotification from "@components/common/UnsendReviewsNotification";

const Header = ({ currentPage }) => {
  const accessToken = localStorage.getItem("accessToken");

  const { authUser, loading } = useSelector((state) => state.auth);

  const dispatch = useDispatch();

  useEffect(() => {
    if (accessToken && !authUser) {
      dispatch(getLoggedInUserThunk(accessToken));
    }
  }, [accessToken, dispatch, authUser]);

  const [account, setAccount] = useState(null);

  useEffect(() => {
    if (authUser) {
      setAccount(authUser);
    }
  }, [authUser]);

  if (loading) return <LoadingPage />;

  return (
    <div className=" w-full h-[75px] border-l bg-white  border-slate-300 shadow-md py-6 px-10 flex items-center justify-between">
      {/* Tiêu đề trang */}
      <h2 className="text-2xl font-bold text-gray-800">{currentPage}</h2>

      {/* Khu vực thông báo và thông tin user */}
      <div className="flex items-center gap-6">
        {/* Thông báo đơn hàng mới */}
        <NewOrderNotification />

        {/* Thông báo phản hồi */}
        <UnsendReviewsNotification />

        {/* User Info */}
        <div className="flex items-center gap-3 bg-gray-100 px-4 py-2 rounded-full shadow-sm">
          {`
            ${account?.role === "ADMIN" ? "Quản trị viên" : "Nhân viên"}
            `}

          <span className="text-gray-400">|</span>
          <UserCircle className="w-8 h-8 text-gray-600" />
          <span className="text-lg font-medium text-gray-700">
            Xin chào,{" "}
            <span className="text-gray-900 font-semibold">
              {account?.fullName}
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
