import React from "react";
import {
  FaArrowLeft,
  FaArrowRight,
  FaAward,
  FaMedal,
  FaStar,
  FaTrophy,
  FaQuoteLeft,
} from "react-icons/fa";
import { useState } from "react";

const Testimonial = () => {
  const testimonials = [
    {
      id: 1,
      name: "Mr Adedeji",
      role: "Ikeja Resident",
      content:
        "I had an electrical emergency late in the evening, and their team responded within 30 minutes. The technician was professional and fixed the issue quickly. Excellent service!",
      image: "/go-fix/images/hero3.png",
    },
    {
      id: 2,
      name: "Ayomide James",
      role: "Ikotun Resident",
      content:
        "Very reliable and professional service. They installed my entire home's electrical system and did a fantastic job. Their attention to safety standards is impressive.",
      image: "/go-fix/images/contact.png",
    },
    {
      id: 3,
      name: "Folashade Funke",
      role: "Ajah Resident",
      content:
        "I've been using their maintenance service for my office complex for over a year now. Their team is always punctual, professional, and thorough with their work.",
      image: "/go-fix/images/electrician.png",
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1
    );
  };

  return (
    <section className="container mx-auto relative overflow-hidden px-4 lg:px-14 py-8 lg:py-10">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col lg:flex-row justify-between items-center gap-8">
          <div className="w-full lg:w-1/2">
            <div className="relative bg-white overflow-hidden">
              {/* Background decoration */}
              <div className="absolute top-0 right-0 -mr-16 -mt-16">
                <img
                  src="/go-fix/images/dots.png"
                  alt=""
                  className="w-48 opacity-10 transform rotate-45"
                />
              </div>

              {/* Header */}
              <h2 className="font-bold text-3xl mb-8 relative z-10">
                What Most Users
                <span className="text-blue-500 relative"> Say</span>
              </h2>

              {/* Testimonial text */}
              <p className="text-gray-700 text-md lg:text-md leading-relaxed mb-10 relative z-10 max-w-2xl">
                Our commitment to excellence has earned us the trust of
                countless satisfied customers across Lagos. From emergency
                repairs to routine maintenance, our team of skilled technicians
                has consistently delivered reliable and professional service
                that keeps our customers coming back.
              </p>

              {/* Achievement icons */}
              <div className="flex flex-wrap lg:flex-row gap-2 md:gap-8">
                <div className="group cursor-pointer transform transition-all duration-300 hover:-translate-y-2">
                  <div className="relative">
                    <FaAward
                      className="text-4xl lg:text-5xl p-5 bg-gradient-to-r from-blue-500 to-blue-600 
            text-white rounded-2xl shadow-xl hover:shadow-blue-300/50 
            transition-all duration-300"
                    />
                    <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-blue-200 rounded-full opacity-20"></div>
                  </div>
                  <p className="text-sm font-medium text-gray-600 mt-3 text-center">
                    Excellence
                  </p>
                </div>

                <div className="group cursor-pointer transform transition-all duration-300 hover:-translate-y-2">
                  <div className="relative">
                    <FaMedal
                      className="text-4xl lg:text-5xl p-5 bg-gradient-to-r from-blue-500 to-blue-600 
            text-white rounded-2xl shadow-xl hover:shadow-blue-300/50 
            transition-all duration-300"
                    />
                    <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-blue-200 rounded-full opacity-20"></div>
                  </div>
                  <p className="text-sm font-medium text-gray-600 mt-3 text-center">
                    Quality
                  </p>
                </div>

                <div className="group cursor-pointer transform transition-all duration-300 hover:-translate-y-2">
                  <div className="relative">
                    <FaTrophy
                      className="text-4xl lg:text-5xl p-5 bg-gradient-to-r from-blue-500 to-blue-600 
            text-white rounded-2xl shadow-xl hover:shadow-blue-300/50 
            transition-all duration-300"
                    />
                    <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-blue-200 rounded-full opacity-20"></div>
                  </div>
                  <p className="text-sm font-medium text-gray-600 mt-3 text-center">
                    Best Service
                  </p>
                </div>

                <div className="group cursor-pointer transform transition-all duration-300 hover:-translate-y-2">
                  <div className="relative">
                    <FaStar
                      className="text-4xl lg:text-5xl p-5 bg-gradient-to-r from-blue-500 to-blue-600 
            text-white rounded-2xl shadow-xl hover:shadow-blue-300/50 
            transition-all duration-300"
                    />
                    <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-blue-200 rounded-full opacity-20"></div>
                  </div>
                  <p className="text-sm font-medium text-gray-600 mt-3 text-center">
                    Top Rated
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="w-full lg:w-1/2">
            <div className="relative">
              {/* Navigation Buttons - Made more prominent and positioned on sides */}
              <div className="absolute top-0 -translate-y-1/2 w-full flex gap-2 justify-end px-4 z-20">
                <button
                  onClick={prevSlide}
                  className="bg-blue-500 text-white p-3 rounded-full hover:bg-blue-600 
        transition-all duration-300 transform hover:scale-110 shadow-lg"
                >
                  <FaArrowLeft />
                </button>
                <button
                  onClick={nextSlide}
                  className="bg-blue-600 text-white p-3 rounded-full hover:bg-blue-700 
        transition-all duration-300 transform hover:scale-110 shadow-lg"
                >
                  <FaArrowRight />
                </button>
              </div>

              {/* Testimonial Card with smooth transitions */}
              <div className="overflow-hidden rounded-lg shadow-xl">
                <div
                  className="flex transition-transform duration-500 ease-in-out"
                  style={{ transform: `translateX(-${currentIndex * 100}%)` }}
                >
                  {testimonials.map((testimonial) => (
                    <div
                      key={testimonial.id}
                      className="w-full flex-shrink-0" // Add this to prevent shrinking
                    >
                      <div className="bg-white p-8">
                        <div className="flex items-center mb-6">
                          <img
                            src={testimonial.image}
                            alt={testimonial.name}
                            className="w-16 h-16 rounded-full object-cover border-4 border-blue-500 shadow-lg"
                          />
                          <div className="ml-4">
                            <h3 className="font-bold text-xl text-gray-800">
                              {testimonial.name}
                            </h3>
                            <p className="text-blue-500 font-medium">
                              {testimonial.role}
                            </p>
                          </div>
                        </div>
                        <div className="relative">
                          <FaQuoteLeft className="text-blue-500 opacity-20 text-4xl absolute -top-2 -left-2" />
                          <p className="text-gray-700 text-lg leading-relaxed pl-6">
                            {testimonial.content}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Enhanced Dots Indicator */}
              <div className="flex justify-center mt-6 gap-2">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentIndex(index)}
                    className={`h-3 transition-all duration-300 ${
                      currentIndex === index
                        ? "w-8 bg-blue-500"
                        : "w-3 bg-gray-300 hover:bg-blue-300"
                    } rounded-full`}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonial;
