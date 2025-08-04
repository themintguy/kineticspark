"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/stores/authStore";
import { useRouter, usePathname } from "next/navigation";

interface AuthListenerProps {
  children: React.ReactNode;
}

export default function AuthListener({ children }: AuthListenerProps) {
  const { setUser, setLoadingUser,  loadingUser } =
    useAuthStore();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const checkAuthStatus = () => {
      setLoadingUser(true);
      const token = localStorage.getItem("token");
      const userEmail = localStorage.getItem("userEmail");
      const userId = localStorage.getItem("userId");

      if (token && userEmail && userId) {
        setUser({ id: userId, email: userEmail });
      } else {
        setUser(null);
        if (pathname === "/dashboard") {
          router.push("/auth/login");
        }
      }
      setLoadingUser(false);
    };

    checkAuthStatus();
  }, [setUser, setLoadingUser, pathname, router]);


  if (loadingUser) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-white">
        <p>Loading...</p>
      </div>
    );
  }

  return <>{children}</>;
}
