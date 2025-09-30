"use client"

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Check login status (token or user in localStorage/sessionStorage)
    let isLoggedIn = false;
    if (typeof window !== "undefined") {
      // Example: check for Auth0 id_token or your own login flag
      isLoggedIn = !!localStorage.getItem("auth0CIdToken") || !!localStorage.getItem("isLoggedIn");
    }
    if (isLoggedIn) {
      router.replace("/Dashboard");
    } else {
      router.replace("/login");
    }
  }, [router]);

  return null;
}
