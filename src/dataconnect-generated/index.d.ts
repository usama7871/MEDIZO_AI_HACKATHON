import { ConnectorConfig, DataConnect, QueryRef, QueryPromise, MutationRef, MutationPromise } from 'firebase/data-connect';

export const connectorConfig: ConnectorConfig;

export type TimestampString = string;
export type UUIDString = string;
export type Int64String = string;
export type DateString = string;




export interface AIDiagnosis_Key {
  id: UUIDString;
  __typename?: 'AIDiagnosis_Key';
}

export interface AddSymptomEntryData {
  symptomEntry_insert: SymptomEntry_Key;
}

export interface AddSymptomEntryVariables {
  patientCaseId: UUIDString;
  symptomName: string;
  severity: string;
  onsetDate: DateString;
}

export interface Collaboration_Key {
  id: UUIDString;
  __typename?: 'Collaboration_Key';
}

export interface CreatePatientCaseData {
  patientCase_insert: PatientCase_Key;
}

export interface CreatePatientCaseVariables {
  creatorId: UUIDString;
  patientIdentifier: string;
  status: string;
}

export interface GetPatientCaseData {
  patientCase?: {
    id: UUIDString;
    patientIdentifier: string;
    status: string;
    creator: {
      id: UUIDString;
      displayName: string;
      email: string;
    } & User_Key;
  } & PatientCase_Key;
}

export interface GetPatientCaseVariables {
  id: UUIDString;
}

export interface LabResult_Key {
  id: UUIDString;
  __typename?: 'LabResult_Key';
}

export interface ListPatientCasesCreatedByUserData {
  patientCases: ({
    id: UUIDString;
    patientIdentifier: string;
    status: string;
  } & PatientCase_Key)[];
}

export interface ListPatientCasesCreatedByUserVariables {
  creatorId: UUIDString;
}

export interface PatientCase_Key {
  id: UUIDString;
  __typename?: 'PatientCase_Key';
}

export interface SymptomEntry_Key {
  id: UUIDString;
  __typename?: 'SymptomEntry_Key';
}

export interface User_Key {
  id: UUIDString;
  __typename?: 'User_Key';
}

interface CreatePatientCaseRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreatePatientCaseVariables): MutationRef<CreatePatientCaseData, CreatePatientCaseVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreatePatientCaseVariables): MutationRef<CreatePatientCaseData, CreatePatientCaseVariables>;
  operationName: string;
}
export const createPatientCaseRef: CreatePatientCaseRef;

export function createPatientCase(vars: CreatePatientCaseVariables): MutationPromise<CreatePatientCaseData, CreatePatientCaseVariables>;
export function createPatientCase(dc: DataConnect, vars: CreatePatientCaseVariables): MutationPromise<CreatePatientCaseData, CreatePatientCaseVariables>;

interface GetPatientCaseRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetPatientCaseVariables): QueryRef<GetPatientCaseData, GetPatientCaseVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetPatientCaseVariables): QueryRef<GetPatientCaseData, GetPatientCaseVariables>;
  operationName: string;
}
export const getPatientCaseRef: GetPatientCaseRef;

export function getPatientCase(vars: GetPatientCaseVariables): QueryPromise<GetPatientCaseData, GetPatientCaseVariables>;
export function getPatientCase(dc: DataConnect, vars: GetPatientCaseVariables): QueryPromise<GetPatientCaseData, GetPatientCaseVariables>;

interface AddSymptomEntryRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: AddSymptomEntryVariables): MutationRef<AddSymptomEntryData, AddSymptomEntryVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: AddSymptomEntryVariables): MutationRef<AddSymptomEntryData, AddSymptomEntryVariables>;
  operationName: string;
}
export const addSymptomEntryRef: AddSymptomEntryRef;

export function addSymptomEntry(vars: AddSymptomEntryVariables): MutationPromise<AddSymptomEntryData, AddSymptomEntryVariables>;
export function addSymptomEntry(dc: DataConnect, vars: AddSymptomEntryVariables): MutationPromise<AddSymptomEntryData, AddSymptomEntryVariables>;

interface ListPatientCasesCreatedByUserRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: ListPatientCasesCreatedByUserVariables): QueryRef<ListPatientCasesCreatedByUserData, ListPatientCasesCreatedByUserVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: ListPatientCasesCreatedByUserVariables): QueryRef<ListPatientCasesCreatedByUserData, ListPatientCasesCreatedByUserVariables>;
  operationName: string;
}
export const listPatientCasesCreatedByUserRef: ListPatientCasesCreatedByUserRef;

export function listPatientCasesCreatedByUser(vars: ListPatientCasesCreatedByUserVariables): QueryPromise<ListPatientCasesCreatedByUserData, ListPatientCasesCreatedByUserVariables>;
export function listPatientCasesCreatedByUser(dc: DataConnect, vars: ListPatientCasesCreatedByUserVariables): QueryPromise<ListPatientCasesCreatedByUserData, ListPatientCasesCreatedByUserVariables>;

