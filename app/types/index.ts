export interface User {
  id: number;
  email: string;
  role: 'club_admin' | 'super_admin' | 'tournament_organizer';
  name: string;
}

export interface Club {
  id?: number;
  name: string;
  user_id?: number;
  logo?: Blob | string | null;
  country: string;
  city?: string;
  website_url?: string;
  twitter_url?: string;
  facebook_url?: string;
  instagram_url?: string;
  youtube_url?: string;
  tiktok_url?: string;
  sport: 'football' | 'athletics' | 'rugby';
  playerCount?: number;
}

export interface Tournament {
  id: string;
  name: string;
  status: 'upcoming' | 'ongoing' | 'completed';
  startDate: string;
  sport: 'football' | 'athletics' | 'rugby';
  participantCount: number;
}

export interface Player {
  id: number;
  first_name: string;
  last_name: string;
  date_of_birth: string;
  photo: Blob | string | null;
  birth_certificate_no?: string;
  birth_certificate_file?: Blob | string | null;
  country_of_residence?: string;
  city_of_residence?: string;
  nationality?: string;
  height?: number | string;
  weight?: number | string;
  position: string;
  category: string;
  name?: string;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
  club_id?: number | string;
  club_name?: string;
  season_id?: number;
  season_name?: string;
  tournament_id?: number;
  tournament_name?: string;
  guardian_name?: string;
  guardian_phone?: string;
  guardian_email?: string;
  address?: string;
  phone?: string;
  email?: string;
  joined_date?: string;
  is_verified?: boolean;
  gender?: string;
  type_of_sport?: string;
  start_date?: string;
  guardian_first_name?: string;
  guardian_last_name?: string;
}
