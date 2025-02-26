import React, { useMemo } from 'react';
import { useFormik } from 'formik';
import * as z from 'zod';
import { toFormikValidationSchema } from 'zod-formik-adapter';
import { Upload } from 'lucide-react';
import { Modal } from '@/app/components/ui/Modal';
//import { useClub } from '@/app/context/ClubContext';
import Image from 'next/image';
import countries from '@/app/mock_data/countries';

const createPlayerSchema = z.object({
  first_name: z.string().min(1, 'First name is required'),
  last_name: z.string().min(1, 'Last name is required'),
  country_of_residence: z.string().min(1, 'Country of residence is required'),
  date_of_birth: z
    .string()
    .transform((str) => new Date(str))
    .pipe(
      z
        .date()
        .max(new Date(), 'Date of birth must be in the past')
        .refine((date) => {
          const today = new Date();
          const minAge = 8;
          const minDate = new Date(
            today.getFullYear() - minAge,
            today.getMonth(),
            today.getDate()
          );
          return date <= minDate;
        }, 'Player must be at least 8 years old')
    ),
  birth_certificate_file: z
    .string()
    .min(1, 'Birth certificate file is required'),
  category: z.enum(['U9', 'U11', 'U13', 'U15', 'U17']).default('U9'),
  gender: z.enum(['male', 'female'], {
    message: 'Gender is required',
  }),
  nationality: z.string().optional().nullable(),
  position: z
    .enum(['goalkeeper', 'defender', 'midfielder', 'forward'])
    .optional()
    .nullable(),
  height: z
    .number()
    .min(100, 'Height must be at least 100cm')
    .optional()
    .nullable(),
  weight: z
    .number()
    .min(10, 'Weight must be at least 10kg')
    .optional()
    .nullable(),
  photo: z.string().optional().nullable(),
  guardian_name: z.string().min(1, 'Guardian name is required'),
  guardian_phone_number: z
    .string()
    .min(10, 'Guardian phone number is required')
    .max(13, 'Guardian phone number must be less than 13 characters'),
});

