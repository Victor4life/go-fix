import React from "react";

// Blog List Container
export const BlogListContainer = ({ children }) => (
  <div className="max-w-6xl mx-auto px-4 py-8 sm:px-6 lg:px-8">{children}</div>
);

// Blog Preview Card
export const BlogPreviewCard = ({ children }) => (
  <article className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 p-6 mb-8 hover:-translate-y-1">
    {children}
  </article>
);

// Blog Post Container
export const BlogPostContainer = ({ children }) => (
  <article className="max-w-3xl mx-auto px-4 py-8 sm:px-6">{children}</article>
);

// Blog Post Title
export const BlogTitle = ({ children }) => (
  <h1 className="text-4xl font-bold text-gray-900 mb-4">{children}</h1>
);

// Meta Information
export const MetaInfo = ({ children }) => (
  <div className="flex items-center gap-4 text-sm text-gray-600 mb-8">
    {children}
  </div>
);

// Blog Content
export const BlogContent = ({ children }) => (
  <div className="prose prose-lg max-w-none">{children}</div>
);

// Loading State
export const LoadingState = () => (
  <div className="flex items-center justify-center py-12">
    <div className="text-gray-600">Loading...</div>
  </div>
);

// Error State
export const ErrorState = ({ message }) => (
  <div className="flex items-center justify-center py-12">
    <div className="text-red-600">{message || "Something went wrong"}</div>
  </div>
);

export default {
  BlogListContainer,
  BlogPreviewCard,
  BlogPostContainer,
  BlogTitle,
  MetaInfo,
  BlogContent,
  LoadingState,
  ErrorState,
};
