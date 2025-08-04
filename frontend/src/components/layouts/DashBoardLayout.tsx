"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuthStore } from "@/stores/authStore";
import Link from "next/link";
import toast from "react-hot-toast";

import { Home, Clock, Info, Puzzle, LogOut, Menu, X } from "lucide-react";
import ThemeToggle from "@/app/theme/ThemeToggle";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();

  const user = useAuthStore((state) => state.user);
  const loadingUser = useAuthStore((state) => state.loadingUser);
  const setUser = useAuthStore((state) => state.setUser);
  const setLoadingUser = useAuthStore((state) => state.setLoadingUser);

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = async () => {
    setLoadingUser(true);

    // Remove the JWT and user data from local storage
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("userEmail");

    // Clear the user from the Zustand store
    setUser(null);
    setLoadingUser(false);

    toast.success("Logged out successfully!");
    router.push("/auth/login");
  };

  const navItems = [
    { name: "Dashboard", href: "/dashboard", icon: Home },
    { name: "Pomodoro", href: "/pomodoro", icon: Clock },
    { name: "Game", href: "/game", icon: Puzzle },
    { name: "About", href: "/about", icon: Info },
  ];

  return (
    <div className="flex min-h-dvh bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-white">
      <div className="md:hidden fixed top-4 left-4 z-30">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 rounded-md text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          {sidebarOpen ? (
            <X className="h-6 w-6" aria-hidden="true" />
          ) : (
            <Menu className="h-6 w-6" aria-hidden="true" />
          )}
        </button>
      </div>

      <aside
        className={`fixed inset-y-0 left-0 z-20 w-64 bg-white dark:bg-gray-800 shadow-lg transform ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:relative md:translate-x-0 transition-transform duration-200 ease-in-out flex flex-col`}
      >
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <Link
            href="/dashboard"
            className="flex items-center space-x-3 text-gray-900 dark:text-white"
          >
            <span className="text-xl pl-7 font-mono">Kinetic Spark</span>
          </Link>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center p-3 rounded-lg text-lg font-medium transition-colors duration-200 ${
                pathname === item.href
                  ? "bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-200"
                  : "text-gray-700 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white"
              }`}
              onClick={() => setSidebarOpen(false)}
            >
              <item.icon className="h-6 w-6 mr-3" aria-hidden="true" />
              {item.name}
            </Link>
          ))}
          <ThemeToggle />
        </nav>

        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          {user ? (
            <>
              <p className="text-gray-700 dark:text-gray-300 text-sm mb-2 truncate">
                Logged in as:{" "}
                <span className="font-semibold">{user.email}</span>
              </p>
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-md shadow-sm transition duration-200 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                disabled={loadingUser}
              >
                <LogOut className="h-5 w-5 mr-2" />
                {loadingUser ? "Logging Out..." : "Log Out"}
              </button>
            </>
          ) : (
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              Loading user...
            </p>
          )}
        </div>
      </aside>

      <div className="flex-1 flex flex-col overflow-hidden md:ml-64">
        {children}
      </div>
    </div>
  );
}
