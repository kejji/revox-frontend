import {
  Dialog,
  DialogContent,
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
      <DialogContent className="max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Latest Update Details</DialogTitle>
        </DialogHeader>
        <div className="pt-4 overflow-y-auto">
          <p className="text-sm leading-relaxed whitespace-pre-wrap">{updateText}</p>
        </div>
      </DialogContent>
    </Dialog>
  );
}