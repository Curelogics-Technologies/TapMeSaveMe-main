"use client";

import { useEffect, useState, useRef } from "react";
import { useSearchParams } from "next/navigation";

const VerifyEmailPage = () => {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const email = searchParams.get("email");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState<string>("");
  const [resendStatus, setResendStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [resendMessage, setResendMessage] = useState<string>("");
  const verified = useRef(false); // Track if verification has been attempted

  // Handle email verification
  useEffect(() => {
    if (token && email && !verified.current) {
      verified.current = true;
      verifyEmail(token, email);
    }
  }, [token, email]);

  const verifyEmail = async (token: string, email: string) => {
    setStatus("loading");
    try {
      const response = await fetch(
        `/api/auth/verify-email?token=${encodeURIComponent(token)}&email=${encodeURIComponent(email)}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();
      console.log("Verify email API response:", { status: response.status, data });

      if (response.ok && data.success) {
        setStatus("success");
        setMessage(data.message || "Email verified successfully");
      } else {
        setStatus("error");
        setMessage(data.error || "Failed to verify email");
      }
    } catch (error) {
      setStatus("error");
      setMessage("An unexpected error occurred. Please try again.");
      console.error("Verification error:", error);
    }
  };

  // Handle resend verification email
  const resendVerificationEmail = async () => {
    if (!email) {
      setResendStatus("error");
      setResendMessage("Email not found. Please try signing up again.");
      return;
    }

    setResendStatus("sending");
    try {
      const response = await fetch("/api/auth/resend-verification", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      console.log("Resend verification API response:", { status: response.status, data });

      if (response.ok && data.success) {
        setResendStatus("success");
        setResendMessage(data.message || "Verification email resent successfully!");
      } else {
        setResendStatus("error");
        setResendMessage(data.error || "Failed to resend verification email.");
      }
    } catch (error) {
      setResendStatus("error");
      setResendMessage("An unexpected error occurred. Please try again.");
      console.error("Resend email error:", error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-gray-50 to-gray-200">
      <div className="w-full max-w-md p-8 bg-white rounded-xl shadow-2xl transform transition-all duration-300">
        {/* Logo or Branding */}
        <h1 className="text-4xl font-extrabold text-center text-red-600 mb-6 tracking-tight">TapMeSaveMe™</h1>

        {/* Verification Status */}
        {status === "idle" && !token && !email && (
          <div className="text-center space-y-4">
            <h2 className="text-2xl font-semibold text-gray-800">Invalid Verification Link</h2>
            <p className="text-gray-600">Please check your email for a valid verification link.</p>
            <button
              onClick={resendVerificationEmail}
              disabled={resendStatus === "sending"}
              className={`w-full px-4 py-3 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors duration-200 ${
                resendStatus === "sending" ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {resendStatus === "sending" ? "Sending..." : "Request New Verification Email"}
            </button>
            {resendStatus === "success" && <p className="mt-3 text-green-600 font-medium">{resendMessage}</p>}
            {resendStatus === "error" && <p className="mt-3 text-red-600 font-medium">{resendMessage}</p>}
          </div>
        )}

        {status === "loading" && (
          <div className="text-center space-y-4">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-red-600 mx-auto"></div>
            <h2 className="text-2xl font-semibold text-gray-800">Verifying your email...</h2>
          </div>
        )}

        {status === "success" && (
          <div className="text-center space-y-4">
            <svg
              className="w-20 h-20 text-green-500 mx-auto animate-pulse"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
            <h2 className="text-2xl font-semibold text-green-600">{message}</h2>
            <p className="text-gray-600">Your email verification status has been updated.</p>
          </div>
        )}

        {status === "error" && (
          <div className="text-center space-y-4">
            <svg
              className="w-20 h-20 text-red-500 mx-auto animate-pulse"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
            <h2 className="text-2xl font-semibold text-red-600">Email Verification Failed</h2>
            <p className="text-gray-600">{message}</p>
            <div className="mt-6">
              <button
                onClick={resendVerificationEmail}
                disabled={resendStatus === "sending"}
                className={`w-full px-4 py-3 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors duration-200 ${
                  resendStatus === "sending" ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {resendStatus === "sending" ? "Sending..." : "Request New Verification Email"}
              </button>
            </div>
            {resendStatus === "success" && <p className="mt-3 text-green-600 font-medium">{resendMessage}</p>}
            {resendStatus === "error" && <p className="mt-3 text-red-600 font-medium">{resendMessage}</p>}
          </div>
        )}

        {/* Footer */}
        <div className="mt-8 text-center text-gray-600">
          <p className="font-medium">TapMeSaveMe™ | Your Safety, Our Priority</p>
          <p className="mt-1">
            Need help?{" "}
            <a href="mailto:support@tapmesaveme.com" className="text-blue-500 hover:underline font-medium">
              support@tapmesaveme.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmailPage;