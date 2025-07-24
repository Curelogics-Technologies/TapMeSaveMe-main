import type { Metadata } from "next"
import { Play, Smartphone, Shield, CheckCircle } from "lucide-react"

export const metadata: Metadata = {
  title: "Activate Your TapMeSaveMe NFC Tag - Setup Instructions",
  description: "Learn how to activate your TapMeSaveMe NFC emergency contact tag with our step-by-step video guide.",
}

export default function ActivatePage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8 sm:py-12">
      <div className="container mx-auto px-3 sm:px-4 lg:px-8 max-w-6xl">
        <div className="text-center mb-8 sm:mb-12 animate-slide-up">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-dark-gray mb-4 sm:mb-6">
            Activate Your Product
          </h1>
          <p className="text-lg sm:text-xl text-gray-600">
            Follow our simple activation process to protect your loved ones
          </p>
        </div>

        {/* Content Section */}
        <div className="space-y-8 sm:space-y-12">
          {/* Quick Start Guide - Horizontal Layout */}
          <div className="bg-white rounded-xl shadow-sm p-6 sm:p-8 animate-scale-in">
            <div className="text-center mb-6 sm:mb-8">
              <div className="flex items-center justify-center space-x-2 mb-3 sm:mb-4">
                <Shield className="h-6 w-6 sm:h-8 sm:w-8 text-emergency-red" />
                <h2 className="text-xl sm:text-2xl font-bold text-dark-gray">Quick Start Guide</h2>
              </div>
              <p className="text-base sm:text-lg text-gray-600">
                Follow these simple steps to activate your TapMeSaveMe tag
              </p>
            </div>

            {/* Horizontal Steps Layout */}
            <div className="relative">
              {/* Progress Line */}
              <div className="hidden sm:block absolute top-6 left-0 right-0 h-0.5 bg-gray-200 z-0">
                <div className="absolute inset-0 bg-emergency-red/30"></div>
              </div>

              {/* Steps */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-4 relative z-10">
                {[
                  {
                    step: "1",
                    title: "Visit Activation Portal",
                    description:
                      "Tap your NFC enabled phone on the product it will redirect you to the activation portal.",
                  },
                  {
                    step: "2",
                    title: "Add Your Information",
                    description:
                      "Enter your emergency contact details, medical information, and any special instructions.",
                  },
                  {
                    step: "3",
                    title: "Test Your Tag",
                    description:
                      "Use any NFC-enabled phone to tap your tag and verify all information displays correctly.",
                  },
                  {
                    step: "4",
                    title: "Keep It Accessible",
                    description:
                      "Attach the tag to your child’s belongings, pet collar, or keychain to ensure it's always within reach in an emergency.",
                  },
                ].map((item, index) => (
                  <div key={index} className="text-center">
                    <div className="flex flex-col items-center space-y-3 sm:space-y-4">
                      {/* Step Number Circle */}
                      <div className="relative">
                        <div className="w-12 h-12 sm:w-14 sm:h-14 bg-white border-4 border-emergency-red rounded-full flex items-center justify-center shadow-lg z-10 relative">
                          <span className="text-emergency-red font-bold text-lg sm:text-xl">{item.step}</span>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="space-y-2">
                        <h3 className="font-semibold text-dark-gray text-sm sm:text-base lg:text-lg leading-tight">
                          {item.title}
                        </h3>
                        <p className="text-gray-600 text-xs sm:text-sm leading-relaxed max-w-xs mx-auto">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Video Section */}
          <div className="bg-white rounded-xl shadow-sm p-6 sm:p-8 animate-fade-in">
            <div className="text-center mb-6">
              <div className="flex items-center justify-center space-x-2 mb-3 sm:mb-4">
                <Play className="h-6 w-6 sm:h-8 sm:w-8 text-emergency-red" />
                <h2 className="text-xl sm:text-2xl font-bold text-dark-gray">Activation Video Guide</h2>
              </div>
              <p className="text-base sm:text-lg text-gray-600">
                Watch our comprehensive step-by-step activation tutorial
              </p>
            </div>

            <div className="aspect-video rounded-xl overflow-hidden border-2 border-dashed border-gray-300 mb-4 sm:mb-6 max-w-3xl mx-auto min-h-[140px] sm:min-h-[200px] lg:min-h-[240px] max-h-[240px] sm:max-h-[360px] lg:max-h-[432px]">
              <video
                className="w-full h-full object-cover"
                controls
                autoPlay
                muted
                loop
                poster="/placeholder.svg?height=432&width=768"
              >
                <source
                  src="202507231754.mp4"
                  type="video/mp4"
                />
                Your browser does not support the video tag.
              </video>
            </div>
            <p className="text-gray-600 text-sm sm:text-base text-center leading-relaxed">
              This comprehensive video will walk you through the entire activation process, from finding your tag ID to
              testing your setup. Perfect for visual learners who prefer step-by-step guidance.
            </p>
          </div>

          {/* Info Cards */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            <div className="bg-blue-50 rounded-xl p-6 hover:shadow-md transition-shadow animate-fade-in">
              <div className="flex items-start space-x-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Smartphone className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-blue-800 mb-2">No App Required!</h3>
                  <p className="text-blue-700 text-sm leading-relaxed">
                    Once activated, anyone can tap your tag with their phone to instantly access your emergency
                    information. No special apps or downloads needed!
                  </p>
                </div>
              </div>
            </div>

            <div
              className="bg-green-50 rounded-xl p-6 hover:shadow-md transition-shadow animate-fade-in"
              style={{ animationDelay: "0.2s" }}
            >
              <div className="flex items-start space-x-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Shield className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-green-800 mb-2">Secure & Private</h3>
                  <p className="text-green-700 text-sm leading-relaxed">
                    Your information is encrypted and only accessible when someone taps your tag. You control what
                    information is shared.
                  </p>
                </div>
              </div>
            </div>

            <div
              className="bg-red-50 rounded-xl p-6 hover:shadow-md transition-shadow animate-fade-in sm:col-span-2 lg:col-span-1"
              style={{ animationDelay: "0.4s" }}
            >
              <div className="flex items-start space-x-3">
                <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="h-5 w-5 text-red-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-red-800 mb-2">Need Help?</h3>
                  <p className="text-red-700 text-sm mb-3 leading-relaxed">
                    Our support team is here to help you through the activation process.
                  </p>
                  <div className="text-red-700 text-sm space-y-1">
                    <p>
                      <strong>Email:</strong> support@tapmesaveme.com
                    </p>
                    <p>
                      <strong>Phone:</strong> 1-502-314-6453
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}