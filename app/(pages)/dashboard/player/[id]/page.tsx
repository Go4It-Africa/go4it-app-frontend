'use client';

import React, { useEffect } from 'react';
import { useParams } from 'next/navigation';
import {
  MapPin,
  Flag,
  User,
  CheckCircle,
  Clock,
  ArrowLeft,
} from 'lucide-react';
//import Card from '@/app/components/ui/Card';
import Image from 'next/image';
import { usePlayerStore } from '@/app/store/player';
import { DateTime } from 'luxon';
import { capitalize } from '@/app/utils/capitalize';
import { mapCountryCode } from '@/app/utils/mapCountryCode';
import Link from 'next/link';

const PlayerView = () => {

  const params = useParams(); 
  const id = params.id;

  const { currentPlayer, viewPlayer } = usePlayerStore();

  useEffect(() => {
    viewPlayer(Number(id));
  }, [id, viewPlayer]);

  const player = currentPlayer;

  if (!player) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-lg">Loading player profile...</p>
        
      </div>
    );
  }

  console.log(player);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header with Player Name */}
      <div className="bg-primary text-white pt-12 pb-6 px-4 relative">
        <div className="max-w-3xl">
          <Link href={`/dashboard/club/${player.club_id}`}>
            <button className="absolute top-4 left-4 text-white hover:text-gray-300">
              <ArrowLeft className="h-5 w-5" />
            </button>
          </Link>
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl font-bold">{`${player.first_name} ${player.last_name}`}</h1>
            {player.is_verified ? (
              <CheckCircle className="h-5 w-5 text-green-400" />
            ) : (
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-amber-400" />
                <p className="text-sm text-white">Pending Verification</p>
              </div>
            )}
          </div>
          <p className="text-gray-400">{`${player.position} • ${player.type_of_sport ?? 'Football'}`}</p>
        </div>
      </div>

      {/* Main Content */}
      {/* <main className="max-w-3xl mx-auto px-4 py-6"> */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Column 1: Photo and Personal Info */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="relative bg-indigo-100 pt-4 pb-20">
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2">
                  <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-white">
                    {player.photo ? (
                      <Image 
                        src={player.photo as string} 
                        alt={`${player.first_name} ${player.last_name}`} 
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-300 flex items-center justify-center">
                        <User size={48} className="text-gray-400" />
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="pt-20 px-4 pb-6">
                <h2 className="text-lg font-semibold text-center mb-6">Personal Information</h2>
                
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-500">Player Name:</p>
                    <p className="font-medium">{`${player.first_name} ${player.last_name}`}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-500">Birth Date:</p>
                    <p className="font-medium">{DateTime.fromISO(player.date_of_birth).toLocaleString(DateTime.DATE_MED)}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-500">Age:</p>
                    <p className="font-medium">
                      {Math.floor(DateTime.now().diff(DateTime.fromISO(player.date_of_birth), 'years').years) + ' years'}
                    </p>
                  </div>
                  
                  {player.height && (
                    <div>
                      <p className="text-sm text-gray-500">Height(cm):</p>
                      <p className="font-medium">{player.height}</p>
                    </div>
                  )}
                  
                  {player.weight && (
                    <div>
                      <p className="text-sm text-gray-500">Weight:</p>
                      <p className="font-medium">{player.weight}</p>
                    </div>
                  )}
                  
                  <div>
                    <p className="text-sm text-gray-500">Gender:</p>
                    <p className="font-medium">{capitalize(player.gender ?? '')}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-500">Birth Certificate Number:</p>
                    <p className="font-medium">{player.birth_certificate_no}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-500">Category:</p>
                    <p className="font-medium">{player.name}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Column 2-3: Stats and Details */}
          <div className="md:col-span-2">
            {/* Verification Status */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Verification Status</h2>
                <div className="flex items-center">
                  {player.is_verified ? (
                    <>
                      <span className="mr-2 text-green-600 font-medium">Verified</span>
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    </>
                  ) : (
                    <>
                      <span className="mr-2 text-amber-600 font-medium">Pending Verification</span>
                      <Clock className="h-5 w-5 text-amber-600" />
                    </>
                  )}
                </div>
              </div>
            </div>
            
            {/* Stats Overview */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              <div className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center justify-center">
                <div className="text-2xl font-bold text-indigo-600 mb-2">
                  {player.name}
                </div>
                <p className="text-sm text-gray-500">Category</p>
              </div>
              
              <div className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center justify-center">
                <div className="text-2xl font-bold text-indigo-600 mb-2">
                  {player.position}
                </div>
                <p className="text-sm text-gray-500">Position</p>
              </div>
              
              {player.start_date && (
                <div className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center justify-center">
                  <div className="text-2xl font-bold text-indigo-600 mb-2">
                    {DateTime.fromISO(player.start_date).toLocaleString(DateTime.DATE_MED)}
                  </div>
                  <p className="text-sm text-gray-500">Joined Date</p>
                </div>
              )}
            </div>
            
            {/* Location Information */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-lg font-semibold mb-4">Location Information</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <div className="flex items-center mb-2">
                    <MapPin className="h-5 w-5 text-gray-400 mr-2" />
                    <p className="text-sm text-gray-500">Country of Residence:</p>
                  </div>
                  <p className="font-medium">{mapCountryCode(player.country_of_residence ?? '')}</p>
                </div>
                <div>
                  <div className="flex items-center mb-2">
                    <Flag className="h-5 w-5 text-gray-400 mr-2" />
                    <p className="text-sm text-gray-500">Nationality:</p>
                  </div>
                  <p className="font-medium">{mapCountryCode(player.nationality ?? '')}</p>
                </div>
              </div>
            </div>
            
            {/* Sport Information */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-semibold mb-4">Sport Information</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Sport Type:</p>
                  <p className="font-medium">{player.type_of_sport ?? 'Football'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Team Role:</p>
                  <p className="font-medium">{player.position}</p>
                </div>
              </div>
            </div>

            {/* Guardian Information */}
            <div className="bg-white rounded-lg shadow-md mt-6 p-6">
              <h2 className="text-lg font-semibold mb-4">Guardian Information</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Name:</p>
                  <p className="font-medium">{player.guardian_first_name} {player.guardian_last_name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Phone Number:</p>
                  <p className="font-medium">{player.guardian_phone}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      {/* </main> */}
    </div>
  );



  // const router = useRouter();

  // const InfoItem = ({
  //   icon: Icon,
  //   label,
  //   value,
  // }: {
  //   icon: React.ElementType;
  //   label: string;
  //   value: string;
  // }) => (
  //   <div className='flex items-start gap-3'>
  //     <div className='w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center'>
  //       <Icon className='w-4 h-4 text-primary' />
  //     </div>
  //     <div>
  //       <div className='text-sm text-gray-500'>{label}</div>
  //       <div className='font-medium'>{value}</div>
  //     </div>
  //   </div>
  // );

  // return (
  //   <div className='min-h-screen bg-gray-50 p-6'>
  //     <div className='max-w-7xl mx-auto'>
  //       <div className='flex items-center justify-between mb-6'>
  //         <button
  //           onClick={() => router.back()}
  //           className='flex items-center gap-2 text-gray-600 hover:text-gray-900'
  //         >
  //           <ArrowLeft size={20} />
  //           Back to Players
  //         </button>

  //         <div className='flex items-center gap-3'>
  //           <button
  //             onClick={() => router.push(`/dashboard/player/${player.id}/edit`)}
  //             className='flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50'
  //           >
  //             <Edit size={16} />
  //             Edit Player
  //           </button>
  //           <button className='flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100'>
  //             <Trash2 size={16} />
  //             Delete Player
  //           </button>
  //         </div>
  //       </div>
  //       <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
  //         {/* Left Column - Basic Info */}
  //         <Card className='p-6'>
  //           <div className='flex flex-col items-center text-center mb-6'>
  //             <Image
  //               src={player?.photo ?? '/images/user.png'}
  //               alt={`${player?.first_name} ${player?.last_name}`}
  //               width={128}
  //               height={128}
  //               className='w-32 h-32 rounded-full object-cover mb-4'
  //               onError={(e) => {
  //                 const target = e.target as HTMLImageElement;
  //                 target.src = '/images/user.png';
  //               }}
  //             />

  //             <h1 className='text-2xl font-bold'>{`${player?.first_name} ${player?.last_name}`}</h1>
  //             <div className='text-gray-500'>
  //               {player?.club_name} • {player?.position}
  //             </div>
  //           </div>

  //           <div className='space-y-4'>
  //             <InfoItem
  //               icon={Calendar}
  //               label='Date of Birth'
  //               value={new Date(
  //                 player?.date_of_birth ?? ''
  //               ).toLocaleDateString()}
  //             />
  //             <InfoItem
  //               icon={FileText}
  //               label='Birth Certificate'
  //               value={player?.birth_certificate_no ?? ''}
  //             />
  //             <InfoItem
  //               icon={Flag}
  //               label='Nationality'
  //               value={player?.nationality ?? ''}
  //             />
  //             <InfoItem
  //               icon={MapPin}
  //               label='Country of Residence'
  //               value={player?.country_of_residence ?? ''}
  //             />
  //           </div>

  //           {player?.birth_certificate_file && (
  //             <a
  //               href={player?.birth_certificate_file ?? ''}
  //               target='_blank'
  //               rel='noopener noreferrer'
  //               className='mt-6 flex items-center justify-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-lg hover:bg-primary/20'
  //             >
  //               <Download size={16} />
  //               Download Birth Certificate
  //             </a>
  //           )}
  //         </Card>

  //         <Card className='p-6'>
  //           <div className='mt-8'>
  //             <h2 className='text-lg font-bold mb-6'>Guardian Information</h2>
  //             <div className='space-y-4'>
  //               <InfoItem
  //                 icon={User}
  //                 label='Guardian Name'
  //                 value={player?.guardian_name ?? ''}
  //               />
  //               <InfoItem
  //                 icon={Phone}
  //                 label='Guardian Phone'
  //                 value={player?.guardian_phone ?? ''}
  //               />
  //               <InfoItem
  //                 icon={Mail}
  //                 label='Guardian Email'
  //                 value={player?.guardian_email ?? ''}
  //               />
  //             </div>
  //           </div>
  //         </Card>

  //         {/* Right Column - Additional Info & Stats */}
  //         <Card className='p-6'>
  //           <h2 className='text-lg font-bold mb-6'>Team Information</h2>
  //           <div className='space-y-4'>
  //             <InfoItem
  //               icon={Calendar}
  //               label='Joined Date'
  //               value={new Date(player?.joined_date ?? '').toLocaleDateString()}
  //             />
  //           </div>
  //         </Card>
  //       </div>
  //     </div>
  //   </div>
  // );
};

export default PlayerView;
