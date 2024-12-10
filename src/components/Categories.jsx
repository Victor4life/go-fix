import React from "react";
import { Link } from "react-router-dom";
const categoryData = [
  {
    id: 1,
    title: "Carpenters",
    image: "images/electrician.png",
    count: "150+ Experts",
  },
  {
    id: 2,
    title: "Plumbers",
    image: "images/hero3.png",
    count: "80+ Experts",
  },
  {
    id: 3,
    title: "Electricians",
    image: "images/electrician.png",
    count: "120+ Experts",
  },
  {
    id: 4,
    title: "Cleaners",
    image: "images/hero3.png",
    count: "90+ Experts",
  },
];

const Categories = () => {
  return (
    <section className="container mx-auto px-4 lg:px-14 py-8 lg:py-10">
      <div className="mx-auto">
        <h2 className="font-bold text-3xl text-center mb-6">
          Your Satisfaction, <span className="text-blue-500">Guaranteed.</span>
        </h2>
        <div className="flex flex-col md:flex-row justify-between items-center gap-1 pt-4">
          <p className="text-gray-700 max-w-2xl text-center md:text-left">
            Tons of Service categories and Experts at your finger tips.
          </p>
          <Link
            to="/categories"
            className="text-blue-500 hover:text-blue-700 transition-colors"
          >
            See All
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-2 mt-8">
          {categoryData.map((category) => (
            <div
              key={category.id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="relative h-40">
                <img
                  src={category.image}
                  alt={category.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-lg mb-1">{category.title}</h3>
                <p className="text-sm text-gray-600">{category.count}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Categories;
