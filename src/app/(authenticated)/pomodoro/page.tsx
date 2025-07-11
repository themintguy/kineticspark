
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/authStore";
import PomodoroTimer from "@/components/PomodoroTimer";



export default function PomodoroPage() {
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
    <>
      <div className="p-6 md:p-8 flex-1">
        <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 text-center">
          {" "}
          <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-4">
            Pomodoro Timer
          </h2>
          <p className="text-lg text-gray-700 dark:text-gray-300">
            This is where your interactive Pomodoro timer component will reside.
          </p>
          <div className="mt-6 border-t border-gray-200 dark:border-gray-700 pt-4">
            <PomodoroTimer />
          </div>
        </div>
      </div>
    </>
  );
}
