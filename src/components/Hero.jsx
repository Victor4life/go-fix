import React, { useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
const Hero = () => {
  const {
    loginWithPopup,
    isAuthenticated,
    isLoading: authLoading,
  } = useAuth0();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      if (!isAuthenticated) {
        setIsLoading(true);
        await loginWithPopup();
        setIsLoading(false);
        return;
      }

      const formData = new FormData(e.target);
      const searchData = {
        address: formData.get("address"),
        city: formData.get("city"),
        category: formData.get("category"),
      };

      // Validate form data
      if (!searchData.address || !searchData.city || !searchData.category) {
        toast.error("Please fill in all fields");
        return;
      }

      setIsLoading(true);
      console.log("Search data:", searchData);
      toast.success("Search successful!");
      // Add your search implementation here
    } catch (error) {
      toast.error(error.message || "An error occurred. Please try again.");
      setError(error.message || "An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="bg-white overflow-hidden relative pt-16">
      {/* Blob Background */}
      <div
        className="absolute bottom-0 right-0 w-[300px] h-[300px] translate-x-1/4 translate-y-1/4"
        style={{
          background:
            "linear-gradient(135deg, rgba(0, 0, 255, 0.7), rgba(0, 0, 255, 0.3))",
          borderRadius: "60% 40% 30% 70% / 60% 30% 70% 40%",
          boxShadow:
            "inset 5px 10px 15px rgba(0, 0, 255, 0.2), 10px 15px 30px rgba(0, 0, 255, 0.3)",
          backdropFilter: "blur(8px)",
        }}
      />
      <div
        className="absolute top-0 right-0 w-[100px] h-[150px] translate-x-1/4 -translate-y-1/4"
        style={{
          background:
            "linear-gradient(135deg, rgba(178, 178, 188, 0.7), rgba(229, 229, 242, 0.3))",
          borderRadius: "60% 40% 30% 70% / 60% 30% 70% 40%",
          boxShadow:
            "inset 5px 10px 15px rgba(229, 229, 245, 0.2), 10px 15px 30px rgba(222, 222, 253, 0.3)",
          backdropFilter: "blur(8px)",
          animation: "blobsAnimation 8s infinite",
        }}
      />
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      {/* Content Section */}
      <div className="flex flex-col lg:flex-row flex-1 justify-between mx-auto px-4 lg:px-14 py-8 lg:py-10 gap-8 relative">
        <div className="lg:w-1/2 xl:p-4">
          {/*Vector*/}
          <div className="relative w-full">
            <img
              src="/go-fix/images/hero-vector.png"
              alt=""
              className="w-10 h-10 absolute z-1 left-0 -top-10 animate-float"
            />
            <img
              src="/go-fix/images/hero-vector-2.png"
              alt=""
              className="w-10 h-10 absolute z-1 top-10 right-0 animate-float [animation-delay:2s]"
            />
          </div>
          <h1 className="text-4xl lg:text-7xl font-extrabold text-gray-900 leading-tight tracking-tight">
            Hire Experts and Get Your Job Done.
          </h1>
          <p className="text-gray-800 pt-8 text-lg leading-relaxed">
            Connect with skilled professionals and get your projects done
            efficiently. Our platform matches you with verified experts who can
            deliver quality results on time.
          </p>
          <form
            onSubmit={handleSearch}
            className="flex flex-col md:flex-row flex-1 gap-4 p-4 rounded-md shadow-xl max-w-6xl mx-auto w-full"
          >
            <input
              type="text"
              placeholder="Enter Your Address"
              className="py-3 px-1 rounded-md flex-1 w-full md:w-auto border hover:border-blue-500 
    focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 cursor-pointer"
            />
            <select
              name="city"
              className="p-3 text-base rounded-md w-full border border-gray-200 cursor-pointer
    appearance-none bg-white
    hover:border-blue-500 
    focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200
    bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23007CB2%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E')] 
    bg-no-repeat bg-right-0.5 bg-[length:8px] pr-8"
            >
              <option value="">City</option>
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
            <select
              name="category"
              className="p-3 text-base rounded-md w-full border border-gray-200 cursor-pointer
    appearance-none bg-white
    hover:border-blue-500 
    focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200
    bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23007CB2%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E')] 
    bg-no-repeat bg-right-0.5 bg-[length:8px] pr-8"
            >
              <option value="">Category</option>
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
            <button
              type="submit"
              disabled={isLoading || authLoading}
              className={`p-3 rounded-md bg-blue-500 text-white hover:bg-blue-600 border-2 border-blue-400 w-full md:w-auto transition duration-300 ease-in-out transform hover:scale-105 ${
                isLoading || authLoading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {isLoading || authLoading ? (
                <span className="flex items-center justify-center">
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
                  Processing...
                </span>
              ) : (
                "Search"
              )}
            </button>{" "}
          </form>
        </div>

        {/* Image Section */}
        <div className="lg:w-1/2">
          <div className="relative flex items-center justify-center h-full">
            {/* Centered Lottie container */}
            <div className="relative w-full min-h-[400px] flex items-center justify-center overflow-hidden">
              {/* Main Animation Container */}
              <div
                className="relative w-[65%] aspect-square 
    animate-float-slow transform-gpu hover:scale-105 transition-all duration-700
    rounded-3xl p-8 hidden md:block"
              >
                {/* First Animation */}
                {/*<div className="absolute inset-0 filter drop-shadow-2xl z-10 scale-110">
                  <DotLottieReact
                    src="https://lottie.host/faf02d8b-207c-4a38-b27a-ed061f68ae95/z8rDfCzgwP.lottie"
                    loop
                    autoplay
                    className="w-full h-full translate-y-8 scale-90" // Added translation
                    style={{
                      filter: "drop-shadow(0 20px 30px rgba(0,0,0,0.15))",
                    }}
                  />
                </div>*/}

                {/* Second Animation */}
                <div className="absolute inset-0 mix-blend-overlay opacity-90 z-20 scale-95">
                  <DotLottieReact
                    src="https://lottie.host/14886e02-c529-408a-abfd-34ce1991432f/vZI3uHTZVl.lottie"
                    loop
                    autoplay
                    className="w-full h-full -translate-y-8 scale-105" // Added negative translation
                  />
                </div>

                {/* Optional Glass Effect Background */}
                <div className="absolute inset-0 bg-white/5 backdrop-blur-sm rounded-3xl z-0"></div>
              </div>

              {/* Floating Particles */}
              <div className="absolute inset-0 pointer-events-none z-30">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute w-2 h-2 bg-blue-400/20 rounded-full blur-sm"
                    style={{
                      top: `${Math.random() * 100}%`,
                      left: `${Math.random() * 100}%`,
                      animation: `float ${5 + i}s ease-in-out infinite`,
                      animationDelay: `${i * 0.5}s`,
                    }}
                  ></div>
                ))}
              </div>

              {/* Decorative Background Elements */}
              <div className="absolute inset-0 z-0">
                <div
                  className="absolute top-1/4 left-1/4 w-32 h-32 bg-blue-200/20 
      rounded-full blur-2xl animate-pulse"
                ></div>
                <div
                  className="absolute bottom-1/4 right-1/4 w-32 h-32 bg-purple-200/20 
      rounded-full blur-2xl animate-pulse"
                  style={{ animationDelay: "1s" }}
                ></div>
              </div>
            </div>

            {/* Keep your vector decorations */}
            <img
              src="/go-fix/images/hero-vector-3.png"
              alt=""
              className="w-10 h-10 absolute z-1 bottom-0 right-40 animate-float [animation-delay:4s]"
            />
            <img
              src="/go-fix/images/hero-vector-4.png"
              alt=""
              className="w-10 md:w-20 h-2 absolute z-1 bottom-0 -left-10 animate-float [animation-delay:6s]"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
