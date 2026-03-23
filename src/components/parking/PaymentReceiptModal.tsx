import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, IndianRupee, Download } from "lucide-react";

interface Receipt {
  transactionId: string;
  reservationId: string;
  slotNumber: string;
  vehicleNumber: string;
  durationMinutes: number;
  baseFare: number;
  taxAmount: number;
  totalAmount: number;
  paymentMethod: string;
  paidAt: string;
}

interface PaymentReceiptModalProps {
  open: boolean;
  onClose: () => void;
  receipt: Receipt | null;
}

export const PaymentReceiptModal = ({ open, onClose, receipt }: PaymentReceiptModalProps) => {
  if (!receipt) return null;

  const hours = Math.floor(receipt.durationMinutes / 60);
  const mins = receipt.durationMinutes % 60;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-available">
            <CheckCircle className="w-5 h-5" />
            Payment Successful
          </DialogTitle>
          <DialogDescription>Your parking payment receipt</DialogDescription>
        </DialogHeader>

        <div className="space-y-3 py-4">
          <div className="text-center p-4 bg-available/10 rounded-lg border border-available/20">
            <p className="text-3xl font-bold text-available">₹{receipt.totalAmount.toFixed(2)}</p>
            <Badge variant="outline" className="mt-2">{receipt.paymentMethod}</Badge>
          </div>

          <div className="space-y-2 text-sm">
            <div className="flex justify-between p-2 bg-muted rounded">
              <span className="text-muted-foreground">Transaction ID</span>
              <span className="font-mono font-medium text-foreground">{receipt.transactionId}</span>
            </div>
            <div className="flex justify-between p-2">
              <span className="text-muted-foreground">Slot</span>
              <span className="font-medium text-foreground">{receipt.slotNumber}</span>
            </div>
            <div className="flex justify-between p-2 bg-muted rounded">
              <span className="text-muted-foreground">Vehicle</span>
              <span className="font-medium text-foreground">{receipt.vehicleNumber}</span>
            </div>
            <div className="flex justify-between p-2">
              <span className="text-muted-foreground">Duration</span>
              <span className="font-medium text-foreground">{hours}h {mins}m</span>
            </div>
            <hr className="border-border" />
            <div className="flex justify-between p-2">
              <span className="text-muted-foreground">Base Fare</span>
              <span className="text-foreground">₹{receipt.baseFare.toFixed(2)}</span>
            </div>
            <div className="flex justify-between p-2 bg-muted rounded">
              <span className="text-muted-foreground">GST (18%)</span>
              <span className="text-foreground">₹{receipt.taxAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between p-2 font-bold text-lg">
              <span className="flex items-center gap-1"><IndianRupee className="w-4 h-4" /> Total</span>
              <span className="text-primary">₹{receipt.totalAmount.toFixed(2)}</span>
            </div>
          </div>

          <p className="text-xs text-center text-muted-foreground">
            Paid at: {new Date(receipt.paidAt).toLocaleString('en-IN')}
          </p>
        </div>

        <DialogFooter>
          <Button onClick={onClose} className="w-full">Done</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
