
'use client';

import Script from 'next/script';

export function KofiWidget() {
  return (
    <Script
      src="https://storage.ko-fi.com/cdn/scripts/overlay-widget.js"
      strategy="afterInteractive"
      onLoad={() => {
        // @ts-ignore
        if (typeof kofiWidgetOverlay !== 'undefined') {
          // @ts-ignore
          kofiWidgetOverlay.draw('sanctyr', {
            type: 'floating-chat',
            'floating-chat.donateButton.text': 'Support Us',
            'floating-chat.donateButton.background-color': '#E63946',
            'floating-chat.donateButton.text-color': '#fff',
            'floating-chat.panel.background-color': '#0D0D0D',
          });
        }
      }}
    />
  );
}
