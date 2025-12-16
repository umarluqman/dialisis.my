# AWS S3 Setup Guide for Dialisis.my

This guide will help you set up AWS S3 for storing dialysis center images dynamically instead of hardcoding them.

## 1. AWS Account Setup

1. **Create AWS Account** (if you don't have one)
   - Go to [aws.amazon.com](https://aws.amazon.com)
   - Create a new account or sign in

2. **Create IAM User**
   - Go to IAM Console
   - Create a new user: `dialisis-my-s3-user`
   - Attach policy: `AmazonS3FullAccess` (or create a custom policy for specific bucket)

3. **Generate Access Keys**
   - Go to the IAM user you created
   - Go to "Security credentials" tab
   - Click "Create access key"
   - Save the **Access Key ID** and **Secret Access Key** securely

## 2. S3 Bucket Setup

1. **Create S3 Bucket**
   - Go to S3 Console
   - Click "Create bucket"
   - Bucket name: `dialisis-my-images` (or your preferred name)
   - Region: Choose closest to your users (e.g., `ap-southeast-1` for Malaysia)
   - Keep default settings for security

2. **Configure Bucket Policy** (for public read access)
   ```json
   {
     "Version": "2012-10-17",
     "Statement": [
       {
         "Sid": "PublicReadGetObject",
         "Effect": "Allow",
         "Principal": "*",
         "Action": "s3:GetObject",
         "Resource": "arn:aws:s3:::dialisis-my-images/*"
       }
     ]
   }
   ```

3. **Enable CORS** (for web uploads)
   ```json
   [
     {
       "AllowedHeaders": ["*"],
       "AllowedMethods": ["GET", "PUT", "POST", "DELETE"],
       "AllowedOrigins": ["https://yourdomain.com", "http://localhost:3003"],
       "ExposeHeaders": []
     }
   ]
   ```

## 3. Environment Variables

Create a `.env.local` file in your project root:

```env
# AWS S3 Configuration
AWS_REGION=ap-southeast-1
AWS_ACCESS_KEY_ID=your_access_key_here
AWS_SECRET_ACCESS_KEY=your_secret_key_here
AWS_S3_BUCKET_NAME=dialisis-my-images

# Your existing environment variables
DATABASE_URL="file:./dev.db"
```

## 4. Database Migration

Run the database migration to add the new image tables:

```bash
# Create migration
npx prisma migrate dev --name add_center_images

# Or if you prefer to push directly
npx prisma db push
```

## 5. Using the Image System

### Frontend Display
- The `EnhancedDialysisCenterDetails` component now automatically fetches images from S3
- Falls back to hardcoded images if no S3 images are available
- Shows loading states and error handling

## 6. Image Upload Process

When images are uploaded:
1. Files are validated (must be image types)
2. Images are optimized using Sharp (resized to max 1200x800, JPEG quality 85%)
3. Uploaded to S3 with organized folder structure: `dialysis-centers/{centerId}/`
4. Database records created with S3 URLs and metadata
5. Frontend automatically updates via SWR

## 7. Folder Structure in S3

```
dialisis-my-images/
└── dialysis-centers/
    ├── {center-id-1}/
    │   ├── timestamp-image1.jpg
    │   └── timestamp-image2.jpg
    └── {center-id-2}/
        ├── timestamp-image1.jpg
        └── timestamp-image2.jpg
```

## 8. Cost Optimization

- Images are optimized before upload to reduce storage costs
- Use lifecycle policies to transition old images to cheaper storage classes
- Set up CloudFront CDN for better performance and reduced S3 costs

## 9. Security Considerations

- Use IAM policies with minimal required permissions
- Consider using signed URLs for private images
- Implement file size limits and type validation
- Monitor S3 usage and set up billing alerts

## 10. Backup Strategy

- Enable S3 versioning for image backup
- Set up cross-region replication if needed
- Regular database backups to preserve image metadata

## Troubleshooting

### Common Issues:

1. **Images not showing**: Check bucket policy and CORS settings
2. **Upload fails**: Verify AWS credentials and bucket permissions
3. **Database errors**: Run migration again
4. **Performance issues**: Consider CloudFront CDN setup

### Environment Variables Not Working:
- Make sure `.env.local` is in project root
- Restart development server after adding env vars
- Check if variables are loaded: `console.log(process.env.AWS_REGION)`

## Production Deployment

When deploying to production:
1. Add environment variables to your hosting platform
2. Update CORS origins to include production domain
3. Consider using AWS CloudFormation or CDK for infrastructure as code
4. Set up monitoring and alerts
5. Configure backup and disaster recovery procedures
