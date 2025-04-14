import React from "react";
import { FaClipboardList, FaUserCheck, FaCheckCircle } from "react-icons/fa";

const FloatingShape = ({ className, shapeType = "triangle" }) => {
  // Define different shape styles
  const shapeStyles = {
    blob: "63% 37% 30% 70% / 50% 45% 55% 50%",
    triangle: "50% 0% 100% 100% / 0% 100% 100% 100%",
    square: "0% 0% 0% 0% / 0% 0% 0% 0%",
    circle: "50% 50% 50% 50% / 50% 50% 50% 50%",
    star: "50% 0% 50% 50% / 25% 25% 75% 75%",
  };

  // Array of different colors
  const colors = [
    "#60A5FA", // blue
    "#34D399", // green
    "#F87171", // red
    "#FBBF24", // yellow
    "#A78BFA", // purple
    "#F472B6", // pink
  ];

  return (
    <div
      className={`absolute pointer-events-none opacity-10 animate-float ${className}`}
      style={{
        backgroundColor: colors[Math.floor(Math.random() * colors.length)],
        borderRadius: shapeStyles[shapeType],
      }}
    />
  );
};

const ServiceStep = ({ title, description, icon: Icon, index }) => (
  <div
    className="relative flex flex-col items-center p-8 bg-white rounded-lg
    shadow-2xl hover:shadow-2xl transform hover:-translate-y-1 
    transition-all duration-300 z-10 border-b-4 border-blue-500
    hover:border-blue-600 group"
  >
    {/* Step number indicator with animation */}
    <div
      className="absolute -top-5 w-8 h-8 bg-blue-500 text-white 
      rounded-full flex items-center justify-center font-bold text-sm
      group-hover:bg-blue-600 transform group-hover:scale-110 
      transition-all duration-300 shadow-md"
    >
      {index + 1}
    </div>

    {/* Icon with animation */}
    <div
      className="mb-6 text-blue-500 text-xl transform 
      group-hover:scale-110 transition-transform duration-300"
    >
      <Icon />
    </div>

    {/* Title with hover effect */}
    <h4
      className="font-bold text-xl text-gray-800 pb-4 
      group-hover:text-blue-600 transition-colors duration-300"
    >
      {title}
    </h4>

    {/* Description with improved readability */}
    <p className="text-gray-600 text-center leading-relaxed text-sm">
      {description}
    </p>
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
    <section className="container mx-auto relative overflow-hidden py-16 px-4 bg-white">
      <div className="absolute left-[20%] z-0 overflow-hidden">
        <img
          src="/go-fix/images/kite-bg.png"
          alt=""
          className="object-cover w-full h-full opacity-1"
        />
      </div>

      <div className="relative z-10">
        {/* Floating shapes */}
        <FloatingShape
          className="w-16 h-16 top-20 right-10"
          shapeType="triangle"
        />
        <FloatingShape
          className="w-12 h-12 top-0 right-[10%] animate-float"
          style={{ animationDelay: "1s" }}
          shapeType="triangle"
        />
      </div>

      <div className="max-w-6xl mx-auto relative">
        {/* Enhanced header section */}
        <div className="text-center mb-16">
          <h2
            className="font-bold text-3xl text-center mb-6 
            text-gray-900 leading-tight"
          >
            How it Works at
            <span className="text-blue-500 relative"> Go-Fix</span>
          </h2>
          <p className="text-gray-600 text-md max-w-2xl mx-auto leading-relaxed">
            Get your tasks done in three simple steps with our trusted platform.
            Quality service guaranteed.
          </p>
        </div>

        {/* Steps with connecting lines */}
        <div className="relative">
          {/* Connecting line */}
          <div
            className="hidden md:block absolute top-1/2 left-0 w-full h-0.5
            bg-blue-200 transform -translate-y-1/2 z-0"
          ></div>

          {/* Service steps */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative z-10">
            {steps.map((step, index) => (
              <ServiceStep key={index} {...step} index={index} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Services;
