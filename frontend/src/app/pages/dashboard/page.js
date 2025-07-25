"use client";
import DashboardNavbar from "@/app/components/dashboardnavbar/page";
import {
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
  Share2,
  ShoppingBag,
  Star,
  Trash2,
  TrendingUp
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [showShareModal, setShowShareModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [isLiked, setIsLiked] = useState(false);
  const [allProducts, setAllProducts] = useState([]);
  const [userProducts, setUserProducts] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [stats, setStats] = useState({});
  const [refreshing, setRefreshing] = useState(false);
  const [sortBy, setSortBy] = useState("created_at");
  const [sortOrder, setSortOrder] = useState("desc");
  const [filterStatus, setFilterStatus] = useState("all");
  const [messages, setMessages] = useState([]);
  const [isDarkMode, setIsDarkMode] = useState();
  const [likedProductIds, setLikedProductIds] = useState(new Set());
  const router = useRouter();
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product?.title || "Product",
        text: product?.description || "Check out this product",
        url: window.location.href,
      });
    } else {
      setShowShareModal(true);
    }
  };

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setShowShareModal(false);
  };

  const shareToSocial = (platform) => {
    const url = window.location.href;
    const text = `Check out this ${product?.title || "product"}!`;

    const shareUrls = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
        url
      )}`,
      twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(
        url
      )}&text=${encodeURIComponent(text)}`,
      instagram: `https://www.instagram.com/`,
      whatsapp: `https://api.whatsapp.com/send?text=${encodeURIComponent(
        text
      )} ${encodeURIComponent(url)}`,
    };

    if (shareUrls[platform]) {
      window.open(shareUrls[platform], "_blank");
    }
    setShowShareModal(false);
  };

  const API_BASE_URL = "http://127.0.0.1:8000";

  // Get auth headers
  const getAuthHeaders = useCallback(() => {
    const token = localStorage.getItem("token");
    return {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };
  }, []);

  const handleLikeProduct = async (productId) => {
    try {
      const res = await fetch(`${API_BASE_URL}/items/items/${productId}/like/`, {
        method: "POST",
        headers: getAuthHeaders(),
      });
      if (res.ok) {
        // Toggle liked state locally
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

  // Generate recent activity from user's products
  const generateRecentActivity = useCallback((userProducts) => {
    const activities = [];

    userProducts.forEach((product) => {
      const createdDate = new Date(product.created_at);
      const now = new Date();
      const timeDiff = now - createdDate;
      const hoursDiff = timeDiff / (1000 * 60 * 60);

      if (hoursDiff < 168) {
        activities.push({
          id: `created_${product.id}`,
          type: "listing_created",
          title: `New listing: ${product.title}`,
          time: formatTimeAgo(createdDate),
          icon: <Plus className="w-4 h-4 text-emerald-400" />,
          product: product,
        });
      }

      if (product.status === "sold" && product.sold_at) {
        const soldDate = new Date(product.sold_at);
        const soldHoursDiff = (now - soldDate) / (1000 * 60 * 60);

        if (soldHoursDiff < 168) {
          activities.push({
            id: `sold_${product.id}`,
            type: "item_sold",
            title: `${product.title} sold for ₹${product.points}`,
            time: formatTimeAgo(soldDate),
            icon: <DollarSign className="w-4 h-4 text-green-400" />,
            product: product,
          });
        }
      }

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

    if (diffHours < 1) { return "Just now" };
    if (diffHours < 24) {
      return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`
    };
    if (diffDays < 7) { return `${diffDays} day${diffDays > 1 ? "s" : ""} ago` };
    { return new Date(date).toLocaleDateString() };
  };

  const handleDeleteProduct = async (productId) => {
    const token = localStorage.getItem("token");
    if (token) {
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

  // Theme classes (simplified as Tailwind's dark mode utility classes will handle most of it)
  const themeClasses = {
    bg: "bg-gray-100 dark:bg-gray-900",
    cardBg: "bg-white dark:bg-gray-800",
    text: "text-gray-900 dark:text-white",
    textSecondary: "text-gray-600 dark:text-gray-300",
    textMuted: "text-gray-500 dark:text-gray-400",
    border: "border-gray-200 dark:border-gray-700",
    hover: "hover:bg-gray-50 dark:hover:bg-gray-700",
    accent: "bg-gradient-to-r from-blue-500 to-purple-500 dark:from-purple-600 dark:to-blue-600",
    accentSecondary: "bg-gradient-to-r from-emerald-500 to-teal-500 dark:from-emerald-600 dark:to-teal-600",
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-slate-950">
        <div className="relative">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-slate-700 border-t-indigo-500"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-indigo-500 rounded-full opacity-20 animate-pulse"></div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div
        className={`min-h-screen ${themeClasses.bg} flex items-center justify-center`}
      >
        <div className="text-center">
          <p className={`${themeClasses.textMuted} mb-4 text-lg`}>
            Unable to load user data
          </p>
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg transition-colors"
          >
            Return to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div
        className={`min-h-screen ${themeClasses.bg} transition-colors duration-300`}
      >
        <DashboardNavbar />

        {/* Main Content */}
        <div className="pt-20">
          {/* Header Section */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
              {/* Action Buttons */}
              <div className="flex items-center space-x-4">
               

                <button
                  onClick={() => router.push("/pages/sell")}
                  className={`${themeClasses.accent} text-white px-6 py-3 rounded-lg hover:shadow-lg transition-all flex items-center`}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create Listing
                </button>

                <button
                  onClick={handleLogout}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-3 rounded-lg transition-colors flex items-center"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </button>
              </div>
            </div>
          </div>

          

          {/* Navigation Tabs */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
            <div
              className={`${themeClasses.cardBg} rounded-2xl p-2 ${themeClasses.border} border shadow-lg`}
            >
              <nav className="flex space-x-2">
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
                    className={`flex items-center space-x-2 px-4 py-3 rounded-lg transition-all font-medium ${activeTab === tab.id
                      ? "bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg"
                      : `${themeClasses.text} ${themeClasses.hover}`
                      }`}
                  >
                    {tab.icon}
                    <span>{tab.label}</span>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Tab Content */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
            {activeTab === "overview" && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Recent Activity */}
                <div
                  className={`${themeClasses.cardBg} rounded-2xl p-6 ${themeClasses.border} border shadow-lg`}
                >
                  <h3
                    className={`${themeClasses.text} text-xl font-semibold mb-6 flex items-center`}
                  >
                    <Clock className="w-5 h-5 mr-2" />
                    Recent Activity
                  </h3>
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {recentActivity.length > 0 ? (
                      recentActivity.map((activity) => (
                        <div
                          key={activity.id}
                          className={`flex items-start space-x-3 p-4 rounded-lg ${themeClasses.hover} transition-colors`}
                        >
                          <div className="flex-shrink-0 mt-1">
                            {activity.icon}
                          </div>
                          <div className="flex-1">
                            <p className={`${themeClasses.text} font-medium`}>
                              {activity.title}
                            </p>
                            <p
                              className={`${themeClasses.textMuted} text-sm mt-1`}
                            >
                              {activity.time}
                            </p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8">
                        <Clock
                          className={`w-12 h-12 ${themeClasses.textMuted} mx-auto mb-3`}
                        />
                        <p className={themeClasses.textMuted}>
                          No recent activity
                        </p>
                      </div>
                    )}
                  </div>
                </div>

              </div>
            )}
            {activeTab === "listings" && (
              <div>
                {getSortedAndFilteredProducts(userProducts, true).length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {getSortedAndFilteredProducts(userProducts, true).map(
                      (product) => (
                        <div
                          key={product.id}
                          className={`${themeClasses.cardBg} rounded-xl overflow-hidden border ${themeClasses.border} hover:border-cyan-500/50 transition-all group shadow-lg`}
                        >
                          <div className="relative">
                            <img
                              src={
                                (product.images && product.images.length > 0 && product.images[0].image) ||
                                "https://via.placeholder.com/300"
                              }
                              alt={product.title}
                              className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
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
                            <h4
                              className={`font-semibold ${themeClasses.text} mb-1 truncate`}
                            >
                              {product.title}
                            </h4>
                            <p
                              className={`text-sm ${themeClasses.textSecondary} mb-2 line-clamp-2`}
                            >
                              {product.description}
                            </p>
                            <p className="text-cyan-400 font-medium mb-2">
                              ₹{product.points?.toLocaleString() || 0}
                            </p>
                            <p
                              className={`${themeClasses.textMuted} text-xs mb-3`}
                            >
                              {product.category}
                            </p>

                            <div
                              className={`flex items-center justify-between text-sm ${themeClasses.textMuted} mb-3`}
                            >
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
                                onClick={() =>
                                  router.push(`/pages/updateproduct/${product.id}`)
                                }
                                className={`flex-1 ${themeClasses.cardBg} ${themeClasses.border} border ${themeClasses.hover} ${themeClasses.text} py-2 rounded-md text-sm transition-colors flex items-center justify-center`}
                              >
                                <Edit className="w-4 h-4 mr-1" />
                                Edit
                              </button>
                              <button
                                onClick={() => setIsLiked(!isLiked)}
                                className={`p-2 rounded-full transition-all ${likedProductIds.has(product.id)
                                  ? "bg-red-500/20 text-red-400"
                                  : `${themeClasses.cardBg} ${themeClasses.textMuted} hover:text-red-400`
                                  }`}
                              >
                                <Heart
                                  className={`w-5 h-5 ${likedProductIds.has(product.id) ? "fill-current" : ""
                                    }`}
                                />
                              </button>
                              <button
                                onClick={handleShare}
                                className={`p-2 ${themeClasses.cardBg} rounded-full ${themeClasses.textMuted} hover:text-white transition-colors`}
                              >
                                <Share2 className="w-5 h-5" />
                              </button>
                            </div>

                            {/* Additional product info */}
                            <div
                              className={`mt-3 pt-3 border-t ${themeClasses.border}`}
                            >
                              <div
                                className={`flex items-center justify-between text-xs ${themeClasses.textMuted}`}
                              >
                                <span>
                                  Created:{" "}
                                  {new Date(
                                    product.created_at
                                  ).toLocaleDateString()}
                                </span>
                                {product.updated_at && (
                                  <span>
                                    Updated:{" "}
                                    {new Date(
                                      product.updated_at
                                    ).toLocaleDateString()}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      )
                    )}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Package
                      className={`w-16 h-16 ${themeClasses.textMuted} mx-auto mb-4`}
                    />
                    <p className={`${themeClasses.textMuted} mb-2`}>
                      {filterStatus === "all"
                        ? "You have no listings yet."
                        : `No ${filterStatus} listings found.`}
                    </p>
                    <p className={`${themeClasses.textMuted} text-sm mb-4`}>
                      Create your first listing to start selling on the
                      marketplace.
                    </p>
                    <button
                      onClick={() => console.log("Create listing")}
                      className="bg-gradient-to-r from-cyan-500 to-emerald-600 text-white px-6 py-3 rounded-lg hover:from-cyan-600 hover:to-emerald-700 transition-all flex items-center mx-auto"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Create Your First Listing
                    </button>
                  </div>
                )}
              </div>
            )}

            {activeTab === "activity" && (
              <div className="bg-gray-800/50 backdrop-blur-md border border-gray-700/50 rounded-xl p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold flex items-center">
                    <Clock className="w-5 h-5 mr-2" />
                    Activity History
                  </h3>

                </div>

                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {recentActivity.length > 0 ? (
                    recentActivity.map((activity) => (
                      <div
                        key={activity.id}
                        className="flex items-start space-x-4 p-4 bg-gray-700/30 rounded-lg hover:bg-gray-700/50 transition-colors"
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
                        Your activity will appear here when you create listings
                        or make sales.
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
                        className={`w-4 h-4 mr-2 ${refreshing ? "animate-spin" : ""
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
                        onClick={() => router.push(`/pages/productdetails/${product.id}`)}
                      >
                        <div className="relative">
                          <img
                            src={
                              (product.images && product.images.length > 0 && product.images[0].image) ||
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
                      className={`w-4 h-4 mr-2 ${refreshing ? "animate-spin" : ""
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
      </div>
    </>
  );
}
