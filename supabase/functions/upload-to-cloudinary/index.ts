
import { serve } from "https://deno.land/std@0.170.0/http/server.ts";
import { v2 as cloudinary } from "https://esm.sh/cloudinary@1.33.0";

// This function handles image uploads to Cloudinary
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

  try {
    // Configure Cloudinary with credentials from environment variables
    cloudinary.config({
      cloud_name: Deno.env.get("CLOUDINARY_CLOUD_NAME"),
      api_key: Deno.env.get("CLOUDINARY_API_KEY"),
      api_secret: Deno.env.get("CLOUDINARY_API_SECRET"),
      secure: true,
    });

    // Check if this is a form upload or a URL upload
    const contentType = req.headers.get("content-type") || "";
    
    if (contentType.includes("multipart/form-data")) {
      // Handle direct file upload
      const formData = await req.formData();
      const file = formData.get("file") as File;
      
      if (!file) {
        return new Response(
          JSON.stringify({ error: "No file provided" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Convert file to buffer
      const arrayBuffer = await file.arrayBuffer();
      const buffer = new Uint8Array(arrayBuffer);

      // Upload to Cloudinary using buffer upload
      const uploadResult = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: "photos", // Store in a 'photos' folder
            resource_type: "image",
          },
          (error, result) => {
            if (error) {
              reject(error);
              return;
            }
            resolve(result);
          }
        );

        // Write the buffer to the upload stream
        uploadStream.write(buffer, (err: Error | null) => {
          if (err) {
            uploadStream.destroy(err);
            return;
          }
          uploadStream.end();
        });
      });

      return new Response(
        JSON.stringify(uploadResult),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    } else {
      // Handle URL upload (for migration)
      const jsonData = await req.json();
      const { imageUrl, fileName } = jsonData;
      
      if (!imageUrl) {
        return new Response(
          JSON.stringify({ error: "No image URL provided" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Upload to Cloudinary using the URL
      const result = await cloudinary.uploader.upload(imageUrl, {
        folder: "photos", // Store in a 'photos' folder
        public_id: fileName ? fileName.split('.')[0] : undefined, // Use filename without extension if provided
      });

      return new Response(
        JSON.stringify(result),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
  } catch (error) {
    console.error("Upload error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
