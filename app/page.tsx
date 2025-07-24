"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Shield, Heart, Users, Star, ArrowRight, CheckCircle, Facebook } from "lucide-react"
import { NewsletterForm } from "@/components/NewsletterForm"

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-cool-gray py-4 sm:py-6 lg:py-10 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-cool-gray to-white opacity-50"></div>
        <div className="container mx-auto px-3 sm:px-4 lg:px-8 relative">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div className="animate-slide-up text-center lg:text-left">
              <div className="flex items-center justify-center lg:justify-start space-x-2 mb-4 sm:mb-6">
                <div className="relative animate-bounce-gentle">
                  <Shield className="h-6 w-6 sm:h-8 sm:w-8 text-emergency-red" />
                </div>
                <span className="text-xs sm:text-sm font-semibold text-emergency-red uppercase tracking-wide">
                  Emergency Protection
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-dark-gray mb-4 sm:mb-6 leading-tight">
                <span className="gradient-text">Protect</span> Who Matters Most
              </h1>

              <p className="text-base sm:text-lg lg:text-xl text-gray-600 mb-6 sm:mb-8 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                NFC-powered tags that enable instant sharing of location, emergency contact and medical info - for
                children, pets and loved ones.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-6 sm:mb-8 justify-center lg:justify-start">
                <Button
                  size="lg"
                  className="bg-emergency-red hover:bg-emergency-red/90 text-white px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg animate-scale-in"
                  asChild
                >
                  <a href="https://83btej-r0.myshopify.com/" target="_blank" rel="noopener noreferrer">
                    Order Now <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
                  </a>
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="border-dark-gray text-dark-gray hover:bg-dark-gray hover:text-white px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg bg-transparent"
                  asChild
                >
                  <Link href="#features">Learn More</Link>
                </Button>
              </div>

              <div className="flex items-center justify-center lg:justify-start space-x-4 sm:space-x-6 text-sm text-gray-600">
                <div className="flex items-center space-x-1">
                  <Star className="h-3 w-3 sm:h-4 sm:w-4 text-yellow-400 fill-current" />
                  <span>4.9/5 Rating</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Users className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span>10,000+ Protected</span>
                </div>
              </div>
            </div>

            <div className="animate-fade-in">
              <div className="relative max-w-xs mx-auto sm:max-w-sm lg:max-w-md">
                <div className="absolute inset-0 bg-gradient-to-r from-emergency-red/20 to-transparent rounded-3xl transform rotate-3"></div>
                <Image
                  src="/Kids sticker.png?height=450&width=350"
                  alt="TapMeSaveMe NFC Tags"
                  width={350}
                  height={450}
                  className="relative rounded-3xl shadow-2xl w-full h-auto"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Product Showcase */}
      <section id="features" className="py-16 sm:py-20 bg-gray-50">
        <div className="container mx-auto px-3 sm:px-4 lg:px-8">
          <div className="text-center mb-12 sm:mb-16 animate-slide-up">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-dark-gray mb-4 sm:mb-6">
              See TapMeSaveMe™ in Action
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
              These are the real-world ways our smart tags protect who matters most.
            </p>
          </div>

          {/* Children Safety */}
          <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 mb-16 sm:mb-20">
            <div className="animate-slide-up order-2 lg:order-none text-center lg:text-left">
              <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-dark-gray mb-4 sm:mb-6">
                Child Safety Made Simple
              </h3>
              <p className="text-base sm:text-lg text-gray-600 mb-4 sm:mb-6">
                Designed with your child's safety in mind. Simply tap with any phone to contact a parent instantly, no
                app needed. All of our designs can be purchased as a sticker, pin or bracelet.
              </p>
              <div className="bg-green-50 border border-green-200 rounded-lg p-3 sm:p-4 mb-4 sm:mb-6">
                <p className="text-green-800 font-semibold text-sm sm:text-base">
                  Backed by the autism community! Only $15 on our KickStarter launch will be $19 after.
                </p>
              </div>
              <Button className="bg-emergency-red hover:bg-emergency-red/90 w-full sm:w-auto" asChild>
                <a href="https://83btej-r0.myshopify.com/" target="_blank" rel="noopener noreferrer">
                  Shop Child Safety Tags
                </a>
              </Button>
            </div>
            <div className="animate-fade-in order-1 lg:order-none">
              <div className="relative max-w-sm mx-auto sm:max-w-md">
                <div className="absolute inset-0 bg-gradient-to-r from-emergency-red/10 to-transparent rounded-3xl transform rotate-1"></div>
                <Image
                  src="/kids badge.png?height=250&width=350"
                  alt="Child Safety NFC Tags"
                  width={350}
                  height={250}
                  className="relative rounded-3xl shadow-2xl w-full h-auto"
                />
              </div>
            </div>
          </div>

          {/* Helmet Stickers */}
          <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 mb-16 sm:mb-20">
            <div className="animate-fade-in order-1 lg:order-1">
              <div className="relative max-w-sm mx-auto sm:max-w-md">
                <div className="absolute inset-0 bg-gradient-to-r from-emergency-red/10 to-transparent rounded-3xl transform -rotate-1"></div>
                <Image
                  src="/Helmet.png?height=250&width=350"
                  alt="Helmet Safety Stickers"
                  width={350}
                  height={250}
                  className="relative rounded-3xl shadow-2xl w-full h-auto"
                />
              </div>
            </div>
            <div className="animate-slide-up order-2 lg:order-2 text-center lg:text-left">
              <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-dark-gray mb-4 sm:mb-6">
                Perfect for Cyclists & Motorcyclists
              </h3>
              <p className="text-base sm:text-lg text-gray-600 mb-4 sm:mb-6">
                Our helmet stickers are perfect for cyclists and motorcyclists. In an emergency, they can be life-saving
                — especially if the rider is unconscious or unable to speak. Just tap the tag to access their emergency
                contact and medical info.
              </p>
              <p className="text-base sm:text-lg text-gray-600 mb-4 sm:mb-6">
                This same design as a bracelet is ideal for seniors or anyone with a health condition.
              </p>
              <Button className="bg-emergency-red hover:bg-emergency-red/90 w-full sm:w-auto" asChild>
                <a href="https://83btej-r0.myshopify.com/" target="_blank" rel="noopener noreferrer">
                  Shop Helmet Stickers
                </a>
              </Button>
            </div>
          </div>

          {/* Pet Safety */}
          <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 mb-16 sm:mb-20">
            <div className="animate-slide-up order-2 lg:order-none text-center lg:text-left">
              <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-dark-gray mb-4 sm:mb-6">
                Smart Pet Protection
              </h3>
              <p className="text-base sm:text-lg text-gray-600 mb-4 sm:mb-6">
                If your pet gets lost, the finder can simply tap the embedded tag with their phone to instantly access
                your contact information.
              </p>
              <p className="text-base sm:text-lg text-gray-600 mb-4 sm:mb-6 font-semibold">
                No apps. No chips. Just peace of mind.
              </p>
              <p className="text-base sm:text-lg text-gray-600 mb-4 sm:mb-6">
                Traditional dog tags can fall off. But this is the only dog collar on the market with an NFC tag
                securely embedded into the collar itself — making it a smarter, safer solution.
              </p>
              <Button className="bg-emergency-red hover:bg-emergency-red/90 w-full sm:w-auto" asChild>
                <a href="https://83btej-r0.myshopify.com/" target="_blank" rel="noopener noreferrer">
                  Shop Pet Collars
                </a>
              </Button>
            </div>
            <div className="animate-fade-in order-1 lg:order-none">
              <div className="relative max-w-sm mx-auto sm:max-w-md">
                <div className="absolute inset-0 bg-gradient-to-r from-emergency-red/10 to-transparent rounded-3xl transform rotate-2"></div>
                <Image
                  src="/Pet.png?height=250&width=350"
                  alt="Smart Pet Collar with NFC"
                  width={350}
                  height={250}
                  className="relative rounded-3xl shadow-2xl w-full h-auto"
                />
              </div>
            </div>
          </div>

          {/* Product Specifications */}
          <div className="grid lg:grid-cols-2 gap-8 sm:gap-12">
            <div className="animate-fade-in order-1 lg:order-none">
              <div className="relative max-w-sm mx-auto sm:max-w-md">
                <div className="absolute inset-0 bg-gradient-to-r from-emergency-red/10 to-transparent rounded-3xl transform -rotate-2"></div>
                <Image
                  src="/Sticker.png?height=250&width=350"
                  alt="Product Specifications"
                  width={350}
                  height={250}
                  className="relative rounded-3xl shadow-2xl w-full h-auto"
                />
              </div>
            </div>
            <div className="animate-slide-up order-2 lg:order-none text-center lg:text-left">
              <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-dark-gray mb-4 sm:mb-6">
                Designed for Real-World Use
              </h3>
              <div className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
                {[
                  "Compact 4cm design - perfect for any application",
                  "Waterproof and durable construction",
                  "Works with all NFC-enabled smartphones",
                  "No apps required for emergency access",
                  "Secure, encrypted data storage",
                  "Available as stickers, pins, or bracelets",
                ].map((feature, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-emergency-red flex-shrink-0" />
                    <span className="text-gray-700 text-sm sm:text-base">{feature}</span>
                  </div>
                ))}
              </div>
              <Button className="bg-emergency-red hover:bg-emergency-red/90 w-full sm:w-auto" asChild>
                <a href="https://83btej-r0.myshopify.com/" target="_blank" rel="noopener noreferrer">
                  View All Products
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="container mx-auto px-3 sm:px-4 lg:px-8 text-center">
          <div className="max-w-2xl mx-auto animate-slide-up">
            <Heart className="h-10 w-10 sm:h-12 sm:w-12 text-emergency-red mx-auto mb-4 sm:mb-6" />
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-dark-gray mb-4 sm:mb-6">
              Be One of the First to Protect Your Loved Ones
            </h2>
            <p className="text-base sm:text-lg text-gray-600 mb-6 sm:mb-8">
              Sign up now for launch updates and to receive the 10% off discount code.
            </p>
            <NewsletterForm />
            <p className="text-xs sm:text-sm text-gray-500 mt-4">* indicates required</p>
          </div>
        </div>
      </section>

      {/* Social Media Section */}
      <section className="py-2 sm:py-6 bg-gray-50">
        <div className="container mx-auto px-3 sm:px-4 lg:px-8 text-center">
          <div className="max-w-2xl mx-auto animate-slide-up">
            <h3 className="text-xl sm:text-2xl font-bold text-dark-gray mb-3 sm:mb-4">Be Part of Our Mission</h3>
            <p className="text-base sm:text-lg text-gray-600 mb-6 sm:mb-8">
              Please follow us on our social media accounts for real stories, updates and launch news. Simply click the
              icons below.
            </p>
            <div className="flex justify-center space-x-4 sm:space-x-6">
              <a href="#" className="text-gray-400 hover:text-emergency-red transition-colors duration-300">
                <svg className="h-6 w-6 sm:h-8 sm:w-8" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              <a href="https://www.facebook.com/TapMeSaveMe" className="text-gray-400 hover:text-emergency-red transition-colors duration-300">
                <Facebook className="h-6 w-6 sm:h-8 sm:w-8" />
              </a>
              <a href="#" className="text-gray-400 hover:text-emergency-red transition-colors duration-300">
                <svg className="h-6 w-6 sm:h-8 sm:w-8" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}