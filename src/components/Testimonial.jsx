import React from "react";
import {
  FaArrowLeft,
  FaArrowRight,
  FaAward,
  FaMedal,
  FaStar,
  FaTrophy,
} from "react-icons/fa";
import { useState } from "react";

const Testimonial = () => {
  const testimonials = [
    {
      id: 1,
      name: "Mr Adedeji",
      role: "Ikeja Resident",
      content:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Eius quibusdam itaque consequatur dolorem exercitationem.",
      image: "images/hero3.png",
    },
    {
      id: 2,
      name: "Ayomide James",
      role: "Ikotun Resident",
      content:
        "Aperiam quas labore deserunt voluptates tenetur corporis nobis est dignissimos dolores expedita.",
      image: "images/contact.png",
    },
    {
      id: 3,
      name: "Folashade Funke",
      role: "Ajah Resident",
      content:
        "Labore deserunt voluptates tenetur corporis nobis est dignissimos dolores expedita quod nostrum beatae.",
      image: "images/electrician.png",
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
            <h2 className="font-bold text-3xl mb-6">
              What Most Users, <span className="text-blue-500">Say.</span>
            </h2>
            <p className="text-gray-600 text-sm">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Eius
              quibusdam itaque consequatur dolorem exercitationem. Lorem ipsum
              dolor sit amet consectetur adipisicing elit. Explicabo, ex labore
              atque quas fugiat iste laudantium assumenda quo accusantium autem
              at. Architecto nisi rerum quasi amet eaque deserunt dolore
              repudiandae.
            </p>
            <div className="flex flex-row gap-5 text-xl lg:text-2xl pt-3 align-between">
              <FaAward className="bg-blue-500 text-white px-2 py-2 rounded-full hover:bg-blue-600 transition-colors" />
              <FaMedal className="bg-blue-500 text-white px-2 py-2 rounded-full hover:bg-blue-600 transition-colors" />
              <FaTrophy className="bg-blue-500 text-white px-2 py-2 rounded-full hover:bg-blue-600 transition-colors" />
              <FaStar className="bg-blue-500 text-white px-2 py-2 rounded-full hover:bg-blue-600 transition-colors" />
            </div>
          </div>

          <div className="w-full lg:w-1/2">
            <div className="relative">
              {/* Carousel Container */}
              {/* Navigation Buttons */}
              <div className="flex gap-4 my-4 justify-end">
                <button
                  onClick={prevSlide}
                  className="bg-blue-500 text-white px-2 py-2 rounded-full hover:bg-blue-600 transition-colors"
                >
                  <FaArrowLeft />
                </button>
                <button
                  onClick={nextSlide}
                  className="bg-blue-500 text-white px-2 py-2 rounded-full hover:bg-blue-600 transition-colors"
                >
                  <FaArrowRight />
                </button>
              </div>

              {/* Testimonial Card */}
              <div className="overflow-hidden rounded-lg shadow-lg">
                <div className="relative">
                  <div
                    className="absolute bottom-0 right-0 w-[50px] h-[50px] translate-x-1/4 translate-y-1/4"
                    style={{
                      background: "rgba(0, 0, 255, 0.5)",
                      borderRadius: "60% 40% 30% 70% / 60% 30% 70% 40%",
                    }}
                  />
                  <div
                    className="absolute bottom-0 left-0 w-[50px] h-[50px] -translate-x-1/4 translate-y-1/4"
                    style={{
                      background: "rgba(0, 0, 255, 0.5)",
                      borderRadius: "60% 40% 40% 70% / 70% 60% 40% 40%",
                    }}
                  />

                  <div className="bg-gray-200 p-6">
                    <div className="flex items-center mb-4">
                      <img
                        src={testimonials[currentIndex].image}
                        alt={testimonials[currentIndex].name}
                        className="w-12 h-12 rounded-full mr-4"
                      />
                      <div>
                        <h3 className="font-semibold text-lg">
                          {testimonials[currentIndex].name}
                        </h3>
                        <p className="text-gray-600 text-sm">
                          {testimonials[currentIndex].role}
                        </p>
                      </div>
                    </div>
                    <p className="text-gray-700">
                      {testimonials[currentIndex].content}
                    </p>
                  </div>
                </div>
              </div>

              {/* Dots Indicator */}
              <div className="flex justify-center mt-4">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentIndex(index)}
                    className={`h-2 w-2 mx-1 rounded-full ${
                      currentIndex === index ? "bg-blue-500" : "bg-gray-300"
                    }`}
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
