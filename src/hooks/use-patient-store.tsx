
'use client';

import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { GeneratePersonalizedScenarioOutput } from '@/ai/flows/generate-personalized-scenario';
import { useUserStore } from './use-user-store.tsx';

export type Patient = {
  id: string; // This ID will match the corresponding User ID for the patient
  doctorId: string;
  name: string;
  age: number;
  gender: string;
  primaryCondition: string;
  history: string;
  scenario: GeneratePersonalizedScenarioOutput;
};

// Initial mock patient data
const initialPatients: Patient[] = [
  {
    id: 'pat-001', // This ID matches the patient user's ID
    doctorId: 'doc-001',
    name: 'John Smith',
    age: 72,
    gender: 'Male',
    primaryCondition: 'Acute Myocardial Infarction',
    history: 'History of hypertension, hyperlipidemia, and a 30-pack-year smoking history.',
    scenario: {
      scenarioDescription: 'A 72-year-old male with a history of hypertension and hyperlipidemia presents to the emergency department with severe, crushing chest pain that started 2 hours ago. The pain radiates to his left arm and is associated with diaphoresis and nausea.',
      learningObjectives: [
        'Rapidly diagnose and manage ST-elevation myocardial infarction (STEMI).',
        'Initiate appropriate reperfusion therapy.',
        'Manage acute complications of MI.'
      ],
      comorbidities: 'Hypertension, Hyperlipidemia',
    }
  }
];

type PatientStore = {
  patients: Patient[];
  setPatients: (patients: Patient[]) => void;
  addPatient: (patient: Patient) => void;
  updatePatient: (patient: Patient) => void;
  activePatient: Patient | null;
  setActivePatient: (patientId: string | null) => void;
};

const PatientContext = createContext<PatientStore | null>(null);

export function PatientProvider({ children }: { children: React.ReactNode }) {
  const [patients, setPatientsState] = useState<Patient[]>([]);
  const [activePatient, setActivePatientState] = useState<Patient | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const { currentUser } = useUserStore();

  useEffect(() => {
    try {
      const storedPatients = localStorage.getItem('patients');
      if (storedPatients) {
        setPatientsState(JSON.parse(storedPatients));
      } else {
        setPatientsState(initialPatients);
        localStorage.setItem('patients', JSON.stringify(initialPatients));
      }
    } catch (error) {
      console.error("Failed to parse patients from localStorage", error);
      setPatientsState(initialPatients);
    }
    setIsInitialized(true);
  }, []);

  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem('patients', JSON.stringify(patients));
    }
  }, [patients, isInitialized]);

  const setPatients = (newPatients: Patient[]) => {
    setPatientsState(newPatients);
  };
  
  const addPatient = (patient: Patient) => {
    setPatientsState(prev => [...prev, patient]);
  };

  const updatePatient = (updatedPatient: Patient) => {
    setPatientsState(prev => prev.map(p => p.id === updatedPatient.id ? updatedPatient : p));
    if (activePatient?.id === updatedPatient.id) {
        setActivePatientState(updatedPatient);
    }
  }

  const setActivePatient = useCallback((patientId: string | null) => {
    if (patientId === null) {
      setActivePatientState(null);
      if (currentUser) {
         localStorage.removeItem(`activePatient_${currentUser.id}`);
      }
      return;
    }
    
    const patient = patients.find(p => p.id === patientId);
    if (patient) {
      setActivePatientState(patient);
      localStorage.setItem(`activePatient_${patient.doctorId}`, patient.id);
    }
  }, [patients, currentUser]);
  
  // Effect to load the active patient for the current user on startup
  useEffect(() => {
    if (isInitialized && currentUser) {
        if (currentUser.role === 'doctor') {
            const activeId = localStorage.getItem(`activePatient_${currentUser.id}`);
            if (activeId) {
                const patient = patients.find(p => p.id === activeId);
                setActivePatientState(patient || null);
            }
        }
    }
  }, [isInitialized, currentUser, patients]);


  return (
    <PatientContext.Provider value={{ patients, setPatients, addPatient, updatePatient, activePatient, setActivePatient }}>
      {children}
    </PatientContext.Provider>
  );
}

export function usePatientStore() {
  const context = useContext(PatientContext);
  if (!context) {
    throw new Error('usePatientStore must be used within a PatientProvider');
  }
  return context;
}
