import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function TermsOfService() {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow">
        <section className="relative bg-white py-8 sm:py-12 lg:py-16 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-cool-gray to-white opacity-50"></div>
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
            <div className="max-w-3xl mx-auto animate-slide-up text-left">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-dark-gray mb-4 sm:mb-6">
                TapMeSaveMe Terms of Service
              </h1>
              <div className="text-base sm:text-lg text-gray-600 space-y-4">
                <p>
                  Welcome to <span className="font-semibold">TapMeSaveMe™</span>. These Terms of Service ("Terms") govern your use of our website, products, and services, including our NFC-powered emergency contact tags. By accessing or using our website or purchasing our products, you agree to be bound by these Terms.
                </p>

                <h3 className="font-semibold text-lg sm:text-xl text-dark-gray">
                  1. Acceptance of Terms
                </h3>
                <p>
                  By using our website, products, or services, you confirm that you are at least 18 years old or have parental consent and agree to these Terms. If you do not agree, please do not use our services or products.
                </p>

                <h3 className="font-semibold text-lg sm:text-xl text-dark-gray">
                  2. Use of Products
                </h3>
                <p>
                  Our NFC tags are designed to provide emergency contact information and optional medical details via a smartphone tap. You are responsible for ensuring the accuracy of the information stored on the tags and for updating it as needed. TapMeSaveMe is not responsible for incorrect or outdated information provided by users.
                </p>

                <h3 className="font-semibold text-lg sm:text-xl text-dark-gray">
                  3. Account and Activation
                </h3>
                <p>
                  To activate and configure your NFC tags, you may need to create an account on our website. You agree to provide accurate information and keep your account credentials secure. TapMeSaveMe is not liable for unauthorized access due to failure to secure your account.
                </p>

                <h3 className="font-semibold text-lg sm:text-xl text-dark-gray">
                  4. Intellectual Property
                </h3>
                <p>
                  All content on our website, including text, images, logos, and designs, is the property of TapMeSaveMe or its licensors and is protected by intellectual property laws. You may not reproduce, distribute, or modify any content without prior written consent.
                </p>

                <h3 className="font-semibold text-lg sm:text-xl text-dark-gray">
                  5. Limitation of Liability
                </h3>
                <p>
                  TapMeSaveMe provides its products and services "as is" without warranties of any kind, express or implied. We do not guarantee that our NFC tags will function in all environments or that they will prevent all emergencies. TapMeSaveMe is not liable for any indirect, incidental, or consequential damages arising from the use of our products or services.
                </p>

                <h3 className="font-semibold text-lg sm:text-xl text-dark-gray">
                  6. Modifications to Terms
                </h3>
                <p>
                  We reserve the right to update these Terms at any time. Changes will be posted on this page, and continued use of our website or products after changes constitutes acceptance of the new Terms.
                </p>

                <h3 className="font-semibold text-lg sm:text-xl text-dark-gray">
                  7. Governing Law
                </h3>
                <p>
                  These Terms are governed by the laws of the United States. Any disputes arising from these Terms or your use of our services will be resolved in the courts located in the United States.
                </p>

                <h3 className="font-semibold text-lg sm:text-xl text-dark-gray">
                  8. Contact Us
                </h3>
                <p>
                  For questions about these Terms, please contact us at{" "}
                  <Button
                    variant="link"
                    className="p-0 h-auto text-emergency-red hover:text-emergency-red/80 text-base sm:text-lg font-semibold"
                    asChild
                  >
                    <a href="mailto:info@tapmesaveme.com">info@tapmesaveme.com</a>
                  </Button>.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}