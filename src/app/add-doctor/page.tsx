
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
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const doctorSchema = z.object({
  name: z.string().min(1, 'Doctor name is required'),
  email: z.string().email('Invalid email address'),
  specialty: z.string().min(1, 'Specialty is required'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type DoctorFormValues = z.infer<typeof doctorSchema>;

export default function AddDoctorPage() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const { toast } = useToast();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, setValue, formState: { errors } } = useForm<DoctorFormValues>({
    resolver: zodResolver(doctorSchema),
  });

  const onSubmit: SubmitHandler<DoctorFormValues> = async (data) => {
    setIsLoading(true);
    // In a real app, you'd save this data. Here we'll just simulate it by logging.
    console.log('New Doctor Data:', data);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsLoading(false);
    toast({
      title: 'Doctor Added',
      description: `${data.name} has been successfully added to the system.`,
    });
    router.push('/');
  };

  return (
    <DashboardLayout
        sidebarContent={<ScenarioControls onScenarioGenerated={() => {}} currentUser={currentUser} onUserChange={setCurrentUser} patientScenario={null} />}
    >
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 space-y-6">
            <header className="flex items-center justify-between">
                <h1 className="text-2xl md:text-3xl font-bold text-primary font-headline">Add New Doctor</h1>
            </header>
            <Card className="max-w-2xl mx-auto">
                <CardHeader>
                    <CardTitle>Doctor Information</CardTitle>
                    <CardDescription>Enter the details for the new doctor.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <div>
                            <Label htmlFor="name">Doctor Name</Label>
                            <Input id="name" {...register('name')} />
                            {errors.name && <p className="text-destructive text-sm mt-1">{errors.name.message}</p>}
                        </div>
                        <div>
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" type="email" {...register('email')} />
                            {errors.email && <p className="text-destructive text-sm mt-1">{errors.email.message}</p>}
                        </div>
                         <div>
                            <Label htmlFor="specialty">Specialty</Label>
                             <Select onValueChange={(value) => setValue('specialty', value)} >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a specialty" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Cardiology">Cardiology</SelectItem>
                                    <SelectItem value="Neurology">Neurology</SelectItem>
                                    <SelectItem value="Pediatrics">Pediatrics</SelectItem>
                                    <SelectItem value="General Medicine">General Medicine</SelectItem>
                                </SelectContent>
                            </Select>
                            {errors.specialty && <p className="text-destructive text-sm mt-1">{errors.specialty.message}</p>}
                        </div>
                        <div>
                            <Label htmlFor="password">Temporary Password</Label>
                            <Input id="password" type="password" {...register('password')} />
                            {errors.password && <p className="text-destructive text-sm mt-1">{errors.password.message}</p>}
                        </div>

                        <Button type="submit" className="w-full" disabled={isLoading}>
                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Add Doctor
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </main>
    </DashboardLayout>
  );
}
