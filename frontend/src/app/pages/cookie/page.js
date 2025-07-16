"use client";

import Footer from "@/app/components/footer/page";
import Navbar from "@/app/components/navbar/page";

export default function CookiePolicy() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white flex flex-col">
      <Navbar />
      <main className="flex-1 max-w-3xl mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold mb-6 text-cyan-400">Cookie Policy</h1>
        <p className="mb-4 text-gray-300">
          This Cookie Policy explains how ReWear uses cookies and similar technologies to recognize you when you visit our website. It explains what these technologies are and why we use them, as well as your rights to control our use of them.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-2 text-emerald-400">1. What Are Cookies?</h2>
        <p className="text-gray-300 mb-4">
          Cookies are small data files that are placed on your device when you visit a website. Cookies are widely used to make websites work, or to work more efficiently, as well as to provide reporting information.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-2 text-emerald-400">2. How We Use Cookies</h2>
        <ul className="list-disc ml-6 text-gray-300 mb-4">
          <li>To remember your preferences and settings.</li>
          <li>To keep you signed in to your account.</li>
          <li>To analyze site traffic and usage for improvement.</li>
          <li>To provide relevant content and features.</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-8 mb-2 text-emerald-400">3. Types of Cookies We Use</h2>
        <ul className="list-disc ml-6 text-gray-300 mb-4">
          <li><span className="text-cyan-300">Essential Cookies:</span> Necessary for the website to function properly.</li>
          <li><span className="text-cyan-300">Performance Cookies:</span> Help us understand how visitors interact with our site.</li>
          <li><span className="text-cyan-300">Functionality Cookies:</span> Remember your preferences and choices.</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-8 mb-2 text-emerald-400">4. Managing Cookies</h2>
        <p className="text-gray-300 mb-4">
          You can control and manage cookies in your browser settings. Please note that removing or blocking cookies may impact your user experience and some features may not be available.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-2 text-emerald-400">5. Changes to This Policy</h2>
        <p className="text-gray-300 mb-4">
          We may update this Cookie Policy from time to time. We encourage you to review this page periodically for the latest information.
        </p>

        <p className="text-gray-400 mt-8">
          Last updated: July 2025
        </p>
      </main>
      <Footer />
    </div>
  );
}