'use client';

import { useState, useEffect } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ChevronsUpDown, LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';

export type User = {
  id: string;
  name: string;
  email: string;
  avatar: string;
  specialty: string;
  medicalRecords?: string;
};

const users: User[] = [
  { id: 'admin', name: 'Admin', email: 'admin@simupatient.com', avatar: '', specialty: 'System Administration' },
  { id: 'user-001', name: 'Dr. Evelyn Reed', email: 'e.reed@med.edu', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704d', specialty: 'Cardiology', medicalRecords: 'Specializes in interventional cardiology. Research focus on acute coronary syndromes.' },
  { id: 'user-002', name: 'Dr. Kenji Tanaka', email: 'k.tanaka@med.edu', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026705d', specialty: 'Neurology', medicalRecords: 'Focus on stroke and neurocritical care. Published papers on ischemic stroke management.' },
  { id: 'user-003', name: 'Dr. Aisha Khan', email: 'a.khan@med.edu', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026706d', specialty: 'Pediatrics', medicalRecords: 'Pediatric emergency medicine fellow. Interested in sepsis and respiratory distress in children.' },
];

type UserSwitcherProps = {
    onUserChange: (user: User | null) => void;
    currentUser: User | null;
};

export default function UserSwitcher({ onUserChange, currentUser }: UserSwitcherProps) {
  const router = useRouter();

  useEffect(() => {
    // Set initial user on mount
    if (!currentUser) {
        const initialUser = users[1]; // Default to Dr. Reed
        onUserChange(initialUser);
    }
  }, [currentUser, onUserChange]);


  const handleUserSelect = (user: User) => {
    onUserChange(user);
    // In a real app, you might update a global state or make an API call
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    router.push('/login');
  };

  if (!currentUser) {
      return null;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="w-full justify-between group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:size-10 group-data-[collapsible=icon]:p-0"
        >
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src={currentUser.avatar} alt={currentUser.name} />
              <AvatarFallback>{currentUser.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="text-left group-data-[collapsible=icon]:hidden">
              <p className="font-medium text-sm">{currentUser.name}</p>
              <p className="text-xs text-muted-foreground">{currentUser.email}</p>
            </div>
          </div>
          <ChevronsUpDown className="h-4 w-4 text-muted-foreground group-data-[collapsible=icon]:hidden" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-64" align="start">
        <DropdownMenuLabel>Switch User</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {users.map((user) => (
          <DropdownMenuItem key={user.id} onClick={() => handleUserSelect(user)}>
            <Avatar className="mr-2 h-8 w-8">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="text-left">
              <p className="font-medium text-sm">{user.name}</p>
              <p className="text-xs text-muted-foreground">{user.specialty}</p>
            </div>
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
