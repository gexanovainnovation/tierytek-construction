const NOTIFICATION_EMAIL = "info@tierytek.com";

export async function sendBusinessNotification(subject: string, text: string): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.MAIL_FROM;

  if (!apiKey || !from) {
    console.warn("Email notification skipped: RESEND_API_KEY or MAIL_FROM is not configured.");
    return false;
  }

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [NOTIFICATION_EMAIL],
        subject,
        text,
      }),
      signal: AbortSignal.timeout(8000),
    });

    if (!response.ok) {
      console.error(`Email notification failed with status ${response.status}.`);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Email notification request failed:", error);
    return false;
  }
}