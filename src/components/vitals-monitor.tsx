'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import VitalChart from './vital-chart';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { HeartPulse, Gauge, Wind, Waves } from 'lucide-react';

const VITAL_DATA_LENGTH = 50;
const TICK_RATE_MS = 100; // Update every 100ms for smoother animation

// --- Realistic Waveform Patterns ---
// PQRST wave for ECG
const createEcgPattern = () => [0,0,0,0,0,0.1,0.2,0.1,0, -0.5, 2.5, -1.2, 0.2, 0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
// Dicrotic notch for Arterial Blood Pressure
const createBpPattern = () => [0.6, 0.8, 1, 0.9, 0.7, 0.75, 0.6, 0.4, 0.2, 0.1, 0, 0, 0, 0.1, 0.2, 0.3, 0.4, 0.5];
// Smooth sine wave for Respiration
const createRespPattern = () => Array.from({length: 20}, (_, i) => Math.sin((i / 19) * Math.PI));
// Plethysmograph wave for SpO2
const createSpo2Pattern = () => [0, 0.1, 0.3, 0.6, 0.9, 1, 0.8, 0.5, 0.3, 0.2, 0.1, 0, 0, 0, 0, 0, 0, 0, 0, 0];


const useVitalSign = (baseValue: number, fluctuation: number, min: number, max: number, pattern: number[], speed: number) => {
    const [data, setData] = useState<{ time: string; value: number }[]>([]);
    const [isInitialized, setIsInitialized] = useState(false);
    const patternIndexRef = useRef(0);

    useEffect(() => {
        // Initialize data only on the client-side to avoid hydration errors
        const initialData = Array.from({ length: VITAL_DATA_LENGTH }, (_, i) => ({
            time: `${i}`,
            value: baseValue,
        }));
        setData(initialData);
        setIsInitialized(true);
    }, [baseValue]);

    useEffect(() => {
        if (!isInitialized) return;

        const interval = setInterval(() => {
            const patternValue = pattern[patternIndexRef.current];
            const noise = (Math.random() - 0.5) * fluctuation;
            let newValue = baseValue + (patternValue * fluctuation * 5) + noise; // Increased multiplier for more pronounced pattern
            newValue = Math.max(min, Math.min(max, newValue));

            setData(prev => {
                const newTime = prev.length > 0 ? `${parseInt(prev[prev.length - 1].time) + 1}` : '0';
                return [
                    ...prev.slice(1),
                    { time: newTime, value: Math.round(newValue * 10) / 10 } // Allow one decimal place
                ];
            });

            patternIndexRef.current = (patternIndexRef.current + 1) % pattern.length;
        }, TICK_RATE_MS * (1 / speed));

        return () => clearInterval(interval);
    }, [isInitialized, baseValue, fluctuation, min, max, pattern, speed]);

    return data;
};


export default function VitalsMonitor() {
  const ecgPattern = useMemo(() => createEcgPattern(), []);
  const bpPattern = useMemo(() => createBpPattern(), []);
  const respPattern = useMemo(() => createRespPattern(), []);
  const spo2Pattern = useMemo(() => createSpo2Pattern(), []);

  // Simulating a patient in distress
  const hrData = useVitalSign(110, 1.5, 80, 140, ecgPattern, 2);
  const bpData = useVitalSign(95, 2.5, 70, 110, bpPattern, 2);
  const spo2Data = useVitalSign(93, 0.5, 88, 96, spo2Pattern, 2);
  const respData = useVitalSign(24, 1, 18, 30, respPattern, 1);

  return (
    <Card className="bg-card/80 backdrop-blur-sm border-border/50 shadow-lg shadow-black/20">
      <CardHeader>
        <CardTitle>Vitals Monitor</CardTitle>
        <CardDescription>Real-time physiological data from the patient.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <VitalChart title="Heart Rate" unit="bpm" data={hrData} dataKey="hr" color="--chart-1" Icon={HeartPulse} />
          <VitalChart title="Systolic BP" unit="mmHg" data={bpData} dataKey="bp" color="--chart-2" Icon={Gauge} />
          <VitalChart title="SpO2" unit="%" data={spo2Data} dataKey="spo2" color="--chart-3" Icon={Waves} />
          <VitalChart title="Respiration" unit="/min" data={respData} dataKey="resp" color="--chart-4" Icon={Wind} />
        </div>
      </CardContent>
    </Card>
  );
}
