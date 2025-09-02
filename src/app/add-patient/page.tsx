'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import DashboardLayout from '@/components/dashboard-layout';
import ScenarioControls from '@/components/scenario-controls';
import type { User } from '@/components/user-switcher';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

const patientSchema = z.object({
  name: z.string().min(1, 'Patient name is required'),
  age: z.coerce.number().min(0, 'Age must be positive'),
  gender: z.string().min(1, 'Gender is required'),
  primaryCondition: z.string().min(1, 'Primary condition is required'),
  history: z.string().min(1, 'Medical history is required'),
});

type PatientFormValues = z.infer<typeof patientSchema>;

export default function AddPatientPage() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const { toast } = useToast();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<PatientFormValues>({
    resolver: zodResolver(patientSchema),
  });

  const onSubmit: SubmitHandler<PatientFormValues> = async (data) => {
    setIsLoading(true);
    // In a real app, you'd save this data. Here we'll just simulate it.
    console.log('New Patient Data:', data);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsLoading(false);
    toast({
      title: 'Patient Added',
      description: `${data.name} has been successfully added to the system.`,
    });
    router.push('/');
  };

  return (
    <DashboardLayout
        sidebarContent={<ScenarioControls onScenarioGenerated={() => {}} currentUser={currentUser} onUserChange={setCurrentUser} />}
    >
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 space-y-6">
            <header className="flex items-center justify-between">
                <h1 className="text-2xl md:text-3xl font-bold text-primary font-headline">Add New Patient</h1>
            </header>
            <Card className="max-w-2xl mx-auto">
                <CardHeader>
                    <CardTitle>Patient Information</CardTitle>
                    <CardDescription>Enter the details for the new patient.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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

                        <Button type="submit" className="w-full" disabled={isLoading}>
                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Add Patient
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </main>
    </DashboardLayout>
  );
}
