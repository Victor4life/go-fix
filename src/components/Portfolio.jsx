import React from "react";

const Portfolio = () => {
  const features = [
    {
      id: 1,
      title: "Reliability",
      description: "We deliver consistent and dependable service every time",
    },
    {
      id: 2,
      title: "Authenticity",
      description: "We use genuine parts and transparent practices",
    },
    {
      id: 3,
      title: "Professionalism",
      description: "Our site consists of certified and experienced technicians",
    },
    {
      id: 4,
      title: "Timeliness",
      description: "We value your time and ensure prompt service delivery",
    },
  ];

  return (
    <section className="bg-white py-16">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start max-w-7xl mx-auto">
          {/* Left Column - Content and Features */}
          <div className="space-y-12">
            {/* Heading Section */}
            <div>
              <h2 className="text-3xl font-bold mb-4 text-center">
                Why Choose
                <span className="text-blue-500 relative"> Go-Fix</span>
              </h2>
              <p className="text-gray-600 text-md text-center">
                Experience excellence in every service we provide
              </p>
            </div>
            {/* Features */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {features.map((feature) => (
                <div
                  className="relative flex items-start space-x-4"
                  key={feature.id}
                >
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 text-blue-200 text-[5rem] font-light z-10 opacity-50">
                    {feature.id.toString().padStart(2, "0")}
                  </span>
                  <div className="flex-grow relative z-10">
                    <h3 className="font-semibold text-xl mb-2 text-gray-800">
                      {feature.title}
                    </h3>
                    <p className="text-gray-700 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div className="absolute z-0 overflow-hidden">
              <img
                src="images/kite2.png"
                alt=""
                className="object-cover w-full h-full opacity-1"
              />
            </div>
          </div>

          {/* Right Column - Image */}
          <div className="relative -space-y-12">
            <img
              src="/go-fix/images/service_v3-1.png"
              alt="Professional experts at work"
              className="w-full object-contain"
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Portfolio;
