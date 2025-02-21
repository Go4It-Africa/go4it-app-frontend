'use client'

import React from 'react';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeft, 
  Edit, 
  Trash2, 
  Download, 
  Mail, 
  Phone, 
  MapPin, 
  Flag,
  FileText,
  Calendar,
  User
} from 'lucide-react';
import Card from '@/app/components/ui/Card';
import Image from 'next/image';
import { Player } from '@/app/types';

const PlayerView = ({ player }: { player: Player }) => {
  const router = useRouter();

  const InfoItem = ({ icon: Icon, label, value }: { 
    icon: React.ElementType, 
    label: string, 
    value: string 
  }) => (
    <div className="flex items-start gap-3">
      <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
        <Icon className="w-4 h-4 text-primary" />
      </div>
      <div>
        <div className="text-sm text-gray-500">{label}</div>
        <div className="font-medium">{value}</div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft size={20} />
            Back to Players
          </button>

          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push(`/dashboard/player/${player.id}/edit`)}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              <Edit size={16} />
              Edit Player
            </button>
            <button
              className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100"
            >
              <Trash2 size={16} />
              Delete Player
            </button>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Basic Info */}
          <Card className="p-6">
            <div className="flex flex-col items-center text-center mb-6">
            <Image 
                src={player?.photo ?? '/api/placeholder/200/200'} 
                alt={`${player?.first_name} ${player?.last_name}`} 
                width={128} 
                height={128} 
                className="w-32 h-32 rounded-full object-cover mb-4"
                onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = '/api/placeholder/40/40';
                }}
            />

              <h1 className="text-2xl font-bold">{`${player?.first_name} ${player?.last_name}`}</h1>
              <div className="text-gray-500">{player?.club_name} • {player?.position}</div>
            </div>

            <div className="space-y-4">
              <InfoItem 
                icon={Calendar} 
                label="Date of Birth" 
                value={new Date(player?.date_of_birth ?? '').toLocaleDateString()} 
              />
              <InfoItem 
                icon={FileText} 
                label="Birth Certificate" 
                value={player?.birth_certificate_no ?? ''} 
              />
              <InfoItem 
                icon={Flag} 
                label="Nationality" 
                value={player?.nationality ?? ''} 
              />
              <InfoItem 
                icon={MapPin} 
                label="Country of Residence" 
                value={player?.country_of_residence ?? ''} 
              />
            </div>

            {player?.birth_certificate_file && (
              <a
                href={player?.birth_certificate_file ?? ''}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 flex items-center justify-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-lg hover:bg-primary/20"
              >
                <Download size={16} />
                Download Birth Certificate
              </a>
            )}
          </Card>

          {/* Middle Column - Contact Info */}
          <Card className="p-6">
            {/* <h2 className="text-lg font-bold mb-6">Contact Information</h2>
            <div className="space-y-4">
              <InfoItem 
                icon={Phone} 
                label="Phone Number" 
                value={player.phone} 
              />
              <InfoItem 
                icon={Mail} 
                label="Email Address" 
                value={player.email} 
              />
              <InfoItem 
                icon={MapPin} 
                label="Address" 
                value={player.address} 
              />
            </div> */}

            <div className="mt-8">
              <h2 className="text-lg font-bold mb-6">Guardian Information</h2>
              <div className="space-y-4">
                <InfoItem 
                  icon={User} 
                  label="Guardian Name" 
                  value={player?.guardian_name ?? ''} 
                />
                <InfoItem 
                  icon={Phone} 
                  label="Guardian Phone" 
                  value={player?.guardian_phone ?? ''} 
                />
                <InfoItem 
                  icon={Mail} 
                  label="Guardian Email" 
                  value={player?.guardian_email ?? ''} 
                />
              </div>
            </div>
          </Card>

          {/* Right Column - Additional Info & Stats */}
          <Card className="p-6">
            <h2 className="text-lg font-bold mb-6">Team Information</h2>
            <div className="space-y-4">
              <InfoItem 
                icon={Calendar} 
                label="Joined Date" 
                value={new Date(player?.joined_date ?? '').toLocaleDateString()} 
              />
              {/* Add more team-related info here */}
            </div>

            {/* 
              - Performance Stats
              - Recent Tournaments
              - Training Attendance
              - etc.
            */}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PlayerView;