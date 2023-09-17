import React, {
  PropsWithChildren,
  createContext,
  useContext,
  useState,
} from "react";
import { Alert, AlertProps } from "@/components/alert";

type AlertWriteProps = Omit<AlertProps, "open" | "onClose">;

export type AlertContextState = {
  setAlert: (props: AlertWriteProps) => void;
};

const defaultAlertContextState: AlertContextState = {
  setAlert: () => {},
};

const AlertContext = createContext<AlertContextState>(defaultAlertContextState);

export const AlertProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [alert, setAlert] = useState<AlertWriteProps | null>(null);

  return (
    <AlertContext.Provider value={{ setAlert }}>
      {children}
      {alert && (
        <Alert
          open={true}
          onClose={() => {
            setAlert(null);
          }}
          {...alert}
        />
      )}
    </AlertContext.Provider>
  );
};

export const useAlert = () => {
  const context = useContext(AlertContext);

  if (!context) {
    throw new Error(
      "This component should be used inside <AlertProvider> component."
    );
  }

  return context;
};
