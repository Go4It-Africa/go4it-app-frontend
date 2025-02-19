import React from 'react';
import { Plus, Search, Users, ArrowRight } from 'lucide-react';
import Card from '@/app/components/ui/Card';
import { clubs } from '@/app/mock_data/club';
import Image from 'next/image';

const NoItems = ({title}: {title?: string}) => {
    return (
        <div className="flex justify-center items-center h-full">
            <p className="text-gray-600">No {title} found</p>
        </div>
    )
}

type LayoutProps = {
    children?: React.ReactNode;
    title?: string;
    description?: string;
    buttonText?: string;
    buttonAction?: () => void;
    noItems?: boolean;
    item?: string;
}

const Layout = ({children, title, description, buttonText, buttonAction, noItems = true, item}: LayoutProps) => {
    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-6xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
                        <p className="text-gray-600 mt-1">{description}</p>
                    </div>
                        <button className="bg-primary text-white px-4 py-2 rounded-lg flex items-center gap-2" onClick={buttonAction}>
                            <Plus size={20} />
                            {buttonText}
                        </button>
                    </div>

                    {noItems && (
                        <NoItems title={item} />
                    )}

                    {/* Search and Filters */}
                    {!noItems && (
                        <div>
                            <div className="mb-6">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                                    <input
                                    type="text"
                                    placeholder="Search clubs..."
                                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary"
                                />
                            </div>
                        </div>
                        <div>
                            {children}
                        </div>
                    </div>
                    )}
            </div>
        </div>
    )
}

const WorkSpaceLayout = () => {

    if(!clubs.length) {
        return (
            <Layout
                title="Select Workspace" 
                description="Choose a club to manage or create a new one" 
                buttonText="Create New Club"
                item='clubs' 
                noItems
            />
        )
    }

  return (
    <Layout 
        title="Select Workspace" 
        description="Choose a club to manage or create a new one" 
        buttonText="Create New Club" 
        buttonAction={() => {}}
        
    >
    {
        clubs.map((club) => {
            if(!club) return null

            const {id, name, logo, sport, playerCount, country} = club

            return (
            <div key={id}>
            <Card key={id} className="hover:shadow-lg transition-shadow">
                <div className="p-6">
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

                    <button className="w-full bg-primary/10 text-primary font-medium py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-primary/20 transition-colors">
                    Open Dashboard
                    <ArrowRight size={16} />
                    </button>
                </div>
                </Card>
            </div>
        )
        })
    }
    </Layout>
  );
};

export default WorkSpaceLayout;