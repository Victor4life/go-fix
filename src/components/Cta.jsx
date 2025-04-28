import React from "react";
import { FaArrowRight } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const Cta = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/signup");
  };

  return (
    <div className="relative bg-blue-800 bg-blend-overlay bg-cover bg-center bg-no-repeat min-h-[200px] p-5">
      {/*<div className="absolute -top-10 right-10">
        <img
          src="images/cta.png"
          alt="CTA decoration"
          className="max-w-[200px] h-auto"
        />
      </div>

      <div className="absolute -bottom-10 left-10">
        <img
          src="images/cta2.png"
          alt="CTA decoration"
          className="max-w-[200px] h-auto"
        />
      </div>*/}

      <div className="flex flex-1 items-center justify-center gap-8 min-h-[200px]">
        <h2 className="text-2xl font-bold text-white">
          Ready to Register Your Service Now?
        </h2>
        <button
          onClick={handleClick}
          className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg transition duration-300 ease-in-out transform hover:scale-105"
        >
          Get Started Now <FaArrowRight className="inline ml-2" />
        </button>
      </div>
    </div>
  );
};

export default Cta;
