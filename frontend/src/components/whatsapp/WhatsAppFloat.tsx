"use client";

import { MessageCircle } from "lucide-react";
import { WHATSAPP_LINK } from "@/lib/constants";
import { WhatsAppIcon } from "./WhatsAppButton";

export default function WhatsAppFloat() {
  return (
    <a
      href={WHATSAPP_LINK()}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with a specialist on WhatsApp"
      className="group fixed bottom-5 right-5 z-50 flex items-center gap-2 rounded-full bg-[#25D366] p-4 text-white shadow-lg shadow-[#25D366]/40 transition-all hover:scale-105 hover:bg-[#1fb958]"
    >
      <WhatsAppIcon className="h-6 w-6" />
      <span className="hidden max-w-0 overflow-hidden whitespace-nowrap text-sm font-semibold transition-all duration-300 group-hover:max-w-[160px] group-hover:pr-1 sm:block">
        Chat with us
      </span>
      <span className="absolute -right-0.5 -top-0.5 flex h-3.5 w-3.5">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-60" />
        <span className="relative inline-flex h-3.5 w-3.5 rounded-full border-2 border-[#25D366] bg-red-500" />
      </span>
      <MessageCircle className="sr-only" />
    </a>
  );
}
