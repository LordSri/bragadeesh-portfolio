
import { Json } from "@/integrations/supabase/types";

export interface ExifData {
  camera?: string;
  date?: string;
  location?: string;
  exposure?: string;
  [key: string]: string | undefined;
}

export interface BeforeAfterData {
  before: string;
  after: string;
  [key: string]: string;
}

export interface Photo {
  id: string;
  src: string;
  title: string;
  description: string;
  award?: string;
  aspectRatio: string;
  exif?: ExifData;
  beforeAfter?: BeforeAfterData;
  storageId?: string;
  fileName?: string;
  cloudinaryId?: string;
  cloudinaryUrl?: string;
}

// Database types that match Supabase table structure
export interface PhotoDbRecord {
  id: string;
  title: string;
  description: string;
  aspect_ratio: string;
  award?: string;
  exif?: Json;
  before_after?: Json;
  storage_id: string;
  file_name: string;
  created_at: string;
  updated_at: string;
  cloudinary_id?: string;
  cloudinary_url?: string;
}
