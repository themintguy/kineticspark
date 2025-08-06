"use client";

import React, { useEffect, useState } from "react";
import { ShaderGradientCanvas, ShaderGradient } from "@shadergradient/react";
import clsx from "clsx";
import Cards from "@/components/ui/Cards";
import Link from "next/link";
import Footer from "@/components/ui/Footer";


const Page = () => {
  const [scrollY, setScrollY] = useState(0);


  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);


  const shrink = Math.max(1 - scrollY / 400, 0);

  return (
    <>
      <div className="relative">
        <section className="relative h-screen overflow-hidden">
          <ShaderGradientCanvas
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              zIndex: -1,
              pointerEvents: "none",
              transform: `scale(${0.8 + 0.2 * shrink})`,
              opacity: shrink,
              transition: "transform 0.2s, opacity 0.2s",
            }}
          >
            <ShaderGradient
              control="query"
              urlString="https://www.shadergradient.co/customize?animate=on&axesHelper=off&bgColor1=%23000000&bgColor2=%23000000&brightness=1.2&cAzimuthAngle=170&cDistance=4.4&cPolarAngle=70&cameraZoom=1&color1=%231f5eff&color2=%2347ff60&color3=%23ffe3ed&destination=onCanvas&embedMode=off&envPreset=city&format=gif&fov=45&frameRate=10&gizmoHelper=hide&grain=off&lightType=3d&pixelDensity=1&positionX=0&positionY=0.9&positionZ=-0.3&range=enabled&rangeEnd=40&rangeStart=0&reflection=0.1&rotationX=45&rotationY=0&rotationZ=0&shader=defaults&type=waterPlane&uAmplitude=0&uDensity=1.2&uFrequency=0&uSpeed=0.2&uStrength=3.4&uTime=0&wireframe=false"
            />
          </ShaderGradientCanvas>

          <div className="relative z-10 flex h-full flex-col items-center justify-center transition-all">
            <h1
              className={clsx(
                "text-center font-mono text-5xl transition-all duration-300",
                shrink < 0.5 &&
                  "scale-90 opacity-80 " +
                    "bg-gradient-to-tr from-stone-400 via-gray-950 to-purple-700 bg-clip-text text-transparent"
              )}
            >
              Kinetic SparK
            </h1>

            <p className="mt-4 text-l">
              Make Your Productivity with Kinetic ⚡
            </p>
          </div>
        </section>

        <main className="bg-white text-black py-16 px-4 sm:px-20 lg:px-20 pb-20">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight mb-6">
              Welcome to
              <span className="text-blue-500"> Kinetic </span>
              <br />
              <span className="text-green-400">SparK</span>
            </h1>

            <p className="text-lg sm:text-xl font-medium leading-relaxed mt-4">
              ✨ Spark Your Productivity <br className="hidden sm:block" />
              with{" "}
              <span className="font-semibold text-blue-600">
                Kinetic Spark ⚡
              </span>
              <br className="hidden sm:block" />
              Unleash your potential. Stay energized. Get things done. 🚀
            </p>
          </div>
        </main>

        <Cards />

        <div className="py-20 bg-white text-black ">
          <h1 className="text-center text-3xl font-bold">Start Your Journey</h1>
          <h2 className="text-center text-xl "> Ready to transform?</h2>

          <div className="flex flex-col items-center justify-center mt-8 space-y-8">
            <button className="bg-blue-400 text-white px-12 py-3 rounded-3xl hover:bg-blue-500 transition">
              <Link href="/auth/login">Login</Link>
            </button>
            <button className="bg-green-400 text-white px-10 py-3 rounded-3xl hover:bg-green-500 transition">
              <Link href="/auth/signup">Sign Up</Link>
            </button>
          </div>
        </div>
      </div>


      <Footer/>
    </>
  );
};

export default Page;
