import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import DashboardSideBar from "../../components/Dashboard/DashboardSideBar";
import Spinner from "react-spinner-material";

const ServiceSeekerProfile = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true); // Add this with your other state declarations

  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    address: "",
    businessName: "",
    serviceType: "",
    experience: "",
    availability: "",
  });

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Fetch profile data when component mounts
  useEffect(() => {
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/profile", {
        credentials: "include",
      });

      const data = await response.json();
      console.log(
        "Raw profile data from backend (detailed):",
        JSON.stringify(data, null, 2)
      );
      // This will show us the complete nested structure
      if (data.success && data.profile) {
        const newProfileData = {
          name: data.profile.username || "",
          email: data.profile.email || "",
          phoneNumber: data.profile.profile?.phone || "",
          address: data.profile.profile?.location || "",
          businessName: data.profile.profile?.businessName || "",
          serviceType: data.profile.profile?.serviceType || "",
          experience: data.profile.profile?.experience || "",
          availability: data.profile.profile?.availability || "",
        };
        console.log("Profile object structure:", data.profile);
        console.log("Mapped profile data:", newProfileData);
        setProfileData(newProfileData);
      }
    } catch (err) {
      console.error("Fetch error:", err);
      setError(err.message || "Failed to fetch profile data");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccessMessage("");

    try {
      const updateData = {
        username: profileData.name,
        email: profileData.email,
        phoneNumber: profileData.phoneNumber,
        address: profileData.address,
        businessName: profileData.businessName,
        serviceType: profileData.serviceType,
        experience: profileData.experience,
        availability: profileData.availability,
        skills: [],
        hourlyRate: 0,
      };

      console.log("Sending update data:", updateData);

      const response = await fetch("http://localhost:5000/api/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(updateData),
      });

      const data = await response.json();
      console.log("Update response data:", data);

      if (response.ok) {
        setSuccessMessage("Profile updated successfully!");
        setTimeout(() => {
          fetchProfileData();
        }, 500);
      } else {
        setError(data.message || "Update failed");
      }
    } catch (err) {
      console.error("Update error:", err);
      setError("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log(`Updating ${name} to ${value}`);
    setProfileData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  if (loading)
    return (
      <div className="fixed inset-0 flex justify-center items-center bg-white bg-opacity-75">
        <Spinner
          radius={40}
          color={"#3B82F6"}
          stroke={4}
          visible={true}
          speed={1.5}
        />
      </div>
    );

  return (
    <div className="flex min-h-screen bg-gray-50">
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
      </button>

      {/* Sidebar */}
      <aside
        className={`
    fixed md:sticky top-0 left-0 h-screen bg-white shadow-lg transition-all duration-300 
    ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} 
    ${isSidebarCollapsed ? "w-16" : "w-64"}
    md:translate-x-0 // Always show on desktop
  `}
      >
        <DashboardSideBar
          isCollapsed={isSidebarCollapsed}
          setIsCollapsed={setIsSidebarCollapsed}
        />
      </aside>
      <main className="flex-1 transition-all duration-300 py-6 px-4 min-h-screen relative overflow-hidden">
        <div className="max-w-md mx-auto py-16">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-6">
            My Service <span className="text-blue-500">Profile</span>
          </h2>
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  {/* You can add an error icon here */}
                  <svg
                    className="h-5 w-5 text-red-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}
          {successMessage && (
            <div className="bg-green-100 border-l-4 border-green-500 p-4 rounded-md">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  {/* You can add an error icon here */}
                  <svg
                    className="h-5 w-5 text-green-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 00-1.414 0L7 13.586 4.707 11.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l9-9a1 1 0 000-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-green-700">{successMessage}</p>
                </div>
              </div>
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-xl font-semibold mb-4">Basic Information</h3>
              <div className="space-y-4">
                <input
                  name="name"
                  type="text"
                  value={profileData.name}
                  onChange={handleChange}
                  placeholder="Full Name"
                  className="appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
                <input
                  name="email"
                  type="email"
                  value={profileData.email}
                  onChange={handleChange}
                  placeholder="Email"
                  className="appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            {/* Contact Information */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-xl font-semibold mb-4">
                Contact Information
              </h3>
              <div className="space-y-4">
                <input
                  name="phoneNumber"
                  type="tel"
                  value={profileData.phoneNumber}
                  onChange={handleChange}
                  placeholder="Phone Number"
                  className="appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
                <input
                  name="address"
                  type="text"
                  value={profileData.address}
                  onChange={handleChange}
                  placeholder="Business Address"
                  className="appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            {/* Business Information */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-xl font-semibold mb-4">
                Business Information
              </h3>
              <div className="space-y-4">
                <input
                  name="businessName"
                  type="text"
                  value={profileData.businessName}
                  onChange={handleChange}
                  placeholder="Business Name"
                  className="appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
                <select
                  name="serviceType"
                  value={profileData.serviceType}
                  onChange={handleChange}
                  className="appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select Service Type</option>
                  <option value="plumbing">Plumbing</option>
                  <option value="carpentry">Carpentry</option>
                  <option value="cleaning">Cleaning</option>
                  <option value="electrician">Electrician</option>
                </select>
                <input
                  name="experience"
                  type="text"
                  value={profileData.experience}
                  onChange={handleChange}
                  placeholder="Years of Experience"
                  className="appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
                <input
                  name="availability"
                  type="text"
                  value={profileData.availability}
                  onChange={handleChange}
                  placeholder="Availability (e.g., Mon-Fri 9AM-5PM)"
                  className="appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                loading ? "bg-blue-400" : "bg-blue-600 hover:bg-blue-700"
              } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
            >
              {loading ? "Updating..." : "Update Profile"}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
};

export default ServiceSeekerProfile;
