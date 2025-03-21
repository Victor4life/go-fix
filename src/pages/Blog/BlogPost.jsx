import React, { useState, useEffect } from "react";
import { PrismicRichText } from "@prismicio/react";
import { useParams } from "react-router-dom";
import { client } from "../../lib/Prismic";

const BlogPost = () => {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      if (!slug) return;

      try {
        setIsLoading(true);
        setError(null);

        // Get post by UID (slug)
        const response = await client.getByUID("blog_post", slug);

        if (!response) {
          setError("Post not found");
          return;
        }

        const formattedPost = {
          title: response.data?.title?.[0]?.text || "Untitled",
          content: response.data?.content || [],
          excerpt: response.data?.excerpt?.[0]?.text || "",
          author: response.data?.author || "Anonymous",
          date: response.first_publication_date || new Date().toISOString(),
          image: response.data?.featured_image?.url || null,
        };

        setPost(formattedPost);
      } catch (err) {
        console.error("Error fetching post:", err);
        setError("Failed to load blog post");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPost();
  }, [slug]);

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-64 bg-gray-200 rounded-lg mb-8"></div>
          <div className="h-12 bg-gray-200 rounded mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-8"></div>
          <div className="space-y-4">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">{error}</h1>
          <p className="text-gray-600">Please try again later</p>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            Post not found
          </h1>
          <p className="text-gray-600">The requested post could not be found</p>
        </div>
      </div>
    );
  }

  const formattedDate = new Date(post.date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <article className="max-w-4xl mx-auto px-4 py-10 my-10">
      {post.image && (
        <img
          src={post.image}
          alt={post.title}
          className="w-full h-64 md:h-96 object-cover rounded-lg mb-8"
        />
      )}
      <h1 className="text-4xl font-bold text-gray-900 mb-4">{post.title}</h1>
      <div className="flex items-center gap-4 text-gray-600 mb-8">
        <span>By {post.author}</span>
        <span>•</span>
        <time dateTime={post.date}>{formattedDate}</time>
      </div>
      <div className="prose prose-lg max-w-none">
        {post.content ? (
          <PrismicRichText field={post.content} />
        ) : (
          <p>{post.excerpt}</p>
        )}
      </div>
    </article>
  );
};

export default BlogPost;
