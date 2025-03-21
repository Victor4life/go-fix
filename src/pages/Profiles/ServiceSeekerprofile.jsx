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
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [imagePreview, setImagePreview] = useState(null);

  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    address: "",
    businessName: "",
    serviceType: "",
    experience: "",
    availability: "",
    profileImage: null,
    imageUrl: "",
  });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileData((prev) => ({
        ...prev,
        profileImage: file,
      }));

      // Create preview URL
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    }
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Add the new useEffect here
  useEffect(() => {
    return () => {
      if (imagePreview && imagePreview.startsWith("blob:")) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

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
          imageUrl: data.profile.profile?.imageUrl || "", // Add this line
        };

        // Set image preview if profile image exists
        if (data.profile.profile?.imageUrl) {
          setImagePreview(data.profile.profile.imageUrl);
        }

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
      // Create FormData to handle file upload
      const formData = new FormData();

      // Append all profile data
      formData.append("username", profileData.name);
      formData.append("email", profileData.email);
      formData.append("phoneNumber", profileData.phoneNumber);
      formData.append("address", profileData.address);
      formData.append("businessName", profileData.businessName);
      formData.append("serviceType", profileData.serviceType);
      formData.append("experience", profileData.experience);
      formData.append("availability", profileData.availability);

      // Append image if exists
      if (profileData.profileImage) {
        formData.append("profileImage", profileData.profileImage);
      }

      const response = await fetch("http://localhost:5000/api/profile", {
        method: "PUT",
        credentials: "include",
        body: formData, // Send FormData instead of JSON
        // Remove Content-Type header - browser will set it automatically with boundary
      });

      const data = await response.json();

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
    <>
      <div className="flex min-h-screen bg-gray-50">
        {/* Mobile Menu Button */}
        <button
          className="md:hidden fixed top-4 left-4 z-50 p-2 rounded-md bg-white shadow-md hover:bg-gray-100 mb-4"
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
                isSidebarOpen
                  ? "M6 18L18 6M6 6l12 12"
                  : "M4 6h16M4 12h16M4 18h16"
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

        <main className="flex-1 transition-all duration-300 py-2 px-4 md:px-30 min-h-screen relative overflow-hidden">
          <div className="w-full py-8">
            <h2 className="text-2xl font-bold mb-6">Profile</h2>
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
            <div>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
                  {/* Profile Picture */}
                  <div className="bg-blue-100 text-blue-800 p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 w-full">
                    <h3 className="text-xl font-semibold mb-4">
                      Profile Image
                    </h3>
                    <div className="space-y-4">
                      {/* Image preview */}
                      <div className="mt-2 justify-center flex">
                        <img
                          src={
                            imagePreview ||
                            profileData.imageUrl ||
                            "/images/profile-picture.png"
                          }
                          alt="Profile"
                          className="w-36 h-36 object-cover rounded-full"
                        />
                      </div>
                      {/* Add this div to show the image preview*/}
                      <div>
                        <label
                          htmlFor="profileImage"
                          className="block text-sm font-medium text-blue-800 mb-1"
                        >
                          Profile Image
                        </label>
                        <input
                          id="profileImage"
                          name="profileImage"
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          className="appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-blue-800 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Basic Information */}
                  <div className="bg-yellow-100 text-yellow-800 p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 w-full">
                    <h3 className="text-xl font-semibold mb-4">
                      Basic Information
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <label
                          htmlFor="name"
                          className="block text-sm font-medium text-yellow-800 mb-1"
                        >
                          Full Name
                        </label>
                        <input
                          id="name"
                          name="name"
                          type="text"
                          value={profileData.name}
                          onChange={handleChange}
                          className="appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-yellow-800 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="email"
                          className="block text-sm font-medium text-yellow-800 mb-1"
                        >
                          Email
                        </label>
                        <input
                          id="email"
                          name="email"
                          type="email"
                          value={profileData.email}
                          onChange={handleChange}
                          className="appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-yellow-800 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    </div>
                  </div>
                  {/* Contact Information */}
                  <div className="bg-green-100 text-green-800 p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 w-full">
                    <h3 className="text-xl font-semibold mb-4">
                      Contact Information
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <label
                          htmlFor="phoneNumber"
                          className="block text-sm font-medium text-green-800 mb-1"
                        >
                          Phone Number
                        </label>
                        <input
                          id="phoneNumber"
                          name="phoneNumber"
                          type="tel"
                          value={profileData.phoneNumber}
                          onChange={handleChange}
                          className="appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-green-800 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="address"
                          className="block text-sm font-medium text-green-800 mb-1"
                        >
                          Business Address
                        </label>
                        <input
                          id="address"
                          name="address"
                          type="text"
                          value={profileData.address}
                          onChange={handleChange}
                          className="appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-green-800 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    </div>
                  </div>
                  {/* Business Information */}
                  <div className="bg-purple-100 text-purple-800 p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 w-full">
                    <h3 className="text-xl font-semibold mb-4">
                      Business Information
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <label
                          htmlFor="businessName"
                          className="block text-sm font-medium text-purple-800 mb-1"
                        >
                          Business Name
                        </label>
                        <input
                          id="businessName"
                          name="businessName"
                          type="text"
                          value={profileData.businessName}
                          onChange={handleChange}
                          className="appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-purple-800 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="serviceType"
                          className="block text-sm font-medium text-purple-800 mb-1"
                        >
                          Service Type
                        </label>
                        <select
                          id="serviceType"
                          name="serviceType"
                          value={profileData.serviceType}
                          onChange={handleChange}
                          className="appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-purple-800 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="">Select Service Type</option>
                          <option value="plumbing">Plumbing</option>
                          <option value="carpentry">Carpentry</option>
                          <option value="cleaning">Cleaning</option>
                          <option value="electrician">Electrician</option>
                        </select>
                      </div>
                      <div>
                        <label
                          htmlFor="experience"
                          className="block text-sm font-medium text-purple-800 mb-1"
                        >
                          Years of Experience
                        </label>
                        <input
                          id="experience"
                          name="experience"
                          type="text"
                          value={profileData.experience}
                          onChange={handleChange}
                          className="appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-purple-800 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="availability"
                          className="block text-sm font-medium text-purple-800 mb-1"
                        >
                          Availability
                        </label>
                        <input
                          id="availability"
                          name="availability"
                          type="text"
                          value={profileData.availability}
                          onChange={handleChange}
                          placeholder="e.g., Mon-Fri 9AM-5PM"
                          className="appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-purple-800 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                {/* Submit Button */}
                <div className="mt-6">
                  <button
                    type="submit"
                    disabled={loading}
                    className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                      loading ? "bg-blue-400" : "bg-blue-600 hover:bg-blue-700"
                    } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
                  >
                    {loading ? "Updating..." : "Update Profile"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default ServiceSeekerProfile;
