import { useCallback, useState, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, X, Loader2 } from "lucide-react";
import { uploadService } from "../../services/uploadService";
import toast from "react-hot-toast";

const ImageUploader = ({
  value,
  onChange,
  onRemove,
  label = "Product Image",
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [preview, setPreview] = useState(value || null);
  const [blobUrl, setBlobUrl] = useState(null);

  // Sync preview when value changes (e.g., edit product)
  useEffect(() => {
    if (value && value !== preview) {
      setPreview(value);
    }
    // Cleanup blob URL on unmount
    return () => {
      if (blobUrl) {
        URL.revokeObjectURL(blobUrl);
      }
    };
  }, [value]);

  const onDrop = useCallback(
    async (acceptedFiles) => {
      const file = acceptedFiles[0];
      if (!file) return;

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File size too large. Maximum 5MB");
        return;
      }

      // Validate file type
      const allowedTypes = [
        "image/jpeg",
        "image/png",
        "image/jpg",
        "image/gif",
        "image/webp",
      ];
      if (!allowedTypes.includes(file.type)) {
        toast.error(
          "Invalid file type. Only JPEG, PNG, JPG, GIF, WEBP are allowed",
        );
        return;
      }

      // Clean up previous blob URL if exists
      if (blobUrl) {
        URL.revokeObjectURL(blobUrl);
      }

      // Show preview immediately with blob URL
      const newBlobUrl = URL.createObjectURL(file);
      setBlobUrl(newBlobUrl);
      setPreview(newBlobUrl);

      // Upload to server
      setIsUploading(true);
      try {
        const response = await uploadService.uploadImage(file);
        if (response.success) {
          const permanentUrl = response.data.url;
          onChange(permanentUrl);
          setPreview(permanentUrl); // Replace blob URL with permanent URL

          // Clean up blob URL after successful upload
          URL.revokeObjectURL(newBlobUrl);
          setBlobUrl(null);

          toast.success("Image uploaded successfully");
        } else {
          toast.error(response.message || "Upload failed");
          // Revert to previous value or null
          setPreview(value || null);
        }
      } catch (error) {
        console.error("Upload error:", error);
        toast.error(error.response?.data?.message || "Failed to upload image");
        setPreview(value || null);
      } finally {
        setIsUploading(false);
      }
    },
    [onChange, value, blobUrl],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".gif", ".webp"],
    },
    maxFiles: 1,
    multiple: false,
  });

  const handleRemove = () => {
    // Clean up blob URL if exists
    if (blobUrl) {
      URL.revokeObjectURL(blobUrl);
      setBlobUrl(null);
    }
    setPreview(null);
    onRemove?.();
    onChange("");
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-dark">{label}</label>

      {!preview ? (
        // Dropzone area when no image
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all
            ${
              isDragActive
                ? "border-primary bg-primary/10"
                : "border-gray-300 hover:border-primary hover:bg-primary/5"
            }`}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center gap-2">
            <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
              <Upload className="w-6 h-6 text-secondary" />
            </div>
            <div>
              <p className="text-sm font-medium text-dark">
                {isDragActive
                  ? "Drop image here"
                  : "Click or drag image to upload"}
              </p>
              <p className="text-xs text-gray mt-1">
                PNG, JPG, JPEG, GIF, WEBP up to 5MB
              </p>
            </div>
          </div>
        </div>
      ) : (
        // Image preview area
        <div className="relative group">
          <div className="relative rounded-xl overflow-hidden border border-gray-200 bg-gray-50">
            <img
              src={preview}
              alt="Product preview"
              className="w-full h-48 object-cover"
              onError={() => {
                // If image fails to load (e.g., blob URL expired), clear it
                setPreview(null);
                onChange("");
                if (blobUrl) {
                  URL.revokeObjectURL(blobUrl);
                  setBlobUrl(null);
                }
              }}
            />

            {/* Overlay on hover */}
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
              <div
                {...getRootProps()}
                className="p-2 bg-white rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
              >
                <input {...getInputProps()} />
                <Upload className="w-4 h-4 text-secondary" />
              </div>
              <button
                onClick={handleRemove}
                className="p-2 bg-white rounded-lg hover:bg-red-50 transition-colors"
                type="button"
              >
                <X className="w-4 h-4 text-error" />
              </button>
            </div>

            {/* Loading overlay saat upload */}
            {isUploading && (
              <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
                <div className="flex flex-col items-center gap-2">
                  <Loader2 className="w-8 h-8 text-secondary animate-spin" />
                  <p className="text-sm text-gray">Uploading...</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Info text */}
      <p className="text-xs text-gray-400">
        Recommended: Square image, minimum 300x300px
      </p>
    </div>
  );
};

export default ImageUploader;
