"use client";
import { useState } from "react";
import { Menu, X, ShoppingBag, User } from "lucide-react";
import { useRouter } from "next/navigation";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-gray-900/80 backdrop-blur-md border-b border-gray-700/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-emerald-400 bg-clip-text text-transparent">
              ReWear
            </h1>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <a href="#home" className="text-gray-300 hover:text-white transition-colors">
              Home
            </a>
            <a href="#categories" className="text-gray-300 hover:text-white transition-colors">
              Categories
            </a>
            <a href="#about" className="text-gray-300 hover:text-white transition-colors">
              About
            </a>
            <a href="#contact" className="text-gray-300 hover:text-white transition-colors">
              Contact
            </a>
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <button className="p-2 text-gray-300 hover:text-white transition-colors">
              <ShoppingBag className="w-5 h-5" />
            </button>
            <button 
              onClick={() => router.push("/login")}
              className="bg-gradient-to-r from-cyan-500 to-emerald-600 text-white px-4 py-2 rounded-lg hover:from-cyan-600 hover:to-emerald-700 transition-all"
            >
              <User className="w-4 h-4 inline mr-2" />
              Login
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-300 hover:text-white transition-colors"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-gray-800/90 rounded-lg mt-2">
              <a href="#home" className="block px-3 py-2 text-gray-300 hover:text-white transition-colors">
                Home
              </a>
              <a href="#categories" className="block px-3 py-2 text-gray-300 hover:text-white transition-colors">
                Categories
              </a>
              <a href="#about" className="block px-3 py-2 text-gray-300 hover:text-white transition-colors">
                About
              </a>
              <a href="#contact" className="block px-3 py-2 text-gray-300 hover:text-white transition-colors">
                Contact
              </a>
              <div className="pt-4 border-t border-gray-700">
                <button 
                  onClick={() => router.push("/login")}
                  className="w-full bg-gradient-to-r from-cyan-500 to-emerald-600 text-white px-4 py-2 rounded-lg hover:from-cyan-600 hover:to-emerald-700 transition-all"
                >
                  <User className="w-4 h-4 inline mr-2" />
                  Login
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar; 