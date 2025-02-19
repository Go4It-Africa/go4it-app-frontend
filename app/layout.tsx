import type { Metadata } from "next";
import "./globals.css";
import ProviderWrapper from './ProviderWrapper';

export const metadata: Metadata = {
  title: 'Go4It Tournaments - Manage your tournaments',
  description: '',
  keywords: '',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactElement;
}>) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <body
        className={`antialiased`}
      >
        <ProviderWrapper>{children}</ProviderWrapper>
      </body>
    </html>
  );
}
