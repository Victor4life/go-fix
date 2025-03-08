import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { FaUser, FaSignOutAlt } from "react-icons/fa";
import { AiFillDashboard } from "react-icons/ai";
import { MdSettings } from "react-icons/md";

const DashboardSideBar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();

  const menuItems = [
    {
      title: "Dashboard",
      icon: <AiFillDashboard />,
      path: "/dashboard",
    },
    {
      title: "Profile",
      icon: <FaUser />,
      path: "/profile/seeker",
    },
    {
      title: "Settings",
      icon: <MdSettings />,
      path: "/settings",
    },
    {
      title: "Logout",
      icon: <FaSignOutAlt />,
      path: "/",
    },
  ];

  return (
    <aside
      className={`
        fixed left-0 h-screen bg-white border-r border-gray-200
        transition-all duration-300 ease-in-out flex flex-col
        ${isCollapsed ? "w-16" : "w-64"}
      `}
    >
      <div className="flex justify-between p-4">
        <Link to="/" className="text-xl font-bold text-blue-600">
          {isCollapsed ? "GF" : "GoFix"}
        </Link>
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="rounded-lg hover:bg-gray-100"
        >
          {isCollapsed ? "→" : "←"}
        </button>
      </div>
      <nav className="mt-6">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`
              flex items-center px-4 py-3 transition-colors
              ${
                location.pathname === item.path
                  ? "mx-2 px-1 rounded-lg bg-gradient-to-r from-indigo-600 to-blue-500 text-white font-medium shadow-lg hover:shadow-xl"
                  : "text-gray-600 hover:bg-gray-100"
              }
            `}
          >
            <span className="text-xl">{item.icon}</span>
            {!isCollapsed && (
              <span className="ml-3 text-sm font-medium">{item.title}</span>
            )}
          </Link>
        ))}
      </nav>
      <div className="mt-auto px-4 text-center">
        <img
          src="/images/sidebar-img.png"
          alt="Sidebar Image"
          className="w-auto h-auto mx-auto opacity-100"
        />
        <button
          className="bg-gradient-to-r from-indigo-600 to-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors text-xs mb-1"
          aria-label="Upgrade to Pro"
        >
          {isCollapsed ? "↑" : "Upgrade to Pro"}
        </button>
      </div>
    </aside>
  );
};

export default DashboardSideBar;
