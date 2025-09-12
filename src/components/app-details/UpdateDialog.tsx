// src/components/UpdateDialog.tsx
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface UpdateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  updateText: string; // ← TEXTE COMPLET reçu du parent
  appName: string;
}

export function UpdateDialog({ open, onOpenChange, updateText, appName }: UpdateDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Latest Update — {appName}</DialogTitle>
        </DialogHeader>
        <div className="pt-4">
          <p className="text-sm leading-relaxed whitespace-pre-wrap">{updateText}</p>
        </div>
      </DialogContent>
    </Dialog>
  );
}