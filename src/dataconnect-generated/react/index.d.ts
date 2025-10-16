import { CreatePatientCaseData, CreatePatientCaseVariables, GetPatientCaseData, GetPatientCaseVariables, AddSymptomEntryData, AddSymptomEntryVariables, ListPatientCasesCreatedByUserData, ListPatientCasesCreatedByUserVariables } from '../';
import { UseDataConnectQueryResult, useDataConnectQueryOptions, UseDataConnectMutationResult, useDataConnectMutationOptions} from '@tanstack-query-firebase/react/data-connect';
import { UseQueryResult, UseMutationResult} from '@tanstack/react-query';
import { DataConnect } from 'firebase/data-connect';
import { FirebaseError } from 'firebase/app';


export function useCreatePatientCase(options?: useDataConnectMutationOptions<CreatePatientCaseData, FirebaseError, CreatePatientCaseVariables>): UseDataConnectMutationResult<CreatePatientCaseData, CreatePatientCaseVariables>;
export function useCreatePatientCase(dc: DataConnect, options?: useDataConnectMutationOptions<CreatePatientCaseData, FirebaseError, CreatePatientCaseVariables>): UseDataConnectMutationResult<CreatePatientCaseData, CreatePatientCaseVariables>;

export function useGetPatientCase(vars: GetPatientCaseVariables, options?: useDataConnectQueryOptions<GetPatientCaseData>): UseDataConnectQueryResult<GetPatientCaseData, GetPatientCaseVariables>;
export function useGetPatientCase(dc: DataConnect, vars: GetPatientCaseVariables, options?: useDataConnectQueryOptions<GetPatientCaseData>): UseDataConnectQueryResult<GetPatientCaseData, GetPatientCaseVariables>;

export function useAddSymptomEntry(options?: useDataConnectMutationOptions<AddSymptomEntryData, FirebaseError, AddSymptomEntryVariables>): UseDataConnectMutationResult<AddSymptomEntryData, AddSymptomEntryVariables>;
export function useAddSymptomEntry(dc: DataConnect, options?: useDataConnectMutationOptions<AddSymptomEntryData, FirebaseError, AddSymptomEntryVariables>): UseDataConnectMutationResult<AddSymptomEntryData, AddSymptomEntryVariables>;

export function useListPatientCasesCreatedByUser(vars: ListPatientCasesCreatedByUserVariables, options?: useDataConnectQueryOptions<ListPatientCasesCreatedByUserData>): UseDataConnectQueryResult<ListPatientCasesCreatedByUserData, ListPatientCasesCreatedByUserVariables>;
export function useListPatientCasesCreatedByUser(dc: DataConnect, vars: ListPatientCasesCreatedByUserVariables, options?: useDataConnectQueryOptions<ListPatientCasesCreatedByUserData>): UseDataConnectQueryResult<ListPatientCasesCreatedByUserData, ListPatientCasesCreatedByUserVariables>;
