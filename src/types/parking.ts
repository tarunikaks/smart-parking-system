export type SlotStatus = 'available' | 'occupied' | 'reserved';

export interface ParkingSlot {
  id: string;
  slotNumber: string;
  status: SlotStatus;
  vehicleNumber?: string;
  entryTime?: Date;
  reservationId?: string;
  section: string;
}

export type BookingStatus = 'active' | 'completed';

export interface Reservation {
  id: string;
  slotId: string;
  slotNumber: string;
  vehicleNumber: string;
  entryTime: Date;
  exitTime?: Date;
  duration?: number;
  fare?: number;
  qrCode: string;
  status: BookingStatus;
}
