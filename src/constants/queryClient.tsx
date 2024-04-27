import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

export const queryClient = new QueryClient()

export interface QueryClientContextProvider {
  children?: React.ReactNode
}

export function QueryClientContextProvider(props: QueryClientContextProvider) {
  return (
    <QueryClientProvider client={queryClient}>
      {props.children}
    </QueryClientProvider>
  )
}
