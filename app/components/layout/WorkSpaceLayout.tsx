import React from 'react';
import { LogOut, Plus, Search } from 'lucide-react';
import { signOut } from 'next-auth/react';

const NoItems = ({ title }: { title?: string }) => {
  return (
    <div className='flex justify-center items-center h-full'>
      <p className='text-gray-600'>No {title} found</p>
    </div>
  );
};

type LayoutProps = {
  children?: React.ReactNode;
  title?: string;
  description?: string;
  buttonText?: string;
  buttonAction?: () => void;
  noItems?: boolean;
  page?: string;
};

export const Layout = ({
  children,
  title,
  description,
  buttonText,
  buttonAction,
  page,
  noItems = true,
}: LayoutProps) => {
  console.log('clubs', page);

  return (
    <div className='min-h-screen bg-gray-50 p-6'>
      <div className='max-w-6xl mx-auto'>
        <div className='flex justify-between items-center mb-8'>
          <div>
            <h1 className='text-2xl font-bold text-gray-900'>{title}</h1>
            <p className='text-gray-600 mt-1'>{description}</p>
          </div>
          <div className='flex items-center gap-2'>
            <button
              className='bg-primary text-white px-4 py-2 rounded-lg flex items-center gap-2'
              onClick={buttonAction}
            >
              <Plus size={20} />
              {buttonText}
            </button>

            <button
              className='bg-primary text-white px-4 py-2 rounded-lg flex items-center gap-2'
              onClick={() => signOut()}
            >
              <LogOut size={20} />
              Logout
            </button>
          </div>
        </div>

        {noItems && <NoItems title={page} />}

        {/* Search and Filters */}
        {!noItems && (
          <div>
            <div className='mb-6'>
              <div className='relative'>
                <Search
                  className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400'
                  size={20}
                />
                <input
                  type='text'
                  placeholder='Search clubs...'
                  className='w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary'
                />
              </div>
            </div>
            <div>{children}</div>
          </div>
        )}
      </div>
    </div>
  );
};

type WorkSpaceLayoutProps = {
  children: React.ReactNode;
};

const WorkSpaceLayout = ({ children }: WorkSpaceLayoutProps) => {
  return <div>{children}</div>;
};

export default WorkSpaceLayout;
