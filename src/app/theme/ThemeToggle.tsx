import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  return (
    <div className="flex w-full  ">
      <button
        onClick={() => setTheme(theme === "light" ? "dark" : "light")}
        className="flex items-center gap-2 px-4 py-2 rounded-md  border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-100 bg-white dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
      >
        {theme === "light" ? (
          <>
            <Moon className="w-5 h-5" />
            <span>Dark Mode</span>
          </>
        ) : (
          <>
            <Sun className="w-5 h-5" />
            <span>Light Mode</span>
          </>
        )}
      </button>
    </div>
  );
}
