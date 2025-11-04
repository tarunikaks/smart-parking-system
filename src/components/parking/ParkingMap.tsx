import { useState } from "react";
import { ParkingSlot } from "./ParkingSlot";
import { ReservationModal } from "./ReservationModal";
import { ExitModal } from "./ExitModal";
import { ParkingSlot as ParkingSlotType, Reservation } from "@/types/parking";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

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
          vehicleNumber: `MH${12 + sectionIndex}${String.fromCharCode(65 + Math.floor(Math.random() * 26))}${String.fromCharCode(65 + Math.floor(Math.random() * 26))}${1000 + Math.floor(Math.random() * 9000)}`,
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
      qrCode: qrData
    };

    const newReservations = new Map(reservations);
    newReservations.set(selectedSlot.id, reservation);
    setReservations(newReservations);

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
    toast.success(`Slot ${selectedSlot.slotNumber} reserved successfully!`, {
      description: `Vehicle: ${vehicleNumber}`
    });
  };

  const handlePayment = () => {
    if (!selectedSlot) return;

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

  const availableCount = slots.filter(s => s.status === 'available').length;
  const occupiedCount = slots.filter(s => s.status === 'occupied').length;
  const reservedCount = slots.filter(s => s.status === 'reserved').length;

  const groupedSlots = slots.reduce((acc, slot) => {
    if (!acc[slot.section]) {
      acc[slot.section] = [];
    }
    acc[slot.section].push(slot);
    return acc;
  }, {} as Record<string, ParkingSlotType[]>);

  return (
    <div className="space-y-6">
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

      <div className="space-y-8">
        {Object.entries(groupedSlots).map(([section, sectionSlots]) => (
          <div key={section} className="space-y-4">
            <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
              <Badge variant="outline" className="text-base px-3 py-1">
                Section {section}
              </Badge>
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-3">
              {sectionSlots.map(slot => (
                <ParkingSlot
                  key={slot.id}
                  slot={slot}
                  onClick={() => handleSlotClick(slot)}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

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
