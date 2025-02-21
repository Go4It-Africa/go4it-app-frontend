import React from 'react';
import { useFormik } from 'formik';
import * as z from 'zod';
import { toFormikValidationSchema } from 'zod-formik-adapter';
import { Upload, Globe, Link } from 'lucide-react';
import { Modal } from '@/app/components/ui/Modal';
import { useClub } from '@/app/context/ClubContext';
import Image from 'next/image';
const createClubSchema = z.object({
  name: z.string().min(1, 'Club name is required'),
  country: z.string().min(1, 'Country is required'),
  city: z.string().optional(),
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
  const { setClub } = useClub();

  const formik = useFormik({
    initialValues: {
      name: '',
      country: '',
      city: '',
      sport: 'football' as const,
      logo: null,
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
        // Handle club creation API call here
        const response = await fetch('/api/clubs', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(values),
        });

        const newClub = await response.json();
        setClub(newClub);
        onClose();
      } catch (error) {
        console.error('Error creating club:', error);
      }
    },
  });

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create New Club">
      <form onSubmit={formik.handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="space-y-4">
          <h4 className="text-sm font-medium text-gray-900">Basic Information</h4>
          
          {/* Logo Upload */}
          <div className="flex items-center justify-center">
            <div className="relative">
              {formik.values.logo ? (
                <Image 
                    src={formik.values.logo} 
                    alt="Club logo" 
                    width={128} 
                    height={128} 
                    className="w-32 h-32 rounded-full object-cover" 
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = '/logos/logo.png';
                    }}
                />
              ) : (
                <div className="w-32 h-32 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center bg-gray-50">
                  <Upload className="w-8 h-8 text-gray-400" />
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                onChange={(event) => {
                  const file = event.currentTarget.files?.[0];
                  if (file) {
                    // Handle file upload logic here
                    // For now, just set a placeholder URL
                    formik.setFieldValue('logo', URL.createObjectURL(file));
                  }
                }}
              />
            </div>
          </div>

          {/* Club Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Club Name
            </label>
            <input
              type="text"
              id="name"
              {...formik.getFieldProps('name')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
            />
            {formik.touched.name && formik.errors.name && (
              <div className="mt-1 text-sm text-red-600">{formik.errors.name}</div>
            )}
          </div>

          {/* Sport Type */}
          <div>
            <label htmlFor="sport" className="block text-sm font-medium text-gray-700">
              Sport
            </label>
            <select
              id="sport"
              {...formik.getFieldProps('sport')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
            >
              <option value="football">Football</option>
              <option value="athletics">Athletics</option>
              <option value="rugby">Rugby</option>
            </select>
          </div>
        </div>

        {/* Location */}
        <div className="space-y-4">
          <h4 className="text-sm font-medium text-gray-900">Location</h4>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="country" className="block text-sm font-medium text-gray-700">
                Country
              </label>
              <input
                type="text"
                id="country"
                {...formik.getFieldProps('country')}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
              />
              {formik.touched.country && formik.errors.country && (
                <div className="mt-1 text-sm text-red-600">{formik.errors.country}</div>
              )}
            </div>

            <div>
              <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                City
              </label>
              <input
                type="text"
                id="city"
                {...formik.getFieldProps('city')}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
              />
            </div>
          </div>
        </div>

        {/* Social Links */}
        <div className="space-y-4">
          <h4 className="text-sm font-medium text-gray-900">Online Presence</h4>
          
          <div>
            <label htmlFor="website_url" className="block text-sm font-medium text-gray-700">
              Website
            </label>
            <div className="mt-1 flex rounded-md shadow-sm">
              <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-sm">
                <Globe size={16} />
              </span>
              <input
                type="url"
                id="website_url"
                {...formik.getFieldProps('website_url')}
                placeholder="https://example.com"
                className="flex-1 min-w-0 block w-full rounded-none rounded-r-md border-gray-300 focus:border-primary focus:ring-primary sm:text-sm"
              />
            </div>
          </div>

          {/* Social Media URLs */}
          <div className="grid grid-cols-1 gap-4">
            {['twitter', 'facebook', 'instagram', 'youtube', 'tiktok'].map((platform) => (
              <div key={platform}>
                <label
                  htmlFor={`${platform}_url`}
                  className="block text-sm font-medium text-gray-700 capitalize"
                >
                  {platform}
                </label>
                <div className="mt-1 flex rounded-md shadow-sm">
                  <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-sm">
                    <Link size={16} />
                  </span>
                  <input
                    type="url"
                    id={`${platform}_url`}
                    {...formik.getFieldProps(`${platform}_url`)}
                    placeholder={`https://${platform}.com/your-club`}
                    className="flex-1 min-w-0 block w-full rounded-none rounded-r-md border-gray-300 focus:border-primary focus:ring-primary sm:text-sm"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-primary text-white rounded-md text-sm font-medium hover:bg-primary/90"
          >
            Create Club
          </button>
        </div>
      </form>
    </Modal>
  );
};