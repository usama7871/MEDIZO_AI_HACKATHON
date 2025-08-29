'use client';

import { useState, useEffect } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { handleGenerateScenario, handleSimulateComorbidities } from '@/app/actions';
import { Loader2 } from 'lucide-react';
import type { GeneratePersonalizedScenarioOutput } from '@/ai/flows/generate-personalized-scenario';
import UserSwitcher, { type User } from './user-switcher';

const scenarioSchema = z.object({
  studentId: z.string().min(1, 'Student ID is required'),
  specialty: z.string().min(1, 'Specialty is required'),
  performanceData: z.string().min(1, 'Performance data is required'),
});

const comorbiditySchema = z.object({
  primaryCondition: z.string().min(1, 'Primary condition is required'),
  patientHistory: z.string().optional(),
});

type ScenarioFormValues = z.infer<typeof scenarioSchema>;
type ComorbidityFormValues = z.infer<typeof comorbiditySchema>;

type ScenarioControlsProps = {
    onScenarioGenerated: (scenario: GeneratePersonalizedScenarioOutput) => void;
    currentUser: User | null;
    onUserChange: (user: User | null) => void;
};

export default function ScenarioControls({ onScenarioGenerated, currentUser, onUserChange }: ScenarioControlsProps) {
  const { toast } = useToast();
  const [isScenarioLoading, setScenarioLoading] = useState(false);
  const [isComorbidityLoading, setComorbidityLoading] = useState(false);
  const [comorbidityResult, setComorbidityResult] = useState<{ present: boolean, reasoning: string } | null>(null);

  const scenarioForm = useForm<ScenarioFormValues>({
    resolver: zodResolver(scenarioSchema),
    defaultValues: { studentId: 'student-001', specialty: 'Cardiology', performanceData: 'Slow diagnosis time on last MI case.' },
  });

  const comorbidityForm = useForm<ComorbidityFormValues>({
    resolver: zodResolver(comorbiditySchema),
    defaultValues: { primaryCondition: 'Type 2 Diabetes', patientHistory: '55-year-old male with obesity.' },
  });

  useEffect(() => {
    if (currentUser) {
      scenarioForm.setValue('studentId', currentUser.id);
      scenarioForm.setValue('specialty', currentUser.specialty);
    }
  }, [currentUser, scenarioForm]);


  const onScenarioSubmit: SubmitHandler<ScenarioFormValues> = async (data) => {
    setScenarioLoading(true);
    const result = await handleGenerateScenario({ ...data, datasetId: 'public-patient-data-v1' });
    setScenarioLoading(false);

    if (result.success && result.data) {
      toast({ title: 'Scenario Generated', description: 'A new patient scenario has been created.' });
      onScenarioGenerated(result.data);
    } else {
      toast({ variant: 'destructive', title: 'Error', description: result.error });
    }
  };

  const onComorbiditySubmit: SubmitHandler<ComorbidityFormValues> = async (data) => {
    setComorbidityLoading(true);
    const result = await handleSimulateComorbidities(data);
    setComorbidityLoading(false);

    if (result.success && result.data) {
        setComorbidityResult({ present: result.data.presentComorbidities, reasoning: result.data.comorbiditiesReasoning});
    } else {
      toast({ variant: 'destructive', title: 'Error', description: result.error });
      setComorbidityResult(null);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-2">
        <UserSwitcher onUserChange={onUserChange}/>
      </div>
      <Tabs defaultValue="scenario" className="w-full px-2 group-data-[collapsible=icon]:px-0 flex-1">
        <TabsList className="grid w-full grid-cols-2 group-data-[collapsible=icon]:hidden">
          <TabsTrigger value="scenario">Scenario</TabsTrigger>
          <TabsTrigger value="comorbidity">Comorbidity</TabsTrigger>
        </TabsList>
         <div className="w-full text-center p-2 group-data-[collapsible=icon]:block hidden">
              <p className="text-xs text-muted-foreground">CONTROLS</p>
         </div>
        <TabsContent value="scenario">
          <Card className="border-none shadow-none bg-transparent">
            <CardHeader className="px-2 group-data-[collapsible=icon]:hidden">
              <CardTitle>Generate Scenario</CardTitle>
              <CardDescription>Create a personalized case.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 px-2">
              <form onSubmit={scenarioForm.handleSubmit(onScenarioSubmit)} className="space-y-4 group-data-[collapsible=icon]:hidden">
                <div>
                  <Label htmlFor="studentId">Student ID</Label>
                  <Input id="studentId" {...scenarioForm.register('studentId')} readOnly />
                </div>
                <div>
                  <Label htmlFor="specialty">Specialty</Label>
                  <Input id="specialty" {...scenarioForm.register('specialty')} readOnly />
                </div>
                <div>
                  <Label htmlFor="performanceData">Performance Data</Label>
                  <Textarea id="performanceData" {...scenarioForm.register('performanceData')} />
                </div>
                <Button type="submit" className="w-full" disabled={isScenarioLoading}>
                  {isScenarioLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Generate
                </Button>
              </form>
               <Button onClick={() => scenarioForm.handleSubmit(onScenarioSubmit)()} className="w-full group-data-[collapsible=icon]:block hidden" size="icon" disabled={isScenarioLoading}>
                  {isScenarioLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "G"}
               </Button>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="comorbidity">
          <Card className="border-none shadow-none bg-transparent">
            <CardHeader className="px-2 group-data-[collapsible=icon]:hidden">
              <CardTitle>Simulate Comorbidities</CardTitle>
              <CardDescription>Check for related conditions.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 px-2">
              <form onSubmit={comorbidityForm.handleSubmit(onComorbiditySubmit)} className="space-y-4 group-data-[collapsible=icon]:hidden">
                <div>
                  <Label htmlFor="primaryCondition">Primary Condition</Label>
                  <Input id="primaryCondition" {...comorbidityForm.register('primaryCondition')} />
                </div>
                <div>
                  <Label htmlFor="patientHistory">Patient History</Label>
                  <Textarea id="patientHistory" {...comorbidityForm.register('patientHistory')} />
                </div>
                <Button type="submit" className="w-full" disabled={isComorbidityLoading}>
                  {isComorbidityLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Simulate
                </Button>
              </form>
               <Button onClick={() => comorbidityForm.handleSubmit(onComorbiditySubmit)()} className="w-full group-data-[collapsible=icon]:block hidden" size="icon" disabled={isComorbidityLoading}>
                  {isComorbidityLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "S"}
               </Button>

              {comorbidityResult && (
                <div className="mt-4 p-3 rounded-md bg-muted group-data-[collapsible=icon]:hidden">
                  <h4 className="font-semibold">Result: {comorbidityResult.present ? "Present Comorbidities" : "No Comorbidities"}</h4>
                  <p className="text-sm text-muted-foreground">{comorbidityResult.reasoning}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
