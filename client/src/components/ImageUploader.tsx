import { useState, useRef } from "react";
import { Upload, X, ImageIcon, Loader2 } from "lucide-react";
import { toast } from "sonner";
import FlowerImage from "./FlowerImage";
import { useLanguage } from "@/contexts/LanguageContext";

interface ImageUploaderProps {
  /** Current image URL (from DB or previous upload) */
  value?: string | null;
  /** Called when a new URL is ready (after successful upload) or null when removed */
  onChange: (url: string | null) => void;
  /** Optional label shown above the upload area */
  label?: string;
  /** Optional className for the outer wrapper */
  className?: string;
}

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_BYTES = 5 * 1024 * 1024;

export default function ImageUploader({ value, onChange, label, className = "" }: ImageUploaderProps) {
  const { language } = useLanguage();
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [localPreview, setLocalPreview] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const displayUrl = localPreview || value;

  async function handleFile(file: File) {
    setError(null);

    if (!ALLOWED_TYPES.includes(file.type)) {
      const errorMsg = language === "ka" ? "მხოლოდ JPG, PNG და WebP ფორმატებია დაშვებული" : "Only JPG, PNG, and WebP images are allowed.";
      setError(errorMsg);
      toast.error(errorMsg);
      return;
    }
    if (file.size > MAX_BYTES) {
      const errorMsg = language === "ka" ? "სურათის ზომა 5 MB-ზე ნაკლები უნდა იყოს" : "Image must be smaller than 5 MB.";
      setError(errorMsg);
      toast.error(errorMsg);
      return;
    }

    // Show local preview immediately
    const objectUrl = URL.createObjectURL(file);
    setLocalPreview(objectUrl);
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload/image", {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || `Upload failed (${res.status})`);
      }

      const { url } = await res.json();
      setLocalPreview(null);
      URL.revokeObjectURL(objectUrl);
      onChange(url);
      const successMsg = language === "ka" ? "სურათი წარმატებით აიტვირთა" : "Image uploaded successfully";
      toast.success(successMsg);
    } catch (err: any) {
      const errorMsg = err.message || (language === "ka" ? "ატვირთვა ვერ მოხერხდა. გთხოვთ, სცადოთ ხელახლა" : "Upload failed. Please try again.");
      setError(errorMsg);
      setLocalPreview(null);
      URL.revokeObjectURL(objectUrl);
      toast.error(errorMsg);
    } finally {
      setUploading(false);
    }
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
    // Reset input so the same file can be re-selected
    e.target.value = "";
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  }

  function handleRemove() {
    setLocalPreview(null);
    setError(null);
    onChange(null);
  }

  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-[#1C1C1C]">{label}</label>
      )}

      {displayUrl ? (
        /* ── Image preview with replace/remove controls ── */
        <div className="relative group w-full max-w-xs">
          <div className="relative aspect-[3/4] rounded-xl overflow-hidden border border-[#E8E4DF] bg-[#F5F2EE]">
            <FlowerImage
              src={displayUrl}
              alt=""
              className="w-full h-full object-cover"
            />
            {uploading && (
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-white animate-spin" />
              </div>
            )}
          </div>

          {/* Controls overlay */}
          {!uploading && (
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors rounded-xl flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                className="flex items-center gap-1.5 px-3 py-2 bg-white text-[#1C1C1C] text-xs font-semibold rounded-lg shadow hover:bg-[#F5F2EE] transition-colors"
              >
                <Upload className="w-3.5 h-3.5" />
                {language === "ka" ? "შეცვლა" : "Replace"}
              </button>
              <button
                type="button"
                onClick={handleRemove}
                className="flex items-center gap-1.5 px-3 py-2 bg-white text-red-600 text-xs font-semibold rounded-lg shadow hover:bg-red-50 transition-colors"
              >
                <X className="w-3.5 h-3.5" />
                {language === "ka" ? "წაშლა" : "Remove"}
              </button>
            </div>
          )}
        </div>
      ) : (
        /* ── Drop zone ── */
        <div
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          onClick={() => !uploading && inputRef.current?.click()}
          className={`relative flex flex-col items-center justify-center w-full max-w-xs aspect-[3/4] rounded-xl border-2 border-dashed transition-colors cursor-pointer
            ${uploading ? "border-[#C4603A] bg-[#FDF0EA]" : "border-[#D8D0C8] bg-[#F5F2EE] hover:border-[#C4603A] hover:bg-[#FDF0EA]"}`}
        >
          {uploading ? (
            <>
              <Loader2 className="w-8 h-8 text-[#C4603A] animate-spin mb-2" />
              <p className="text-xs text-[#888]">{language === "ka" ? "იტვირთება…" : "Uploading…"}</p>
            </>
          ) : (
            <>
              <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center mb-3 shadow-sm">
                <ImageIcon className="w-6 h-6 text-[#C4603A]" />
              </div>
              <p className="text-sm font-medium text-[#1C1C1C] mb-1">{language === "ka" ? "დააწკაპუნეთ ან გადმოიტანეთ ფაილი" : "Click or drag to upload"}</p>
              <p className="text-xs text-[#888]">JPG, PNG, WebP · {language === "ka" ? "მაქს. 5 MB" : "max 5 MB"}</p>
            </>
          )}
        </div>
      )}

      {error && (
        <p className="text-xs text-red-600 flex items-center gap-1">
          <X className="w-3 h-3" /> {error}
        </p>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={handleInputChange}
      />
    </div>
  );
}
