import React, { useEffect } from 'react';
import { Formik, Form, FieldArray, FormikErrors, FormikTouched } from 'formik';
import * as z from 'zod';
import { toFormikValidationSchema } from 'zod-formik-adapter';
import { Trash2 } from 'lucide-react';
import { Modal } from '@/app/components/ui/Modal';
import { toast } from 'react-toastify';
import { useTournamentStore } from '@/app/store/tournament';
import { Tournament } from '@/app/types';
import { useClubStore } from '@/app/store/club';
import { useRouter } from 'next/navigation';

const registerTournamentSchema = z.object({
  teams: z.array(z.object({
    team_name: z.string().min(1, 'Team name is required'),
    category: z.string().optional(),
    gender: z.enum(['Boys', 'Girls', 'Mixed']).default('Boys'),
  })).min(1, 'At least one team is required'),
});

type TeamFormValues = {
  teams: Array<{
    team_name: string;
    category: string;
    gender: string;
  }>;
};

interface RegisterTournamentModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentTournament: Tournament
}

export const RegisterTournamentModal = ({ isOpen, onClose, currentTournament }: RegisterTournamentModalProps) => {
  const { isLoading, error, registerTournament } = useTournamentStore();
  const { currentClub } = useClubStore();
  const router = useRouter();

  useEffect(() => {
    if(!currentClub?.id) {
        router.push('/workspace/clubs');
    }
  }, [currentClub?.id, router]);

  console.log('THE CURRENT TOURNAMENT', currentTournament);

  const initialValues: TeamFormValues = {
    teams: [{
      team_name: '',
      category: currentTournament?.categories[0].category_id.toString(),
      gender: 'Boys',
    }],
  };

  const getFieldError = (
    errors: FormikErrors<TeamFormValues>, 
    touched: FormikTouched<TeamFormValues>, 
    index: number, 
    field: keyof TeamFormValues['teams'][0]
  ): string | undefined => {
    const fieldTouched = touched.teams?.[index]?.[field];
    const fieldError = (errors.teams?.[index] as FormikErrors<TeamFormValues['teams'][0]>)?.[field];
    return fieldTouched && fieldError ? fieldError : undefined;
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title='Register Teams in Tournament'>
      <Formik
        initialValues={initialValues}
        validationSchema={toFormikValidationSchema(registerTournamentSchema)}
        onSubmit={async (values, { resetForm }) => {
          try {
            console.log('THE CURRENT TOURNAMENT VALUES', values);
            const tournamentData = {
              ...values,
              club_id: currentClub?.id,
              tournament_id: currentTournament.id,
            };
            console.log('THE TOURNAMENT DATA', tournamentData);

            await registerTournament(tournamentData as unknown as Partial<Tournament>);
            
            if(!isLoading && !error) {
              setTimeout(() => {
                onClose();
                resetForm();
                toast.success('Registered teams successfully');
              }, 3000);
            } else {
                toast.error('Failed to register teams' + error);
            }
          } catch (error) {
            console.error('Error registering teams:', error);
            toast.error('Failed to register teams');
          }
        }}
      >
        {({ values, errors, touched, getFieldProps }) => (
          <Form className='space-y-6'>
            <FieldArray
              name="teams"
              render={arrayHelpers => (
                <div className='space-y-4'>
                  {values.teams.map((team, index) => (
                    <div key={index} className='p-4 border rounded-lg space-y-4'>
                      <div className='flex justify-between items-center'>
                        <h3 className='text-sm font-medium'>Team {index + 1}</h3>
                        {values.teams.length > 1 && (
                          <button
                            type='button'
                            onClick={() => arrayHelpers.remove(index)}
                            className='text-red-500 hover:text-red-700'
                          >
                            <Trash2 className='h-4 w-4' />
                          </button>
                        )}
                      </div>
                      
                      <div className='flex gap-4'>
                        {/* Team Name */}
                        <div className='flex-1'>
                          <label htmlFor={`teams.${index}.team_name`} className='form-label-base'>
                            Team Name
                          </label>
                          <input
                            type='text'
                            id={`teams.${index}.team_name`}
                            {...getFieldProps(`teams.${index}.team_name`)}
                            className={`form-input ${
                              getFieldError(errors, touched, index, 'team_name')
                                ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                                : 'border-gray-300 focus:border-colors-primary focus:ring-colors-primary'
                            }`}
                          />
                          {getFieldError(errors, touched, index, 'team_name') && (
                            <div className='mt-1 text-sm text-red-600'>
                              {getFieldError(errors, touched, index, 'team_name')}
                            </div>
                          )}
                        </div>

                        {/* Category Type */}
                        <div>
                          <label htmlFor={`teams.${index}.category`} className='form-label-base'>
                            Category
                          </label>
                          <select
                            id={`teams.${index}.category`}
                            {...getFieldProps(`teams.${index}.category`)}
                            className={`form-input ${
                              getFieldError(errors, touched, index, 'category')
                                ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                                : 'border-gray-300 focus:border-colors-primary focus:ring-colors-primary'
                            }`}
                          >
                            <option value=''>Select</option>
                            {currentTournament.categories.map((category) => (
                              <option 
                                key={category.category_id} 
                                value={category.category_id}
                              >
                                {category.category_name}
                              </option>
                            ))}
                          </select>
                          {getFieldError(errors, touched, index, 'category') && (
                            <div className='mt-1 text-sm text-red-600'>
                              {getFieldError(errors, touched, index, 'category')}
                            </div>
                          )}
                        </div>

                        {/* Gender */}
                        <div>
                          <label htmlFor={`teams.${index}.gender`} className='form-label-base'>
                            Gender
                          </label>
                          <select
                            id={`teams.${index}.gender`}
                            {...getFieldProps(`teams.${index}.gender`)}
                            className={`form-input ${
                              getFieldError(errors, touched, index, 'gender')
                                ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                                : 'border-gray-300 focus:border-colors-primary focus:ring-colors-primary'
                            }`}
                          >
                            <option value="Boys">Male</option>
                            <option value="Girls">Female</option>
                            <option value="Mixed">Mixed</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  ))}

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
                            type='button'
                            onClick={() => arrayHelpers.push({
                                team_name: '',
                                category: 'U7',
                                gender: 'Boys',
                            })}
                            className='px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50'
                            >
                            Add Team
                        </button>
                        <button
                            type='submit'
                            className='px-4 py-2 bg-primary text-white rounded-md text-sm font-medium hover:bg-primary/90'
                        >
                            Register Teams
                        </button>
                    </div>
                </div>
              )}
            />
          </Form>
        )}
      </Formik>
    </Modal>
  );
};
