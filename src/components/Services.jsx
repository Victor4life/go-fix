import React from "react";
import { FaClipboardList, FaUserCheck, FaCheckCircle } from "react-icons/fa";

const ServiceStep = ({ title, description, icon: Icon, index }) => (
  <div className="relative flex flex-col items-center p-6 bg-white rounded-md shadow-lg hover:shadow-xl transition-shadow duration-300 z-10 border-b-2 border-l-2 border-r-2">
    <div className="absolute -top-4 w-5 h-5 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold">
      {index + 1}
    </div>
    <div className="mb-4 text-blue-500 text-4xl">
      <Icon />
    </div>
    <h4 className="font-bold text-xl text-gray-800 pb-3">{title}</h4>
    <p className="text-gray-600 text-center leading-relaxed">{description}</p>
  </div>
);

const Services = () => {
  const steps = [
    {
      title: "Describe Your Task",
      description:
        "Tell us what you need help with and we'll match you with the right professional for your specific requirements.",
      icon: FaClipboardList,
    },
    {
      title: "Choose a Tasker",
      description:
        "Browse profiles, reviews, and competitive prices to find the perfect skilled professional for your job.",
      icon: FaUserCheck,
    },
    {
      title: "Live Smarter",
      description:
        "Your tasker arrives and completes the job to your satisfaction. Enjoy secure payment and guaranteed quality service.",
      icon: FaCheckCircle,
    },
  ];

  return (
    <section className="container mx-auto relative overflow-hidden py-10 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="font-bold text-3xl text-center mb-6">
            How it Works at,
            <span className="text-blue-500"> Go-Fix.</span>
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Get your tasks done in three simple steps with our trusted platform
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
          {steps.map((step, index) => (
            <ServiceStep key={index} {...step} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
