import React, { useState, useRef } from "react";
import emailjs from "emailjs-com";
import {
  FaFacebook,
  FaTwitter,
  FaLinkedin,
  FaInstagram,
  FaYoutube,
} from "react-icons/fa";

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");
  const recaptchaRef = useRef();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const validateForm = () => {
    let errors = {};
    if (!formData.name.trim()) errors.name = "Name is required";
    if (!formData.email.trim()) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Email is invalid";
    }
    if (!formData.subject.trim()) errors.subject = "Subject is required";
    if (!formData.message.trim()) errors.message = "Message is required";
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formErrors = validateForm();
    if (Object.keys(formErrors).length === 0) {
      setIsSubmitting(true);
      setErrors({});
      try {
        const result = await emailjs.send(
          "service_o8ptmtq",
          "template_7fo5cos",
          formData,
          "POlPdbmHA9PknmCmU"
        );

        if (result.text === "OK") {
          setSubmitMessage(
            "Thank you! Your message has been sent successfully."
          );
          setFormData({ name: "", email: "", subject: "", message: "" });
          recaptchaRef.current.reset();
        } else {
          throw new Error("Submission failed");
        }
      } catch (error) {
        console.error("Error submitting form:", error);
        setSubmitMessage("Oops! Something went wrong. Please try again later.");
      } finally {
        setIsSubmitting(false);
      }
    } else {
      setErrors(formErrors);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-100 rounded-lg shadow-xl">
      <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">
        Get in Touch
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700"
              >
                <b>Name</b>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name}</p>
              )}
            </div>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                <b>Email</b>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
              )}
            </div>
            <div>
              <label
                htmlFor="subject"
                className="block text-sm font-medium text-gray-700"
              >
                <b>Subject</b>
              </label>
              <input
                type="text"
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
              {errors.subject && (
                <p className="mt-1 text-sm text-red-600">{errors.subject}</p>
              )}
            </div>
            <div>
              <label
                htmlFor="message"
                className="block text-sm font-medium text-gray-700"
              >
                <b>Message</b>
              </label>
              <textarea
                id="message"
                name="message"
                rows="4"
                value={formData.message}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              ></textarea>
              {errors.message && (
                <p className="mt-1 text-sm text-red-600">{errors.message}</p>
              )}
            </div>
            <div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 transition duration-150 ease-in-out"
              >
                {isSubmitting ? "Sending..." : "Send Message"}
              </button>
            </div>
          </form>
          {submitMessage && (
            <div
              className={`mt-4 p-4 rounded-md ${
                submitMessage.includes("successfully")
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {submitMessage}
            </div>
          )}
        </div>

        {/*DETAILS*/}
        <div className="relative overflow-hidden rounded-lg">
          <div
            className="absolute inset-0 bg-cover bg-center z-0"
            style={{
              backgroundImage: "url('images/contact.png')",
              filter: "brightness(1)",
            }}
          ></div>
          <div className="relative z-10 p-6 bg-blue-100 bg-opacity-90 h-full">
            <h3 className="text-xl font-semibold mb-4 text-black">
              <b>Contact Information</b>
            </h3>
            <p className="mb-4 text-black">
              Feel free to reach out to us through the form or via the following
              channels:
            </p>
            <div className="space-y-2 text-black">
              <p>
                <strong>Email :</strong> oluchidonatus.1@gmail.com
              </p>
              <p>
                <strong>Phone :</strong> +234-9057155469
              </p>
              <p>
                <strong>Address :</strong> 5, Camp Davis Road.
              </p>
            </div>
            <div className="mt-6">
              <h4 className="text-lg font-semibold mb-2 text-black">
                Follow Us :
              </h4>
              <div className="flex space-x-4">
                <a
                  href="#"
                  className="text-blue-600 hover:text-indigo-600 transition-colors duration-300"
                >
                  <FaYoutube size={24} />
                </a>
                <a
                  href="#"
                  className="text-blue-600 hover:text-indigo-600 transition-colors duration-300"
                >
                  <FaFacebook size={24} />
                </a>
                <a
                  href="#"
                  className="text-blue-600 hover:text-indigo-600 transition-colors duration-300"
                >
                  <FaTwitter size={24} />
                </a>
                <a
                  href="#"
                  className="text-blue-600 hover:text-indigo-600 transition-colors duration-300"
                >
                  <FaLinkedin size={24} />
                </a>
                <a
                  href="#"
                  className="text-blue-600 hover:text-indigo-600 transition-colors duration-300"
                >
                  <FaInstagram size={24} />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactForm;
