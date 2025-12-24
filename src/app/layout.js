import { Raleway, Geist_Mono } from "next/font/google";
import "./globals.css";
import Chatbot from "@/components/chatbot"; // [1] Import your chatbot component

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
      <body className={`${raleway.className} ${geistMono.variable} antialiased`}>
        {children}
        {/* [2] This stays floating over the Generate and Gallery pages */}
        <Chatbot /> 
      </body>
    </html>
  );
}