
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
