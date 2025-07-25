"use client";

import Image from "next/image";

export function WholesaleBanner() {
  const handleContactUsClick = () => {
    window.location.href = "mailto:founder@tapmesaveme.com";
  };

  return (
    <div className="relative bg-gray-200 text-center py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-black mb-2">
          INTERESTED IN WHOLESALE OR RETAIL ORDERS?
        </h1>
        <p className="text-lg sm:text-xl text-black mb-4 max-w-xl mx-auto">
          Are you a school, retailer, or distributor looking to place a bulk
          order (500+ units)? We'd love to connect.
        </p>
        <div className="flex justify-center items-center mb-6">
          <Image
            src="/logo.png" // Replace with the actual logo path
            alt="TapMeSaveMe Logo"
            width={100}
            height={100}
            className="mr-4"
          />
          <h2 className="text-3xl sm:text-4xl font-bold text-black">
            TapMeSaveMe™
          </h2>
        </div>
        {/* <button
          onClick={handleContactUsClick}
          className="w-auto bg-emergency-red hover:bg-emergency-red/90 text-white px-4 py-2 rounded-md font-medium text-sm text-center transition-colors focus:outline-none"
        >
          Contact Us
        </button> */}

        <a href="/contact">
          <button className="bg-emergency-red hover:bg-emergency-red/90 text-white px-4 py-2 rounded-md font-medium text-sm">
            Contact Us
          </button>
        </a>
        <p className="text-sm sm:text-base text-black mt-4">
          founder@tapmesaveme.com
        </p>
      </div>
    </div>
  );
}
