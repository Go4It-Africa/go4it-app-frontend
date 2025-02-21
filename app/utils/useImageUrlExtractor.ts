import { useState } from 'react';
import { useEffect } from 'react';

const useImageUrlExtractor = (blob: Blob) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  useEffect(() => {
    const extractImageUrl = async () => {
      try {
        const objectUrl = URL.createObjectURL(blob);
        setImageUrl(objectUrl);
      } catch (error) {
        console.error('Error extracting image URL:', error);
        setImageUrl(null);
      }
    };

    extractImageUrl();
  }, [blob]);

  return imageUrl;
};

export default useImageUrlExtractor;
