"use client";
import {
  ArrowLeft,
  Heart,
  Share2,
  Star,
  Tag,
  ZoomIn,
  RotateCcw,
  RefreshCw,
  Shield,
  Truck,
  MessageCircle,
  CheckCircle,
  Award,
  Users,
  MapPin,
  Clock,
  Eye,
  ThumbsUp,
  Send,
  X,
  Copy,
  Facebook,
  Twitter,
  Instagram
} from 'lucide-react';
import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

const ProductDetailsPage = () => {
  const { id } = useParams();
  const router = useRouter();
const imageRef = useRef(null);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 50, y: 50 });
  const [is360Mode, setIs360Mode] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [user, setUser] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [userRating, setUserRating] = useState(0);
  const [ratingComment, setRatingComment] = useState('');
  const [showContactModal, setShowContactModal] = useState(false);
  const [message, setMessage] = useState('');
  const [hasUserPurchased, setHasUserPurchased] = useState(false);


  const getAuthHeaders = useCallback(() => {
    const token = localStorage.getItem("token");
    return {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };
  }, []);
  const API_BASE_URL = "http://127.0.0.1:8000";

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
          rating: userData.rating || 'N/A',
          total_swaps: userData.total_swaps || 0,
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

  // Define handleLogout to clear token and redirect to login or landing page
  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/pages/landingpage");
  };

  useEffect(() => {
    async function fetchProduct() {
      try {
        const res = await fetch(`http://127.0.0.1:8000/items/items/${id}/`);
        if (res.ok) {
          const data = await res.json();
          setProduct(data);
        } else {
          setProduct(null);
        }
      } catch (err) {
        setProduct(null);
      } finally {
        setLoading(false);
      }
    }
    fetchProduct();
  }, [id]);

  const refreshData = useCallback(async () => {
    setRefreshing(true);
    try {
      await Promise.all([
        fetchUserProfile(),
      ]);
    } finally {
      setRefreshing(false);
    }
  }, [fetchUserProfile]);

  // Initial data fetch
  useEffect(() => {
    const initializeData = async () => {
      setLoading(true);
      const token = localStorage.getItem("token");

      if (!token) {
        router.push("/pages/landingpage");
        return;
      }

      try {
        const userData = await fetchUserProfile();
        if (userData) {
          // Additional initialization if needed
        }
      } catch (err) {
        console.error("Failed to initialize data:", err);
        router.push("/pages/landingpage");
      } finally {
        setLoading(false);
      }
    };

    initializeData();
  }, [router, fetchUserProfile]);

  // Properly define handleMouseMove function
  const handleMouseMove = (e) => {
    if (!isZoomed || !imageRef.current) return;
    const rect = imageRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomPosition({ x, y });
  };

  const handle360Start = (e) => {
    if (!is360Mode) return;
    setIsDragging(true);
    setStartX(e.clientX);
  };

  const handle360End = () => {
    setIsDragging(false);
  };

  const handle360Move = (e) => {
    if (!is360Mode || !isDragging) return;
    const rect = imageRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const deltaX = x - rect.width / 2;
    setRotation(prev => prev + deltaX * 0.5);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product?.title || 'Product',
        text: product?.description || 'Check out this product',
        url: window.location.href
      });
    } else {
      setShowShareModal(true);
    }
  };

  const handleRating = (rating) => {
    setUserRating(rating);
  };

  const submitRating = () => {
    console.log('Rating submitted:', userRating, ratingComment);
    setShowRatingModal(false);
    setUserRating(0);
    setRatingComment('');
  };

  const handleContactSeller = () => {
    setShowContactModal(true);
  };

  const sendMessage = () => {
    console.log('Message sent:', message);
    setMessage('');
    setShowContactModal(false);
  };

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    alert('Link copied to clipboard!');
  };

  const shareToSocial = (platform) => {
    const url = window.location.href;
    const text = `Check out this ${product?.title || 'product'}!`;

    const shareUrls = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`,
      instagram: `https://www.instagram.com/` // Instagram doesn't support direct sharing
    };

    if (shareUrls[platform]) {
      window.open(shareUrls[platform], '_blank');
    }
    setShowShareModal(false);
  };

  // Mock purchase check - replace with actual logic
  const handleSwapRequest = () => {
    setHasUserPurchased(true);
    alert("Swap Request submitted successfully!");
  };

  const handlePointsRedeem = () => {
    setHasUserPurchased(true);
    alert("Points redemption successful!");
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-slate-950">
        <div className="relative">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-slate-700 border-t-indigo-500"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-indigo-500 rounded-full opacity-20 animate-pulse"></div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-950 text-white">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto">
            <RefreshCw className="w-8 h-8 text-slate-400" />
          </div>
          <p className="text-slate-300">Product not found or access denied</p>
          <button onClick={() => router.push('/pages/dashboard')} className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors font-medium">
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }
  const currentImages = product.images && product.images.length > 0 ? product.images : ["/placeholder.png"];
  const uploader = product.uploaded_by || {};
  

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-slate-950/95 backdrop-blur-xl border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button className="flex items-center text-slate-400 hover:text-white transition-colors group" onClick={() => router.push('/pages/dashboard')}>
              <ArrowLeft className="mr-2 w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              Back to Dashboard
            </button>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setIsLiked(!isLiked)}
                className={`p-2 rounded-full transition-all ${isLiked ? 'bg-red-500/20 text-red-400' : 'bg-slate-800 text-slate-400 hover:text-red-400'}`}
              >
                <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
              </button>
              <button
                onClick={handleShare}
                className="p-2 bg-slate-800 rounded-full text-slate-400 hover:text-white transition-colors"
              >
                <Share2 className="w-5 h-5" />
              </button>
              {hasUserPurchased && (
                <button
                  onClick={() => setShowRatingModal(true)}
                  className="p-2 bg-amber-600 rounded-full text-white hover:bg-amber-700 transition-colors"
                >
                  <Star className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content - 2 Column Layout */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left Column - Image Gallery */}
          <div className="space-y-6">
            {/* Main Image Display */}
            <div className="relative bg-slate-900 rounded-2xl overflow-hidden group shadow-2xl">
              <div
                ref={imageRef}
                className="relative h-96 md:h-[500px] cursor-crosshair overflow-hidden"
                onMouseMove={(e) => {
                  handleMouseMove(e);
                  handle360Move(e);
                }}
                onMouseEnter={() => setIsZoomed(true)}
                onMouseLeave={() => setIsZoomed(false)}
                onMouseDown={handle360Start}
                onMouseUp={handle360End}
              >
                {currentImages[selectedImageIndex] ? (
                  <img
                    src={currentImages[selectedImageIndex].image || currentImages[selectedImageIndex]}
                    alt={product.title}
                    className={`w-full h-full object-cover transition-transform duration-300 ${isZoomed ? "scale-150" : "scale-100"
                      } ${is360Mode ? "cursor-grab" : "cursor-zoom-in"} ${isDragging ? "cursor-grabbing" : ""
                      }`}
                    style={{
                      transformOrigin: isZoomed
                        ? `${zoomPosition.x}% ${zoomPosition.y}%`
                        : "center",
                      transform: is360Mode
                        ? `scale(${isZoomed ? 1.5 : 1}) rotateY(${rotation}deg)`
                        : undefined,
                    }}
                    draggable={false}
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-slate-500">
                    No Image Available
                  </div>
                )}

                {/* Overlay Controls */}
                <div className="absolute top-4 right-4 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => setIsZoomed(!isZoomed)}
                    className="p-3 bg-slate-900/80 backdrop-blur-sm rounded-full text-white hover:bg-slate-800/80 transition-colors"
                  >
                    <ZoomIn className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => {
                      setIs360Mode(!is360Mode);
                      setRotation(0);
                    }}
                    className={`p-3 rounded-full text-white transition-colors backdrop-blur-sm ${is360Mode
                      ? "bg-indigo-600/80 hover:bg-indigo-700/80"
                      : "bg-slate-900/80 hover:bg-slate-800/80"
                      }`}
                  >
                    <RotateCcw className="w-5 h-5" />
                  </button>
                </div>

                {is360Mode && (
                  <div className="absolute bottom-4 left-4 bg-slate-900/90 backdrop-blur-sm rounded-lg px-4 py-2 text-white text-sm font-medium">
                    360° View - Drag to rotate
                  </div>
                )}

                {/* Status Badge */}
                <div className="absolute top-4 left-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium border ${product.availability
                    ? 'bg-emerald-600/20 text-emerald-300 border-emerald-500/30'
                    : 'bg-red-600/20 text-red-300 border-red-500/30'
                    }`}>
                    {product.availability ? 'Available' : 'Unavailable'}
                  </span>
                </div>
              </div>
            </div>

            {/* Thumbnail Gallery */}
            <div className="flex space-x-3 overflow-x-auto pb-2">
              {currentImages.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImageIndex(index)}
                  className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${selectedImageIndex === index
                    ? 'border-indigo-500 shadow-lg shadow-indigo-500/20'
                    : 'border-slate-700 hover:border-slate-600'
                    }`}
                >
                  <img
                    src={image.image || image}
                    alt={`${product.title} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Right Column - Product Info */}
          <div className="space-y-6">
            {/* Product Header */}
            <div className="bg-slate-900/70 backdrop-blur-sm rounded-2xl p-6 border border-slate-800">
              <div className="space-y-4">
                <div>
                  <h1 className="text-3xl font-bold text-white leading-tight mb-2">
                    {product.title}
                  </h1>
                  <div className="flex items-center space-x-4 text-sm">
                    <div className="flex items-center text-indigo-400">
                      <Tag className="w-4 h-4 mr-1" />
                      <span className="font-medium">{product.category}</span>
                    </div>
                    <div className="flex items-center text-amber-400">
                      <Star className="w-4 h-4 mr-1 fill-current" />
                      <span>4.8 (124 reviews)</span>
                    </div>
                  </div>
                </div>

                {/* Price Section */}
                <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-3xl font-bold text-white">
                      {product.points?.toLocaleString() || 0} points
                    </span>
                    {product.negotiable && (
                      <span className="bg-amber-500/20 text-amber-400 px-3 py-1 rounded-full text-sm font-medium border border-amber-500/30">
                        Negotiable
                      </span>
                    )}
                  </div>
                  <div className="text-sm text-slate-400">
                    Points value • Fair market price
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-2 gap-3">
                  <button
                    className={`bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-6 py-3 rounded-xl font-semibold transition-all transform hover:scale-105 ${!product.availability ? "opacity-50 cursor-not-allowed hover:scale-100" : ""
                      }`}
                    disabled={!product.availability}
                    onClick={handleSwapRequest}
                  >
                    <div className="flex items-center justify-center space-x-2">
                      <RefreshCw className="w-4 h-4" />
                      <span>Swap</span>
                    </div>
                  </button>
                  <button
                    className={`bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white px-6 py-3 rounded-xl font-semibold transition-all transform hover:scale-105 ${!product.availability ? "opacity-50 cursor-not-allowed hover:scale-100" : ""
                      }`}
                    disabled={!product.availability}
                    onClick={handlePointsRedeem}
                  >
                    <div className="flex items-center justify-center space-x-2">
                      <Star className="w-4 h-4" />
                      <span>Redeem</span>
                    </div>
                  </button>
                </div>

                <button
                  onClick={handleContactSeller}
                  className="w-full bg-slate-800 hover:bg-slate-700 text-white px-6 py-3 rounded-xl font-semibold transition-all"
                >
                  <div className="flex items-center justify-center space-x-2">
                    <MessageCircle className="w-4 h-4" />
                    <span>Contact Seller</span>
                  </div>
                </button>
              </div>
            </div>

            {/* Description */}
            <div className="bg-slate-900/70 backdrop-blur-sm rounded-2xl p-6 border border-slate-800">
              <h3 className="text-xl font-semibold text-white mb-4">Description</h3>
              <p className="text-slate-300 leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Seller Info */}
            <div className="bg-slate-900/70 backdrop-blur-sm rounded-2xl p-6 border border-slate-800">
              <h3 className="text-xl font-semibold text-white mb-4">Seller</h3>
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold">
                    {user?.firstName?.[0]}{user?.lastName?.[0]}
                  </span>
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <p className="text-white font-medium">{user?.firstName} {user?.lastName}</p>
                    <CheckCircle className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-slate-400">
                    <div className="flex items-center">
                      <Star className="w-4 h-4 mr-1 text-amber-400 fill-current" />
                      <span>{user?.rating || 'N/A'}</span>
                    </div>
                    <span>•</span>
                    <span>{user?.total_swaps || 0} swaps</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section - Trust Features */}
      <div className="mt-12 bg-slate-900/70 backdrop-blur-sm rounded-2xl p-8 border border-slate-800">
        <h3 className="text-2xl font-semibold text-white mb-6 text-center">Why Choose SwapHub</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex flex-col items-center text-center space-y-3">
            <div className="w-16 h-16 bg-emerald-600/20 rounded-full flex items-center justify-center">
              <Shield className="w-8 h-8 text-emerald-400" />
            </div>
            <h4 className="text-lg font-semibold text-white">Secure Trading</h4>
            <p className="text-slate-300">All transactions are protected with our verified seller system</p>
          </div>
          <div className="flex flex-col items-center text-center space-y-3">
            <div className="w-16 h-16 bg-blue-600/20 rounded-full flex items-center justify-center">
              <Truck className="w-8 h-8 text-blue-400" />
            </div>
            <h4 className="text-lg font-semibold text-white">Fast Delivery</h4>
            <p className="text-slate-300">Quick and safe delivery with tracking for all orders</p>
          </div>
          <div className="flex flex-col items-center text-center space-y-3">
            <div className="w-16 h-16 bg-purple-600/20 rounded-full flex items-center justify-center">
              <Award className="w-8 h-8 text-purple-400" />
            </div>
            <h4 className="text-lg font-semibold text-white">Quality Guaranteed</h4>
            <p className="text-slate-300">All items are verified and quality checked before listing</p>
          </div>
        </div>
      </div>

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-slate-900 rounded-2xl p-6 max-w-md w-full mx-4 border border-slate-800">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-white">Share Product</h3>
              <button
                onClick={() => setShowShareModal(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-3">
              <button
                onClick={copyLink}
                className="w-full flex items-center space-x-3 p-3 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
              >
                <Copy className="w-5 h-5 text-slate-400" />
                <span className="text-white">Copy Link</span>
              </button>
              <button
                onClick={() => shareToSocial('facebook')}
                className="w-full flex items-center space-x-3 p-3 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
              >
                <Facebook className="w-5 h-5 text-white" />
                <span className="text-white">Share on Facebook</span>
              </button>
              <button
                onClick={() => shareToSocial('twitter')}
                className="w-full flex items-center space-x-3 p-3 bg-sky-600 hover:bg-sky-700 rounded-lg transition-colors"
              >
                <Twitter className="w-5 h-5 text-white" />
                <span className="text-white">Share on Twitter</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Rating Modal */}
      {showRatingModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-slate-900 rounded-2xl p-6 max-w-md w-full mx-4 border border-slate-800">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-white">Rate This Product</h3>
              <button
                onClick={() => setShowRatingModal(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div className="flex justify-center space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => handleRating(star)}
                    className={`w-8 h-8 ${star <= userRating ? 'text-amber-400' : 'text-slate-600'}`}
                  >
                    <Star className={`w-full h-full ${star <= userRating ? 'fill-current' : ''}`} />
                  </button>
                ))}
              </div>
              <textarea
                value={ratingComment}
                onChange={(e) => setRatingComment(e.target.value)}
                placeholder="Share your experience..."
                className="w-full p-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-400 resize-none"
                rows="3"
              />
              <button
                onClick={submitRating}
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-6 py-3 rounded-xl font-semibold transition-all"
              >
                Submit Rating
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Contact Modal */}
      {showContactModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-slate-900 rounded-2xl p-6 max-w-md w-full mx-4 border border-slate-800">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-white">Contact Seller</h3>
              <button
                onClick={() => setShowContactModal(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your message..."
                className="w-full p-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-400 resize-none"
                rows="4"
              />
              <button
                onClick={sendMessage}
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-6 py-3 rounded-xl font-semibold transition-all"
              >
                <div className="flex items-center justify-center space-x-2">
                  <Send className="w-4 h-4" />
                  <span>Send Message</span>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetailsPage;
