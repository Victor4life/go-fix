const DashboardHero = ({ userData, isLoading }) => {
  if (isLoading) {
    return <div className="animate-pulse">Loading...</div>;
  }

  const formatLastLogin = (timestamp) => {
    if (!timestamp) return "Not available";
    return new Date(timestamp).toLocaleString();
  };

  const formatSessionTime = (startTime) => {
    if (!startTime) return "Not available";
    const now = new Date();
    const start = new Date(startTime);
    const diff = Math.floor((now - start) / (1000 * 60));
    const hours = Math.floor(diff / 60);
    const minutes = diff % 60;
    return `${hours}h ${minutes}m`;
  };

  return (
    <div className="relative bg-gradient-to-r from-blue-500 to-blue-400 text-white my-6 w-full p-6 rounded-xl shadow-lg overflow-hidden">
      {/* Background Pattern*/}
      <div className="absolute inset-0 opacity-5">
        <svg
          className="w-full h-full"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          <pattern
            id="grid"
            width="10"
            height="10"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 10 0 L 0 0 0 10"
              fill="none"
              stroke="currentColor"
              strokeWidth="0.5"
            />
          </pattern>
          <rect width="100" height="100" fill="url(#grid)" />
        </svg>
      </div>

      <div className="relative flex flex-col md:flex-row justify-between items-center gap-4 z-10">
        <div className="w-full md:w-1/2 space-y-2 -pt-8">
          {" "}
          <h1 className="text-2xl md:text-3xl font-bold">
            {" "}
            Hello,{" "}
            <span className="text-blue-100">
              {userData.name || "Artisan!"}
            </span>{" "}
            👋
          </h1>
          <p className="text-md text-blue-50 leading-relaxed">
            {" "}
            Welcome to your Dashboard! Track your activities and manage
            services.
          </p>
        </div>
        <div className="w-full md:w-1/2 flex justify-center items-center">
          <div className="relative w-60 h-60">
            <img
              src={userData.profileImage || "/go-fix/images/dashbord.png"}
              alt="Dashboard illustration"
              className="absolute inset-0 w-full h-full object-contain drop-shadow-xl"
            />
          </div>
        </div>
      </div>

      {/* Activity Indicators */}
      <div className="absolute bottom-0 left-0 right-0 bg-blue-600/20 backdrop-blur-sm px-6 py-3">
        <div className="flex justify-between items-center text-sm">
          {" "}
          <div className="flex items-center gap-2">
            <div
              className={`w-2 h-2 rounded-full animate-pulse ${
                userData.status === "active" ? "bg-green-400" : "bg-gray-400"
              }`}
            ></div>
            <span className="text-blue-50">
              {userData.status === "active" ? "Active" : "Inactive"}
            </span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-blue-50">
              Last login: {formatLastLogin(userData.lastLogin)}
            </span>
            <span className="text-blue-50">•</span>
            <span className="text-blue-50">
              Session time: {formatSessionTime(userData.sessionTime)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHero;
