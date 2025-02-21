import type { Metadata } from "next";
import "./globals.css";
import NextAuthProvider from '@/app/providers/NextAuthProvider';
import { ClubProvider } from '@/app/context/ClubContext';
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
    <html lang="en" suppressHydrationWarning>
      <body
        className={`antialiased`}
        suppressHydrationWarning
      >
        <NextAuthProvider>
            <ClubProvider>
                {children}
            </ClubProvider>
        </NextAuthProvider>
      </body>
    </html>
  );
}
