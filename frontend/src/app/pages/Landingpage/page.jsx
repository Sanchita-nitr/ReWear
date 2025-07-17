"use client";
import {
  ArrowRight,
  Bot,
  Building,
  Check,
  Globe,
  Menu,
  Moon,
  Recycle,
  Shield,
  Sun,
  TrendingUp,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function ProfessionalLandingPage() {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const [showChatbot, setShowChatbot] = useState(false);
  const router = useRouter();

  const startJourney = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/auth/signup");
      return;
    }
    try {
      const res = await fetch("http://127.0.0.1:8000/users/me/", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      if (res.ok) {
        router.push("/pages/dashboard");
      } else {
        router.push("/auth/signup");
      }
    } catch (error) {
      router.push("/auth/signup");
    }
  };

  // Theme toggle function
  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  // Scroll handler for active section
  useEffect(() => {
    const handleScroll = () => {
      const sections = ["home", "features", "solutions", "about", "contact"];
      const scrollPosition = window.scrollY + 100;

      sections.forEach((section) => {
        const element = document.getElementById(section);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (
            scrollPosition >= offsetTop &&
            scrollPosition < offsetTop + offsetHeight
          ) {
            setActiveSection(section);
          }
        }
      });
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const themeClasses = isDarkMode
    ? "bg-gray-900 text-white"
    : "bg-white text-gray-900";

  const cardClasses = isDarkMode
    ? "bg-gray-800 border-gray-700"
    : "bg-white border-gray-200";

  const textSecondary = isDarkMode ? "text-gray-300" : "text-gray-600";

  const features = [
    {
      icon: <Building className="w-8 h-8" />,
      title: "Enterprise Solutions",
      description:
        "Scalable clothing exchange platform for businesses of all sizes",
      color: "from-blue-500 to-indigo-600",
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Secure Platform",
      description: "Bank-level security with verified users and transactions",
      color: "from-green-500 to-emerald-600",
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: "Analytics Dashboard",
      description: "Real-time insights and reporting for business optimization",
      color: "from-purple-500 to-pink-600",
    },
    {
      icon: <Globe className="w-8 h-8" />,
      title: "Global Reach",
      description: "Connect with a worldwide community of fashion enthusiasts",
      color: "from-orange-500 to-red-600",
    },
  ];

  const solutions = [
    {
      title: "For Individuals",
      description: "Personal clothing exchange with AI-powered matching",
      features: [
        "Smart recommendations",
        "Secure transactions",
        "Community reviews",
      ],
      price: "Free",
    },
    {
      title: "For Businesses",
      description: "Corporate sustainability programs and employee benefits",
      features: ["Bulk exchanges", "Analytics dashboard", "Custom branding"],
      price: "$99/month",
      popular: true,
    },
    {
      title: "Enterprise",
      description: "Large-scale implementation with dedicated support",
      features: ["API integration", "24/7 support", "Custom development"],
      price: "Contact us",
    },
  ];

  const navigation = [
    { name: "Home", href: "#home" },
    { name: "Features", href: "#features" },
    { name: "Solutions", href: "#solutions" },
    { name: "About", href: "#about" },
    { name: "Contact", href: "#contact" },
  ];

  return (
    <div className={`min-h-screen transition-all duration-300 ${themeClasses}`}>
      {/* Navigation */}
      <nav
        className={`fixed top-0 w-full z-50 backdrop-blur-lg border-b transition-all duration-300 ${
          isDarkMode
            ? "bg-gray-900/80 border-gray-700"
            : "bg-white/80 border-gray-200"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  ReWear
                </h1>
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-8">
                {navigation.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      activeSection === item.href.substring(1)
                        ? "text-blue-600"
                        : `${textSecondary} hover:text-blue-600`
                    }`}
                  >
                    {item.name}
                  </a>
                ))}
              </div>
            </div>

            {/* Theme Toggle & Menu */}
            <div className="flex items-center space-x-4">
              <button
                onClick={toggleTheme}
                className={`p-2 rounded-lg transition-colors ${
                  isDarkMode
                    ? "bg-gray-800 hover:bg-gray-700"
                    : "bg-gray-100 hover:bg-gray-200"
                }`}
              >
                {isDarkMode ? (
                  <Sun className="w-5 h-5" />
                ) : (
                  <Moon className="w-5 h-5" />
                )}
              </button>

              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden p-2 rounded-md"
              >
                {isMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div
            className={`md:hidden border-t ${
              isDarkMode ? "border-gray-700" : "border-gray-200"
            }`}
          >
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {navigation.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                    activeSection === item.href.substring(1)
                      ? "text-blue-600"
                      : `${textSecondary} hover:text-blue-600`
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </a>
              ))}
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section id="home" className="pt-32 pb-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight font-serif">
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent ">
                NeoWardrobe
              </span>
              <br />
              Modern Clothing Sharing Network
            </h1>
            <p
              className={`text-xl md:text-2xl mb-8 max-w-3xl mx-auto font-sans ${textSecondary}`}
            >
              Transform your organization's approach to sustainable fashion with
              our enterprise-grade clothing exchange solution.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={startJourney}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                Start Your Journey
                <ArrowRight className="w-5 h-5 ml-2 inline" />
              </button>
              <button
                className={`border-2 px-8 py-4 rounded-lg font-semibold transition-all duration-300 ${
                  isDarkMode
                    ? "border-gray-600 hover:border-blue-500 hover:bg-blue-500/10"
                    : "border-gray-300 hover:border-blue-500 hover:bg-blue-500/10"
                }`}
              >
                Schedule Demo
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Why Choose ReWear?
            </h2>
            <p className={`text-lg ${textSecondary} max-w-2xl mx-auto`}>
              Our platform combines cutting-edge technology with sustainable
              practices to deliver exceptional results.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className={`p-6 rounded-xl border transition-all duration-300 hover:shadow-lg hover:scale-105 ${cardClasses}`}
              >
                <div
                  className={`w-16 h-16 rounded-lg bg-gradient-to-r ${feature.color} flex items-center justify-center text-white mb-4`}
                >
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className={textSecondary}>{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Solutions Section */}
      <section id="solutions" className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Solutions for Every Scale
            </h2>
            <p className={`text-lg ${textSecondary} max-w-2xl mx-auto`}>
              From individual users to large enterprises, we have the perfect
              solution for your needs.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {solutions.map((solution, index) => (
              <div
                key={index}
                className={`relative p-8 rounded-xl border transition-all duration-300 hover:shadow-lg ${cardClasses} ${
                  solution.popular ? "ring-2 ring-blue-500" : ""
                }`}
              >
                {solution.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-1 rounded-full text-sm font-semibold">
                      Most Popular
                    </span>
                  </div>
                )}
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold mb-2">{solution.title}</h3>
                  <p className={`${textSecondary} mb-4`}>
                    {solution.description}
                  </p>
                  <div className="text-3xl font-bold text-blue-600">
                    {solution.price}
                  </div>
                </div>
                <ul className="space-y-3 mb-8">
                  {solution.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center">
                      <Check className="w-5 h-5 text-green-500 mr-3" />
                      <span className={textSecondary}>{feature}</span>
                    </li>
                  ))}
                </ul>
                <button
                  className={`w-full py-3 rounded-lg font-semibold transition-all duration-300 ${
                    solution.popular
                      ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700"
                      : `border-2 ${
                          isDarkMode
                            ? "border-gray-600 hover:border-blue-500"
                            : "border-gray-300 hover:border-blue-500"
                        }`
                  }`}
                >
                  Get Started
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                About ReWear
              </h2>
              <p className={`text-lg ${textSecondary} mb-6`}>
                We're revolutionizing the fashion industry by making sustainable
                clothing exchange accessible, secure, and profitable for
                businesses worldwide.
              </p>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <div className="text-3xl font-bold text-blue-600">10M+</div>
                  <div className={textSecondary}>Items Exchanged</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-purple-600">500+</div>
                  <div className={textSecondary}>Business Partners</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-green-600">95%</div>
                  <div className={textSecondary}>Customer Satisfaction</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-orange-600">50+</div>
                  <div className={textSecondary}>Countries</div>
                </div>
              </div>
            </div>
            <div className={`p-8 rounded-xl border ${cardClasses}`}>
              <h3 className="text-2xl font-bold mb-4">Our Mission</h3>
              <p className={`${textSecondary} mb-6`}>
                To create a sustainable future where fashion waste is eliminated
                through intelligent, community-driven exchange platforms.
              </p>
              <div className="flex items-center space-x-4">
                <Recycle className="w-8 h-8 text-green-500" />
                <div>
                  <div className="font-semibold">Sustainability First</div>
                  <div className={`text-sm ${textSecondary}`}>
                    Every exchange reduces waste
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Get Started?
          </h2>
          <p className={`text-lg ${textSecondary} mb-8`}>
            Join thousands of businesses already transforming their approach to
            sustainable fashion.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105">
              Contact Sales
            </button>
            <button
              className={`border-2 px-8 py-4 rounded-lg font-semibold transition-all duration-300 ${
                isDarkMode
                  ? "border-gray-600 hover:border-blue-500 hover:bg-blue-500/10"
                  : "border-gray-300 hover:border-blue-500 hover:bg-blue-500/10"
              }`}
            >
              Try Free Demo
            </button>
          </div>
        </div>
      </section>

      {/* AI Chatbot Introduction */}
      <div className="fixed bottom-6 right-6 z-50">
        <div className="relative">
          {showChatbot && (
            <div
              className={`absolute bottom-16 right-0 w-80 p-6 rounded-lg border shadow-xl ${cardClasses}`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <Bot className="w-6 h-6 text-blue-500 mr-2" />
                  <h3 className="font-semibold">AI Assistant</h3>
                </div>
                <button
                  onClick={() => setShowChatbot(false)}
                  className={`p-1 rounded ${
                    isDarkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"
                  }`}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <p className={`${textSecondary} mb-4`}>
                Hi! I'm your AI assistant. I can help you with:
              </p>
              <ul className={`space-y-2 ${textSecondary} text-sm`}>
                <li>• Product recommendations</li>
                <li>• Platform navigation</li>
                <li>• Technical support</li>
                <li>• Business inquiries</li>
              </ul>
              <button className="w-full mt-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300">
                Start Chat
              </button>
            </div>
          )}
          <button
            onClick={() => setShowChatbot(!showChatbot)}
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
          >
            <Bot className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Footer */}
      <footer
        className={`border-t py-12 px-4 ${
          isDarkMode ? "border-gray-700" : "border-gray-200"
        }`}
      >
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                ReWear
              </h3>
              <p className={textSecondary}>
                Professional clothing exchange platform for sustainable business
                practices.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Solutions</h4>
              <ul className={`space-y-2 ${textSecondary}`}>
                <li>Individual Plans</li>
                <li>Business Solutions</li>
                <li>Enterprise</li>
                <li>API Integration</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className={`space-y-2 ${textSecondary}`}>
                <li>About Us</li>
                <li>Careers</li>
                <li>Blog</li>
                <li>Press</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className={`space-y-2 ${textSecondary}`}>
                <li>Help Center</li>
                <li>Contact Us</li>
                <li>Privacy Policy</li>
                <li>Terms of Service</li>
              </ul>
            </div>
          </div>
          <div
            className={`mt-8 pt-8 border-t text-center ${
              isDarkMode ? "border-gray-700" : "border-gray-200"
            } ${textSecondary}`}
          >
            <p>&copy; 2025 ReWear. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
