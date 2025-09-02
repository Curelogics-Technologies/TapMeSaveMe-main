"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { MapPin, Phone, Mail, Clock } from "lucide-react"

export default function ContactForm() {
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
    })
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [successMessage, setSuccessMessage] = useState<string | null>(null)

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.id]: e.target.value,
        }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        setError(null)
        setSuccessMessage(null)

        try {
            const response = await fetch("/api/contact", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            })

            if (response.ok) {
                setSuccessMessage("Message sent successfully! We'll respond within 24 hours.")
                setFormData({
                    firstName: "",
                    lastName: "",
                    email: "",
                    phone: "",
                    subject: "",
                    message: "",
                })
            } else {
                const errorData = await response.json()
                setError(errorData.error || "Failed to send message")
            }
        } catch (error) {
            setError("An error occurred. Please try again.")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
                <div className="text-center mb-12 animate-slide-up">
                    <h1 className="text-4xl lg:text-5xl font-bold text-dark-gray mb-6">Contact Us</h1>
                    <p className="text-xl text-gray-600">We're here to help you protect who matters most</p>
                </div>

                <div className="grid lg:grid-cols-2 gap-12">
                    {/* Contact Form */}
                    <Card className="animate-scale-in">
                        <CardHeader>
                            <CardTitle>Send us a Message</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="firstName" className="text-sm flex items-center space-x-2">
                                            <span>First Name <span className="text-emergency-red">*</span></span>
                                        </Label>
                                        <Input
                                            id="firstName"
                                            placeholder="John"
                                            value={formData.firstName}
                                            onChange={handleChange}
                                            required
                                            className="placeholder:text-gray-400" // Dim placeholder color
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="lastName" className="text-sm flex items-center space-x-2">
                                            <span>Last Name</span>
                                        </Label>
                                        <Input
                                            id="lastName"
                                            placeholder="Doe"
                                            value={formData.lastName}
                                            onChange={handleChange}
                                            className="placeholder:text-gray-400" // Dim placeholder color
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="email" className="text-sm flex items-center space-x-2">
                                        <span>Email <span className="text-emergency-red">*</span></span>
                                    </Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="john@example.com"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                        className="placeholder:text-gray-400" // Dim placeholder color
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="phone" className="text-sm flex items-center space-x-2">
                                        <span>Phone (Optional)</span>
                                    </Label>
                                    <Input
                                        id="phone"
                                        type="tel"
                                        placeholder="+1 (555) 123-4567"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        className="placeholder:text-gray-400" // Dim placeholder color
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="subject" className="text-sm flex items-center space-x-2">
                                        <span>Subject <span className="text-emergency-red">*</span></span>
                                    </Label>
                                    <Input
                                        id="subject"
                                        placeholder="How can we help you?"
                                        value={formData.subject}
                                        onChange={handleChange}
                                        required
                                        className="placeholder:text-gray-400" // Dim placeholder color
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="message" className="text-sm flex items-center space-x-2">
                                        <span>Message <span className="text-emergency-red">*</span></span>
                                    </Label>
                                    <Textarea
                                        id="message"
                                        placeholder="Tell us more about your question or concern..."
                                        rows={5}
                                        value={formData.message}
                                        onChange={handleChange}
                                        required
                                        className="placeholder:text-gray-400" // Dim placeholder color
                                    />
                                </div>

                                {error && (
                                    <div className="text-sm text-red-500 text-center">{error}</div>
                                )}

                                <Button
                                    type="submit"
                                    className="w-full bg-emergency-red hover:bg-emergency-red/90"
                                    disabled={isLoading}
                                >
                                    {isLoading ? "Sending..." : "Send Message"}
                                </Button>

                                <div className="text-xs text-gray-500 text-center pt-2">
                                    * indicates required field
                                </div>
                                {successMessage && (
                                    <div className="text-sm text-green-500 text-center pt-1">{successMessage}</div>
                                )}
                            </form>
                        </CardContent>
                    </Card>

                    {/* Contact Information */}
                    <div className="space-y-8 animate-fade-in">
                        <Card>
                            <CardHeader>
                                <CardTitle>Get in Touch</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="flex items-start space-x-4">
                                    <Phone className="h-6 w-6 text-emergency-red mt-1" />
                                    <div>
                                        <h3 className="font-semibold text-dark-gray">Phone</h3>
                                        <p className="text-gray-600">1-502-314-6453</p>
                                        <p className="text-sm text-gray-500">We can call you back ASAP. Start with an SMS text.</p>
                                    </div>
                                </div>

                                <div className="flex items-start space-x-4">
                                    <Mail className="h-6 w-6 text-emergency-red mt-1" />
                                    <div>
                                        <h3 className="font-semibold text-dark-gray">Email</h3>
                                        <p className="text-gray-600">support@tapmesaveme.com</p>
                                        <p className="text-sm text-gray-500">We respond ASAP.</p>
                                    </div>
                                </div>

                                {/* <div className="flex items-start space-x-4">
                                    <MapPin className="h-6 w-6 text-emergency-red mt-1" />
                                    <div>
                                        <h3 className="font-semibold text-dark-gray">Address</h3>
                                        <p className="text-gray-600">
                                            7703 Nevia Way
                                            <br />
                                            Louisville, Kentucky 40220
                                            <br />
                                            United States
                                        </p>
                                    </div>
                                </div> */}

                                <div className="flex items-start space-x-4">
                                    <Clock className="h-6 w-6 text-emergency-red mt-1" />
                                    <div>
                                        <h3 className="font-semibold text-dark-gray">Facebook Messenger</h3>
                                        <p className="text-gray-600">
                                            We reply very quickly to DMs:
                                            <br />
                                            <a href="https://www.facebook.com/TapMeSaveMe" className="text-blue-700 hover:text-blue-900">Our Facebook</a>
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="pt-4 sm:pt-6">
                                <h3 className="font-semibold text-dark-gray mb-2 text-sm sm:text-base">Questions?</h3>
                                <p className="text-gray-600 text-xs sm:text-sm mb-3 sm:mb-4">
                                    If you have any questions about our products or services, Feel free to reach out to us via email or phone.
                                </p>
                                {/* <p className="text-emergency-red font-semibold text-sm sm:text-base">info@tapmesaveme.com</p> */}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    )
}