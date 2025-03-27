import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { FaPhone } from "react-icons/fa";

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
      setIsCallLoading((prev) => ({ ...prev, [profile._id]: true }));

      try {
        const confirmCall = window.confirm(
          `Would you like to call ${profile.name} at ${profile.phoneNumber}?`
        );
        if (confirmCall) {
          window.location.href = `tel:${profile.phoneNumber}`;
        }
      } finally {
        setIsCallLoading((prev) => ({ ...prev, [profile._id]: false }));
      }
    } else {
      alert("Phone number is not available for this professional");
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
                <div className="flex items-center space-x-4 mb-4">
                  <img
                    src={profile.profileImage || "/images/profile-picture2.jpg"}
                    alt={profile.name}
                    className="w-16 h-16 rounded-full object-cover"
                    onError={(e) => {
                      e.target.src = "/images/profile-picture2.jpg";
                    }}
                  />
                  <div>
                    <h2 className="text-xl font-semibold">{profile.name}</h2>
                    <p className="text-gray-600">{profile.profession}</p>
                  </div>
                </div>

                {profile.bio && (
                  <p className="text-gray-600 mb-4">{profile.bio}</p>
                )}

                <div className="space-y-2">
                  {profile.location && (
                    <p className="text-gray-600">
                      <strong>Location:</strong> {profile.location}
                    </p>
                  )}
                  {profile.experience && (
                    <p className="text-gray-600">
                      <strong>Experience:</strong> {profile.experience}
                    </p>
                  )}

                  <button
                    onClick={() => setShowContact(!showContact)}
                    className="text-blue-500 text-sm hover:text-blue-600"
                  >
                    {showContact ? "Hide Contact Info" : "Show Contact Info"}
                  </button>

                  {showContact && (
                    <div className="space-y-2">
                      {profile.email && (
                        <p
                          className="text-gray-600 cursor-pointer hover:bg-gray-100 rounded p-1"
                          onClick={() =>
                            copyToClipboard(profile.email, "Email")
                          }
                        >
                          <strong>Email:</strong> {profile.email}
                          {copySuccess && copySuccess.includes("Email") && (
                            <span className="text-green-500 ml-2 text-sm">
                              ✓ Copied!
                            </span>
                          )}
                        </p>
                      )}
                      {profile.phoneNumber && (
                        <p
                          className="text-gray-600 cursor-pointer hover:bg-gray-100 rounded p-1"
                          onClick={() =>
                            copyToClipboard(profile.phoneNumber, "Phone")
                          }
                        >
                          <strong>Phone:</strong> {profile.phoneNumber}
                          {copySuccess && copySuccess.includes("Phone") && (
                            <span className="text-green-500 ml-2 text-sm">
                              ✓ Copied!
                            </span>
                          )}
                        </p>
                      )}
                    </div>
                  )}
                  {profile.businessName && (
                    <p className="text-gray-600">
                      <strong>Business:</strong> {profile.businessName}
                    </p>
                  )}
                  {profile.availability && (
                    <p className="text-gray-600">
                      <strong>Availability:</strong> {profile.availability}
                    </p>
                  )}
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

                <button
                  onClick={() => handleContact(profile)}
                  className={`mt-4 w-full py-2 px-4 rounded transition-colors flex items-center justify-center gap-2 ${
                    profile.phoneNumber
                      ? "bg-blue-500 text-white hover:bg-blue-600"
                      : "bg-gray-300 text-gray-600 cursor-not-allowed"
                  }`}
                  disabled={!profile.phoneNumber || isCallLoading[profile._id]}
                >
                  {isCallLoading[profile._id] ? (
                    <span>Initiating Call...</span>
                  ) : (
                    <>
                      <FaPhone />
                      {profile.phoneNumber
                        ? "Call Professional"
                        : "No Phone Number Available"}
                    </>
                  )}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryProfiles;
