import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { debounce } from "lodash";

const BlogSearch = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  // Optional: Debounced search for better performance
  const debouncedSearch = debounce((term) => {
    onSearch(term);
    setIsTyping(false);
  }, 500);

  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(searchTerm);
    setIsTyping(false);
  };

  const handleChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    setIsTyping(true);
    debouncedSearch(value);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="relative max-w-xl mx-auto transform transition-all duration-200 hover:scale-[1.01]"
    >
      <div className="relative">
        {/* Search Icon */}
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>

        {/* Search Input */}
        <input
          type="text"
          value={searchTerm}
          onChange={handleChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder="Search blog posts..."
          className={`
            w-full pl-12 pr-16 py-3 rounded-full
            border border-gray-300 
            bg-white
            text-gray-700 placeholder-gray-400
            transition-all duration-200
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
            hover:shadow-md
            ${isFocused ? "shadow-lg" : "shadow-sm"}
          `}
          aria-label="Search blog posts"
        />

        {/* Clear Button - Shows only when there's text */}
        {searchTerm && (
          <button
            type="button"
            onClick={() => {
              setSearchTerm("");
              onSearch("");
            }}
            className="absolute right-16 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
            aria-label="Clear search"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}

        {/* Search Button */}
        <button
          type="submit"
          className={`
            absolute right-3 top-1/2 transform -translate-y-1/2
            px-4 py-1.5 
            bg-blue-500 hover:bg-blue-600 
            text-white font-medium
            rounded-full
            transition-all duration-200
            flex items-center gap-2
            ${isTyping ? "opacity-90" : "hover:shadow-md active:scale-95"}
          `}
          disabled={isTyping}
        >
          {isTyping ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              Searching
            </span>
          ) : (
            "Search"
          )}
        </button>
      </div>

      {/* Optional: Search suggestions or recent searches could go here */}
      {isFocused && searchTerm && (
        <div className="absolute w-full mt-2 py-2 bg-white rounded-lg shadow-lg border border-gray-100 z-10">
          {/* Add your search suggestions here */}
        </div>
      )}
    </form>
  );
};

BlogSearch.propTypes = {
  onSearch: PropTypes.func.isRequired,
};

export default BlogSearch;
