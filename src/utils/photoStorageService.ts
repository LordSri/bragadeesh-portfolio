
import { supabase } from "@/integrations/supabase/client";

// Get public URL for a storage item (legacy support)
export const getPublicUrl = (path: string): string => {
  if (!path) return '';
  const { data } = supabase.storage.from('photos').getPublicUrl(path);
  return data.publicUrl;
};
