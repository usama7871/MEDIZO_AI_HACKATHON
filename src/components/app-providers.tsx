
'use client';

import { UserProvider } from '@/hooks/use-user-store.tsx';
import { PatientProvider } from '@/hooks/use-patient-store.tsx';

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <UserProvider>
      <PatientProvider>
        {children}
      </PatientProvider>
    </UserProvider>
  );
}
