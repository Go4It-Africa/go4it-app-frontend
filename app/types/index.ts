export interface User {
    id: number;
    email: string;
    role: 'club_admin' | 'super_admin' | 'tournament_organizer';
    name: string;
  }
  
  export interface Club {
    name: string;
    user_id: number;
    logo?: string | null;
    country: string;
    city?: string;
    website_url?: string;
    twitter_url?: string;
    facebook_url?: string;
    instagram_url?: string;
    youtube_url?: string;
    tiktok_url?: string;
    role: 'football' | 'athletics' | 'rugby';
  }