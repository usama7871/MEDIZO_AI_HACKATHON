
'use client';

import { useState, useEffect } from 'react';
import type { GeneratePersonalizedScenarioOutput } from '@/ai/flows/generate-personalized-scenario';
import DashboardLayout from '@/components/dashboard-layout';
import PatientInfoCard from '@/components/patient-info-card';
import VitalsMonitor from '@/components/vitals-monitor';
import InteractiveQA from '@/components/interactive-qa';
import ScenarioControls from '@/components/scenario-controls';
import type { User } from '@/components/user-switcher';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { Card, CardDescription, CardTitle } from '@/components/ui/card';

const defaultPatient = {
  name: 'John Smith',
  age: 72,
  gender: 'Male',
  primaryCondition: 'Acute Myocardial Infarction',
  history: 'History of hypertension, hyperlipidemia, and a 30-pack-year smoking history.',
  scenario: {
    scenarioDescription: 'A 72-year-old male with a history of hypertension and hyperlipidemia presents to the emergency department with severe, crushing chest pain that started 2 hours ago. The pain radiates to his left arm and is associated with diaphoresis and nausea.',
    learningObjectives: [
      'Rapidly diagnose and manage ST-elevation myocardial infarction (STEMI).',
      'Initiate appropriate reperfusion therapy.',
      'Manage acute complications of MI.'
    ],
    comorbidities: 'Hypertension, Hyperlipidemia',
  }
};

export type Patient = typeof defaultPatient;

export default function Home() {
  const [patient, setPatient] = useState<Patient | null>(defaultPatient);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        setCurrentUser(user);
      } catch (e) {
        console.error("Failed to parse user from localStorage", e);
        localStorage.removeItem('user');
        router.push('/login');
      }
    } else {
      router.push('/login');
    }
  }, [router]);

  const handleScenarioGenerated = (newScenario: GeneratePersonalizedScenarioOutput | null) => {
    if (newScenario) {
      setPatient({
        name: 'Simulated Patient',
        age: Math.floor(Math.random() * 40) + 40,
        gender: Math.random() > 0.5 ? 'Male' : 'Female',
        primaryCondition: 'Personalized Scenario',
        history: newScenario.comorbidities || 'Not specified.',
        scenario: newScenario,
      });
    } else {
      setPatient(null);
    }
  };
  
  if (!currentUser) {
      return (
          <div className="flex h-screen w-full items-center justify-center bg-background">
              <Loader2 className="h-10 w-10 animate-spin text-primary" />
          </div>
      )
  }

  return (
    <DashboardLayout
      sidebarContent={<ScenarioControls onScenarioGenerated={handleScenarioGenerated} currentUser={currentUser} onUserChange={setCurrentUser} patientScenario={patient?.scenario ?? null} />}
    >
      <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 space-y-6">
        <header className="flex items-center justify-between">
            <h1 className="text-2xl md:text-3xl font-bold text-primary font-headline">Patient Simulation Dashboard</h1>
        </header>
        {patient && currentUser.role !== 'patient' ? (
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            <div className="xl:col-span-3">
              <PatientInfoCard patient={patient} doctor={currentUser} />
            </div>
            <div className="xl:col-span-2">
              <VitalsMonitor />
            </div>
            <div className="xl:col-span-1">
              <InteractiveQA patientHistory={patient.history} currentVitals="Heart Rate: 95 bpm, Blood Pressure: 140/90 mmHg, SpO2: 94%, Respiration Rate: 22/min" />
            </div>
          </div>
        ) : (
          <Card className="flex flex-col items-center justify-center p-12 text-center bg-card/80">
            <CardTitle className="text-2xl font-headline">
                {currentUser.role === 'patient' ? `Welcome, ${currentUser.name}`: "No Patient Scenario Loaded"}
            </CardTitle>
            <CardDescription className="mt-2">
                {currentUser.role === 'patient' ? "Your records are being reviewed by our team." : "Please use the sidebar to generate a new scenario."}
            </CardDescription>
          </Card>
        )}
      </main>
    </DashboardLayout>
  );
}
