declare module "*.json" {
  const value: any;
  export default value;
}

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      // Database
      DATABASE_URL: string;
      
      // Authentication
      BETTER_AUTH_SECRET: string;
      BETTER_AUTH_URL: string;
      
      // AWS S3
      AWS_ACCESS_KEY_ID: string;
      AWS_SECRET_ACCESS_KEY: string;
      AWS_REGION: string;
      AWS_S3_BUCKET_NAME: string;
      AWS_S3_BUCKET_URL: string;
      
      // CHIP Payment
      CHIP_API_KEY: string;
      CHIP_WEBHOOK_SECRET: string;
      
      // Email (for future use)
      SMTP_HOST?: string;
      SMTP_PORT?: string;
      SMTP_USER?: string;
      SMTP_PASS?: string;
      
      // Site
      NEXT_PUBLIC_SITE_URL: string;
      
      // Development
      NODE_ENV: "development" | "production" | "test";
    }
  }
}
