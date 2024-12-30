import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useBlockRoute } from "../../hooks/useBlockRoute";
import { WalletButton } from "../../components/shared/ConnectWallet";
import Roadfreight from "../../assets/Roadfreight.jpg";
import Groundshipping from "../../assets/Groundshipping.jpg";
import Railfreight from "../../assets/Railfreight.jpg";
import Seafreight from "../../assets/Seafreight.jpg";

export function Home() {
  const { address } = useBlockRoute();
  const images = [Roadfreight, Groundshipping, Railfreight, Seafreight];
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <>
      {/* Hero Section */}
      <section className="text-center p-4 relative pt-16 h-screen flex flex-col-reverse md:flex-row bg-white dark:bg-gray-950 ">
        <div className="relative w-full h-2/3 md:h-full md:w-1/2 ">
          {images.map((image, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                index === currentIndex ? "opacity-100 z-10" : "opacity-0 z-0"
              }`}
            >
              <img
                src={image}
                alt={`Freight Image ${index + 1}`}
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
          ))}
        </div>
        <div className="flex flex-col justify-center items-center text-center p-4 md:w-1/2 ">
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-gray-800 dark:text-gray-100 relative z-10">
            Revolutionize Supply Chain Tracking with{" "}
            <div className="text-cyan-500">Suiviclair</div>
          </h1>
          <p className="text-sm md:text-base lg:text-lg text-gray-600 dark:text-gray-300 mt-4 max-w-xs md:max-w-md relative z-10">
            Experience real-time transparency, trust, and efficiency with
            blockchain-powered shipment tracking. From manufacturing to
            delivery, every step is immutably recorded for accountability and
            peace of mind.
          </p>
          {!address ? (
            <div className="mt-4 relative z-10">
              <WalletButton />
            </div>
          ) : (
            <div className="flex gap-2 md:flex-col lg:flex-row justify-center mt-4 relative z-10 pt-8">
              <Link
                to="/create"
                className="bg-cyan-400 px-6 py-3 rounded text-sm md:text-lg font-bold hover:bg-cyan-600 text-gray-900 w-full md:w-auto min-w-[200px]"
              >
                Create Shipment
              </Link>
              <Link
                to="/track"
                className="bg-gray-700 px-6 py-3 rounded text-sm md:text-lg font-bold hover:bg-gray-600 text-white w-full md:w-auto min-w-[200px]"
              >
                Track Shipment
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Feature Section */}
      <section className="bg-white dark:bg-gray-950 p-8 text-center pt-[50px]">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4">
          If You Transport It, We'll Track It!
        </h2>
        <p className="text-gray-600 dark:text-gray-300 mb-8 text-sm">
          Discover how Suiviclair revolutionizes supply chain tracking with
          cutting-edge features designed for transparency, accuracy, and
          efficiency.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="p-4 dark:bg-gray-900 bg-gray-300 rounded">
            <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100">
              Real-Time Updates
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mt-2">
              Stay informed with live tracking of your shipments, ensuring every
              movement is monitored.
            </p>
          </div>
          <div className="p-4 dark:bg-gray-900 bg-gray-300 rounded">
            <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100">
              Immutable Records
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mt-2">
              Each step in the process is securely logged on the blockchain,
              providing a tamper-proof record.
            </p>
          </div>
          <div className="p-4 dark:bg-gray-900 bg-gray-300 rounded">
            <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100">
              Transparency for All
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mt-2">
              Stay informed with live tracking of your shipments, ensuring every
              movement is monitored.
            </p>
          </div>
          <div className="p-4 dark:bg-gray-900 bg-gray-300 rounded">
            <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100">
              Proof of Authenticity
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mt-2">
              Resolve disputes quickly with accurate and verifiable data, backed
              by blockchain technology.
            </p>
          </div>
        </div>
      </section>

      {/* Route Options Section */}
      <section className="p-8 dark:bg-gray-950 bg-white">
        <h2 className="text-center text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4">
          Route of your Package!
        </h2>
        <p className="text-center text-gray-600 dark:text-gray-300 mb-8 text-sm">
          Track every step of your shipment's journey with Suiviclair, offering
          a seamless and transparent view of your package's route from start to
          finish.
        </p>
      </section>
    </>
  );
}
