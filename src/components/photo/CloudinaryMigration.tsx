
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { CloudCog } from 'lucide-react';
import { migratePhotosToCloudinary } from '@/utils/cloudinaryMigration';

const CloudinaryMigration: React.FC = () => {
  const [isMigrating, setIsMigrating] = useState(false);

  const handleMigration = async () => {
    if (isMigrating) return;
    
    setIsMigrating(true);
    try {
      await migratePhotosToCloudinary();
    } finally {
      setIsMigrating(false);
    }
  };

  return (
    <div className="p-4 bg-blue-900/30 rounded-xl mb-6">
      <h3 className="text-lg font-medium mb-2 flex items-center">
        <CloudCog className="mr-2" size={20} />
        Migrate Photos to Cloudinary
      </h3>
      <p className="text-sm text-gray-300 mb-4">
        Migrate existing photos from Supabase Storage to Cloudinary. 
        This will not delete your photos from Supabase, but will add Cloudinary URLs.
      </p>
      <Button 
        onClick={handleMigration}
        disabled={isMigrating}
        variant="default"
        className="bg-blue-600 hover:bg-blue-700"
      >
        {isMigrating ? 'Migration in progress...' : 'Start Migration'}
      </Button>
    </div>
  );
};

export default CloudinaryMigration;
