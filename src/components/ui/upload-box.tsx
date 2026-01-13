import { Upload, X, FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import { useRef, useState } from "react";

interface UploadBoxProps {
  label: string;
  description?: string;
  accept?: string;
  maxSize?: number; // in MB
  required?: boolean;
  onChange?: (file: File | null) => void;
  className?: string;
}

export function UploadBox({
  label,
  description = "Document size has to be less than 5 MB",
  accept = "image/*,.pdf",
  maxSize = 5,
  required = false,
  onChange,
  className,
}: UploadBoxProps) {
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    setError(null);

    if (selectedFile) {
      if (selectedFile.size > maxSize * 1024 * 1024) {
        setError(`File size must be less than ${maxSize} MB`);
        return;
      }
      setFile(selectedFile);
      onChange?.(selectedFile);
    }
  };

  const handleRemove = () => {
    setFile(null);
    onChange?.(null);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-baseline gap-1">
        <span className="font-medium text-gray-900">{label}</span>
        {required && <span className="text-red-500">*</span>}
      </div>
      <p className="text-sm text-gray-500">{description}</p>

      {!file ? (
        <label className="block">
          <input
            ref={inputRef}
            type="file"
            accept={accept}
            onChange={handleFileChange}
            className="hidden"
          />
          <div className="border-2 border-dashed border-primary/40 rounded-xl p-6 flex flex-col items-center justify-center gap-2 hover:border-primary hover:bg-primary/5 transition-all cursor-pointer">
            <Upload className="w-6 h-6 text-primary" />
            <span className="text-sm text-gray-600">Upload IMG or PDF</span>
          </div>
        </label>
      ) : (
        <div className="border border-gray-200 rounded-xl p-4 flex items-center justify-between bg-gray-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <p className="font-medium text-gray-900 text-sm truncate max-w-[180px]">
                {file.name}
              </p>
              <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleRemove}
            className="p-1 hover:bg-gray-200 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-red-500" />
          </button>
        </div>
      )}

      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}

export default UploadBox;
