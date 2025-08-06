"use client";

import React from "react";
import Link from "next/link";
import { CiTimer } from "react-icons/ci";
import { FaTasks } from "react-icons/fa";
import { IoGameControllerOutline } from "react-icons/io5";
import { motion, Variants } from "framer-motion";

const MotionLink = motion(Link);

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: (custom: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: custom * 0.2, duration: 0.5, ease: "easeOut" },
  }),
  hover: {
    scale: 1.05,
    transition: { type: "spring", stiffness: 300 },
  },
};

type CardData = {
  title: string;
  icon: React.ReactNode;
  bgColor: string;
  iconBgColor: string;
  description: string;
  link: string;
};

const cardsData: CardData[] = [
  {
    title: "Pomodoro",
    icon: <CiTimer size={48} className="text-red-600 dark:text-red-400" />,
    bgColor:
      "bg-red-100 hover:bg-red-200 dark:bg-red-800 dark:hover:bg-red-700",
    iconBgColor: "bg-red-200 dark:bg-red-700",
    description:
      "Use the Pomodoro technique to boost focus and productivity. Work in short, focused intervals with breaks.",
    link: "/pomodoro",
  },
  {
    title: "Task Management",
    icon: <FaTasks size={48} className="text-blue-600 dark:text-blue-400" />,
    bgColor:
      "bg-blue-100 hover:bg-blue-200 dark:bg-blue-800 dark:hover:bg-blue-700",
    iconBgColor: "bg-blue-200 dark:bg-blue-700",
    description:
      "Organize your tasks efficiently. Add, track, and complete your to-dos to stay on top of your goals.",
    link: "/dashboard",
  },
  {
    title: "Game",
    icon: (
      <IoGameControllerOutline
        size={48}
        className="text-green-600 dark:text-green-400"
      />
    ),
    bgColor:
      "bg-green-100 hover:bg-green-200 dark:bg-green-800 dark:hover:bg-green-700",
    iconBgColor: "bg-green-200 dark:bg-green-700",
    description:
      "Take a short break with a mini game to refresh your mind during long work sessions. Balance work and fun!",
    link: "/game",
  },
];

const Cards: React.FC = () => {
  return (
    <div className="bg-gray-100 dark:bg-gray-300 py-10 text-black dark:text-white flex flex-col sm:flex-row justify-around items-center gap-8 px-4">
      {cardsData.map((card, index) => (
        <MotionLink
          key={card.title}
          href={card.link}
          className={`rounded-xl ${card.bgColor} p-8 max-w-xs text-center shadow-lg block cursor-pointer transition-colors duration-300`}
          variants={cardVariants}
          initial="hidden"
          whileInView="visible"
          whileHover="hover"
          custom={index}
          viewport={{ once: true, amount: 0.3 }}
        >
          <div
            className={`mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full ${card.iconBgColor} shadow-md`}
          >
            {card.icon}
          </div>
          <h1 className="text-xl font-semibold mb-2">{card.title}</h1>
          <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
            {card.description}
          </p>
        </MotionLink>
      ))}
    </div>
  );
};

export default Cards;
