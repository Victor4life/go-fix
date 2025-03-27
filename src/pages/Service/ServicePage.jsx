import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
// Import icons from react-icons
import {
  FaToolbox,
  FaPlug,
  FaHammer,
  FaPaintRoller,
  FaBroom,
  FaTree,
  FaSnowflake,
  FaHome,
  FaCar,
  FaCut,
  FaTshirt,
  FaWarehouse,
} from "react-icons/fa";

const ServicePage = () => {
  const navigate = useNavigate(); // Add this hook
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Enhanced service categories with icons and descriptions
  const serviceCategories = [
    {
      id: 1,
      name: "Plumbing",
      icon: <FaToolbox className="text-4xl mb-3 text-blue-500" />,
      description: "Expert plumbing solutions for your home and business",
    },
    {
      id: 2,
      name: "Electrician",
      icon: <FaPlug className="text-4xl mb-3 text-yellow-500" />,
      description: "Professional electrical repairs and installations",
    },
    {
      id: 3,
      name: "Carpentry",
      icon: <FaHammer className="text-4xl mb-3 text-brown-500" />,
      description: "Custom woodwork and furniture solutions",
    },
    {
      id: 4,
      name: "Interior Decorator",
      icon: <FaPaintRoller className="text-4xl mb-3 text-red-500" />,
      description: "Professional interior design services",
    },
    {
      id: 5,
      name: "Cleaning",
      icon: <FaBroom className="text-4xl mb-3 text-green-500" />,
      description: "Professional cleaning and sanitization",
    },
    {
      id: 6,
      name: "Handyman",
      icon: <FaToolbox className="text-4xl mb-3 text-orange-500" />,
      description: "General repairs and maintenance",
    },
    {
      id: 7,
      name: "Mechanic",
      icon: <FaCar className="text-4xl mb-3 text-gray-500" />,
      description: "Vehicle repair and maintenance services",
    },
    {
      id: 8,
      name: "Security",
      icon: <FaHome className="text-4xl mb-3 text-slate-500" />,
      description: "Security system installation and monitoring",
    },
    {
      id: 9,
      name: "Gardener",
      icon: <FaTree className="text-4xl mb-3 text-green-500" />,
      description: "Professional gardening and landscaping services",
    },
    {
      id: 10,
      name: "HVAC",
      icon: <FaSnowflake className="text-4xl mb-3 text-blue-500" />,
      description: "Heating, ventilation, and air conditioning services",
    },
    {
      id: 11,
      name: "Mover",
      icon: <FaWarehouse className="text-4xl mb-3 text-gray-500" />,
      description: "Professional moving services",
    },
    {
      id: 12,
      name: "Painter",
      icon: <FaCut className="text-4xl mb-3 text-red-500" />,
      description: "Professional painting services",
    },
    {
      id: 13,
      name: "Tiler",
      icon: <FaTshirt className="text-4xl mb-3 text-blue-500" />,
      description: "Professional tiling services",
    },
  ];

  // Add this function to handle category clicks
  const handleCategoryClick = (categoryName) => {
    // Convert the category name to lowercase and handle spaces/special characters
    const formattedCategory = categoryName
      .toLowerCase()
      .replace(/\s+/g, "-") // Replace spaces with hyphens
      .replace(/&/g, "and"); // Replace & with 'and'

    navigate(`/services/${formattedCategory}`);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setCategories(serviceCategories);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // In your return statement, modify the card to be clickable:
  return (
    <div className="min-h-screen bg-gray-100 px-4 md:px-8 lg:px-16 xl:px-20 py-8">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Available Service Categories
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Find skilled artisans and professionals for all your service needs
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {categories.map((category) => (
            <div
              key={category.id}
              className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer overflow-hidden"
              onClick={() => handleCategoryClick(category.name)} // Add this onClick handler
            >
              <div className="p-6 text-center">
                {category.icon}
                <h2 className="text-xl font-semibold text-gray-800 mb-2">
                  {category.name}
                </h2>
                <p className="text-gray-600 text-sm">{category.description}</p>
              </div>
              <div className="bg-gray-50 px-6 py-3 border-t border-gray-100">
                <button className="text-blue-500 hover:text-blue-700 text-sm font-medium">
                  Find Professionals →
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ServicePage;
