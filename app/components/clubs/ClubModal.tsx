import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as z from 'zod';
import { toFormikValidationSchema } from 'zod-formik-adapter';
import { Globe, Link } from 'lucide-react';
import { Modal } from '@/app/components/ui/Modal';
//import { useClub } from '@/app/context/ClubContext';
import { useClubStore } from '@/app/store/club';
import countries from '@/app/mock_data/countries';
import { toast } from 'react-toastify';
import { uploadToDigitalOcean } from '@/app/utils/uploadToDigitalOcean';
import { UploadImage } from '../Image';

const createClubSchema = z.object({
  name: z.string().min(1, 'Club name is required'),
  country: z.string().min(1, 'Country is required'),
  sport: z.enum(['football', 'athletics', 'rugby']).default('football'),
  logo: z.string().optional().nullable(),
  website_url: z.string().url('Invalid URL').optional().nullable(),
  twitter_url: z.string().url('Invalid URL').optional().nullable(),
  facebook_url: z.string().url('Invalid URL').optional().nullable(),
  instagram_url: z.string().url('Invalid URL').optional().nullable(),
  youtube_url: z.string().url('Invalid URL').optional().nullable(),
  tiktok_url: z.string().url('Invalid URL').optional().nullable(),
});

interface CreateClubModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreateClubModal = ({ isOpen, onClose }: CreateClubModalProps) => {
  const { isLoading, addClub } = useClubStore();
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [clubLogoFile, setClubLogoFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleFileSelect = (file: File) => {
    setClubLogoFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  }


  const formik = useFormik({
    initialValues: {
      name: '',
      country: '',
      city: '',
      sport: 'football' as const,
      logo: '',
      website_url: '',
      twitter_url: '',
      facebook_url: '',
      instagram_url: '',
      youtube_url: '',
      tiktok_url: '',
    },
    validationSchema: toFormikValidationSchema(createClubSchema),
    onSubmit: async (values) => {
      try {

        try {
          setUploadingLogo(true);
          // Upload to DigitalOcean
          const logoUrl = await uploadToDigitalOcean({
            file: clubLogoFile,
            folder: 'club-logos'
          });

          console.log('the logoUrl', logoUrl);
          
          values.logo = logoUrl ?? '';
        } catch(error) {
          console.error('Error uploading logo:', error);
          toast.error('Failed to upload logo');
          setPreviewUrl(null);
        } finally {
          setUploadingLogo(false);
        }

        //formik.setFieldValue('logo', logoUrl);
        // Handle club creation API call here
        await addClub(values);
        
        if(!isLoading) {
          setTimeout(() => {
            onClose();
            formik.resetForm();
            setPreviewUrl(null);
            setUploadingLogo(false);
            toast.success('Club created successfully');
          }, 3000);
        }
      } catch (error) {
        console.error('Error creating club:', error);
        //todo: add error message to formik
        setPreviewUrl(null);
        setUploadingLogo(false);
        toast.error('Failed to create club');
      }
    },
  });

  // const handleLogoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
  //   const file = event.currentTarget.files?.[0];
  //   if (!file) return;

  //   // Validate file type
  //   if (!file.type.startsWith('image/')) {
  //     toast.error('Please upload an image file');
  //     return;
  //   }

  //   // Validate file size (max 5MB)
  //   if (file.size > 5 * 1024 * 1024) {
  //     toast.error('File size must be less than 5MB');
  //     return;
  //   }
  //   // Create preview URL
  //   setPreviewUrl(URL.createObjectURL(file));

  //   setClubLogoFile(file);
  // };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title='Create New Club'>
      <form onSubmit={formik.handleSubmit} className='space-y-6'>
        {/* Basic Information */}
        <div className='space-y-4'>
          <h4 className='text-sm font-medium text-gray-900'>
            Basic Information
          </h4>

          {/* Logo Upload */}
          <div className='flex items-center justify-center'>
            <UploadImage 
              src={previewUrl || formik.values.logo}
              uploadingLogo={uploadingLogo} 
              onFileSelect={handleFileSelect} 
              className='w-32 h-32' 
              width={128} 
              height={128} 
              alt='Club logo'
              label='Upload Logo'
            />
          </div>
          
          {/* Club Name */}
          <div>
            <label htmlFor='name' className='form-label-base'>
              Club Name
            </label>
            <input
              type='text'
              id='name'
              {...formik.getFieldProps('name')}
              className={`form-input ${
                formik.touched.name && formik.errors.name
                  ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                  : 'border-gray-300 focus:border-colors-primary focus:ring-colors-primary'
              }
            `}
            />
            {formik.touched.name && formik.errors.name && (
              <div className='mt-1 text-sm text-red-600'>
                {formik.errors.name}
              </div>
            )}
          </div>

          {/* Sport Type */}
          <div>
            <label htmlFor='sport' className='form-label-base'>
              Sport
            </label>
            <select
              id='sport'
              {...formik.getFieldProps('sport')}
              className={`form-input ${
                formik.touched.sport && formik.errors.sport
                  ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                  : 'border-gray-300 focus:border-colors-primary focus:ring-colors-primary'
              }
            `}
            >
              <option value=''>Select Sport</option>
              <option value='football'>Football</option>
              <option value='athletics'>Athletics</option>
              <option value='rugby'>Rugby</option>
            </select>
          </div>
        </div>

        {/* Location */}
        <div className='space-y-4'>
          <h4 className='text-sm font-medium text-gray-900'>Location</h4>
          <div>
            <label htmlFor='country' className='form-label-base'>
              Country
            </label>
            <select
              id='country'
              {...formik.getFieldProps('country')}
              className={`form-input ${
                formik.touched.country && formik.errors.country
                  ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                  : 'border-gray-300 focus:border-colors-primary focus:ring-colors-primary'
              }
            `}
            >
              <option value=''>Select a country</option>
              {countries.map((country) => (
                <option key={country.code} value={country.code}>
                  {country.label}
                </option>
              ))}
            </select>
            {formik.touched.country && formik.errors.country && (
              <div className='mt-1 text-sm text-red-600'>
                {formik.errors.country}
              </div>
            )}
          </div>
        </div>

        {/* Social Links */}
        <div className='space-y-4'>
          <h4 className='text-sm font-medium text-gray-900'>Online Presence</h4>

          <div>
            <label htmlFor='website_url' className='form-label-base'>
              Website
            </label>
            <div className='mt-1 flex rounded-md shadow-sm'>
              <span className='inline-flex items-center px-3 shadow-sm rounded-l-md border-2 border-r-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-sm'>
                <Globe size={16} />
              </span>
              <input
                type='url'
                id='website_url'
                {...formik.getFieldProps('website_url')}
                placeholder='https://example.com'
                className='form-input-with-icon'
              />
            </div>
          </div>

          {/* Social Media URLs */}
          <div className='grid grid-cols-1 gap-4'>
            {['twitter', 'facebook', 'instagram', 'youtube', 'tiktok'].map(
              (platform) => (
                <div key={platform}>
                  <label
                    htmlFor={`${platform}_url`}
                    className='form-label-base capitalize'
                  >
                    {platform}
                  </label>
                  <div className='mt-1 flex rounded-md shadow-sm'>
                    <span className='inline-flex items-center px-3 shadow-sm rounded-l-md border-2 border-r-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-sm'>
                      <Link size={16} />
                    </span>
                    <input
                      type='url'
                      id={`${platform}_url`}
                      {...formik.getFieldProps(`${platform}_url`)}
                      placeholder={`https://${platform}.com/your-club`}
                      className='form-input-with-icon'
                    />
                  </div>
                </div>
              )
            )}
          </div>
        </div>

        {/* Form Actions */}
        <div className='flex justify-end gap-3'>
          <button
            type='button'
            onClick={onClose}
            className='px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50'
          >
            Cancel
          </button>
          <button
            type='submit'
            className='px-4 py-2 bg-primary text-white rounded-md text-sm font-medium hover:bg-primary/90'
          >
            Create Club
          </button>
        </div>
      </form>
    </Modal>
  );
};
