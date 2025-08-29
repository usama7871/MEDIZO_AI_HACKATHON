'use client';

import { useState } from 'react';
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
import { ChevronsUpDown } from 'lucide-react';

export type User = {
  id: string;
  name: string;
  email: string;
  avatar: string;
  specialty: string;
};

const users: User[] = [
  { id: 'user-001', name: 'Dr. Evelyn Reed', email: 'e.reed@med.edu', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704d', specialty: 'Cardiology' },
  { id: 'user-002', name: 'Dr. Kenji Tanaka', email: 'k.tanaka@med.edu', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026705d', specialty: 'Neurology' },
  { id: 'user-003', name: 'Dr. Aisha Khan', email: 'a.khan@med.edu', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026706d', specialty: 'Pediatrics' },
];

type UserSwitcherProps = {
    onUserChange: (user: User | null) => void;
};

export default function UserSwitcher({ onUserChange }: UserSwitcherProps) {
  const [selectedUser, setSelectedUser] = useState<User>(users[0]);

  const handleUserSelect = (user: User) => {
    setSelectedUser(user);
    onUserChange(user);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="w-full justify-between group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:size-10 group-data-[collapsible=icon]:p-0"
        >
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src={selectedUser.avatar} alt={selectedUser.name} />
              <AvatarFallback>{selectedUser.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="text-left group-data-[collapsible=icon]:hidden">
              <p className="font-medium text-sm">{selectedUser.name}</p>
              <p className="text-xs text-muted-foreground">{selectedUser.email}</p>
            </div>
          </div>
          <ChevronsUpDown className="h-4 w-4 text-muted-foreground group-data-[collapsible=icon]:hidden" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="start">
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
              <p className="text-xs text-muted-foreground">{user.email}</p>
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
