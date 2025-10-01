
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import DashboardLayout from '@/components/dashboard-layout';
import ScenarioControls from '@/components/scenario-controls';
import { useUserStore } from '@/hooks/use-user-store.tsx';
import { usePatientStore } from '@/hooks/use-patient-store.tsx';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import type { Patient } from '@/hooks/use-patient-store.tsx';
import type { User } from '@/hooks/use-user-store.tsx';

const patientSchema = z.object({
  name: z.string().min(1, 'Patient name is required'),
  email: z.string().email('An email is required for the patient user account.'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  age: z.coerce.number().min(0, 'Age must be positive'),
  gender: z.string().min(1, 'Gender is required'),
  primaryCondition: z.string().min(1, 'Primary condition is required'),
  history: z.string().min(1, 'Medical history is required'),
});

type PatientFormValues = z.infer<typeof patientSchema>;

export default function AddPatientPage() {
  const { currentUser, addUser, allUsers, updateUser, isInitialized } = useUserStore();
  const { addPatient } = usePatientStore();
  const { toast } = useToast();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isInitialized) {
        if (!currentUser) {
          router.push('/login');
        } else if (currentUser.role !== 'doctor') {
          toast({
            variant: 'destructive',
            title: 'Unauthorized',
            description: 'You do not have permission to add patients.',
          });
          router.push('/');
        }
    }
  }, [currentUser, router, toast, isInitialized]);

  const { register, handleSubmit, formState: { errors } } = useForm<PatientFormValues>({
    resolver: zodResolver(patientSchema),
  });

  const onSubmit: SubmitHandler<PatientFormValues> = async (data) => {
    if (!currentUser || currentUser.role !== 'doctor') return;

    setIsLoading(true);

    if(allUsers.find(u => u.email.toLowerCase() === data.email.toLowerCase())) {
        toast({ variant: 'destructive', title: 'Error', description: 'A user with this email already exists.' });
        setIsLoading(false);
        return;
    }

    const patientId = `pat-${Date.now()}`;

    // Create the patient user account
    const newPatientUser: User = {
      id: patientId,
      name: `${data.name} (Patient)`,
      email: data.email,
      password: data.password,
      avatar: `https://i.pravatar.cc/150?u=${patientId}`,
      specialty: 'N/A',
      role: 'patient',
      medicalRecords: '',
    };
    addUser(newPatientUser);
    
    // Create the patient clinical record
    const newPatientRecord: Patient = {
      id: patientId,
      doctorId: currentUser.id,
      name: data.name,
      age: data.age,
      gender: data.gender,
      primaryCondition: data.primaryCondition,
      history: data.history,
      scenario: {
        scenarioDescription: 'Awaiting initial scenario generation.',
        learningObjectives: ['Establish baseline and await further instruction.'],
        comorbidities: '',
      }
    };
    addPatient(newPatientRecord);

    // Update the doctor's patient list
    const updatedDoctor = {
        ...currentUser,
        patientIds: [...(currentUser.patientIds || []), newPatientRecord.id]
    };
    updateUser(updatedDoctor);


    await new Promise(resolve => setTimeout(resolve, 500));
    setIsLoading(false);
    toast({
      title: 'Patient Added',
      description: `${data.name} has been successfully added to your patient roster.`,
    });
    router.push('/manage-patients');
  };
  
  if (!isInitialized || !currentUser || currentUser.role !== 'doctor') {
      return (
        <DashboardLayout sidebarContent={null}>
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        </DashboardLayout>
      )
  }

  return (
    <DashboardLayout
        sidebarContent={<ScenarioControls onScenarioGenerated={() => {}} />}
    >
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 space-y-6">
            <header className="flex items-center justify-between">
                <h1 className="text-2xl md:text-3xl font-bold text-primary font-headline">Add New Patient</h1>
            </header>
            <Card className="max-w-2xl mx-auto">
                <CardHeader>
                    <CardTitle>Patient Information</CardTitle>
                    <CardDescription>Enter the clinical details and create a user account for the new patient for Dr. {currentUser.name}.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <h3 className="text-lg font-medium text-accent">Clinical Details</h3>
                        <div>
                            <Label htmlFor="name">Patient Name</Label>
                            <Input id="name" {...register('name')} />
                            {errors.name && <p className="text-destructive text-sm mt-1">{errors.name.message}</p>}
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="age">Age</Label>
                                <Input id="age" type="number" {...register('age')} />
                                {errors.age && <p className="text-destructive text-sm mt-1">{errors.age.message}</p>}
                            </div>
                            <div>
                                <Label htmlFor="gender">Gender</Label>
                                <Input id="gender" {...register('gender')} />
                                {errors.gender && <p className="text-destructive text-sm mt-1">{errors.gender.message}</p>}
                            </div>
                        </div>
                        <div>
                            <Label htmlFor="primaryCondition">Primary Condition</Label>
                            <Input id="primaryCondition" {...register('primaryCondition')} />
                            {errors.primaryCondition && <p className="text-destructive text-sm mt-1">{errors.primaryCondition.message}</p>}
                        </div>
                        <div>
                            <Label htmlFor="history">Medical History</Label>
                            <Textarea id="history" {...register('history')} />
                            {errors.history && <p className="text-destructive text-sm mt-1">{errors.history.message}</p>}
                        </div>
                        
                        <h3 className="text-lg font-medium text-accent pt-4">Patient Account</h3>
                         <div>
                            <Label htmlFor="email">Patient Email</Label>
                            <Input id="email" type="email" {...register('email')} />
                            {errors.email && <p className="text-destructive text-sm mt-1">{errors.email.message}</p>}
                        </div>
                        <div>
                            <Label htmlFor="password">Temporary Password</Label>
                            <Input id="password" type="password" {...register('password')} />
                            {errors.password && <p className="text-destructive text-sm mt-1">{errors.password.message}</p>}
                        </div>


                        <Button type="submit" className="w-full !mt-8" disabled={isLoading}>
                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Add Patient to My Roster
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </main>
    </DashboardLayout>
  );
}
