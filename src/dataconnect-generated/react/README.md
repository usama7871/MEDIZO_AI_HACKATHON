# Generated React README
This README will guide you through the process of using the generated React SDK package for the connector `example`. It will also provide examples on how to use your generated SDK to call your Data Connect queries and mutations.

**If you're looking for the `JavaScript README`, you can find it at [`dataconnect-generated/README.md`](../README.md)**

***NOTE:** This README is generated alongside the generated SDK. If you make changes to this file, they will be overwritten when the SDK is regenerated.*

You can use this generated SDK by importing from the package `@dataconnect/generated/react` as shown below. Both CommonJS and ESM imports are supported.

You can also follow the instructions from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#react).

# Table of Contents
- [**Overview**](#generated-react-readme)
- [**TanStack Query Firebase & TanStack React Query**](#tanstack-query-firebase-tanstack-react-query)
  - [*Package Installation*](#installing-tanstack-query-firebase-and-tanstack-react-query-packages)
  - [*Configuring TanStack Query*](#configuring-tanstack-query)
- [**Accessing the connector**](#accessing-the-connector)
  - [*Connecting to the local Emulator*](#connecting-to-the-local-emulator)
- [**Queries**](#queries)
  - [*GetPatientCase*](#getpatientcase)
  - [*ListPatientCasesCreatedByUser*](#listpatientcasescreatedbyuser)
- [**Mutations**](#mutations)
  - [*CreatePatientCase*](#createpatientcase)
  - [*AddSymptomEntry*](#addsymptomentry)

# TanStack Query Firebase & TanStack React Query
This SDK provides [React](https://react.dev/) hooks generated specific to your application, for the operations found in the connector `example`. These hooks are generated using [TanStack Query Firebase](https://react-query-firebase.invertase.dev/) by our partners at Invertase, a library built on top of [TanStack React Query v5](https://tanstack.com/query/v5/docs/framework/react/overview).

***You do not need to be familiar with Tanstack Query or Tanstack Query Firebase to use this SDK.*** However, you may find it useful to learn more about them, as they will empower you as a user of this Generated React SDK.

## Installing TanStack Query Firebase and TanStack React Query Packages
In order to use the React generated SDK, you must install the `TanStack React Query` and `TanStack Query Firebase` packages.
```bash
npm i --save @tanstack/react-query @tanstack-query-firebase/react
```
```bash
npm i --save firebase@latest # Note: React has a peer dependency on ^11.3.0
```

You can also follow the installation instructions from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#tanstack-install), or the [TanStack Query Firebase documentation](https://react-query-firebase.invertase.dev/react) and [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/installation).

## Configuring TanStack Query
In order to use the React generated SDK in your application, you must wrap your application's component tree in a `QueryClientProvider` component from TanStack React Query. None of your generated React SDK hooks will work without this provider.

```javascript
import { QueryClientProvider } from '@tanstack/react-query';

// Create a TanStack Query client instance
const queryClient = new QueryClient()

function App() {
  return (
    // Provide the client to your App
    <QueryClientProvider client={queryClient}>
      <MyApplication />
    </QueryClientProvider>
  )
}
```

To learn more about `QueryClientProvider`, see the [TanStack React Query documentation](https://tanstack.com/query/latest/docs/framework/react/quick-start) and the [TanStack Query Firebase documentation](https://invertase.docs.page/tanstack-query-firebase/react#usage).

# Accessing the connector
A connector is a collection of Queries and Mutations. One SDK is generated for each connector - this SDK is generated for the connector `example`.

You can find more information about connectors in the [Data Connect documentation](https://firebase.google.com/docs/data-connect#how-does).

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@dataconnect/generated';

const dataConnect = getDataConnect(connectorConfig);
```

## Connecting to the local Emulator
By default, the connector will connect to the production service.

To connect to the emulator, you can use the following code.
You can also follow the emulator instructions from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#emulator-react-angular).

```javascript
import { connectDataConnectEmulator, getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@dataconnect/generated';

const dataConnect = getDataConnect(connectorConfig);
connectDataConnectEmulator(dataConnect, 'localhost', 9399);
```

After it's initialized, you can call your Data Connect [queries](#queries) and [mutations](#mutations) using the hooks provided from your generated React SDK.

# Queries

The React generated SDK provides Query hook functions that call and return [`useDataConnectQuery`](https://react-query-firebase.invertase.dev/react/data-connect/querying) hooks from TanStack Query Firebase.

Calling these hook functions will return a `UseQueryResult` object. This object holds the state of your Query, including whether the Query is loading, has completed, or has succeeded/failed, and the most recent data returned by the Query, among other things. To learn more about these hooks and how to use them, see the [TanStack Query Firebase documentation](https://react-query-firebase.invertase.dev/react/data-connect/querying).

TanStack React Query caches the results of your Queries, so using the same Query hook function in multiple places in your application allows the entire application to automatically see updates to that Query's data.

Query hooks execute their Queries automatically when called, and periodically refresh, unless you change the `queryOptions` for the Query. To learn how to stop a Query from automatically executing, including how to make a query "lazy", see the [TanStack React Query documentation](https://tanstack.com/query/latest/docs/framework/react/guides/disabling-queries).

To learn more about TanStack React Query's Queries, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/guides/queries).

## Using Query Hooks
Here's a general overview of how to use the generated Query hooks in your code:

- If the Query has no variables, the Query hook function does not require arguments.
- If the Query has any required variables, the Query hook function will require at least one argument: an object that contains all the required variables for the Query.
- If the Query has some required and some optional variables, only required variables are necessary in the variables argument object, and optional variables may be provided as well.
- If all of the Query's variables are optional, the Query hook function does not require any arguments.
- Query hook functions can be called with or without passing in a `DataConnect` instance as an argument. If no `DataConnect` argument is passed in, then the generated SDK will call `getDataConnect(connectorConfig)` behind the scenes for you.
- Query hooks functions can be called with or without passing in an `options` argument of type `useDataConnectQueryOptions`. To learn more about the `options` argument, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/guides/query-options).
  - ***Special case:***  If the Query has all optional variables and you would like to provide an `options` argument to the Query hook function without providing any variables, you must pass `undefined` where you would normally pass the Query's variables, and then may provide the `options` argument.

Below are examples of how to use the `example` connector's generated Query hook functions to execute each Query. You can also follow the examples from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#operations-react-angular).

## GetPatientCase
You can execute the `GetPatientCase` Query using the following Query hook function, which is defined in [dataconnect-generated/react/index.d.ts](./index.d.ts):

```javascript
useGetPatientCase(dc: DataConnect, vars: GetPatientCaseVariables, options?: useDataConnectQueryOptions<GetPatientCaseData>): UseDataConnectQueryResult<GetPatientCaseData, GetPatientCaseVariables>;
```
You can also pass in a `DataConnect` instance to the Query hook function.
```javascript
useGetPatientCase(vars: GetPatientCaseVariables, options?: useDataConnectQueryOptions<GetPatientCaseData>): UseDataConnectQueryResult<GetPatientCaseData, GetPatientCaseVariables>;
```

### Variables
The `GetPatientCase` Query requires an argument of type `GetPatientCaseVariables`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:

```javascript
export interface GetPatientCaseVariables {
  id: UUIDString;
}
```
### Return Type
Recall that calling the `GetPatientCase` Query hook function returns a `UseQueryResult` object. This object holds the state of your Query, including whether the Query is loading, has completed, or has succeeded/failed, and any data returned by the Query, among other things.

To check the status of a Query, use the `UseQueryResult.status` field. You can also check for pending / success / error status using the `UseQueryResult.isPending`, `UseQueryResult.isSuccess`, and `UseQueryResult.isError` fields.

To access the data returned by a Query, use the `UseQueryResult.data` field. The data for the `GetPatientCase` Query is of type `GetPatientCaseData`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:
```javascript
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

To learn more about the `UseQueryResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useQuery).

### Using `GetPatientCase`'s Query hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, GetPatientCaseVariables } from '@dataconnect/generated';
import { useGetPatientCase } from '@dataconnect/generated/react'

export default function GetPatientCaseComponent() {
  // The `useGetPatientCase` Query hook requires an argument of type `GetPatientCaseVariables`:
  const getPatientCaseVars: GetPatientCaseVariables = {
    id: ..., 
  };

  // You don't have to do anything to "execute" the Query.
  // Call the Query hook function to get a `UseQueryResult` object which holds the state of your Query.
  const query = useGetPatientCase(getPatientCaseVars);
  // Variables can be defined inline as well.
  const query = useGetPatientCase({ id: ..., });

  // You can also pass in a `DataConnect` instance to the Query hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const query = useGetPatientCase(dataConnect, getPatientCaseVars);

  // You can also pass in a `useDataConnectQueryOptions` object to the Query hook function.
  const options = { staleTime: 5 * 1000 };
  const query = useGetPatientCase(getPatientCaseVars, options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectQueryOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = { staleTime: 5 * 1000 };
  const query = useGetPatientCase(dataConnect, getPatientCaseVars, options);

  // Then, you can render your component dynamically based on the status of the Query.
  if (query.isPending) {
    return <div>Loading...</div>;
  }

  if (query.isError) {
    return <div>Error: {query.error.message}</div>;
  }

  // If the Query is successful, you can access the data returned using the `UseQueryResult.data` field.
  if (query.isSuccess) {
    console.log(query.data.patientCase);
  }
  return <div>Query execution {query.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## ListPatientCasesCreatedByUser
You can execute the `ListPatientCasesCreatedByUser` Query using the following Query hook function, which is defined in [dataconnect-generated/react/index.d.ts](./index.d.ts):

```javascript
useListPatientCasesCreatedByUser(dc: DataConnect, vars: ListPatientCasesCreatedByUserVariables, options?: useDataConnectQueryOptions<ListPatientCasesCreatedByUserData>): UseDataConnectQueryResult<ListPatientCasesCreatedByUserData, ListPatientCasesCreatedByUserVariables>;
```
You can also pass in a `DataConnect` instance to the Query hook function.
```javascript
useListPatientCasesCreatedByUser(vars: ListPatientCasesCreatedByUserVariables, options?: useDataConnectQueryOptions<ListPatientCasesCreatedByUserData>): UseDataConnectQueryResult<ListPatientCasesCreatedByUserData, ListPatientCasesCreatedByUserVariables>;
```

### Variables
The `ListPatientCasesCreatedByUser` Query requires an argument of type `ListPatientCasesCreatedByUserVariables`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:

```javascript
export interface ListPatientCasesCreatedByUserVariables {
  creatorId: UUIDString;
}
```
### Return Type
Recall that calling the `ListPatientCasesCreatedByUser` Query hook function returns a `UseQueryResult` object. This object holds the state of your Query, including whether the Query is loading, has completed, or has succeeded/failed, and any data returned by the Query, among other things.

To check the status of a Query, use the `UseQueryResult.status` field. You can also check for pending / success / error status using the `UseQueryResult.isPending`, `UseQueryResult.isSuccess`, and `UseQueryResult.isError` fields.

To access the data returned by a Query, use the `UseQueryResult.data` field. The data for the `ListPatientCasesCreatedByUser` Query is of type `ListPatientCasesCreatedByUserData`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:
```javascript
export interface ListPatientCasesCreatedByUserData {
  patientCases: ({
    id: UUIDString;
    patientIdentifier: string;
    status: string;
  } & PatientCase_Key)[];
}
```

To learn more about the `UseQueryResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useQuery).

### Using `ListPatientCasesCreatedByUser`'s Query hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, ListPatientCasesCreatedByUserVariables } from '@dataconnect/generated';
import { useListPatientCasesCreatedByUser } from '@dataconnect/generated/react'

export default function ListPatientCasesCreatedByUserComponent() {
  // The `useListPatientCasesCreatedByUser` Query hook requires an argument of type `ListPatientCasesCreatedByUserVariables`:
  const listPatientCasesCreatedByUserVars: ListPatientCasesCreatedByUserVariables = {
    creatorId: ..., 
  };

  // You don't have to do anything to "execute" the Query.
  // Call the Query hook function to get a `UseQueryResult` object which holds the state of your Query.
  const query = useListPatientCasesCreatedByUser(listPatientCasesCreatedByUserVars);
  // Variables can be defined inline as well.
  const query = useListPatientCasesCreatedByUser({ creatorId: ..., });

  // You can also pass in a `DataConnect` instance to the Query hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const query = useListPatientCasesCreatedByUser(dataConnect, listPatientCasesCreatedByUserVars);

  // You can also pass in a `useDataConnectQueryOptions` object to the Query hook function.
  const options = { staleTime: 5 * 1000 };
  const query = useListPatientCasesCreatedByUser(listPatientCasesCreatedByUserVars, options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectQueryOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = { staleTime: 5 * 1000 };
  const query = useListPatientCasesCreatedByUser(dataConnect, listPatientCasesCreatedByUserVars, options);

  // Then, you can render your component dynamically based on the status of the Query.
  if (query.isPending) {
    return <div>Loading...</div>;
  }

  if (query.isError) {
    return <div>Error: {query.error.message}</div>;
  }

  // If the Query is successful, you can access the data returned using the `UseQueryResult.data` field.
  if (query.isSuccess) {
    console.log(query.data.patientCases);
  }
  return <div>Query execution {query.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

# Mutations

The React generated SDK provides Mutations hook functions that call and return [`useDataConnectMutation`](https://react-query-firebase.invertase.dev/react/data-connect/mutations) hooks from TanStack Query Firebase.

Calling these hook functions will return a `UseMutationResult` object. This object holds the state of your Mutation, including whether the Mutation is loading, has completed, or has succeeded/failed, and the most recent data returned by the Mutation, among other things. To learn more about these hooks and how to use them, see the [TanStack Query Firebase documentation](https://react-query-firebase.invertase.dev/react/data-connect/mutations).

Mutation hooks do not execute their Mutations automatically when called. Rather, after calling the Mutation hook function and getting a `UseMutationResult` object, you must call the `UseMutationResult.mutate()` function to execute the Mutation.

To learn more about TanStack React Query's Mutations, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/guides/mutations).

## Using Mutation Hooks
Here's a general overview of how to use the generated Mutation hooks in your code:

- Mutation hook functions are not called with the arguments to the Mutation. Instead, arguments are passed to `UseMutationResult.mutate()`.
- If the Mutation has no variables, the `mutate()` function does not require arguments.
- If the Mutation has any required variables, the `mutate()` function will require at least one argument: an object that contains all the required variables for the Mutation.
- If the Mutation has some required and some optional variables, only required variables are necessary in the variables argument object, and optional variables may be provided as well.
- If all of the Mutation's variables are optional, the Mutation hook function does not require any arguments.
- Mutation hook functions can be called with or without passing in a `DataConnect` instance as an argument. If no `DataConnect` argument is passed in, then the generated SDK will call `getDataConnect(connectorConfig)` behind the scenes for you.
- Mutation hooks also accept an `options` argument of type `useDataConnectMutationOptions`. To learn more about the `options` argument, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/guides/mutations#mutation-side-effects).
  - `UseMutationResult.mutate()` also accepts an `options` argument of type `useDataConnectMutationOptions`.
  - ***Special case:*** If the Mutation has no arguments (or all optional arguments and you wish to provide none), and you want to pass `options` to `UseMutationResult.mutate()`, you must pass `undefined` where you would normally pass the Mutation's arguments, and then may provide the options argument.

Below are examples of how to use the `example` connector's generated Mutation hook functions to execute each Mutation. You can also follow the examples from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#operations-react-angular).

## CreatePatientCase
You can execute the `CreatePatientCase` Mutation using the `UseMutationResult` object returned by the following Mutation hook function (which is defined in [dataconnect-generated/react/index.d.ts](./index.d.ts)):
```javascript
useCreatePatientCase(options?: useDataConnectMutationOptions<CreatePatientCaseData, FirebaseError, CreatePatientCaseVariables>): UseDataConnectMutationResult<CreatePatientCaseData, CreatePatientCaseVariables>;
```
You can also pass in a `DataConnect` instance to the Mutation hook function.
```javascript
useCreatePatientCase(dc: DataConnect, options?: useDataConnectMutationOptions<CreatePatientCaseData, FirebaseError, CreatePatientCaseVariables>): UseDataConnectMutationResult<CreatePatientCaseData, CreatePatientCaseVariables>;
```

### Variables
The `CreatePatientCase` Mutation requires an argument of type `CreatePatientCaseVariables`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:

```javascript
export interface CreatePatientCaseVariables {
  creatorId: UUIDString;
  patientIdentifier: string;
  status: string;
}
```
### Return Type
Recall that calling the `CreatePatientCase` Mutation hook function returns a `UseMutationResult` object. This object holds the state of your Mutation, including whether the Mutation is loading, has completed, or has succeeded/failed, among other things.

To check the status of a Mutation, use the `UseMutationResult.status` field. You can also check for pending / success / error status using the `UseMutationResult.isPending`, `UseMutationResult.isSuccess`, and `UseMutationResult.isError` fields.

To execute the Mutation, call `UseMutationResult.mutate()`. This function executes the Mutation, but does not return the data from the Mutation.

To access the data returned by a Mutation, use the `UseMutationResult.data` field. The data for the `CreatePatientCase` Mutation is of type `CreatePatientCaseData`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:
```javascript
export interface CreatePatientCaseData {
  patientCase_insert: PatientCase_Key;
}
```

To learn more about the `UseMutationResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useMutation).

### Using `CreatePatientCase`'s Mutation hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, CreatePatientCaseVariables } from '@dataconnect/generated';
import { useCreatePatientCase } from '@dataconnect/generated/react'

export default function CreatePatientCaseComponent() {
  // Call the Mutation hook function to get a `UseMutationResult` object which holds the state of your Mutation.
  const mutation = useCreatePatientCase();

  // You can also pass in a `DataConnect` instance to the Mutation hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const mutation = useCreatePatientCase(dataConnect);

  // You can also pass in a `useDataConnectMutationOptions` object to the Mutation hook function.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useCreatePatientCase(options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectMutationOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useCreatePatientCase(dataConnect, options);

  // After calling the Mutation hook function, you must call `UseMutationResult.mutate()` to execute the Mutation.
  // The `useCreatePatientCase` Mutation requires an argument of type `CreatePatientCaseVariables`:
  const createPatientCaseVars: CreatePatientCaseVariables = {
    creatorId: ..., 
    patientIdentifier: ..., 
    status: ..., 
  };
  mutation.mutate(createPatientCaseVars);
  // Variables can be defined inline as well.
  mutation.mutate({ creatorId: ..., patientIdentifier: ..., status: ..., });

  // You can also pass in a `useDataConnectMutationOptions` object to `UseMutationResult.mutate()`.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  mutation.mutate(createPatientCaseVars, options);

  // Then, you can render your component dynamically based on the status of the Mutation.
  if (mutation.isPending) {
    return <div>Loading...</div>;
  }

  if (mutation.isError) {
    return <div>Error: {mutation.error.message}</div>;
  }

  // If the Mutation is successful, you can access the data returned using the `UseMutationResult.data` field.
  if (mutation.isSuccess) {
    console.log(mutation.data.patientCase_insert);
  }
  return <div>Mutation execution {mutation.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## AddSymptomEntry
You can execute the `AddSymptomEntry` Mutation using the `UseMutationResult` object returned by the following Mutation hook function (which is defined in [dataconnect-generated/react/index.d.ts](./index.d.ts)):
```javascript
useAddSymptomEntry(options?: useDataConnectMutationOptions<AddSymptomEntryData, FirebaseError, AddSymptomEntryVariables>): UseDataConnectMutationResult<AddSymptomEntryData, AddSymptomEntryVariables>;
```
You can also pass in a `DataConnect` instance to the Mutation hook function.
```javascript
useAddSymptomEntry(dc: DataConnect, options?: useDataConnectMutationOptions<AddSymptomEntryData, FirebaseError, AddSymptomEntryVariables>): UseDataConnectMutationResult<AddSymptomEntryData, AddSymptomEntryVariables>;
```

### Variables
The `AddSymptomEntry` Mutation requires an argument of type `AddSymptomEntryVariables`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:

```javascript
export interface AddSymptomEntryVariables {
  patientCaseId: UUIDString;
  symptomName: string;
  severity: string;
  onsetDate: DateString;
}
```
### Return Type
Recall that calling the `AddSymptomEntry` Mutation hook function returns a `UseMutationResult` object. This object holds the state of your Mutation, including whether the Mutation is loading, has completed, or has succeeded/failed, among other things.

To check the status of a Mutation, use the `UseMutationResult.status` field. You can also check for pending / success / error status using the `UseMutationResult.isPending`, `UseMutationResult.isSuccess`, and `UseMutationResult.isError` fields.

To execute the Mutation, call `UseMutationResult.mutate()`. This function executes the Mutation, but does not return the data from the Mutation.

To access the data returned by a Mutation, use the `UseMutationResult.data` field. The data for the `AddSymptomEntry` Mutation is of type `AddSymptomEntryData`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:
```javascript
export interface AddSymptomEntryData {
  symptomEntry_insert: SymptomEntry_Key;
}
```

To learn more about the `UseMutationResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useMutation).

### Using `AddSymptomEntry`'s Mutation hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, AddSymptomEntryVariables } from '@dataconnect/generated';
import { useAddSymptomEntry } from '@dataconnect/generated/react'

export default function AddSymptomEntryComponent() {
  // Call the Mutation hook function to get a `UseMutationResult` object which holds the state of your Mutation.
  const mutation = useAddSymptomEntry();

  // You can also pass in a `DataConnect` instance to the Mutation hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const mutation = useAddSymptomEntry(dataConnect);

  // You can also pass in a `useDataConnectMutationOptions` object to the Mutation hook function.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useAddSymptomEntry(options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectMutationOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useAddSymptomEntry(dataConnect, options);

  // After calling the Mutation hook function, you must call `UseMutationResult.mutate()` to execute the Mutation.
  // The `useAddSymptomEntry` Mutation requires an argument of type `AddSymptomEntryVariables`:
  const addSymptomEntryVars: AddSymptomEntryVariables = {
    patientCaseId: ..., 
    symptomName: ..., 
    severity: ..., 
    onsetDate: ..., 
  };
  mutation.mutate(addSymptomEntryVars);
  // Variables can be defined inline as well.
  mutation.mutate({ patientCaseId: ..., symptomName: ..., severity: ..., onsetDate: ..., });

  // You can also pass in a `useDataConnectMutationOptions` object to `UseMutationResult.mutate()`.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  mutation.mutate(addSymptomEntryVars, options);

  // Then, you can render your component dynamically based on the status of the Mutation.
  if (mutation.isPending) {
    return <div>Loading...</div>;
  }

  if (mutation.isError) {
    return <div>Error: {mutation.error.message}</div>;
  }

  // If the Mutation is successful, you can access the data returned using the `UseMutationResult.data` field.
  if (mutation.isSuccess) {
    console.log(mutation.data.symptomEntry_insert);
  }
  return <div>Mutation execution {mutation.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

