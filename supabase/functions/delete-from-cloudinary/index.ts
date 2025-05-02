
import { serve } from "https://deno.land/std@0.170.0/http/server.ts";
import { v2 as cloudinary } from "https://esm.sh/cloudinary@1.33.0";

// This function handles deleting images from Cloudinary
serve(async (req: Request) => {
  // CORS headers to allow requests from any origin
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  };

  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  // Parse the request body
  const { publicId } = await req.json();

  if (!publicId) {
    return new Response(
      JSON.stringify({ error: "No publicId provided" }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  try {
    // Configure Cloudinary
    cloudinary.config({
      cloud_name: Deno.env.get("CLOUDINARY_CLOUD_NAME"),
      api_key: Deno.env.get("CLOUDINARY_API_KEY"),
      api_secret: Deno.env.get("CLOUDINARY_API_SECRET"),
      secure: true,
    });

    // Delete the image from Cloudinary
    const result = await cloudinary.uploader.destroy(publicId);

    return new Response(
      JSON.stringify(result),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Delete error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
