import React from "react";
import { FaShield, FaCheck } from "react-icons/fa6";

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
    <section className="container mx-auto relative overflow-hidden px-4 lg:px-14 py-8 lg:py-10">
      <div
        className="absolute bottom-0 right-0 w-[500px] h-[400px] translate-x-1/4 translate-y-1/4"
        style={{
          background: "rgba(0, 0, 255, 0.5)",
          borderRadius: "60% 40% 30% 50% / 60% 30% 50% 40%",
        }}
      />

      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col lg:flex-row justify-between items-center gap-8">
          <div className="w-full lg:w-2/3">
            <h2 className="font-bold text-3xl mb-6">
              Why Choose, <span className="text-blue-500">Go-Fix.</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {features.map((feature) => (
                <div
                  key={feature.id}
                  className="flex items-start space-x-3 p-4 rounded-lg hover:bg-gray-50 transition-all duration-300"
                >
                  <div className="mt-1 text-xl lg:text-2xl">
                    <FaCheck className="bg-blue-500 text-white px-2 py-2 rounded-full hover:bg-blue-600 transition-colors" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 text-sm">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="w-full lg:w-1/3 flex justify-center items-center">
            <div className="relative">
              <div className="absolute -inset-1 bg-blue-100 rounded-full blur-lg opacity-70"></div>
              <div className="relative bg-white p-8 rounded-full shadow-lg">
                <FaShield className="text-blue-500 text-6xl lg:text-8xl" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Portfolio;
