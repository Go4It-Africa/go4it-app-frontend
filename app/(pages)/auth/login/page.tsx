'use client';
import { LoginForm } from '@/app/components/forms/LoginForm';

// export const getServerSideProps: GetServerSideProps = async (context) => {
//   const session = await getSession(context);

//   if (session) {
//     return {
//       redirect: {
//         destination: '/dashboard',
//         permanent: false,
//       },
//     };
//   }

//   return {
//     props: {},
//   };
// };

export default function LoginPage() {
  return <LoginForm />;
}