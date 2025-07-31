"use client";

export default function OrderButton() {
  return (
    <div className="fixed bottom-4 left-0 right-0 px-4 sm:hidden bg-white h-5">
      <button
        className="w-full bg-emergency-red hover:bg-emergency-red/90 text-white px-4 py-2 rounded-md font-medium text-sm text-center transition-colors focus:outline-none"
        onClick={() =>
          window.open("https://shop.tapmesaveme.com/", "_blank")
        }
      >
        Order Now
      </button>
    </div>
  );
}
