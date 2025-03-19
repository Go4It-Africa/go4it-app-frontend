import { useFormik } from 'formik';
//import { signIn } from 'next-auth/react';
import Link from 'next/link';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
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
  const router = useRouter();

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
      const userData = {
        email: values.email,
        password: values.password,
        first_name: values.first_name,
        last_name: values.last_name,
        role: values.role,
      };

      const response = await fetch('/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });

      if (response.ok) {
        //show success message to user
        toast.success('Signup successful');

        //redirect to login page
        router.push('/auth/login');
      } else {
        const errorData = await response.json();
        //show error message to user
        toast.error(errorData.message || 'Failed to signup user');
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
            {formik.touched.first_name && formik.errors.first_name && (
              <div className='text-red-500 text-sm'>
                {formik.errors.first_name}
              </div>
            )}
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
            {formik.touched.last_name && formik.errors.last_name && (
              <div className='text-red-500 text-sm'>
                {formik.errors.last_name}
              </div>
            )}
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
            <option value=''>Select a role</option>
            <option value='club_admin'>Club Administrator</option>
            <option value='tournament_organizer'>Tournament Organizer</option>
          </select>
          {formik.touched.role && formik.errors.role && (
            <div className='text-red-500 text-sm'>{formik.errors.role}</div>
          )}
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
                formik.touched.confirm_password &&
                formik.errors.confirm_password
                  ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                  : 'border-gray-300 focus:border-colors-primary focus:ring-colors-primary'
              }
                `}
            />
            {formik.touched.confirm_password &&
              formik.errors.confirm_password && (
                <div className='text-red-500 text-sm'>
                  {formik.errors.confirm_password}
                </div>
              )}
          </div>
        </div>

        <button
          type='submit'
          disabled={formik.isSubmitting}
          className='w-full bg-primary text-white py-2 px-4 rounded-md hover:bg-primary/90'
        >
          {formik.isSubmitting ? 'Signing Up...' : 'Sign Up'}
        </button>

        <div className='flex items-center justify-start gap-2'>
          <p className='text-sm font-bold text-black'>
            Already have an account?{' '}
          </p>
          <Link href='/auth/login' className='text-primary text-sm ml-auto'>
            Login
          </Link>
        </div>

        {/* <div className='flex items-center justify-center gap-2'>
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
        </div> */}
      </form>
    </div>
  );
};
