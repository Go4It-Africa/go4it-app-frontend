import { ReactNode } from 'react';
import Image from 'next/image';
interface AuthLayoutProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
}

export const AuthLayout = ({ children, title, subtitle }: AuthLayoutProps) => {
  return (
    <div className="min-h-screen flex">
    {/* Left side - Image/Brand */}
      <div className="hidden lg:block lg:w-1/2 bg-primary">
        <div className="h-full flex flex-col items-center justify-center p-12 text-white">
          <h2 className="text-4xl font-bold mb-4">
            <Image src="/logos/logo.png" alt="Go4IT" width={350} height={350} />
            </h2>
          {/* You can add more branding elements or images here */}
        </div>
      </div>
      {/* Right side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{title}</h1>
            {subtitle && (
              <p className="text-gray-600">{subtitle}</p>
            )}
          </div>
          {children}
        </div>
      </div>
    </div>
  );
};