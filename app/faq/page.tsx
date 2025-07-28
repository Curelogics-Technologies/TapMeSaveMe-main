import type { Metadata } from "next"
import { HelpCircle, Phone, Mail } from "lucide-react"

export const metadata: Metadata = {
  title: "Frequently Asked Questions - TapMeSaveMe NFC Tags",
  description: "Find answers to common questions about TapMeSaveMe NFC emergency contact tags, activation, and usage.",
}

export default function FAQPage() {
  const faqs = [
    {
      question: "What is TapMeSaveMe™?",
      answer:
        "TapMeSaveMe™ is a line of safety products that use NFC technology to help reunite lost children, elderly, or pets with the people who love them most. Our first product is a waterproof NFC sticker designed for motorcycle helmets and other high-risk use cases.",
    },
    {
      question: "How does the sticker work?",
      answer:
        "When someone taps the NFC sticker with their smartphone, it opens a private page with the emergency contact info you've chosen to share. No battery, no app required — just a tap.",
    },
    {
      question: "Is the NFC battery powered?",
      answer:
        "No — NFC tags are passive, which means they don't use any batteries. They're powered by the phone's signal when tapped. That's what makes them long-lasting and so reliable.",
    },
    {
      question: "How long will this work?",
      answer:
        "Our NFC stickers are rated to last up to 10 years or more, depending on conditions. No charging, no maintenance, and no replacements needed unless the sticker is physically damaged.",
    },
    {
      question: "Can anyone with a phone just tap and steal my info?",
      answer:
        "No. You control what information is displayed — and you can leave fields blank. Each user chooses their own layout and level of privacy.",
    },
    {
      question: "How is the information uploaded to the device?",
      answer:
        "Nothing is stored on the sticker itself. The NFC tag simply links to a private page hosted on our secure platform. You fill out your info during setup and can change or remove it anytime.",
    },
    {
      question: "Is my information stored in a database? Can it be hacked?",
      answer:
        "Your emergency contact info is stored securely in an encrypted cloud database — not on the physical sticker. We never collect payment info, passwords, or personal IDs. Only what you choose to share is accessible.",
    },
    {
      question: "What if someone taps my child's bracelet in public?",
      answer:
        "That was one of our biggest early concerns too. That's why we let you control exactly what's displayed. Some parents choose to show only a name and emergency contact. You decide how much to reveal.",
    },
    {
      question: "What if I'm buying this as a gift — how do they set it up?",
      answer:
        "Each product comes with easy setup instructions and a unique NFC tag that can be programmed by the recipient. When they receive it, they simply scan the tag with their phone and follow the steps to enter their emergency contact info. No app or tech skills needed.",
    },
    {
      question: "How do I use the bracelet, sticker, or collar? Is it reusable?",
      answer:
        "Yes! Just tap the product with any compatible smartphone and follow the setup instructions. You can update or change the info anytime — the tag stays with you, but the details can evolve as needed.",
    },
    {
      question: "Are there any subscription fees?",
      answer:
        "No. TapMeSaveMe™ products work without any subscription. You only pay once for the product. Some premium features like GPS alerts may become available in the future, but the core safety function is always free.",
    },
    {
      question: "Is this waterproof and durable enough for pets or kids?",
      answer:
        "Yes — our products are made with durability in mind. The stickers are weatherproof and tamper-resistant, and the bracelets and collars are designed to withstand active daily use. Perfect for parks, schools, travel, or everyday adventures.",
    },
    {
      question: "Do I need an app to use this?",
      answer:
        "No app is required. Just tap the NFC tag with a compatible smartphone and your emergency info will appear instantly in the phone's browser. It works right out of the box — no downloads, no logins.",
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50 py-8 sm:py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        <div className="text-center mb-8 sm:mb-12 animate-slide-up">
          <HelpCircle className="h-12 w-12 sm:h-16 sm:w-16 text-emergency-red mx-auto mb-4 sm:mb-6" />
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-dark-gray mb-4 sm:mb-6">
            Frequently Asked Questions
          </h1>
          <p className="text-lg sm:text-xl text-gray-600">Everything you need to know about TapMeSaveMe NFC tags</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 sm:p-8 mb-8 sm:mb-12 animate-scale-in">
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="group">
                <details className="bg-gray-50 rounded-lg overflow-hidden hover:bg-gray-100 transition-colors">
                  <summary className="cursor-pointer p-4 sm:p-6 font-semibold text-dark-gray text-sm sm:text-base hover:text-emergency-red transition-colors list-none">
                    <div className="flex items-center justify-between">
                      <span>{faq.question}</span>
                      <svg
                        className="w-5 h-5 text-gray-400 group-hover:text-emergency-red transition-transform group-open:rotate-180"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </summary>
                  <div className="px-4 sm:px-6 pb-4 sm:pb-6 text-gray-600 text-sm sm:text-base leading-relaxed">
                    {faq.answer}
                  </div>
                </details>
              </div>
            ))}
          </div>
        </div>

        {/* Contact Support */}
        <div className="grid sm:grid-cols-2 gap-6 sm:gap-8">
          {/* <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow animate-fade-in">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-emergency-red/10 rounded-lg flex items-center justify-center">
                <Phone className="h-5 w-5 text-emergency-red" />
              </div>
              <h3 className="text-lg font-semibold text-dark-gray">Phone Support</h3>
            </div>
            <p className="text-gray-600 mb-4 text-sm sm:text-base">Need immediate help? Call our support team.</p>
            <p className="text-xl sm:text-2xl font-bold text-dark-gray mb-1">1-502-314-6453</p>
            <p className="text-xs sm:text-sm text-gray-500">We can call you back ASAP. Start with an SMS text.</p>
          </div> */}

          <div
            className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow animate-fade-in"
            style={{ animationDelay: "0.2s" }}
          >
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-emergency-red/10 rounded-lg flex items-center justify-center">
                <Mail className="h-5 w-5 text-emergency-red" />
              </div>
              <h3 className="text-lg font-semibold text-dark-gray">Email Support</h3>
            </div>
            <p className="text-gray-600 mb-4 text-sm sm:text-base">
              Send us a message and we'll get back to you within 24 hours.
            </p>
            <p className="text-base sm:text-lg font-semibold text-dark-gray mb-1">support@tapmesaveme.com</p>
            <p className="text-xs sm:text-sm text-gray-500">We respond within 24 hours</p>
          </div>
        </div>
      </div>
    </div>
  )
}
