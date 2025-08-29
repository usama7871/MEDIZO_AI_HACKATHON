'use client';

import { useState, useEffect } from 'react';
import VitalChart from './vital-chart';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { HeartPulse, Gauge, Wind, Waves } from 'lucide-react';

const VITAL_DATA_LENGTH = 30;

const generateInitialData = (baseValue: number, fluctuation: number) => {
  return Array.from({ length: VITAL_DATA_LENGTH }, (_, i) => ({
    time: `${i}`,
    value: Math.round(baseValue + (Math.random() - 0.5) * fluctuation),
  }));
};

const generateNewDataPoint = (currentValue: number, fluctuation: number, min: number, max: number) => {
  let newValue = currentValue + (Math.random() - 0.5) * fluctuation;
  newValue = Math.max(min, Math.min(max, newValue));
  return Math.round(newValue);
};

export default function VitalsMonitor() {
  const [hrData, setHrData] = useState(generateInitialData(85, 4));
  const [bpData, setBpData] = useState(generateInitialData(120, 8));
  const [spo2Data, setSpo2Data] = useState(generateInitialData(96, 1));
  const [respData, setRespData] = useState(generateInitialData(18, 2));

  useEffect(() => {
    const interval = setInterval(() => {
      setHrData(prev => {
        const newValue = generateNewDataPoint(prev[prev.length - 1].value, 2, 60, 120);
        return [...prev.slice(1), { time: `${parseInt(prev[prev.length-1].time) + 1}`, value: newValue }];
      });
      setBpData(prev => {
        const newValue = generateNewDataPoint(prev[prev.length - 1].value, 4, 90, 160);
         return [...prev.slice(1), { time: `${parseInt(prev[prev.length-1].time) + 1}`, value: newValue }];
      });
      setSpo2Data(prev => {
        const newValue = generateNewDataPoint(prev[prev.length - 1].value, 0.5, 92, 100);
         return [...prev.slice(1), { time: `${parseInt(prev[prev.length-1].time) + 1}`, value: newValue }];
      });
      setRespData(prev => {
        const newValue = generateNewDataPoint(prev[prev.length - 1].value, 1, 12, 24);
        return [...prev.slice(1), { time: `${parseInt(prev[prev.length-1].time) + 1}`, value: newValue }];
      });
    }, 1500);

    return () => clearInterval(interval);
  }, []);

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
