import React from 'react';

function Alert(props: any) {
  return <div {...props} />;
}

export function ErrorAlert({
  isOpen,
  message,
  onClose = () => {},
}: {
  isOpen: boolean;
  message: string | null;
  onClose: () => void;
}) { 
  return isOpen ? (
    <Alert onClose={onClose} severity="error">
      {message}
    </Alert>
  ) : null;
}

export function useErrorAlert({
  error,
  clearError,
  hideAfterMs,
}: {
  error: string | null;
  clearError: () => void;
  hideAfterMs?: number;
}) {
  const [showErrorAlert, setShowErrorAlert] = React.useState(false);
  const clearErrorAlert = React.useCallback(() => {
    clearError();
    setShowErrorAlert(false);
  }, [clearError]);

  React.useEffect(() => {
    if (error) {
      setShowErrorAlert(true);
      if (hideAfterMs) {
        const timeout = setTimeout(() => {
          clearErrorAlert();
        }, hideAfterMs);
        return () => {
          clearTimeout(timeout);
        };
      }
    } else {
      setShowErrorAlert(false);
    }
  }, [error, clearErrorAlert, hideAfterMs]);

  return () => (
    <ErrorAlert
      isOpen={showErrorAlert}
      message={error}
      onClose={() => {
        clearErrorAlert();
      }}
    />
  );
}
