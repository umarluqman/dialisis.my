type SendEmailParams = {
  to: string | string[];
  subject: string;
  html: string;
  text: string;
  replyTo?: string | string[];
};

type SesCredentials = {
  accessKeyId: string;
  secretAccessKey: string;
  sessionToken?: string;
};

const SES_SERVICE = "ses";
const AWS_ALGORITHM = "AWS4-HMAC-SHA256";
const encoder = new TextEncoder();

function getRequiredEnv(name: string) {
  const value = process.env[name];
  if (!value) throw new Error(`${name} environment variable is not set`);
  return value;
}

function getSesRegion() {
  return process.env.AWS_SES_REGION || process.env.AWS_REGION || "ap-southeast-1";
}

function getFromEmail() {
  return process.env.EMAIL_FROM || "Dialisis.my <noreply@dialisis.my>";
}

function getCredentials(): SesCredentials {
  return {
    accessKeyId: getRequiredEnv("AWS_ACCESS_KEY_ID"),
    secretAccessKey: getRequiredEnv("AWS_SECRET_ACCESS_KEY"),
    sessionToken: process.env.AWS_SESSION_TOKEN,
  };
}

function normalizeEmails(value: string | string[] | undefined) {
  return Array.from(
    new Set(
      (Array.isArray(value) ? value : value ? [value] : [])
        .map((email) => email.trim())
        .filter(Boolean)
    )
  );
}

