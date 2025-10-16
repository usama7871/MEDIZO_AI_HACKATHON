# Basic Usage

Always prioritize using a supported framework over using the generated SDK
directly. Supported frameworks simplify the developer experience and help ensure
best practices are followed.




### React
For each operation, there is a wrapper hook that can be used to call the operation.

Here are all of the hooks that get generated:
```ts
import { useCreatePatientCase, useGetPatientCase, useAddSymptomEntry, useListPatientCasesCreatedByUser } from '@dataconnect/generated/react';
// The types of these hooks are available in react/index.d.ts

const { data, isPending, isSuccess, isError, error } = useCreatePatientCase(createPatientCaseVars);

const { data, isPending, isSuccess, isError, error } = useGetPatientCase(getPatientCaseVars);

const { data, isPending, isSuccess, isError, error } = useAddSymptomEntry(addSymptomEntryVars);

const { data, isPending, isSuccess, isError, error } = useListPatientCasesCreatedByUser(listPatientCasesCreatedByUserVars);

```

Here's an example from a different generated SDK:

```ts
import { useListAllMovies } from '@dataconnect/generated/react';

function MyComponent() {
  const { isLoading, data, error } = useListAllMovies();
  if(isLoading) {
    return <div>Loading...</div>
  }
  if(error) {
    return <div> An Error Occurred: {error} </div>
  }
}

// App.tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import MyComponent from './my-component';

function App() {
  const queryClient = new QueryClient();
  return <QueryClientProvider client={queryClient}>
    <MyComponent />
  </QueryClientProvider>
}
```



## Advanced Usage
If a user is not using a supported framework, they can use the generated SDK directly.

Here's an example of how to use it with the first 5 operations:

```js
import { createPatientCase, getPatientCase, addSymptomEntry, listPatientCasesCreatedByUser } from '@dataconnect/generated';


// Operation CreatePatientCase:  For variables, look at type CreatePatientCaseVars in ../index.d.ts
const { data } = await CreatePatientCase(dataConnect, createPatientCaseVars);

// Operation GetPatientCase:  For variables, look at type GetPatientCaseVars in ../index.d.ts
const { data } = await GetPatientCase(dataConnect, getPatientCaseVars);

// Operation AddSymptomEntry:  For variables, look at type AddSymptomEntryVars in ../index.d.ts
const { data } = await AddSymptomEntry(dataConnect, addSymptomEntryVars);

// Operation ListPatientCasesCreatedByUser:  For variables, look at type ListPatientCasesCreatedByUserVars in ../index.d.ts
const { data } = await ListPatientCasesCreatedByUser(dataConnect, listPatientCasesCreatedByUserVars);


```