
import type { Patient } from "@/hooks/use-patient-store.tsx";
import type { User } from "@/hooks/use-user-store";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { User as UserIcon, Calendar, Stethoscope, FileText, Activity } from "lucide-react";
import DiagnosisReport from "./diagnosis-report";

type PatientInfoCardProps = {
  patient: Patient;
  doctor: User;
};

export default function PatientInfoCard({ patient, doctor }: PatientInfoCardProps) {
  return (
    <Card className="bg-card/80 backdrop-blur-sm border-border/50 shadow-lg shadow-black/20">
      <CardHeader>
        <div className="flex flex-wrap justify-between items-start gap-4">
          <div>
            <CardTitle className="text-2xl font-headline text-primary">{patient.name}</CardTitle>
            <CardDescription>Patient Details & Current Scenario | Attending: {doctor.name} ({doctor.specialty})</CardDescription>
          </div>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2"><UserIcon size={16} className="text-accent" /><span>{patient.gender}</span></div>
            <div className="flex items-center gap-2"><Calendar size={16} className="text-accent" /><span>{patient.age} years</span></div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
            <div className="flex items-start gap-4 p-4 rounded-lg bg-muted/50 border border-border/50">
                <Stethoscope className="h-8 w-8 text-primary mt-1 flex-shrink-0" />
                <div>
                    <h3 className="font-semibold">Primary Condition</h3>
                    <p className="text-muted-foreground">{patient.primaryCondition}</p>
                    <h3 className="font-semibold mt-2">Medical History</h3>
                    <p className="text-muted-foreground">{patient.history}</p>
                </div>
            </div>
            <div className="flex items-start gap-4 p-4 rounded-lg bg-muted/50 border border-border/50">
                <Activity className="h-8 w-8 text-primary mt-1 flex-shrink-0" />
                <div>
                    <h3 className="font-semibold">Comorbidities</h3>
                    <p className="text-muted-foreground">{patient.scenario.comorbidities || 'None specified'}</p>
                </div>
            </div>
        </div>
        <div className="flex items-start gap-4 p-4 rounded-lg bg-muted/50 border border-border/50">
          <FileText className="h-8 w-8 text-primary mt-1 flex-shrink-0" />
          <div>
            <h3 className="font-semibold">Scenario Description</h3>
            <p className="text-muted-foreground">{patient.scenario.scenarioDescription}</p>
            <h4 className="font-semibold mt-4">Learning Objectives:</h4>
            <ul className="list-disc list-inside text-muted-foreground space-y-1 mt-2">
              {patient.scenario.learningObjectives.map((obj, i) => <li key={i}>{obj}</li>)}
            </ul>
          </div>
        </div>
        
        {doctor.role !== 'patient' && (
          <DiagnosisReport
            doctor={doctor}
            scenario={patient.scenario}
          />
        )}

      </CardContent>
    </Card>
  );
}
