"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import {
  ShoppingBag,
  DollarSign,
  Clock,
  Plus,
  Trash2,
  MoreHorizontal,
  Heart,
  Edit,
  Eye,
  Star,
} from "lucide-react";

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [userProducts, setUserProducts] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [likedProductIds, setLikedProductIds] = useState(new Set());
  const router = useRouter();
  const API_BASE_URL = "http://127.0.0.1:8000";

  // Get auth headers
  const getAuthHeaders = useCallback(() => {
    const token = localStorage.getItem("token");
    return {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };
  }, []);

  // Fetch user profile
  const fetchUserProfile = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/users/me/`, {
        headers: getAuthHeaders(),
      });
      if (res.ok) {
        const userData = await res.json();
        setUser({
          id: userData.id,
          email: userData.email,
          firstName: userData.first_name,
          lastName: userData.last_name,
          avatar: userData.avatar || "/images/default-avatar.png",
          number: userData.number,
          createdAt: userData.created_at,
          name: `${userData.first_name} ${userData.last_name}`,
        });
        return userData;
      } else if (res.status === 401) {
        handleLogout();
      }
    } catch (err) {
      console.error("Failed to fetch user profile:", err);
      setError("Failed to load profile data");
    }
    return null;
  }, [getAuthHeaders]);

  // Fetch user's products
  const fetchUserProducts = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/products/items/?uploaded_by=me`, {
        headers: getAuthHeaders(),
      });
      if (res.ok) {
        const data = await res.json();
        setUserProducts(data.results || data);
      }
    } catch (err) {
      console.error("Failed to fetch user products:", err);
    }
  }, [getAuthHeaders]);

  // Fetch all products (marketplace)
  const fetchAllProducts = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/products/items/`, {
        headers: getAuthHeaders(),
      });
      if (res.ok) {
        const data = await res.json();
        setAllProducts(data.results || data);
      }
    } catch (err) {
      console.error("Failed to fetch all products:", err);
    }
  }, [getAuthHeaders]);

  // Calculate stats
  const calculateStats = useCallback((userProducts, allProducts) => {
    const activeListings = userProducts.filter(
      (p) => p.status === "active"
    ).length;
    const soldListings = userProducts.filter((p) => p.status === "sold").length;

    const totalViews = userProducts.reduce((sum, p) => sum + (p.views || 0), 0);
    const totalEarnings = userProducts
      .filter((p) => p.status === "sold")
      .reduce((sum, p) => sum + (p.points || 0), 0);

    const ratedProducts = userProducts.filter((p) => p.rating && p.rating > 0);
    const averageRating =
      ratedProducts.length > 0
        ? ratedProducts.reduce((sum, p) => sum + p.rating, 0) /
          ratedProducts.length
        : 0;

    return {
      totalListings: userProducts.length,
      activeListings,
      soldListings,
      totalViews,
      totalEarnings,
      averageRating: averageRating.toFixed(1),
      marketplaceItems: allProducts.length,
    };
  }, []);

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case "available":
        return "bg-green-100 text-green-800";
      case "swapped":
        return "bg-blue-100 text-blue-800";
      case "redeemed":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Get initials
  const getInitials = () => {
    if (!user) return "";
    const firstName = user.firstName || "";
    const lastName = user.lastName || "";
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    router.push("/pages/login");
  };

  // Handle like product
  const handleLikeProduct = async (productId) => {
    try {
      const res = await fetch(`${API_BASE_URL}/items/items/${productId}/like/`, {
        method: "POST",
        headers: getAuthHeaders(),
      });
      if (res.ok) {
        setLikedProductIds((prev) => {
          const newSet = new Set(prev);
          if (newSet.has(productId)) {
            newSet.delete(productId);
          } else {
            newSet.add(productId);
          }
          return newSet;
        });
        await refreshData();
      } else {
        console.error("Failed to like/unlike product");
      }
    } catch (err) {
      console.error("Failed to like/unlike product:", err);
    }
  };

  // Refresh all data
  const refreshData = useCallback(async () => {
    setLoading(true);
    try {
      await Promise.all([fetchUserProfile(), fetchAllProducts(), fetchUserProducts()]);
    } catch (err) {
      console.error("Failed to refresh data:", err);
    } finally {
      setLoading(false);
    }
  }, [fetchUserProfile, fetchAllProducts, fetchUserProducts]);

  // Initial data fetch
  useEffect(() => {
    refreshData();
  }, [refreshData]);

  // Update stats when products change
  useEffect(() => {
    if (userProducts.length > 0 || allProducts.length > 0) {
      const calculatedStats = calculateStats(userProducts, allProducts);
      setStats(calculatedStats);
    }
  }, [userProducts, allProducts, calculateStats]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-700">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {user ? (
        <>
          {/* Profile Header */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center space-x-6">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-500 via-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-2xl">{getInitials()}</span>
              </div>
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-gray-900">{user.name}</h1>
                <p className="text-gray-600">{user.email}</p>
                {user.number && <p className="text-gray-600">{user.number}</p>}
                <p className="text-sm text-gray-500 mt-2">Member since {formatDate(user.createdAt)}</p>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">Active Listings</p>
                    <p className="text-gray-900 dark:text-white text-3xl font-bold mt-2">{stats.activeListings || 0}</p>
                    <p className="text-gray-500 dark:text-gray-400 text-xs mt-1">of {stats.totalListings || 0} total</p>
                  </div>
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                    <ShoppingBag className="w-6 h-6 text-white" />
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">Total Earnings</p>
                    <p className="text-gray-900 dark:text-white text-3xl font-bold mt-2">₹{stats.totalEarnings?.toLocaleString() || 0}</p>
                    <p className="text-gray-500 dark:text-gray-400 text-xs mt-1">{stats.soldListings || 0} items sold</p>
                  </div>
                  <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-lg flex items-center justify-center">
                    <DollarSign className="w-6 h-6 text-white" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* User's Items */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Your Products</h2>
            {userProducts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {userProducts.map((item) => (
                  <div key={item.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                    {item.images && item.images.length > 0 && (
                      <img src={item.images[0].image} alt={item.title} className="w-full h-48 object-cover rounded-lg mb-3" />
                    )}
                    <h3 className="font-semibold text-gray-900 mb-2">{item.title}</h3>
                    <p className="text-sm text-gray-600 mb-2 line-clamp-2">{item.description}</p>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-lg font-bold text-purple-600">{item.points} pts</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>{item.status}</span>
                    </div>
                    <div className="flex flex-wrap gap-1 text-xs text-gray-500">
                      <span className="bg-gray-100 px-2 py-1 rounded">{item.category}</span>
                      <span className="bg-gray-100 px-2 py-1 rounded">{item.size}</span>
                      <span className="bg-gray-100 px-2 py-1 rounded">{item.condition}</span>
                    </div>
                    <p className="text-xs text-gray-400 mt-2">Created: {formatDate(item.created_at)}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2M4 13h2m13-8l-1 1m0 0l-1 1m1-1v4M6 5l1 1v4m0 0l1-1m-1 1H4" />
                </svg>
                <p className="text-gray-500 text-lg">No products created yet</p>
                <p className="text-gray-400 text-sm">Start by creating your first product listing</p>
              </div>
            )}
          </div>
        </>
      ) : (
        <div className="text-center py-12">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Welcome to Your Profile</h1>
            <p className="text-gray-600 mb-8">Please log in to view your profile and manage your products</p>
          </div>
          <button
            onClick={() => router.push("/pages/login")}
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-medium px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
          >
            <span className="flex items-center space-x-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
              </svg>
              <span>Login</span>
            </span>
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
