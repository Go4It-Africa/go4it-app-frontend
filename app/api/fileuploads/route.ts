import { NextRequest, NextResponse } from 'next/server';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';

// Configure S3 client for DigitalOcean Spaces
const s3Client = new S3Client({
  forcePathStyle: true,
  endpoint: process.env.DIGITAL_OCEAN_SPACES_ORIGINAL_ENDPOINT,
  region: 'fra1',
  credentials: {
    accessKeyId: process.env.DIGITAL_OCEAN_ACCESS_KEY as string,
    secretAccessKey: process.env.DIGITAL_OCEAN_SPACES_SECRET as string,
  },
});

export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(req: NextRequest) {
  try {
    const data = await req.formData();
    const file = data.get('file') as File;
    
    if (!file || !(file instanceof File)) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    // Convert File to Buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Upload to DigitalOcean Spaces
    const uploadResult = await s3Client.send(new PutObjectCommand({
      Bucket: process.env.DIGITAL_OCEAN_SPACES_NAME as string,
      Key: file.name,
      Body: buffer,
      ACL: 'public-read',
      ContentType: file.type,
    }));

    if (uploadResult.$metadata.httpStatusCode !== 200) {
      return NextResponse.json({ error: 'Failed to upload file' }, { status: 500 });
    }

    return NextResponse.json({
      // url: `${process.env.DIGITAL_OCEAN_SPACES_CDN_ENDPOINT}/${process.env.DIGITAL_OCEAN_SPACES_NAME}/${file.name}`,
      url: `${file.name}`,
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Error uploading file' },
      { status: 500 }
    );
  }
}