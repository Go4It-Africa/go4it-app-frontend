import Image from "next/image";
import { toast } from "react-toastify";
import { Upload } from "lucide-react";
import { useEffect, useState } from "react";
interface ImageProps {
    src: string;
    alt: string;
    width: number;
    height: number;
    className: string;
}
export const CustomImage = ({ src, alt = '', width = 128, height = 128, className }: ImageProps) => {
    const logoUrl = src ? `${process.env.NEXT_PUBLIC_DIGITAL_OCEAN_SPACES_CDN_ENDPOINT}/${src}` : '/logos/logo.png';

    return (
        <Image
            src={logoUrl}
            alt={alt}
            width={width}
            height={height}
            className={className}
        />
  )
};

interface UploadImageProps {
    src: string;
    uploadingLogo: boolean;
    onFileSelect: (file: File) => void;
    className?: string;
    width?: number;
    height?: number;
    alt?: string;
    label?: string;
}

export const UploadImage = ( { label = 'Upload Image', src, uploadingLogo, onFileSelect, className, width, height, alt}: UploadImageProps ) => {
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    //const [logoFile, setLogoFile] = useState<File | null>(null);

    useEffect(() => {
        console.log('src', src);
        if (src) {
            setPreviewUrl(src);
        }
    }, [src]);

    const handleLogoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.currentTarget.files?.[0];
        if (!file) return;
    
        // Validate file type
        if (!file.type.startsWith('image/')) {
          toast.error('Please upload an image file');
          return;
        }
    
        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
          toast.error('File size must be less than 5MB');
          return;
        }
        // Create preview URL
        // setPreviewUrl(URL.createObjectURL(file));
    
        // setLogoFile(file);
        onFileSelect(file);
      };

      return (
        <div className='relative'>
            <label
            htmlFor='image-upload'
            className='block text-sm font-medium text-gray-700 text-center pb-2'
            >
            {label}
            </label>
            <div className={`relative ${className}`}>
            {src ? (
                <CustomImage
                    src={previewUrl || src}
                    alt={alt ?? ''}
                    width={width ?? 128}
                    height={height ?? 128}
                    className='rounded-full object-cover'
                />
            ) : (
                <div className='w-32 h-32 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center bg-gray-50'>
                    <Upload className='w-8 h-8 text-gray-400' />
                </div>
            )}
            <input
                id='image-upload'
                type='file'
                accept='image/*'
                className='absolute inset-0 w-full h-full opacity-0 cursor-pointer'
                onChange={handleLogoUpload}
                disabled={uploadingLogo}
            />
            {uploadingLogo && (
                <div className='absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full'>
                <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-white'></div>
                </div>
            )}
            </div>
        </div>
    )
}


