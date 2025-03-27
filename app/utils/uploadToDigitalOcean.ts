import { compressImage } from '@/app/utils/createImageUrl';
import { toast } from "react-toastify";

interface UploadOptions {
  file: File | null;
  folder?: string;
  maxWidthOrHeight?: number;
  quality?: number;
}

export const uploadToDigitalOcean = async ({
  file,
  folder = 'go4it-assets',
  // maxWidthOrHeight = 800,
  // quality = 0.7
}: UploadOptions): Promise<string | null> => {
  try {
    // First compress the image
    const compressedBase64 = await compressImage(file as File, {
      //maxWidthOrHeight: 800,
      quality: 0.8,
      maxLength: 1000000 // 1MB
    });

    // Convert base64 to blob
    const base64Response = await fetch(compressedBase64);
    const blob = await base64Response.blob();

    if (!file) {
      toast.error('No file to upload');
      return null;
    }

    console.log('the folder', folder);

    // Create form data
    const formData = new FormData();
    const timestamp = Date.now();
    const fileName = `${folder}/${timestamp}-${file?.name.replace(/\s+/g, '-')}`;
    formData.append('file', blob, fileName);

    // Upload to our API endpoint
    const response = await fetch('/api/fileuploads', {
      method: 'POST',
      body: formData
    });

    console.log('the response', response);

    if (!response.ok) {
      const error = await response.json();
      console.error('Error uploading to DigitalOcean:', error);
      toast.error(error.message || 'Failed to upload file');
      return null;
    }

    const data = await response.json();

    console.log('Uploaded to DigitalOcean:', data);
    return data.url;
  } catch (error) {
    console.error('Error uploading to DigitalOcean:', error);
    toast.error('Failed to upload file');
    return null;
  }
}; 