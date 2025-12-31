// utils/sendBulkCustomEmail.js

const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

async function sendBulkCustomEmail(applications, subject, htmlMessage) {
  if (!applications || applications.length === 0) {
    return { total: 0, success: 0, failed: 0, errors: [] };
  }

  console.log(`Sending bulk email to ${applications.length} applicants: "${subject}"`);

  const results = {
    total: applications.length,
    success: 0,
    failed: 0,
    errors: [],
  };

  // Send in batches of 10 with delay to avoid rate limits
  const BATCH_SIZE = 10;
  const DELAY_MS = 1500;

  for (let i = 0; i < applications.length; i += BATCH_SIZE) {
    const batch = applications.slice(i, i + BATCH_SIZE);

    const promises = batch.map(async (app) => {
      try {
        const displayName =
          app.type === "team"
            ? app.teamName || app.leadName || "Team Member"
            : app.fullName || "Applicant";

        const toEmail =
          app.type === "team" ? app.leadEmail || app.email : app.email;

        if (!toEmail) {
          throw new Error("No email address");
        }

        // Personalize the message
        const personalizedHtml = htmlMessage
          .replace(/{{name}}/g, displayName)
          .replace(/{{teamName}}/g, app.teamName || "");

        const { data, error } = await resend.emails.send({
          from: `DTC 2026 <${process.env.EMAIL_FROM || "notifications@dtc.com.ng"}>`,
          to: [toEmail],
          subject: subject,
          html: personalizedHtml,
        });

        if (error) throw error;

        return { success: true, email: toEmail };
      } catch (err) {
        return {
          success: false,
          email: app.email || app.leadEmail || "unknown",
          error: err.message || "Unknown error",
        };
      }
    });

    const batchResults = await Promise.all(promises);

    batchResults.forEach((result) => {
      if (result.success) {
        results.success++;
      } else {
        results.failed++;
        results.errors.push(result);
      }
    });

    // Delay between batches
    if (i + BATCH_SIZE < applications.length) {
      await new Promise((resolve) => setTimeout(resolve, DELAY_MS));
    }
  }

  return results;
}

module.exports = { sendBulkCustomEmail };