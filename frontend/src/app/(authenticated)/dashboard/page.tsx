// fe/src/app/dashboard/page.tsx
"use client";

import { useAuthStore } from "@/stores/authStore";
import TaskList from "@/components/TaskList";

export default function DashboardPage() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const loadingUser = useAuthStore((state) => state.loadingUser);

  if (loadingUser) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-white">
        <p>Loading dashboard...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="p-6 md:p-8 flex-1">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-extrabold text-center mb-8 text-gray-900 dark:text-white">
          Overview
        </h2>

        <section className="mb-10">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <TaskList />
          </div>
        </section>
      </div>
    </div>
  );
}
