export type AwsCredentials = {
  accessKeyId: string;
  secretAccessKey: string;
  sessionToken?: string;
};

export function getAwsRegion() {
  return (
    process.env.DIALISIS_AWS_REGION ||
    process.env.AWS_REGION ||
    "ap-southeast-1"
  );
}

export function getAwsSesRegion() {
  return process.env.AWS_SES_REGION || getAwsRegion();
}

export function getAwsCredentials(): AwsCredentials {
  // Never mix key pairs and session tokens from different sources: a
  // permanent key pair signed with a foreign session token is rejected by AWS
  if (
    process.env.DIALISIS_AWS_ACCESS_KEY_ID &&
    process.env.DIALISIS_AWS_SECRET_ACCESS_KEY
  ) {
    return {
      accessKeyId: process.env.DIALISIS_AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.DIALISIS_AWS_SECRET_ACCESS_KEY,
      ...(process.env.DIALISIS_AWS_SESSION_TOKEN
        ? { sessionToken: process.env.DIALISIS_AWS_SESSION_TOKEN }
        : {}),
    };
  }

  if (process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY) {
    return {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      ...(process.env.AWS_SESSION_TOKEN
        ? { sessionToken: process.env.AWS_SESSION_TOKEN }
        : {}),
    };
  }

  throw new Error(
    "DIALISIS_AWS_ACCESS_KEY_ID/DIALISIS_AWS_SECRET_ACCESS_KEY or AWS_ACCESS_KEY_ID/AWS_SECRET_ACCESS_KEY environment variables are not set"
  );
}
