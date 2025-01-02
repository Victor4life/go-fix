import React from "react";

const Hero = () => {
  return (
    <section className="bg-white overflow-hidden relative pt-16">
      {/* Blob Background */}
      <div
        className="absolute top-0 left-0 w-[600px] h-[600px] -translate-x-1/4 -translate-y-1/4"
        style={{
          background: "rgba(0, 0, 255, 0.5)",
          borderRadius: "60% 40% 30% 70% / 60% 30% 70% 40%",
          animation: "blobAnimation 8s ease-in-out infinite",
        }}
      />
      <div
        className="absolute bottom-0 right-0 w-[300px] h-[300px] translate-x-1/4 translate-y-1/4"
        style={{
          background: "rgba(0, 0, 255, 0.5)",
          borderRadius: "60% 40% 30% 70% / 60% 30% 70% 40%",
        }}
      />

      {/* Content Section */}
      <div className="flex flex-col lg:flex-row flex-1 justify-between mx-auto px-4 lg:px-14 py-8 lg:py-10 gap-8 relative">
        <div className="lg:w-1/2 xl:p-4">
          <h1 className="text-4xl lg:text-7xl font-bold text-black leading-tight">
            Hire Experts and Get Your Job Done.
          </h1>
          <p className="text-gray-800 pt-8 text-lg leading-relaxed">
            Connect with skilled professionals and get your projects done
            efficiently. Our platform matches you with verified experts who can
            deliver quality results on time.
          </p>

          <form className="flex flex-col md:flex-row flex-1 gap-4 p-4 rounded-md shadow-xl max-w-6xl mx-auto w-full">
            <input
              type="text"
              placeholder="Address"
              className="p-3 rounded-md flex-1 w-full border border-gray-200"
            />

            <select
              name="city"
              className="p-3 rounded-md w-full md:w-auto border border-gray-200"
            >
              <option value="">City</option>
              <option value="agege">Agege</option>
              <option value="alimosho">Alimosho</option>
              <option value="apapa">Apapa</option>
              <option value="badagry">Badagry</option>
              <option value="yola">Isolo</option>
              <option value="yaba">yaba</option>
              <option value="ikeja">Ikeja</option>
              <option value="ikorodun">Ikorodun</option>
              <option value="mushin">Mushin</option>
            </select>

            <select
              name="category"
              className="p-3 rounded-md w-full md:w-auto border border-gray-200"
            >
              <option value="">Category</option>
              <option value="plumber">Plumber</option>
              <option value="electrician">Electrician</option>
              <option value="cleaner">Cleaner</option>
              <option value="carpenter">Carpenter</option>
              <option value="painter">Painter</option>
              <option value="tailor">Tailor</option>
            </select>

            <button
              type="submit"
              className="p-3 rounded-md bg-blue-500 text-white hover:bg-blue-600 border-2 border-blue-400 w-full md:w-auto transition duration-300 ease-in-out transform hover:scale-105"
            >
              Search
            </button>
          </form>
        </div>

        {/* Image Section */}
        <div className="lg:w-1/2 xl:p-4">
          <div className="relative">
            <img
              src="images/hero3.png"
              alt="Professional experts at work"
              className="w-full h-auto object-cover rounded-lg w-full h-full"
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
