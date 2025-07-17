"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Heart,
  ShoppingBag,
  Eye,
  Star,
  MessageCircle,
  Share2,
} from "lucide-react";

const API_BASE_URL = "http://127.0.0.1:8000";

const LikedPage = () => {
  const router = useRouter();
  const [likedItems, setLikedItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    return {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };
  };

  const fetchLikedItems = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/items/items/liked-items/`, {
        headers: getAuthHeaders(),
      });
      if (res.ok) {
        const data = await res.json();
        setLikedItems(data);
      } else {
        console.error("Failed to fetch liked items");
      }
    } catch (err) {
      console.error("Error fetching liked items:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUnlike = async (itemId) => {
    try {
      const res = await fetch(`${API_BASE_URL}/items/items/${itemId}/like/`, {
        method: "POST",
        headers: getAuthHeaders(),
      });
      if (res.ok) {
        fetchLikedItems();
      } else {
        console.error("Failed to unlike item");
      }
    } catch (err) {
      console.error("Error unliking item:", err);
    }
  };

  useEffect(() => {
    fetchLikedItems();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
        <p className="text-gray-700 dark:text-gray-300 text-lg">Loading liked products...</p>
      </div>
    );
  }

  if (likedItems.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900">
        <ShoppingBag className="w-16 h-16 text-gray-400 mb-4" />
        <p className="text-gray-600 dark:text-gray-400 text-lg">You have no liked products yet.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-8 px-4">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
        Liked Products
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
        {likedItems.map((product) => (
          <div
            key={product.id}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden border border-gray-200 dark:border-gray-700 cursor-pointer"
            onClick={() => router.push(`/pages/productdetails/${product.id}`)}
          >
            <img
              src={
                product.images && product.images.length > 0
                  ? product.images[0].image
                  : "https://via.placeholder.com/300"
              }
              alt={product.title}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 truncate">
                {product.title}
              </h2>
              <p className="text-gray-700 dark:text-gray-300 text-sm mb-2 line-clamp-2">
                {product.description}
              </p>
              <p className="text-cyan-600 dark:text-cyan-400 font-semibold mb-2">
                ₹{product.points?.toLocaleString() || 0}
              </p>
              <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-3">
                <div className="flex items-center space-x-4">
                  <span className="flex items-center">
                    <Eye className="w-4 h-4 mr-1" />
                    {product.views || 0}
                  </span>
                  <span className="flex items-center">
                    <Heart className="w-4 h-4 mr-1 text-red-500" />
                    {product.likes || 0}
                  </span>
                  {product.rating && product.rating > 0 && (
                    <span className="flex items-center">
                      <Star className="w-4 h-4 mr-1 text-yellow-400" />
                      {product.rating.toFixed(1)}
                    </span>
                  )}
                </div>
                <span className="text-xs">
                  {new Date(product.created_at).toLocaleDateString()}
                </span>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleUnlike(product.id);
                }}
                className="w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded-md transition-colors"
              >
                Unlike
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LikedPage;
