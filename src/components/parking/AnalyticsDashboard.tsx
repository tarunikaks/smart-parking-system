import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ParkingSlot, Reservation } from "@/types/parking";
import { supabase } from "@/integrations/supabase/client";
import { BarChart3, TrendingUp, Clock, IndianRupee, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface AnalyticsDashboardProps {
  slots: ParkingSlot[];
  reservations: Reservation[];
}

interface Analytics {
  overview: {
    totalSlots: number;
    availableSlots: number;
    occupiedSlots: number;
    reservedSlots: number;
    occupancyRate: string;
  };
  sections: Record<string, { total: number; available: number; occupied: number; reserved: number }>;
  revenue: {
    totalRevenue: number;
    completedBookings: number;
    averageDuration: string;
    averageFare: number;
    currency: string;
  };
  predictions: {
    currentPeriod: string;
    recommendedAction: string;
  };
}

export const AnalyticsDashboard = ({ slots, reservations }: AnalyticsDashboardProps) => {
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('parking-analytics', {
        body: { slots, reservations },
      });

      if (error) throw error;
      if (data.success) {
        setAnalytics(data.analytics);
      }
    } catch (err) {
      toast.error("Failed to fetch analytics");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-primary" />
          Parking Analytics
        </h3>
        <Button onClick={fetchAnalytics} disabled={loading} size="sm">
          {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <TrendingUp className="w-4 h-4 mr-2" />}
          {analytics ? "Refresh" : "Load Analytics"}
        </Button>
      </div>

      {analytics ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 bg-primary/10 rounded-lg border border-primary/20">
            <p className="text-xs text-muted-foreground mb-1">Occupancy Rate</p>
            <p className="text-2xl font-bold text-primary">{analytics.overview.occupancyRate}</p>
          </div>
          <div className="p-4 bg-available/10 rounded-lg border border-available/20">
            <p className="text-xs text-muted-foreground mb-1">Available</p>
            <p className="text-2xl font-bold text-available">{analytics.overview.availableSlots}/{analytics.overview.totalSlots}</p>
          </div>
          <div className="p-4 bg-warning/10 rounded-lg border border-warning/20">
            <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1">
              <IndianRupee className="w-3 h-3" /> Revenue
            </div>
            <p className="text-2xl font-bold text-warning">₹{analytics.revenue.totalRevenue}</p>
          </div>
          <div className="p-4 bg-muted rounded-lg">
            <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1">
              <Clock className="w-3 h-3" /> Avg Duration
            </div>
            <p className="text-2xl font-bold text-foreground">{analytics.revenue.averageDuration}</p>
          </div>

          <div className="col-span-full p-4 bg-muted rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <Badge variant="outline" className="mb-2">{analytics.predictions.currentPeriod}</Badge>
                <p className="text-sm text-muted-foreground">{analytics.predictions.recommendedAction}</p>
              </div>
              <div className="text-right text-sm">
                <p className="text-muted-foreground">Completed: <span className="font-bold text-foreground">{analytics.revenue.completedBookings}</span></p>
                <p className="text-muted-foreground">Avg Fare: <span className="font-bold text-foreground">₹{analytics.revenue.averageFare}</span></p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-8 text-muted-foreground">
          <BarChart3 className="w-12 h-12 mx-auto mb-2 opacity-50" />
          <p>Click "Load Analytics" to view parking insights</p>
        </div>
      )}
    </Card>
  );
};
