import React from "react";
import {
  FaFacebook,
  FaTwitter,
  FaLinkedin,
  FaInstagram,
  FaYoutube,
} from "react-icons/fa";

const index = () => {
  return (
    <section className="min-h-screen bg-gradient-to-b from-white to-blue-50 overflow-hidden pt-16">
      <div className="max-w-5xl mx-auto p-8">
        <h2 className="text-4xl font-bold text-center mb-12 text-gray-800 relative">
          Get in Touch
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-0 items-center">
          {/* Form Section */}
          <div className="backdrop-blur-sm bg-white/80 p-8 rounded-2xl shadow-2xl transform hover:scale-105 transition-all duration-300">
            <form className="space-y-6">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-300"
                  placeholder="Your Name"
                />
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-300"
                  placeholder="your@email.com"
                />
              </div>
              <div>
                <label
                  htmlFor="subject"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  Subject
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-300"
                  placeholder="How can we help?"
                />
              </div>
              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows="4"
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-300"
                  placeholder="Your message here..."
                ></textarea>
              </div>
              <button
                type="submit"
                className="w-full py-3 px-6 rounded-lg bg-gradient-to-r from-indigo-600 to-blue-500 text-white font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300"
              >
                Send Message
              </button>
            </form>
          </div>

          {/* Contact Info Section */}
          <div
            className="relative rounded-2xl overflow-hidden shadow-2xl h-full flex flex-col justify-between"
            style={{
              backgroundImage: 'url("images/contact.png")',
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
            }}
          >
            {/* Add a darker overlay to make text more visible */}
            <div className="relative z-10 p-8 bg-black/60 h-full flex flex-col">
              <div>
                <h3 className="text-2xl font-bold mb-6 text-white">
                  Contact Information
                </h3>
                <div className="space-y-6 text-white">
                  <p className="flex items-center space-x-4">
                    <span className="text-lg">📧</span>
                    <span>contact@example.com</span>
                  </p>
                  <p className="flex items-center space-x-4">
                    <span className="text-lg">📱</span>
                    <span>+000-0000000</span>
                  </p>
                  <p className="flex items-center space-x-4">
                    <span className="text-lg">🌍</span>
                    <span>5, XYZ Street, City, Country</span>
                  </p>
                </div>
              </div>

              <div className="mt-auto pt-8">
                <h4 className="text-xl font-semibold mb-4 text-white">
                  Follow Us
                </h4>
                <div className="flex space-x-4">
                  {[
                    FaYoutube,
                    FaFacebook,
                    FaTwitter,
                    FaLinkedin,
                    FaInstagram,
                  ].map((Icon, index) => (
                    <a
                      key={index}
                      href="#"
                      className="p-2 bg-white/10 rounded-full hover:bg-white/20 transform hover:scale-110 transition-all duration-300"
                    >
                      <Icon className="text-white" size={20} />
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default index;
