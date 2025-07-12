"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
    LogOut,
    Settings,
    ShoppingBag,
    Heart,
    MessageCircle,
    Plus,
    Search,
    Filter,
    Star,
    TrendingUp,
    Eye,
    Calendar,
    DollarSign,
    Package,
    Users,
    ArrowRight,
    ArrowLeft,
    Edit,
    Trash2,
    Share2,
    MoreHorizontal
} from "lucide-react";
import Navbar from "@/app/components/navbar/page.jsx";
import Footer from "@/app/components/footer/page.jsx";

const Dashboard = () => {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("overview");
    const router = useRouter();

    // Mock user data
    const mockUser = {
        email: "user@example.com",
        name: "Alex Johnson",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
        is_verified: true,
        created_at: "2024-01-15",
        stats: {
            totalListings: 12,
            activeListings: 8,
            totalViews: 156,
            totalLikes: 23,
            totalExchanges: 5,
            totalEarnings: 19920 // ₹19,920 (240 USD * 83 INR)
        }
    };

    // Mock listings data
    const mockListings = [
        {
            id: 1,
            title: "Vintage Denim Jacket",
            price: 3735, // ₹3,735 (45 USD * 83 INR)
            status: "active",
            views: 23,
            likes: 8,
            image: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=300&h=300&fit=crop",
            category: "Jackets",
            created_at: "2024-01-20"
        },
        {
            id: 2,
            title: "Summer Floral Dress",
            price: 2905, // ₹2,905 (35 USD * 83 INR)
            status: "active",
            views: 18,
            likes: 12,
            image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300&h=300&fit=crop",
            category: "Dresses",
            created_at: "2024-01-18"
        },
        {
            id: 3,
            title: "Leather Crossbody Bag",
            price: 4565, // ₹4,565 (55 USD * 83 INR)
            status: "sold",
            views: 45,
            likes: 15,
            image: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=300&h=300&fit=crop",
            category: "Accessories",
            created_at: "2024-01-15"
        }
    ];

    // Mock recent activity
    const mockActivity = [
        {
            id: 1,
            type: "listing_created",
            title: "New listing: Vintage Denim Jacket",
            time: "2 hours ago",
            icon: <Plus className="w-4 h-4 text-green-400" />
        },
        {
            id: 2,
            type: "message_received",
            title: "Message from Sarah about Summer Dress",
            time: "4 hours ago",
            icon: <MessageCircle className="w-4 h-4 text-blue-400" />
        },
        {
            id: 3,
            type: "item_sold",
            title: "Leather Crossbody Bag sold for ₹4,565",
            time: "1 day ago",
            icon: <DollarSign className="w-4 h-4 text-emerald-400" />
        },
        {
            id: 4,
            type: "new_like",
            title: "Your Vintage Jacket got 3 new likes",
            time: "2 days ago",
            icon: <Heart className="w-4 h-4 text-pink-400" />
        }
    ];

    useEffect(() => {
        // Simulate loading user data
        setTimeout(() => {
            setUser(mockUser);
            setIsLoading(false);
        }, 1000);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
        router.push("/");
    };

    const handleCreateListing = () => {
        router.push("/create-listing");
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
            <Navbar />

            {/* Back Button */}
            <div className="pt-20 px-4">
                <button
                    onClick={() => router.back()}
                    className="flex items-center text-gray-400 hover:text-white transition-colors mb-6"
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back
                </button>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
                    <div className="flex items-center space-x-4 mb-4 md:mb-0">
                        <div className="w-16 h-16 rounded-full overflow-hidden bg-gradient-to-r from-cyan-500 to-emerald-600">
                            <img
                                src={user.avatar}
                                alt={user.name}
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-white">Welcome back, {user.name}!</h1>
                            <p className="text-gray-400">{user.email}</p>
                        </div>
                    </div>
                    <div className="flex space-x-3">
                        <button
                            onClick={handleCreateListing}
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

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div className="bg-gray-800/50 backdrop-blur-md border border-gray-700/50 rounded-xl p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-400 text-sm">Active Listings</p>
                                <p className="text-2xl font-bold text-white">{user.stats.activeListings}</p>
                            </div>
                            <ShoppingBag className="w-8 h-8 text-cyan-400" />
                        </div>
                    </div>

                    <div className="bg-gray-800/50 backdrop-blur-md border border-gray-700/50 rounded-xl p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-400 text-sm">Total Views</p>
                                <p className="text-2xl font-bold text-white">{user.stats.totalViews}</p>
                            </div>
                            <Eye className="w-8 h-8 text-emerald-400" />
                        </div>
                    </div>

                    <div className="bg-gray-800/50 backdrop-blur-md border border-gray-700/50 rounded-xl p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-400 text-sm">Total Likes</p>
                                <p className="text-2xl font-bold text-white">{user.stats.totalLikes}</p>
                            </div>
                            <Heart className="w-8 h-8 text-pink-400" />
                        </div>
                    </div>

                    <div className="bg-gray-800/50 backdrop-blur-md border border-gray-700/50 rounded-xl p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-400 text-sm">Total Earnings</p>
                                <p className="text-2xl font-bold text-white">₹{user.stats.totalEarnings.toLocaleString()}</p>
                            </div>
                            <DollarSign className="w-8 h-8 text-yellow-400" />
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex space-x-1 bg-gray-800/50 rounded-lg p-1 mb-8">
                    {[
                        { id: "overview", label: "Overview", icon: <TrendingUp className="w-4 h-4" /> },
                        { id: "listings", label: "My Listings", icon: <Package className="w-4 h-4" /> },
                        { id: "activity", label: "Activity", icon: <Calendar className="w-4 h-4" /> },
                        { id: "messages", label: "Messages", icon: <MessageCircle className="w-4 h-4" /> }
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
                                <h3 className="text-xl font-semibold mb-4">Recent Activity</h3>
                                <div className="space-y-4">
                                    {mockActivity.map((activity) => (
                                        <div key={activity.id} className="flex items-start space-x-3 p-3 bg-gray-700/30 rounded-lg">
                                            <div className="flex-shrink-0 mt-1">
                                                {activity.icon}
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-white font-medium">{activity.title}</p>
                                                <p className="text-gray-400 text-sm">{activity.time}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Quick Actions */}
                            <div className="bg-gray-800/50 backdrop-blur-md border border-gray-700/50 rounded-xl p-6">
                                <h3 className="text-xl font-semibold mb-4">Quick Actions</h3>
                                <div className="grid grid-cols-1 gap-3">
                                    <button
                                        onClick={handleCreateListing}
                                        className="flex items-center justify-between p-4 bg-gradient-to-r from-cyan-500/20 to-emerald-500/20 border border-cyan-500/30 rounded-lg hover:from-cyan-500/30 hover:to-emerald-500/30 transition-all"
                                    >
                                        <div className="flex items-center space-x-3">
                                            <Plus className="w-5 h-5 text-cyan-400" />
                                            <span>Create New Listing</span>
                                        </div>
                                        <ArrowRight className="w-4 h-4 text-gray-400" />
                                    </button>

                                    <button className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-lg hover:from-purple-500/30 hover:to-pink-500/30 transition-all">
                                        <div className="flex items-center space-x-3">
                                            <Search className="w-5 h-5 text-purple-400" />
                                            <span>Browse Items</span>
                                        </div>
                                        <ArrowRight className="w-4 h-4 text-gray-400" />
                                    </button>

                                    <button className="flex items-center justify-between p-4 bg-gradient-to-r from-orange-500/20 to-red-500/20 border border-orange-500/30 rounded-lg hover:from-orange-500/30 hover:to-red-500/30 transition-all">
                                        <div className="flex items-center space-x-3">
                                            <Settings className="w-5 h-5 text-orange-400" />
                                            <span>Account Settings</span>
                                        </div>
                                        <ArrowRight className="w-4 h-4 text-gray-400" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === "listings" && (
                        <div className="bg-gray-800/50 backdrop-blur-md border border-gray-700/50 rounded-xl p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-xl font-semibold">My Listings</h3>
                                <button
                                    onClick={handleCreateListing}
                                    className="bg-gradient-to-r from-cyan-500 to-emerald-600 text-white px-4 py-2 rounded-lg hover:from-cyan-600 hover:to-emerald-700 transition-all flex items-center"
                                >
                                    <Plus className="w-4 h-4 mr-2" />
                                    Add New
                                </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {mockListings.map((listing) => (
                                    <div key={listing.id} className="bg-gray-700/30 rounded-xl overflow-hidden border border-gray-600/50 hover:border-cyan-500/50 transition-all">
                                        <div className="relative">
                                            <img
                                                src={listing.image}
                                                alt={listing.title}
                                                className="w-full h-48 object-cover"
                                            />
                                            <div className="absolute top-2 right-2">
                                                <button className="p-2 bg-gray-900/80 rounded-full text-gray-300 hover:text-white transition-colors">
                                                    <MoreHorizontal className="w-4 h-4" />
                                                </button>
                                            </div>
                                            {listing.status === "sold" && (
                                                <div className="absolute top-2 left-2 bg-green-500 text-white px-2 py-1 rounded-md text-xs font-medium">
                                                    Sold
                                                </div>
                                            )}
                                        </div>

                                        <div className="p-4">
                                            <h4 className="font-semibold text-white mb-2">{listing.title}</h4>
                                            <p className="text-cyan-400 font-medium mb-2">₹{listing.price.toLocaleString()}</p>
                                            <p className="text-gray-400 text-sm mb-3">{listing.category}</p>

                                            <div className="flex items-center justify-between text-sm text-gray-400 mb-4">
                                                <span>{listing.views} views</span>
                                                <span>{listing.likes} likes</span>
                                            </div>

                                            <div className="flex space-x-2">
                                                <button className="flex-1 bg-gray-600 hover:bg-gray-500 text-white py-2 rounded-md text-sm transition-colors flex items-center justify-center">
                                                    <Edit className="w-4 h-4 mr-1" />
                                                    Edit
                                                </button>
                                                <button className="flex-1 bg-gray-600 hover:bg-gray-500 text-white py-2 rounded-md text-sm transition-colors flex items-center justify-center">
                                                    <Share2 className="w-4 h-4 mr-1" />
                                                    Share
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {activeTab === "activity" && (
                        <div className="bg-gray-800/50 backdrop-blur-md border border-gray-700/50 rounded-xl p-6">
                            <h3 className="text-xl font-semibold mb-6">Activity History</h3>
                            <div className="space-y-4">
                                {mockActivity.map((activity) => (
                                    <div key={activity.id} className="flex items-start space-x-4 p-4 bg-gray-700/30 rounded-lg">
                                        <div className="flex-shrink-0 mt-1">
                                            {activity.icon}
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-white font-medium">{activity.title}</p>
                                            <p className="text-gray-400 text-sm">{activity.time}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {activeTab === "messages" && (
                        <div className="bg-gray-800/50 backdrop-blur-md border border-gray-700/50 rounded-xl p-6">
                            <h3 className="text-xl font-semibold mb-6">Messages</h3>
                            <div className="text-center py-12">
                                <MessageCircle className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                                <p className="text-gray-400">No messages yet</p>
                                <p className="text-gray-500 text-sm">When you receive messages from other users, they'll appear here.</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default Dashboard;