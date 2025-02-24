import { useFormik } from 'formik';
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import * as Yup from 'yup';

const loginSchema = Yup.object().shape({
  email: Yup.string()
    .email('Must be a valid email')
    .max(255)
    .required('Email is required'),
  password: Yup.string().max(255).required('Password is required'),
  first_name: Yup.string().max(255).required('First name is required'),
  last_name: Yup.string().max(255).required('Last name is required'),
  role: Yup.string().max(255).required('Role is required'),
  confirm_password: Yup.string()
    .oneOf([Yup.ref('password')], 'Passwords must match')
    .required('Confirm password is required'),
});

export const SignupForm = () => {
  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
      first_name: '',
      last_name: '',
      role: '',
      confirm_password: '',
    },
    validationSchema: loginSchema,
    onSubmit: async (values) => {
      console.log('API_URL:', process.env.API_URL);

      const result = await signIn('credentials', {
        redirect: true,
        email: values.email,
        first_name: values.first_name,
        last_name: values.last_name,
        password: values.password,
        role: values.role,
        //callbackUrl: '/dashboard'
      });

      console.log('result in login form', result);
      if (result?.error) {
        // Handle error
        console.error(result.error);
      }
    },
  });

  return (
    <div>
      <div className='text-2xl font-bold mb-3'>Sign up</div>
      <form onSubmit={formik.handleSubmit} className='space-y-4'>
        <div className='flex items-center gap-2'>
          <div className='w-1/2'>
            <label htmlFor='name' className='form-label-base'>
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
          </div>

          <div className='w-1/2'>
            <label htmlFor='name' className='form-label-base'>
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
          </div>
        </div>

        <div>
          <label htmlFor='email' className='form-label-base'>
            Email
          </label>
          <input
            type='email'
            id='email'
            {...formik.getFieldProps('email')}
            className={`form-input ${
              formik.touched.email && formik.errors.email
                ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                : 'border-gray-300 focus:border-colors-primary focus:ring-colors-primary'
            }
                `}
          />
          {formik.touched.email && formik.errors.email && (
            <div className='text-red-500 text-sm'>{formik.errors.email}</div>
          )}
        </div>

        <div>
          <label htmlFor='role' className='form-label-base'>
            Role
          </label>
          <select
            id='role'
            {...formik.getFieldProps('role')}
            className={`form-input ${
              formik.touched.role && formik.errors.role
                ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                : 'border-gray-300 focus:border-colors-primary focus:ring-colors-primary'
            }
                `}
          >
            <option value='club_admin'>Club Administrator</option>
            <option value='tournament_organizer'>Tournament Organizer</option>
          </select>
        </div>

        <div className='flex items-center gap-2'>
          <div className='w-1/2'>
            <label htmlFor='password' className='form-label-base'>
              Password
            </label>
            <input
              type='password'
              id='password'
              {...formik.getFieldProps('password')}
              className={`form-input ${
                formik.touched.password && formik.errors.password
                  ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                  : 'border-gray-300 focus:border-colors-primary focus:ring-colors-primary'
              }
                `}
            />
            {formik.touched.password && formik.errors.password && (
              <div className='text-red-500 text-sm'>
                {formik.errors.password}
              </div>
            )}
          </div>

          <div className='w-1/2'>
            <label htmlFor='confirm_password' className='form-label-base'>
              Confirm Password
            </label>
            <input
              type='password'
              id='confirm_password'
              {...formik.getFieldProps('confirm_password')}
              className={`form-input ${
                formik.touched.password && formik.errors.password
                  ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                  : 'border-gray-300 focus:border-colors-primary focus:ring-colors-primary'
              }
                `}
            />
          </div>
        </div>

        <button
          type='submit'
          className='w-full bg-primary text-white py-2 px-4 rounded-md hover:bg-primary/90'
        >
          Log In
        </button>

        <div className='flex items-center justify-start gap-2'>
          <p className='text-sm font-bold text-black'>
            Already have an account?{' '}
          </p>
          <Link href='/auth/login' className='text-primary text-sm ml-auto'>
            Login
          </Link>
        </div>

        <div className='flex items-center justify-center gap-2'>
          <div className='w-full border-t border-gray-300'></div>
          <p className='text-sm font-bold text-black'>OR</p>
          <div className='w-full border-t border-gray-300'></div>
        </div>

        <div className='mt-4'>
          <button
            type='button'
            onClick={() => signIn('google')}
            className='w-full border border-gray-300 py-2 px-4 rounded-md flex items-center justify-center'
          >
            Continue with Google
          </button>
        </div>
      </form>
    </div>
  );
};
