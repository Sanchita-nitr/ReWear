"use client";
import { useContext, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AuthContext } from "@/app/context/AuthContext";

export default function ProtectedRoute({ children }) {
  const { user } = useContext(AuthContext);
  const router = useRouter();

  useEffect(() => {
    if (user === null) {
      router.replace("/pages/landingpage");
    }
  }, [user, router]);

  if (!user) {
    // Optionally show a loading spinner
    return null;
  }

  return children;
}