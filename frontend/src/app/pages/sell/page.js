"use client";

import {
    BookOpen,
    Calendar,
    Camera,
    CheckCircle,
    Crown,
    MapPin,
    MoreHorizontal,
    Palette,
    Ruler,
    Shirt,
    ShoppingCart,
    Snowflake,
    Star,
    Sun,
    Tag,
    Upload,
    User,
    Users
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FaCoins } from "react-icons/fa";

const CATEGORIES = [
    { value: "Tops", label: "Tops", icon: Shirt, color: "from-purple-500 to-purple-600" },
    { value: "Bottoms", label: "Bottoms", icon: Tag, color: "from-blue-500 to-blue-600" },
    { value: "Ethnic Wear", label: "Ethnic Wear", icon: Crown, color: "from-amber-500 to-amber-600" },
    { value: "Dresses & One-Pieces", label: "Dresses & One-Pieces", icon: Palette, color: "from-pink-500 to-pink-600" },
    { value: "Outerwear", label: "Outerwear", icon: Shirt, color: "from-green-500 to-green-600" },
    { value: "Activewear", label: "Activewear", icon: Star, color: "from-red-500 to-red-600" },
    { value: "Footwear", label: "Footwear", icon: MapPin, color: "from-cyan-500 to-cyan-600" },
    { value: "Accessories", label: "Accessories", icon: Crown, color: "from-indigo-500 to-indigo-600" },
    { value: "Winter Wear", label: "Winter Wear", icon: Snowflake, color: "from-blue-600 to-blue-700" },
    { value: "Unisex/Free Size", label: "Unisex/Free Size", icon: Users, color: "from-teal-500 to-teal-600" },
    { value: "Others", label: "Others", icon: MoreHorizontal, color: "from-gray-500 to-gray-600" }
];

const GENDERS = ["Men", "Women", "Unisex"];
const SIZES = ["XS", "S", "M", "L", "XL", "XXL", "Free Size"];
const CONDITIONS = ["New", "Like New", "Gently Used", "Fair"];
const OCCASIONS = ["Casual", "Formal", "Festive", "Partywear", "Others"];
const SEASONS = ["Summer", "Winter", "All-Season"];

