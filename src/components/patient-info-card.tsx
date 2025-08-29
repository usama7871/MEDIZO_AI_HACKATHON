import type { Patient } from "@/app/page";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { User, Calendar, Stethoscope, FileText, Activity } from "lucide-react";

type PatientInfoCardProps = {
  patient: Patient;
};

export default function PatientInfoCard({ patient }: PatientInfoCardProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex flex-wrap justify-between items-start gap-4">
          <div>
            <CardTitle className="text-2xl font-headline text-primary">{patient.name}</CardTitle>
            <CardDescription>Patient Details & Current Scenario</CardDescription>
          </div>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2"><User size={16} className="text-accent" /><span>{patient.gender}</span></div>
            <div className="flex items-center gap-2"><Calendar size={16} className="text-accent" /><span>{patient.age} years</span></div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
            <div className="flex items-start gap-4 p-4 rounded-lg bg-muted/50">
                <Stethoscope className="h-8 w-8 text-primary mt-1 flex-shrink-0" />
                <div>
                    <h3 className="font-semibold">Primary Condition</h3>
                    <p className="text-muted-foreground">{patient.primaryCondition}</p>
                    <h3 className="font-semibold mt-2">Medical History</h3>
                    <p className="text-muted-foreground">{patient.history}</p>
                </div>
            </div>
            <div className="flex items-start gap-4 p-4 rounded-lg bg-muted/50">
                <Activity className="h-8 w-8 text-primary mt-1 flex-shrink-0" />
                <div>
                    <h3 className="font-semibold">Comorbidities</h3>
                    <p className="text-muted-foreground">{patient.scenario.comorbidities || 'None specified'}</p>
                </div>
            </div>
        </div>
        <div className="flex items-start gap-4">
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
      </CardContent>
    </Card>
  );
}
