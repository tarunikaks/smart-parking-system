import { Reservation } from "@/types/parking";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Calendar, Car, Clock, Navigation, Receipt } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface MyReservationsProps {
  reservations: Reservation[];
  onNavigate: (slotId: string) => void;
}

export const MyReservations = ({ reservations, onNavigate }: MyReservationsProps) => {
  const activeReservations = reservations.filter(r => r.status === 'active');
  const completedReservations = reservations.filter(r => r.status === 'completed');

  return (
    <Card className="p-6">
      <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
        <Receipt className="w-6 h-6 text-primary" />
        My Reservations
      </h2>

      {reservations.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          <Car className="w-12 h-12 mx-auto mb-2 opacity-50" />
          <p>No reservations yet</p>
        </div>
      ) : (
        <div className="space-y-6">
          {activeReservations.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <Badge variant="default" className="bg-available">Active Bookings</Badge>
                <span className="text-sm text-muted-foreground">({activeReservations.length})</span>
              </h3>
              <ScrollArea className="h-[300px]">
                <div className="space-y-3 pr-4">
                  {activeReservations.map((reservation) => (
                    <Card key={reservation.id} className="p-4 border-l-4 border-l-available">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <div className="font-bold text-lg text-foreground">
                            Slot {reservation.slotNumber}
                          </div>
                          <div className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                            <Car className="w-4 h-4" />
                            {reservation.vehicleNumber}
                          </div>
                        </div>
                        <Badge variant="default" className="bg-available">Active</Badge>
                      </div>
                      
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                        <Calendar className="w-4 h-4" />
                        <span>{formatDistanceToNow(reservation.entryTime, { addSuffix: true })}</span>
                      </div>

                      <Button
                        onClick={() => onNavigate(reservation.slotId)}
                        className="w-full"
                        variant="outline"
                        size="sm"
                      >
                        <Navigation className="w-4 h-4 mr-2" />
                        Navigate to Slot
                      </Button>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            </div>
          )}

          {completedReservations.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <Badge variant="secondary">Parking History</Badge>
                <span className="text-sm text-muted-foreground">({completedReservations.length})</span>
              </h3>
              <ScrollArea className="h-[200px]">
                <div className="space-y-3 pr-4">
                  {completedReservations.map((reservation) => (
                    <Card key={reservation.id} className="p-4 opacity-75">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <div className="font-semibold text-foreground">
                            Slot {reservation.slotNumber}
                          </div>
                          <div className="text-sm text-muted-foreground flex items-center gap-1">
                            <Car className="w-3 h-3" />
                            {reservation.vehicleNumber}
                          </div>
                        </div>
                        <Badge variant="secondary">Completed</Badge>
                      </div>
                      
                      {reservation.duration && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                          <Clock className="w-4 h-4" />
                          <span>{Math.floor(reservation.duration / 60)}h {reservation.duration % 60}m</span>
                        </div>
                      )}
                      
                      {reservation.fare && (
                        <div className="text-sm font-semibold text-primary">
                          ₹{reservation.fare}
                        </div>
                      )}
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            </div>
          )}
        </div>
      )}
    </Card>
  );
};
