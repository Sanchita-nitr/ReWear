"use client";

import Footer from "@/app/components/footer/page";
import Navbar from "@/app/components/navbar/page";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white flex flex-col">
      <Navbar />
      <main className="flex-1 max-w-3xl mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold mb-6 text-cyan-400">About ReWear</h1>
        <p className="mb-6 text-gray-300">
          <span className="font-semibold text-emerald-400">ReWear</span> is a community-driven clothing exchange platform dedicated to promoting sustainable fashion and reducing textile waste. Our mission is to empower individuals to give their pre-loved clothes a new life, connect with like-minded people, and make eco-friendly choices accessible to everyone.
        </p>
        <h2 className="text-2xl font-semibold mt-8 mb-2 text-emerald-400">Why ReWear?</h2>
        <ul className="list-disc ml-6 text-gray-300 mb-4">
          <li>Reduce your environmental footprint by reusing and recycling clothing.</li>
          <li>Discover unique, affordable, and quality fashion from your community.</li>
          <li>Connect with others who care about sustainability and conscious living.</li>
          <li>Earn rewards and give back by sharing your wardrobe.</li>
        </ul>
        <h2 className="text-2xl font-semibold mt-8 mb-2 text-emerald-400">How It Works</h2>
        <ol className="list-decimal ml-6 text-gray-300 mb-4">
          <li>Create an account and set up your profile.</li>
          <li>List your pre-loved clothes or browse items from others.</li>
          <li>Swap, sell, or donate items easily and securely.</li>
          <li>Join a growing movement for a greener planet!</li>
        </ol>
        <h2 className="text-2xl font-semibold mt-8 mb-2 text-emerald-400">Our Vision</h2>
        <p className="text-gray-300 mb-4">
          We envision a world where fashion is circular, inclusive, and sustainable. By making clothing exchange simple and rewarding, ReWear aims to inspire positive change—one outfit at a time.
        </p>
        <p className="text-gray-400 mt-8">
          Have questions or want to get involved? Contact us at <span className="text-cyan-300">support@rewear.com</span>.
        </p>
      </main>
      <Footer />
    </div>
  );
}