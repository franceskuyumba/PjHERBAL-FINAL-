"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
    ttq?: { track?: (...args: unknown[]) => void };
  }
}

export default function AnalyticsProvider() {
  const pathname = usePathname();

  useEffect(() => {
    const ga = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
    if (ga && window.gtag) {
      window.gtag("config", ga, {
        page_path: pathname,
        send_page_view: true,
      });
    }
    if (window.fbq) {
      window.fbq("track", "PageView");
    }
    if (window.ttq?.track) {
      window.ttq.track("PageView");
    }
  }, [pathname]);

  useEffect(() => {
    const ga = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
    const meta = process.env.NEXT_PUBLIC_META_PIXEL_ID;
    const tiktok = process.env.NEXT_PUBLIC_TIKTOK_PIXEL_ID;

    if (ga) {
      const s = document.createElement("script");
      s.async = true;
      s.src = `https://www.googletagmanager.com/gtag/js?id=${ga}`;
      document.head.appendChild(s);
      window.dataLayer = window.dataLayer || [];
      window.gtag = function gtag() {
        window.dataLayer.push(arguments);
      };
      window.gtag("js", new Date());
    }

    if (meta) {
      const s = document.createElement("script");
      s.innerHTML = `
        !function(f,b,e,v,n,t,s)
        {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
        n.callMethod.apply(n,arguments):n.queue.push(arguments)};
        if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
        n.queue=[];t=b.createElement(e);t.async=!0;
        t.src=v;s=b.getElementsByTagName(e)[0];
        s.parentNode.insertBefore(t,s)}(window, document,'script',
        'https://connect.facebook.net/en_US/fbevents.js');
        fbq('init', '${meta}');
        fbq('track', 'PageView');
      `;
      document.head.appendChild(s);
    }

    if (tiktok) {
      const s = document.createElement("script");
      s.src = "https://analytics.tiktok.com/i18n/pixel/events.js?sdkid=" + tiktok;
      s.async = true;
      document.head.appendChild(s);
      window.ttq = window.ttq || [];
      if (window.ttq.track) window.ttq.track("PageView");
    }
  }, []);

  return null;
}
