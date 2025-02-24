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
});

export const LoginForm = () => {
  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: loginSchema,
    onSubmit: async (values) => {
      console.log('API_URL:', process.env.API_URL);

      const result = await signIn('credentials', {
        redirect: true,
        email: values.email,
        password: values.password,
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
    <form onSubmit={formik.handleSubmit} className='space-y-4'>
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
          <div className='text-red-500 text-sm'>{formik.errors.password}</div>
        )}
      </div>

      <button
        type='submit'
        className='w-full bg-primary text-white py-2 px-4 rounded-md hover:bg-primary/90'
      >
        Log In
      </button>

      <div className='flex items-center justify-start gap-2'>
        <p className='text-sm font-bold text-black'>
          Don&apos;t have an account?{' '}
        </p>
        <Link href='/auth/signup' className='text-primary text-sm ml-auto'>
          Create Account
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
  );
};
