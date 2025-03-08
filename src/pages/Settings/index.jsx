import React, { useState } from "react";
import DashboardSideBar from "../../components/Dashboard/DashboardSideBar";

const Settings = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const [settings, setSettings] = useState({
    notifications: true,
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleSettingChange = (setting, value) => {
    setSettings((prev) => ({
      ...prev,
      [setting]: value,
    }));
  };

  const handlePasswordChange = (e) => {
    e.preventDefault();
    // Add your password change logic here
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      alert("New passwords don't match!");
      return;
    }
    // Implement password update logic
  };

  const handleDeleteAccount = () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete your account? This action cannot be undone."
    );
    if (confirmed) {
      // Implement account deletion logic
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-100">
      {/* Mobile Menu Button */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 p-2 rounded-md bg-white shadow-md hover:bg-gray-100"
        onClick={toggleSidebar}
        aria-label="Toggle menu"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d={
              isSidebarOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"
            }
          />
        </svg>
      </button>{" "}
      {/* Dashboard Sidebar */}
      <div
        className={`
    fixed md:static inset-y-0 left-0 transform 
    ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
    md:translate-x-0 transition duration-200 ease-in-out
    md:sticky md:top-0 md:h-screen z-30
    md:w-64 bg-white shadow-lg
  `}
      >
        <DashboardSideBar />
      </div>
      {/* Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 md:hidden z-20"
          onClick={toggleSidebar}
          aria-label="Close menu"
        />
      )}
      {/* Main Content */}
      <div className="flex-1 w-full md:w-auto p-4 md:p-6 md:ml-4">
        <h1 className="text-2xl font-bold mb-6">Settings</h1>
        <div className="space-y-6 max-w-4xl">
          {/* Password Change Section */}
          <section className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-4">Change Password</h2>
            <form onSubmit={handlePasswordChange} className="space-y-4">
              <div>
                <label className="block mb-1">Current Password</label>
                <input
                  type="password"
                  value={passwordForm.currentPassword}
                  onChange={(e) =>
                    setPasswordForm({
                      ...passwordForm,
                      currentPassword: e.target.value,
                    })
                  }
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div>
                <label className="block mb-1">New Password</label>
                <input
                  type="password"
                  value={passwordForm.newPassword}
                  onChange={(e) =>
                    setPasswordForm({
                      ...passwordForm,
                      newPassword: e.target.value,
                    })
                  }
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div>
                <label className="block mb-1">Confirm New Password</label>
                <input
                  type="password"
                  value={passwordForm.confirmPassword}
                  onChange={(e) =>
                    setPasswordForm({
                      ...passwordForm,
                      confirmPassword: e.target.value,
                    })
                  }
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Update Password
              </button>
            </form>
          </section>

          {/* Notifications Section */}
          <section className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-4">Notifications</h2>
            <div className="flex items-center justify-between">
              <span>Enable Notifications</span>
              <input
                type="checkbox"
                checked={settings.notifications}
                onChange={(e) =>
                  handleSettingChange("notifications", e.target.checked)
                }
                className="toggle"
              />
            </div>
          </section>

          {/* Delete Account Section */}
          <section className="bg-white p-4 rounded-lg shadow border border-red-500">
            <h2 className="text-lg font-semibold mb-4">Delete Account</h2>
            <div>
              <p className="text-gray-600 mb-4">
                Warning: This action cannot be undone. All your data will be
                permanently deleted.
              </p>
              <button
                onClick={handleDeleteAccount}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                Delete Account
              </button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Settings;
