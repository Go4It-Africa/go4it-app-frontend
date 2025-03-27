interface CompressOptions {
    maxWidthOrHeight?: number;
    quality?: number;
    maxLength?: number;
  }
  
  export const compressImage = async (file: File, options: CompressOptions = {}): Promise<string> => {
    const {
      maxWidthOrHeight = 1000,    // Reduced default size
      quality = 0.7,            // Slightly reduced quality
      maxLength = 1000         // Maximum string length
    } = options;
  
    const compress = (currentQuality: number, currentSize: number): Promise<string> => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.src = URL.createObjectURL(file);
  
        img.onload = () => {
          URL.revokeObjectURL(img.src);
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;
  
          // Calculate new dimensions while maintaining aspect ratio
          const scale = Math.min(currentSize / width, currentSize / height);
          width = Math.round(width * scale);
          height = Math.round(height * scale);
  
          canvas.width = width;
          canvas.height = height;
  
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            reject(new Error('Failed to get canvas context'));
            return;
          }
  
          // Draw image with smooth scaling
          ctx.imageSmoothingQuality = 'high';
          ctx.drawImage(img, 0, 0, width, height);
  
          // Try WebP first as it's more efficient
          let base64String = canvas.toDataURL('image/webp', currentQuality);
          
          // If WebP is not supported or string is still too long, fall back to JPEG
          if (base64String.length > maxLength || base64String.indexOf('data:image/webp') === -1) {
            base64String = canvas.toDataURL('image/jpeg', currentQuality);
          }
  
          resolve(base64String);
        };
  
        img.onerror = () => {
          URL.revokeObjectURL(img.src);
          reject(new Error('Failed to load image'));
        };
      });
    };
  
    // Start with initial compression
    let result = await compress(quality, maxWidthOrHeight);
    
    // If still too large, progressively reduce quality and size until it fits
    let currentQuality = quality;
    let currentSize = maxWidthOrHeight;
    
    while (result.length > maxLength && (currentQuality > 0.1 || currentSize > 50)) {
      if (currentQuality > 0.1) {
        currentQuality -= 0.1;
      } else {
        currentSize = Math.max(50, Math.floor(currentSize * 0.8));
      }
      
      result = await compress(currentQuality, currentSize);
    }
  
    if (result.length > maxLength) {
      throw new Error('Unable to compress image to required size');
    }
  
    return result;
  }; 