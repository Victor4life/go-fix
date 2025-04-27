import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const SignupForm = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  // Add these with your other useState declarations
  const [imagePreview, setImagePreview] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phoneNumber: "",
    address: "",
    businessName: "",
    serviceType: "",
    experience: "",
    availability: "",
    profileImage: null, // Add this line
  });

  const validateFormData = (data) => {
    const requiredFields = [
      "username",
      "email",
      "password",
      "phoneNumber",
      "address",
      "businessName",
      "serviceType",
      "experience",
      "availability",
      "role",
    ];

    const missingFields = requiredFields.filter((field) => !data[field]);

    if (missingFields.length > 0) {
      toast.error(
        <div className="flex items-center space-x-2">
          <span className="text-lg">⚠️</span>
          <div>
            <p className="font-medium">Required fields missing</p>
            <p className="text-sm opacity-90">
              Please fill in all required fields
            </p>
          </div>
        </div>,
        {
          position: "top-right",
          autoClose: 4000,
          className: "bg-red-500 text-white",
        }
      );
      return false;
    }
    if (!data.profileImage) {
      toast.error(
        <div className="flex items-center space-x-2">
          <span className="text-lg">⚠️</span>
          <p className="font-medium">Profile image is required</p>
        </div>,
        {
          position: "top-right",
          autoClose: 4000,
          className: "bg-red-500 text-white",
        }
      );
      return false;
    }
    return true;
  };

  // Add this with your other handler functions
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear any existing errors when user starts typing
    if (error) {
      setError("");
    }
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const loadingToastId = toast.loading(
        <div className="flex items-center space-x-2">
          <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
          <span>Uploading image...</span>
        </div>,
        {
          position: "top-right",
        }
      );

      try {
        const formData = new FormData();
        formData.append("image", file);

        console.log("Attempting to upload file:", {
          name: file.name,
          type: file.type,
          size: file.size,
        });

        const response = await fetch("http://localhost:5000/api/upload", {
          method: "POST",
          credentials: "include",
          body: formData,
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Upload failed: ${errorText}`);
        }

        const data = await response.json();
        if (data.success) {
          setFormData((prev) => ({
            ...prev,
            profileImage: data.imageUrl,
          }));
          setImagePreview(data.imageUrl);

          toast.update(loadingToastId, {
            render: (
              <div className="flex items-center space-x-2">
                <span className="text-lg">✨</span>
                <p className="font-medium">Image uploaded successfully</p>
              </div>
            ),
            type: "success",
            isLoading: false,
            autoClose: 3000,
            className: "bg-green-500 text-white",
          });
        }
      } catch (error) {
        console.error("Upload error:", error);

        toast.update(loadingToastId, {
          render: (
            <div className="flex items-center space-x-2">
              <span className="text-lg">❌</span>
              <div>
                <p className="font-medium">Failed to upload image</p>
                <p className="text-sm opacity-90">Please try again</p>
              </div>
            </div>
          ),
          type: "error",
          isLoading: false,
          autoClose: 4000,
          className: "bg-red-500 text-white",
        });

        setError("Failed to upload image. Please try again.");
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Show loading toast
    const loadingToastId = toast.loading(
      <div className="flex items-center space-x-2">
        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
        <span>Creating your account...</span>
      </div>,
      {
        position: "top-right",
      }
    );

    try {
      // First check if passwords match
      if (formData.password !== formData.confirmPassword) {
        toast.update(loadingToastId, {
          render: (
            <div className="flex items-center space-x-2">
              <span className="text-lg">⚠️</span>
              <p className="font-medium">Passwords do not match</p>
            </div>
          ),
          type: "error",
          isLoading: false,
          autoClose: 4000,
          className: "bg-red-500 text-white",
        });
        setError("Passwords do not match");
        return;
      }

      const formDataToSend = {
        username: formData.name,
        email: formData.email,
        password: formData.password,
        phoneNumber: formData.phoneNumber,
        address: formData.address,
        businessName: formData.businessName,
        serviceType: formData.serviceType,
        experience: formData.experience,
        availability: formData.availability,
        role: "provider",
        profileImage: formData.profileImage,
      };

      // Validate the data before sending
      if (!validateFormData(formDataToSend)) {
        toast.update(loadingToastId, {
          render: (
            <div className="flex items-center space-x-2">
              <span className="text-lg">⚠️</span>
              <p className="font-medium">Please fill in all required fields</p>
            </div>
          ),
          type: "error",
          isLoading: false,
          autoClose: 4000,
          className: "bg-red-500 text-white",
        });
        setError("Please fill in all required fields");
        return;
      }

      console.log("Sending data:", JSON.stringify(formDataToSend, null, 2));

      const response = await fetch("http://localhost:5000/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formDataToSend),
      });

      const data = await response.json();
      console.log("Complete server response:", data);

      if (data.success === false && data.message === "User already exists") {
        toast.update(loadingToastId, {
          render: (
            <div className="flex items-center space-x-2">
              <span className="text-lg">⚠️</span>
              <div>
                <p className="font-medium">Account already exists</p>
                <p className="text-sm opacity-90">
                  Please use a different email
                </p>
              </div>
            </div>
          ),
          type: "error",
          isLoading: false,
          autoClose: 4000,
          className: "bg-red-500 text-white",
        });
        setError(
          "An account with this email already exists. Please use a different email address."
        );
        setFormData((prev) => ({
          ...prev,
          email: "", // Clear the email field
        }));
        return;
      }

      if (!response.ok) {
        throw new Error(data.message || "Failed to create account");
      }

      // If we get here, the signup was successful
      console.log("Signup successful, redirecting to login...");

      toast.update(loadingToastId, {
        render: (
          <div className="flex items-center space-x-2">
            <span className="text-lg">🎉</span>
            <div>
              <p className="font-medium">Account created successfully!</p>
              <p className="text-sm opacity-90">Redirecting to login...</p>
            </div>
          </div>
        ),
        type: "success",
        isLoading: false,
        autoClose: 3000,
        className: "bg-green-500 text-white",
      });

      // Wait for toast to be visible before redirecting
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      console.error("Full error details:", {
        message: err.message,
        stack: err.stack,
      });

      toast.update(loadingToastId, {
        render: (
          <div className="flex items-center space-x-2">
            <span className="text-lg">❌</span>
            <div>
              <p className="font-medium">Failed to create account</p>
              <p className="text-sm opacity-90">
                {err.message || "Please try again"}
              </p>
            </div>
          </div>
        ),
        type: "error",
        isLoading: false,
        autoClose: 4000,
        className: "bg-red-500 text-white",
      });

      setError(err.message || "Network error or server not responding");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen bg-gray-50">
      <div className="py-12 relative">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="w-full max-w-md bg-white shadow-lg rounded-lg mx-auto p-8">
            <div>
              <h1 className="text-xl font-extrabold text-blue-800 text-center mb-2 tracking-tight">
                Hello Artisan👋
              </h1>
              <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                Create your service provider account
              </h2>
            </div>{" "}
            <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
              <div className="rounded-md shadow-sm space-y-2">
                {/* Basic Information */}
                <input
                  name="name"
                  type="text"
                  required
                  className="appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                  placeholder="Full Name"
                  value={formData.name}
                  onChange={handleChange}
                />

                <input
                  name="email"
                  type="email"
                  required
                  className="appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                  placeholder="Email address"
                  value={formData.email}
                  onChange={handleChange}
                />

                <div className="relative">
                  <input
                    name="password"
                    type={showPassword ? "text" : "password"}
                    required
                    className="appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-5 h-5 text-gray-500"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"
                        />
                      </svg>
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-5 h-5 text-gray-500"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                    )}
                  </button>
                </div>

                <div className="relative">
                  <input
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    required
                    className="appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                    placeholder="Confirm Password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-5 h-5 text-gray-500"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"
                        />
                      </svg>
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-5 h-5 text-gray-500"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                    )}
                  </button>
                </div>

                {/* Contact Information */}
                <input
                  name="phoneNumber"
                  type="tel"
                  required
                  className="appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                  placeholder="Phone Number"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                />

                <select
                  name="address"
                  required
                  className="appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                  value={formData.address}
                  onChange={handleChange}
                >
                  <option value="">Select Location</option>
                  <option value="agege">Agege</option>
                  <option value="ajeromi_ifelodun">Ajeromi-Ifelodun</option>
                  <option value="alimosho">Alimosho</option>
                  <option value="amuwo_odofin">Amuwo-Odofin</option>
                  <option value="apapa">Apapa</option>
                  <option value="badagry">Badagry</option>
                  <option value="epe">Epe</option>
                  <option value="eti_osa">Eti-Osa</option>
                  <option value="ibeju_lekki">Ibeju-Lekki</option>
                  <option value="ifako_ijaiye">Ifako-Ijaiye</option>
                  <option value="ikeja">Ikeja</option>
                  <option value="ikorodu">Ikorodu</option>
                  <option value="kosofe">Kosofe</option>
                  <option value="lagos_island">Lagos Island</option>
                  <option value="lagos_mainland">Lagos Mainland</option>
                  <option value="mushin">Mushin</option>
                  <option value="ojo">Ojo</option>
                  <option value="oshodi_isolo">Oshodi-Isolo</option>
                  <option value="shomolu">Shomolu</option>
                  <option value="surulere">Surulere</option>
                </select>

                {/* Business Information */}
                <input
                  name="businessName"
                  type="text"
                  required
                  className="appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                  placeholder="Business Name"
                  value={formData.businessName}
                  onChange={handleChange}
                />

                <select
                  name="serviceType"
                  required
                  className="appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                  value={formData.serviceType}
                  onChange={handleChange}
                >
                  <option value="">Select Category</option>
                  <option value="ac-technician">AC Technician</option>
                  <option value="barber">Barber</option>
                  <option value="carpenter">Carpenter</option>
                  <option value="cleaner">Cleaner</option>
                  <option value="electrician">Electrician</option>
                  <option value="gardener">Gardener</option>
                  <option value="hairdresser">Hairdresser</option>
                  <option value="handyman">Handyman</option>
                  <option value="interior-decorator">Interior Decorator</option>
                  <option value="mechanic">Mechanic</option>
                  <option value="painter">Painter</option>
                  <option value="plumber">Plumber</option>
                  <option value="security">Security Guard</option>
                  <option value="tailor">Tailor</option>
                  <option value="tiler">Tiler</option>
                </select>

                <input
                  name="experience"
                  type="text"
                  required
                  className="appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                  placeholder="Years of Experience"
                  value={formData.experience}
                  onChange={handleChange}
                />

                <input
                  name="availability"
                  type="text"
                  required
                  className="appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                  placeholder="Availability (e.g., Mon-Fri 9AM-5PM)"
                  value={formData.availability}
                  onChange={handleChange}
                />
              </div>
              {/* Image upload section */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Profile Image <span className="text-red-500">*</span>
                </label>
                <div className="mt-1 flex items-center gap-4">
                  <input
                    type="file"
                    name="profileImage"
                    onChange={handleImageChange}
                    accept="image/*"
                    className="hidden"
                    id="imageUpload"
                    required
                  />
                  <label
                    htmlFor="imageUpload"
                    className="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                  >
                    Upload Photo
                  </label>
                  {imagePreview && (
                    <div className="h-16 w-16 rounded-full overflow-hidden">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="h-full w-full object-cover"
                      />
                    </div>
                  )}
                  {!imagePreview && (
                    <p className="text-sm text-red-500">
                      Please upload a profile image
                    </p>
                  )}
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className={`group relative w-full flex justify-center py-3 px-4 border border-transparent 
                rounded-lg shadow-sm text-sm font-medium text-white 
                ${loading ? "bg-blue-400" : "bg-blue-600 hover:bg-blue-700"} 
                focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 
                transition-all duration-150 ease-in-out`}
                >
                  {loading ? (
                    <span className="flex items-center">
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Creating Account...
                    </span>
                  ) : (
                    <span className="flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 mr-2"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                      Sign up
                    </span>
                  )}
                </button>
              </div>

              <div className="text-sm text-center">
                <a
                  href="/login"
                  className="font-medium text-blue-600 hover:text-blue-500"
                >
                  Already have an account? Sign in
                </a>
              </div>
            </form>
          </div>
          <div className="min-h-screen relative flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            {/* Your existing JSX */}

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
        </div>
      </div>
    </section>
  );
};

export default SignupForm;
