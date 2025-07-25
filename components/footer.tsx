import Link from "next/link";
import { Facebook, Instagram, Linkedin } from "lucide-react";
import Image from "next/image";

export function Footer() {
  return (
    <footer className="bg-header-gray text-dark-gray">
      <div className="container mx-auto px-3 sm:px-4 lg:px-8 py-8 sm:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          <div className="space-y-4 -mt-8">
            <div className="flex justify-center items-center h-25">
              <Image
                src="/Logo.png"
                alt="TapMeSaveMe Logo"
                width={120}
                height={120}
                className="rounded-lg -mb-4"
              />
            </div>
            <div className="flex justify-center items-center">
              <h1 className="font-bold text-dark-gray text-2xl sm:text-2xl mb-4">
                Follow Us
              </h1>
            </div>

            <div className="flex justify-center items-center">
              <div className="flex space-x-4">
                <a
                  href="https://www.facebook.com/share/15yFxZAdy6/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-dark-gray transition-colors"
                  aria-label="Follow us on Facebook"
                >
                  <Facebook className="h-10 w-10 sm:h-10 sm:w-10 text-[#1877F2]" />
                </a>
                <a
                  href="https://www.tiktok.com/@tapmesaveme"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-dark-gray transition-colors"
                  aria-label="Follow us on TikTok"
                >
                  <svg
                    className="h-10 w-10 sm:h-10 sm:w-10 text-[#69C9D0]"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
                  </svg>
                </a>
                <a
                  href="https://www.instagram.com/tapmesaveme"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-dark-gray transition-colors"
                  aria-label="Follow us on Instagram"
                >
                  <Instagram className="h-10 w-10 sm:h-10 sm:w-10 text-[#E1306C] " />
                </a>
                <a
                  href="https://www.linkedin.com/in/michael-lutz-913602163?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-dark-gray transition-colors"
                  aria-label="Follow us on LinkedIn"
                >
                  <Linkedin className="h-10 w-10 sm:h-10 sm:w-10 text-[#0077B5]" />
                </a>
              </div>
            </div>
          </div>
          <div>
            {" "}
            <p className="text-gray-600 text-sm sm:text-base">
              Protect who matters most with NFC-powered emergency contact tags.
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-3 sm:mb-4 text-dark-gray text-sm sm:text-base">
              Quick Links
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/"
                  className="text-gray-600 hover:text-dark-gray transition-colors text-sm"
                >
                  Home
                </Link>
              </li>
              <li>
                <a
                  href="https://83btej-r0.myshopify.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-dark-gray transition-colors text-sm"
                >
                  Order Now
                </a>
              </li>
              <li>
                <Link
                  href="/activate"
                  className="text-gray-600 hover:text-dark-gray transition-colors text-sm"
                >
                  Activate Product
                </Link>
              </li>
              <li>
                <Link
                  href="/faq"
                  className="text-gray-600 hover:text-dark-gray transition-colors text-sm"
                >
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-3 sm:mb-4 text-dark-gray text-sm sm:text-base">
              Support
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/contact"
                  className="text-gray-600 hover:text-dark-gray transition-colors text-sm"
                >
                  Contact Us
                </Link>
              </li>
              <li>
                <Link
                  href="/affiliate"
                  className="text-gray-600 hover:text-dark-gray transition-colors text-sm"
                >
                  Affiliate Program
                </Link>
              </li>
              <li>
                <Link
                  href="https://tapmesavemeprivacy.carrd.co/"
                  className="text-gray-600 hover:text-dark-gray transition-colors text-sm"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="text-gray-600 hover:text-dark-gray transition-colors text-sm"
                >
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-400 mt-6 sm:mt-8 pt-6 sm:pt-8 text-center text-gray-600">
          <p className="text-xs sm:text-sm">
            © {new Date().getFullYear()} TapMeSaveMe. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
