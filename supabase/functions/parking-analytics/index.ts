import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { slots, reservations } = await req.json();

    if (!slots || !Array.isArray(slots)) {
      return new Response(
        JSON.stringify({ success: false, error: "Invalid slots data" }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const totalSlots = slots.length;
    const availableSlots = slots.filter((s: any) => s.status === 'available').length;
    const occupiedSlots = slots.filter((s: any) => s.status === 'occupied').length;
    const reservedSlots = slots.filter((s: any) => s.status === 'reserved').length;

    const occupancyRate = totalSlots > 0 ? ((occupiedSlots + reservedSlots) / totalSlots * 100).toFixed(1) : "0";

    // Section-wise breakdown
    const sections: Record<string, any> = {};
    slots.forEach((slot: any) => {
      if (!sections[slot.section]) {
        sections[slot.section] = { total: 0, available: 0, occupied: 0, reserved: 0 };
      }
      sections[slot.section].total++;
      sections[slot.section][slot.status]++;
    });

    // Revenue analytics from reservations
    let totalRevenue = 0;
    let totalDuration = 0;
    let completedCount = 0;

    if (reservations && Array.isArray(reservations)) {
      reservations.forEach((r: any) => {
        if (r.status === 'completed' && r.fare) {
          totalRevenue += r.fare;
          completedCount++;
        }
        if (r.duration) {
          totalDuration += r.duration;
        }
      });
    }

    const avgDuration = completedCount > 0 ? Math.round(totalDuration / completedCount) : 0;
    const avgFare = completedCount > 0 ? parseFloat((totalRevenue / completedCount).toFixed(2)) : 0;

    // Peak hour prediction (simulated)
    const currentHour = new Date().getHours();
    const peakHours = currentHour >= 9 && currentHour <= 11 ? "Morning Rush (9-11 AM)" :
                      currentHour >= 17 && currentHour <= 19 ? "Evening Rush (5-7 PM)" :
                      currentHour >= 12 && currentHour <= 14 ? "Lunch Hour (12-2 PM)" :
                      "Off-Peak";

    return new Response(
      JSON.stringify({
        success: true,
        analytics: {
          overview: {
            totalSlots,
            availableSlots,
            occupiedSlots,
            reservedSlots,
            occupancyRate: `${occupancyRate}%`,
          },
          sections,
          revenue: {
            totalRevenue,
            completedBookings: completedCount,
            averageDuration: `${Math.floor(avgDuration / 60)}h ${avgDuration % 60}m`,
            averageFare: avgFare,
            currency: "INR",
          },
          predictions: {
            currentPeriod: peakHours,
            recommendedAction: parseFloat(occupancyRate) > 80
              ? "High demand - consider dynamic pricing"
              : parseFloat(occupancyRate) > 50
              ? "Moderate demand - normal operations"
              : "Low demand - consider promotional offers",
          },
          generatedAt: new Date().toISOString(),
        },
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
