import { PKPass } from "passkit-generator";

interface PassData {
  registrationId: string;
  qrToken: string;
  eventName: string;
  eventDate: Date;
  eventVenue: string;
  userName: string;
  isFree: boolean;
}

/**
 * Generate an Apple Wallet .pkpass file for an event registration.
 *
 * Required env vars (base64-encoded):
 * - APPLE_PASS_SIGNERKEY  — PEM private key for the Pass Type ID certificate
 * - APPLE_PASS_SIGNERCERT — PEM certificate for the Pass Type ID
 * - APPLE_PASS_WWDR       — Apple WWDR intermediate certificate (PEM)
 * - APPLE_PASS_TYPE_ID    — e.g. "pass.hu.dozis.kupon"
 * - APPLE_TEAM_ID         — Apple Developer Team ID
 */
export async function generateWalletPass(
  data: PassData,
  env: {
    APPLE_PASS_SIGNERKEY: string;
    APPLE_PASS_SIGNERCERT: string;
    APPLE_PASS_WWDR: string;
    APPLE_PASS_TYPE_ID: string;
    APPLE_TEAM_ID: string;
  },
): Promise<Uint8Array> {
  const pass = new PKPass(
    {},
    {
      signerCert: Buffer.from(env.APPLE_PASS_SIGNERCERT, "base64"),
      signerKey: Buffer.from(env.APPLE_PASS_SIGNERKEY, "base64"),
      wwdr: Buffer.from(env.APPLE_PASS_WWDR, "base64"),
    },
    {
      formatVersion: 1,
      serialNumber: data.registrationId,
      passTypeIdentifier: env.APPLE_PASS_TYPE_ID,
      teamIdentifier: env.APPLE_TEAM_ID,
      organizationName: "DÓZIS.",
      description: "DÓZIS kupon",
      logoText: "DÓZIS.",
      foregroundColor: "rgb(255, 255, 255)",
      backgroundColor: "rgb(10, 14, 26)", // dozis-navy
      labelColor: "rgb(251, 191, 36)", // dozis-amber
    },
  );

  pass.type = "generic";

  const dateStr = data.eventDate.toLocaleDateString("hu-HU", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  pass.primaryFields.push({
    key: "event",
    label: "ESEMÉNY",
    value: data.eventName,
  });

  pass.secondaryFields.push(
    {
      key: "date",
      label: "DÁTUM",
      value: dateStr,
    },
    {
      key: "venue",
      label: "HELYSZÍN",
      value: data.eventVenue,
    },
  );

  pass.auxiliaryFields.push({
    key: "guest",
    label: "VENDÉG",
    value: data.userName,
  });

  if (data.isFree) {
    pass.auxiliaryFields.push({
      key: "free",
      label: "STÁTUSZ",
      value: "INGYENES (5. alkalom)",
    });
  }

  pass.setBarcodes({
    format: "PKBarcodeFormatQR",
    message: data.qrToken,
    messageEncoding: "iso-8859-1",
  });

  const buffer = pass.getAsBuffer();
  return new Uint8Array(buffer);
}
