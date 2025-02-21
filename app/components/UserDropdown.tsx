import React from 'react';
import { useRouter } from 'next/navigation';
import { signOut } from 'next-auth/react';
import { User, Settings, LogOut } from 'lucide-react';
import { Dropdown, DropdownItem, DropdownSection, DropdownDivider } from '@/app/components/ui/Dropdown';
import { useSession } from 'next-auth/react';
import Image from 'next/image';

export const UserDropdown = () => {
  const router = useRouter();
  const { data: session } = useSession();

  const handleLogout = async () => {
    await signOut({ callbackUrl: '/auth/login' });
  };

  const UserTrigger = (
    <div className="flex items-center gap-2">
      <Image src={'/api/placeholder/32/32'} alt={session?.user?.name || 'User'} width={32} height={32} className="w-8 h-8 rounded-full" />

      <div className="hidden md:block text-left">
        <div className="font-medium">{session?.user?.name}</div>
      </div>
    </div>
  );

  return (
    <Dropdown 
      trigger={UserTrigger}
      align="right"
      triggerClassName="hover:bg-gray-100 p-2 rounded-lg transition-colors"
      className="w-64"
    >
      <DropdownSection>
        <div className="px-4 py-2 border-b">
          <div className="font-medium">{session?.user?.name}</div>
          <div className="text-sm text-gray-500">{session?.user?.email}</div>
        </div>
      </DropdownSection>

      <DropdownSection>
        <DropdownItem
          icon={<User size={16} />}
          onClick={() => router.push('/profile')}
        >
          Profile
        </DropdownItem>
        
        <DropdownItem
          icon={<Settings size={16} />}
          onClick={() => router.push('/settings')}
        >
          Settings
        </DropdownItem>
      </DropdownSection>

      <DropdownDivider />

      <DropdownSection>
        <DropdownItem
          icon={<LogOut size={16} />}
          onClick={handleLogout}
          danger
        >
          Logout
        </DropdownItem>
      </DropdownSection>
    </Dropdown>
  );
};