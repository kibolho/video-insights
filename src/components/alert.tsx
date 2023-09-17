import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import React from "react";

export interface AlertProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  description: string;
  onAction?: () => void;
  actionLabel?: string;
}
export const Alert: React.FC<AlertProps> = ({
  open,
  title = "Ops! Tivemos um problema",
  description,
  onClose,
  onAction,
  actionLabel,
}) => {
  return (
    <AlertDialog open={open}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onClose}>Ok</AlertDialogCancel>
          {actionLabel && onAction && (
            <AlertDialogAction
              onClick={() => {
                onAction();
                onClose();
              }}
            >
              {actionLabel}
            </AlertDialogAction>
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
