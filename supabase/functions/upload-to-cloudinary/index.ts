
// Follow this set up guide to use the Cloudinary SDK: 
// https://github.com/supabase/supabase/tree/master/examples/edge-functions/supabase/functions/cloudinary-image-upload

import { serve } from "https://deno.land/std@0.170.0/http/server.ts";
import { v2 as cloudinary } from "https://esm.sh/cloudinary@1.33.0";

// This function handles image uploads to Cloudinary
serve(async (req: Request) => {
  try {
    // Get the request data
    const formData = await req.formData();
    const file = formData.get("file") as File;
    
    if (!file) {
      return new Response(
        JSON.stringify({ error: "No file provided" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Configure Cloudinary with credentials from environment variables
    cloudinary.config({
      cloud_name: Deno.env.get("CLOUDINARY_CLOUD_NAME"),
      api_key: Deno.env.get("CLOUDINARY_API_KEY"),
      api_secret: Deno.env.get("CLOUDINARY_API_SECRET"),
      secure: true,
    });

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
      const chunk = buffer;
      uploadStream.write(chunk, (err: Error | null) => {
        if (err) {
          uploadStream.destroy(err);
          return;
        }
        uploadStream.end();
      });
    });

    return new Response(
      JSON.stringify(uploadResult),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Upload error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
});
