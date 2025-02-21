'use client'

import { Dropdown, DropdownItem, DropdownSection } from "@/app/components/ui/Dropdown";
import { useState } from "react";

// Season Selector using the reusable dropdown
export const SeasonSelector = () => {
    const seasons = ['2023/2024', '2022/2023', '2021/2022'];
    const [selectedSeason, setSelectedSeason] = useState(seasons[0]);
  
    return (
      <Dropdown
        trigger={<span>{selectedSeason} Season</span>}
        align="right"
        className="w-48"
      >
        <DropdownSection>
          {seasons.map((season) => (
            <DropdownItem
              key={season}
              onClick={() => setSelectedSeason(season)}
              className={selectedSeason === season ? 'bg-gray-100' : ''}
            >
              {season}
            </DropdownItem>
          ))}
        </DropdownSection>
      </Dropdown>
    );
  };