import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { FaBell, FaPhone } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const CategoryProfiles = () => {
  const { categoryName } = useParams();
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [showContactModal, setShowContactModal] = useState(false);
  const [contactMessage, setContactMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [filterBy, setFilterBy] = useState({
    location: "",
    experience: "",
    availability: "",
  });
  const [copySuccess, setCopySuccess] = useState("");
  const [showContact, setShowContact] = useState({});
  const [isCallLoading, setIsCallLoading] = useState({});
  const [isNotifying, setIsNotifying] = useState({});

  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        setLoading(true);
        // Make the categoryName lowercase to match backend format
        const formattedCategory = categoryName.toLowerCase();
        const response = await axios.get(
          `http://localhost:5000/api/profiles/${formattedCategory}`
        );

        if (response.data.success) {
          setProfiles(response.data.data); // Access the data array from the response
        } else {
          setError("No profiles found");
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching profiles:", error);
        setError(
          error.response?.data?.message ||
            "Failed to load profiles. Please try again later."
        );
        setLoading(false);
      }
    };

    fetchProfiles();
  }, [categoryName]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-500 text-center">
          <p>{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Add this function to handle sorting and filtering
  const getSortedAndFilteredProfiles = () => {
    let filteredProfiles = [...profiles];

    // Apply filters
    if (filterBy.location) {
      filteredProfiles = filteredProfiles.filter((profile) =>
        profile.location
          ?.toLowerCase()
          .includes(filterBy.location.toLowerCase())
      );
    }
    if (filterBy.experience) {
      filteredProfiles = filteredProfiles.filter((profile) =>
        profile.experience
          ?.toLowerCase()
          .includes(filterBy.experience.toLowerCase())
      );
    }
    if (filterBy.availability) {
      filteredProfiles = filteredProfiles.filter((profile) =>
        profile.availability
          ?.toLowerCase()
          .includes(filterBy.availability.toLowerCase())
      );
    }

    // Apply sorting
    return filteredProfiles.sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name);
        case "experience":
          return (b.experience || "").localeCompare(a.experience || "");
        case "location":
          return (a.location || "").localeCompare(b.location || "");
        default:
          return 0;
      }
    });
  };

  // Add this function to handle search
  const getSearchedProfiles = (profiles) => {
    if (!searchQuery) return profiles;

    return profiles.filter(
      (profile) =>
        profile.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        profile.businessName
          ?.toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        profile.skills?.some((skill) =>
          skill.toLowerCase().includes(searchQuery.toLowerCase())
        )
    );
  };

  // Add this ContactModal component
  const ContactModal = ({ profile, onClose, onSubmit }) => {
    const [message, setMessage] = useState("");

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg p-6 max-w-md w-full">
          <h2 className="text-xl font-semibold mb-4">Contact {profile.name}</h2>
          <textarea
            className="w-full p-2 border rounded-lg mb-4 h-32"
            placeholder="Type your message here..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <div className="flex justify-end space-x-2">
            <button
              className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              onClick={() => onSubmit(message)}
            >
              Send Message
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Add these functions to handle contact
  // Update the handleContact function
  const handleContact = async (profile) => {
    if (profile.phoneNumber) {
      // Show loading toast
      const loadingToastId = toast.loading(
        <div className="flex items-center space-x-2">
          <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
          <span>Initiating call...</span>
        </div>,
        {
          position: "top-right",
        }
      );

      setIsCallLoading((prev) => ({ ...prev, [profile._id]: true }));

      try {
        const confirmCall = window.confirm(
          `Would you like to call ${profile.name} at ${profile.phoneNumber}?`
        );

        if (confirmCall) {
          window.location.href = `tel:${profile.phoneNumber}`;

          // Update loading toast to success
          toast.update(loadingToastId, {
            render: (
              <div className="flex items-center space-x-2">
                <span className="text-lg">📞</span>
                <div>
                  <p className="font-medium">Connecting your call</p>
                  <p className="text-sm opacity-90">Redirecting to phone...</p>
                </div>
              </div>
            ),
            type: "success",
            isLoading: false,
            autoClose: 3000,
            className: "bg-green-500 text-white",
          });
        } else {
          // User cancelled the call
          toast.update(loadingToastId, {
            render: (
              <div className="flex items-center space-x-2">
                <span className="text-lg">❌</span>
                <p className="font-medium">Call cancelled</p>
              </div>
            ),
            type: "info",
            isLoading: false,
            autoClose: 2000,
            className: "bg-slate-500 text-white",
          });
        }
      } catch (error) {
        console.error("Error initiating call:", error);
        toast.update(loadingToastId, {
          render: (
            <div className="flex items-center space-x-2">
              <span className="text-lg">❌</span>
              <div>
                <p className="font-medium">Failed to initiate call</p>
                <p className="text-sm opacity-90">Please try again</p>
              </div>
            </div>
          ),
          type: "error",
          isLoading: false,
          autoClose: 5000,
          className: "bg-red-500 text-white",
        });
      } finally {
        setIsCallLoading((prev) => ({ ...prev, [profile._id]: false }));
      }
    } else {
      // No phone number available
      toast.error(
        <div className="flex items-center space-x-2">
          <span className="text-lg">📱</span>
          <p className="font-medium">Phone number not available</p>
        </div>,
        {
          position: "top-right",
          autoClose: 4000,
          className: "bg-orange-500 text-white",
        }
      );
    }
  };

  const handleContactSubmit = async (message) => {
    try {
      // Add your API call here to send the message
      await axios.post("http://localhost:5000/api/messages", {
        recipientId: selectedProfile._id,
        message: message,
      });

      setShowContactModal(false);
      setSelectedProfile(null);
      // Show success message
      alert("Message sent successfully!");
    } catch (error) {
      console.error("Error sending message:", error);
      alert("Failed to send message. Please try again.");
    }
  };

  const copyToClipboard = (text, field) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        setCopySuccess(`${field} copied!`);
        setTimeout(() => setCopySuccess(""), 2000);
      })
      .catch((err) => console.error("Failed to copy:", err));
  };

  const handleServiceRequest = async (profile) => {
    // Show loading toast
    const loadingToastId = toast.loading(
      <div className="flex items-center space-x-2 bg-green-500 text-white p-2 rounded">
        <span className="text-lg">🔔</span>
        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
        <span>Sending service request...</span>
      </div>,
      {
        position: "top-right",
      }
    );

    try {
      setIsNotifying((prev) => ({ ...prev, [profile._id]: true }));

      const response = await axios.post(
        "http://localhost:5000/api/service-requests/notify",
        {
          professionalId: profile._id,
          professionalEmail: profile.email,
          serviceName: profile.profession,
          professionalName: profile.name,
        }
      );

      if (response.data.success) {
        // Update loading toast to success
        toast.update(loadingToastId, {
          render: (
            <div className="flex items-center space-x-2">
              <span className="text-lg">🎉</span>
              <div>
                <p className="font-medium">Service request sent!</p>
                <p className="text-sm opacity-90">
                  Professional will be notified
                </p>
              </div>
            </div>
          ),
          type: "success",
          isLoading: false,
          autoClose: 5000,
          className: "bg-green-500 text-white",
        });
      }
    } catch (error) {
      console.error("Error sending service request:", error);
      toast.update(loadingToastId, {
        render: (
          <div className="flex items-center space-x-2">
            <span className="text-lg">❌</span>
            <div>
              <p className="font-medium">Failed to send request</p>
              <p className="text-sm opacity-90">Please try again</p>
            </div>
          </div>
        ),
        type: "error",
        isLoading: false,
        autoClose: 5000,
        className: "bg-red-500 text-white",
      });
    } finally {
      setIsNotifying((prev) => ({ ...prev, [profile._id]: false }));
    }
  };

  const getCloudinaryUrl = (publicId, options = {}) => {
    const {
      width = 200,
      height = 200,
      crop = "fill",
      gravity = "face",
      quality = "auto",
    } = options;

    return publicId
      ? `https://res.cloudinary.com/dcsvesl4j/image/upload/c_${crop},g_${gravity},h_${height},w_${width},q_${quality}/${publicId}`
      : "/images/profile-picture2.jpg";
  };

  return (
    <div className="min-h-screen bg-gray-100 px-4 md:px-8 lg:px-16 py-8 md:py-16">
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 capitalize">
          {categoryName} Professionals
        </h1>

        {profiles.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-600">
              No professionals found in this category yet.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {profiles.map((profile) => (
              <div
                key={profile._id}
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-all duration-300"
              >
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 rounded-lg shadow-lg mb-4">
                  <div className="flex items-center space-x-6">
                    <div className="relative">
                      <img
                        src={getCloudinaryUrl(profile.profileImage, {
                          width: 64,
                          height: 64,
                        })}
                        srcSet={`
          ${getCloudinaryUrl(profile.profileImage, {
            width: 64,
            height: 64,
          })} 1x,
          ${getCloudinaryUrl(profile.profileImage, {
            width: 128,
            height: 128,
          })} 2x
        `}
                        alt={profile.name}
                        className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-md"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "/images/profile-picture2.jpg";
                        }}
                      />
                    </div>
                    <div className="text-white">
                      <h2 className="text-2xl font-bold tracking-wide mb-1">
                        {profile.name}
                      </h2>
                      <p className="text-blue-100 font-medium">
                        {profile.profession}
                      </p>
                    </div>
                  </div>
                </div>

                {profile.bio && (
                  <p
                    className="text-gray-700 mb-6 leading-relaxed font-medium tracking-wide px-6 rounded-xl 
  first-letter:text-3xl first-letter:font-bold first-letter:text-blue-600 first-letter:mr-1
  animate-fade-in selection:bg-blue-100 selection:text-blue-800"
                  >
                    Hi I am {profile.name} a {profile.profession} with{" "}
                    {profile.experience} years of experience. I am based in{" "}
                    {profile.location}. I am available for{" "}
                    {profile.availability}. I look forward to work with you.
                  </p>
                )}

                <div className="px-3">
                  {/* Profile Details Section */}
                  <div>
                    {profile.location && (
                      <div className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-50 transition-colors">
                        <i className="fas fa-map-marker-alt text-blue-500"></i>
                        <p className="text-gray-700">
                          <span className="font-semibold">Location:</span>{" "}
                          <span className="text-gray-600">
                            {profile.location}
                          </span>
                        </p>
                      </div>
                    )}

                    {profile.experience && (
                      <div className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-50 transition-colors">
                        <i className="fas fa-briefcase text-blue-500"></i>
                        <p className="text-gray-700">
                          <span className="font-semibold">Experience:</span>{" "}
                          <span className="text-gray-600">
                            {profile.experience} years
                          </span>
                        </p>
                      </div>
                    )}

                    {/* Contact Button */}
                    <button
                      onClick={() => setShowContact(!showContact)}
                      className="w-full mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg
        hover:bg-blue-600 active:bg-blue-700 transform hover:-translate-y-0.5
        transition-all duration-200 font-medium flex items-center justify-center space-x-2"
                    >
                      <i
                        className={`fas ${
                          showContact ? "fa-eye-slash" : "fa-eye"
                        }`}
                      ></i>
                      <span>
                        {showContact
                          ? "Hide Contact Info"
                          : "Show Contact Info"}
                      </span>
                    </button>

                    {/* Contact Information */}
                    {showContact && (
                      <div className="space-y-3 mt-4 p-4 bg-gray-50 rounded-lg border border-gray-100">
                        {profile.email && (
                          <div
                            className="flex items-center space-x-2 p-3 rounded-lg bg-white
              hover:bg-blue-50 cursor-pointer transition-all duration-200
              border border-gray-100 hover:border-blue-200"
                            onClick={() =>
                              copyToClipboard(profile.email, "Email")
                            }
                          >
                            <i className="fas fa-envelope text-blue-500"></i>
                            <p className="text-gray-700 flex-grow">
                              <span className="font-semibold">Email:</span>{" "}
                              <span className="text-gray-600">
                                {profile.email}
                              </span>
                            </p>
                            {copySuccess && copySuccess.includes("Email") ? (
                              <span className="text-green-500 text-sm flex items-center">
                                <i className="fas fa-check mr-1"></i> Copied
                              </span>
                            ) : (
                              <span className="hidden text-gray-400 text-sm">
                                Click to copy
                              </span>
                            )}
                          </div>
                        )}

                        {profile.phoneNumber && (
                          <div
                            className="flex items-center space-x-2 p-3 rounded-lg bg-white
              hover:bg-blue-50 cursor-pointer transition-all duration-200
              border border-gray-100 hover:border-blue-200"
                            onClick={() =>
                              copyToClipboard(profile.phoneNumber, "Phone")
                            }
                          >
                            <i className="fas fa-phone text-blue-500"></i>
                            <p className="text-gray-700 flex-grow">
                              <span className="font-semibold">Phone:</span>{" "}
                              <span className="text-gray-600">
                                {profile.phoneNumber}
                              </span>
                            </p>
                            {copySuccess && copySuccess.includes("Phone") ? (
                              <span className="text-green-500 text-sm flex items-center">
                                <i className="fas fa-check mr-1"></i> Copied
                              </span>
                            ) : (
                              <span className="hidden text-gray-400 text-sm">
                                Click to copy
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Business Details */}
                    {profile.businessName && (
                      <div className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-50 transition-colors">
                        <i className="fas fa-building text-blue-500"></i>
                        <p className="text-gray-700">
                          <span className="font-semibold">Business:</span>{" "}
                          <span className="text-gray-600">
                            {profile.businessName}
                          </span>
                        </p>
                      </div>
                    )}

                    {profile.availability && (
                      <div className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-50 transition-colors">
                        <i className="fas fa-clock text-blue-500"></i>
                        <p className="text-gray-700">
                          <span className="font-semibold">Availability:</span>{" "}
                          <span className="text-gray-600">
                            {profile.availability}
                          </span>
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {profile.skills && profile.skills.length > 0 && (
                  <div className="mt-4">
                    <p className="font-semibold mb-2">Skills:</p>
                    <div className="flex flex-wrap gap-2">
                      {profile.skills.map((skill, index) => (
                        <span
                          key={index}
                          className="bg-blue-100 text-blue-800 text-sm px-2 py-1 rounded"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                <div className="flex flex-col gap-3">
                  <button
                    onClick={() => handleContact(profile)}
                    className={`group relative py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-3 shadow-sm ${
                      profile.phoneNumber
                        ? "bg-blue-500 text-white hover:bg-blue-600 hover:shadow-md"
                        : "bg-gray-200 text-gray-500 cursor-not-allowed"
                    }`}
                    disabled={
                      !profile.phoneNumber || isCallLoading[profile._id]
                    }
                  >
                    <FaPhone
                      className={`text-lg ${
                        isCallLoading[profile._id] ? "animate-pulse" : ""
                      }`}
                    />
                    <span className="font-medium">
                      {isCallLoading[profile._id] ? (
                        <div className="flex items-center gap-2">
                          <span>Initiating Call</span>
                          <span className="animate-pulse">...</span>
                        </div>
                      ) : profile.phoneNumber ? (
                        "Call Professional"
                      ) : (
                        "No Phone Number Available"
                      )}
                    </span>
                  </button>

                  <button
                    className={`group relative py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-3 shadow-sm ${
                      isNotifying[profile._id]
                        ? "bg-gray-400 cursor-wait"
                        : "bg-blue-700 hover:bg-blue-800 hover:shadow-md"
                    } text-white`}
                    onClick={() => handleServiceRequest(profile)}
                    disabled={isNotifying[profile._id]}
                  >
                    <FaBell
                      className={`text-lg ${
                        isNotifying[profile._id] ? "animate-pulse" : ""
                      }`}
                    />
                    <span className="font-medium">
                      {isNotifying[profile._id] ? (
                        <div className="flex items-center gap-2">
                          <span>Sending Request</span>
                          <span className="animate-pulse">...</span>
                        </div>
                      ) : (
                        "Request Service"
                      )}
                    </span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        toastClassName={() =>
          "relative flex p-1 min-h-10 rounded-lg justify-between overflow-hidden cursor-pointer mb-4"
        }
        bodyClassName={() => "text-sm font-white font-medium block p-3"}
      />
    </div>
  );
};

export default CategoryProfiles;
