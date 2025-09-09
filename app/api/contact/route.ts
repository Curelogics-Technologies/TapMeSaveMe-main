import { type NextRequest, NextResponse } from "next/server"
import sgMail from "@sendgrid/mail"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.json()
    const { firstName, lastName, email, phone, subject, message } = formData

    
    if (!firstName || !email || !subject || !message) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Validate email format
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Invalid email address" }, { status: 400 })
    }

    // Set SendGrid API
    const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY
    if (!SENDGRID_API_KEY) {
      console.log("Contact form submission (demo mode):", formData)
      return NextResponse.json({ success: true })
    }
    sgMail.setApiKey(SENDGRID_API_KEY)

    // Send email via SendGrid
    const msg = {
      to: "info@tapmesaveme.com",
      from: "noreply@tapmesaveme.com", // Replace with your verified SendGrid sender email
      subject: `Contact Form Submission: ${subject}`,
      html: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <title>TapMeSaveMe Contact Form Submission</title>
          <style>
            body { font-family: Arial, Helvetica, sans-serif; margin: 0; padding: 0; background-color: #f4f4f4; }
            .container { max-width: 600px; margin: 20px auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
            .header { background-color: #e02424; padding: 20px; text-align: center; border-top-left-radius: 8px; border-top-right-radius: 8px; }
            .header img { max-width: 180px; height: auto; }
            .header h1 { color: #ffffff; font-size: 24px; margin: 10px 0; }
            .content { padding: 30px; }
            .content h2 { color: #1f2a44; font-size: 20px; margin-bottom: 20px; }
            table { width: 100%; border-collapse: collapse; }
            td.label { width: 30%; padding: 10px; font-weight: bold; color: #1f2a44; vertical-align: top; }
            td.value { width: 70%; padding: 10px; color: #4b5563; vertical-align: top; }
            .divider { border-top: 1px solid #e5e7eb; margin: 20px 0; }
            .footer { background-color: #1f2a44; color: #ffffff; padding: 20px; text-align: center; border-bottom-left-radius: 8px; border-bottom-right-radius: 8px; }
            .footer p { margin: 5px 0; font-size: 12px; }
            .footer a { color: #10b981; text-decoration: none; }
            .footer a:hover { text-decoration: underline; }
            .social-icons { margin-top: 10px; }
            .social-icons a { margin: 0 10px; display: inline-block; }
            .social-icons img { width: 24px; height: 24px; }
            @media only screen and (max-width: 600px) {
              .container { margin: 10px; }
              .content { padding: 20px; }
              td.label, td.value { display: block; width: 100%; }
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Contact Form Submission</h1>
            </div>
            <div class="content">
              <h2>New Message Received</h2>
              <table>
                <tr>
                  <td class="label">First Name:</td>
                  <td class="value">${firstName}</td>
                </tr>
                <tr>
                  <td class="label">Last Name:</td>
                  <td class="value">${lastName || "Not provided"}</td>
                </tr>
                <tr>
                  <td class="label">Email:</td>
                  <td class="value">${email}</td>
                </tr>
                <tr>
                  <td class="label">Phone:</td>
                  <td class="value">${phone || "Not provided"}</td>
                </tr>
                <tr>
                  <td class="label">Subject:</td>
                  <td class="value">${subject}</td>
                </tr>
                <tr>
                  <td class="label">Message:</td>
                  <td class="value" style="white-space: pre-wrap;">${message}</td>
                </tr>
              </table>
              <div class="divider"></div>
            </div>
            <div class="footer">
              <p><strong>TapMeSaveMe</strong></p>
              <p><a href="mailto:support@tapmesaveme.com">support@tapmesaveme.com</a> | 1-502-314-6453</p>
              <p><a href="#">Unsubscribe from these emails</a></p>
            </div>
          </div>
        </body>
        </html>
      `,
    }

    await sgMail.send(msg)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Contact API error:", error)
    return NextResponse.json({ error: "Failed to send message" }, { status: 500 })
  }
}
