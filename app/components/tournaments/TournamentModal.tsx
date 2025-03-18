import React from 'react';
import { useFormik } from 'formik';
import * as z from 'zod';
import { toFormikValidationSchema } from 'zod-formik-adapter';
import { Upload, Link } from 'lucide-react';
import { Modal } from '@/app/components/ui/Modal';
//import { useClub } from '@/app/context/ClubContext';
import { useTournamentStore } from '@/app/store/tournament';
import Image from 'next/image';
import countries from '@/app/mock_data/countries';
import { toast } from 'react-toastify';
import { Tournament } from '@/app/types';
const createTournamentSchema = z.object({
  tournament_name: z.string().min(1, 'Tournament name is required'),
  country: z.string().min(1, 'Country is required'),
  type_of_sport: z.enum(['football', 'athletics', 'rugby']).default('football'),
  logo: z.string().optional().nullable(),
  //website_url: z.string().url('Invalid URL').optional().nullable(),
  twitter_url: z.string().url('Invalid URL').optional().nullable(),
  facebook_url: z.string().url('Invalid URL').optional().nullable(),
  instagram_url: z.string().url('Invalid URL').optional().nullable(),
  youtube_url: z.string().url('Invalid URL').optional().nullable(),
  tiktok_url: z.string().url('Invalid URL').optional().nullable(),
  city: z.string().min(1, 'city is required'),
  organizer_name: z.string().min(1, 'Organizer name is required'),
  organizer_email: z.string().email('Invalid email').optional().nullable(),
  organizer_phone: z.string().min(1, 'Organizer phone is required'),
  registration_deadline: z.string().min(1, 'Registration deadline date is required'),
  start_date: z.string().min(1, 'Start date is required'),
  end_date: z.string().min(1, 'End date is required'),
  type_of_tournament: z.enum(['league', 'cup', 'tournament']).default('league'),
  type_of_participation: z.enum(['girls', 'boys', 'mixed']).default('mixed'),
  max_teams_per_club: z.number().min(1, 'Cannot be less than 1'),
  total_teams_count: z.number().min(2, 'Cannot be less than 2'),
//   participating_teams: z.array(z.object({
//     team_name: z.string().min(1, 'Team name is required'),
//   })),
});

interface CreateTournamentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreateTournamentModal = ({ isOpen, onClose }: CreateTournamentModalProps) => {
  const { isLoading, addTournament } = useTournamentStore();

  const formik = useFormik({
    initialValues: {
      tournament_name: '',
      country: '',
      type_of_sport: 'football',
      logo: null,
      //website_url: '',
      twitter_url: '',
      facebook_url: '',
      instagram_url: '',
      youtube_url: '',
      tiktok_url: '',
      city: '',
      organizer_name: '',
      organizer_email: '',
      organizer_phone: '',
      registration_deadline: '',
      start_date: '',
      end_date: '',
      type_of_tournament: 'league',
      type_of_participation: 'both',
      max_teams_per_club: 1,
      total_teams_count: 2,
      description: '',
    },
    validationSchema: toFormikValidationSchema(createTournamentSchema),
    onSubmit: async (values) => {
      try {
        // Handle tournament creation API call here
        await addTournament(values as unknown as Tournament);
        
        if(!isLoading) {
          setTimeout(() => {
            onClose();
            formik.resetForm();
            toast.success('Tournament created successfully');
          }, 3000);
        }
      } catch (error) {
        console.error('Error creating tournament:', error);
        //todo: add error message to formik
        toast.error('Failed to create tournament');
      }
    },
  });

  return (
    <Modal isOpen={isOpen} onClose={onClose} title='Create New Tournament'>
      <form onSubmit={formik.handleSubmit} className='space-y-6'>
        {/* Basic Information */}
        <div className='space-y-4'>
          <h4 className='text-sm font-medium text-gray-900'>
            Basic Information
          </h4>

          {/* Logo Upload */}
          <div className='flex items-center justify-center'>
            <div className='relative'>
              <label
                htmlFor='name'
                className='block text-sm font-medium text-gray-700 text-center pb-2'
              >
                Upload Logo
              </label>
              {formik.values.logo ? (
                <Image
                  src={formik.values.logo}
                  alt='Tournament logo'
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
                    formik.setFieldValue('logo', URL.createObjectURL(file));
                  }
                }}
              />
            </div>
          </div>

