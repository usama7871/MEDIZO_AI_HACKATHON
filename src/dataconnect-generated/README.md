# Generated TypeScript README
This README will guide you through the process of using the generated JavaScript SDK package for the connector `example`. It will also provide examples on how to use your generated SDK to call your Data Connect queries and mutations.

**If you're looking for the `React README`, you can find it at [`dataconnect-generated/react/README.md`](./react/README.md)**

***NOTE:** This README is generated alongside the generated SDK. If you make changes to this file, they will be overwritten when the SDK is regenerated.*

# Table of Contents
- [**Overview**](#generated-javascript-readme)
- [**Accessing the connector**](#accessing-the-connector)
  - [*Connecting to the local Emulator*](#connecting-to-the-local-emulator)
- [**Queries**](#queries)
  - [*GetPatientCase*](#getpatientcase)
  - [*ListPatientCasesCreatedByUser*](#listpatientcasescreatedbyuser)
- [**Mutations**](#mutations)
  - [*CreatePatientCase*](#createpatientcase)
  - [*AddSymptomEntry*](#addsymptomentry)

# Accessing the connector
A connector is a collection of Queries and Mutations. One SDK is generated for each connector - this SDK is generated for the connector `example`. You can find more information about connectors in the [Data Connect documentation](https://firebase.google.com/docs/data-connect#how-does).

You can use this generated SDK by importing from the package `@dataconnect/generated` as shown below. Both CommonJS and ESM imports are supported.

You can also follow the instructions from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#set-client).

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@dataconnect/generated';

const dataConnect = getDataConnect(connectorConfig);
```

## Connecting to the local Emulator
By default, the connector will connect to the production service.

To connect to the emulator, you can use the following code.
You can also follow the emulator instructions from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#instrument-clients).

```typescript
import { connectDataConnectEmulator, getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@dataconnect/generated';

const dataConnect = getDataConnect(connectorConfig);
connectDataConnectEmulator(dataConnect, 'localhost', 9399);
```

After it's initialized, you can call your Data Connect [queries](#queries) and [mutations](#mutations) from your generated SDK.

# Queries

There are two ways to execute a Data Connect Query using the generated Web SDK:
- Using a Query Reference function, which returns a `QueryRef`
  - The `QueryRef` can be used as an argument to `executeQuery()`, which will execute the Query and return a `QueryPromise`
- Using an action shortcut function, which returns a `QueryPromise`
  - Calling the action shortcut function will execute the Query and return a `QueryPromise`

The following is true for both the action shortcut function and the `QueryRef` function:
- The `QueryPromise` returned will resolve to the result of the Query once it has finished executing
- If the Query accepts arguments, both the action shortcut function and the `QueryRef` function accept a single argument: an object that contains all the required variables (and the optional variables) for the Query
- Both functions can be called with or without passing in a `DataConnect` instance as an argument. If no `DataConnect` argument is passed in, then the generated SDK will call `getDataConnect(connectorConfig)` behind the scenes for you.

Below are examples of how to use the `example` connector's generated functions to execute each query. You can also follow the examples from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#using-queries).

## GetPatientCase
You can execute the `GetPatientCase` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
getPatientCase(vars: GetPatientCaseVariables): QueryPromise<GetPatientCaseData, GetPatientCaseVariables>;

interface GetPatientCaseRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetPatientCaseVariables): QueryRef<GetPatientCaseData, GetPatientCaseVariables>;
}
export const getPatientCaseRef: GetPatientCaseRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getPatientCase(dc: DataConnect, vars: GetPatientCaseVariables): QueryPromise<GetPatientCaseData, GetPatientCaseVariables>;

interface GetPatientCaseRef {
  ...
  (dc: DataConnect, vars: GetPatientCaseVariables): QueryRef<GetPatientCaseData, GetPatientCaseVariables>;
}
export const getPatientCaseRef: GetPatientCaseRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getPatientCaseRef:
```typescript
const name = getPatientCaseRef.operationName;
console.log(name);
```

### Variables
The `GetPatientCase` query requires an argument of type `GetPatientCaseVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetPatientCaseVariables {
  id: UUIDString;
}
```
### Return Type
Recall that executing the `GetPatientCase` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetPatientCaseData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
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
```
### Using `GetPatientCase`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getPatientCase, GetPatientCaseVariables } from '@dataconnect/generated';

// The `GetPatientCase` query requires an argument of type `GetPatientCaseVariables`:
const getPatientCaseVars: GetPatientCaseVariables = {
  id: ..., 
};

// Call the `getPatientCase()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getPatientCase(getPatientCaseVars);
// Variables can be defined inline as well.
const { data } = await getPatientCase({ id: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getPatientCase(dataConnect, getPatientCaseVars);

console.log(data.patientCase);

// Or, you can use the `Promise` API.
getPatientCase(getPatientCaseVars).then((response) => {
  const data = response.data;
  console.log(data.patientCase);
});
```

### Using `GetPatientCase`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getPatientCaseRef, GetPatientCaseVariables } from '@dataconnect/generated';

// The `GetPatientCase` query requires an argument of type `GetPatientCaseVariables`:
const getPatientCaseVars: GetPatientCaseVariables = {
  id: ..., 
};

// Call the `getPatientCaseRef()` function to get a reference to the query.
const ref = getPatientCaseRef(getPatientCaseVars);
// Variables can be defined inline as well.
const ref = getPatientCaseRef({ id: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getPatientCaseRef(dataConnect, getPatientCaseVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.patientCase);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.patientCase);
});
```

## ListPatientCasesCreatedByUser
You can execute the `ListPatientCasesCreatedByUser` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
listPatientCasesCreatedByUser(vars: ListPatientCasesCreatedByUserVariables): QueryPromise<ListPatientCasesCreatedByUserData, ListPatientCasesCreatedByUserVariables>;

interface ListPatientCasesCreatedByUserRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: ListPatientCasesCreatedByUserVariables): QueryRef<ListPatientCasesCreatedByUserData, ListPatientCasesCreatedByUserVariables>;
}
export const listPatientCasesCreatedByUserRef: ListPatientCasesCreatedByUserRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listPatientCasesCreatedByUser(dc: DataConnect, vars: ListPatientCasesCreatedByUserVariables): QueryPromise<ListPatientCasesCreatedByUserData, ListPatientCasesCreatedByUserVariables>;

interface ListPatientCasesCreatedByUserRef {
  ...
  (dc: DataConnect, vars: ListPatientCasesCreatedByUserVariables): QueryRef<ListPatientCasesCreatedByUserData, ListPatientCasesCreatedByUserVariables>;
}
export const listPatientCasesCreatedByUserRef: ListPatientCasesCreatedByUserRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listPatientCasesCreatedByUserRef:
```typescript
const name = listPatientCasesCreatedByUserRef.operationName;
console.log(name);
```

### Variables
The `ListPatientCasesCreatedByUser` query requires an argument of type `ListPatientCasesCreatedByUserVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface ListPatientCasesCreatedByUserVariables {
  creatorId: UUIDString;
}
```
### Return Type
Recall that executing the `ListPatientCasesCreatedByUser` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListPatientCasesCreatedByUserData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface ListPatientCasesCreatedByUserData {
  patientCases: ({
    id: UUIDString;
    patientIdentifier: string;
    status: string;
  } & PatientCase_Key)[];
}
```
### Using `ListPatientCasesCreatedByUser`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listPatientCasesCreatedByUser, ListPatientCasesCreatedByUserVariables } from '@dataconnect/generated';

// The `ListPatientCasesCreatedByUser` query requires an argument of type `ListPatientCasesCreatedByUserVariables`:
const listPatientCasesCreatedByUserVars: ListPatientCasesCreatedByUserVariables = {
  creatorId: ..., 
};

// Call the `listPatientCasesCreatedByUser()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listPatientCasesCreatedByUser(listPatientCasesCreatedByUserVars);
// Variables can be defined inline as well.
const { data } = await listPatientCasesCreatedByUser({ creatorId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listPatientCasesCreatedByUser(dataConnect, listPatientCasesCreatedByUserVars);

console.log(data.patientCases);

// Or, you can use the `Promise` API.
listPatientCasesCreatedByUser(listPatientCasesCreatedByUserVars).then((response) => {
  const data = response.data;
  console.log(data.patientCases);
});
```

### Using `ListPatientCasesCreatedByUser`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listPatientCasesCreatedByUserRef, ListPatientCasesCreatedByUserVariables } from '@dataconnect/generated';

// The `ListPatientCasesCreatedByUser` query requires an argument of type `ListPatientCasesCreatedByUserVariables`:
const listPatientCasesCreatedByUserVars: ListPatientCasesCreatedByUserVariables = {
  creatorId: ..., 
};

// Call the `listPatientCasesCreatedByUserRef()` function to get a reference to the query.
const ref = listPatientCasesCreatedByUserRef(listPatientCasesCreatedByUserVars);
// Variables can be defined inline as well.
const ref = listPatientCasesCreatedByUserRef({ creatorId: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listPatientCasesCreatedByUserRef(dataConnect, listPatientCasesCreatedByUserVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.patientCases);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.patientCases);
});
```

# Mutations

There are two ways to execute a Data Connect Mutation using the generated Web SDK:
- Using a Mutation Reference function, which returns a `MutationRef`
  - The `MutationRef` can be used as an argument to `executeMutation()`, which will execute the Mutation and return a `MutationPromise`
- Using an action shortcut function, which returns a `MutationPromise`
  - Calling the action shortcut function will execute the Mutation and return a `MutationPromise`

The following is true for both the action shortcut function and the `MutationRef` function:
- The `MutationPromise` returned will resolve to the result of the Mutation once it has finished executing
- If the Mutation accepts arguments, both the action shortcut function and the `MutationRef` function accept a single argument: an object that contains all the required variables (and the optional variables) for the Mutation
- Both functions can be called with or without passing in a `DataConnect` instance as an argument. If no `DataConnect` argument is passed in, then the generated SDK will call `getDataConnect(connectorConfig)` behind the scenes for you.

Below are examples of how to use the `example` connector's generated functions to execute each mutation. You can also follow the examples from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#using-mutations).

## CreatePatientCase
You can execute the `CreatePatientCase` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
createPatientCase(vars: CreatePatientCaseVariables): MutationPromise<CreatePatientCaseData, CreatePatientCaseVariables>;

interface CreatePatientCaseRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreatePatientCaseVariables): MutationRef<CreatePatientCaseData, CreatePatientCaseVariables>;
}
export const createPatientCaseRef: CreatePatientCaseRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createPatientCase(dc: DataConnect, vars: CreatePatientCaseVariables): MutationPromise<CreatePatientCaseData, CreatePatientCaseVariables>;

interface CreatePatientCaseRef {
  ...
  (dc: DataConnect, vars: CreatePatientCaseVariables): MutationRef<CreatePatientCaseData, CreatePatientCaseVariables>;
}
export const createPatientCaseRef: CreatePatientCaseRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createPatientCaseRef:
```typescript
const name = createPatientCaseRef.operationName;
console.log(name);
```

### Variables
The `CreatePatientCase` mutation requires an argument of type `CreatePatientCaseVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface CreatePatientCaseVariables {
  creatorId: UUIDString;
  patientIdentifier: string;
  status: string;
}
```
### Return Type
Recall that executing the `CreatePatientCase` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreatePatientCaseData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreatePatientCaseData {
  patientCase_insert: PatientCase_Key;
}
```
### Using `CreatePatientCase`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createPatientCase, CreatePatientCaseVariables } from '@dataconnect/generated';

// The `CreatePatientCase` mutation requires an argument of type `CreatePatientCaseVariables`:
const createPatientCaseVars: CreatePatientCaseVariables = {
  creatorId: ..., 
  patientIdentifier: ..., 
  status: ..., 
};

// Call the `createPatientCase()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createPatientCase(createPatientCaseVars);
// Variables can be defined inline as well.
const { data } = await createPatientCase({ creatorId: ..., patientIdentifier: ..., status: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createPatientCase(dataConnect, createPatientCaseVars);

console.log(data.patientCase_insert);

// Or, you can use the `Promise` API.
createPatientCase(createPatientCaseVars).then((response) => {
  const data = response.data;
  console.log(data.patientCase_insert);
});
```

### Using `CreatePatientCase`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createPatientCaseRef, CreatePatientCaseVariables } from '@dataconnect/generated';

// The `CreatePatientCase` mutation requires an argument of type `CreatePatientCaseVariables`:
const createPatientCaseVars: CreatePatientCaseVariables = {
  creatorId: ..., 
  patientIdentifier: ..., 
  status: ..., 
};

// Call the `createPatientCaseRef()` function to get a reference to the mutation.
const ref = createPatientCaseRef(createPatientCaseVars);
// Variables can be defined inline as well.
const ref = createPatientCaseRef({ creatorId: ..., patientIdentifier: ..., status: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createPatientCaseRef(dataConnect, createPatientCaseVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.patientCase_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.patientCase_insert);
});
```

## AddSymptomEntry
You can execute the `AddSymptomEntry` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
addSymptomEntry(vars: AddSymptomEntryVariables): MutationPromise<AddSymptomEntryData, AddSymptomEntryVariables>;

interface AddSymptomEntryRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: AddSymptomEntryVariables): MutationRef<AddSymptomEntryData, AddSymptomEntryVariables>;
}
export const addSymptomEntryRef: AddSymptomEntryRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
addSymptomEntry(dc: DataConnect, vars: AddSymptomEntryVariables): MutationPromise<AddSymptomEntryData, AddSymptomEntryVariables>;

interface AddSymptomEntryRef {
  ...
  (dc: DataConnect, vars: AddSymptomEntryVariables): MutationRef<AddSymptomEntryData, AddSymptomEntryVariables>;
}
export const addSymptomEntryRef: AddSymptomEntryRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the addSymptomEntryRef:
```typescript
const name = addSymptomEntryRef.operationName;
console.log(name);
```

### Variables
The `AddSymptomEntry` mutation requires an argument of type `AddSymptomEntryVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface AddSymptomEntryVariables {
  patientCaseId: UUIDString;
  symptomName: string;
  severity: string;
  onsetDate: DateString;
}
```
### Return Type
Recall that executing the `AddSymptomEntry` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `AddSymptomEntryData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface AddSymptomEntryData {
  symptomEntry_insert: SymptomEntry_Key;
}
```
### Using `AddSymptomEntry`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, addSymptomEntry, AddSymptomEntryVariables } from '@dataconnect/generated';

// The `AddSymptomEntry` mutation requires an argument of type `AddSymptomEntryVariables`:
const addSymptomEntryVars: AddSymptomEntryVariables = {
  patientCaseId: ..., 
  symptomName: ..., 
  severity: ..., 
  onsetDate: ..., 
};

// Call the `addSymptomEntry()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await addSymptomEntry(addSymptomEntryVars);
// Variables can be defined inline as well.
const { data } = await addSymptomEntry({ patientCaseId: ..., symptomName: ..., severity: ..., onsetDate: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await addSymptomEntry(dataConnect, addSymptomEntryVars);

console.log(data.symptomEntry_insert);

// Or, you can use the `Promise` API.
addSymptomEntry(addSymptomEntryVars).then((response) => {
  const data = response.data;
  console.log(data.symptomEntry_insert);
});
```

### Using `AddSymptomEntry`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, addSymptomEntryRef, AddSymptomEntryVariables } from '@dataconnect/generated';

// The `AddSymptomEntry` mutation requires an argument of type `AddSymptomEntryVariables`:
const addSymptomEntryVars: AddSymptomEntryVariables = {
  patientCaseId: ..., 
  symptomName: ..., 
  severity: ..., 
  onsetDate: ..., 
};

// Call the `addSymptomEntryRef()` function to get a reference to the mutation.
const ref = addSymptomEntryRef(addSymptomEntryVars);
// Variables can be defined inline as well.
const ref = addSymptomEntryRef({ patientCaseId: ..., symptomName: ..., severity: ..., onsetDate: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = addSymptomEntryRef(dataConnect, addSymptomEntryVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.symptomEntry_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.symptomEntry_insert);
});
```

