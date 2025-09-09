
'use client';

import { createContext, useContext, useState, useEffect, useCallback } from 'react';

export type User = {
  id: string;
  name: string;
  email: string;
  avatar: string;
  specialty: string;
  medicalRecords?: string;
  role: 'admin' | 'doctor' | 'patient';
  password?: string;
  patientIds?: string[];
};

// In a real app, this would come from a database.
const initialUsers: User[] = [
  { id: 'admin-001', name: 'Admin', email: 'admin@simupatient.com', avatar: 'https://i.pravatar.cc/150?u=admin', specialty: 'System Administration', role: 'admin', password: 'password123' },
  { id: 'doc-001', name: 'Dr. Evelyn Reed', email: 'e.reed@med.edu', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704d', specialty: 'Cardiology', role: 'doctor', password: 'password123', patientIds: ['pat-001'] },
  { id: 'doc-002', name: 'Dr. Kenji Tanaka', email: 'k.tanaka@med.edu', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026705d', specialty: 'Neurology', role: 'doctor', password: 'password123', patientIds: [] },
  { id: 'doc-003', name: 'Dr. Aisha Khan', email: 'a.khan@med.edu', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026706d', specialty: 'Pediatrics', role: 'doctor', password: 'password123', patientIds: [] },
  { id: 'pat-001', name: 'John Smith (Patient)', email: 'j.smith@email.com', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026707d', specialty: 'N/A', medicalRecords: 'Uploaded by patient: History of hypertension, hyperlipidemia, and a 30-pack-year smoking history.', role: 'patient', password: 'password123' },
];


type UserStore = {
  currentUser: User | null;
  setCurrentUser: (userId: string) => void;
  updateUser: (updatedUser: User) => void;
  logout: () => void;
  allUsers: User[];
  addUser: (user: User) => void;
  isInitialized: boolean;
};

const UserContext = createContext<UserStore | null>(null);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUserState] = useState<User | null>(null);
  const [allUsers, setAllUsersState] = useState<User[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);
  
  // Initialize state from localStorage
  useEffect(() => {
    try {
        const storedUsers = localStorage.getItem('allUsers');
        const users = storedUsers ? JSON.parse(storedUsers) : initialUsers;
        setAllUsersState(users);
        
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            const user: User = JSON.parse(storedUser);
            // Ensure the user from localStorage exists in our canonical list
            const fullUser = users.find((u:User) => u.id === user.id)
            if (fullUser) {
                 setCurrentUserState(fullUser);
            }
        }
    } catch (error) {
        console.error("Failed to initialize user state from localStorage", error);
        setAllUsersState(initialUsers); // Reset on error
    } finally {
        setIsInitialized(true);
    }
  }, []);

  // Persist allUsers to localStorage whenever it changes
  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem('allUsers', JSON.stringify(allUsers));
    }
  }, [allUsers, isInitialized]);


  const setCurrentUser = useCallback((userId: string) => {
    const user = allUsers.find(u => u.id === userId);
    if (user) {
      setCurrentUserState(user);
      localStorage.setItem('user', JSON.stringify(user));
    } else {
        console.error(`User with ID ${userId} not found.`);
        logout();
    }
  }, [allUsers]);
  
  const addUser = (user: User) => {
      setAllUsersState(prev => [...prev, user]);
  }

  const updateUser = (updatedUser: User) => {
    setAllUsersState(prev => prev.map(u => u.id === updatedUser.id ? updatedUser : u));
    if (currentUser?.id === updatedUser.id) {
        setCurrentUserState(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
    }
  }

  const logout = () => {
    // Also clear active patient for the user that is logging out.
    if(currentUser){
        localStorage.removeItem(`activePatient_${currentUser.id}`);
    }
    setCurrentUserState(null);
    localStorage.removeItem('user');
  };
  
  return (
    <UserContext.Provider value={{ currentUser, setCurrentUser, logout, allUsers, addUser, updateUser, isInitialized }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUserStore() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUserStore must be used within a UserProvider');
  }
  return context;
}
