'use client';

import { useState, useEffect, useMemo, useRef, memo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { HeartPulse, Gauge, Wind, Waves } from 'lucide-react';
import { cn } from '@/lib/utils';

// --- Constants ---
const VITAL_DATA_LENGTH = 150; // More data points for a smoother, longer wave
const TICK_RATE_MS = 50; // Faster updates for smoother animation

// --- Waveform Patterns (more detailed) ---
const createEcgPattern = () => [0,0,0,0.1,0.2,0.1,0,-0.5,2.8,-1.5,0.3,0.1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
const createBpPattern = () => [0.7,0.8,0.9,1,0.95,0.85,0.8,0.75,0.78,0.72,0.6,0.5,0.4,0.3,0.2,0.2,0.3,0.4,0.5,0.6];
const createRespPattern = () => Array.from({ length: 40 }, (_, i) => (Math.sin((i / 39) * Math.PI) * 0.8) + 0.1);
const createSpo2Pattern = () => [0.5,0.6,0.8,0.95,1,0.9,0.7,0.6,0.55,0.52,0.5,0.5,0.5,0.5,0.5,0.5,0.5,0.5,0.5,0.5,0.5,0.5,0.5,0.5];

// --- Custom Hook for Vital Sign Simulation ---
const useVitalSign = (baseValue: number, fluctuation: number, min: number, max: number, pattern: number[], speed: number) => {
    const [data, setData] = useState<number[]>([]);
    const patternIndexRef = useRef(0);

    useEffect(() => {
        // Initialize data on the client-side
        setData(Array(VITAL_DATA_LENGTH).fill(baseValue));
        
        const interval = setInterval(() => {
            const patternValue = pattern[patternIndexRef.current];
            const noise = (Math.random() - 0.5) * fluctuation;
            let newValue = baseValue + (patternValue * fluctuation * (pattern === createEcgPattern() ? 6 : 4)) + noise;
            newValue = Math.max(min, Math.min(max, newValue));

            setData(prev => [...prev.slice(1), newValue]);

            patternIndexRef.current = (patternIndexRef.current + 1) % pattern.length;
        }, TICK_RATE_MS * (1 / speed));

        return () => clearInterval(interval);
    }, [baseValue, fluctuation, min, max, pattern, speed]);

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
        <Card className="flex flex-col bg-muted/30 border-border/30 overflow-hidden">
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
                     <SvgWaveform data={data} color={color} yDomain={yDomain} />
                </div>
            </CardContent>
        </Card>
    );
};

// --- Main Vitals Monitor Component ---
export default function VitalsMonitor() {
  const ecgPattern = useMemo(() => createEcgPattern(), []);
  const bpPattern = useMemo(() => createBpPattern(), []);
  const respPattern = useMemo(() => createRespPattern(), []);
  const spo2Pattern = useMemo(() => createSpo2Pattern(), []);

  // Simulating a patient in distress
  const hrData = useVitalSign(110, 1.5, 80, 140, ecgPattern, 2.5);
  const bpData = useVitalSign(95, 2.5, 80, 120, bpPattern, 2.5);
  const spo2Data = useVitalSign(93, 0.5, 90, 98, spo2Pattern, 2.5);
  const respData = useVitalSign(24, 1, 18, 30, respPattern, 1);

  return (
    <Card className="bg-card/80 backdrop-blur-sm border-border/50 shadow-lg shadow-black/20">
      <CardHeader>
        <CardTitle>Vitals Monitor</CardTitle>
        <CardDescription>Real-time physiological data from the patient.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <VitalChart title="Heart Rate" unit="bpm" data={hrData} color="hsl(var(--chart-1))" Icon={HeartPulse} yDomain={[50, 150]} />
          <VitalChart title="Systolic BP" unit="mmHg" data={bpData} color="hsl(var(--chart-2))" Icon={Gauge} yDomain={[70, 130]} />
          <VitalChart title="SpO2" unit="%" data={spo2Data} color="hsl(var(--chart-3))" Icon={Waves} yDomain={[85, 100]} />
          <VitalChart title="Respiration" unit="/min" data={respData} color="hsl(var(--chart-4))" Icon={Wind} yDomain={[10, 35]} />
        </div>
      </CardContent>
    </Card>
  );
}
