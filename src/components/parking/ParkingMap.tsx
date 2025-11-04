import { useState } from "react";
import { ParkingSlot } from "./ParkingSlot";
import { ReservationModal } from "./ReservationModal";
import { ExitModal } from "./ExitModal";
import { MyReservations } from "./MyReservations";
import { ParkingSlot as ParkingSlotType, Reservation } from "@/types/parking";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin } from "lucide-react";
import { calculateFare } from "@/utils/fareCalculator";

const generateInitialSlots = (): ParkingSlotType[] => {
  const slots: ParkingSlotType[] = [];
  const sections = ['A', 'B', 'C'];
  
  sections.forEach((section, sectionIndex) => {
    for (let i = 1; i <= 8; i++) {
      const slotNumber = `${section}${i}`;
      const status = Math.random() > 0.7 ? 'occupied' : 'available';
      
      slots.push({
        id: `${section}-${i}`,
        slotNumber,
        status,
        section,
        ...(status === 'occupied' && {
          vehicleNumber: `TN${22 + sectionIndex}${String.fromCharCode(65 + Math.floor(Math.random() * 26))}${String.fromCharCode(65 + Math.floor(Math.random() * 26))}${1000 + Math.floor(Math.random() * 9000)}`,
          entryTime: new Date(Date.now() - Math.random() * 3600000 * 5)
        })
      });
    }
  });
  
  return slots;
};

