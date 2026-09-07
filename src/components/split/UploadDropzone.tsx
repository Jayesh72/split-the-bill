import React, { useRef, useState, useEffect, useCallback } from 'react';
import { FolderOpen, Camera, Clipboard, Sparkles, X, AlertCircle, FileImage, ShieldAlert } from 'lucide-react';
import { cn } from '@/lib/utils';
import { LogoIcon } from '@/components/ui/LogoIcon';

const MAX_FILES = 5;
const ALLOWED_EXTENSIONS = ['.png', '.jpeg', '.jpg', '.webp', '.heic', '.pdf', '.bmp', '.tiff'];
const RATE_LIMIT_WINDOW_MS = 60000; // 1 minute
const MAX_UPLOADS_PER_WINDOW = 5;
const MIN_COOLDOWN_MS = 2000; // 2s cooldown

interface UploadDropzoneProps {
  files: File[];
  onFilesChange: (files: File[]) => void;
  onSampleSelected: () => void;
}

export const UploadDropzone: React.FC<UploadDropzoneProps> = ({
  files,
  onFilesChange,
  onSampleSelected,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [rateLimitCooldown, setRateLimitCooldown] = useState<number>(0);

  // Rate limiting state (persisted in ref)
  const uploadTimestamps = useRef<number[]>([]);
  const lastUploadTime = useRef<number>(0);

  // Rate limit cooldown countdown timer
  useEffect(() => {
    if (rateLimitCooldown <= 0) return;
    const timer = setInterval(() => {
      setRateLimitCooldown((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [rateLimitCooldown]);

  const checkRateLimit = useCallback((): boolean => {
    const now = Date.now();

    // Check minimum cooldown
    if (now - lastUploadTime.current < MIN_COOLDOWN_MS) {
      const waitSec = Math.ceil((MIN_COOLDOWN_MS - (now - lastUploadTime.current)) / 1000);
      setErrorMessage(`Please wait ${waitSec}s before uploading again.`);
      return false;
    }

    // Filter timestamps within the window
    uploadTimestamps.current = uploadTimestamps.current.filter(
      (time) => now - time < RATE_LIMIT_WINDOW_MS
    );

    if (uploadTimestamps.current.length >= MAX_UPLOADS_PER_WINDOW) {
      const oldestTimestamp = uploadTimestamps.current[0];
      const waitSec = Math.ceil((RATE_LIMIT_WINDOW_MS - (now - oldestTimestamp)) / 1000);
      setRateLimitCooldown(waitSec);
      setErrorMessage(`Rate limit reached (max ${MAX_UPLOADS_PER_WINDOW} uploads/min). Please wait ${waitSec}s.`);
      return false;
    }

    uploadTimestamps.current.push(now);
    lastUploadTime.current = now;
    return true;
  }, []);

  const validateAndAddFiles = useCallback(
    (incomingFiles: FileList | File[]) => {
      setErrorMessage(null);

      if (!checkRateLimit()) {
        return;
      }

      const validFiles: File[] = [];
      const invalidNames: string[] = [];

      Array.from(incomingFiles).forEach((file) => {
        const extension = '.' + file.name.split('.').pop()?.toLowerCase();
        if (ALLOWED_EXTENSIONS.includes(extension)) {
          validFiles.push(file);
        } else {
          invalidNames.push(file.name);
        }
      });

      if (invalidNames.length > 0) {
        setErrorMessage(
          `Unsupported file type for: ${invalidNames.join(', ')}. Allowed extensions: ${ALLOWED_EXTENSIONS.join(', ')}`
        );
      }

      if (validFiles.length === 0) return;

      const totalCount = files.length + validFiles.length;
      if (totalCount > MAX_FILES) {
        const slotsLeft = Math.max(0, MAX_FILES - files.length);
        const accepted = validFiles.slice(0, slotsLeft);
        onFilesChange([...files, ...accepted]);
        setErrorMessage(
          `Upload limit is maximum ${MAX_FILES} images at a time. Only ${slotsLeft} file(s) added.`
        );
      } else {
        onFilesChange([...files, ...validFiles]);
      }
    },
    [checkRateLimit, files, onFilesChange]
  );

  // Global paste listener
  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items) return;

      const pastedFiles: File[] = [];
      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf('image') !== -1) {
          const file = items[i].getAsFile();
          if (file) {
            pastedFiles.push(file);
          }
        }
      }

      if (pastedFiles.length > 0) {
        validateAndAddFiles(pastedFiles);
      }
    };

    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, [validateAndAddFiles]);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      validateAndAddFiles(e.dataTransfer.files);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      validateAndAddFiles(e.target.files);
    }
    // reset input value so re-selecting same file works
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemoveFile = (index: number) => {
    const updated = [...files];
    updated.splice(index, 1);
    onFilesChange(updated);
    setErrorMessage(null);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={cn(
        'w-full bg-white rounded-3xl p-6 sm:p-10 text-center transition-all duration-200 border-2',
        isDragging
          ? 'border-[#0D766E] bg-brand-50/30 scale-[1.01]'
          : 'border-dashed border-charcoal-200/90 shadow-[0_10px_30px_-4px_rgba(15,23,42,0.06),0_4px_12px_-2px_rgba(15,23,42,0.03)]'
      )}
    >
      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept={ALLOWED_EXTENSIONS.join(',')}
        className="hidden"
        onChange={handleFileChange}
        aria-label="Upload restaurant bill"
      />

      {/* Center Icon */}
      <div className="w-16 h-16 rounded-full bg-[#E6F4EA] border border-[#A7F3D0]/80 flex items-center justify-center text-[#0D766E] shadow-sm mx-auto mb-5">
        <LogoIcon className="w-8 h-8 text-[#0D766E]" size={32} />
      </div>

      {/* Main Title */}
      <h2 className="text-xl sm:text-2xl font-extrabold text-charcoal-900 tracking-tight mb-2">
        Drop your restaurant receipt here
      </h2>

      {/* Description */}
      <p className="text-xs text-charcoal-500 max-w-md mx-auto leading-relaxed mb-4">
        Supports <span className="font-semibold text-charcoal-700">PNG, JPEG, JPG, WebP, HEIC, PDF</span> up to 25MB.
        Upload maximum <span className="font-semibold text-charcoal-700">{MAX_FILES} images</span> at a time.
      </p>

      {/* Error / Rate limit Notice */}
      {errorMessage && (
        <div className="flex items-center justify-center gap-2 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium mb-4 max-w-lg mx-auto">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {rateLimitCooldown > 0 && (
        <div className="flex items-center justify-center gap-2 p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs font-semibold mb-4 max-w-lg mx-auto">
          <ShieldAlert className="w-4 h-4 flex-shrink-0 text-amber-600" />
          <span>Rate limit active: Cooldown for {rateLimitCooldown}s</span>
        </div>
      )}

      {/* Primary Action Button: Browse Files */}
      <div className="mb-6">
        <button
          type="button"
          disabled={files.length >= MAX_FILES}
          onClick={() => fileInputRef.current?.click()}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-white hover:bg-charcoal-50 disabled:opacity-50 disabled:pointer-events-none border border-charcoal-200/90 shadow-sm text-xs sm:text-sm font-bold text-charcoal-800 transition-all hover:border-charcoal-300 hover:shadow active:scale-[0.99] cursor-pointer"
        >
          <FolderOpen className="w-4 h-4 text-charcoal-600" />
          <span>Browse Files ({files.length}/{MAX_FILES})</span>
        </button>
      </div>

      {/* Selected Files List */}
      {files.length > 0 && (
        <div className="mb-6 max-w-lg mx-auto text-left">
          <div className="flex items-center justify-between text-xs font-bold text-charcoal-700 mb-2 px-1">
            <span>Selected Files ({files.length}/{MAX_FILES})</span>
            <button
              type="button"
              onClick={() => onFilesChange([])}
              className="text-[11px] font-semibold text-red-600 hover:underline cursor-pointer"
            >
              Clear all
            </button>
          </div>

          <div className="flex flex-col gap-2">
            {files.map((file, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-2.5 rounded-xl bg-[#F8FAFC] border border-charcoal-200/80 shadow-sm"
              >
                <div className="flex items-center gap-2.5 overflow-hidden">
                  <div className="w-7 h-7 rounded-lg bg-[#E6F4EA] text-[#0D766E] flex items-center justify-center flex-shrink-0">
                    <FileImage className="w-4 h-4" />
                  </div>
                  <div className="overflow-hidden">
                    <div className="text-xs font-semibold text-charcoal-900 truncate">
                      {file.name}
                    </div>
                    <div className="text-[10px] text-charcoal-500 font-medium">
                      {formatFileSize(file.size)}
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleRemoveFile(idx)}
                  className="w-6 h-6 rounded-full hover:bg-charcoal-200 flex items-center justify-center text-charcoal-500 hover:text-charcoal-800 transition-colors flex-shrink-0"
                  aria-label={`Remove ${file.name}`}
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick Action Badges */}
      <div className="flex flex-wrap items-center justify-center gap-2.5 pt-4 border-t border-charcoal-100/90">
        <button
          type="button"
          disabled={files.length >= MAX_FILES}
          onClick={() => fileInputRef.current?.click()}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white hover:bg-charcoal-50 disabled:opacity-50 border border-charcoal-200 text-xs font-semibold text-charcoal-700 shadow-sm transition-all cursor-pointer"
        >
          <Camera className="w-3.5 h-3.5 text-charcoal-500" />
          <span>Open Camera</span>
        </button>

        <button
          type="button"
          disabled={files.length >= MAX_FILES}
          onClick={() => {
            // Focus trigger for paste
          }}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white hover:bg-charcoal-50 disabled:opacity-50 border border-charcoal-200 text-xs font-semibold text-charcoal-700 shadow-sm transition-all cursor-pointer"
        >
          <Clipboard className="w-3.5 h-3.5 text-charcoal-500" />
          <span>Paste Screenshot (Ctrl+V)</span>
        </button>

        <button
          type="button"
          onClick={onSampleSelected}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#E6F4EA] hover:bg-[#d5eee0] border border-[#A7F3D0]/80 text-xs font-bold text-[#0D766E] shadow-sm transition-all cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#0D766E]" />
          <span>Sample: The Olive Table</span>
        </button>
      </div>
    </div>
  );
};
