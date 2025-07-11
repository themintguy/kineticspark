// app/(authenticated)/about/page.tsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/authStore";

export default function AboutPage() {
  const router = useRouter();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const loadingUser = useAuthStore((state) => state.loadingUser);

  useEffect(() => {
    if (!loadingUser && !isAuthenticated) {
      router.push("/auth/login");
    }
  }, [loadingUser, isAuthenticated, router]);

  if (loadingUser || !isAuthenticated) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 flex-1">
      <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 text-center">
        {" "}
        {/* Added text-center here */}
        <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-4">
          About Kinetic Spark
        </h2>
        <p className="text-lg text-gray-700 dark:text-gray-300">
          Kinetic Spark is your all-in-one productivity application designed to
          help you manage tasks, take notes, and focus with the Pomodoro
          technique. We believe in empowering you to achieve your goals
          efficiently.
        </p>
        <p className="mt-4 text-gray-700 dark:text-gray-300">
          Our mission is to provide simple yet powerful tools that make your
          daily work and learning more effective and enjoyable.
        </p>
      </div>
    </div>
  );
}
