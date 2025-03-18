import Image from "next/image";
import { UserDropdown } from '@/app/components/UserDropdown';
import { SeasonSelector } from '@/app/components/clubs/ClubSeasonSelector';
import { Club } from '@/app/types';
import { LayoutGrid } from 'lucide-react';

interface NavbarProps {
  club: Club | null;
}

const DashboardNavbarWithoutSidebar = ({ club }: NavbarProps) => {
  return (
    <div className='bg-white border-b'>
        <div className='max-w-7xl mx-auto px-6 py-4'>
          <div className='flex items-center justify-start'>
            <div className="flex items-center justify-start gap-3">
                <LayoutGrid className='w-6 h-6 text-gray-600' />
                <div className='flex items-center gap-4'>
                <Image
                    src={club?.logo as string}
                    alt={club?.name || 'Club logo'}
                    width={48}
                    height={48}
                    className='w-12 h-12 rounded-full'
                    onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = '/logos/logo.png';
                    }}
                />
                <div>
                    <h1 className='text-xl font-bold'>{club?.name}</h1>
                    <div className='flex items-center gap-2 text-sm text-gray-600'>
                    <span>{club?.sport}</span>
                    <span>•</span>
                    <span>{club?.country}</span>
                    </div>
                </div>
                </div>
            </div>
            

            <SeasonSelector />

            {/* { add a user profile icon with a dropdown menu to logout and user settings} */}
            <UserDropdown />
          </div>
        </div>
      </div>
  );
};

export default DashboardNavbarWithoutSidebar;