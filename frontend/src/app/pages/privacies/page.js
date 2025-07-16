"use client";

import Footer from "@/app/components/footer/page";
import Navbar from "@/app/components/navbar/page";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white flex flex-col">
      <Navbar />
      <main className="flex-1 max-w-3xl mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold mb-6 text-cyan-400">Privacy Policy</h1>
        <p className="mb-4 text-gray-300">
          At ReWear, we value your privacy and are committed to protecting your personal information. This Privacy Policy explains how we collect, use, and safeguard your data when you use our platform.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-2 text-emerald-400">1. Information We Collect</h2>
        <ul className="list-disc ml-6 text-gray-300 mb-4">
          <li>Your name, email address, and contact details when you register.</li>
          <li>Profile information you provide, such as gender, location, and preferences.</li>
          <li>Items you list, messages you send, and activity on the platform.</li>
          <li>Technical data such as IP address, browser type, and device information.</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-8 mb-2 text-emerald-400">2. How We Use Your Information</h2>
        <ul className="list-disc ml-6 text-gray-300 mb-4">
          <li>To create and manage your account.</li>
          <li>To facilitate clothing exchanges and communication between users.</li>
          <li>To improve our services and personalize your experience.</li>
          <li>To send important updates, notifications, and marketing (with your consent).</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-8 mb-2 text-emerald-400">3. Data Sharing & Security</h2>
        <ul className="list-disc ml-6 text-gray-300 mb-4">
          <li>We do not sell your personal data to third parties.</li>
          <li>We may share information with trusted partners to operate the platform (e.g., payment, hosting).</li>
          <li>We use industry-standard security measures to protect your data.</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-8 mb-2 text-emerald-400">4. Your Rights</h2>
        <ul className="list-disc ml-6 text-gray-300 mb-4">
          <li>You can access, update, or delete your personal information at any time.</li>
          <li>You can opt out of marketing communications.</li>
          <li>Contact us at <span className="text-cyan-300">support@rewear.com</span> for privacy-related requests.</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-8 mb-2 text-emerald-400">5. Changes to This Policy</h2>
        <p className="text-gray-300 mb-4">
          We may update this Privacy Policy from time to time. We will notify you of any significant changes.
        </p>

        <p className="text-gray-400 mt-8">
          Last updated: July 2025
        </p>
      </main>
      <Footer />
    </div>
  );
}