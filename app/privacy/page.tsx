import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Footer } from "../../components/footer";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow">
        <section className="relative bg-white py-8 sm:py-12 lg:py-16 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-cool-gray to-white opacity-50"></div>
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
            <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
              <div className="animate-fade-in order-1 lg:order-none">
                <div className="p-2 rounded-md max-w-xs mx-auto sm:max-w-sm lg:max-w-md">
                  <Image
                    src="/Logo.png"
                    alt="TapMeSaveMe Logo"
                    width={350}
                    height={450}
                    className="w-full h-auto rounded-lg"
                  />
                </div>
              </div>
              <div className="animate-slide-up order-2 lg:order-none text-left">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-dark-gray mb-4 sm:mb-6">
                  TapMeSaveMe Privacy Policy
                </h1>
                <div className="text-base sm:text-lg text-gray-600 space-y-4">
                  <p>
                    At <span className="font-semibold">TapMeSaveMe™</span>, we respect your privacy. When you submit your information through our site or ads, we collect your name and email address solely for the purpose of communicating with you about our product launch, Kickstarter campaign, and other safety-related updates.
                  </p>
                  <p>
                    We will never sell or share your information with third parties. Your data is stored securely, and you may unsubscribe at any time by clicking the link in any email we send.
                  </p>
                  <p>
                    This site and our email system comply with all Facebook policies and general privacy best practices.
                  </p>
                  <p>
                    For any questions about your data or privacy, please contact us at{" "}
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
          </div>
        </section>
      </main>
    </div>
  );
}