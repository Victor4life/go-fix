import React from "react";
import {
  FaFacebook,
  FaInstagram,
  FaTiktok,
  FaTwitter,
  FaWhatsapp,
  FaYoutube,
} from "react-icons/fa6";

const categories = [
  {
    name: "Pages",
    links: ["Home", "Services", "Contact", "Register as a professional"],
  },
  {
    name: "Links",
    links: ["Login", "Signup", "Search", "Register"],
  },
  {
    name: "Links",
    links: ["Login", "Signup", "Search", "Register"],
  },
  {
    name: "Who we are",
    links: ["Home", "Services", "Contact", "Register as a professional"],
  },
  {
    name: "More",
    links: ["Our Socials", "Blogs", "Testimonial", "Services"],
  },
];

const socialLinks = [
  { icon: FaFacebook, url: "https://facebook.com" },
  { icon: FaInstagram, url: "https://instagram.com" },
  { icon: FaTiktok, url: "https://www.tiktok.com/@lulushealthhub" },
  { icon: FaTwitter, url: "https://twitter.com" },
  { icon: FaWhatsapp, url: "https://whatsapp.com" },
  { icon: FaYoutube, url: "https://www.youtube.com/@LULUSHEALTHHUB-fd6jk" },
];

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="px-4 pt-16 mx-auto sm:max-w-xl md:max-w-full lg:max-w-screen-xl md:px-24 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-6 mb-3">
          {/* Categories */}
          <div className="col-span-4 grid grid-cols-2 md:grid-cols-5 gap-4">
            {categories.map((category, index) => (
              <div key={index}>
                <p className="font-medium tracking-wide text-gray-300">
                  {category.name}
                </p>
                <ul className="mt-2 space-y-2">
                  {category.links.map((link, linkIndex) => (
                    <li key={linkIndex}>
                      <a
                        href="/"
                        className="text-gray-500 transition-colors duration-300 hover:text-blue-500"
                      >
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Social Links */}
          <div className="col-span-2 md:col-span-1 flex flex-col justify-between">
            <div>
              <p className="font-medium tracking-wide text-gray-300">
                Follow Us
              </p>
              <div className="flex items-center mt-4 space-x-4">
                {socialLinks.map((social, index) => (
                  <a
                    key={index}
                    href={social.url}
                    className="text-gray-500 transition-colors duration-300 hover:text-blue-500"
                  >
                    <social.icon
                      aria-label={`Follow us on ${
                        social.url.split(".com")[0].split("//")[1]
                      }`}
                    />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="flex flex-col justify-between pt-5 pb-10 border-t border-gray-800 sm:flex-row">
          <p className="text-sm text-gray-500">
            ©{new Date().getFullYear()}. All rights reserved.
          </p>
          <div className="flex items-center mt-4 space-x-4 sm:mt-0">
            <a
              href="/"
              className="text-sm text-gray-500 transition-colors duration-300 hover:text-blue-500"
            >
              Privacy Policy
            </a>
            <a
              href="/"
              className="text-sm text-gray-500 transition-colors duration-300 hover:text-blue-500"
            >
              Terms &amp; Conditions
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
