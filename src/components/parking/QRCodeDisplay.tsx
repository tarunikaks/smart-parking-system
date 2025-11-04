import { QRCodeSVG } from 'qrcode.react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, Car, MapPin } from 'lucide-react';

interface QRCodeDisplayProps {
  reservationId: string;
  slotNumber: string;
  vehicleNumber: string;
  entryTime: Date;
  qrData: string;
}

export const QRCodeDisplay = ({ 
  reservationId, 
  slotNumber, 
  vehicleNumber, 
  entryTime,
  qrData 
}: QRCodeDisplayProps) => {
  return (
    <Card className="p-6 space-y-4">
      <div className="flex flex-col items-center space-y-4">
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <QRCodeSVG 
            value={qrData}
            size={200}
            level="H"
            includeMargin
          />
        </div>
        
        <div className="text-center space-y-2">
          <Badge variant="outline" className="text-xs">
            Reservation ID: {reservationId}
          </Badge>
          
          <div className="space-y-1 text-sm">
            <div className="flex items-center justify-center gap-2 text-muted-foreground">
              <MapPin className="w-4 h-4" />
              <span className="font-medium">Slot: {slotNumber}</span>
            </div>
            
            <div className="flex items-center justify-center gap-2 text-muted-foreground">
              <Car className="w-4 h-4" />
              <span className="font-medium">{vehicleNumber}</span>
            </div>
            
            <div className="flex items-center justify-center gap-2 text-muted-foreground">
              <Clock className="w-4 h-4" />
              <span>Entry: {entryTime.toLocaleTimeString('en-IN', { 
                hour: '2-digit', 
                minute: '2-digit',
                hour12: true 
              })}</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="text-xs text-center text-muted-foreground border-t pt-4">
        Scan this QR code at the exit gate for payment
      </div>
    </Card>
  );
};
