const { queryRef, executeQuery, mutationRef, executeMutation, validateArgs } = require('firebase/data-connect');

const connectorConfig = {
  connector: 'example',
  service: 'studio',
  location: 'asia-east1'
};
exports.connectorConfig = connectorConfig;

const createPatientCaseRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreatePatientCase', inputVars);
}
createPatientCaseRef.operationName = 'CreatePatientCase';
exports.createPatientCaseRef = createPatientCaseRef;

exports.createPatientCase = function createPatientCase(dcOrVars, vars) {
  return executeMutation(createPatientCaseRef(dcOrVars, vars));
};

const getPatientCaseRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetPatientCase', inputVars);
}
getPatientCaseRef.operationName = 'GetPatientCase';
exports.getPatientCaseRef = getPatientCaseRef;

exports.getPatientCase = function getPatientCase(dcOrVars, vars) {
  return executeQuery(getPatientCaseRef(dcOrVars, vars));
};

const addSymptomEntryRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'AddSymptomEntry', inputVars);
}
addSymptomEntryRef.operationName = 'AddSymptomEntry';
exports.addSymptomEntryRef = addSymptomEntryRef;

exports.addSymptomEntry = function addSymptomEntry(dcOrVars, vars) {
  return executeMutation(addSymptomEntryRef(dcOrVars, vars));
};

const listPatientCasesCreatedByUserRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListPatientCasesCreatedByUser', inputVars);
}
listPatientCasesCreatedByUserRef.operationName = 'ListPatientCasesCreatedByUser';
exports.listPatientCasesCreatedByUserRef = listPatientCasesCreatedByUserRef;

exports.listPatientCasesCreatedByUser = function listPatientCasesCreatedByUser(dcOrVars, vars) {
  return executeQuery(listPatientCasesCreatedByUserRef(dcOrVars, vars));
};
