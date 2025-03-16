import { Button } from "antd";
import { useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";

import SideBarItemList from "./SideBarItemList";
import Logo from "@components/common/Logo";

const SideBar = () => {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("accessToken");
    navigate("/login");
  };

  return (
    <div className="fixed left-0 top-0 flex h-full w-1/5 flex-col bg-slate-200 shadow-lg">
      {/* Logo */}
      <div className="flex items-center justify-center h-[75px] border-b bg-white shadow-md w-full border-slate-300">
        <Logo className="h-[50px]" />
      </div>

      {/* Sidebar Items */}
      {/* <div className="flex-1 overflow-y-auto"> */}
      <SideBarItemList />
      {/* </div> */}

      {/* Logout Button */}
      <div className="w-full border-t border-slate-300 p-4 bg-slate-200">
        <Button
          onClick={logout}
          className="w-full flex items-center justify-center gap-2 rounded-md py-2 text-red-600 hover:bg-red-50 transition"
          type="text"
        >
          <LogOut size={18} /> Đăng xuất
        </Button>
      </div>
    </div>
  );
};

export default SideBar;
