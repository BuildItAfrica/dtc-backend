// utils/sendEmail.js
const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

// Log on startup to confirm key is loaded
console.log("Resend initialized with API key:", process.env.RESEND_API_KEY ? "Present (starts with re_)" : "MISSING!");

const statusTemplates = {
  reviewing: {
    subject: "Your DTC 2026 Application is Under Review",
    reason: "Congratulations! Your application has caught our attention and is now being carefully reviewed by the selection committee. This is the first step toward potentially being shortlisted.",
    nextStep: "We’ll notify you soon about the next stage.",
  },
  shortlisted: {
    subject: "🎉 You're Shortlisted for DTC 2026!",
    reason: "Amazing news! You've been shortlisted as one of our top applicants. Your idea, experience, and passion stood out strongly among hundreds of submissions.",
    nextStep: "Expect details soon about the Physical Bootcamp and team formation.",
  },
  accepted: {
    subject: "You're Accepted into DTC 2026! 🚀",
    reason: "Welcome to the cohort! You've been selected to join The Design Thinking Challenge 2026. We're excited to have you build and prototype bold solutions with us.",
    nextStep: "Virtual bootcamp starts Jan 12–15, 2026. Full schedule and prep materials coming soon.",
  },
  rejected: {
    subject: "Thank You for Applying to DTC 2026",
    reason: "After careful review, we’re unable to move your application forward this year. This was an incredibly competitive cycle with many strong submissions, and this decision does not reflect your potential or talent.",
    nextStep: "We encourage you to apply again next year — many great innovators return stronger!",
  },
};

async function sendStatusUpdateEmail(toEmail, fullName, newStatus, teamName = null, adminNotes = null) {
  console.log("🔔 EMAIL TRIGGERED: sendStatusUpdateEmail called");
  console.log("→ To:", toEmail);
  console.log("→ Recipient Name:", fullName || teamName || "Applicant");
  console.log("→ Status:", newStatus);
  console.log("→ Team Name:", teamName || "N/A");
  console.log("→ Admin Notes:", adminNotes || "None");

  const template = statusTemplates[newStatus];

  if (!template) {
    console.warn(`⚠️ No email template found for status: ${newStatus}`);
    return;
  }

  const displayName = teamName || fullName || "Applicant";

  let extraMessage = "";
  if (adminNotes && newStatus === "rejected") {
    extraMessage = `<p style="font-style: italic; color: #666; margin-top: 20px; padding: 12px; background: #f9f9f9; border-left: 4px solid #ccc;">
      Note from reviewer: ${adminNotes}
    </p>`;
  }

  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>${template.subject}</title>
    </head>
    <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 20px;">
      <div style="max-width: 600px; margin: auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
        <div style="background: #1a1a1a; color: white; padding: 30px; text-align: center;">
          <h1 style="margin: 0; font-size: 24px;">The Design Thinking Challenge 2026</h1>
        </div>
        <div style="padding: 30px;">
          <h2 style="color: #1a1a1a;">Dear ${displayName},</h2>
          
          <p style="font-size: 16px; line-height: 1.8; color: #333;">
            ${template.reason}
          </p>

          ${extraMessage}

          <p style="font-size: 16px; line-height: 1.8; color: #333; font-weight: bold;">
            ${template.nextStep}
          </p>

          <hr style="margin: 40px 0; border: none; border-top: 1px solid #eee;" />

          <p style="font-size: 14px; color: #555; line-height: 1.6;">
            Thank you for your interest in The Design Thinking Challenge 2026.<br />
            We look forward to your innovative voice!<br /><br />
            Best regards,<br />
            <strong>The DTC 2026 Team</strong>
          </p>
        </div>
        <div style="background: #f9f9f9; padding: 20px; text-align: center; font-size: 12px; color: #888;">
          © 2025 DTC 2026. All rights reserved.<br />
          info@dtc.com.ng
        </div>
      </div>
    </body>
    </html>
  `;

  try {
    console.log("📤 Sending email via Resend...");

    const { data, error } = await resend.emails.send({
      from: `DTC 2026 <${process.env.EMAIL_FROM}>`,
      to: [toEmail],
      subject: template.subject,
      html,
    });

    if (error) {
      console.error("❌ Resend API Error:", error);
      return { success: false, error };
    }

    console.log("✅ EMAIL SENT SUCCESSFULLY!");
    console.log("   Email ID:", data?.id);
    console.log("   Check Resend dashboard: https://resend.com/emails");

    return { success: true, data };
  } catch (error) {
    console.error("💥 UNEXPECTED ERROR during Resend send:");
    console.error("   Name:", error.name);
    console.error("   Message:", error.message);
    console.error("   Stack:", error.stack);
    return { success: false, error };
  }
}

module.exports = { sendStatusUpdateEmail };