const SellPage = () => {
    const router = useRouter();
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        points: "",
        negotiable: false,
        category: "Others",
        gender: "Unisex",
        size: "Free Size",
        condition: "Gently Used",
        occasion: "Casual",
        season: "All-Season",
        availability: true,
    });

    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [itemId, setItemId] = useState(null);
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isUploadingImage, setIsUploadingImage] = useState(false);
    const [dragActive, setDragActive] = useState(false);
    const [stars, setStars] = useState([]);

    // Generate random stars
    useEffect(() => {
        const generateStars = (count) => {
            return Array.from({ length: count }, (_, i) => ({
                id: i,
                x: Math.random() * 100,
                y: Math.random() * 100,
                size: Math.random() * 1.5 + 0.5,
                opacity: Math.random() * 0.8 + 0.2,
                animationDelay: Math.random() * 2,
            }));
        };

        setStars(generateStars(150));
    }, []);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onload = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            const file = e.dataTransfer.files[0];
            setImageFile(file);
            const reader = new FileReader();
            reader.onload = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccessMessage("");
        setIsSubmitting(true);

        try {
            const token = localStorage.getItem("token");
            const response = await fetch("http://127.0.0.1:8000/items/items/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    ...formData,
                    points: parseInt(formData.points),
                }),
            });

            if (response.ok) {
                const data = await response.json();
                setItemId(data.id);
                setSuccessMessage("Item created successfully.");
                console.log("Item created:", data);
                router.push("/pages/dashboard");
  
                if (imageFile) {
                    await uploadImage(data.id);
                } else {
                    setTimeout(() => {
                        router.push("/pages/dashboard");
                    }, 1500);
                }
            } else {
                const data = await response.json();
                setError(data.detail || "Failed to create item");
                console.error("Error creating item:", data);
            }
        } catch (error) {
            setError("An error occurred. Please try again.");
            console.error("Error during item creation:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const uploadImage = async (itemIdToUse = null) => {
        const targetItemId = itemIdToUse || itemId;
        
        if (!imageFile || !targetItemId) {
            setError("Please select an image and create an item first.");
            return;
        }
        
        setError("");
        setSuccessMessage("");
        setIsUploadingImage(true);

        const formDataObj = new FormData();
        formDataObj.append("image", imageFile);
        formDataObj.append("item", targetItemId);

        try {
            const token = localStorage.getItem("token");
            const response = await fetch("http://127.0.0.1:8000/items/item-images/", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: formDataObj,
            });

            if (response.ok) {
                setSuccessMessage("Image uploaded successfully. Redirecting to home...");
                setTimeout(() => {
                    router.push("/pages/landingpage");
                }, 1500);
            } else {
                const data = await response.json();
                setError(data.detail || "Failed to upload image");
                console.error("Error uploading image:", data);
            }
        } catch (err) {
            setError("An error occurred during image upload.");
            console.error("Error during image upload:", err);
        } finally {
            setIsUploadingImage(false);
        }
    };

    const handleImageUpload = () => {
        uploadImage();
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-950 to-purple-950 relative">
            {/* Animated Star Background */}
            <div className="fixed inset-0 pointer-events-none z-0">
                {stars.map((star) => (
                    <div
                        key={star.id}
                        className="absolute bg-white rounded-full animate-pulse"
                        style={{
                            left: `${star.x}%`,
                            top: `${star.y}%`,
                            width: `${star.size}px`,
                            height: `${star.size}px`,
                            opacity: star.opacity,
                            animationDelay: `${star.animationDelay}s`,
                        }}
                    />
                ))}
            </div>

            {/* Subtle Background Pattern */}
            <div className="absolute inset-0 opacity-5">
                <div
                    className="absolute inset-0"
                    style={{
                        backgroundImage: `radial-gradient(circle at 25px 25px, rgba(255,255,255,0.1) 2px, transparent 0)`,
                        backgroundSize: "50px 50px",
                    }}
                />
            </div>

            {/* Floating Accent Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-20 left-10 w-32 h-32 bg-purple-500/10 rounded-full blur-xl animate-pulse" />
                <div className="absolute top-60 right-20 w-24 h-24 bg-blue-500/10 rounded-full blur-xl animate-pulse" style={{ animationDelay: "1s" }} />
                <div className="absolute bottom-32 left-1/4 w-20 h-20 bg-purple-500/10 rounded-full blur-xl animate-pulse" style={{ animationDelay: "2s" }} />
                <div className="absolute bottom-20 right-1/3 w-28 h-28 bg-pink-500/10 rounded-full blur-xl animate-pulse" style={{ animationDelay: "3s" }} />
            </div>

            <div className="relative z-10 container mx-auto px-4 py-8">
                <div className="max-w-5xl mx-auto">
                    {/* Header */}
                    <div className="text-center mb-12">
                        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-b from-purple-950 to-blue-950 rounded-2xl mb-6 shadow-2xl">
                            <Shirt className="w-10 h-10 text-white" />
                        </div>
                        <h1 className="text-5xl font-black bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent mb-3">
                            ReWear
                        </h1>
                        <p className="text-gray-400 text-xl font-medium">
                            Sell your fashion items to style enthusiasts
                        </p>
                    </div>

                    {/* Main Container */}
                    <div className="bg-gradient-to-t from-gray-950 to-gray-950/50 backdrop-blur-xl rounded-3xl border border-gray-700 shadow-2xl overflow-hidden">
                        <div className="bg-gradient-to-tl from-purple-950 to-gray-950 p-6 border-b border-gray-700/50">
                            <h2 className="text-2xl font-bold text-white flex items-center">
                                <ShoppingCart className="w-6 h-6 mr-3 text-purple-400" />
                                List Your Fashion Item
                            </h2>
                            <p className="text-gray-400 mt-1">
                                Fill out the details to list your item on the fashion marketplace
                            </p>
                        </div>

                        <form onSubmit={handleSubmit}>
                            <div className="p-8 space-y-8">
                                {/* Title Input */}
                                <div className="space-y-2">
                                    <label className="text-white font-semibold text-lg flex items-center">
                                        <Tag className="w-5 h-5 mr-2 text-sky-400" />
                                        Item Title
                                    </label>
                                    <input
                                        type="text"
                                        name="title"
                                        placeholder="e.g., Vintage Denim Jacket, Designer Dress..."
                                        value={formData.title}
                                        onChange={handleChange}
                                        className="w-full px-4 py-4 bg-gray-800 border-2 border-gray-600 rounded-xl text-white placeholder-gray-400 focus:border-cyan-500 focus:outline-none focus:ring-4 focus:ring-cyan-500/20 transition-all duration-300 text-lg"
                                        required
                                    />
                                </div>

                                {/* Description */}
                                <div className="space-y-2">
                                    <label className="text-white font-semibold text-lg flex items-center">
                                        <BookOpen className="w-5 h-5 mr-2 text-green-400" />
                                        Description
                                    </label>
                                    <textarea
                                        name="description"
                                        placeholder="Describe your item's condition, brand, features, styling..."
                                        value={formData.description}
                                        onChange={handleChange}
                                        rows={4}
                                        className="w-full px-4 py-4 bg-gray-800 border-2 border-gray-600 rounded-xl text-white placeholder-gray-400 focus:border-green-500 focus:outline-none focus:ring-4 focus:ring-green-500/20 transition-all duration-300 resize-none text-lg"
                                    />
                                </div>

                                {/* Points and Negotiable */}
                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                    <div className="lg:col-span-2 space-y-2">
                                        <label className="text-white font-semibold text-lg flex items-center">
                                            <FaCoins className="w-5 h-5 mr-2 text-yellow-400" />
                                            Points
                                        </label>
                                        <input
                                            type="number"
                                            name="points"
                                            placeholder="Enter points value"
                                            value={formData.points}
                                            onChange={handleChange}
                                            min="0"
                                            step="1"
                                            className="w-full px-4 py-4 bg-gray-800 border-2 border-gray-600 rounded-xl text-white placeholder-gray-400 focus:border-yellow-500 focus:outline-none focus:ring-4 focus:ring-yellow-500/20 transition-all duration-300 text-lg"
                                            required
                                        />
                                    </div>

                                    <div className="flex items-end">
                                        <label className="flex items-center space-x-3 bg-gray-800 px-6 py-4 rounded-xl border-2 border-gray-600 hover:border-gray-500 transition-all duration-300 cursor-pointer w-full">
                                            <input
                                                type="checkbox"
                                                name="negotiable"
                                                checked={formData.negotiable}
                                                onChange={handleChange}
                                                className="w-5 h-5 text-cyan-500 bg-gray-700 border-gray-600 rounded focus:ring-cyan-500 focus:ring-2"
                                            />
                                            <span className="text-white font-semibold">Negotiable</span>
                                        </label>
                                    </div>
                                </div>

                                {/* Category */}
                                <div className="space-y-4">
                                    <label className="block text-white font-semibold text-lg">
                                        Choose Category
                                    </label>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {CATEGORIES.map((cat) => {
                                            const IconComponent = cat.icon;
                                            return (
                                                <label
                                                    key={cat.value}
                                                    className={`relative flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 group ${formData.category === cat.value
                                                        ? "border-sky-600 bg-blue-500/20 shadow-lg shadow-blue-500/25 transform scale-105"
                                                        : "border-gray-600 bg-gray-800 hover:border-gray-500 hover:bg-gray-700"
                                                        }`}
                                                >
                                                    <input
                                                        type="radio"
                                                        name="category"
                                                        value={cat.value}
                                                        checked={formData.category === cat.value}
                                                        onChange={handleChange}
                                                        className="sr-only"
                                                    />
                                                    <div className={`flex items-center justify-center w-12 h-12 rounded-lg bg-gradient-to-r ${cat.color} mr-4 flex-shrink-0`}>
                                                        <IconComponent className="w-6 h-6 text-white" />
                                                    </div>
                                                    <div>
                                                        <span className="text-white font-semibold block">
                                                            {cat.label}
                                                        </span>
                                                    </div>
                                                </label>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* Fashion Details Grid */}
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {/* Gender */}
                                    <div className="space-y-2">
                                        <label className="text-white font-semibold text-lg flex items-center">
                                            <User  className="w-5 h-5 mr-2 text-blue-400" />
                                            Gender
                                        </label>
                                        <select
                                            name="gender"
                                            value={formData.gender}
                                            onChange={handleChange}
                                            className="w-full px-4 py-4 bg-gray-800 border-2 border-gray-600 rounded-xl text-white focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/20 transition-all duration-300 text-lg"
                                        >
                                            {GENDERS.map((g) => (
                                                <option key={g} value={g}>
                                                    {g}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Size */}
                                    <div className="space-y-2">
                                        <label className="text-white font-semibold text-lg flex items-center">
                                            <Ruler className="w-5 h-5 mr-2 text-green-400" />
                                            Size
                                        </label>
                                        <select
                                            name="size"
                                            value={formData.size}
                                            onChange={handleChange}
                                            className="w-full px-4 py-4 bg-gray-800 border-2 border-gray-600 rounded-xl text-white focus:border-green-500 focus:outline-none focus:ring-4 focus:ring-green-500/20 transition-all duration-300 text-lg"
                                        >
                                            {SIZES.map((s) => (
                                                <option key={s} value={s}>
                                                    {s}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Condition */}
                                    <div className="space-y-2">
                                        <label className="text-white font-semibold text-lg flex items-center">
                                            <CheckCircle className="w-5 h-5 mr-2 text-orange-400" />
                                            Condition
                                        </label>
                                        <select
                                            name="condition"
                                            value={formData.condition}
                                            onChange={handleChange}
                                            className="w-full px-4 py-4 bg-gray-800 border-2 border-gray-600 rounded-xl text-white focus:border-orange-500 focus:outline-none focus:ring-4 focus:ring-orange-500/20 transition-all duration-300 text-lg"
                                        >
                                            {CONDITIONS.map((c) => (
                                                <option key={c} value={c}>
                                                    {c}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Occasion */}
                                    <div className="space-y-2">
                                        <label className="text-white font-semibold text-lg flex items-center">
                                            <Calendar className="w-5 h-5 mr-2 text-pink-400" />
                                            Occasion
                                        </label>
                                        <select
                                            name="occasion"
                                            value={formData.occasion}
                                            onChange={handleChange}
                                            className="w-full px-4 py-4 bg-gray-800 border-2 border-gray-600 rounded-xl text-white focus:border-pink-500 focus:outline-none focus:ring-4 focus:ring-pink-500/20 transition-all duration-300 text-lg"
                                        >
                                            {OCCASIONS.map((o) => (
                                                <option key={o} value={o}>
                                                    {o}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Season */}
                                    <div className="space-y-2">
                                        <label className="text-white font-semibold text-lg flex items-center">
                                            <Sun className="w-5 h-5 mr-2 text-yellow-400" />
                                            Season
                                        </label>
                                        <select
                                            name="season"
                                            value={formData.season}
                                            onChange={handleChange}
                                            className="w-full px-4 py-4 bg-gray-800 border-2 border-gray-600 rounded-xl text-white focus:border-yellow-500 focus:outline-none focus:ring-4 focus:ring-yellow-500/20 transition-all duration-300 text-lg"
                                        >
                                            {SEASONS.map((s) => (
                                                <option key={s} value={s}>
                                                    {s}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                {/* Image Upload */}
                                <div className="space-y-2">
                                    <label className="text-white font-semibold text-lg flex items-center">
                                        <Camera className="w-5 h-5 mr-2 text-purple-400" />
                                        Product Photos
                                    </label>
                                    <div
                                        className={`relative border-2 border-dashed rounded-xl p-8 transition-all duration-300 ${dragActive
                                            ? "border-cyan-500 bg-cyan-500/10"
                                            : "border-gray-600 bg-gray-800 hover:border-gray-500 hover:bg-gray-700"
                                            }`}
                                        onDragEnter={handleDrag}
                                        onDragLeave={handleDrag}
                                        onDragOver={handleDrag}
                                        onDrop={handleDrop}
                                    >
                                        <input
                                            type="file"
                                            name="image"
                                            onChange={handleImageChange}
                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                            accept="image/*"
                                        />

                                        {imagePreview ? (
                                            <div className="text-center">
                                                <img
                                                    src={imagePreview}
                                                    alt="Preview"
                                                    className="max-w-full max-h-64 mx-auto rounded-lg shadow-lg mb-4"
                                                />
                                                <p className="text-gray-400 text-lg">
                                                    Click or drag to change photo
                                                </p>
                                            </div>
                                        ) : (
                                            <div className="text-center">
                                                <Upload className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                                                <p className="text-white font-semibold text-xl mb-2">
                                                    Upload Product Photo
                                                </p>
                                                <p className="text-gray-400 text-lg">
                                                    Drag & drop or click to browse
                                                </p>
                                                <p className="text-gray-500 text-sm mt-2">
                                                    PNG, JPG, GIF up to 10MB
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className={`w-full py-4 px-8 rounded-xl font-bold text-lg transition-all duration-300 transform ${isSubmitting
                                        ? "bg-gray-600 cursor-not-allowed"
                                        : "bg-gradient-to-t from-purple-800 to-gray-950 hover:from-purple-600 hover:to-purple-900 hover:shadow-xl shadow-lg"
                                        } text-white`}
                                >
                                    {isSubmitting ? (
                                        <div className="flex items-center justify-center">
                                            <div className="animate-spin rounded-full h-7 w-7 border-b-2 border-white mr-3"></div>
                                            Creating Item...
                                        </div>
                                    ) : (
                                        <div className="flex items-center justify-center">
                                            <ShoppingCart className="w-6 h-6 mr-3" />
                                            Create Fashion Item
                                        </div>
                                    )}
                                </button>
                            </div>
                        </form>

                        {/* Image Upload Section - Only show if item created but image not uploaded */}
                        {itemId && !isSubmitting && (
                            <div className="p-8 border-t border-gray-700/50">
                                <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-2xl p-6">
                                    <h3 className="text-2xl font-bold text-white mb-4 flex items-center">
                                        <Camera className="w-6 h-6 mr-3 text-blue-400" />
                                        Upload Images
                                    </h3>
                                    <p className="text-gray-400 mb-6">
                                        Add high-quality images to showcase your fashion item
                                    </p>

                                    <button
                                        onClick={handleImageUpload}
                                        disabled={isUploadingImage || !imageFile}
                                        className={`w-full py-4 px-8 rounded-xl font-bold text-lg transition-all duration-300 transform ${isUploadingImage || !imageFile
                                            ? "bg-gray-600 cursor-not-allowed"
                                            : "bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 hover:scale-[1.02] hover:shadow-xl active:scale-[0.98] shadow-lg"
                                            } text-white`}
                                    >
                                        {isUploadingImage ? (
                                            <div className="flex items-center justify-center">
                                                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3"></div>
                                                Uploading...
                                            </div>
                                        ) : (
                                            <div className="flex items-center justify-center">
                                                <Upload className="w-5 h-5 mr-3" />
                                                Upload Image & Finish
                                            </div>
                                        )}
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Success and Error Messages */}
                        {successMessage && (
                            <div className="p-6 bg-green-500/10 border-t border-green-500/20">
                                <p className="text-green-400 font-semibold text-center flex items-center justify-center">
                                    <CheckCircle className="w-5 h-5 mr-2" />
                                    {successMessage}
                                </p>
                            </div>
                        )}
                        {error && (
                            <div className="p-6 bg-red-500/10 border-t border-red-500/20">
                                <p className="text-red-400 font-semibold text-center">
                                    {error}
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SellPage;
