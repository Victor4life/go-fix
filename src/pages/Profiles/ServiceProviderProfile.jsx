import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const ServiceProviderProfile = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    skills: [],
    experience: "",
    hourlyRate: "",
    availability: "",
    contact: {
      email: "",
      phone: "",
    },
    location: "",
  });
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState(null);

  // Data fetching useEffect
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        // Use the API_BASE_URL constant here
        const response = await fetch(`${API_BASE_URL}/provider/profile`, {
          credentials: "include", // Include credentials if needed
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        });
        console.log("API Response:", response);

        if (!response.ok) {
          console.log("Response status:", response.status);
          throw new Error("Failed to fetch profile");
        }

        const data = await response.json();
        console.log("Profile Data:", data);
        setProfile(data);
      } catch (err) {
        console.error("Fetch Error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  useEffect(() => {
    console.log("Current user:", user);
    console.log("Auth loading:", authLoading);

    if (!authLoading && !user) {
      navigate("/login");
      return;
    }
    if (user && user.role !== "provider") {
      navigate("/dashboard");
      toast.error("Access denied. Provider account required.");
      return;
    }
    if (user) {
      setProfile((prevProfile) => ({
        ...prevProfile,
        name: user.name || "",
        email: user.email || "",
        skills: user.skills || [],
        experience: user.experience || "",
        hourlyRate: user.hourlyRate || "",
        availability: user.availability || "",
        contact: {
          email: user.email || "",
          phone: user.contact?.phone || "",
        },
        location: user.location || "",
      }));
      setLoading(false);
    }
  }, [user, authLoading, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setProfile((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value,
        },
      }));
    } else if (name === "skills") {
      const skillsArray = value.split(",").map((skill) => skill.trim());
      setProfile((prev) => ({
        ...prev,
        skills: skillsArray,
      }));
    } else {
      setProfile((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setUpdating(true);
      setError(null);

      // Validation
      const requiredFields = [
        "name",
        "email",
        "skills",
        "experience",
        "hourlyRate",
        "availability",
        "location",
      ];

      for (const field of requiredFields) {
        if (
          !profile[field] ||
          (Array.isArray(profile[field]) && profile[field].length === 0)
        ) {
          throw new Error(
            `${field.charAt(0).toUpperCase() + field.slice(1)} is required`
          );
        }
      }

      if (!profile.contact?.email || !profile.contact?.phone) {
        throw new Error("Contact information is required");
      }

      const response = await fetch(`${API_BASE_URL}/provider/profile`, {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          ...profile,
          role: "provider",
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update profile");
      }

      const updatedProfile = await response.json();
      setProfile(updatedProfile);
      toast.success("Profile updated successfully");
    } catch (error) {
      console.error("Error updating profile:", error);
      setError(error.message);
      toast.error(error.message);
    } finally {
      setUpdating(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (error && !profile.name) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <h2 className="text-red-800 text-xl font-semibold mb-2">
              Error Loading Profile
            </h2>
            <p className="text-red-600">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-lg shadow-md">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-3xl font-bold text-gray-900">
                Service Provider Profile
              </h1>
              {updating && (
                <div className="flex items-center text-blue-600">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-current mr-2"></div>
                  <span className="text-sm">Saving changes...</span>
                </div>
              )}
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={profile.name}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={profile.email}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Skills (comma-separated)
                  </label>
                  <input
                    type="text"
                    name="skills"
                    value={profile.skills.join(", ")}
                    onChange={handleChange}
                    placeholder="e.g., Web Development, React, Node.js"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Experience
                  </label>
                  <input
                    type="text"
                    name="experience"
                    value={profile.experience}
                    onChange={handleChange}
                    placeholder="e.g., 5 years"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Hourly Rate ($)
                  </label>
                  <input
                    type="number"
                    name="hourlyRate"
                    value={profile.hourlyRate}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Availability
                  </label>
                  <select
                    name="availability"
                    value={profile.availability}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  >
                    <option value="">Select availability</option>
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Weekends">Weekends</option>
                    <option value="Flexible">Flexible</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Phone
                  </label>
                  <input
                    type="tel"
                    name="contact.phone"
                    value={profile.contact.phone}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Location
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={profile.location}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              <div className="mt-6">
                <button
                  type="submit"
                  disabled={updating}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300"
                >
                  {updating ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Profile Completion Tips */}
        <div className="mt-8 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">
            Profile Completion Tips
          </h2>
          <ul className="list-disc pl-5 space-y-2 text-gray-600">
            <li>List all your relevant skills and expertise</li>
            <li>Provide detailed information about your experience</li>
            <li>Set a competitive hourly rate</li>
            <li>Specify your availability clearly</li>
            <li>Keep your contact information up to date</li>
            <li>Add your preferred service location</li>
          </ul>
        </div>

        {/* Last Updated Information */}
        {profile.updatedAt && (
          <div className="mt-4 text-right text-sm text-gray-500">
            Last updated: {new Date(profile.updatedAt).toLocaleDateString()}
          </div>
        )}
      </div>
    </div>
  );
};

export default ServiceProviderProfile;
