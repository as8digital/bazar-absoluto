import type { Metadata } from "next";
import "./globals.css";
import Script from "next/script";

export const metadata: Metadata = {
  title: "Bazar Absoluto USA",
  description: "Comunidade brasileira nos EUA - Massachusetts",
  manifest: "/manifest.json",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/icon-192.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-title" content="Bazar Absoluto" />
        <meta name="theme-color" content="#CC0000" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
      </head>
      <body>
        {children}
        <Script src="https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.page.js" strategy="afterInteractive" />
        <Script id="onesignal-init" strategy="afterInteractive">{`
          window.OneSignalDeferred = window.OneSignalDeferred || [];
          OneSignalDeferred.push(async function(OneSignal) {
            await OneSignal.init({
              appId: "cb2509bf-d38a-4037-af4a-9098cdde0b80",
              safari_web_id: "web.onesignal.auto.3b9e77c1-5852-4edd-a278-c29c156a72b0",
              notifyButton: {
                enable: true,
              },
              promptOptions: {
                slidedown: {
                  prompts: [{
                    type: "push",
                    autoPrompt: true,
                    text: {
                      actionMessage: "Ative notificações do Bazar Absoluto USA!",
                      acceptButton: "Ativar",
                      cancelButton: "Agora não",
                    },
                    delay: { timeDelay: 5 }
                  }]
                }
              }
            });
          });
        `}</Script>
      </body>
    </html>
  );
}
