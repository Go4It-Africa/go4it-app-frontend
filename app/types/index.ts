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

export interface Team {
  id: number;
  team_name: string;
  name: string;
  logo: Blob | string | null;
  club_id: number;
  club_name: string;
  category: {
    id: number;
    name: string;
  } | string;
  gender: string;
  category_id: number;
  category_name: string;
  tournament_id: number;
  contact_person: string;
  contact_person_email: string;
  contact_person_phone: string;
  contact_person_address: string;
}

export interface Category {
  category_id: number;
  category_name: string;
  fee: number;
  gender: 'boys' | 'girls' | 'mixed';
  slots_available: number;
  created_at?: string;
  updated_at?: string;
}

export interface Tournament {
  id: number;
  tournament_name: string;
  organizer_name: string;
  organizer_email: string;
  organizer_phone: string;
  status?: 'upcoming' | 'ongoing' | 'completed' | 'cancelled' | 'postponed' | 'pending';
  registration_deadline: string;
  start_date: string;
  end_date: string;
  type_of_sport: 'football' | 'athletics' | 'rugby';
  type_of_tournament?: 'league' | 'cup' | 'tournament';
  type_of_participation?: 'girls' | 'boys' | 'mixed';
  participating_teams?: Team[];
  logo: Blob | string | null;
  website_url?: string;
  x_url?: string;
  facebook_url?: string;
  instagram_url?: string;
  youtube_url?: string;
  tiktok_url?: string;
  linkedin_url?: string;
  city: string;
  country: string;
  description?: string;
  max_teams_per_club: number;
  is_active?: boolean;
  total_teams_count: number;
  created_at?: string;
  categories: Category[];
  teams: Team[];
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
