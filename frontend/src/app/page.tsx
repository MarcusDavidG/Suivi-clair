"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import Header from "./components/internal/Header";
import ConnectButton from "../app/components/lib/Connect";
import { useAccount } from "@starknet-react/core";

const images = [
  "/assets/Roadfreight.jpg",
  "/assets/Groundshipping.jpg",
  "/assets/Railfreight.jpg",
  "/assets/Seafreight.jpg",
];

export default function Home() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const { address } = useAccount();

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <main className="flex min-h-svh flex-col justify-between gap-16">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-[8rem] md:pt-[clamp(200px,25vh,650px)]">
        <div className="flex flex-col-reverse md:flex-row items-center">
          {/* Image Carousel */}
          <div className="relative w-full mx-10 h-[400px] md:h-[600px] md:w-1/2">
            {images.map((image, index) => (
              <div
                key={index}
                className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                  index === currentIndex ? "opacity-100 z-10" : "opacity-0 z-0"
                }`}
              >
                <Image
                  src={image}
                  alt={`Freight Image ${index + 1}`}
                  fill
                  className="object-cover rounded-lg"
                />
              </div>
            ))}
          </div>

          {/* Content */}
          <div className="flex flex-col justify-center items-center text-center p-4 md:w-1/2">
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-medium text-gray-100">
              Revolutionize Supply Chain Tracking with{" "}
              <span className="text-cyan-300">Suiviclair</span>
            </h1>
            <p className="text-sm md:text-base lg:text-lg text-gray-400 mt-4 max-w-xs md:max-w-md font-light">
              Experience real-time transparency, trust, and efficiency with
              blockchain-powered shipment tracking. From manufacturing to
              delivery, every step is immutably recorded.
            </p>
            
            <div className="flex gap-2 md:flex-col lg:flex-row justify-center mt-8">
              {!address ? (
                <ConnectButton />
              ) : (
                <div className="flex gap-4 md:flex-col lg:flex-row">
                  <Link
                    href="/createShipment"
                    className="bg-cyan-500/80 hover:bg-cyan-500 px-6 py-3 rounded text-sm md:text-lg font-medium text-white transition-colors duration-200 min-w-[200px]"
                  >
                    Create Shipment
                  </Link>
                  <Link
                    href="/track"
                    className="bg-gray-800/80 hover:bg-gray-800 px-6 py-3 rounded text-sm md:text-lg font-medium text-white transition-colors duration-200 min-w-[200px]"
                  >
                    Track Shipment
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="p-8 text-center">
        <h2 className="text-2xl font-medium text-gray-100 mb-4">
          If You Transport It, We'll Track It!
        </h2>
        <p className="text-gray-400 mb-8 text-sm font-light">
          Discover how Suiviclair revolutionizes supply chain tracking with
          cutting-edge features.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            {
              title: "Real-Time Updates",
              description: "Stay informed with live tracking of your shipments, ensuring every movement is monitored."
            },
            {
              title: "Immutable Records",
              description: "Each step in the process is securely logged on the blockchain, providing a tamper-proof record."
            },
            {
              title: "Transparency for All",
              description: "Stay informed with live tracking of your shipments, ensuring every movement is monitored."
            },
            {
              title: "Proof of Authenticity",
              description: "Resolve disputes quickly with accurate and verifiable data, backed by blockchain technology."
            }
          ].map((feature, index) => (
            <div key={index} className="p-4 bg-gray-900/50 backdrop-blur-sm rounded border border-gray-800">
              <h3 className="text-lg font-medium text-gray-100">
                {feature.title}
              </h3>
              <p className="text-gray-400 mt-2 font-light">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Route Options Section */}
      <section className="p-8">
        <h2 className="text-center text-2xl font-medium text-gray-100 mb-4">
          Route of your Package!
        </h2>
        <p className="text-center text-gray-400 mb-8 text-sm font-light">
          Track every step of your shipment's journey with Suiviclair, offering
          a seamless and transparent view of your package's route.
        </p>
      </section>
    </main>
  );
}