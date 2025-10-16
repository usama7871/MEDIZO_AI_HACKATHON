
'use client';

import { useState, useEffect, useMemo, useRef, memo } from 'react';
import type { Patient } from '@/hooks/use-patient-store.tsx';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { HeartPulse, Gauge, Wind, Waves } from 'lucide-react';
import { cn } from '@/lib/utils';

// --- Constants ---
const VITAL_DATA_LENGTH = 150; // Number of data points to display
const TICK_RATE_MS = 100; // Update interval for simulation

// --- Waveform Patterns (as simple arrays of numbers) ---
const createEcgPattern = () => [0,0,0,0.1,0.2,0.1,0,-0.5,2.8,-1.5,0.3,0.1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
const createBpPattern = () => [0.7,0.8,0.9,1,0.95,0.85,0.8,0.75,0.78,0.72,0.6,0.5,0.4,0.3,0.2,0.2,0.3,0.4,0.5,0.6];
const createRespPattern = () => Array.from({ length: 40 }, (_, i) => (Math.sin((i / 39) * Math.PI) * 0.8) + 0.1);
const createSpo2Pattern = () => [0.5,0.6,0.8,0.95,1,0.9,0.7,0.6,0.55,0.52,0.5,0.5,0.5,0.5,0.5,0.5,0.5,0.5,0.5,0.5,0.5,0.5,0.5,0.5];

const getVitalParams = (condition: string) => {
    // Default to a stable patient
    let params = {
        hr: { base: 75, fluctuation: 1, speed: 1.5, yDomain: [50, 100] as [number, number] },
        bp: { base: 120, fluctuation: 2, speed: 1.5, yDomain: [70, 140] as [number, number] },
        spo2: { base: 98, fluctuation: 0.5, speed: 1.5, yDomain: [90, 100] as [number, number] },
        resp: { base: 16, fluctuation: 1, speed: 1, yDomain: [10, 25] as [number, number] },
    };

    // Adjust for specific conditions (case-insensitive)
    const lowerCaseCondition = condition.toLowerCase();
    if (lowerCaseCondition.includes('myocardial infarction') || lowerCaseCondition.includes('chest pain')) {
        params = {
            hr: { base: 110, fluctuation: 1.5, speed: 2.5, yDomain: [50, 150] },
            bp: { base: 95, fluctuation: 2.5, speed: 2.5, yDomain: [70, 130] },
            spo2: { base: 93, fluctuation: 0.5, speed: 2.5, yDomain: [85, 100] },
            resp: { base: 24, fluctuation: 1, speed: 1.2, yDomain: [10, 35] },
        };
    } else if (lowerCaseCondition.includes('sepsis')) {
        params = {
            hr: { base: 125, fluctuation: 2, speed: 3, yDomain: [60, 160] },
            bp: { base: 85, fluctuation: 3, speed: 3, yDomain: [60, 120] },
            spo2: { base: 92, fluctuation: 1, speed: 3, yDomain: [80, 100] },
            resp: { base: 28, fluctuation: 1.5, speed: 1.5, yDomain: [15, 40] },
        };
    }
    // Add more conditions here as needed...

    return params;
}

// --- Custom Hook for Vital Sign Simulation ---
const useVitalSign = (baseValue: number, fluctuation: number, pattern: number[], speed: number) => {
    const [data, setData] = useState<number[]>([]);
    const patternIndexRef = useRef(0);

    useEffect(() => {
        setData(Array(VITAL_DATA_LENGTH).fill(baseValue));
        const interval = setInterval(() => {
            const patternValue = pattern[patternIndexRef.current];
            const noise = (Math.random() - 0.5) * fluctuation;
            let newValue = baseValue + (patternValue * fluctuation * (pattern === createEcgPattern() ? 6 : 4)) + noise;

            setData(prev => [...prev.slice(1), newValue]);
            patternIndexRef.current = (patternIndexRef.current + 1) % pattern.length;
        }, TICK_RATE_MS * (1 / speed));

        return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [baseValue, fluctuation, speed]); // pattern is stable

    return data;
};

// --- SVG Waveform Component ---
const SvgWaveform = memo(({ data, color, yDomain }: { data: number[], color: string, yDomain: [number, number] }) => {
    const path = useMemo(() => {
        if (data.length < 2) return "";
        const [min, max] = yDomain;
        const range = max - min;
        if (range === 0) return "";
        
        let d = `M 0,${100 - ((data[0] - min) / range) * 100}`;
        for (let i = 1; i < data.length; i++) {
            d += ` L ${i * (100 / (VITAL_DATA_LENGTH -1))},${100 - ((data[i] - min) / range) * 100}`;
        }
        return d;
    }, [data, yDomain]);

    return (
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full">
            <path d={path} stroke={color} strokeWidth="1.5" fill="none" strokeLinejoin="round" strokeLinecap="round" />
        </svg>
    );
});
SvgWaveform.displayName = 'SvgWaveform';


// --- Individual Vital Chart Component ---
const VitalChart = ({ title, unit, data, color, Icon, yDomain }: { title: string, unit: string, data: number[], color: string, Icon: React.ElementType, yDomain: [number, number] }) => {
    const currentValue = data.length > 0 ? data[data.length - 1] : 0;
    
    return (
        <Card className="flex flex-col bg-muted/40 border-border/30 overflow-hidden">
            <CardHeader className="flex-row items-center justify-between pb-2">
                <div className='flex items-center gap-2'>
                    <Icon className="h-6 w-6" style={{ color }} />
                    <CardTitle className="text-base font-medium">{title}</CardTitle>
                </div>
                <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-bold tabular-nums" style={{ color }}>
                        {currentValue.toFixed(0)}
                    </span>
                    <span className="text-sm text-muted-foreground">{unit}</span>
                </div>
            </CardHeader>
            <CardContent className="flex-1 p-0">
                <div className="h-[100px] w-full relative">
                     <div className="absolute inset-0 opacity-10" style={{background: `radial-gradient(ellipse at center, ${color} 0%, transparent 70%)`}}/>
                     {data.length > 0 && <SvgWaveform data={data} color={color} yDomain={yDomain} />}
                </div>
            </CardContent>
        </Card>
    );
};

export type Vitals = {
    hr: number;
    bp: number;
    spo2: number;
    resp: number;
};

type VitalsMonitorProps = {
  patient: Patient;
  onVitalsChange: (vitals: Vitals) => void;
};


// --- Main Vitals Monitor Component ---
export default function VitalsMonitor({ patient, onVitalsChange }: VitalsMonitorProps) {
  const { hr, bp, spo2, resp } = useMemo(() => getVitalParams(patient.primaryCondition), [patient.primaryCondition]);
  
  const ecgPattern = useMemo(() => createEcgPattern(), []);
  const bpPattern = useMemo(() => createBpPattern(), []);
  const respPattern = useMemo(() => createRespPattern(), []);
  const spo2Pattern = useMemo(() => createSpo2Pattern(), []);

  const hrData = useVitalSign(hr.base, hr.fluctuation, ecgPattern, hr.speed);
  const bpData = useVitalSign(bp.base, bp.fluctuation, bpPattern, bp.speed);
  const spo2Data = useVitalSign(spo2.base, spo2.fluctuation, spo2Pattern, spo2.speed);
  const respData = useVitalSign(resp.base, resp.fluctuation, respPattern, resp.speed);

  // Effect to report vitals up to the parent component
  useEffect(() => {
    const interval = setInterval(() => {
      onVitalsChange({
        hr: hrData[hrData.length - 1] || hr.base,
        bp: bpData[bpData.length - 1] || bp.base,
        spo2: spo2Data[spo2Data.length - 1] || spo2.base,
        resp: respData[respData.length - 1] || resp.base,
      });
    }, 1000); // Report every second
    return () => clearInterval(interval);
  }, [onVitalsChange, hrData, bpData, spo2Data, respData, hr.base, bp.base, spo2.base, resp.base]);


  return (
    <Card className="bg-card/90 backdrop-blur-sm border-border/50 h-full">
      <CardHeader>
        <CardTitle>Vitals Monitor</CardTitle>
        <CardDescription>Real-time physiological data for {patient.name}.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <VitalChart title="Heart Rate" unit="bpm" data={hrData} color="hsl(var(--chart-1))" Icon={HeartPulse} yDomain={hr.yDomain} />
          <VitalChart title="Systolic BP" unit="mmHg" data={bpData} color="hsl(var(--chart-2))" Icon={Gauge} yDomain={bp.yDomain} />
          <VitalChart title="SpO2" unit="%" data={spo2Data} color="hsl(var(--chart-3))" Icon={Waves} yDomain={spo2.yDomain} />
          <VitalChart title="Respiration" unit="/min" data={respData} color="hsl(var(--chart-4))" Icon={Wind} yDomain={resp.yDomain} />
        </div>
      </CardContent>
    </Card>
  );
}
