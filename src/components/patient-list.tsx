
'use client';

import { useRouter } from 'next/navigation';
import { usePatientStore } from '@/hooks/use-patient-store.tsx';
import { Button } from './ui/button';
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Stethoscope, User, Calendar, Activity } from 'lucide-react';
import { Badge } from './ui/badge';

type PatientListProps = {
  doctorId: string;
};

export default function PatientList({ doctorId }: PatientListProps) {
  const { patients, setActivePatient, activePatient } = usePatientStore();
  const router = useRouter();

  const myPatients = patients.filter(p => p.doctorId === doctorId);

  const handleSelectPatient = (patientId: string) => {
    setActivePatient(patientId);
    router.push('/');
  };

  if (myPatients.length === 0) {
    return (
      <div className="text-center text-muted-foreground py-10">
        <p>You have no patients in your roster.</p>
        <Button variant="link" onClick={() => router.push('/add-patient')}>Add your first patient</Button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {myPatients.map(patient => (
        <Card key={patient.id} className="flex flex-col">
          <CardHeader>
            <div className="flex justify-between items-start">
              <CardTitle>{patient.name}</CardTitle>
              {activePatient?.id === patient.id && <Badge variant="default">Active</Badge>}
            </div>
            <CardDescription className="flex items-center gap-4 pt-2">
                <span className="flex items-center gap-1"><User size={14}/> {patient.gender}</span>
                <span className="flex items-center gap-1"><Calendar size={14}/> {patient.age} years</span>
            </CardDescription>
          </CardHeader>
          <div className="px-6 space-y-2 text-sm text-muted-foreground flex-1">
            <p className="flex items-start gap-2"><Stethoscope size={16} className="text-primary mt-0.5"/> <strong>Condition:</strong> {patient.primaryCondition}</p>
            <p className="flex items-start gap-2"><Activity size={16} className="text-primary mt-0.5"/> <strong>History:</strong> {patient.history}</p>
          </div>
          <CardFooter className="mt-4">
            <Button 
                className="w-full"
                onClick={() => handleSelectPatient(patient.id)}
                disabled={activePatient?.id === patient.id}
            >
              {activePatient?.id === patient.id ? 'Simulation Active' : 'Start Simulation'}
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
