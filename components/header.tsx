"use client"

import Link from "next/link"
import { useState } from "react"
import { usePathname } from "next/navigation"
import { Menu, X } from "lucide-react"
import Image from "next/image"

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const pathname = usePathname()

  const isActive = (path: string) => {
    if (path === "/" && pathname === "/") return true
    if (path !== "/" && pathname.startsWith(path)) return true
    return false
  }

  return (
    <header className="sticky top-0 z-50 w-full bg-[#E1E1E1]">
      <div className="container mx-auto px-3 sm:px-4 lg:px-8">
        <div className="flex h-14 sm:h-16 items-center justify-between">
          <Link href="/" className="flex items-center">
            <Image
              src="/Logo.png?height=45&width=45"
              alt="TapMeSaveMe Logo"
              width={45}
              height={45}
              className="rounded-lg"
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6 lg:space-x-8">
            <Link
              href="/"
              className={`transition-colors text-sm lg:text-base relative ${
                isActive("/") ? "text-emergency-red font-medium" : "text-dark-gray hover:text-emergency-red"
              }`}
            >
              Home
              {isActive("/") && (
                <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-emergency-red rounded-full"></span>
              )}
            </Link>
            <Link
              href="/activate"
              className={`transition-colors text-sm lg:text-base relative ${
                isActive("/activate") ? "text-emergency-red font-medium" : "text-dark-gray hover:text-emergency-red"
              }`}
            >
              Activate Product
              {isActive("/activate") && (
                <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-emergency-red rounded-full"></span>
              )}
            </Link>
            <Link
              href="/faq"
              className={`transition-colors text-sm lg:text-base relative ${
                isActive("/faq") ? "text-emergency-red font-medium" : "text-dark-gray hover:text-emergency-red"
              }`}
            >
              FAQ
              {isActive("/faq") && (
                <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-emergency-red rounded-full"></span>
              )}
            </Link>
            <Link
              href="/contact"
              className={`transition-colors text-sm lg:text-base relative ${
                isActive("/contact") ? "text-emergency-red font-medium" : "text-dark-gray hover:text-emergency-red"
              }`}
            >
              Contact
              {isActive("/contact") && (
                <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-emergency-red rounded-full"></span>
              )}
            </Link>
            <Link
              href="/affiliate"
              className={`transition-colors text-sm lg:text-base relative ${
                isActive("/affiliate") ? "text-emergency-red font-medium" : "text-dark-gray hover:text-emergency-red"
              }`}
            >
              Affiliate
              {isActive("/affiliate") && (
                <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-emergency-red rounded-full"></span>
              )}
            </Link>
          </nav>

          <button
            className="hidden md:inline-flex bg-emergency-red hover:bg-emergency-red/90 text-white px-4 py-2 rounded-md font-medium text-sm lg:text-base transition-colors focus:outline-none"
            onClick={() => window.open("https://83btej-r0.myshopify.com/", "_blank")}
          >
            Order Now
          </button>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 focus:outline-none"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-white rounded-b-lg shadow-lg">
              <Link
                href="/"
                className={`block px-3 py-2 text-sm transition-colors ${
                  isActive("/")
                    ? "text-emergency-red font-medium bg-emergency-red/10"
                    : "text-dark-gray hover:text-emergency-red hover:bg-gray-50"
                }`}
              >
                Home
              </Link>
              <Link
                href="/activate"
                className={`block px-3 py-2 text-sm transition-colors ${
                  isActive("/activate")
                    ? "text-emergency-red font-medium bg-emergency-red/10"
                    : "text-dark-gray hover:text-emergency-red hover:bg-gray-50"
                }`}
              >
                Activate Product
              </Link>
              <Link
                href="/faq"
                className={`block px-3 py-2 text-sm transition-colors ${
                  isActive("/faq")
                    ? "text-emergency-red font-medium bg-emergency-red/10"
                    : "text-dark-gray hover:text-emergency-red hover:bg-gray-50"
                }`}
              >
                FAQ
              </Link>
              <Link
                href="/contact"
                className={`block px-3 py-2 text-sm transition-colors ${
                  isActive("/contact")
                    ? "text-emergency-red font-medium bg-emergency-red/10"
                    : "text-dark-gray hover:text-emergency-red hover:bg-gray-50"
                }`}
              >
                Contact
              </Link>
              <Link
                href="/affiliate"
                className={`block px-3 py-2 text-sm transition-colors ${
                  isActive("/affiliate")
                    ? "text-emergency-red font-medium bg-emergency-red/10"
                    : "text-dark-gray hover:text-emergency-red hover:bg-gray-50"
                }`}
              >
                Affiliate
              </Link>
              <div className="px-3 py-2">
                <button
                  className="w-full bg-emergency-red hover:bg-emergency-red/90 text-white px-4 py-2 rounded-md font-medium text-sm transition-colors focus:outline-none"
                  onClick={() => window.open("https://83btej-r0.myshopify.com/", "_blank")}
                >
                  Order Now
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}