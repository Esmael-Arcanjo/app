import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";

type Props = { open: boolean; title: string; description: string; onCancel: () => void; onConfirm: () => void };

export const ConfirmDialog = ({ open, title, description, onCancel, onConfirm }: Props) => (
  <AlertDialog open={open} onOpenChange={(o: boolean) => !o && onCancel()}>
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>{title}</AlertDialogTitle>
        <AlertDialogDescription>{description}</AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel data-testid="confirm-cancel">Cancelar</AlertDialogCancel>
        <AlertDialogAction onClick={onConfirm} className="bg-destructive text-destructive-foreground hover:bg-destructive/90" data-testid="confirm-ok">Confirmar</AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
);
