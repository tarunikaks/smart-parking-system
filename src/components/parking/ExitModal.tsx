import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { QRCodeDisplay } from "./QRCodeDisplay";
import { calculateFare, formatDuration, formatCurrency } from "@/utils/fareCalculator";
import { Reservation } from "@/types/parking";
import { Clock, IndianRupee, Calendar } from "lucide-react";


interface ExitModalProps {
  open: boolean;
  onClose: () => void;
  reservation: Reservation | null;
  onPayment: () => void;
}

export const ExitModal = ({ open, onClose, reservation, onPayment }: ExitModalProps) => {
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    if (!reservation || !open) return;

    const updateDuration = () => {
      const now = new Date();
      const entry = new Date(reservation.entryTime);
      const diff = Math.floor((now.getTime() - entry.getTime()) / 1000 / 60);
      setDuration(diff);
    };

    updateDuration();
    const interval = setInterval(updateDuration, 1000);

    return () => clearInterval(interval);
  }, [reservation, open]);

  if (!reservation) return null;

  const fare = calculateFare(duration);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <IndianRupee className="w-5 h-5 text-primary" />
            Exit & Payment
          </DialogTitle>
          <DialogDescription>
            Scan QR code at exit gate and complete payment
          </DialogDescription>
        </DialogHeader>

        <div className="grid md:grid-cols-2 gap-6 py-4">
          <div className="space-y-4">
            <QRCodeDisplay
              reservationId={reservation.id}
              slotNumber={reservation.slotNumber}
              vehicleNumber={reservation.vehicleNumber}
              entryTime={reservation.entryTime}
              qrData={reservation.qrCode}
            />
          </div>

          <div className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="w-4 h-4" />
                  <span>Live Duration</span>
                </div>
                <span className="font-bold text-lg">{formatDuration(duration)}</span>
              </div>

              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="w-4 h-4" />
                  <span>Entry Time</span>
                </div>
                <span className="font-medium">
                  {reservation.entryTime.toLocaleTimeString('en-IN', { 
                    hour: '2-digit', 
                    minute: '2-digit',
                    hour12: true 
                  })}
                </span>
              </div>

              <div className="flex items-center justify-between p-4 bg-primary/10 rounded-lg border-2 border-primary">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <IndianRupee className="w-5 h-5 text-primary" />
                  <span>Total Fare</span>
                </div>
                <span className="font-bold text-2xl text-primary">
                  {formatCurrency(fare)}
                </span>
              </div>
            </div>

            <div className="border rounded-lg overflow-hidden">
              <img 
                src={parkingSlotImage} 
                alt="Parking Slot Layout" 
                className="w-full h-auto"
              />
              <div className="p-2 bg-muted text-center text-xs text-muted-foreground">
                Your slot: {reservation.slotNumber}
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={onPayment} className="gap-2">
            <IndianRupee className="w-4 h-4" />
            Pay {formatCurrency(fare)}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
