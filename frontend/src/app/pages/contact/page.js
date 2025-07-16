"use client";

import Footer from "@/app/components/footer/page";
import Navbar from "@/app/components/navbar/page";
import { useState } from "react";

export default function ContactPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would send the form data to your backend or an email service
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white flex flex-col">
      <Navbar />
      <main className="flex-1 max-w-2xl mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold mb-6 text-cyan-400">Contact Us</h1>
        <p className="mb-8 text-gray-300">
          Have a question, feedback, or want to get in touch? Fill out the form below or email us at{" "}
          <span className="text-cyan-300">support@rewear.com</span>.
        </p>
        {submitted ? (
          <div className="bg-emerald-700/20 border border-emerald-500/30 rounded-xl p-6 text-emerald-300 text-center font-semibold">
            Thank you for reaching out! We’ll get back to you soon.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block mb-1 font-semibold">
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                value={form.name}
                onChange={handleChange}
                className="w-full p-2 rounded bg-gray-800 text-white"
                placeholder="Your name"
              />
            </div>
            <div>
              <label htmlFor="email" className="block mb-1 font-semibold">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                value={form.email}
                onChange={handleChange}
                className="w-full p-2 rounded bg-gray-800 text-white"
                placeholder="your@email.com"
              />
            </div>
            <div>
              <label htmlFor="message" className="block mb-1 font-semibold">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                required
                value={form.message}
                onChange={handleChange}
                className="w-full p-2 rounded bg-gray-800 text-white"
                placeholder="Type your message here..."
                rows={5}
              />
            </div>
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-cyan-500 to-emerald-600 text-white font-semibold py-3 px-6 rounded-xl hover:from-cyan-600 hover:to-emerald-700 focus:outline-none focus:ring-4 focus:ring-cyan-500/20 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              Send Message
            </button>
          </form>
        )}
        <div className="mt-12 text-gray-400 text-sm">
          <div>
            <span className="font-semibold text-white">Email:</span> support@rewear.com
          </div>
          <div>
            <span className="font-semibold text-white">Phone:</span> +1 (555) 123-4567
          </div>
          <div>
            <span className="font-semibold text-white">Address:</span> 123 Main Street, Your City
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}