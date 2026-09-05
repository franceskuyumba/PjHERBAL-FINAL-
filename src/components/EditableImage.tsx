"use client";
import { useState } from "react";
import Image from "next/image";
import { Camera } from "lucide-react";

interface EditableImageProps {
  sectionKey: string;
  defaultSrc: string;
  alt: string;
  className?: string;
  isAdmin?: boolean;
}

export default function EditableImage({ sectionKey, defaultSrc, alt, className = "", isAdmin = true }: EditableImageProps) {
  const [src, setSrc] = useState(defaultSrc);
  const [loading, setLoading] = useState(false);

  const compressAndUpload = async (file: File) => {
    setLoading(true);
    const img = document.createElement("img");
    img.src = URL.createObjectURL(file);

    img.onload = () => {
      const canvas = document.createElement("canvas");
      const MAX_WIDTH = 800; // Resize large mobile photos down to 800px width
      const scaleSize = MAX_WIDTH / img.width;
      
      canvas.width = img.width > MAX_WIDTH ? MAX_WIDTH : img.width;
      canvas.height = img.width > MAX_WIDTH ? img.height * scaleSize : img.height;

      const ctx = canvas.getContext("2d");
      ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);

      // Compress photo quality to 70% JPEG
      const compressedBase64 = canvas.toDataURL("image/jpeg", 0.7);

      fetch("/api/admin/media", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sectionKey, imageBase64: compressedBase64, altText: alt }),
      }).then(() => {
        setSrc(compressedBase64);
        setLoading(false);
      });
    };
  };

  return (
    <div className={`relative group ${className}`}>
      <Image src={src} alt={alt} fill unoptimized className="object-cover rounded-lg" />
      {isAdmin && (
        <label className="absolute bottom-2 right-2 bg-black/70 hover:bg-black text-white p-2 rounded-full cursor-pointer transition-all shadow-md z-10 flex items-center justify-center">
          <Camera className="w-5 h-5" />
          <input 
            type="file" 
            accept="image/*" 
            onChange={(e) => e.target.files?.[0] && compressAndUpload(e.target.files[0])} 
            className="hidden" 
            disabled={loading} 
          />
        </label>
      )}
    </div>
  );
}
