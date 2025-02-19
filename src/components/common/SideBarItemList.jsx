import { useState, useCallback } from "react";
import SideBarItem from "@components/common/SideBarItem";
import useRoutes from "@config/sidebarElements";

const SideBarItemList = () => {
  const [isToggled, setIsToggled] = useState({});
  const itemList = useRoutes();

  // Hàm toggle menu con
  const handleClickedItem = useCallback((key) => {
    setIsToggled((prevState) => ({
      ...prevState,
      [key]: !prevState[key],
    }));
  }, []);

  return (
    <div className="no-scrollbar h-3/4 w-full overflow-auto py-2 pl-4 pr-6">
      {itemList.map(({ icon, label, path, childItems }) => {
        const key = path.split("/")[1];
        const hasChildren = childItems.length > 0;

        return (
          <SideBarItem
            key={key}
            icon={icon}
            label={label}
            path={path}
            childItems={childItems}
            isToggled={isToggled[key] || false}
            onClick={hasChildren ? () => handleClickedItem(key) : undefined}
          />
        );
      })}
    </div>
  );
};

export default SideBarItemList;
