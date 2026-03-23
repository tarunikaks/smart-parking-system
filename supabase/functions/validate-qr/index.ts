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
    const { qrData } = await req.json();

    if (!qrData) {
      return new Response(
        JSON.stringify({ valid: false, error: "No QR data provided" }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    let parsed;
    try {
      parsed = JSON.parse(qrData);
    } catch {
      return new Response(
        JSON.stringify({ valid: false, error: "Invalid QR code format" }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { reservationId, slotId, slotNumber, vehicleNumber, entryTime } = parsed;

    if (!reservationId || !slotId || !slotNumber || !vehicleNumber || !entryTime) {
      return new Response(
        JSON.stringify({ valid: false, error: "Incomplete QR data" }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const entry = new Date(entryTime);
    const now = new Date();
    const durationMinutes = Math.floor((now.getTime() - entry.getTime()) / (1000 * 60));

    // Fare calculation: ₹20 first hour, ₹10 each additional hour
    const hours = Math.ceil(durationMinutes / 60);
    const fare = hours <= 1 ? 20 : 20 + (hours - 1) * 10;

    return new Response(
      JSON.stringify({
        valid: true,
        reservation: {
          reservationId,
          slotId,
          slotNumber,
          vehicleNumber,
          entryTime,
          currentTime: now.toISOString(),
          durationMinutes,
          estimatedFare: fare,
          currency: "INR",
        },
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ valid: false, error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
