import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface UpdateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  updateText: string;
  appName: string;
}

export function UpdateDialog({ open, onOpenChange, updateText, appName }: UpdateDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] w-[90vw]">
        <DialogHeader>
          <DialogTitle>Latest Update Details</DialogTitle>
          <DialogDescription>
            Complete update information for {appName}
          </DialogDescription>
        </DialogHeader>
        <div className="pt-4 overflow-y-auto max-h-[70vh]">
          <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">{updateText}</p>
        </div>
      </DialogContent>
    </Dialog>
  );
}