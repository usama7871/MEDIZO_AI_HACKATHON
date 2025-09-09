
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, ShieldAlert, FileText } from 'lucide-react';
import DashboardLayout from '@/components/dashboard-layout';
import PatientInfoCard from '@/components/patient-info-card';
import VitalsMonitor from '@/components/vitals-monitor';
import InteractiveQA from '@/components/interactive-qa';
import ScenarioControls from '@/components/scenario-controls';
import { Card, CardDescription, CardTitle, CardFooter, CardHeader, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useUserStore } from '@/hooks/use-user-store.tsx';
import { usePatientStore } from '@/hooks/use-patient-store.tsx';

export default function Home() {
  const { currentUser, isInitialized: userIsInitialized } = useUserStore();
  const { activePatient, isInitialized: patientIsInitialized } = usePatientStore();
  const router = useRouter();

  const isLoading = !userIsInitialized || !patientIsInitialized;

  useEffect(() => {
    if (!isLoading && !currentUser) {
      router.push('/login');
    }
  }, [currentUser, isLoading, router]);

  const MainContent = () => {
    if (isLoading) {
      return (
        <div className="flex h-full w-full items-center justify-center">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
        </div>
      );
    }
    
    if (!currentUser) {
      // This will be briefly visible before the useEffect above redirects
      return <div className="flex h-full w-full items-center justify-center"><Loader2 className="h-10 w-10 animate-spin text-primary" /></div>;
    }


    if (currentUser.role === 'doctor' && !activePatient) {
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

    if (activePatient && currentUser.role === 'doctor') {
      return (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 h-full">
          <div className="xl:col-span-3">
            <PatientInfoCard patient={activePatient} doctor={currentUser} />
          </div>
          <div className="xl:col-span-2">
            <VitalsMonitor patient={activePatient}/>
          </div>
          <div className="xl:col-span-1">
            <InteractiveQA patientHistory={activePatient.history} currentVitals="Heart Rate: 95 bpm, Blood Pressure: 140/90 mmHg, SpO2: 94%, Respiration Rate: 22/min" />
          </div>
        </div>
      );
    }

    if (currentUser.role === 'patient') {
         return (
             <Card className="w-full max-w-2xl bg-card/80">
                 <CardHeader>
                    <CardTitle className="font-headline text-2xl">Welcome, {currentUser.name}</CardTitle>
                    <CardDescription>You can manage your medical records here. This information will be available to your doctor for simulations.</CardDescription>
                 </CardHeader>
                 <CardContent>
                     <div className="flex items-start gap-4 rounded-lg border bg-muted/50 p-4">
                        <FileText className="h-8 w-8 text-primary mt-1" />
                        <div>
                            <h3 className="font-semibold">Your Medical Records</h3>
                            {currentUser.medicalRecords ? (
                                <p className="text-sm text-muted-foreground whitespace-pre-wrap mt-2">{currentUser.medicalRecords}</p>
                            ) : (
                                <p className="text-sm text-muted-foreground mt-2">You have not uploaded any medical records yet. Use the "Upload Report" button in the sidebar to add a file.</p>
                            )}
                        </div>
                     </div>
                 </CardContent>
             </Card>
         )
    }

    // Fallback for admin or other roles without a patient view
    return (
        <Card className="flex flex-col items-center justify-center p-12 text-center bg-card/80">
        <CardTitle className="text-2xl font-headline">
            Welcome, {currentUser.name}
        </CardTitle>
        <CardDescription className="mt-2">
            {currentUser.role === 'admin' ? 'You have administrative access. You can manage doctors from the sidebar.' : 'Your dashboard view.'}
        </CardDescription>
      </Card>
    )
  }

  return (
    <DashboardLayout
      sidebarContent={<ScenarioControls onScenarioGenerated={() => {}} />}
    >
      <main className="flex-1 flex items-center justify-center p-4 md:p-6 lg:p-8">
        <MainContent />
      </main>
    </DashboardLayout>
  );
}
