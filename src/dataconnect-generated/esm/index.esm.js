import { queryRef, executeQuery, mutationRef, executeMutation, validateArgs } from 'firebase/data-connect';

export const connectorConfig = {
  connector: 'example',
  service: 'studio',
  location: 'asia-east1'
};

export const createPatientCaseRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreatePatientCase', inputVars);
}
createPatientCaseRef.operationName = 'CreatePatientCase';

export function createPatientCase(dcOrVars, vars) {
  return executeMutation(createPatientCaseRef(dcOrVars, vars));
}

export const getPatientCaseRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetPatientCase', inputVars);
}
getPatientCaseRef.operationName = 'GetPatientCase';

export function getPatientCase(dcOrVars, vars) {
  return executeQuery(getPatientCaseRef(dcOrVars, vars));
}

export const addSymptomEntryRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'AddSymptomEntry', inputVars);
}
addSymptomEntryRef.operationName = 'AddSymptomEntry';

export function addSymptomEntry(dcOrVars, vars) {
  return executeMutation(addSymptomEntryRef(dcOrVars, vars));
}

export const listPatientCasesCreatedByUserRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListPatientCasesCreatedByUser', inputVars);
}
listPatientCasesCreatedByUserRef.operationName = 'ListPatientCasesCreatedByUser';

export function listPatientCasesCreatedByUser(dcOrVars, vars) {
  return executeQuery(listPatientCasesCreatedByUserRef(dcOrVars, vars));
}

