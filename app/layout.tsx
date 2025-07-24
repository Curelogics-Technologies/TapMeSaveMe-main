import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "TapMeSaveMe - NFC Emergency Contact Tags | Protect Who Matters Most",
  description:
    "NFC-powered tags that enable instant sharing of location, emergency contact and medical info - for children, pets and loved ones. Protect who matters most with TapMeSaveMe.",
  keywords: "NFC tags, emergency contact, child safety, pet safety, medical information, location sharing, smart tags",
  authors: [{ name: "TapMeSaveMe" }],
  openGraph: {
    title: "TapMeSaveMe - NFC Emergency Contact Tags",
    description: "Protect who matters most with NFC-powered emergency contact tags",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "TapMeSaveMe - NFC Emergency Contact Tags",
    description: "Protect who matters most with NFC-powered emergency contact tags",
  },
  robots: {
    index: true,
    follow: true,
  },
    generator: 'Next.js',

    icons: {
    icon: "/Logo.png", 
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  )
}
