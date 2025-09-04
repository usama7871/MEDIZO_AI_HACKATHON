
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/dashboard-layout';
import ScenarioControls from '@/components/scenario-controls';
import { useUserStore } from '@/hooks/use-user-store';
import { Loader2, UserPlus, PlusCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import PatientList from '@/components/patient-list';

export default function ManagePatientsPage() {
  const { currentUser } = useUserStore();
  const router = useRouter();

  useEffect(() => {
    if (!currentUser) {
      router.push('/login');
    } else if (currentUser.role !== 'doctor') {
      router.push('/');
    }
  }, [currentUser, router]);

  if (!currentUser || currentUser.role !== 'doctor') {
    return (
      <DashboardLayout sidebarContent={null}>
        <main className="flex h-screen w-full items-center justify-center">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
        </main>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      sidebarContent={<ScenarioControls onScenarioGenerated={() => {}} />}
    >
      <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 space-y-6">
        <header className="flex items-center justify-between">
          <h1 className="text-2xl md:text-3xl font-bold text-primary font-headline">Manage Patients</h1>
           <Button onClick={() => router.push('/add-patient')}>
             <PlusCircle className="mr-2 h-4 w-4" />
            Add New Patient
          </Button>
        </header>

        <Card>
          <CardHeader>
            <CardTitle>Dr. {currentUser.name}'s Patient Roster</CardTitle>
            <CardDescription>Select a patient to begin a simulation or manage their records.</CardDescription>
          </CardHeader>
          <CardContent>
            <PatientList doctorId={currentUser.id} />
          </CardContent>
        </Card>

      </main>
    </DashboardLayout>
  );
}
