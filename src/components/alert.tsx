import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from "@/components/ui/alert-dialog";
import React from 'react';

interface Props {
  error: string | null
  setError: (error: string | null) => void
}
export const Alert: React.FC<Props> = ({error,setError}) => {
  return <AlertDialog open={!!error}>
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>Ops! Tivemos um problema</AlertDialogTitle>
      <AlertDialogDescription>
        {error}
      </AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogCancel onClick={()=>setError(null)}>Ok</AlertDialogCancel>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>
}

