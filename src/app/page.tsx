
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, ShieldAlert } from 'lucide-react';

import type { GeneratePersonalizedScenarioOutput } from '@/ai/flows/generate-personalized-scenario';
import DashboardLayout from '@/components/dashboard-layout';
import PatientInfoCard from '@/components/patient-info-card';
import VitalsMonitor from '@/components/vitals-monitor';
import InteractiveQA from '@/components/interactive-qa';
import ScenarioControls from '@/components/scenario-controls';
import { Card, CardDescription, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useUserStore } from '@/hooks/use-user-store';
import { usePatientStore } from '@/hooks/use-patient-store.tsx';
import type { Patient } from '@/hooks/use-patient-store.tsx';

export default function Home() {
  const { currentUser } = useUserStore();
  const { activePatient, setActivePatient } = usePatientStore();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    if (!currentUser) {
      router.push('/login');
    } else {
      // If a doctor has no active patient, redirect to management page
      if (currentUser.role === 'doctor' && !activePatient) {
        // Find if they have an active patient in localStorage that isn't in the hook yet
        const storedActivePatientId = localStorage.getItem(`activePatient_${currentUser.id}`);
        if(storedActivePatientId) {
            setActivePatient(storedActivePatientId);
        }
      }
      setIsLoading(false);
    }
  }, [currentUser, router, activePatient, setActivePatient]);

  const handleScenarioGenerated = (newScenario: GeneratePersonalizedScenarioOutput | null) => {
    // This function might need to be re-thought with the new patient structure
    // For now, it will not do anything as scenarios are tied to patients.
  };

  const MainContent = () => {
    if (isLoading) {
      return (
        <div className="flex h-full w-full items-center justify-center">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
        </div>
      );
    }

    if (currentUser?.role === 'doctor' && !activePatient) {
      return (
        <Card className="flex flex-col items-center justify-center p-12 text-center bg-card/80">
            <ShieldAlert className="h-12 w-12 text-accent mb-4" />
            <CardTitle className="text-2xl font-headline">
                No Active Patient Selected
            </CardTitle>
            <CardDescription className="mt-2 max-w-md">
                To begin a simulation, please go to the patient management page and select a patient from your roster.
            </CardDescription>
            <CardFooter className="mt-6">
                <Button onClick={() => router.push('/manage-patients')}>Manage Patients</Button>
            </CardFooter>
          </Card>
      )
    }

    if (activePatient && currentUser && (currentUser.role === 'doctor' || currentUser.role === 'admin')) {
      return (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-3">
            <PatientInfoCard patient={activePatient} doctor={currentUser} />
          </div>
          <div className="xl:col-span-2">
            <VitalsMonitor />
          </div>
          <div className="xl:col-span-1">
            <InteractiveQA patientHistory={activePatient.history} currentVitals="Heart Rate: 95 bpm, Blood Pressure: 140/90 mmHg, SpO2: 94%, Respiration Rate: 22/min" />
          </div>
        </div>
      );
    }

    // Fallback for admin or other roles without a patient view
    return (
        <Card className="flex flex-col items-center justify-center p-12 text-center bg-card/80">
        <CardTitle className="text-2xl font-headline">
            Welcome, {currentUser?.name}
        </CardTitle>
        <CardDescription className="mt-2">
            {currentUser?.role === 'admin' ? 'You can manage doctors from the sidebar.' : 'Your dashboard view.'}
        </CardDescription>
      </Card>
    )
  }

  return (
    <DashboardLayout
      sidebarContent={<ScenarioControls onScenarioGenerated={handleScenarioGenerated} />}
    >
      <main className="flex-1 flex items-center justify-center p-4 md:p-6 lg:p-8">
        {MainContent()}
      </main>
    </DashboardLayout>
  );
}
