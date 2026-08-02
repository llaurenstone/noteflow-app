import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client'
import { ApolloProvider } from '@apollo/client/react'
import App from './App'
import './index.css'

const client = new ApolloClient({
  link: new HttpLink({
    uri:
      import.meta.env.VITE_GRAPHQL_URL ??
      'http://localhost:8001/graphql',
  }),
  cache: new InMemoryCache(),
})

const rootElement = document.getElementById('root')

if (!rootElement) {
  throw new Error('Root element was not found')
}

createRoot(rootElement).render(
  <StrictMode>
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  </StrictMode>,
)