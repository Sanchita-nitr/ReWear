"use client";

import {
    BookOpen,
    Calendar,
    Camera,
    CheckCircle,
    Crown,
    Edit,
    MapPin,
    MoreHorizontal,
    Palette,
    Ruler,
    Shirt,
    Snowflake,
    Star,
    Sun,
    Tag,
    Trash2,
    Upload,
    User,
    Users
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
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

const UpdateProductPage = () => {
    const router = useRouter();
    const params = useParams();
    const productId = params.id;
    

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
    const [existingImages, setExistingImages] = useState([]);
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

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const token = localStorage.getItem("token");
                const response = await fetch(`http://127.0.0.1:8000/items/items/${productId}/`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                if (response.ok) {
                    const data = await response.json();
                    setFormData({
                        title: data.title || "",
                        description: data.description || "",
                        points: data.points || "",
                        negotiable: data.negotiable || false,
                        category: data.category || "Others",
                        gender: data.gender || "Unisex",
                        size: data.size || "Free Size",
                        condition: data.condition || "Gently Used",
                        occasion: data.occasion || "Casual",
                        season: data.season || "All-Season",
                        availability: data.availability !== undefined ? data.availability : true,
                    });
                    setExistingImages(data.images || []);
                } else {
                    setError("Failed to fetch product data.");
                }
            } catch (err) {
                setError("An error occurred while fetching product data.");
                console.error(err);
            }
        };

        fetchProduct();
    }, [productId]);

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
            const response = await fetch(`http://127.0.0.1:8000/items/items/${productId}/`, {
                method: "PUT",
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
                setSuccessMessage("Item updated successfully.");
                if (imageFile) {
                    await uploadImage();
                } else {
                    setTimeout(() => {
                        router.push("/pages/dashboard");
                    }, 1500);
                }
            } else {
                const data = await response.json();
                setError(data.detail || "Failed to update item");
            }
        } catch (error) {
            setError("An error occurred. Please try again.");
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const uploadImage = async () => {
        if (!imageFile) {
            setError("Please select an image to upload.");
            return;
        }

        setError("");
        setSuccessMessage("");
        setIsUploadingImage(true);

        const formDataObj = new FormData();
        formDataObj.append("image", imageFile);
        formDataObj.append("item", productId);

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
                setSuccessMessage("Image uploaded successfully. Redirecting to dashboard...");
                setTimeout(() => {
                    router.push("/pages/dashboard");
                }, 1500);
            } else {
                const data = await response.json();
                setError(data.detail || "Failed to upload image");
            }
        } catch (err) {
            setError("An error occurred during image upload.");
            console.error(err);
        } finally {
            setIsUploadingImage(false);
        }
    };

    const handleImageUpload = () => {
        uploadImage();
    };

    const handleDeleteImage = async (imageId) => {
        if (!confirm("Are you sure you want to delete this image?")) {
            return;
        }

        try {
            const token = localStorage.getItem("token");
            const response = await fetch(`http://127.0.0.1:8000/items/item-images/${imageId}/`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.ok) {
                setExistingImages((prev) => prev.filter((img) => img.id !== imageId));
            } else {
                setError("Failed to delete image.");
            }
        } catch (err) {
            setError("An error occurred while deleting image.");
            console.error(err);
        }
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

            <div className="relative z-10 container mx-auto px-4 py-8 max-w-5xl">
                <h1 className="text-4xl font-bold text-white mb-8">Update Product</h1>

                {error && (
                    <div className="mb-4 p-4 bg-red-600 text-white rounded">{error}</div>
                )}
                {successMessage && (
                    <div className="mb-4 p-4 bg-green-600 text-white rounded">{successMessage}</div>
                )}

                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Title */}
                    <div>
                        <label className="text-white font-semibold text-lg flex items-center mb-2">
                            <Tag className="w-5 h-5 mr-2 text-sky-400" />
                            Item Title
                        </label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            className="w-full px-4 py-4 bg-gray-800 border-2 border-gray-600 rounded-xl text-white placeholder-gray-400 focus:border-cyan-500 focus:outline-none focus:ring-4 focus:ring-cyan-500/20 transition-all duration-300 text-lg"
                            required
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label className="text-white font-semibold text-lg flex items-center mb-2">
                            <BookOpen className="w-5 h-5 mr-2 text-green-400" />
                            Description
                        </label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows={4}
                            className="w-full px-4 py-4 bg-gray-800 border-2 border-gray-600 rounded-xl text-white placeholder-gray-400 focus:border-green-500 focus:outline-none focus:ring-4 focus:ring-green-500/20 transition-all duration-300 resize-none text-lg"
                        />
                    </div>

                    {/* Points and Negotiable */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2 space-y-2">
                            <label className="text-white font-semibold text-lg flex items-center mb-2">
                                <FaCoins className="w-5 h-5 mr-2 text-yellow-400" />
                                Points
                            </label>
                            <input
                                type="number"
                                name="points"
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
                        <label className="block text-white font-semibold text-lg mb-2">
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
                            <label className="text-white font-semibold text-lg flex items-center mb-2">
                                <User className="w-5 h-5 mr-2 text-blue-400" />
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
                            <label className="text-white font-semibold text-lg flex items-center mb-2">
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
                            <label className="text-white font-semibold text-lg flex items-center mb-2">
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
                            <label className="text-white font-semibold text-lg flex items-center mb-2">
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
                            <label className="text-white font-semibold text-lg flex items-center mb-2">
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

                    {/* Existing Images */}
                    <div className="space-y-4">
                        <label className="text-white font-semibold text-lg flex items-center">
                            <Camera className="w-5 h-5 mr-2 text-purple-400" />
                            Existing Images
                        </label>
                        <div className="flex flex-wrap gap-4">
                            {existingImages.length > 0 ? (
                                existingImages.map((img) => (
                                    <div key={img.id} className="relative group">
                                        <img
                                            src={img.image}
                                            alt={`Image ${img.id}`}
                                            className="w-32 h-32 object-cover rounded-lg"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => handleDeleteImage(img.id)}
                                            className="absolute top-1 right-1 bg-red-600 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                            title="Delete Image"
                                        >
                                            <Trash2 className="w-5 h-5 text-white" />
                                        </button>
                                    </div>
                                ))
                            ) : (
                                <p className="text-gray-400">No images uploaded yet.</p>
                            )}
                        </div>
                    </div>

                    {/* Image Upload */}
                    <div className="space-y-2">
                        <label className="text-white font-semibold text-lg flex items-center">
                            <Upload className="w-5 h-5 mr-2 text-blue-400" />
                            Upload New Image
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
                                Updating Item...
                            </div>
                        ) : (
                            <div className="flex items-center justify-center">
                                <Edit className="w-6 h-6 mr-3" />
                                Update Fashion Item
                            </div>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default UpdateProductPage;
