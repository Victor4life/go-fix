import React, { useState } from "react";

const Settings = () => {
  const [settings, setSettings] = useState({
    notifications: true,
    darkMode: false,
    language: "english",
    emailUpdates: true,
  });

  const handleSettingChange = (setting, value) => {
    setSettings((prev) => ({
      ...prev,
      [setting]: value,
    }));
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Settings</h1>

      <div className="space-y-6">
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

        {/* Appearance Section */}
        <section className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Appearance</h2>
          <div className="flex items-center justify-between">
            <span>Dark Mode</span>
            <input
              type="checkbox"
              checked={settings.darkMode}
              onChange={(e) =>
                handleSettingChange("darkMode", e.target.checked)
              }
              className="toggle"
            />
          </div>
        </section>

        {/* Language Section */}
        <section className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Language</h2>
          <select
            value={settings.language}
            onChange={(e) => handleSettingChange("language", e.target.value)}
            className="w-full p-2 border rounded"
          >
            <option value="english">English</option>
            <option value="spanish">Spanish</option>
            <option value="french">French</option>
          </select>
        </section>

        {/* Email Preferences */}
        <section className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Email Preferences</h2>
          <div className="flex items-center justify-between">
            <span>Receive Email Updates</span>
            <input
              type="checkbox"
              checked={settings.emailUpdates}
              onChange={(e) =>
                handleSettingChange("emailUpdates", e.target.checked)
              }
              className="toggle"
            />
          </div>
        </section>
      </div>
    </div>
  );
};

export default Settings;
