import { BrevoClient, BrevoEnvironment } from "@getbrevo/brevo";

const client = new BrevoClient({
    apiKey: process.env.BREVO_API_KEY,
    environment: BrevoEnvironment.Production,
});

export async function sendOtpEmail(toEmail, otp) {
    await client.transactionalEmails.sendTransacEmail({
        sender: { name: "InjectionX", email: process.env.MAIL_FROM_ADDRESS },
        to: [{ email: toEmail }],
        subject: "Your InjectionX verification code",
        htmlContent: `
            <div style="font-family:system-ui,sans-serif;max-width:480px;margin:0 auto;background:#fff;">
                <div style="background:#0d1117;padding:32px 32px 28px;border-radius:16px 16px 0 0;">
                    <div style="display:flex;align-items:center;gap:10px;margin-bottom:24px;">
                        <div style="width:32px;height:32px;background:rgba(255,255,255,0.1);border:1px solid rgba(255,255,255,0.1);border-radius:8px;display:inline-flex;align-items:center;justify-content:center;">
                            <span style="color:#fff;font-size:14px;">&#9000;</span>
                        </div>
                        <span style="color:#fff;font-size:14px;font-weight:600;letter-spacing:-0.01em;">InjectionX</span>
                    </div>
                    <h1 style="font-size:22px;font-weight:600;color:#fff;margin:0 0 8px;letter-spacing:-0.02em;">Verify your email</h1>
                    <p style="font-size:14px;color:rgba(255,255,255,0.4);margin:0;">Enter this code to complete your registration.</p>
                </div>
                <div style="padding:32px;border:1px solid #e5e7eb;border-top:none;border-radius:0 0 16px 16px;">
                    <div style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:12px;padding:28px;text-align:center;margin-bottom:24px;">
                        <p style="font-size:12px;color:#9ca3af;margin:0 0 10px;font-family:monospace;letter-spacing:0.1em;text-transform:uppercase;">Verification Code</p>
                        <p style="font-size:40px;font-weight:700;letter-spacing:0.22em;color:#0d1117;margin:0;font-family:monospace;">${otp}</p>
                    </div>
                    <p style="font-size:13px;color:#9ca3af;margin:0;line-height:1.6;">
                        This code expires in <strong style="color:#374151;">10 minutes</strong>.
                        If you didn't request this, you can safely ignore this email.
                    </p>
                </div>
            </div>
        `,
    });
}
