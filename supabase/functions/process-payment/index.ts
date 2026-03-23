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
    const { reservationId, slotNumber, vehicleNumber, durationMinutes, fare } = await req.json();

    if (!reservationId || !slotNumber || !vehicleNumber || durationMinutes === undefined || fare === undefined) {
      return new Response(
        JSON.stringify({ success: false, error: "Missing required fields" }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Simulate payment processing
    const transactionId = `TXN${Date.now()}`;
    const paymentMethod = "UPI";
    const taxRate = 0.18;
    const taxAmount = parseFloat((fare * taxRate).toFixed(2));
    const totalAmount = parseFloat((fare + taxAmount).toFixed(2));

    const receipt = {
      transactionId,
      reservationId,
      slotNumber,
      vehicleNumber,
      durationMinutes,
      baseFare: fare,
      taxAmount,
      totalAmount,
      paymentMethod,
      paymentStatus: "success",
      paidAt: new Date().toISOString(),
      currency: "INR",
    };

    return new Response(
      JSON.stringify({ success: true, receipt }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
