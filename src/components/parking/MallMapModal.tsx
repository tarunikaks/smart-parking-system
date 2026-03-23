import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Navigation, ExternalLink } from "lucide-react";

interface MallMapModalProps {
  open: boolean;
  onClose: () => void;
  slotNumber: string;
  section: string;
}

const MALL_COORDS = { lat: 12.9925, lng: 80.2194 };
const MALL_NAME = "Phoenix MarketCity, Velachery, Chennai";

export const MallMapModal = ({ open, onClose, slotNumber, section }: MallMapModalProps) => {
  const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${MALL_COORDS.lat},${MALL_COORDS.lng}&destination_place_id=ChIJC3rV1qpmUjoR3TIYKiIxhQo&travelmode=driving`;
  const embedUrl = `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3888.0!2d${MALL_COORDS.lng}!3d${MALL_COORDS.lat}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a525a6ad5d50a0b%3A0xa8521223a2a18ddd!2sPhoenix%20MarketCity%20Chennai!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin`;

  const getFloorInfo = (section: string) => {
    switch (section) {
      case 'A': return { floor: 'Basement 1 (B1)', zone: 'Near Main Entrance', color: 'bg-primary' };
      case 'B': return { floor: 'Basement 2 (B2)', zone: 'Near Lift Lobby', color: 'bg-warning' };
      case 'C': return { floor: 'Basement 3 (B3)', zone: 'Near Emergency Exit', color: 'bg-destructive' };
      default: return { floor: 'Ground Floor', zone: 'Main Area', color: 'bg-muted' };
    }
  };

  const floorInfo = getFloorInfo(section);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Navigation className="w-5 h-5 text-primary" />
            Navigate to Your Slot
          </DialogTitle>
          <DialogDescription>
            {MALL_NAME}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Slot location info */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-muted rounded-lg text-center">
              <p className="text-xs text-muted-foreground mb-1">Your Slot</p>
              <p className="text-2xl font-bold text-primary">{slotNumber}</p>
            </div>
            <div className="p-3 bg-muted rounded-lg text-center">
              <p className="text-xs text-muted-foreground mb-1">Floor</p>
              <p className="text-lg font-semibold text-foreground">{floorInfo.floor}</p>
            </div>
          </div>

          <div className="p-3 bg-primary/10 rounded-lg border border-primary/20">
            <div className="flex items-center gap-2 mb-1">
              <MapPin className="w-4 h-4 text-primary" />
              <span className="font-medium text-sm">Zone: {floorInfo.zone}</span>
            </div>
            <p className="text-xs text-muted-foreground">
              Follow the signs to Section {section} after entering the parking area
            </p>
          </div>

          {/* Embedded Google Map */}
          <div className="rounded-lg overflow-hidden border">
            <iframe
              src={embedUrl}
              width="100%"
              height="300"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Phoenix MarketCity Chennai - Parking Location"
            />
          </div>

          {/* Directions */}
          <div className="space-y-2">
            <h4 className="font-semibold text-sm text-foreground">Parking Directions:</h4>
            <div className="space-y-1 text-sm text-muted-foreground">
              <p>1. Enter via Velachery Main Road gate</p>
              <p>2. Follow signs to <Badge variant="outline" className="text-xs">{floorInfo.floor}</Badge></p>
              <p>3. Look for Section <span className="font-bold text-foreground">{section}</span> markers</p>
              <p>4. Park at slot <span className="font-bold text-primary">{slotNumber}</span></p>
            </div>
          </div>

          {/* Open in Google Maps button */}
          <Button
            className="w-full gap-2"
            onClick={() => window.open(googleMapsUrl, '_blank')}
          >
            <ExternalLink className="w-4 h-4" />
            Open in Google Maps
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
