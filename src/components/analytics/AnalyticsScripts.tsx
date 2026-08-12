"use client";

import Script from "next/script";
import { ANALYTICS } from "@/lib/constants";
import { trackClientEvent } from "@/lib/client-analytics";
import { useEffect } from "react";

/**
 * Loads Google Analytics (GA4), Meta Pixel and TikTok Pixel scripts
 * only when their IDs are configured in .env.
 */
export function AnalyticsScripts() {
  const hasAny = Boolean(ANALYTICS.gaId || ANALYTICS.metaPixelId || ANALYTICS.tiktokPixelId);

  useEffect(() => {
    trackClientEvent("page_view");
  }, []);

  return (
    <>
      {ANALYTICS.gaId && (
        <>
          <Script src={`https://www.googletagmanager.com/gtag/js?id=${ANALYTICS.gaId}`} strategy="afterInteractive" />
          <Script id="ga-init" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${ANALYTICS.gaId}');
            `}
          </Script>
        </>
      )}
      {ANALYTICS.metaPixelId && (
        <>
          <Script id="meta-init" strategy="afterInteractive">
            {`
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '${ANALYTICS.metaPixelId}');
              fbq('track', 'PageView');
            `}
          </Script>
        </>
      )}
      {ANALYTICS.tiktokPixelId && (
        <>
          <Script id="tiktok-init" strategy="afterInteractive">
            {`
              !function (w, d, t) {
                w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];
                ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie"],ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};
                for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);
                ttq.load=function(e,n){var i="https://analytics.tiktok.com/i18n/pixel/events.js";ttq._i=ttq._i||{},ttq._i[e]=[],ttq._i[e]._u=i,ttq._t=ttq._t||{},ttq._t[e]=+new Date,ttq._o=ttq._o||{},ttq._o[e]=n||{};
                ttq._partner=ttq._partner||"opencode";var o=document.createElement("script");o.type="text/javascript",o.async=!0,o.src=i+"?sdkid="+e+"&lib="+t;var a=document.getElementsByTagName("script")[0];a.parentNode.insertBefore(o,a)};
                ttq.load('${ANALYTICS.tiktokPixelId}');
                ttq.page();
              }(window, document, 'ttq');
            `}
          </Script>
        </>
      )}
      {!hasAny && null}
    </>
  );
}
