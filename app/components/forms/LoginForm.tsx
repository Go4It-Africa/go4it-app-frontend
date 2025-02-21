import { useFormik } from 'formik';
import { signIn } from 'next-auth/react';
import * as Yup from 'yup';

const loginSchema = Yup.object().shape({
    email: Yup.string().email('Must be a valid email').max(255).required('Email is required'),
    password: Yup.string().max(255).required('Password is required')
  })

export const LoginForm = () => {
  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: loginSchema,
    onSubmit: async (values) => {
 
      console.log('API_URL:', process.env.API_URL)

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
    <form onSubmit={formik.handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          Email
        </label>
        <input
          type="email"
          id="email"
          {...formik.getFieldProps('email')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
        />
        {formik.touched.email && formik.errors.email && (
          <div className="text-red-500 text-sm">{formik.errors.email}</div>
        )}
      </div>
      
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
          Password
        </label>
        <input
          type="password"
          id="password"
          {...formik.getFieldProps('password')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
        />
        {formik.touched.password && formik.errors.password && (
          <div className="text-red-500 text-sm">{formik.errors.password}</div>
        )}
      </div>

      <button
        type="submit"
        className="w-full bg-primary text-white py-2 px-4 rounded-md hover:bg-primary/90"
      >
        Log In
      </button>

      <div className="mt-4">
        <button
          type="button"
          onClick={() => signIn('google')}
          className="w-full border border-gray-300 py-2 px-4 rounded-md flex items-center justify-center"
        >
          Continue with Google
        </button>
      </div>
    </form>
  );
};