import PropTypes from "prop-types";
import { useLocation } from "react-router-dom";
import useRoutes from "@config/sidebarElements"; // Cập nhật import
// import { useEffect } from "react";
import Header from "@components/common/Header";
import SideBar from "@components/common/SideBar";
// import { useDispatch, useSelector } from "react-redux";
// import { setCredentials } from "../redux/slice/authSlice";
// import { getLoggedInUser } from "../redux/thunk/userThunk";
// import PrivateRoute from "../configs/PrivateRoute";

const MainLayout = ({ children }) => {
  // const dispatch = useDispatch();
  // const userExist = useSelector((state) => state.users?.user);

  // useEffect(() => {
  //   const accessToken = localStorage.getItem("accessToken");
  //   const refreshToken = localStorage.getItem("refreshToken");

  //   if (refreshToken && accessToken) {
  //     dispatch(setCredentials({ accessToken, refreshToken }));
  //   }

  //   if (accessToken) {
  //     dispatch(getLoggedInUser(accessToken));
  //   }
  // }, [dispatch]);

  const currentPath = useLocation().pathname;
  const pages = useRoutes();

  // console.log(pages);

  const findLabelInChildren = (childItems, currentPath) => {
    for (const child of childItems) {
      if (child.path === currentPath) {
        return child.label;
      }

      if (Array.isArray(child.childItems) && child.childItems.length > 0) {
        const foundInSubChildren = findLabelInChildren(
          child.childItems,
          currentPath
        );
        if (foundInSubChildren) {
          return foundInSubChildren;
        }
      }
    }
    return null;
  };

  const currentPage = pages
    .map((item) => {
      if (item.path === currentPath) {
        return item.label;
      }

      if (Array.isArray(item.childItems) && item.childItems.length > 0) {
        const foundInChildren = findLabelInChildren(
          item.childItems,
          currentPath
        );
        if (foundInChildren) {
          return foundInChildren;
        }
      }

      return null;
    })
    .filter(Boolean);

  const currentPageName = currentPage.length > 0 ? currentPage[0] : null;

  return (
    <div className="flex h-screen w-screen">
      {/* Sidebar chiếm chiều rộng cố định */}
      <div className="w-[320px] h-full bg-slate-200 shadow-lg">
        <SideBar />
      </div>

      {/* Nội dung chính */}
      <div className="flex flex-col flex-1 h-full">
        <Header currentPage={currentPageName} />
        <div className="flex-1 overflow-auto p-4">{children}</div>
      </div>
    </div>
  );
};

MainLayout.propTypes = {
  children: PropTypes.node,
};

export default MainLayout;
