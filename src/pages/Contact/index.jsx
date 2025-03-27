import React, { useState, useRef } from "react";
import {
  FaFacebook,
  FaTwitter,
  FaLinkedin,
  FaInstagram,
  FaYoutube,
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope,
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
    <div className="min-h-screen bg-gray-100 px-4 md:px-8 lg:px-16 xl:px-20 py-8 md:py-12">
      {/* Hero Section */}
      <div className="text-black py-10 bg-cover bg-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">Contact Us</h1>
            <p className="text-xl text-gray-600">
              We'd love to hear from you. Drop us a message and we'll get back
              to you as soon as possible.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Quick Contact Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <div className="flex justify-center mb-4">
              <FaPhone className="text-indigo-600 text-3xl" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Phone</h3>
            <p>+234-9057155469</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <div className="flex justify-center mb-4">
              <FaEnvelope className="text-indigo-600 text-3xl" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Email</h3>
            <p>oluchidonatus.1@gmail.com</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <div className="flex justify-center mb-4">
              <FaMapMarkerAlt className="text-indigo-600 text-3xl" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Location</h3>
            <p>5, Camp Davis Road</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactForm;