          {/* Tournament Details */}
          <div>
            <label htmlFor='name' className='form-label-base'>
                Tournament Name
            </label>
            <input
              type='text'
              id='name'
              {...formik.getFieldProps('tournament_name')}
              className={`form-input ${
                formik.touched.tournament_name && formik.errors.tournament_name
                  ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                  : 'border-gray-300 focus:border-colors-primary focus:ring-colors-primary'
              }
            `}
            />
            {formik.touched.tournament_name && formik.errors.tournament_name && (
              <div className='mt-1 text-sm text-red-600'>
                {formik.errors.tournament_name}
              </div>
            )}
          </div>

          {/* Sport Type */}
          <div>
            <label htmlFor='sport' className='form-label-base'>
              Sport
            </label>
            <select
              id='type_of_sport'
              {...formik.getFieldProps('type_of_sport')}
              className={`form-input ${
                formik.touched.type_of_sport && formik.errors.type_of_sport
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

          {/* Tournament Type */}
          <div>
            <label htmlFor='type_of_tournament' className='form-label-base'>
              Tournament Type
            </label>
            <select
              id='type_of_tournament'
              {...formik.getFieldProps('type_of_tournament')}
              className={`form-input ${
                formik.touched.type_of_tournament && formik.errors.type_of_tournament
              }`}
            >
              <option value=''>Select Tournament Type</option>
              <option value='league'>League</option>
              <option value='cup'>Cup</option>
              <option value='tournament'>Tournament</option>
            </select>
            {formik.touched.type_of_tournament && formik.errors.type_of_tournament && (
              <div className='mt-1 text-sm text-red-600'>
                {formik.errors.type_of_tournament}
              </div>
            )}
          </div>

          {/* Tournament Participation */}
          <div>
            <label htmlFor='type_of_participation' className='form-label-base'>
              Tournament Participation
            </label>
            <select
              id='type_of_participation'
              {...formik.getFieldProps('type_of_participation')}
              className={`form-input ${
                formik.touched.type_of_participation && formik.errors.type_of_participation
              }`}
            >
              <option value=''>Select Tournament Participation</option>
              <option value='girls'>Girls</option>
              <option value='boys'>Boys</option>
              <option value='mixed'>Mixed</option>
            </select>
            {formik.touched.type_of_participation && formik.errors.type_of_participation && (
              <div className='mt-1 text-sm text-red-600'>
                {formik.errors.type_of_participation}
              </div>
            )}
          </div>

        <div className='flex flex-row gap-4'>
            {/* Total Count */}
            <div>
                <label htmlFor='total_teams_count' className='form-label-base'>
                Total Number of Teams
                </label>
                <input
                type='number'
                id='total_teams_count'
                {...formik.getFieldProps('total_teams_count')}
                className={`form-input ${
                    formik.touched.total_teams_count && formik.errors.total_teams_count
                    ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                    : 'border-gray-300 focus:border-colors-primary focus:ring-colors-primary'
                }`}
                />
                {formik.touched.total_teams_count && formik.errors.total_teams_count && (
                <div className='mt-1 text-sm text-red-600'>
                    {formik.errors.total_teams_count}
                </div>
                )}
            </div>

            {/* Participant Count */}
            <div>
                <label htmlFor='max_teams_per_club' className='form-label-base'>
                Number of teams / club
                </label>
                <input
                type='number'
                id='max_teams_per_club'
                {...formik.getFieldProps('max_teams_per_club')}
                className={`form-input ${
                    formik.touched.max_teams_per_club && formik.errors.max_teams_per_club
                    ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                    : 'border-gray-300 focus:border-colors-primary focus:ring-colors-primary'
                }`}
                />
                {formik.touched.max_teams_per_club && formik.errors.max_teams_per_club && (
                <div className='mt-1 text-sm text-red-600'>
                    {formik.errors.max_teams_per_club}
                </div>
                )}
            </div>
        </div>
          
        </div>

        {/* Tournament Dates */}
        <div className='space-y-4'>
          <h4 className='text-sm font-medium text-gray-900'>Tournament Dates</h4>
          <div>
            <label htmlFor='start_date' className='form-label-base'>
              Start Date
            </label>
            <input
              type='date'
              id='start_date'
              {...formik.getFieldProps('start_date')}
              className='form-input'
            />
            {formik.touched.start_date && formik.errors.start_date && (
              <div className='mt-1 text-sm text-red-600'>
                {formik.errors.start_date}
              </div>
            )}
          </div>

          <div>
            <label htmlFor='end_date' className='form-label-base'>
              End Date
            </label>
            <input
              type='date'
              id='end_date'
              {...formik.getFieldProps('end_date')}
              className='form-input'
            />
            {formik.touched.end_date && formik.errors.end_date && (
              <div className='mt-1 text-sm text-red-600'>
                {formik.errors.end_date}
              </div>
            )}
          </div>

          {/* Closing Registration Date */}
          <div>
            <label htmlFor='registration_deadline' className='form-label-base'>
              Closing Registration Date
            </label>
            <input
              type='date'
              id='registration_deadline'
              {...formik.getFieldProps('registration_deadline')}
              className='form-input'
            />
            {formik.touched.registration_deadline && formik.errors.registration_deadline && (
              <div className='mt-1 text-sm text-red-600'>
                {formik.errors.registration_deadline}
              </div>
            )}
          </div>

        </div>

        {/* Tournament Organizer */}
        <div className='space-y-4'>
          <h4 className='text-sm font-medium text-gray-900'>Tournament Organizer</h4>
          <div>
            <label htmlFor='organizer_name' className='form-label-base'>
              Organizer Name
            </label>
            <input
              type='text'
              id='organizer_name'
              {...formik.getFieldProps('organizer_name')}
              className='form-input'
            />
            {formik.touched.organizer_name && formik.errors.organizer_name && (
              <div className='mt-1 text-sm text-red-600'>
                {formik.errors.organizer_name}
              </div>
            )}
          </div>

          <div>
            <label htmlFor='organizer_email' className='form-label-base'>
              Organizer Email
            </label>
            <input
              type='email'
              id='organizer_email'
              {...formik.getFieldProps('organizer_email')}
              className='form-input'
            />
            {formik.touched.organizer_email && formik.errors.organizer_email && (
              <div className='mt-1 text-sm text-red-600'>
                {formik.errors.organizer_email}
              </div>
            )}
          </div>

          <div>
            <label htmlFor='organizer_phone' className='form-label-base'>
              Organizer Phone
            </label>
            <input
              type='tel'
              id='organizer_phone'
              {...formik.getFieldProps('organizer_phone')}
              className='form-input'
            />
            {formik.touched.organizer_phone && formik.errors.organizer_phone && (
              <div className='mt-1 text-sm text-red-600'>
                {formik.errors.organizer_phone}
              </div>
            )}
          </div>
        </div>
        
        {/* city */}
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
          <div>
            <label htmlFor='city' className='form-label-base'>
              City
            </label>
            <input
              type='text'
              id='city'
              {...formik.getFieldProps('city')}
              className={`form-input ${
                formik.touched.tournament_name && formik.errors.tournament_name
                  ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                  : 'border-gray-300 focus:border-colors-primary focus:ring-colors-primary'
              }`}
            />
            {formik.touched.city && formik.errors.city && (
              <div className='mt-1 text-sm text-red-600'>
                {formik.errors.city}
              </div>
            )}
          </div>

        </div>

        {/* Social Links */}
        <div className='space-y-4'>
          <h4 className='text-sm font-medium text-gray-900'>Online Presence</h4>

          {/* <div>
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
          </div> */}

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
            disabled={isLoading}
          >
            {isLoading ? 'Creating...' : 'Create Tournament'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
