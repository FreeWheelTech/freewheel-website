import { NextResponse } from "next/server";
import { Resend } from "resend";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, service, budget, details } = body;

    // Validate required fields
    if (!name || !email || !service || !details) {
      return NextResponse.json(
        { error: "Missing required fields." },
        { status: 400 }
      );
    }

    const recipientEmail = process.env.CONTACT_RECEIVER_EMAIL || "fwtsbusiness@gmail.com";
    const resendApiKey = process.env.RESEND_API_KEY;
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;

    const emailSubject = `🚀 New Project Inquiry from ${name} - FreeWheel`;
    const emailHtml = `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; background-color: #0c101d; color: #f8fafc; border-radius: 12px; border: 1px solid #1e293b;">
        <div style="border-bottom: 1px solid #1e293b; padding-bottom: 16px; margin-bottom: 20px;">
          <h2 style="color: #00d2ff; margin: 0 0 6px 0; font-size: 24px;">New Client Project Inquiry</h2>
          <p style="color: #94a3b8; margin: 0; font-size: 14px;">Received via FreeWheel Technology Solutions Website</p>
        </div>

        <div style="background-color: #141b2d; padding: 18px; border-radius: 8px; margin-bottom: 20px; border: 1px solid #1e293b;">
          <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
            <tr>
              <td style="padding: 8px 0; color: #94a3b8; width: 140px;"><strong>Client Name:</strong></td>
              <td style="padding: 8px 0; color: #f8fafc;">${name}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #94a3b8;"><strong>Client Email:</strong></td>
              <td style="padding: 8px 0; color: #38bdf8;"><a href="mailto:${email}" style="color: #38bdf8; text-decoration: none;">${email}</a></td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #94a3b8;"><strong>Service Category:</strong></td>
              <td style="padding: 8px 0; color: #f8fafc;"><span style="background-color: #087cff22; color: #00d2ff; padding: 2px 8px; border-radius: 4px; border: 1px solid #087cff44;">${service}</span></td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #94a3b8;"><strong>Estimated Budget:</strong></td>
              <td style="padding: 8px 0; color: #10b981; font-weight: bold;">${budget || "Not Specified"}</td>
            </tr>
          </table>
        </div>

        <div style="margin-bottom: 24px;">
          <h3 style="color: #f8fafc; font-size: 16px; margin: 0 0 8px 0;">Project Description & Requirements:</h3>
          <div style="background-color: #141b2d; padding: 16px; border-radius: 8px; color: #cbd5e1; font-size: 14px; line-height: 1.6; border: 1px solid #1e293b; white-space: pre-wrap;">
${details}
          </div>
        </div>

        <div style="border-top: 1px solid #1e293b; padding-top: 16px; text-align: center; color: #64748b; font-size: 12px;">
          <p style="margin: 0;">Reply directly to this email to respond to <a href="mailto:${email}" style="color: #38bdf8;">${email}</a></p>
        </div>
      </div>
    `;

    // 1. Try sending with Resend if API key is provided
    if (resendApiKey) {
      const resend = new Resend(resendApiKey);
      await resend.emails.send({
        from: "FreeWheel Inquiries <onboarding@resend.dev>",
        to: recipientEmail,
        replyTo: email,
        subject: emailSubject,
        html: emailHtml,
      });
      return NextResponse.json({ success: true, message: "Email sent successfully via Resend." });
    }

    // 2. Try sending with Nodemailer SMTP if configured
    if (smtpUser && smtpPass) {
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: smtpUser,
          pass: smtpPass,
        },
      });

      await transporter.sendMail({
        from: `"FreeWheel Website" <${smtpUser}>`,
        to: recipientEmail,
        replyTo: email,
        subject: emailSubject,
        html: emailHtml,
      });
      return NextResponse.json({ success: true, message: "Email sent successfully via SMTP." });
    }

    // 3. Development fallback when env vars are not yet configured
    console.log("-----------------------------------------");
    console.log("📨 [DEVELOPMENT] NEW CONTACT INQUIRY RECEIVED:");
    console.log(`From: ${name} (${email})`);
    console.log(`Service: ${service} | Budget: ${budget}`);
    console.log(`Details: ${details}`);
    console.log(`Target Recipient: ${recipientEmail}`);
    console.log("-----------------------------------------");

    return NextResponse.json({
      success: true,
      message: "Inquiry received and logged (Configure RESEND_API_KEY or SMTP_USER/SMTP_PASS to send live emails).",
    });
  } catch (error: unknown) {
    console.error("Error processing contact submission:", error);
    return NextResponse.json(
      { error: "Internal server error. Please try again later." },
      { status: 500 }
    );
  }
}
