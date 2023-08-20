import CircularProgress from '@mui/material/CircularProgress';

interface LoadingAndErrorHandlerProps {
  sessionStatus: string,
  loading: boolean,
  error: boolean,
  errorMessage: string,
  retryCallback: () => void
}

const LoadingAndErrorHandler: (props: LoadingAndErrorHandlerProps) => JSX.Element = ({
  sessionStatus,
  loading,
  error,
  errorMessage,
  retryCallback
}: LoadingAndErrorHandlerProps) => {
  if (sessionStatus === "loading") {
    return (
      <div className="flex flex-col items-center justify-center">
        <CircularProgress />
        <p className="desc font-bold">Loading...</p>
      </div>
    )
  }

  if (sessionStatus === "unauthenticated") {
    return <p className="desc font-bold">Access Denied. Please sign in to view this page</p>
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center">
        <CircularProgress />
        <p className="desc font-bold">Loading...</p>
      </div>
    )
  }

  if (error) {
    return (
      <p className="flex flex-col items-center">
        <span className="desc font-semibold">{errorMessage}</span>
        <button className="p-4 rounded-md border-spacing-3 border-x-cyan-900" onClick={retryCallback}>
          <span className="text-pink-600 font-semibold text-lg">Try again</span>
        </button>
      </p>
    )
  }
  return <></>

}

export default LoadingAndErrorHandler