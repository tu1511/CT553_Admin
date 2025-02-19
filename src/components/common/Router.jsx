import { BrowserRouter, Route, Routes } from "react-router-dom";

import { NotFoundPage } from "../../pages/index.js";
import { useSelector } from "react-redux";
import useRoutes from "@config/sidebarElements.jsx";
import MainLayout from "@layouts/MainLayout.jsx";
import authRouter from "@config/router/authRouter.jsx";
import { AuthLayout } from "@layouts/index.js";

const Router = () => {
  const userExist = useSelector((state) => state.users?.user);
  const userRole = userExist?.role.role;
  const commonRouter = useRoutes();

  return (
    <BrowserRouter>
      <Routes>
        {commonRouter.map(({ id, path, element, childItems }) => {
          // Kiểm tra vai trò người dùng cho các route cụ thể
          const isAdminRoute = path === "/user" || path === "/settings";
          const isAdmin = userRole === "admin";

          // Nếu là route admin và người dùng không phải là admin thì ẩn route này
          if (isAdminRoute && !isAdmin) {
            return null; // Không render route nếu không phải admin
          }

          return (
            <>
              <Route
                key={id}
                path={path}
                element={<MainLayout>{element}</MainLayout>}
              />
              {childItems?.length > 0 &&
                childItems.map(({ childId, path, element }) => {
                  return (
                    <Route
                      key={childId}
                      path={path}
                      element={<MainLayout>{element}</MainLayout>}
                    />
                  );
                })}
            </>
          );
        })}

        {authRouter.map(({ id, path, element }) => (
          <Route
            key={id}
            path={path}
            element={<AuthLayout>{element}</AuthLayout>}
          />
        ))}

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
