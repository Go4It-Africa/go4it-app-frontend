"use client";
import { createContext, useContext, useState, ReactNode } from "react";

type Club = { 
    name: string; 
    id: number;
    logo: string;
    sport: string;
    playerCount: number;
    country: string;
    user_id?: number;
 };
type ClubContextType = { 
    club: Club | null; setClub: (club: Club) => void
 };

const ClubContext = createContext<ClubContextType | undefined>(undefined);

export function ClubProvider({ children }: { children: ReactNode }) {
  const [club, setClub] = useState<Club | null>(null);

  return (
    <ClubContext.Provider value={{ club, setClub }}>
      {children}
    </ClubContext.Provider>
  );
}

export function useClub() {
  const context = useContext(ClubContext);
  if (!context) {
    throw new Error("useClub must be used within a ClubProvider");
  }
  return context;
}
