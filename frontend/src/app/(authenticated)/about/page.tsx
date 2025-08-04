"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/authStore";
import { SiExpress, SiNextdotjs } from "react-icons/si";
import { BiLogoPostgresql, BiLogoTypescript } from "react-icons/bi";
import { RiTailwindCssFill } from "react-icons/ri";

// 🔧 FEATURES DATA
const features = [
  {
    title: "Task Management",
    description:
      "Organize your to-dos with ease. Create, track, and prioritize tasks to stay on top of your work.",
  },
  {
    title: "Smart Notes",
    description:
      "Capture your ideas and information effortlessly with a versatile note-taking system.",
  },
  {
    title: "Pomodoro Focus",
    description:
      "Boost your productivity using the acclaimed Pomodoro Technique to manage your work intervals.",
  },
];

const technologies = [
  {
    name: "Next.js",
    icon: <SiNextdotjs />,
    ariaLabel: "Next.js logo",
  },
  {
    name: "TypeScript",
    icon: <BiLogoTypescript color="#3178C6" />,
    ariaLabel: "TypeScript logo",
  },
  {
    name: "Tailwind CSS",
    icon: <RiTailwindCssFill color="#38BDF8" />,
    ariaLabel: "Tailwind CSS logo",
  },
  {
    name: "Postgre SQL",
    icon: <BiLogoPostgresql color="#396C94" />,
    ariaLabel: "PostgreSQL logo",
  },
  {
    name: "Zustand",
    icon: <>🔧</>,
    ariaLabel: "Zustand logo",
  },
  {
    name: "Express JS",
    icon: <SiExpress />,
    ariaLabel: "Express logo logo",
  },
];

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
      <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-xl font-medium text-gray-700 dark:text-gray-300">
          Loading user session...
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4 sm:p-6 lg:p-8 bg-gray-50 dark:bg-gray-900">
      <div className="w-full max-w-4xl rounded-xl bg-white p-6 shadow-xl dark:bg-gray-800 sm:p-8 lg:p-10">
        <h1 className="mb-6 text-center text-4xl font-extrabold text-gray-900 dark:text-white sm:text-5xl lg:text-6xl">
          About Kinetic Spark
        </h1>

        <p className="mb-4 text-center text-base leading-relaxed text-gray-700 dark:text-gray-300 sm:text-lg lg:text-xl">
          Kinetic Spark is your all-in-one productivity application designed to
          help you manage tasks, take notes, and focus with the Pomodoro
          technique. We believe in empowering you to achieve your goals
          efficiently.
        </p>
        <p className="mb-6 text-center text-base leading-relaxed text-gray-700 dark:text-gray-300 sm:text-lg lg:text-xl">
          Our mission is to provide simple yet powerful tools that make your
          daily work and learning more effective and enjoyable.
        </p>

        {/* Feature Cards */}
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="rounded-lg bg-gray-100 p-6 text-center shadow-sm dark:bg-gray-700"
            >
              <h3 className="mb-2 text-2xl font-semibold text-gray-900 dark:text-white">
                {feature.title}
              </h3>
              <p className="text-gray-700 dark:text-gray-300">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Technologies Used */}
        <section className="mt-12 text-center">
          <h2 className="mb-8 text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl">
            Our Core Technologies Used
          </h2>
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4">
            {technologies.map((tech) => (
              <div
                key={tech.name}
                className="flex flex-col items-center justify-center rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition-transform duration-200 hover:scale-105 dark:border-gray-700 dark:bg-gray-700"
              >
                <span
                  className="mb-2 text-4xl"
                  role="img"
                  aria-label={tech.ariaLabel}
                >
                  {tech.icon}
                </span>
                <p className="text-lg font-medium text-gray-900 dark:text-white">
                  {tech.name}
                </p>
              </div>
            ))}
          </div>
        </section>

        <div className="mt-10 text-center text-gray-600 dark:text-gray-400">
          <p className="text-sm">
            &copy; {new Date().getFullYear()} Kinetic Spark. All rights
            reserved.
          </p>
        </div>
      </div>
    </div>
  );
}
