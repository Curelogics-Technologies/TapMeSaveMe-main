import Link from "next/link";
import { Facebook, Instagram, Linkedin, Twitter } from "lucide-react";
import Image from "next/image";

export function Footer() {
  return (
    <footer className="bg-header-gray text-dark-gray">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-10 gap-6 sm:gap-6 lg:gap-4">
          <div className="flex flex-col items-center sm:items-start lg:items-center sm:col-span-4">
            <div className="-mt-8">
              <Image
                src="/Logo.png"
                alt="TapMeSaveMe Logo"
                width={120}
                height={120}
                className="rounded-lg"
              />
            </div>
            <h3 className="font-bold text-dark-gray text-xl sm:text-2xl mb-3">
              Follow Us
            </h3>
            <div className="flex justify-center sm:justify-start lg:justify-center items-center space-x-3">
              <a
                href="https://www.facebook.com/share/15yFxZAdy6/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-dark-gray transition-colors"
                aria-label="Follow us on Facebook"
              >
                <Facebook className="h-7 w-7 sm:h-8 sm:w-8 text-[#1877F2]" />
              </a>
              <a
                href="https://www.tiktok.com/@tapmesaveme"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-dark-gray transition-colors"
                aria-label="Follow us on TikTok"
              >
                <svg
                  className="h-7 w-7 sm:h-8 sm:w-8 text-[#69C9D0]"
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
                <Instagram className="h-7 w-7 sm:h-8 sm:w-8 text-[#E1306C]" />
              </a>
              <a
                href="https://www.linkedin.com/in/michael-lutz-913602163?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-dark-gray transition-colors"
                aria-label="Follow us on LinkedIn"
              >
                <Linkedin className="h-7 w-7 sm:h-8 sm:w-8 text-[#0077B5]" />
              </a>
              <a
                href="https://x.com/TapMeSaveMe?t=1v_7l6xoczCmKS0DK2oYAA&s=09"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-dark-gray transition-colors"
                aria-label="Follow us on Twitter"
              >
                <Twitter className="h-7 w-7 sm:h-8 sm:w-8 text-[#1DA1F2]" />
              </a>
              <a
                href="https://www.youtube.com/@tapmesaveme"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-dark-gray transition-colors"
                aria-label="Follow us on YouTube"
              >
                <svg
                  className="h-8 w-8 sm:h-9 sm:w-9 text-[#FF0000]"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M23.498 6.186a2.935 2.935 0 0 0-2.065-2.075C19.79 3.5 12 3.5 12 3.5s-7.79 0-9.433.611a2.935 2.935 0 0 0-2.065 2.075A30.15 30.15 0 0 0 0 12a30.15 30.15 0 0 0 .502 5.814 2.935 2.935 0 0 0 2.065 2.075C4.21 20.5 12 20.5 12 20.5s7.79 0 9.433-.611a2.935 2.935 0 0 0 2.065-2.075A30.15 30.15 0 0 0 24 12a30.15 30.15 0 0 0-.502-5.814zM9.75 15.02V8.98l6.25 3.02-6.25 3.02z" />
                </svg>
              </a>

            </div>
          </div>

          <div className="flex flex-col items-start sm:col-span-3">
            <h3 className="font-semibold mb-3 sm:mb-4 text-dark-gray text-base sm:text-lg">
              Quick Links
            </h3>
            <ul className="space-y-2 text-left">
              <li>
                <Link
                  href="/"
                  className="text-gray-600 hover:text-dark-gray transition-colors text-sm sm:text-base"
                >
                  Home
                </Link>
              </li>
              <li>
                <a
                  href="https://shop.tapmesaveme.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-dark-gray transition-colors text-sm sm:text-base"
                >
                  Order Now
                </a>
              </li>
              <li>
                <Link
                  href="/activate"
                  className="text-gray-600 hover:text-dark-gray transition-colors text-sm sm:text-base"
                >
                  Activate Product
                </Link>
              </li>
              <li>
                <Link
                  href="/faq"
                  className="text-gray-600 hover:text-dark-gray transition-colors text-sm sm:text-base"
                >
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          <div className="flex flex-col items-start sm:col-span-3">
            <h3 className="font-semibold mb-3 sm:mb-4 text-dark-gray text-base sm:text-lg">
              Support
            </h3>
            <ul className="space-y-2 text-left">
              <li>
                <Link
                  href="/contact"
                  className="text-gray-600 hover:text-dark-gray transition-colors text-sm sm:text-base"
                >
                  Contact Us
                </Link>
              </li>
              <li>
                <Link
                  href="/affiliate"
                  className="text-gray-600 hover:text-dark-gray transition-colors text-sm sm:text-base"
                >
                  Affiliate Program
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="text-gray-600 hover:text-dark-gray transition-colors text-sm sm:text-base"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="text-gray-600 hover:text-dark-gray transition-colors text-sm sm:text-base"
                >
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-400 mt-8 sm:mt-10 pt-6 sm:pt-8 text-center text-gray-600">
          <p className="text-xs sm:text-sm">
            © {new Date().getFullYear()} TapMeSaveMe. All rights reserved.
          </p>

          {/* Mobile layout */}
          {/* Mobile layout */}
          <div className="flex sm:hidden items-center justify-center gap-3 mt-2">
            {/* Logo */}
            <Image
              src="/Curelogics pic 2.jpg"
              alt="CureLogics Logo"
              width={40}
              height={40}
              className="w-10 h-auto object-contain rounded-xl"
            />

            {/* Text stacked */}
            <div className="flex flex-col items-start text-left">
              <span className="text-xs">Developed by</span>
              <a
                href="https://curelogics.org/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-medium text-dark-gray hover:underline"
              >
                CureLogics
              </a>
            </div>
          </div>


          {/* Desktop layout */}
          <div className="hidden sm:flex justify-center items-center gap-2 mt-2">
            <span className="text-xs sm:text-sm">Developed by</span>
            <Image
              src="/Curelogics pic 2.jpg"
              alt="CureLogics Logo"
              width={25}
              height={25}
              className="w-5 h-auto object-contain rounded-md"
            />
            <a
              href="https://curelogics.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs sm:text-sm font-medium text-dark-gray hover:underline"
            >
              CureLogics
            </a>
          </div>

        </div>



      </div>
    </footer>
  );
}