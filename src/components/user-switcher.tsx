
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
  role: 'admin' | 'doctor' | 'patient';
  password?: string;
};

// In a real app, this would come from a database.
export const allUsers: User[] = [
  { id: 'admin-001', name: 'Admin', email: 'admin@simupatient.com', avatar: '', specialty: 'System Administration', role: 'admin', password: 'password123' },
  { id: 'doc-001', name: 'Dr. Evelyn Reed', email: 'e.reed@med.edu', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704d', specialty: 'Cardiology', medicalRecords: 'Specializes in interventional cardiology. Research focus on acute coronary syndromes.', role: 'doctor', password: 'password123' },
  { id: 'doc-002', name: 'Dr. Kenji Tanaka', email: 'k.tanaka@med.edu', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026705d', specialty: 'Neurology', medicalRecords: 'Focus on stroke and neurocritical care. Published papers on ischemic stroke management.', role: 'doctor', password: 'password123' },
  { id: 'doc-003', name: 'Dr. Aisha Khan', email: 'a.khan@med.edu', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026706d', specialty: 'Pediatrics', medicalRecords: 'Pediatric emergency medicine fellow. Interested in sepsis and respiratory distress in children.', role: 'doctor', password: 'password123' },
  { id: 'pat-001', name: 'John Smith', email: 'j.smith@email.com', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026707d', specialty: 'N/A', medicalRecords: 'History of hypertension.', role: 'patient', password: 'password123' },
];


type UserSwitcherProps = {
    onUserChange: (user: User | null) => void;
    currentUser: User;
};

export default function UserSwitcher({ onUserChange, currentUser }: UserSwitcherProps) {
  const router = useRouter();

  const handleUserSelect = (user: User) => {
    // In a real app, this would be a login flow.
    // For this mock, we'll just switch the user in localStorage and state.
    localStorage.setItem('user', JSON.stringify(user));
    onUserChange(user);
    window.location.reload(); // Reload to reflect changes across the app
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    onUserChange(null);
    router.push('/login');
  };
  
  if (!currentUser) {
      return null;
  }

  // Filter users that can be switched to. Admins can see all, doctors see other doctors.
  const switchableUsers = allUsers.filter(u => {
      if (currentUser.role === 'admin') return u.id !== currentUser.id;
      if (currentUser.role === 'doctor') return u.role === 'doctor' && u.id !== currentUser.id;
      return false; // Patients cannot switch users
  })

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="w-full justify-between group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:size-10 group-data-[collapsible=icon]:p-0"
        >
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              {currentUser.avatar ? <AvatarImage src={currentUser.avatar} alt={currentUser.name} /> : <AvatarImage src={undefined} />}
              <AvatarFallback>{currentUser.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="text-left group-data-[collapsible=icon]:hidden">
              <p className="font-medium text-sm">{currentUser.name}</p>
              <p className="text-xs text-muted-foreground capitalize">{currentUser.role}: {currentUser.specialty}</p>
            </div>
          </div>
          <ChevronsUpDown className="h-4 w-4 text-muted-foreground group-data-[collapsible=icon]:hidden" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-72" align="start">
        <DropdownMenuLabel>
            Logged in as {currentUser.name}
        </DropdownMenuLabel>
        {switchableUsers.length > 0 && <DropdownMenuSeparator />}
        {switchableUsers.map((user) => (
          <DropdownMenuItem key={user.id} onClick={() => handleUserSelect(user)}>
            <Avatar className="mr-2 h-8 w-8">
              {user.avatar ? <AvatarImage src={user.avatar} alt={user.name} /> : <AvatarImage src={undefined} />}
              <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="text-left">
              <p className="font-medium text-sm">{user.name}</p>
              <p className="text-xs text-muted-foreground capitalize">{user.role}: {user.specialty}</p>
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
