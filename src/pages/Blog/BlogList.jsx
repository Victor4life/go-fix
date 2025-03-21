import React from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";

const BlogList = ({ posts = [], isLoading = false }) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[1, 2, 3].map((index) => (
          <div
            key={index}
            className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200"
          >
            <div className="w-full h-48 bg-gray-200 rounded-lg mb-4 animate-pulse"></div>
            <div className="space-y-3">
              <div className="h-6 bg-gray-200 rounded w-3/4 animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded w-1/4 animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3 animate-pulse"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Empty State - Enhanced with better messaging
  if (!posts?.length) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 text-xl font-medium mb-2">No posts found</p>
        <p className="text-gray-500">Check back later for new content</p>
      </div>
    );
  }

  // Main Content - Enhanced with better hover effects and transitions
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {posts.map((post) => (
        <Link
          to={`/blog/${post.slug}`}
          key={post.id}
          className="group block transform transition duration-200 hover:-translate-y-1"
        >
          <article className="bg-white h-full rounded-lg shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden">
            {post.image && (
              <div className="relative overflow-hidden aspect-video">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-48 object-cover transform transition-transform duration-300 group-hover:scale-105"
                  loading="lazy"
                />
              </div>
            )}
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-2 text-gray-800 group-hover:text-blue-600 transition-colors duration-200">
                {post.title}
              </h2>
              <time className="text-gray-500 text-sm mb-4 block">
                {new Date(post.date).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </time>
              {post.excerpt && (
                <p className="text-gray-600 line-clamp-3 mb-4">
                  {post.excerpt}
                </p>
              )}
              <span className="inline-flex items-center text-blue-600 text-sm font-medium group-hover:text-blue-700">
                Read more
                <svg
                  className="ml-1 w-4 h-4 transition-transform group-hover:translate-x-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </span>
            </div>
          </article>
        </Link>
      ))}
    </div>
  );
};

BlogList.propTypes = {
  posts: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      date: PropTypes.string.isRequired,
      image: PropTypes.string,
      excerpt: PropTypes.string,
      slug: PropTypes.string,
    })
  ),
  isLoading: PropTypes.bool,
};

export default BlogList;
