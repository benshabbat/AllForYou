import { useCallback, useEffect, useState } from "react";

function ErrorBoundary({ children }) {
  const [hasError, setHasError] = useState(false);

  const errorHandler = useCallback((error, errorInfo) => {
    setHasError(true);
    // Log the error to an error reporting service
    console.error('Uncaught error:', error, errorInfo);
  }, []);

  useEffect(() => {
    setHasError(false);
  }, [children]);

  if (hasError) {
    return <h1>משהו השתבש. אנא נסה שוב מאוחר יותר.</h1>;
  }

  return (
    <ErrorBoundary
      fallback={<h1>משהו השתבש. אנא נסה שוב מאוחר יותר.</h1>}
      onError={errorHandler}
    >
      {children}
    </ErrorBoundary>
  );
}

export default ErrorBoundary;