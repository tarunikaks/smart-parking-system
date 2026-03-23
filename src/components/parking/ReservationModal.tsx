import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Car } from "lucide-react";

interface ReservationModalProps {
  open: boolean;
  onClose: () => void;
  slotNumber: string;
  onConfirm: (vehicleNumber: string) => void;
}

export const ReservationModal = ({ open, onClose, slotNumber, onConfirm }: ReservationModalProps) => {
  const [vehicleNumber, setVehicleNumber] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = () => {
    const trimmedVehicleNumber = vehicleNumber.trim().toUpperCase();
    
    if (!trimmedVehicleNumber) {
      setError("Please enter a vehicle number");
      return;
    }
    
    if (trimmedVehicleNumber.length < 4 || trimmedVehicleNumber.length > 15) {
      setError("Please enter a valid vehicle number (4-15 characters)");
      return;
    }
    
    onConfirm(trimmedVehicleNumber);
    setVehicleNumber("");
    setError("");
  };

  const handleClose = () => {
    setVehicleNumber("");
    setError("");
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Car className="w-5 h-5 text-primary" />
            Reserve Parking Slot
          </DialogTitle>
          <DialogDescription>
            Enter your vehicle number to reserve slot <span className="font-bold">{slotNumber}</span>
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="vehicleNumber">Vehicle Number</Label>
            <Input
              id="vehicleNumber"
              placeholder="e.g., TN22AB1234"
              value={vehicleNumber}
              onChange={(e) => {
                setVehicleNumber(e.target.value);
                setError("");
              }}
              onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
              className="uppercase"
              maxLength={15}
            />
            {error && <p className="text-sm text-destructive">{error}</p>}
          </div>
          
          <div className="bg-muted p-3 rounded-lg text-sm space-y-1">
            <p className="font-medium">Parking Rates:</p>
            <p className="text-muted-foreground">• First hour: ₹20</p>
            <p className="text-muted-foreground">• Additional hours: ₹10/hour</p>
            <p className="text-xs text-muted-foreground mt-2">
              * Fare will be calculated at exit based on actual duration
            </p>
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>
            Confirm Reservation
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
