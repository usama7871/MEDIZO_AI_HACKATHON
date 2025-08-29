'use client';

import { useState, useEffect, useMemo } from 'react';
import VitalChart from './vital-chart';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { HeartPulse, Gauge, Wind, Waves } from 'lucide-react';

const VITAL_DATA_LENGTH = 50; // Increased for a smoother look
const TICK_RATE_MS = 100; // Update every 100ms for smoother animation

// --- Realistic Waveform Patterns ---
const createEcgPattern = () => [0,0,0,0,0,0.1,0.2,0.1,0, -0.5, 2, -1, 0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
const createBpPattern = () => [0.5, 0.6, 0.7, 0.8, 0.9, 1, 0.9, 0.7, 0.5, 0.3, 0.2, 0.1, 0, -0.1, -0.2, -0.1, 0, 0.1, 0.2, 0.3, 0.4];
const createRespPattern = () => [0, 0.2, 0.5, 0.8, 1, 0.8, 0.5, 0.2, 0, -0.2, -0.3, -0.2, 0, 0, 0, 0, 0, 0, 0, 0];
const createSpo2Pattern = () => [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1, 0.95, 0.9, 0.85, 0.8, 0.7, 0.6, 0.5, 0.4, 0.3, 0.2, 0.1, 0];


const useVitalSign = (baseValue: number, fluctuation: number, min: number, max: number, pattern: number[], speed: number) => {
    const [data, setData] = useState<{ time: string; value: number }[]>([]);
    const [patternIndex, setPatternIndex] = useState(0);

    useEffect(() => {
        // Initialize data on client
        setData(Array.from({ length: VITAL_DATA_LENGTH }, (_, i) => ({
            time: `${i}`,
            value: baseValue,
        })));
    }, [baseValue]);

    useEffect(() => {
        if (data.length === 0) return;

        const interval = setInterval(() => {
            const patternValue = pattern[patternIndex];
            const noise = (Math.random() - 0.5) * fluctuation;
            let newValue = baseValue + (patternValue * fluctuation * 2) + noise;
            newValue = Math.max(min, Math.min(max, newValue));

            setData(prev => [
                ...prev.slice(1),
                { time: `${parseInt(prev[prev.length - 1].time) + 1}`, value: Math.round(newValue) }
            ]);

            setPatternIndex(prev => (prev + 1) % pattern.length);
        }, TICK_RATE_MS * (1/speed));

        return () => clearInterval(interval);
    }, [data, baseValue, fluctuation, min, max, pattern, patternIndex, speed]);

    return data;
};


export default function VitalsMonitor() {
  const ecgPattern = useMemo(() => createEcgPattern(), []);
  const bpPattern = useMemo(() => createBpPattern(), []);
  const respPattern = useMemo(() => createRespPattern(), []);
  const spo2Pattern = useMemo(() => createSpo2Pattern(), []);

  const hrData = useVitalSign(85, 1, 60, 120, ecgPattern, 1.5);
  const bpData = useVitalSign(120, 2, 90, 160, bpPattern, 1.5);
  const spo2Data = useVitalSign(96, 0.2, 92, 100, spo2Pattern, 1.5);
  const respData = useVitalSign(18, 0.5, 12, 24, respPattern, 0.5);

  return (
    <Card>
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
