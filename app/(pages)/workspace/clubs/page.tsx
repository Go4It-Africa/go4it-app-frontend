'use client';

import { clubs } from "@/app/mock_data/club";
import { Layout } from "@/app/components/layout/WorkSpaceLayout";
import Card from "@/app/components/ui/Card";
import { Users, ArrowRight } from "lucide-react";
import Image from 'next/image';

export default function ClubsWorkspacePage() {

  if(!clubs.length) {
    return (
        <Layout
            title="Select Workspace" 
            description="Choose a club to manage or create a new one" 
            buttonText="Create New Club"
            page='clubs'
        />
    )
}

console.log('the clubs', clubs)

return (
    <Layout 
        title="Select Workspace" 
        description="Choose a club to manage or create a new one" 
        buttonText="Create New Club"
        noItems={false}
        buttonAction={() => {}}
        
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {
        clubs.map((club) => {
            if(!club) return null
            const {id, name, logo, sport, playerCount, country} = club
            return (
              <div key={id} className="h-full">
                <Card key={id} className="hover:shadow-lg transition-shadow h-full">
                  <div className="p-6 h-full flex flex-col">
                    <div className="flex items-center gap-4 mb-4">
                      <Image src={logo} alt={name} width={64} height={64} className="w-16 h-16 rounded-full object-cover" />
                      <div>
                        <h3 className="font-bold text-lg">{name}</h3>
                        <p className="text-gray-600 capitalize">{sport}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4 mb-4">
                      <div className="flex items-center gap-2">
                        <Users size={16} className="text-gray-400" />
                        <span className="text-sm text-gray-600">{playerCount} Players</span>
                      </div>
                      <div className="text-sm text-gray-600">{country}</div>
                    </div>
            
                    <button className="mt-auto w-full bg-primary/10 text-primary font-medium py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-primary/20 transition-colors">
                      Open Dashboard
                      <ArrowRight size={16} />
                    </button>
                  </div>
                </Card>
              </div>
            )
        })
      }
    </div>
    </Layout>
);
}