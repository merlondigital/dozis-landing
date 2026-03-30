import { Resend } from "resend";

export async function sendOtpEmail(params: {
  email: string;
  otp: string;
  resendApiKey: string;
}) {
  const resend = new Resend(params.resendApiKey);

  const { error } = await resend.emails.send({
    from: "DOZIS. <noreply@dozisbp.hu>",
    to: params.email,
    subject: "DOZIS. - Belépési kód",
    html: getOtpEmailHtml(params.otp),
  });

  if (error) {
    console.error("[email] Failed to send OTP:", error.message);
    throw new Error("Email küldés sikertelen.");
  }
}

function getOtpEmailHtml(otp: string): string {
  return `<!DOCTYPE html>
<html lang="hu">
<head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background-color:#0a1628;font-family:'Montserrat',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#0a1628;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="400" cellpadding="0" cellspacing="0" style="background-color:#0d1f3c;border-radius:12px;padding:40px;border:1px solid #1e293b;">
          <tr>
            <td align="center" style="padding-bottom:24px;">
              <h1 style="margin:0;font-family:'Anton',Impact,sans-serif;font-size:32px;color:#d4a017;letter-spacing:2px;">
                DOZIS.
              </h1>
            </td>
          </tr>
          <tr>
            <td align="center" style="padding-bottom:16px;">
              <p style="margin:0;color:#94a3b8;font-size:14px;">
                A belépési kódod:
              </p>
            </td>
          </tr>
          <tr>
            <td align="center" style="padding-bottom:24px;">
              <div style="background-color:#0a1628;border-radius:8px;padding:16px 32px;display:inline-block;border:2px solid #d4a017;">
                <span style="font-family:'Courier New',monospace;font-size:36px;font-weight:bold;color:#d4a017;letter-spacing:8px;">
                  ${otp}
                </span>
              </div>
            </td>
          </tr>
          <tr>
            <td align="center" style="padding-bottom:8px;">
              <p style="margin:0;color:#64748b;font-size:12px;">
                A kód 5 percig érvényes.
              </p>
            </td>
          </tr>
          <tr>
            <td align="center">
              <p style="margin:0;color:#475569;font-size:11px;">
                Ha nem te kérted, hagyd figyelmen kívül ezt az emailt.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}
