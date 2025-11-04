import { cn } from "@/lib/utils";
import { ParkingSlot as ParkingSlotType } from "@/types/parking";
import { Car, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface ParkingSlotProps {
  slot: ParkingSlotType;
  onClick: () => void;
}

export const ParkingSlot = ({ slot, onClick }: ParkingSlotProps) => {
  const getStatusColor = () => {
    switch (slot.status) {
      case 'available':
        return 'bg-available hover:bg-available/90 border-available';
      case 'occupied':
        return 'bg-occupied border-occupied cursor-not-allowed';
      case 'reserved':
        return 'bg-reserved border-reserved cursor-not-allowed';
      default:
        return 'bg-muted';
    }
  };

  const getStatusText = () => {
    switch (slot.status) {
      case 'available':
        return 'Available';
      case 'occupied':
        return 'Occupied';
      case 'reserved':
        return 'Reserved';
    }
  };

  const isClickable = slot.status === 'available' || slot.status === 'occupied' || slot.status === 'reserved';

  return (
    <button
      onClick={() => isClickable && onClick()}
      disabled={!isClickable}
      className={cn(
        "relative flex flex-col items-center justify-center p-4 rounded-lg border-2 transition-all duration-300 min-h-[120px]",
        getStatusColor(),
        slot.status === 'available' && "hover:scale-105 hover:shadow-lg cursor-pointer",
        (slot.status === 'occupied' || slot.status === 'reserved') && "opacity-90"
      )}
    >
      <div className="flex items-center gap-2 mb-2">
        <Car className={cn(
          "w-6 h-6",
          slot.status === 'available' ? "text-available-foreground" :
          slot.status === 'occupied' ? "text-occupied-foreground" :
          "text-reserved-foreground"
        )} />
        <span className={cn(
          "font-bold text-lg",
          slot.status === 'available' ? "text-available-foreground" :
          slot.status === 'occupied' ? "text-occupied-foreground" :
          "text-reserved-foreground"
        )}>
          {slot.slotNumber}
        </span>
      </div>
      
      <Badge 
        variant="secondary" 
        className={cn(
          "text-xs font-medium",
          slot.status === 'available' && "bg-available-foreground/20 text-available-foreground",
          slot.status === 'occupied' && "bg-occupied-foreground/20 text-occupied-foreground",
          slot.status === 'reserved' && "bg-reserved-foreground/20 text-reserved-foreground"
        )}
      >
        {getStatusText()}
      </Badge>

      {slot.vehicleNumber && (
        <div className={cn(
          "mt-2 text-xs font-medium",
          slot.status === 'occupied' ? "text-occupied-foreground" : "text-reserved-foreground"
        )}>
          {slot.vehicleNumber}
        </div>
      )}
      
      {slot.entryTime && (
        <div className={cn(
          "flex items-center gap-1 mt-1 text-xs",
          slot.status === 'occupied' ? "text-occupied-foreground/80" : "text-reserved-foreground/80"
        )}>
          <Clock className="w-3 h-3" />
          {new Date(slot.entryTime).toLocaleTimeString('en-IN', { 
            hour: '2-digit', 
            minute: '2-digit' 
          })}
        </div>
      )}
    </button>
  );
};
