import { Outlet } from "react-router-dom";
import DashboardSideBar from "../DashboardSideBar";

const DashboardLayout = () => {
  return (
    <div className="flex">
      <DashboardSideBar />
      <div className="flex-1 ml-64">
        <Outlet />
      </div>
    </div>
  );
};

export default DashboardLayout;