interface CreatePlayerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreatePlayerModal = ({
  isOpen,
  onClose,
}: CreatePlayerModalProps) => {
  //const { setPlayer } = usePlayer();

  //const categoryRef = useRef('');

  const formik = useFormik({
    initialValues: {
      first_name: '',
      last_name: '',
      country_of_residence: '',
      date_of_birth: '',
      birth_certificate_file: '',
      category: '',
      gender: '',
      nationality: '',
      position: '',
      height: '',
      weight: '',
      photo: '',
      guardian_name: '',
      guardian_phone_number: '',
    },
    validationSchema: toFormikValidationSchema(createPlayerSchema),
    onSubmit: async (values) => {
      try {
        // Handle club creation API call here
        const response = await fetch('/api/players', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(values),
        });

        const newPlayer = await response.json();
        //setPlayer(newPlayer);
        onClose();
      } catch (error) {
        console.error('Error creating club:', error);
        //todo: add error message to formik
      }
    },
  });

  const calculateAgeCategory = useMemo(() => {
    if (formik.values.date_of_birth) {
      const dateOfBirth = new Date(formik.values.date_of_birth);

      if (!dateOfBirth) return '';

      const today = new Date();
      const age = today.getFullYear() - dateOfBirth.getFullYear();

      if (age <= 9) return 'U9';
      if (age <= 11) return 'U11';
      if (age <= 13) return 'U13';
      if (age <= 15) return 'U15';
      if (age <= 17) return 'U17';
      return 'U17';
    }
    return '';
  }, [formik.values.date_of_birth]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title='Create New Club'>
      <form onSubmit={formik.handleSubmit} className='space-y-6'>
        {/* Basic Information */}
        <h4 className='text-sm font-medium text-gray-900'>Basic Information</h4>

        {/* Names */}
        <div className='grid grid-cols-2 gap-4'>
          {/* First Name */}
          <div>
            <label htmlFor='first_name' className='form-label-base'>
              First Name
            </label>
            <input
              type='text'
              id='first_name'
              {...formik.getFieldProps('first_name')}
              className={`form-input ${
                formik.touched.first_name && formik.errors.first_name
                  ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                  : 'border-gray-300 focus:border-colors-primary focus:ring-colors-primary'
              }
            `}
            />
            {formik.touched.first_name && formik.errors.first_name && (
              <div className='mt-1 text-sm text-red-600'>
                {formik.errors.first_name}
              </div>
            )}
          </div>

          {/* Last Name */}
          <div>
            <label htmlFor='last_name' className='form-label-base'>
              Last Name
            </label>
            <input
              type='text'
              id='last_name'
              {...formik.getFieldProps('last_name')}
              className={`form-input ${
                formik.touched.last_name && formik.errors.last_name
                  ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                  : 'border-gray-300 focus:border-colors-primary focus:ring-colors-primary'
              }
            `}
            />
            {formik.touched.last_name && formik.errors.last_name && (
              <div className='mt-1 text-sm text-red-600'>
                {formik.errors.last_name}
              </div>
            )}
          </div>
        </div>

        <div className='grid grid-cols-2 gap-4'>
          {/* Date of Birth */}
          <div>
            <label htmlFor='date_of_birth' className='form-label-base'>
              Date of Birth
            </label>
            <input
              type='date'
              id='date_of_birth'
              {...formik.getFieldProps('date_of_birth')}
              className={`form-input ${
                formik.touched.date_of_birth && formik.errors.date_of_birth
                  ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                  : 'border-gray-300 focus:border-colors-primary focus:ring-colors-primary'
              }
            `}
            />
            {formik.touched.date_of_birth && formik.errors.date_of_birth && (
              <div className='mt-1 text-sm text-red-600'>
                {formik.errors.date_of_birth}
              </div>
            )}
          </div>

          {/* Category */}
          <div>
            <label htmlFor='category' className='form-label-base'>
              Category
            </label>
            <select
              id='category'
              {...formik.getFieldProps('category')}
              disabled
              value={calculateAgeCategory}
              className={`form-input ${
                formik.touched.category && formik.errors.category
                  ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                  : 'border-gray-300 focus:border-colors-primary focus:ring-colors-primary'
              } disabled:bg-gray-100 disabled:cursor-not-allowed
            `}
            >
              <option value='U9'>U9</option>
              <option value='U11'>U11</option>
              <option value='U13'>U13</option>
              <option value='U15'>U15</option>
              <option value='U17'>U17</option>
            </select>
          </div>
        </div>

        <div className='grid grid-cols-2 gap-4'>
          {/* Country of Residence */}
          <div>
            <label htmlFor='country_of_residence' className='form-label-base'>
              Country of Residence
            </label>
            <select
              id='country_of_residence'
              {...formik.getFieldProps('country_of_residence')}
              className={`form-input ${
                formik.touched.country_of_residence &&
                formik.errors.country_of_residence
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
            {formik.touched.country_of_residence &&
              formik.errors.country_of_residence && (
                <div className='mt-1 text-sm text-red-600'>
                  {formik.errors.country_of_residence}
                </div>
              )}
          </div>

          {/* Nationality */}
          <div>
            <label htmlFor='nationality' className='form-label-base'>
              Nationality
            </label>
            <select
              id='nationality'
              {...formik.getFieldProps('nationality')}
              className={`form-input ${
                formik.touched.nationality && formik.errors.nationality
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
            {formik.touched.nationality && formik.errors.nationality && (
              <div className='mt-1 text-sm text-red-600'>
                {formik.errors.nationality}
              </div>
            )}
          </div>
        </div>

        <div className='grid grid-cols-2 gap-4'>
          {/* Gender */}
          <div>
            <label htmlFor='gender' className='form-label-base'>
              Gender
            </label>
            <select
              id='gender'
              {...formik.getFieldProps('gender')}
              className={`form-input ${
                formik.touched.gender && formik.errors.gender
                  ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                  : 'border-gray-300 focus:border-colors-primary focus:ring-colors-primary'
              } 
            `}
            >
              <option value=''>Select a gender</option>
              <option value='male'>Male</option>
              <option value='female'>Female</option>
            </select>
            {formik.touched.gender && formik.errors.gender && (
              <div className='mt-1 text-sm text-red-600'>
                {formik.errors.gender}
              </div>
            )}
          </div>

          <div>
            <label htmlFor='position' className='form-label-base'>
              Position
            </label>
            <select
              id='position'
              {...formik.getFieldProps('position')}
              className={`form-input ${
                formik.touched.position && formik.errors.position
                  ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                  : 'border-gray-300 focus:border-colors-primary focus:ring-colors-primary'
              }
            `}
            >
              <option value=''>Select a position</option>
              <option value='goalkeeper'>Goalkeeper</option>
              <option value='defender'>Defender</option>
              <option value='midfielder'>Midfielder</option>
              <option value='forward'>Forward</option>
            </select>
            {formik.touched.position && formik.errors.position && (
              <div className='mt-1 text-sm text-red-600'>
                {formik.errors.position}
              </div>
            )}
          </div>
        </div>

        <div className='grid grid-cols-2 gap-4'>
          {/* Height */}
          <div>
            <label htmlFor='height' className='form-label-base'>
              Height
            </label>
            <input
              type='number'
              id='height'
              {...formik.getFieldProps('height')}
              className={`form-input ${
                formik.touched.height && formik.errors.height
                  ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                  : 'border-gray-300 focus:border-colors-primary focus:ring-colors-primary'
              }
            `}
            />
            {formik.touched.height && formik.errors.height && (
              <div className='mt-1 text-sm text-red-600'>
                {formik.errors.height}
              </div>
            )}
          </div>

          {/* Weight */}
          <div>
            <label htmlFor='weight' className='form-label-base'>
              Weight
            </label>
            <input
              type='number'
              id='weight'
              {...formik.getFieldProps('weight')}
              className={`form-input ${
                formik.touched.weight && formik.errors.weight
                  ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                  : 'border-gray-300 focus:border-colors-primary focus:ring-colors-primary'
              }
            `}
            />
            {formik.touched.weight && formik.errors.weight && (
              <div className='mt-1 text-sm text-red-600'>
                {formik.errors.weight}
              </div>
            )}
          </div>
        </div>

        {/* Guardian Contact Information */}
        <div className='grid grid-cols-2 gap-4'>
          {/* Guardian Name */}
          <div>
            <label htmlFor='guardian_name' className='form-label-base'>
              Guardian Name
            </label>
            <input
              type='text'
              id='guardian_name'
              {...formik.getFieldProps('guardian_name')}
              className={`form-input ${
                formik.touched.guardian_name && formik.errors.guardian_name
                  ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                  : 'border-gray-300 focus:border-colors-primary focus:ring-colors-primary'
              }
            `}
            />
            {formik.touched.guardian_name && formik.errors.guardian_name && (
              <div className='mt-1 text-sm text-red-600'>
                {formik.errors.guardian_name}
              </div>
            )}
          </div>

          {/* Guardian Phone Number */}
          <div>
            <label htmlFor='guardian_phone_number' className='form-label-base'>
              Guardian Phone Number
            </label>
            <input
              type='tel'
              id='guardian_phone_number'
              {...formik.getFieldProps('guardian_phone_number')}
              className={`form-input ${
                formik.touched.guardian_phone_number &&
                formik.errors.guardian_phone_number
                  ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                  : 'border-gray-300 focus:border-colors-primary focus:ring-colors-primary'
              }
            `}
            />
            {formik.touched.guardian_phone_number &&
              formik.errors.guardian_phone_number && (
                <div className='mt-1 text-sm text-red-600'>
                  {formik.errors.guardian_phone_number}
                </div>
              )}
          </div>
        </div>

        <div className='grid grid-cols-2 gap-4'>
          {/* Birth Certificate Upload */}
          <div className='relative'>
            <label
              htmlFor='birth_certificate_file'
              className='block text-sm font-medium text-gray-700 text-center pb-2'
            >
              Upload Birth Certificate
            </label>
            {formik.values.birth_certificate_file ? (
              <Image
                src={formik.values.birth_certificate_file}
                alt='Birth Certificate'
                width={128}
                height={128}
                className='w-32 h-32 rounded-full object-cover'
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = '/logos/logo.png';
                }}
              />
            ) : (
              <div className='w-32 h-32 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center bg-gray-50'>
                <Upload className='w-8 h-8 text-gray-400' />
              </div>
            )}
            <input
              type='file'
              accept='image/*'
              className='absolute inset-0 w-full h-full opacity-0 cursor-pointer'
              onChange={(event) => {
                const file = event.currentTarget.files?.[0];
                if (file) {
                  // Handle file upload logic here
                  // For now, just set a placeholder URL
                  formik.setFieldValue(
                    'birth_certificate_file',
                    URL.createObjectURL(file)
                  );
                }
              }}
            />
          </div>

          {/* Photo */}
          <div className='relative'>
            <label
              htmlFor='photo'
              className='block text-sm font-medium text-gray-700 text-center pb-2'
            >
              Upload Photo
            </label>
            {formik.values.birth_certificate_file ? (
              <Image
                src={formik.values.photo}
                alt='Photo'
                width={128}
                height={128}
                className='w-32 h-32 rounded-full object-cover'
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = '/logos/logo.png';
                }}
              />
            ) : (
              <div className='w-32 h-32 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center bg-gray-50'>
                <Upload className='w-8 h-8 text-gray-400' />
              </div>
            )}
            <input
              type='file'
              accept='image/*'
              className='absolute inset-0 w-full h-full opacity-0 cursor-pointer'
              onChange={(event) => {
                const file = event.currentTarget.files?.[0];
                if (file) {
                  // Handle file upload logic here
                  // For now, just set a placeholder URL
                  formik.setFieldValue('photo', URL.createObjectURL(file));
                }
              }}
            />
          </div>
        </div>

        {/* Form Actions */}
        <div className='flex justify-center gap-3'>
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
            Add Player
          </button>
        </div>
      </form>
    </Modal>
  );
};
