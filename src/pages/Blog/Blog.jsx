// Blog.jsx
import { useEffect, useState } from "react";
import { client } from "../../lib/Prismic";
import BlogList from "./BlogList";
import BlogSearch from "./BlogSearch";
import * as prismic from "@prismicio/client";

const LoadingSkeleton = () => (
  <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
    <div className="w-full h-48 bg-gray-200 rounded-lg mb-4 animate-pulse"></div>
    <div className="space-y-3">
      <div className="h-6 bg-gray-200 rounded w-3/4 animate-pulse"></div>
      <div className="h-4 bg-gray-200 rounded w-1/4 animate-pulse"></div>
      <div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
      <div className="h-4 bg-gray-200 rounded w-2/3 animate-pulse"></div>
    </div>
  </div>
);

const Blog = () => {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchPosts = async (pageNumber = 1) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await client.getAllByType("blog_post", {
        orderings: {
          field: "document.first_publication_date",
          direction: "desc",
        },
        page: pageNumber,
        pageSize: 10,
      });

      const formattedPosts = response.map((post) => ({
        id: post.id,
        title: post.data.title[0]?.text || "",
        excerpt: post.data.excerpt?.[0]?.text || "",
        date: post.first_publication_date,
        image: post.data.featured_image?.url,
        author: post.data.author || "Anonymous",
        slug: post.uid || `post-${post.id}`, // Ensure slug is never null
      }));

      setPosts(formattedPosts);
      setTotalPages(Math.ceil(formattedPosts.length / 10));
    } catch (err) {
      console.error("Error fetching posts:", err);
      setError("Failed to load blog posts. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = async (term) => {
    setSearchTerm(term);
    try {
      setIsLoading(true);
      setError(null);
      setPage(1);

      if (!term.trim()) {
        return fetchPosts(1);
      }

      // Fix the query syntax
      const response = await client.getByType("blog_post", {
        predicates: [prismic.filter.fulltext("document", term)],
        orderings: {
          field: "document.first_publication_date",
          direction: "desc",
        },
        pageSize: 10,
        page: 1,
      });

      const formattedResults = response.results.map((post) => ({
        id: post.id,
        title: post.data.title[0]?.text || "",
        excerpt: post.data.excerpt?.[0]?.text || "",
        date: post.first_publication_date,
        image: post.data.featured_image?.url,
        author: post.data.author || "Anonymous",
        slug: post.uid || `post-${post.id}`,
      }));

      setPosts(formattedResults);
      setTotalPages(Math.ceil(response.total_results_size / 10));
    } catch (err) {
      setError("Search failed. Please try again.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!searchTerm) {
      fetchPosts(page);
    }
  }, [page, searchTerm]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const Pagination = () => (
    <div className="flex items-center justify-center gap-4 mt-12 mb-8">
      <button
        onClick={() => {
          setPage((p) => Math.max(p - 1, 1));
          scrollToTop();
        }}
        disabled={page === 1}
        className={`px-6 py-3 rounded-full transition-all duration-200 flex items-center gap-2 disabled:cursor-not-allowed
          ${
            page === 1
              ? "bg-gray-100 text-gray-400"
              : "bg-blue-500 text-white hover:bg-blue-600 hover:shadow-lg active:transform active:scale-95"
          }`}
      >
        ← Previous
      </button>

      <div className="flex items-center gap-2">
        {page > 3 && (
          <>
            <PageButton pageNum={1} />
            <span className="px-2">...</span>
          </>
        )}

        {[...Array(totalPages)].map((_, idx) => {
          const pageNum = idx + 1;
          if (pageNum >= page - 2 && pageNum <= page + 2) {
            return <PageButton key={pageNum} pageNum={pageNum} />;
          }
          return null;
        })}
      </div>

      <button
        onClick={() => {
          setPage((p) => Math.min(p + 1, totalPages));
          scrollToTop();
        }}
        disabled={page === totalPages}
        className={`px-6 py-3 rounded-full transition-all duration-200 flex items-center gap-2 disabled:cursor-not-allowed
          ${
            page === totalPages
              ? "bg-gray-100 text-gray-400"
              : "bg-blue-500 text-white hover:bg-blue-600 hover:shadow-lg active:transform active:scale-95"
          }`}
      >
        Next →
      </button>
    </div>
  );

  const PageButton = ({ pageNum }) => (
    <button
      onClick={() => {
        setPage(pageNum);
        scrollToTop();
      }}
      className={`w-10 h-10 rounded-full transition-all duration-200 flex items-center justify-center
        ${
          page === pageNum
            ? "bg-blue-500 text-white shadow-md"
            : "bg-gray-100 hover:bg-gray-200 text-gray-700"
        }`}
    >
      {pageNum}
    </button>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="container  mx-auto max-w-6xl px-4 pb-24">
        {/* Header Section */}
        <div className="relative overflow-hidden bg-gradient-to-t from-blue-100 to-blue-100 py-16 rounded-b-3xl shadow-sm">
          <div className="absolute top-0 left-0 w-full h-full opacity-20">
            <div className="absolute top-0 -left-4 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
            <div className="absolute -top-8 -right-4 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
          </div>
          <div className="relative mx-auto max-w-4xl px-4">
            <img
              src="/images/hero-vector.png"
              alt=""
              className="w-8 h-8 absolute z-1"
            />
            <img
              src="/images/hero-vector-2.png"
              alt=""
              className="w-8 h-8 absolute z-1 top-10 right-0 "
            />
            <img
              src="/images/hero-vector-3.png"
              alt=""
              className="w-8 h-8 absolute z-1 top-40 "
            />
          </div>

          <div className="relative container mx-auto px-4">
            <div className="max-w-4xl mx-auto pt-8">
              <h1 className="text-4xl md:text-5xl font-bold text-center mb-6 tracking-tight leading-tight">
                Our Blog
              </h1>
              <p className="text-center text-gray-600 text-lg md:text-xl mb-8 max-w-2xl mx-auto leading-relaxed">
                Discover our latest insights, tutorials, and updates
              </p>
              <div className="max-w-2xl mx-auto transform transition-all duration-200 hover:scale-[1.01]">
                <BlogSearch onSearch={handleSearch} isLoading={isLoading} />
              </div>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="mt-12">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(9)].map((_, i) => (
                <LoadingSkeleton key={i} />
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <div className="text-red-500 text-xl mb-4">{error}</div>
              <button
                onClick={() => fetchPosts(page)}
                className="px-6 py-3 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-all duration-200"
              >
                Try Again
              </button>
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-12">
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                No posts found
              </h3>
              <p className="text-gray-500">
                {searchTerm
                  ? "Try adjusting your search terms"
                  : "Check back later for new content"}
              </p>
            </div>
          ) : (
            <>
              <BlogList
                posts={posts.map((post) => ({
                  ...post,
                  slug: post.slug || post.uid || post.id,
                }))}
                isLoading={isLoading}
              />{" "}
              {totalPages > 1 && <Pagination />}{" "}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Blog;
