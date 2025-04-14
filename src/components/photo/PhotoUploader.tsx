
import React, { useState } from 'react';
import { Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { uploadPhoto, savePhotoMetadata, calculateAspectRatio } from '@/utils/photoUtils';
import { toast } from 'sonner';

interface PhotoUploaderProps {
  onPhotoUploaded: () => void;
}

const PhotoUploader: React.FC<PhotoUploaderProps> = ({ onPhotoUploaded }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [files, setFiles] = useState<File[]>([]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const newFiles = Array.from(event.target.files);
      setFiles(newFiles);
    }
  };

  const handleUpload = async () => {
    if (files.length === 0) {
      toast.error('Please select at least one photo to upload');
      return;
    }

    setIsUploading(true);

    try {
      // Process each file
      for (const file of files) {
        // Upload to Supabase Storage
        const storageId = await uploadPhoto(file);
        
        if (!storageId) {
          continue; // Skip if upload failed
        }

        // Create image element to get dimensions
        const img = new Image();
        img.src = URL.createObjectURL(file);
        await new Promise(resolve => {
          img.onload = resolve;
        });

        // Save metadata
        await savePhotoMetadata({
          src: '', // Will be generated from storageId
          title: file.name.split('.')[0],
          description: '',
          aspectRatio: calculateAspectRatio(img.width, img.height),
          storageId: storageId,
          fileName: file.name,
          exif: {
            date: new Date().toLocaleDateString()
          }
        });

        // Cleanup object URL
        URL.revokeObjectURL(img.src);
      }

      toast.success(`${files.length} photo(s) uploaded successfully`);
      setFiles([]);
      onPhotoUploaded(); // Refresh gallery
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload photos');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="mb-8 p-4 bg-gray-900/50 rounded-xl border border-dashed border-slate-700">
      <h3 className="text-lg font-medium mb-2">Upload Photos</h3>
      <p className="text-sm text-gray-400 mb-4">
        Upload photos to your gallery. They'll be stored permanently.
      </p>
      <div className="flex items-center space-x-4">
        <Button 
          onClick={() => document.getElementById('photo-upload')?.click()}
          variant="outline"
          className="flex items-center space-x-2 bg-slate-800 hover:bg-slate-700 border-slate-600"
          disabled={isUploading}
        >
          <Upload size={16} />
          <span>Select Photos</span>
        </Button>
        <input 
          id="photo-upload" 
          type="file" 
          multiple 
          accept="image/*" 
          onChange={handleFileChange} 
          className="hidden"
          disabled={isUploading}
        />
        {files.length > 0 && (
          <Button 
            onClick={handleUpload} 
            className="bg-blue-600 hover:bg-blue-700"
            disabled={isUploading}
          >
            {isUploading ? 'Uploading...' : `Upload ${files.length} Photo(s)`}
          </Button>
        )}
      </div>
      {files.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {Array.from(files).map((file, index) => (
            <div key={index} className="w-16 h-16 rounded-md overflow-hidden">
              <img 
                src={URL.createObjectURL(file)} 
                alt={`Upload ${index + 1}`} 
                className="w-full h-full object-cover"
                onLoad={(e) => URL.revokeObjectURL((e.target as HTMLImageElement).src)}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PhotoUploader;
