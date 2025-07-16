"use client";
import Footer from "@/app/components/footer/page.jsx";
import Navbar from "@/app/components/navbar/page.jsx";
import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  Clock,
  DollarSign,
  Edit,
  Eye,
  Heart,
  LogOut,
  MessageCircle,
  MoreHorizontal,
  Package,
  Plus,
  RefreshCw,
  Search,
  Share2,
  ShoppingBag,
  SortAsc,
  SortDesc,
  Star,
  TrendingUp,
  Trash2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [products, setProducts] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [userProducts, setUserProducts] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [stats, setStats] = useState({});
  const [refreshing, setRefreshing] = useState(false);
  const [sortBy, setSortBy] = useState("created_at");
  const [sortOrder, setSortOrder] = useState("desc");
  const [filterStatus, setFilterStatus] = useState("all");
  const [messages, setMessages] = useState([]);
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

  // Fetch user profile and stats
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
          avatar: userData.avatar || "https://via.placeholder.com/150",
          phone: userData.phone,
          createdAt: userData.created_at,
        });
        return userData;
      } else if (res.status === 401) {
        handleLogout();
      }
    } catch (err) {
      console.error("Failed to fetch user profile:", err);
    }
    return null;
  }, [getAuthHeaders]);

  // Fetch all products (marketplace)
  const fetchAllProducts = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/items/items/`, {
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

  // Fetch user's own products
  const fetchUserProducts = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/items/items/?owner=me`, {
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

  // Calculate real-time stats
  const calculateStats = useCallback((userProducts, allProducts) => {
    const userProductIds = userProducts.map((p) => p.id);
    const activeListings = userProducts.filter(
      (p) => p.status === "active"
    ).length;
    const soldListings = userProducts.filter((p) => p.status === "sold").length;

    const totalViews = userProducts.reduce((sum, p) => sum + (p.views || 0), 0);
    const totalLikes = userProducts.reduce((sum, p) => sum + (p.likes || 0), 0);
    const totalEarnings = userProducts
      .filter((p) => p.status === "sold")
      .reduce((sum, p) => sum + (p.points || 0), 0);

    // Calculate average rating
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
      totalLikes,
      totalEarnings,
      averageRating: averageRating.toFixed(1),
      marketplaceItems: allProducts.length,
    };
  }, []);

  // Generate recent activity from user's products
  const generateRecentActivity = useCallback((userProducts) => {
    const activities = [];

    userProducts.forEach((product) => {
      // Recently created items
      const createdDate = new Date(product.created_at);
      const now = new Date();
      const timeDiff = now - createdDate;
      const hoursDiff = timeDiff / (1000 * 60 * 60);

      if (hoursDiff < 168) {
        // Within last week
        activities.push({
          id: `created_${product.id}`,
          type: "listing_created",
          title: `New listing: ${product.title}`,
          time: formatTimeAgo(createdDate),
          icon: <Plus className="w-4 h-4 text-green-400" />,
          product: product,
        });
      }

      // Recently sold items
      if (product.status === "sold" && product.sold_at) {
        const soldDate = new Date(product.sold_at);
        const soldHoursDiff = (now - soldDate) / (1000 * 60 * 60);

        if (soldHoursDiff < 168) {
          activities.push({
            id: `sold_${product.id}`,
            type: "item_sold",
            title: `${product.title} sold for ₹${product.points}`,
            time: formatTimeAgo(soldDate),
            icon: <DollarSign className="w-4 h-4 text-emerald-400" />,
            product: product,
          });
        }
      }

      // High engagement items
      if (product.views > 10 || product.likes > 5) {
        activities.push({
          id: `engagement_${product.id}`,
          type: "high_engagement",
          title: `${product.title} has ${product.views} views and ${product.likes} likes`,
          time: formatTimeAgo(
            new Date(product.updated_at || product.created_at)
          ),
          icon: <TrendingUp className="w-4 h-4 text-blue-400" />,
          product: product,
        });
      }
    });

    // Sort by most recent and limit to 10
    return activities
      .sort((a, b) => new Date(b.time) - new Date(a.time))
      .slice(0, 10);
  }, []);

  // Format time ago
  const formatTimeAgo = (date) => {
    const now = new Date();
    const diffTime = now - new Date(date);
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffHours < 1) return "Just now";
    if (diffHours < 24)
      return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
    return new Date(date).toLocaleDateString();
  };

  // Handle product actions
  const handleLikeProduct = async (productId) => {
    try {
      const res = await fetch(
        `${API_BASE_URL}/items/items/${productId}/like/`,
        {
          method: "POST",
          headers: getAuthHeaders(),
        }
      );
      if (res.ok) {
        await refreshData();
      }
    } catch (err) {
      console.error("Failed to like product:", err);
    }
  };

  const handleViewProduct = async (productId) => {
    try {
      await fetch(`${API_BASE_URL}/items/items/${productId}/view/`, {
        method: "POST",
        headers: getAuthHeaders(),
      });
      await refreshData();
    } catch (err) {
      console.error("Failed to record view:", err);
    }
  };

  const handleRateProduct = async (productId, rating) => {
    try {
      const res = await fetch(
        `${API_BASE_URL}/items/items/${productId}/rate/`,
        {
          method: "POST",
          headers: getAuthHeaders(),
          body: JSON.stringify({ rating }),
        }
      );
      if (res.ok) {
        await refreshData();
      }
    } catch (err) {
      console.error("Failed to rate product:", err);
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        const res = await fetch(`${API_BASE_URL}/items/items/${productId}/`, {
          method: "DELETE",
          headers: getAuthHeaders(),
        });
        if (res.ok) {
          await refreshData();
        }
      } catch (err) {
        console.error("Failed to delete product:", err);
      }
    }
  };

  // Refresh all data
  const refreshData = useCallback(async () => {
    setRefreshing(true);
    try {
      await Promise.all([
        fetchUserProfile(),
        fetchAllProducts(),
        fetchUserProducts(),
      ]);
    } finally {
      setRefreshing(false);
    }
  }, [fetchUserProfile, fetchAllProducts, fetchUserProducts]);

  // Sort and filter products
  const getSortedAndFilteredProducts = (products, isUserProducts = false) => {
    let filtered = products;

    if (filterStatus !== "all") {
      filtered = products.filter((p) => p.status === filterStatus);
    }

    return filtered.sort((a, b) => {
      let aValue = a[sortBy];
      let bValue = b[sortBy];

      if (sortBy === "created_at" || sortBy === "updated_at") {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
      }

      if (sortOrder === "asc") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });
  };

  // Initial data fetch
  useEffect(() => {
    const initializeData = async () => {
      setIsLoading(true);
      const token = localStorage.getItem("token");

      if (!token) {
        router.push("/pages/landingpage");
        return;
      }

      try {
        const userData = await fetchUserProfile();
        if (userData) {
          await Promise.all([fetchAllProducts(), fetchUserProducts()]);
        }
      } catch (err) {
        console.error("Failed to initialize data:", err);
        router.push("/pages/landingpage");
      } finally {
        setIsLoading(false);
      }
    };

    initializeData();
  }, [router, fetchUserProfile, fetchAllProducts, fetchUserProducts]);

  // Update stats and activity when products change
  useEffect(() => {
    if (userProducts.length > 0 || allProducts.length > 0) {
      const calculatedStats = calculateStats(userProducts, allProducts);
      setStats(calculatedStats);

      const activity = generateRecentActivity(userProducts);
      setRecentActivity(activity);
    }
  }, [userProducts, allProducts, calculateStats, generateRecentActivity]);

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    router.push("/");
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-400 mb-4">Unable to load user data</p>
          <button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Return to Login
          </button>
        </div>
      </div>
    );
  }

