'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
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
import { handleGenerateScenario, handleSimulateComorbidities, handleFileUpload } from '@/app/actions';
import { Loader2, PlusCircle, BrainCircuit, HeartPulse, Baby, Upload } from 'lucide-react';
import type { GeneratePersonalizedScenarioOutput } from '@/ai/flows/generate-personalized-scenario';
import UserSwitcher, { type User } from './user-switcher';
import { Separator } from './ui/separator';

const scenarioSchema = z.object({
  studentId: z.string().min(1, 'Student ID is required'),
  specialty: z.string().min(1, 'Specialty is required'),
  performanceData: z.string().min(1, 'Performance data is required'),
  medicalRecords: z.string().optional(),
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
    patientScenario: GeneratePersonalizedScenarioOutput; // Added for context
};

export default function ScenarioControls({ onScenarioGenerated, currentUser, onUserChange, patientScenario }: ScenarioControlsProps) {
  const { toast } = useToast();
  const router = useRouter();
  const [isScenarioLoading, setScenarioLoading] = useState(false);
  const [isComorbidityLoading, setComorbidityLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [comorbidityResult, setComorbidityResult] = useState<{ present: boolean, reasoning: string } | null>(null);
  const [uploadedRecordContent, setUploadedRecordContent] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const scenarioForm = useForm<ScenarioFormValues>({
    resolver: zodResolver(scenarioSchema),
    defaultValues: { studentId: '', specialty: '', performanceData: 'No significant issues on last simulation.', medicalRecords: '' },
  });

  const comorbidityForm = useForm<ComorbidityFormValues>({
    resolver: zodResolver(comorbiditySchema),
    defaultValues: { primaryCondition: 'Type 2 Diabetes', patientHistory: '55-year-old male with obesity.' },
  });

  useEffect(() => {
    if (currentUser) {
      scenarioForm.setValue('studentId', currentUser.id);
      scenarioForm.setValue('specialty', currentUser.specialty);
      scenarioForm.setValue('medicalRecords', currentUser.medicalRecords);
    }
  }, [currentUser, scenarioForm]);

  useEffect(() => {
    // Pass uploaded content to the form for submission
    scenarioForm.setValue('medicalRecords', 
        (currentUser?.medicalRecords || '') + 
        (uploadedRecordContent ? `\n\n--- UPLOADED RECORD ---\n${uploadedRecordContent}` : '')
    );
  }, [uploadedRecordContent, currentUser, scenarioForm]);


  const onScenarioSubmit: SubmitHandler<ScenarioFormValues> = async (data) => {
    setScenarioLoading(true);
    const result = await handleGenerateScenario({ 
        ...data, 
        datasetId: 'public-patient-data-v1'
    });
    setScenarioLoading(false);

    if (result.success && result.data) {
      toast({ title: 'Scenario Generated', description: 'A new patient scenario has been created.' });
      onScenarioGenerated(result.data);
    } else {
      toast({ variant: 'destructive', title: 'Error', description: result.error });
    }
  };
  
  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    const result = await handleFileUpload(formData);
    setIsUploading(false);

    if (result.success && result.data) {
      toast({ title: 'File Uploaded', description: `${file.name} has been processed.` });
      setUploadedRecordContent(result.data.recordContent);
    } else {
      toast({ variant: 'destructive', title: 'Upload Failed', description: result.error });
      setUploadedRecordContent(null);
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
  
  const specialtyIcon = (specialty: string) => {
    switch (specialty.toLowerCase()) {
        case 'cardiology': return <HeartPulse className="h-4 w-4" />;
        case 'neurology': return <BrainCircuit className="h-4 w-4" />;
        case 'pediatrics': return <Baby className="h-4 w-4" />;
        default: return null;
    }
  }
  
  const userRole = currentUser?.id === 'admin' ? 'admin' : 'user';

  return (
    <div className="flex flex-col h-full">
      <div className="p-2">
        <UserSwitcher onUserChange={onUserChange} currentUser={currentUser}/>
      </div>
      <Separator className="my-2 bg-sidebar-border/50" />
       <div className="p-2 group-data-[collapsible=icon]:p-0 group-data-[collapsible=icon]:w-full group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:justify-center">
        <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept=".txt,.md" />
        <Button variant="outline" className="w-full border-accent text-accent hover:bg-accent/10 hover:text-accent-foreground" onClick={handleFileSelect} disabled={isUploading || !currentUser}>
          {isUploading ? <Loader2 className="mr-2 animate-spin" /> : <Upload className="mr-2" />}
          <span className="group-data-[collapsible=icon]:hidden">Upload Report</span>
        </Button>
      </div>
      {uploadedRecordContent && (
          <div className="p-2 group-data-[collapsible=icon]:hidden">
              <p className="text-xs text-muted-foreground truncate">Loaded: {fileInputRef.current?.files?.[0]?.name}</p>
          </div>
      )}
      <Separator className="my-2 bg-sidebar-border/50" />
      {userRole === 'admin' && (
        <>
            <div className="p-2 group-data-[collapsible=icon]:p-0 group-data-[collapsible=icon]:w-full group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:justify-center">
                <Button variant="outline" className="w-full border-primary/50 text-primary/80 hover:bg-primary/10 hover:text-primary" onClick={() => router.push('/add-patient')}>
                    <PlusCircle className="mr-2" />
                    <span className="group-data-[collapsible=icon]:hidden">Add Patient</span>
                </Button>
            </div>
            <Separator className="my-2 bg-sidebar-border/50" />
        </>
      )}
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
                <div className="p-2 rounded-md bg-muted/50 border border-border/50">
                  <Label htmlFor="studentId">Current User</Label>
                  <div className="flex items-center gap-2 mt-1">
                    <p className="text-sm font-medium">{currentUser?.name}</p>
                  </div>
                </div>
                 <div className="p-2 rounded-md bg-muted/50 border border-border/50">
                  <Label htmlFor="specialty">Specialty</Label>
                  <div className="flex items-center gap-2 mt-1">
                    {specialtyIcon(currentUser?.specialty || '')}
                    <p className="text-sm font-medium">{currentUser?.specialty}</p>
                  </div>
                </div>
                <div>
                  <Label htmlFor="performanceData">Performance Notes</Label>
                  <Textarea id="performanceData" {...scenarioForm.register('performanceData')} disabled={!currentUser} />
                </div>
                <Button type="submit" className="w-full" disabled={isScenarioLoading || !currentUser}>
                  {isScenarioLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Generate
                </Button>
              </form>
               <Button onClick={() => scenarioForm.handleSubmit(onScenarioSubmit)()} className="w-full group-data-[collapsible=icon]:block hidden" size="icon" disabled={isScenarioLoading || !currentUser}>
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
