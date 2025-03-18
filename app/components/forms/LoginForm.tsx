'use client';
import { useFormik } from 'formik';
import { signIn, useSession } from 'next-auth/react';
import Link from 'next/link';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

const loginSchema = Yup.object().shape({
  email: Yup.string()
    .email('Must be a valid email')
    .max(255)
    .required('Email is required'),
  password: Yup.string().max(255).required('Password is required'),
});

export const LoginForm = () => {
  const { data: session } = useSession();
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const [callbackUrl, setCallbackUrl] = useState('');

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    const callback = searchParams.get('callbackUrl');
    setCallbackUrl(callback || '');
  }, [searchParams]);

  useEffect(() => {
    if (!isMounted || !session?.user) return;
    
    const role = session.user.role;
    let redirectPath = '/';

    if (role === 'club_admin') {
      redirectPath = '/workspace/clubs';
    } else if (role === 'tournament_organizer') {
      redirectPath = '/workspace/tournaments';
    } else if (role === 'super_admin') {
      redirectPath = '/dashboard';
    }

    const destination = callbackUrl || redirectPath;
    router.push(destination);
  }, [session, router, isMounted, callbackUrl]);

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: loginSchema,
    onSubmit: async (values) => {
      try {
        const result = await signIn('credentials', {
          redirect: false,
          email: values.email,
          password: values.password,
          callbackUrl: callbackUrl || undefined,
        });

        if (result?.ok) {
          toast.success('Login successful');
        }

        if (result?.error) {
          toast.error(result.error);
        }
      } catch (error) {
        toast.error('An error occurred during login');
        console.error('Login error:', error);
      }
    },
  });

  // const handleGoogleSignIn = () => {
  //   signIn('google', { 
  //     callbackUrl: callbackUrl || undefined,
  //     redirect: true
  //   });
  // };

  return (
    <div>
      <div className='text-2xl font-bold mb-4'>Login</div>
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

        {/* TODO: Add remember me and forgot password */}
        {/* <div className='flex items-center justify-between'>
        <div className='flex items-center gap-2'>
          <input type='checkbox' id='rememberMe' />
          <label htmlFor='rememberMe' className='text-sm text-gray-500'>
            Remember me
          </label>
        </div>

        <Link href='/auth/forgot-password' className='text-primary text-sm'>
          Forgot Password?
        </Link>
      </div> */}

        <button
          type='submit'
          className='w-full bg-primary text-white py-2 px-4 rounded-md hover:bg-primary/90'
          disabled={formik.isSubmitting}
        >
          {formik.isSubmitting ? 'Logging In...' : 'Log In'}
        </button>

        <div className='flex items-center justify-start gap-2'>
          <p className='text-sm font-bold text-black'>
            Don&apos;t have an account?{' '}
          </p>
          <Link href='/auth/signup' className='text-primary text-sm ml-auto'>
            Create Account
          </Link>
        </div>
        {/*
        <div className='flex items-center justify-center gap-2'>
          <div className='w-full border-t border-gray-300'></div>
          <p className='text-sm font-bold text-black'>OR</p>
          <div className='w-full border-t border-gray-300'></div>
        </div>

         <div className='mt-4'>
          <button
            type='button'
            onClick={handleGoogleSignIn}
            className='w-full border border-gray-300 py-2 px-4 rounded-md flex items-center justify-center'
          >
            Continue with Google
          </button>
        </div> */}
      </form>
    </div>
  );
};
