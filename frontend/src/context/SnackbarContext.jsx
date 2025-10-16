import { createContext, useContext } from "react";
import { useSnackbar } from "notistack";
import { SnackbarProvider } from "notistack";

const SnackbarContext = createContext(null);

export function useSnackbarContext() {
  const context = useContext(SnackbarContext);
  if (!context) {
    throw new Error(
      "useSnackbarContext must be used within a SnackbarProviderWrapper"
    );
  }
  return context;
}

// Inner component that uses the useSnackbar hook
function SnackbarContextProvider({ children }) {
  const { enqueueSnackbar } = useSnackbar();

  const openSnackBar = (variant, message) => {
    enqueueSnackbar(message ?? "This is a success message!", {
      variant,
    });
  };

  return (
    <SnackbarContext.Provider value={{ openSnackBar }}>
      {children}
    </SnackbarContext.Provider>
  );
}

// Wrapper component that provides both SnackbarProvider and SnackbarContext
export function SnackbarProviderWrapper({ children }) {
  return (
    <SnackbarProvider
      maxSnack={3}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
    >
      <SnackbarContextProvider>{children}</SnackbarContextProvider>
    </SnackbarProvider>
  );
}