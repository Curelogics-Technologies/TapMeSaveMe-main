"use client";

import type React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DollarSign,
  Users,
  TrendingUp,
  Gift,
  Star,
  CheckCircle,
  Mail,
} from "lucide-react";
import Image from "next/image";

export default function AffiliatePage() {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/affiliate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        setIsSubmitted(true);
        setEmail("");
      } else {
        const errorData = await response.json();
        setError(errorData.error || "An error occurred. Please try again.");
      }
    } catch (error) {
      console.error("Affiliate signup error:", error);
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 sm:py-12">
      <div className="container mx-auto px-3 sm:px-4 lg:px-8 max-w-6xl">
        <div className="text-center mb-8 sm:mb-12 animate-slide-up">
          <div className="fixed bottom-4 left-0 right-0 px-4 sm:hidden bg-white h-5 ">
            <button
              className="w-full bg-emergency-red hover:bg-emergency-red/90 text-white px-4 py-2 rounded-md font-medium text-sm text-center transition-colors focus:outline-none"
              onClick={() =>
                window.open("https://shop.tapmesaveme.com/", "_blank")
              }
            >
              Order Now
            </button>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-dark-gray mb-4 sm:mb-6">
            Join Our Affiliate Team
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
            {/* Earn generous commissions while helping families stay safe. Join thousands of affiliates promoting
            life-saving technology. */}
            Our affiliate team was born from your passion. We’ve had over 20,000
            shares on our Facebook posts telling us that you believe in this and
            you want to spread the word. We’ve decided it’s time for you to get
            paid for your efforts.
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-12 sm:mb-16">
          {[
            {
              icon: <DollarSign className="h-6 w-6 sm:h-8 sm:w-8" />,
              title: "Industry Leading Commission Rates",
              description:
                "While we start at 10% base commission, we treat each affiliate individually. We can adjust that based on your sales performances and/or your social media audience reach. Please contact us for commission rate negotiations.",
            },
            {
              icon: <Users className="h-6 w-6 sm:h-8 sm:w-8" />,
              title: "Dedicated Support",
              description:
                "We provide you a personal affiliate manager. You get your own affiliate link. You also get a personal dedicated dashboard that tracks all of your sales and all the sales of your recruits. This way, you know exactly where your commission totals are at all times. We will also provide you the marketing materials and even help you write your social media posts if you'd like. We also provide you the freedom to do it yourself.",
            },
            {
              icon: <TrendingUp className="h-6 w-6 sm:h-8 sm:w-8" />,
              title: "Growing Market",
              description:
                "An estimated $1 trillion is spent annually worldwide on the safety tech ecosystem. This is growing 10% annually. You will be getting in on the ground floor of a brand destined to be a household name in our industry.",
            },
            // {
            //   icon: <Gift className="h-6 w-6 sm:h-8 sm:w-8" />,
            //   title: "Bonus Rewards",
            //   description: "Performance bonuses and exclusive promotions",
            // },
          ].map((benefit, index) => (
            <Card
              key={index}
              className="text-center animate-scale-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardContent className="pt-4 sm:pt-6">
                <div className="text-emergency-red mb-3 sm:mb-4 flex justify-center">
                  {benefit.icon}
                </div>
                <h3 className="font-semibold text-dark-gray mb-2 text-sm sm:text-base">
                  {benefit.title}
                </h3>
                <p className="text-xs sm:text-sm text-gray-600">
                  {benefit.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-2 gap-8 sm:gap-12">
          {/* Image and Form Section */}
          <div className="space-y-6 sm:space-y-8">
            {/* Image */}
            <Card className="animate-scale-in">
              <CardContent className="p-4 sm:p-6">
                <Image
                  src="/Affiliate.png?height=300&width=500"
                  alt="Affiliate Program Promotion"
                  width={500}
                  height={300}
                  className="rounded-xl shadow-sm w-full h-auto"
                />
              </CardContent>
            </Card>

            {/* Application Form */}
            <Card className="animate-scale-in max-w-md lg:max-w-none mx-auto lg:mx-0">
              <CardHeader>
                <CardTitle className="text-xl sm:text-2xl">
                  Join Our Affiliate Program
                </CardTitle>
                <CardDescription className="text-xl sm:text-2xl">
                  Simply input your email address to subscribe to our affiliate
                  team mailing list. Our affiliate program will be hosted by a
                  trusted third-party platform called GoAffPro. You’ll still
                  access everything from our website, but GoAffPro will manage
                  your affiliate dashboard. We’ll make sure you receive your
                  unique affiliate link and all the support you need well in
                  advance of our Shopify launch.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-4 sm:p-5">
                {isSubmitted ? (
                  <div className="text-center py-6">
                    <CheckCircle className="h-12 w-12 sm:h-16 sm:w-16 text-green-500 mx-auto mb-4" />
                    <h3 className="text-lg sm:text-xl font-semibold text-green-800 mb-2">
                      Successfully Subscribed!
                    </h3>
                    <p className="text-green-600 text-sm sm:text-base">
                      Thank you for your interest in joining our affiliate team.
                      We'll be in touch soon with more details about our program
                      launch and exclusive opportunities.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label
                        htmlFor="email"
                        className="text-sm flex items-center space-x-2"
                      >
                        <Mail className="h-4 w-4" />
                        <span>Email Address *</span>
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="Enter your email address"
                        value={email}
                        onChange={handleChange}
                        required
                        className="text-sm py-3"
                      />
                    </div>
                    {error && (
                      <p className="text-sm text-red-500 text-center">
                        {error}
                      </p>
                    )}
                    <Button
                      type="submit"
                      className="w-full bg-emergency-red hover:bg-emergency-red/90 text-sm py-3"
                      disabled={isLoading}
                    >
                      {isLoading ? "Subscribing..." : "Join Affiliate Team"}
                    </Button>
                    <p className="text-xs text-gray-500 text-center">
                      By submitting this form, you agree to receive updates
                      about our affiliate program. We respect your privacy and
                      you can unsubscribe at any time.
                    </p>
                  </form>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Program Details */}
          <div className="space-y-6 sm:space-y-8 animate-fade-in">
            {/* About the Program Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-lg sm:text-xl">
                  <Star className="h-5 w-5 sm:h-6 sm:w-6 text-emergency-red" />
                  <span>About the Program</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 sm:space-y-4">
                <p className="text-gray-700 text-sm sm:text-base">
                  We're building something bigger than a product — we're
                  building a movement to protect children, pets, and loved ones
                  using the power of NFC technology. And we want you to help
                  lead the charge.
                </p>
                <p className="text-gray-700 text-sm sm:text-base">
                  By joining the TapMeTellThem™ Team, you'll earn{" "}
                  <span className="text-emergency-red font-semibold">
                    10% commission
                  </span>{" "}
                  on every sale made through your unique affiliate link. But it
                  doesn't stop there…
                </p>
                <p className="text-gray-700 text-sm sm:text-base">
                  When you invite others to become affiliates too, you'll earn{" "}
                  <span className="text-emergency-red font-semibold">
                    1% of all their sales
                  </span>{" "}
                  — creating a ripple effect of impact and income. It's our way
                  of rewarding the people who help this mission go viral.
                </p>
                <p className="text-gray-700 text-sm sm:text-base">
                  Whether you're a content creator, a caring parent, a
                  veterinarian, a PTA leader, the head of your local motorcycle
                  club, or just someone who believes in saving lives — this team
                  is for you.
                </p>
              </CardContent>
            </Card>

            {/* Why Join TapMeSaveMe? Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-lg sm:text-xl">
                  <Star className="h-5 w-5 sm:h-6 sm:w-6 text-emergency-red" />
                  <span>Why Partner with TapMeSaveMe?</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 sm:space-y-4">
                {[
                  "High conversion rates with a life-saving, in-demand product",
                  "Easy-to-use marketing tools and real-time analytics dashboard",
                  "Join a mission to protect families, pets, and loved ones",
                  "Flexible promotion for influencers, parents, and pet owners",
                  "Reliable monthly payouts with exclusive affiliate perks",
                ].map((feature, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700 text-sm sm:text-base">
                      {feature}
                    </span>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Commission Structure Card */}
            {/* <Card className="bg-green-50 border-green-200">
              <CardHeader>
                <CardTitle className="text-green-800 text-lg sm:text-xl">
                  Commission Structure
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 sm:space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-green-700 text-sm sm:text-base">
                      1-10 sales/month:
                    </span>
                    <span className="font-bold text-green-800 text-sm sm:text-base">
                      25%
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-green-700 text-sm sm:text-base">
                      11-25 sales/month:
                    </span>
                    <span className="font-bold text-green-800 text-sm sm:text-base">
                      30%
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-green-700 text-sm sm:text-base">
                      25+ sales/month:
                    </span>
                    <span className="font-bold text-green-800 text-sm sm:text-base">
                      35%
                    </span>
                  </div>
                </div>
                <p className="text-xs sm:text-sm text-green-600 mt-3 sm:mt-4">
                  Plus performance bonuses and special promotions!
                </p>
              </CardContent>
            </Card> */}

            {/* Questions Card */}
            <Card>
              <CardContent className="pt-4 sm:pt-6">
                <h3 className="font-semibold text-dark-gray mb-2 text-sm sm:text-base">
                  Questions?
                </h3>
                <p className="text-gray-600 text-xs sm:text-sm mb-3 sm:mb-4">
                  Contact our affiliate team for more information about the
                  program.
                </p>
                <p className="text-emergency-red font-semibold text-sm sm:text-base">
                  affiliate@tapmesaveme.com
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
