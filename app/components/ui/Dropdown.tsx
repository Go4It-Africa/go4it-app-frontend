import React, { useState, useRef, useEffect, ReactNode } from 'react';
import Card from '@/app/components/ui/Card';
import { ChevronDown } from 'lucide-react';

interface DropdownProps {
  trigger?: ReactNode;
  triggerClassName?: string;
  children: ReactNode;
  align?: 'left' | 'right';
  className?: string;
  showArrow?: boolean;
}

export const Dropdown = ({
  trigger,
  triggerClassName = '',
  children,
  align = 'left',
  className = '',
  showArrow = true,
}: DropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 ${triggerClassName}`}
      >
        {trigger}
        {showArrow && (
          <ChevronDown 
            className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} 
          />
        )}
      </button>

      {isOpen && (
        <Card 
          className={`
            absolute z-50 mt-2 shadow-lg animate-in fade-in-0 zoom-in-95
            ${align === 'right' ? 'right-0' : 'left-0'}
            ${className}
          `}
        >
          {children}
        </Card>
      )}
    </div>
  );
};

// Dropdown Item Component
interface DropdownItemProps {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
  icon?: ReactNode;
  danger?: boolean;
}

export const DropdownItem = ({
  children,
  onClick,
  className = '',
  icon,
  danger = false,
}: DropdownItemProps) => (
  <button
    onClick={onClick}
    className={`
      w-full px-4 py-2 text-left flex items-center gap-2 
      hover:bg-gray-100 transition-colors
      ${danger ? 'text-red-600 hover:bg-red-50' : ''}
      ${className}
    `}
  >
    {icon}
    {children}
  </button>
);

// Dropdown Section Component
interface DropdownSectionProps {
  children: ReactNode;
  className?: string;
}

export const DropdownSection = ({
  children,
  className = '',
}: DropdownSectionProps) => (
  <div className={`py-1 ${className}`}>
    {children}
  </div>
);

// Dropdown Divider Component
export const DropdownDivider = () => (
  <div className="my-1 border-t border-gray-200" />
);