export const ParkingMap = () => {
  const [slots, setSlots] = useState<ParkingSlotType[]>(generateInitialSlots());
  const [selectedSlot, setSelectedSlot] = useState<ParkingSlotType | null>(null);
  const [reservationModalOpen, setReservationModalOpen] = useState(false);
  const [exitModalOpen, setExitModalOpen] = useState(false);
  const [reservations, setReservations] = useState<Map<string, Reservation>>(new Map());
  const [allReservations, setAllReservations] = useState<Reservation[]>([]);
  const [highlightedSlot, setHighlightedSlot] = useState<string | null>(null);

  const handleSlotClick = (slot: ParkingSlotType) => {
    if (slot.status === 'available') {
      setSelectedSlot(slot);
      setReservationModalOpen(true);
    } else if (slot.status === 'occupied' || slot.status === 'reserved') {
      const reservation = reservations.get(slot.id);
      if (reservation) {
        setSelectedSlot(slot);
        setExitModalOpen(true);
      } else {
        toast.info(`Slot ${slot.slotNumber} is ${slot.status}`);
      }
    }
  };

  const handleReservation = (vehicleNumber: string) => {
    if (!selectedSlot) return;

    const reservationId = `RES${Date.now().toString().slice(-8)}`;
    const entryTime = new Date();
    
    const qrData = JSON.stringify({
      reservationId,
      slotId: selectedSlot.id,
      slotNumber: selectedSlot.slotNumber,
      vehicleNumber,
      entryTime: entryTime.toISOString()
    });

    const reservation: Reservation = {
      id: reservationId,
      slotId: selectedSlot.id,
      slotNumber: selectedSlot.slotNumber,
      vehicleNumber,
      entryTime,
      qrCode: qrData,
      status: 'active'
    };

    const newReservations = new Map(reservations);
    newReservations.set(selectedSlot.id, reservation);
    setReservations(newReservations);
    
    setAllReservations(prev => [reservation, ...prev]);

    setSlots(slots.map(slot => 
      slot.id === selectedSlot.id 
        ? { 
            ...slot, 
            status: 'occupied',
            vehicleNumber,
            entryTime,
            reservationId
          }
        : slot
    ));

    setReservationModalOpen(false);
    setHighlightedSlot(selectedSlot.id);
    
    // Scroll to the highlighted slot
    setTimeout(() => {
      const element = document.getElementById(`slot-${selectedSlot.id}`);
      element?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 100);
    
    // Remove highlight after 5 seconds
    setTimeout(() => setHighlightedSlot(null), 5000);
    
    toast.success(`Slot ${selectedSlot.slotNumber} reserved successfully!`, {
      description: `Vehicle: ${vehicleNumber} - Navigate to your slot highlighted on the map`
    });
  };

  const handlePayment = () => {
    if (!selectedSlot) return;

    const reservation = reservations.get(selectedSlot.id);
    if (reservation) {
      const exitTime = new Date();
      const duration = Math.floor((exitTime.getTime() - reservation.entryTime.getTime()) / (1000 * 60));
      const fare = calculateFare(duration);
      
      const completedReservation: Reservation = {
        ...reservation,
        exitTime,
        duration,
        fare,
        status: 'completed'
      };
      
      setAllReservations(prev => 
        prev.map(r => r.id === reservation.id ? completedReservation : r)
      );
    }

    setSlots(slots.map(slot => 
      slot.id === selectedSlot.id 
        ? { 
            ...slot, 
            status: 'available',
            vehicleNumber: undefined,
            entryTime: undefined,
            reservationId: undefined
          }
        : slot
    ));

    const newReservations = new Map(reservations);
    newReservations.delete(selectedSlot.id);
    setReservations(newReservations);

    setExitModalOpen(false);
    toast.success("Payment successful!", {
      description: `Slot ${selectedSlot.slotNumber} is now available`
    });
  };

  const handleNavigateToSlot = (slotId: string) => {
    setHighlightedSlot(slotId);
    
    setTimeout(() => {
      const element = document.getElementById(`slot-${slotId}`);
      element?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 100);
    
    setTimeout(() => setHighlightedSlot(null), 5000);
    
    toast.info("Navigating to your slot", {
      description: "Your slot is highlighted on the map"
    });
  };

  const handleExitFromReservation = (reservation: Reservation) => {
    const slot = slots.find(s => s.id === reservation.slotId);
    if (slot) {
      setSelectedSlot(slot);
      setExitModalOpen(true);
    }
  };

  const availableCount = slots.filter(s => s.status === 'available').length;
  const occupiedCount = slots.filter(s => s.status === 'occupied').length;
  const reservedCount = slots.filter(s => s.status === 'reserved').length;

  return (
    <div className="space-y-6">
      <MyReservations 
        reservations={allReservations} 
        onNavigate={handleNavigateToSlot}
        onExitAndPay={handleExitFromReservation}
      />
      
      <Card className="p-4">
        <div className="flex flex-wrap gap-4 justify-center">
          <Badge variant="outline" className="gap-2 px-4 py-2 text-sm bg-available/20 border-available">
            <div className="w-3 h-3 rounded-full bg-available" />
            Available: {availableCount}
          </Badge>
          <Badge variant="outline" className="gap-2 px-4 py-2 text-sm bg-occupied/20 border-occupied">
            <div className="w-3 h-3 rounded-full bg-occupied" />
            Occupied: {occupiedCount}
          </Badge>
          <Badge variant="outline" className="gap-2 px-4 py-2 text-sm bg-reserved/20 border-reserved">
            <div className="w-3 h-3 rounded-full bg-reserved" />
            Reserved: {reservedCount}
          </Badge>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
          <MapPin className="w-5 h-5" />
          Parking Map - All Slots
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-3">
          {slots.map(slot => (
            <div 
              key={slot.id} 
              id={`slot-${slot.id}`}
              className={highlightedSlot === slot.id ? "animate-pulse ring-4 ring-primary rounded-lg" : ""}
            >
              <ParkingSlot
                slot={slot}
                onClick={() => handleSlotClick(slot)}
              />
            </div>
          ))}
        </div>
      </Card>

      <ReservationModal
        open={reservationModalOpen}
        onClose={() => setReservationModalOpen(false)}
        slotNumber={selectedSlot?.slotNumber || ''}
        onConfirm={handleReservation}
      />

      <ExitModal
        open={exitModalOpen}
        onClose={() => setExitModalOpen(false)}
        reservation={selectedSlot ? reservations.get(selectedSlot.id) || null : null}
        onPayment={handlePayment}
      />
    </div>
  );
};
