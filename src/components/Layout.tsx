
import { Outlet } from "react-router-dom";
import Navigation from "./Navigation";

const Layout = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold text-center py-8">نظام البحث في مستندات Word العربية</h1>
      <Navigation />
      <Outlet />
    </div>
  );
};

export default Layout;
