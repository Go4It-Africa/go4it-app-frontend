'use client';
import { SignupForm } from '@/app/components/forms/SignupForm';

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

export default function SignupPage() {
  return <SignupForm />;
}
