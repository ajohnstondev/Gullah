import React from 'react'
import { AppProps, ErrorComponent } from "blitz"
import { ErrorBoundary } from "react-error-boundary"
import { queryCache } from "react-query"
import LoginForm from "app/auth/components/LoginForm"
import { ThemeProvider } from 'styled-components'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {StoreProvider } from 'app/components/Shared/StoreContext'

const theme = {
  colors: {
    primary: '#0070f3',
    secondary: '#0000',
    white: '#fff'
  },
  sizes: {
    maxWidth: '95%'
  }
}

export default function App({ Component, pageProps }: AppProps) {
  const getLayout = Component.getLayout || ((page) => page)

  return (
    
    <ErrorBoundary
      FallbackComponent={RootErrorFallback}
      onReset={() => {
        // This ensures the Blitz useQuery hooks will automatically refetch
        // data any time you reset the error boundary
        queryCache.resetErrorBoundaries()
      }}
    >
      <ThemeProvider theme={theme}><StoreProvider>{getLayout(<><Component {...pageProps} /></>)}</StoreProvider></ThemeProvider>
      <ToastContainer position='top-center' newestOnTop={true} limit={1} />
    </ErrorBoundary>
  )
}

function RootErrorFallback({ error, resetErrorBoundary }) {
  if (error.name === "AuthenticationError") {
    return <LoginForm onSuccess={resetErrorBoundary} />
  } else if (error.name === "AuthorizationError") {
    return (
      <ErrorComponent
        statusCode={error.statusCode}
        title="Sorry, you are not authorized to access this"
      />
    )
  } else {
    return (
      <ErrorComponent statusCode={error.statusCode || 400} title={error.message || error.name} />
    )
  }
}
