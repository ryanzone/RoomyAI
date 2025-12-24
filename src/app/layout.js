import { Raleway, Geist_Mono } from "next/font/google";
import "./globals.css";
import Chatbot from "@/components/chatbot";

const raleway = Raleway({
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "RoomyAI",
  description: "AI-powered interior design",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* THE FIX: This script catches the 404 redirect from GitHub/SPA settings */}
        <script
          type="text/javascript"
          dangerouslySetInnerHTML={{
            __html: `
              (function(l) {
                if (l.search[1] === '/' ) {
                  var decoded = l.search.slice(1).split('&').map(function(s) { 
                    return s.replace(/~and~/g, '&') 
                  }).join('?');
                  window.history.replaceState(null, null,
                      l.pathname.slice(0, -1) + decoded + l.hash
                  );
                }
              }(window.location));
            `,
          }}
        />
      </head>
      <body className={`${raleway.className} ${geistMono.variable} antialiased`}>
        {children}
        <Chatbot /> 
      </body>
    </html>
  );
}