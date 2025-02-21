'use client'

import React from 'react';
import Card from '@/app/components/ui/Card';
import { Users, Trophy, Calendar, Clock, ChevronDown, MoreHorizontal, FileText } from 'lucide-react';
import Image from 'next/image';

import { useClub } from "@/app/context/ClubContext";
// type ClubDashboardProps = { 
//   params: { id: string };
// }


const ClubDashboard = () => {
  
  const { club } = useClub();

  console.log('the club in dashboard', club)

  if(!club) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Image src={club?.logo} alt={club?.name} width={48} height={48} className="w-12 h-12 rounded-full" />
              <div>
                <h1 className="text-xl font-bold">{club?.name}</h1>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span>{club?.sport}</span>
                  <span>•</span>
                  <span>{club?.country}</span>
                </div>
              </div>
            </div>
            
            <button className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
              <span>2023/2024 Season</span>
              <ChevronDown size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <div>
                <div className="text-sm text-gray-600">Total Players</div>
                <div className="text-2xl font-bold">{club?.playerCount}</div>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center">
                <Trophy className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <div className="text-sm text-gray-600">Active Tournaments</div>
                <div className="text-2xl font-bold">3</div>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center">
                <Calendar className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <div className="text-sm text-gray-600">Upcoming Matches</div>
                <div className="text-2xl font-bold">5</div>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-yellow-50 rounded-full flex items-center justify-center">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
              <div>
                <div className="text-sm text-gray-600">Training Hours</div>
                <div className="text-2xl font-bold">24.5</div>
              </div>
            </div>
          </Card>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Activity */}
          <Card className="lg:col-span-2">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold">Recent Activity</h2>
                <button className="text-gray-400 hover:text-gray-600">
                  <MoreHorizontal className="w-5 h-5" />
                </button>
              </div>
              
              <div className="space-y-4">
                {/* Activity Items */}
                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <Trophy className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium">Tournament Registration</div>
                    <div className="text-sm text-gray-600">
                      Registered for East Africa Youth Cup 2024
                    </div>
                  </div>
                  <div className="text-sm text-gray-500">2h ago</div>
                </div>

                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                  <div className="w-10 h-10 bg-green-50 rounded-full flex items-center justify-center">
                    <Users className="w-5 h-5 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium">New Player Added</div>
                    <div className="text-sm text-gray-600">
                      John Doe joined the U-17 team
                    </div>
                  </div>
                  <div className="text-sm text-gray-500">5h ago</div>
                </div>
              </div>
            </div>
          </Card>

          {/* Quick Actions */}
          <Card>
            <div className="p-6">
              <h2 className="text-lg font-bold mb-6">Quick Actions</h2>
              <div className="space-y-3">
                <button className="w-full bg-primary text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2">
                  <Users size={20} />
                  Add New Player
                </button>
                <button className="w-full bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-50">
                  <Trophy size={20} />
                  View Tournaments
                </button>
                <button className="w-full bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-50">
                  <FileText size={20} />
                  Generate Report
                </button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ClubDashboard;