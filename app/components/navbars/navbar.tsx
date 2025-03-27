import Image from "next/image";
import { UserDropdown } from '@/app/components/UserDropdown';
import { SeasonSelector } from '@/app/components/clubs/ClubSeasonSelector';
import { Club } from '@/app/types';
import { LayoutGrid } from 'lucide-react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
interface NavbarProps {
  club: Club | null;
}

const DashboardNavbarWithoutSidebar = ({ club }: NavbarProps) => {
  const {data: session} = useSession();

  const user = session?.user.role;

  //const isSuperAdmin = user === 'super_admin';
  const isTournamentOrganizer = user === 'tournament_organizer';
  const isClubAdmin = user === 'club_admin';

  const url = isTournamentOrganizer ? '/workspace/tournaments' : isClubAdmin ? '/workspace/clubs' : '/auth/signin';

  const clubLogoUrl = club?.logo ? `${process.env.NEXT_PUBLIC_DIGITAL_OCEAN_SPACES_CDN_ENDPOINT}/${club.logo}` : '/logos/logo.png';

  return (
    <div className='bg-white border-b'>
        <div className='max-w-8xl mx-auto px-6 py-4'>
          <div className='flex items-center justify-start'>
            <div className="flex items-center justify-start gap-3">
                <Link href={url}>
                  <LayoutGrid className='w-6 h-6 text-gray-600' />
                </Link>
                <div className='flex items-center gap-4'>
                <Image
                    src={clubLogoUrl}
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
            
            <div className="flex items-center gap-2 ml-auto">
              <SeasonSelector />
              <UserDropdown />
            </div>

          </div>
        </div>
      </div>
  );
};

export default DashboardNavbarWithoutSidebar;