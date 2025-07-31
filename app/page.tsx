"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { WholesaleBanner } from "@/components/WholeSaleBanner";
import {
  Shield,
  Heart,
  Users,
  Star,
  ArrowRight,
  CheckCircle,
  Facebook,
  Instagram,
  Linkedin,
} from "lucide-react";
import { NewsletterForm } from "@/components/NewsletterForm";

const handleContactUsClick = () => {
  window.location.href = "mailto:founder@tapmesaveme.com";
};

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Kickstarter Launch Banner */}
      <section className="bg-black text-white py-5 sm:py-7">
        <div className="container mx-auto px-3 sm:px-4 lg:px-8 text-center">
          <p className="font-semibold animate-pulse whitespace-nowrap text-[clamp(0.9rem,4vw,1.5rem)]">
            🚨 Launching on Kickstarter August 8th! 🚨
          </p>
        </div>
      </section>

      {/* Top Newsletter Section */}
      <section className="bg-emergency-red py-8 sm:py-12">
        <div className="container mx-auto px-3 sm:px-4 lg:px-8 text-center">
          <div className="max-w-2xl mx-auto animate-slide-up">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3 sm:mb-4">
              Get 10% OFF + Early Access
            </h2>
            <p className="text-sm sm:text-lg text-white/90 mb-6 sm:mb-8">
              Subscribe now to receive your discount code and be the first to
              know when we go live on Kickstarter!
            </p>
            <NewsletterForm
              textColor="text-red"
              labelColor="text-white"
              placeholderStyle="placeholder-gray-300"
              inputBorderColor="border-white/30 focus:border-white"
              buttonStyle="bg-white hover:bg-white/90 text-emergency-red"
            />
            <p className="text-xs sm:text-sm text-white/70 mt-4">
              * indicates required
            </p>
          </div>
        </div>
      </section>

      {/* Affiliate Call-to-Action */}
      <section className="bg-black py-4 sm:py-6">
        <div className="container mx-auto px-3 sm:px-4 lg:px-8 text-center">
          <div className="max-w-4xl mx-auto">
            <Button
              variant="outline"
              size="lg"
              className="border-emergency-red text-emergency-red hover:bg-emergency-red hover:text-white bg-white px-4 sm:px-6 lg:px-8 py-3 sm:py-4 text-xs sm:text-sm lg:text-base w-full transition-colors duration-200 min-h-[3rem] sm:min-h-[3.5rem] lg:min-h-[4rem]"
              asChild
            >
              <Link
                href="/affiliate"
                className="flex items-center justify-center"
              >
                <span className="leading-tight text-center break-words hyphens-auto whitespace-normal">
                  Want to help spread the word and earn commissions? Click here
                  to join our affiliate team!
                </span>
              </Link>
            </Button>
          </div>
        </div>
      </section>

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
                NFC-powered tags that enable instant sharing of location,
                emergency contact and medical info - for children, pets and
                loved ones.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-6 sm:mb-8 justify-center lg:justify-start">
                <Button
                  size="lg"
                  className="bg-emergency-red hover:bg-emergency-red/90 text-white px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg animate-scale-in"
                  asChild
                >
                  <a
                    href="https://shop.tapmesaveme.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Order Now{" "}
                    <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
                  </a>
                </Button>
              </div>
            </div>

            <div className="animate-fade-in">
              <div className="bg-black p-2 rounded-md max-w-xs mx-auto sm:max-w-sm lg:max-w-md">
                <Image
                  src="/Logo.png"
                  alt="TapMeSaveMe NFC Tags"
                  width={350}
                  height={450}
                  className="w-full h-auto"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <WholesaleBanner />

      {/* Product Showcase */}
      <section id="features" className="py-16 sm:py-20 bg-gray-50">
        <div className="container mx-auto px-3 sm:px-4 lg:px-8">
          <div className="text-center mb-12 sm:mb-16 animate-slide-up">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-dark-gray mb-4 sm:mb-6">
              See TapMeSaveMe™ in Action
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
              These are the real-world ways our smart tags protect who matters
              most.
            </p>
          </div>

          {/* Children Safety */}
          <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 mb-16 sm:mb-20">
            <div className="animate-fade-in order-1 lg:order-none">
              <div className="relative max-w-sm mx-auto sm:max-w-md">
                <div className="absolute inset-0 bg-gradient-to-r from-emergency-red/10 to-transparent rounded-3xl transform rotate-1"></div>
                <Image
                  src="/watchbatch.jpeg?height=250&width=350"
                  alt="Child Safety NFC Tags"
                  width={350}
                  height={250}
                  className="relative rounded-3xl shadow-2xl w-full h-auto"
                />
              </div>
            </div>
            <div className="animate-slide-up order-2 lg:order-none text-left">
              <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-dark-gray mb-4 sm:mb-6">
                NFC Child Safety Bracelet
              </h3>
              <p className="text-base sm:text-lg text-gray-600 mb-4 sm:mb-6">
                Our NFC Child Safety Bracelet gives parents peace of mind with a
                simple tap. If your child ever gets lost, anyone with a
                smartphone can tap the bracelet to instantly access emergency
                contact info. No app needed. It’s waterproof, durable, and
                designed for everyday adventures. Help your child stay safe
                while staying stylish.
              </p>
              <div className="bg-green-50 border border-green-200 rounded-lg p-3 sm:p-4 mb-4 sm:mb-6">
                <p className="text-green-800 font-semibold text-sm sm:text-base">
                  Backed by the autism community! Only $15 on our KickStarter
                  launch will be $19 after.
                </p>
              </div>
              <Button
                className="bg-emergency-red hover:bg-emergency-red/90 w-full sm:w-auto"
                asChild
              >
                <a
                  href="https://shop.tapmesaveme.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Shop NFC Child Safety Bracelet
                </a>
              </Button>
            </div>
          </div>

          {/* Children Safety Pin */}
          <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 mb-16 sm:mb-20">
            <div className="animate-slide-up order-2 lg:order-none text-left">
              <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-dark-gray mb-4 sm:mb-6">
                NFC Child Safety Pin
              </h3>
              <p className="text-base sm:text-lg text-gray-600 mb-4 sm:mb-6">
                This has all the features of the Child Safety Bracelet, but we
                know not every child wants something on their wrist. The pin
                offers a discreet alternative that can be worn on a jacket,
                backpack, shirt, or even on their back — often without the child
                noticing. It’s ideal for kids with sensory sensitivities or
                those who prefer not to wear a bracelet.
              </p>
              <div className="bg-green-50 border border-green-200 rounded-lg p-3 sm:p-4 mb-4 sm:mb-6">
                <p className="text-green-800 font-semibold text-sm sm:text-base">
                  Backed by the autism community! Only $15 on our KickStarter
                  launch will be $19 after.
                </p>
              </div>
              <Button
                className="bg-emergency-red hover:bg-emergency-red/90 w-full sm:w-auto"
                asChild
              >
                <a
                  href="https://shop.tapmesaveme.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Shop NFC Child Safety Pin
                </a>
              </Button>
            </div>
            <div className="animate-fade-in order-1 lg:order-none">
              <div className="relative max-w-sm mx-auto sm:max-w-md">
                <div className="absolute inset-0 bg-gradient-to-r from-emergency-red/10 to-transparent rounded-3xl transform rotate-1"></div>
                <Image
                  src="/tag.jpeg?height=250&width=350"
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
            <div className="animate-slide-up order-2 lg:order-2 text-left">
              <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-dark-gray mb-4 sm:mb-6">
                NFC Emergency Contact Stickers
              </h3>
              <p className="text-base sm:text-lg text-gray-600 mb-4 sm:mb-6">
                Our NFC Emergency Contact Sticker is ideal for motorcycle and
                bicycle helmets, but it has plenty of other uses. With just the
                tap of a phone, you can instantly share your emergency contact
                info and optional medical details. Stick it on a gym water
                bottle, construction helmet, child’s car seat, or anywhere you
                could use a little extra protection — all at an affordable
                price.
              </p>
              <div className="bg-green-50 border border-green-200 rounded-lg p-3 sm:p-4 mb-4 sm:mb-6">
                <p className="text-green-800 font-semibold text-sm sm:text-base">
                  Only $7 on our KickStarter launch will be $11 after.
                </p>
              </div>
              <Button
                className="bg-emergency-red hover:bg-emergency-red/90 w-full sm:w-auto"
                asChild
              >
                <a
                  href="https://shop.tapmesaveme.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Shop NFC Emergency Contact Stickers
                </a>
              </Button>
            </div>
          </div>

          {/* Product Specifications */}
          <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 mb-16 sm:mb-20">
            <div className="animate-fade-in order-1 lg:order-1">
              <div className="relative max-w-sm mx-auto sm:max-w-md">
                <div className="absolute inset-0 bg-gradient-to-r from-emergency-red/10 to-transparent rounded-3xl transform -rotate-2"></div>
                <Image
                  src="/Sticker.jpeg?height=250&width=350"
                  alt="Product Specifications"
                  width={350}
                  height={250}
                  className="relative rounded-3xl shadow-2xl w-full h-auto"
                />
              </div>
            </div>
            <div className="animate-slide-up order-2 lg:order-2 text-left">
              <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-dark-gray mb-4 sm:mb-6">
                Designed for Real-World Use
              </h3>
              <p className="text-base sm:text-lg text-gray-600 mb-4 sm:mb-6">
                Our NFC tags are built to withstand the toughest conditions while
                providing seamless functionality for emergencies.
              </p>
              <div className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
                {[
                  "Compact 5cm design - perfect for any application",
                  "Waterproof and durable construction",
                  "Works with all NFC-enabled smartphones",
                  "No apps required for emergency access",
                  "Secure, encrypted data storage",
                  "Made with top-of-the-line UV sunblock ink, meaning it's built to last.",
                  "We added an anti-ferrite layer, which ensures it works on metal surfaces.",
                ].map((feature, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <CheckCircle className="mt-1 h-4 w-4 sm:h-5 sm:w-5 text-emergency-red flex-shrink-0" />
                    <span className="text-gray-700 text-sm sm:text-base leading-snug">
                      {feature}
                    </span>
                  </div>
                ))}
              </div>
              <Button
                className="bg-emergency-red hover:bg-emergency-red/90 w-full sm:w-auto"
                asChild
              >
                <a
                  href="https://shop.tapmesaveme.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Shop NFC Emergency Contact Stickers
                </a>
              </Button>
            </div>
          </div>

          {/* Pet Safety */}
          <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 mb-16 sm:mb-20">
            <div className="animate-slide-up order-2 lg:order-none text-left">
              <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-dark-gray mb-4 sm:mb-6">
                NFC Emergency Contact Dog Collar
              </h3>
              <p className="text-base sm:text-lg text-gray-600 mb-4 sm:mb-6">
                If your pet gets lost, the finder can simply tap the embedded
                tag with their phone to instantly access your contact
                information.
              </p>
              <p className="text-base sm:text-lg text-gray-600 mb-4 sm:mb-6 font-semibold">
                No apps. No chips. Just peace of mind.
              </p>
              <p className="text-base sm:text-lg text-gray-600 mb-4 sm:mb-6">
                Traditional dog tags can fall off. But this is the only dog
                collar on the market with an NFC tag securely embedded into the
                collar itself — making it a smarter, safer solution.
              </p>
              <div className="bg-green-50 border border-green-200 rounded-lg p-3 sm:p-4 mb-4 sm:mb-6">
                <p className="text-green-800 font-semibold text-sm sm:text-base">
                  Only $20 on our KickStarter launch will be $25 after.
                </p>
              </div>
              <Button
                className="bg-emergency-red hover:bg-emergency-red/90 w-full sm:w-auto"
                asChild
              >
                <a
                  href="https://shop.tapmesaveme.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Shop NFC Emergency Contact Dog Collar
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
        </div>
      </section>
    </div>
  );
}