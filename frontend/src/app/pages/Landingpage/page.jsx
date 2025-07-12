"use client";
import { useEffect, useState } from "react";

import Footer from "@/app/components/footer/page";
import Navbar from "@/app/components/navbar/page";
import Login from "@/app/auth/login";
import {
  ArrowRight,
  Bike,
  BookOpen,
  Gift,
  Heart,
  Home,
  Laptop,
  MessageCircle,
  Recycle,
  Shield,
  ShoppingBag,
  Star,
  Users,
  Zap,
  Search,
  ArrowLeft,
} from "lucide-react";
import { useRouter } from "next/navigation";

const WelcomePage = () => {
  const [stars, setStars] = useState([]);
  // Set products to empty array (no listings)
  const [products, setProducts] = useState([]);
  const [scrollY, setScrollY] = useState(0);
  const [isVisible, setIsVisible] = useState({});
  const [searchTerm, setSearchTerm] = useState("");

  // Mock data for demonstration
  const mockProducts = [
    {
      id: "1",
      title: "Men's Denim Jacket",
      description: "Trendy blue denim jacket, lightly used, size M",
      negotiable: true,
      image: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=400&q=80",
      category: "mens",
      is_sold: false,
      created_at: "2025-01-01",
      updated_at: "2025-01-01",
    },
    {
      id: "2",
      title: "Women's Summer Dress",
      description: "Floral print, perfect for summer, size S",
      negotiable: false,
      image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80",
      category: "womens",
      is_sold: false,
      created_at: "2025-01-01",
      updated_at: "2025-01-01",
    },
    {
      id: "3",
      title: "Woolen Scarf",
      description: "Cozy winter scarf, unisex, red color",
      negotiable: true,
      image: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=400&q=80",
      category: "winter",
      is_sold: false,
      created_at: "2024-01-01",
      updated_at: "2024-01-01",
    },
    {
      id: "4",
      title: "Ethnic Kurta Set",
      description: "Men's ethnic kurta with pajama, size L",
      negotiable: false,
      image: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=400&q=80",
      category: "ethnic",
      is_sold: false,
      created_at: "2024-01-01",
      updated_at: "2024-01-01",
    },
    {
      id: "5",
      title: "Leather Belt",
      description: "Classic brown leather belt, adjustable size",
      negotiable: true,
      image: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=400&q=80",
      category: "accessories",
      is_sold: false,
      created_at: "2024-01-01",
      updated_at: "2024-01-01",
    },
    {
      id: "6",
      title: "Sneakers",
      description: "White sneakers, lightly worn, size 9",
      negotiable: false,
      image: "https://images.unsplash.com/photo-1519864600265-abb23847ef2c?auto=format&fit=crop&w=400&q=80",
      category: "footwear",
      is_sold: false,
      created_at: "2024-01-01",
      updated_at: "2024-01-01",
    },
  ];

  useEffect(() => {
    setProducts(mockProducts);

    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    const observerOptions = {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px",
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setIsVisible((prev) => ({
            ...prev,
            [entry.target.id]: true,
          }));
        }
      });
    }, observerOptions);

    // Observe all sections
    const sections = document.querySelectorAll("[data-section]");
    sections.forEach((section) => observer.observe(section));

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      observer.disconnect();
    };
  }, []);

  const getProductsByCategory = (categoryKey) => {
    return products
      .filter((product) => product.category === categoryKey)
      .slice(0, 3);
  };
  const router = useRouter();
  const navigation = (path) => {
    router.push(path);
  };

  const features = [
    {
      icon: <Users className="w-8 h-8" />,
      title: "Community Driven",
      description: "Connect with people from all walks of life and share your style.",
      gradient: "from-blue-500 to-purple-600",
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Verified Users",
      description: "All users are verified for safe and secure exchanges.",
      gradient: "from-green-500 to-emerald-600",
    },
    {
      icon: <Recycle className="w-8 h-8" />,
      title: "Sustainable Fashion",
      description: "Give clothes a second life and reduce waste.",
      gradient: "from-emerald-500 to-teal-600",
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Quick & Easy",
      description: "Fast and easy swapping with instant messaging.",
      gradient: "from-yellow-500 to-orange-600",
    },
  ];

  // Define men and women categories
  const menCategories = [
    { key: "men-shirts", icon: <ShirtIcon />, name: "Shirts", gradient: "from-blue-500 to-blue-700" },
    { key: "men-tshirts", icon: <TShirtIcon />, name: "T-Shirts", gradient: "from-cyan-500 to-blue-400" },
    { key: "men-trousers", icon: <TrousersIcon />, name: "Trousers", gradient: "from-gray-600 to-gray-800" },
    { key: "men-denim", icon: <DenimIcon />, name: "Denim", gradient: "from-indigo-500 to-blue-900" },
    { key: "men-jackets", icon: <JacketIcon />, name: "Jackets", gradient: "from-slate-700 to-gray-900" },
  ];
  const womenCategories = [
    { key: "women-shirts", icon: <ShirtIcon />, name: "Shirts", gradient: "from-pink-400 to-pink-600" },
    { key: "women-tshirts", icon: <TShirtIcon />, name: "T-Shirts", gradient: "from-rose-400 to-pink-500" },
    { key: "women-trousers", icon: <TrousersIcon />, name: "Trousers", gradient: "from-fuchsia-500 to-pink-700" },
    { key: "women-denim", icon: <DenimIcon />, name: "Denim", gradient: "from-purple-500 to-indigo-700" },
    { key: "women-jackets", icon: <JacketIcon />, name: "Jackets", gradient: "from-red-400 to-pink-800" },
  ];

  // Add icon components (simple SVGs for now)
  function ShirtIcon() {
    return <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M4 4l4-2 4 2 4-2 4 2v2l-2 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V8L2 6V4z" /></svg>;
  }
  function TShirtIcon() {
    return <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M4 4l4-2 4 2 4-2 4 2v2l-2 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V8L2 6V4z" /></svg>;
  }
  function TrousersIcon() {
    return <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="7" y="4" width="10" height="16" rx="2" /><path d="M7 12h10" /></svg>;
  }
  function DenimIcon() {
    return <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="6" y="4" width="12" height="16" rx="2" /><path d="M6 8h12" /></svg>;
  }
  function JacketIcon() {
    return <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M4 4l4-2 4 2 4-2 4 2v2l-2 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V8L2 6V4z" /><path d="M12 6v16" /></svg>;
  }

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

    setStars(generateStars(150)); // Generate stars only on the client side
  }, []);

  // Myntra-style categories with icons and click-to-filter
  const categoryList = [
    { key: "shirts", label: "Shirts", image: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=200&q=80" },
    { key: "tshirts", label: "T-Shirts", image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80" },
    { key: "trousers", label: "Trousers", image: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=200&q=80" },
    { key: "denim", label: "Denim", image: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=200&q=80" },
    { key: "jackets", label: "Jackets", image: "https://images.unsplash.com/photo-1519864600265-abb23847ef2c?auto=format&fit=crop&w=200&q=80" },
  ];
  const [selectedCategory, setSelectedCategory] = useState(null);

  // Filtered products for search and category
  const filteredProducts = products.filter(
    (product) =>
      (selectedCategory === null || product.category === selectedCategory) &&
      (product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Add state for featured product carousel
  const [featuredIndex, setFeaturedIndex] = useState(0);
  const featuredProducts = [
    { title: "Men's Denim Jacket", description: "Trendy blue denim jacket, lightly used, size M", image: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=400&q=80" },
    { title: "Women's Summer Dress", description: "Floral print, perfect for summer, size S", image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80" },
    { title: "Woolen Scarf", description: "Cozy winter scarf, unisex, red color", image: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=400&q=80" },
    { title: "Ethnic Kurta Set", description: "Men's ethnic kurta with pajama, size L", image: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=400&q=80" },
    { title: "Sneakers", description: "White sneakers, lightly worn, size 9", image: "https://images.unsplash.com/photo-1519864600265-abb23847ef2c?auto=format&fit=crop&w=400&q=80" },
  ];
  // Carousel auto-advance effect
  useEffect(() => {
    const timer = setInterval(() => {
      setFeaturedIndex((prev) => (prev + 1) % featuredProducts.length);
    }, 3000);
    return () => clearInterval(timer);
  }, [featuredProducts.length]);
  const handlePrev = () => setFeaturedIndex((prev) => (prev - 1 + featuredProducts.length) % featuredProducts.length);
  const handleNext = () => setFeaturedIndex((prev) => (prev + 1) % featuredProducts.length);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white overflow-hidden relative">
      <Navbar />
      {/* Search Bar */}
      <div className="relative z-20 pt-24 pb-4 px-4 max-w-3xl mx-auto">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search items, categories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 transition-all"
          />
        </div>
      </div>
      {/* Hero Section */}
      <section className="relative z-10 pt-4 pb-8 px-4" data-section id="hero">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-black mb-6 bg-gradient-to-r from-white via-cyan-200 to-emerald-300 bg-clip-text text-transparent transition-all duration-1000" style={{ fontFamily: "Georgia, serif", letterSpacing: "2px" }}>
            ReWear
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-4 max-w-3xl mx-auto" style={{ fontFamily: "Playfair Display, serif" }}>
            A community-driven clothing exchange for everyone
          </p>
          <p className="text-lg text-gray-400 mb-8 max-w-2xl mx-auto">
            Join the movement for sustainable fashion. Swap, exchange, and discover pre-loved clothing in your community.
          </p>
          {/* Update hero section: remove two buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <button onClick={() => navigation("/login")} className="bg-gradient-to-r from-cyan-500 to-emerald-600 text-white font-semibold py-4 px-8 rounded-xl hover:from-cyan-600 hover:to-emerald-700 focus:outline-none focus:ring-4 focus:ring-cyan-500/20 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center group">
              Start Swapping Clothes
            </button>
          </div>
        </div>
      </section>
      {/* Featured Items Carousel */}
      <section className="relative z-10 max-w-4xl mx-auto px-4 pb-8">
        <h2 className="text-2xl font-bold mb-4 text-white text-center">Featured Products</h2>
        <div className="relative flex items-center justify-center">
          <button onClick={handlePrev} className="absolute left-0 z-10 p-2 bg-gray-800/60 rounded-full hover:bg-cyan-600/80 transition-all"><ArrowLeft className="w-6 h-6 text-white" /></button>
          <div className="w-full flex flex-col items-center">
            <div className="bg-gray-900/60 rounded-2xl shadow-lg border border-gray-700/40 w-full max-w-4xl flex flex-col items-center">
              <img src={featuredProducts[featuredIndex].image} alt={featuredProducts[featuredIndex].title} className="w-full h-96 object-cover rounded-t-2xl" />
              <div className="p-8 w-full text-center">
                <h3 className="text-3xl font-semibold text-white mb-3">{featuredProducts[featuredIndex].title}</h3>
                <p className="text-gray-400 text-xl">{featuredProducts[featuredIndex].description}</p>
              </div>
            </div>
          </div>
          <button onClick={handleNext} className="absolute right-0 z-10 p-2 bg-gray-800/60 rounded-full hover:bg-cyan-600/80 transition-all"><ArrowRight className="w-6 h-6 text-white" /></button>
        </div>
      </section>
      {/* Categories Section */}
      <section className="relative z-10 max-w-6xl mx-auto px-4 pb-8">
        <h2 className="text-2xl font-bold mb-4 text-white">Categories</h2>
        <div className="flex gap-10 overflow-x-auto pb-2">
          {categoryList.map((cat) => (
            <button
              key={cat.key}
              onClick={() => setSelectedCategory(cat.key === selectedCategory ? null : cat.key)}
              className={`flex flex-col items-center min-w-[160px] mx-2 focus:outline-none group ${selectedCategory === cat.key ? 'bg-cyan-600/20 border-cyan-400' : 'bg-gray-900/40 border-gray-700'} border-2 rounded-2xl p-6 transition-all duration-200 hover:scale-105`}
            >
              <div className={`w-40 h-40 flex items-center justify-center rounded-2xl mb-4 overflow-hidden ${selectedCategory === cat.key ? 'bg-cyan-500/20' : 'bg-gray-800/40'}`}>
                <img src={cat.image} alt={cat.label} className="object-cover w-full h-full" />
              </div>
              <span className={`text-xl font-semibold ${selectedCategory === cat.key ? 'text-cyan-300' : 'text-gray-200'}`}>{cat.label}</span>
            </button>
          ))}
        </div>
      </section>
      {/* Product Listings Section */}
      <section className="relative z-10 max-w-6xl mx-auto px-4 pb-16">
        <h2 className="text-2xl font-bold mb-4 text-white">Products</h2>
        <div className="col-span-full text-center py-24">
          <h3 className="text-2xl font-bold text-white mb-2">No product listed yet.</h3>
        </div>
      </section>
      <Footer />

      {/* Floating Action Button */}
      <div className="fixed bottom-8 right-8 z-50">
        <button
          onClick={() => navigation("/login")}
          className="bg-gradient-to-r from-cyan-500 to-emerald-600 text-white p-4 rounded-full shadow-lg hover:shadow-xl hover:shadow-cyan-500/30 transition-all duration-300 animate-bounce hover:scale-110"
        >
          <Star className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
};

export default WelcomePage;