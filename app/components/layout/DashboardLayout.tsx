'use client';

import { ReactNode, useState, useEffect } from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { Menu, X, Home, Users, Calendar, Trophy, Settings } from 'lucide-react';
import Loader from '../Loader';
import { useClubStore } from '@/app/store/club';
import { useParams } from 'next/navigation';
import DashboardNavbarWithoutSidebar from '../navbars/navbar';
interface NavItem {
  label: string;
  href: string;
  icon: ReactNode;
  roles: string[];
}

const navItems: NavItem[] = [
  { label: 'Dashboard', href: '/dashboard', icon: <Home size={20} />, roles: ['club_admin', 'super_admin', 'tournament_organizer'] },
  { label: 'Players', href: '/players', icon: <Users size={20} />, roles: ['club_admin'] },
  { label: 'Tournaments', href: '/tournaments', icon: <Trophy size={20} />, roles: ['club_admin', 'tournament_organizer'] },
  { label: 'Calendar', href: '/calendar', icon: <Calendar size={20} />, roles: ['club_admin', 'tournament_organizer'] },
  { label: 'Settings', href: '/settings', icon: <Settings size={20} />, roles: ['club_admin', 'super_admin', 'tournament_organizer'] },
];

interface DashboardLayoutProps {
  children: ReactNode;
}

export const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { data: session } = useSession();
  const userRole = session?.user?.role;

  const { currentClub, viewClub } = useClubStore();
  const params = useParams(); 
  
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if(!currentClub) {
      const clubId = params.id;
      if(clubId) {
        viewClub(Number(clubId));
      }
    }
  }, [currentClub, viewClub, params]);

  if (!mounted) {
    return <Loader />;
  }

  const filteredNavItems = navItems.filter(item => 
    item.roles.includes(userRole as string)
  );

  return (
    <div className="min-h-screen bg-gray-50">

    {
      userRole === 'super_admin' && (
        <>
        {/* Sidebar */}
          <aside className={`
            fixed top-0 left-0 z-40 h-screen w-64 transition-transform 
            ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
            lg:translate-x-0 bg-white border-r border-gray-200
          `}>
          <div className="h-full flex flex-col">
            {/* Logo */}
            <div className="h-16 flex items-center px-6 border-b">
              <h1 className="text-xl font-bold text-primary">{currentClub?.name}</h1>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 py-6 space-y-1">
              {filteredNavItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`
                    flex items-center px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-100
                  `}
                >
                  {item.icon}
                  <span className="ml-3">{item.label}</span>
                </Link>
              ))}
            </nav>

            {/* User Profile */}
            <div className="border-t p-4">
              <div className="flex items-center">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {session?.user?.first_name} {session?.user?.last_name}
                  </p>
                  <p className="text-sm text-gray-500">
                    {session?.user?.email}
                  </p>
                </div>
                <button
                  onClick={async () => {
                    await signOut({ 
                      redirect: false,
                    });
                    // Force a hard redirect to login page, clearing navigation history
                    window.location.replace('/auth/login');
                  }}
                  className="text-sm text-red-600 hover:text-red-800"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <div className="lg:pl-64">
          {/* Top Navigation */}
          <header className="h-16 bg-white border-b flex items-center justify-between px-6">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden text-gray-600"
            >
              {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            
            {/* You can add additional header content here */}
          </header>

          {/* Page Content */}
          <main className="p-6">
            {children}
          </main>
        </div>
      </>
      )
    }

    <main className="p-6">
      <DashboardNavbarWithoutSidebar club={currentClub} />
      {children}
    </main>
      
    </div>
  );
};