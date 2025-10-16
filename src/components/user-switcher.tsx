
'use client';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { useUserStore } from '@/hooks/use-user-store.tsx';
import { ChevronsUpDown, LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function UserSwitcher() {
  const { currentUser, allUsers, setCurrentUser, logout } = useUserStore();
  const router = useRouter();

  const handleUserSelect = (userId: string) => {
    setCurrentUser(userId);
    // Use a full page reload to ensure all state is reset correctly
    window.location.href = '/'; 
  };

  const handleLogout = () => {
    logout();
    router.push('/login');
  };
  
  if (!currentUser) {
      return null;
  }

  // Only admins can switch users
  const switchableUsers = currentUser.role === 'admin' 
    ? allUsers.filter(u => u.id !== currentUser.id)
    : [];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="w-full justify-between h-auto py-2 px-3 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:size-12 group-data-[collapsible=icon]:p-0"
        >
          <div className="flex items-center gap-3">
            <Avatar className="h-9 w-9">
              <AvatarImage src={currentUser.avatar} alt={currentUser.name} />
              <AvatarFallback>{currentUser.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="text-left group-data-[collapsible=icon]:hidden">
              <p className="font-medium text-sm truncate">{currentUser.name}</p>
              <p className="text-xs text-muted-foreground capitalize">{currentUser.role === 'doctor' ? currentUser.specialty : currentUser.role}</p>
            </div>
          </div>
          <ChevronsUpDown className="h-4 w-4 text-muted-foreground group-data-[collapsible=icon]:hidden" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-72" align="start">
        <DropdownMenuLabel>
            Logged in as {currentUser.name}
        </DropdownMenuLabel>
        {switchableUsers.length > 0 && (
            <>
                <DropdownMenuSeparator />
                <DropdownMenuLabel className="text-xs font-normal text-muted-foreground">Switch Account</DropdownMenuLabel>
                {switchableUsers.map((user) => (
                <DropdownMenuItem key={user.id} onClick={() => handleUserSelect(user.id)}>
                    <Avatar className="mr-2 h-8 w-8">
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="text-left">
                    <p className="font-medium text-sm">{user.name}</p>
                    <p className="text-xs text-muted-foreground capitalize">{user.role === 'doctor' ? user.specialty : user.role}</p>
                    </div>
                </DropdownMenuItem>
                ))}
            </>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