function encodeFormComponent(value: string) {
  return encodeURIComponent(value).replace(/[!'()*]/g, (char) =>
    `%${char.charCodeAt(0).toString(16).toUpperCase()}`
  );
}

function toFormBody(params: Record<string, string>) {
  return Object.entries(params)
    .map(([key, value]) => `${encodeFormComponent(key)}=${encodeFormComponent(value)}`)
    .join("&");
}

function toHex(bytes: ArrayBuffer | Uint8Array) {
  const view = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes);
  return Array.from(view)
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

function toArrayBuffer(bytes: Uint8Array) {
  return bytes.buffer.slice(
    bytes.byteOffset,
    bytes.byteOffset + bytes.byteLength
  ) as ArrayBuffer;
}

async function sha256Hex(value: string) {
  if (!globalThis.crypto?.subtle) {
    throw new Error("Web Crypto API is required for Amazon SES signing");
  }

  const digest = await globalThis.crypto.subtle.digest(
    "SHA-256",
    toArrayBuffer(encoder.encode(value))
  );
  return toHex(digest);
}

async function hmacSha256(key: string | Uint8Array, value: string) {
  if (!globalThis.crypto?.subtle) {
    throw new Error("Web Crypto API is required for Amazon SES signing");
  }

  const cryptoKey = await globalThis.crypto.subtle.importKey(
    "raw",
    toArrayBuffer(typeof key === "string" ? encoder.encode(key) : key),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signature = await globalThis.crypto.subtle.sign(
    "HMAC",
    cryptoKey,
    toArrayBuffer(encoder.encode(value))
  );
  return new Uint8Array(signature);
}

function getAmzDates(date = new Date()) {
  const compact = date.toISOString().replace(/[:-]|\.\d{3}/g, "");
  return {
    amzDate: compact,
    dateStamp: compact.slice(0, 8),
  };
}

async function getSigningKey(
  secretAccessKey: string,
  dateStamp: string,
  region: string
) {
  const dateKey = await hmacSha256(`AWS4${secretAccessKey}`, dateStamp);
  const regionKey = await hmacSha256(dateKey, region);
  const serviceKey = await hmacSha256(regionKey, SES_SERVICE);
  return hmacSha256(serviceKey, "aws4_request");
}

async function getAuthorizationHeader({
  body,
  credentials,
  region,
  host,
  amzDate,
  dateStamp,
  hasSessionToken,
}: {
  body: string;
  credentials: SesCredentials;
  region: string;
  host: string;
  amzDate: string;
  dateStamp: string;
  hasSessionToken: boolean;
}) {
  const credentialScope = `${dateStamp}/${region}/${SES_SERVICE}/aws4_request`;
  const contentType = "application/x-www-form-urlencoded; charset=utf-8";
  const signedHeaders = hasSessionToken
    ? "content-type;host;x-amz-date;x-amz-security-token"
    : "content-type;host;x-amz-date";
  const canonicalHeaders = [
    `content-type:${contentType}`,
    `host:${host}`,
    `x-amz-date:${amzDate}`,
    hasSessionToken ? `x-amz-security-token:${credentials.sessionToken}` : null,
  ]
    .filter(Boolean)
    .join("\n");
  const payloadHash = await sha256Hex(body);
  const canonicalRequest = [
    "POST",
    "/",
    "",
    `${canonicalHeaders}\n`,
    signedHeaders,
    payloadHash,
  ].join("\n");
  const stringToSign = [
    AWS_ALGORITHM,
    amzDate,
    credentialScope,
    await sha256Hex(canonicalRequest),
  ].join("\n");
  const signingKey = await getSigningKey(
    credentials.secretAccessKey,
    dateStamp,
    region
  );
  const signature = toHex(await hmacSha256(signingKey, stringToSign));

  return `${AWS_ALGORITHM} Credential=${credentials.accessKeyId}/${credentialScope}, SignedHeaders=${signedHeaders}, Signature=${signature}`;
}

function getXmlValue(xml: string, tagName: string) {
  return xml.match(new RegExp(`<${tagName}>([^<]+)</${tagName}>`))?.[1] ?? null;
}

export async function sendEmail({
  to,
  subject,
  html,
  text,
  replyTo,
}: SendEmailParams) {
  const recipients = normalizeEmails(to);
  const replyToAddresses = normalizeEmails(replyTo || process.env.EMAIL_REPLY_TO);

  if (recipients.length === 0) {
    throw new Error("At least one email recipient is required");
  }

  if (recipients.length > 50) {
    throw new Error("Amazon SES supports up to 50 recipients per SendEmail call");
  }

  const region = getSesRegion();
  const host = `email.${region}.amazonaws.com`;
  const credentials = getCredentials();
  const { amzDate, dateStamp } = getAmzDates();
  const params: Record<string, string> = {
    Action: "SendEmail",
    Version: "2010-12-01",
    Source: getFromEmail(),
    "Message.Subject.Charset": "UTF-8",
    "Message.Subject.Data": subject,
    "Message.Body.Html.Charset": "UTF-8",
    "Message.Body.Html.Data": html,
    "Message.Body.Text.Charset": "UTF-8",
    "Message.Body.Text.Data": text,
  };

  recipients.forEach((email, index) => {
    params[`Destination.ToAddresses.member.${index + 1}`] = email;
  });

  replyToAddresses.forEach((email, index) => {
    params[`ReplyToAddresses.member.${index + 1}`] = email;
  });

  const body = toFormBody(params);
  const authorization = await getAuthorizationHeader({
    body,
    credentials,
    region,
    host,
    amzDate,
    dateStamp,
    hasSessionToken: !!credentials.sessionToken,
  });
  const headers: Record<string, string> = {
    Authorization: authorization,
    "Content-Type": "application/x-www-form-urlencoded; charset=utf-8",
    "X-Amz-Date": amzDate,
  };

  if (credentials.sessionToken) {
    headers["X-Amz-Security-Token"] = credentials.sessionToken;
  }

  const response = await fetch(`https://${host}/`, {
    method: "POST",
    headers,
    body,
  });
  const responseText = await response.text();

  if (!response.ok) {
    throw new Error(
      getXmlValue(responseText, "Message") ||
        `Amazon SES request failed with ${response.status}`
    );
  }

  return {
    messageId: getXmlValue(responseText, "MessageId"),
  };
}
