import type { Metadata } from "next"
import ContactForm from "../../components/ContactForm"

export const metadata: Metadata = {
  title: "Contact TapMeSaveMe - Get Support for NFC Emergency Tags",
  description:
    "Contact TapMeSaveMe for support, questions, or assistance with your NFC emergency contact tags. We're here to help.",
}

export default function ContactPage() {
  return <ContactForm />
}