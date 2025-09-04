'use client';

import { useState, useEffect } from 'react';
import type { GeneratePersonalizedScenarioOutput } from '@/ai/flows/generate-personalized-scenario';
import type { PatientDiagnosisOutput } from '@/ai/schemas/patient-diagnosis';
import type { User } from '@/components/user-switcher';
import { handleDiagnosePatient } from '@/app/actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, RefreshCw, AlertTriangle, FileText, Stethoscope, FlaskConical } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

type DiagnosisReportProps = {
  doctor: User;
  scenario: GeneratePersonalizedScenarioOutput;
};

export default function DiagnosisReport({ doctor, scenario }: DiagnosisReportProps) {
  const [diagnosis, setDiagnosis] = useState<PatientDiagnosisOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const getDiagnosis = async () => {
    setIsLoading(true);
    setError(null);
    const result = await handleDiagnosePatient({
      doctor: {
        name: doctor.name,
        specialty: doctor.specialty,
      },
      scenarioDescription: scenario.scenarioDescription,
      learningObjectives: scenario.learningObjectives,
      comorbidities: scenario.comorbidities,
      uploadedMedicalRecords: doctor.medicalRecords,
    });
    setIsLoading(false);

    if (result.success && result.data) {
      setDiagnosis(result.data);
      toast({
        title: 'Diagnosis Complete',
        description: `Consultation with ${result.data.specialistConsult} is complete.`,
      });
    } else {
      setError(result.error || 'An unknown error occurred.');
      toast({
        variant: 'destructive',
        title: 'Diagnosis Failed',
        description: result.error,
      });
    }
  };

  // Automatically fetch diagnosis when the component mounts or scenario changes
  useEffect(() => {
    if (doctor && scenario) {
      getDiagnosis();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [doctor, scenario]);

  return (
    <Card className="bg-muted/50 border-border/50">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>AI Diagnostic Report</CardTitle>
          <CardDescription>Analysis from the multi-agent AI system.</CardDescription>
        </div>
        <Button onClick={getDiagnosis} disabled={isLoading} size="sm" variant="ghost">
          <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          <span className="ml-2">Rerun Diagnosis</span>
        </Button>
      </CardHeader>
      <CardContent>
        {isLoading && (
          <div className="flex items-center justify-center p-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="ml-4 text-muted-foreground">Generating diagnosis...</p>
          </div>
        )}
        {error && !isLoading && (
          <div className="text-destructive text-center p-8">
            <AlertTriangle className="h-8 w-8 mx-auto mb-2" />
            <p className="font-semibold">Error</p>
            <p>{error}</p>
          </div>
        )}
        {diagnosis && !isLoading && (
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold flex items-center gap-2"><FlaskConical size={18} className="text-primary"/>Initial Assessment</h4>
              <p className="text-muted-foreground text-sm pl-7">{diagnosis.initialAssessment}</p>
            </div>
             <div>
              <h4 className="font-semibold flex items-center gap-2"><Stethoscope size={18} className="text-primary"/>Specialist Consultation</h4>
              <p className="text-muted-foreground text-sm pl-7">
                Recommended Action: <span className="font-medium text-foreground">{diagnosis.recommendedAction}</span>
                <br />
                Consulted: <span className="font-medium text-foreground">{diagnosis.specialistConsult}</span>
              </p>
            </div>
            <div>
              <h4 className="font-semibold flex items-center gap-2"><FileText size={18} className="text-primary"/>Specialist Report</h4>
              <p className="text-muted-foreground text-sm pl-7 whitespace-pre-wrap">{diagnosis.specialistReport}</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
