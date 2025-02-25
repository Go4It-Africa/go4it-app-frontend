import type { Metadata } from 'next';
import './globals.css';
import NextAuthProvider from '@/app/providers/NextAuthProvider';
import { ClubProvider } from '@/app/context/ClubContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const metadata: Metadata = {
  title: {
    default: 'Go4it - Sports Management Technology',
    template: '%s | Go4it',
  },
  description: 'Sports Management Technology',
  keywords: [
    'sports management',
    'technology',
    'africa',
    'sports analytics',
    'sports age cheating',
  ],
  authors: [{ name: 'Go4it' }],
  viewport: 'width=device-width, initial-scale=1',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactElement;
}>) {
  return (
    <html lang='en' suppressHydrationWarning>
      <body className={`antialiased`} suppressHydrationWarning>
        <NextAuthProvider>
          <ClubProvider>{children}</ClubProvider>
        </NextAuthProvider>
        <ToastContainer
          position='top-right'
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme='light'
        />
      </body>
    </html>
  );
}
