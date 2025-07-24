"use client"

import { useState, FormEvent } from "react"

interface NewsletterFormProps {
  textColor?: string
  labelColor?: string
  placeholderStyle?: string
  inputBorderColor?: string
  buttonStyle?: string
}

export function NewsletterForm({ 
  textColor = "text-dark-gray",
  labelColor = "text-dark-gray", 
  placeholderStyle = "placeholder-gray-500",
  inputBorderColor = "border-gray-300 focus:border-emergency-red",
  buttonStyle = "bg-emergency-red hover:bg-emergency-red/90"
}: NewsletterFormProps) {
  const [email, setEmail] = useState("")
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState("")

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    
    if (!email || !email.includes('@')) {
      setStatus('error')
      setMessage('Please enter a valid email address')
      return
    }

    setStatus('loading')
    setMessage('')

    try {
      // Convert the POST URL to JSONP URL for CORS bypass
      const baseUrl = 'https://tapmesaveme.us1.list-manage.com/subscribe/post-json'
      const params = new URLSearchParams({
        u: '661a5be8a60462f3b7431a783',
        id: '4e4eb6f787',
        EMAIL: email,
        c: 'mailchimpCallback' // JSONP callback name
      })

      // Create a unique callback name to avoid conflicts
      const callbackName = `mailchimpCallback_${Date.now()}`
      
      // Create the script element for JSONP
      const script = document.createElement('script')
      const timeoutId = setTimeout(() => {
        cleanup()
        setStatus('error')
        setMessage('Request timed out. Please try again.')
      }, 10000) // 10 second timeout

      // Define the cleanup function
      const cleanup = () => {
        if (script.parentNode) {
          script.parentNode.removeChild(script)
        }
        delete (window as any)[callbackName]
        clearTimeout(timeoutId)
      }

      // Define the callback function
      ;(window as any)[callbackName] = (data: any) => {
        cleanup()
        
        if (data.result === 'success') {
          setStatus('success')
          setMessage('Thank you for subscribing! Check your email for confirmation.')
          setEmail('')
        } else {
          setStatus('error')
          // Clean up Mailchimp's error message
          let errorMsg = data.msg || 'An error occurred. Please try again.'
          // Remove the "0 - " prefix that Mailchimp sometimes adds
          errorMsg = errorMsg.replace(/^\d+\s*-\s*/, '')
          // Make the message more user-friendly
          if (errorMsg.includes('already subscribed')) {
            errorMsg = 'This email is already subscribed to our newsletter.'
          }
          setMessage(errorMsg)
        }
      }

      // Update URL with the unique callback name
      const finalUrl = `${baseUrl}?${params.toString().replace('mailchimpCallback', callbackName)}`
      script.src = finalUrl
      document.body.appendChild(script)

    } catch (error) {
      setStatus('error')
      setMessage('An unexpected error occurred. Please try again.')
      console.error('Newsletter subscription error:', error)
    }
  }

  return (
    <div className="max-w-md mx-auto">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-2 items-end">
          <div className="flex-1 w-full">
            <label htmlFor="newsletter-email" className={`block text-sm font-semibold ${labelColor} mb-1`}>
              Email Address <span className="text-emergency-red">*</span>
            </label>
            <input
              type="email"
              id="newsletter-email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className={`w-full rounded-md ${inputBorderColor} ${placeholderStyle} shadow-sm focus:ring-emergency-red focus:ring-opacity-50 text-sm py-2 px-3 disabled:opacity-50 disabled:cursor-not-allowed bg-white text-gray-900`}
              disabled={status === 'loading'}
              required
            />
          </div>
          <button
            type="submit"
            disabled={status === 'loading' || !email}
            className={`${buttonStyle} ${textColor} font-semibold py-2 px-6 rounded-md text-sm transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap`}
          >
            {status === 'loading' ? 'Subscribing...' : 'Subscribe'}
          </button>
        </div>

        {/* Status Messages */}
        {message && (
          <div className={`text-sm p-3 rounded-md ${
            status === 'success' 
              ? 'bg-green-50 text-green-700 border border-green-200' 
              : status === 'error'
              ? 'bg-red-50 text-red-700 border border-red-200'
              : ''
          }`}>
            {message}
          </div>
        )}

        {/* Loading indicator */}
        {status === 'loading' && (
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-emergency-red"></div>
          </div>
        )}
      </form>
    </div>
  )
}