return (
  <>
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
      <Navbar />

      {/* Back Button */}
      <div className="pt-20 px-4">
        <div className="flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="flex items-center text-gray-400 hover:text-white transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </button>
          <button
            onClick={refreshData}
            disabled={refreshing}
            className="flex items-center text-gray-400 hover:text-white transition-colors mb-6"
          >
            <RefreshCw
              className={`w-4 h-4 mr-2 ${refreshing ? "animate-spin" : ""}`}
            />
            {refreshing ? "Refreshing..." : "Refresh"}
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div className="flex items-center space-x-4 mb-4 md:mb-0">
            <div className="flex items-center space-x-4 bg-gradient-to-r from-slate-900 to-slate-800 rounded-xl px-5 py-2 border border-cyan-500/50 shadow-xl shadow-cyan-500/20 hover:ring-2 hover:ring-cyan-400/40 transition duration-200">
              <div className="relative w-12 h-12 bg-gradient-to-tr from-cyan-400 to-green-600 rounded-lg flex items-center justify-center border border-cyan-300/60 shadow-lg shadow-cyan-400/40">
                <span className="text-sm font-bold text-white z-10">
                  {user.firstName?.charAt(0) || ""}
                  {user.lastName?.charAt(0) || ""}
                </span>
              </div>
              <div className="text-cyan-300 text-sm font-semibold tracking-wide">
                {user.firstName} {user.lastName}
                <p className="text-gray-300 font-sans">{user.email}</p>
                <p className="text-gray-400 text-xs">
                  Member since {new Date(user.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={() => router.push("/pages/sell")}
              className="bg-gradient-to-r from-cyan-500 to-emerald-600 text-white px-4 py-2 rounded-lg hover:from-cyan-600 hover:to-emerald-700 transition-all flex items-center"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Listing
            </button>
            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </button>
          </div>
        </div>

        {/* Enhanced Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-800/50 backdrop-blur-md border border-gray-700/50 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Active Listings</p>
                <p className="text-2xl font-bold text-white">
                  {stats.activeListings || 0}
                </p>
                <p className="text-xs text-gray-500">
                  of {stats.totalListings || 0} total
                </p>
              </div>
              <ShoppingBag className="w-8 h-8 text-cyan-400" />
            </div>
          </div>

          <div className="bg-gray-800/50 backdrop-blur-md border border-gray-700/50 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Views</p>
                <p className="text-2xl font-bold text-white">
                  {stats.totalViews || 0}
                </p>
                <p className="text-xs text-gray-500">across all listings</p>
              </div>
              <Eye className="w-8 h-8 text-emerald-400" />
            </div>
          </div>

          <div className="bg-gray-800/50 backdrop-blur-md border border-gray-700/50 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Likes</p>
                <p className="text-2xl font-bold text-white">
                  {stats.totalLikes || 0}
                </p>
                <p className="text-xs text-gray-500">
                  Rating: {stats.averageRating || 0}★
                </p>
              </div>
              <Heart className="w-8 h-8 text-pink-400" />
            </div>
          </div>

          <div className="bg-gray-800/50 backdrop-blur-md border border-gray-700/50 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Earnings</p>
                <p className="text-2xl font-bold text-white">
                  ₹{stats.totalEarnings?.toLocaleString() || 0}
                </p>
                <p className="text-xs text-gray-500">
                  {stats.soldListings || 0} items sold
                </p>
              </div>
              <DollarSign className="w-8 h-8 text-yellow-400" />
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 bg-gray-800/50 rounded-lg p-1 mb-8">
          {[
            {
              id: "overview",
              label: "Overview",
              icon: <TrendingUp className="w-4 h-4" />,
            },
            {
              id: "listings",
              label: "My Listings",
              icon: <Package className="w-4 h-4" />,
            },
            {
              id: "marketplace",
              label: "Marketplace",
              icon: <ShoppingBag className="w-4 h-4" />,
            },
            {
              id: "activity",
              label: "Activity",
              icon: <Calendar className="w-4 h-4" />,
            },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-all ${
                activeTab === tab.id
                  ? "bg-cyan-500 text-white"
                  : "text-gray-400 hover:text-white hover:bg-gray-700/50"
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="space-y-8">
          {activeTab === "overview" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Recent Activity */}
              <div className="bg-gray-800/50 backdrop-blur-md border border-gray-700/50 rounded-xl p-6">
                <h3 className="text-xl font-semibold mb-4 flex items-center">
                  <Clock className="w-5 h-5 mr-2" />
                  Recent Activity
                </h3>
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {recentActivity.length > 0 ? (
                    recentActivity.map((activity) => (
                      <div
                        key={activity.id}
                        className="flex items-start space-x-3 p-3 bg-gray-700/30 rounded-lg hover:bg-gray-700/50 transition-colors"
                      >
                        <div className="flex-shrink-0 mt-1">
                          {activity.icon}
                        </div>
                        <div className="flex-1">
                          <p className="text-white font-medium">
                            {activity.title}
                          </p>
                          <p className="text-gray-400 text-sm">
                            {activity.time}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <Clock className="w-12 h-12 text-gray-500 mx-auto mb-3" />
                      <p className="text-gray-400">No recent activity</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-gray-800/50 backdrop-blur-md border border-gray-700/50 rounded-xl p-6">
                <h3 className="text-xl font-semibold mb-4">Quick Actions</h3>
                <div className="grid grid-cols-1 gap-3">
                  <button
                    onClick={() => router.push("/pages/sell")}
                    className="flex items-center justify-between p-4 bg-gradient-to-r from-cyan-500/20 to-emerald-500/20 border border-cyan-500/30 rounded-lg hover:from-cyan-500/30 hover:to-emerald-500/30 transition-all"
                  >
                    <div className="flex items-center space-x-3">
                      <Plus className="w-5 h-5 text-cyan-400" />
                      <span>Create New Listing</span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-gray-400" />
                  </button>

                  <button
                    onClick={() => setActiveTab("marketplace")}
                    className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-lg hover:from-purple-500/30 hover:to-pink-500/30 transition-all"
                  >
                    <div className="flex items-center space-x-3">
                      <Search className="w-5 h-5 text-purple-400" />
                      <span>Browse Marketplace</span>
                    </div>
                    <span className="text-xs bg-purple-500/20 px-2 py-1 rounded">
                      {stats.marketplaceItems || 0} items
                    </span>
                  </button>

                  <button
                    onClick={() => setActiveTab("activity")}
                    className="flex items-center justify-between p-4 bg-gradient-to-r from-orange-500/20 to-red-500/20 border border-orange-500/30 rounded-lg hover:from-orange-500/30 hover:to-red-500/30 transition-all"
                  >
                    <div className="flex items-center space-x-3">
                      <TrendingUp className="w-5 h-5 text-orange-400" />
                      <span>View Analytics</span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-gray-400" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Enhanced product listings section */}
          {getSortedAndFilteredProducts(userProducts, true).length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {getSortedAndFilteredProducts(userProducts, true).map((product) => (
                <div
                  key={product.id}
                  className="bg-gray-700/30 rounded-xl overflow-hidden border border-gray-600/50 hover:border-cyan-500/50 transition-all group"
                >
                  <div className="relative">
                    <img
                      src={
                        product.image_url ||
                        "https://via.placeholder.com/300"
                      }
                      alt={product.title}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                      onClick={() => handleViewProduct(product.id)}
                    />
                    <div className="absolute top-2 right-2 flex space-x-2">
                      <button 
                        onClick={() => handleDeleteProduct(product.id)}
                        className="p-2 bg-red-600/80 rounded-full text-white hover:bg-red-700/90 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <button className="p-2 bg-gray-900/80 rounded-full text-gray-300 hover:text-white transition-colors">
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                    </div>
                    {product.status === "sold" && (
                      <div className="absolute top-2 left-2 bg-green-500 text-white px-2 py-1 rounded-md text-xs font-medium">
                        Sold
                      </div>
                    )}
                    {product.status === "pending" && (
                      <div className="absolute top-2 left-2 bg-yellow-500 text-white px-2 py-1 rounded-md text-xs font-medium">
                        Pending
                      </div>
                    )}
                    {product.status === "active" && (
                      <div className="absolute top-2 left-2 bg-blue-500 text-white px-2 py-1 rounded-md text-xs font-medium">
                        Active
                      </div>
                    )}
                  </div>

                  <div className="p-4">
                    <h4 className="font-semibold text-white mb-1 truncate">
                      {product.title}
                    </h4>
                    <p className="text-sm text-gray-300 mb-2 line-clamp-2">
                      {product.description}
                    </p>
                    <p className="text-cyan-400 font-medium mb-2">
                      ₹{product.points?.toLocaleString() || 0}
                    </p>
                    <p className="text-gray-400 text-xs mb-3">
                      {product.category}
                    </p>

                    <div className="flex items-center justify-between text-sm text-gray-400 mb-3">
                      <div className="flex items-center space-x-4">
                        <span className="flex items-center">
                          <Eye className="w-3 h-3 mr-1" />
                          {product.views || 0}
                        </span>
                        <span className="flex items-center">
                          <Heart className="w-3 h-3 mr-1" />
                          {product.likes || 0}
                        </span>
                        {product.rating && product.rating > 0 && (
                          <span className="flex items-center">
                            <Star className="w-3 h-3 mr-1 text-yellow-400" />
                            {product.rating.toFixed(1)}
                          </span>
                        )}
                      </div>
                      <span className="text-xs">
                        {formatTimeAgo(product.created_at)}
                      </span>
                    </div>

                    <div className="flex space-x-2">
                      <button 
                        onClick={() => router.push(`/pages/edit-product/${product.id}`)}
                        className="flex-1 bg-gray-600 hover:bg-gray-500 text-white py-2 rounded-md text-sm transition-colors flex items-center justify-center"
                      >
                        <Edit className="w-4 h-4 mr-1" />
                        Edit
                      </button>
                      <button 
                        onClick={() => handleLikeProduct(product.id)}
                        className="flex-1 bg-gray-600 hover:bg-gray-500 text-white py-2 rounded-md text-sm transition-colors flex items-center justify-center"
                      >
                        <Heart className="w-4 h-4 mr-1" />
                        Like
                      </button>
                      <button className="flex-1 bg-gray-600 hover:bg-gray-500 text-white py-2 rounded-md text-sm transition-colors flex items-center justify-center">
                        <Share2 className="w-4 h-4 mr-1" />
                        Share
                      </button>
                    </div>

                    {/* Additional product info */}
                    <div className="mt-3 pt-3 border-t border-gray-600/50">
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>Created: {new Date(product.created_at).toLocaleDateString()}</span>
                        {product.updated_at && (
                          <span>Updated: {new Date(product.updated_at).toLocaleDateString()}</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Package className="w-16 h-16 text-gray-500 mx-auto mb-4" />
              <p className="text-gray-400 mb-2">
                {filterStatus === "all" ? "You have no listings yet." : `No ${filterStatus} listings found.`}
              </p>
              <p className="text-gray-500 text-sm mb-4">
                Create your first listing to start selling on the marketplace.
              </p>
              <button
                onClick={() => router.push("/pages/sell")}
                className="bg-gradient-to-r from-cyan-500 to-emerald-600 text-white px-6 py-3 rounded-lg hover:from-cyan-600 hover:to-emerald-700 transition-all flex items-center mx-auto"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Your First Listing
              </button>
            </div>
          )}

          {activeTab === "activity" && (
            <div className="bg-gray-800/50 backdrop-blur-md border border-gray-700/50 rounded-xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold flex items-center">
                  <Clock className="w-5 h-5 mr-2" />
                  Activity History
                </h3>
                <button
                  onClick={refreshData}
                  disabled={refreshing}
                  className="flex items-center text-gray-400 hover:text-white transition-colors"
                >
                  <RefreshCw
                    className={`w-4 h-4 mr-2 ${
                      refreshing ? "animate-spin" : ""
                    }`}
                  />
                  {refreshing ? "Refreshing..." : "Refresh"}
                </button>
              </div>

              <div className="space-y-4 max-h-96 overflow-y-auto">
                {recentActivity.length > 0 ? (
                  recentActivity.map((activity) => (
                    <div
                      key={activity.id}
                      className="flex items-start space-x-4 p-4 bg-gray-700/30 rounded-lg hover:bg-gray-700/50 transition-colors"
                    >
                      <div className="flex-shrink-0 mt-1">{activity.icon}</div>
                      <div className="flex-1">
                        <p className="text-white font-medium">
                          {activity.title}
                        </p>
                        <p className="text-gray-400 text-sm">{activity.time}</p>
                        {activity.product && (
                          <p className="text-gray-500 text-xs mt-1">
                            Category: {activity.product.category}
                          </p>
                        )}
                      </div>
                      {activity.type === "item_sold" && (
                        <div className="text-emerald-400 text-sm font-medium">
                          +₹{activity.product?.points?.toLocaleString() || 0}
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12">
                    <Clock className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                    <p className="text-gray-400">No recent activity</p>
                    <p className="text-gray-500 text-sm">
                      Your activity will appear here when you create listings or
                      make sales.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === "marketplace" && (
            <div className="bg-gray-800/50 backdrop-blur-md border border-gray-700/50 rounded-xl p-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 space-y-4 sm:space-y-0">
                <h3 className="text-xl font-semibold flex items-center">
                  <ShoppingBag className="w-5 h-5 mr-2" />
                  Marketplace ({allProducts.length} items)
                </h3>

                <div className="flex items-center space-x-3">
                  <button
                    onClick={refreshData}
                    disabled={refreshing}
                    className="flex items-center text-gray-400 hover:text-white transition-colors"
                  >
                    <RefreshCw
                      className={`w-4 h-4 mr-2 ${
                        refreshing ? "animate-spin" : ""
                      }`}
                    />
                    {refreshing ? "Refreshing..." : "Refresh"}
                  </button>
                </div>
              </div>

              {allProducts.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {allProducts.map((product) => (
                    <div
                      key={product.id}
                      className="bg-gray-700/30 rounded-xl overflow-hidden border border-gray-600/50 hover:border-cyan-500/50 transition-all group cursor-pointer"
                      onClick={() => handleViewProduct(product.id)}
                    >
                      <div className="relative">
                        <img
                          src={
                            product.image_url ||
                            "https://via.placeholder.com/300"
                          }
                          alt={product.title}
                          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        {product.status === "sold" && (
                          <div className="absolute top-2 left-2 bg-green-500 text-white px-2 py-1 rounded-md text-xs font-medium">
                            Sold
                          </div>
                        )}
                        <div className="absolute top-2 right-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleLikeProduct(product.id);
                            }}
                            className="p-2 bg-gray-900/80 rounded-full text-gray-300 hover:text-red-400 transition-colors"
                          >
                            <Heart className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      <div className="p-4">
                        <h4 className="font-semibold text-white mb-1 truncate">
                          {product.title}
                        </h4>
                        <p className="text-sm text-gray-300 mb-2 line-clamp-2">
                          {product.description}
                        </p>
                        <p className="text-cyan-400 font-medium mb-2">
                          ₹{product.points?.toLocaleString() || 0}
                        </p>
                        <p className="text-gray-400 text-xs mb-3">
                          {product.category}
                        </p>

                        <div className="flex items-center justify-between text-sm text-gray-400 mb-3">
                          <div className="flex items-center space-x-4">
                            <span className="flex items-center">
                              <Eye className="w-3 h-3 mr-1" />
                              {product.views || 0}
                            </span>
                            <span className="flex items-center">
                              <Heart className="w-3 h-3 mr-1" />
                              {product.likes || 0}
                            </span>
                            {product.rating && product.rating > 0 && (
                              <span className="flex items-center">
                                <Star className="w-3 h-3 mr-1 text-yellow-400" />
                                {product.rating.toFixed(1)}
                              </span>
                            )}
                          </div>
                          <span className="text-xs">
                            {formatTimeAgo(product.created_at)}
                          </span>
                        </div>

                        <div className="flex space-x-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleLikeProduct(product.id);
                            }}
                            className="flex-1 bg-gray-600 hover:bg-gray-500 text-white py-2 rounded-md text-sm transition-colors flex items-center justify-center"
                          >
                            <Heart className="w-4 h-4 mr-1" />
                            Like
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              // Handle contact seller
                            }}
                            className="flex-1 bg-cyan-600 hover:bg-cyan-500 text-white py-2 rounded-md text-sm transition-colors flex items-center justify-center"
                          >
                            <MessageCircle className="w-4 h-4 mr-1" />
                            Contact
                          </button>
                        </div>

                        {/* Seller info */}
                        <div className="mt-3 pt-3 border-t border-gray-600/50">
                          <div className="flex items-center justify-between text-xs text-gray-500">
                            <span>
                              Seller: {product.owner?.first_name || "Unknown"}
                            </span>
                            <span>
                              {new Date(
                                product.created_at
                              ).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <ShoppingBag className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                  <p className="text-gray-400">No items in marketplace</p>
                  <p className="text-gray-500 text-sm">
                    Be the first to add an item to the marketplace!
                  </p>
                </div>
              )}
            </div>
          )}

          {activeTab === "messages" && (
            <div className="bg-gray-800/50 backdrop-blur-md border border-gray-700/50 rounded-xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold flex items-center">
                  <MessageCircle className="w-5 h-5 mr-2" />
                  Messages
                </h3>
                <button
                  onClick={refreshData}
                  disabled={refreshing}
                  className="flex items-center text-gray-400 hover:text-white transition-colors"
                >
                  <RefreshCw
                    className={`w-4 h-4 mr-2 ${
                      refreshing ? "animate-spin" : ""
                    }`}
                  />
                  {refreshing ? "Refreshing..." : "Refresh"}
                </button>
              </div>

              <div className="text-center py-12">
                <MessageCircle className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                <p className="text-gray-400">No messages yet</p>
                <p className="text-gray-500 text-sm">
                  When you receive messages from other users, they'll appear
                  here.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  </>
);
};

export default Dashboard;
