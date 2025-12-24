"use client";

import React, { useState, useEffect } from "react";
import { Menu, X, Layout, Sparkles, Palette, ChevronDown, UserCircle, LogOut } from "lucide-react";
import Link from "next/link";
import { supabase } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [stylesOpen, setStylesOpen] = useState(false);
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  };

  const styleItems = [
    { title: "Minimalist", icon: <Layout className="w-4 h-4" /> },
    { title: "Industrial", icon: <Sparkles className="w-4 h-4" /> },
    { title: "Bohemian", icon: <Palette className="w-4 h-4" /> },
  ];

  return (
    <>
      <div
        className={`fixed inset-0 z-40 md:hidden transition-all duration-300
          ${isOpen ? "opacity-100 backdrop-blur-[30px] bg-black/60" : "opacity-0 pointer-events-none"}`}
        onClick={() => { setIsOpen(false); setStylesOpen(false); }}
      />

      <header className="fixed top-0 left-0 right-0 z-50 flex justify-center p-4 md:p-6">
        <nav className="relative flex items-center justify-between w-full max-w-6xl px-4 md:px-6 py-3 rounded-full border border-white/10 bg-black/40 backdrop-blur-xl shadow-2xl">

          {/* Logo */}
          <Link href="/" className="text-white font-bold text-lg tracking-tight">
            RoomyAI
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            <Link href="/styles" className="text-sm text-white/70 hover:text-white transition">Styles</Link>
            <Link href="/gallery" className="text-sm text-white/70 hover:text-white transition">Gallery</Link>
            <Link href="/how-it-works" className="text-sm text-white/70 hover:text-white transition">How it Works</Link>
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-2">
                {/* ADDED PROFILE LINK HERE */}
                <Link 
                  href="/profile" 
                  className="flex items-center gap-2 text-sm text-white/70 hover:text-white px-4 py-2 transition"
                >
                  <UserCircle size={16} /> Profile
                </Link>
                <button 
                  onClick={handleLogout}
                  className="flex items-center gap-2 text-sm text-white/70 hover:text-red-400 px-4 py-2 transition"
                >
                  <LogOut size={16} /> Log Out
                </button>
              </div>
            ) : (
              <Link href="/auth" className="text-sm text-white/70 hover:text-white px-4 py-2 transition">
                Sign In
              </Link>
            )}
            
            <Link
              href={user ? "/generate" : "/auth?next=/generate"}
              className="px-5 py-2 rounded-xl bg-white text-black font-semibold hover:bg-zinc-200 transition"
            >
              Generate Room
            </Link>
          </div>

          {/* Mobile Toggle */}
          <button className="md:hidden text-white p-1" onClick={() => { setIsOpen(!isOpen); setStylesOpen(false); }}>
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          {/* Mobile Menu */}
          <div className={`absolute top-full left-0 right-0 mt-3 md:hidden transition-all duration-300 ${isOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2 pointer-events-none"}`}>
            <div className="p-4 rounded-2xl bg-black/85 border border-white/10 shadow-2xl">
              <button onClick={() => setStylesOpen(!stylesOpen)} className="flex items-center justify-between w-full p-3 text-white rounded-xl hover:bg-white/10">
                <span className="font-medium">Styles</span>
                <ChevronDown className={`w-5 h-5 transition-transform ${stylesOpen ? "rotate-180" : ""}`} />
              </button>

              <div className={`overflow-hidden transition-all duration-300 ${stylesOpen ? "max-h-40 opacity-100" : "max-h-0 opacity-0"}`}>
                <div className="pl-2 pt-1 flex flex-col gap-1">
                  {styleItems.map((item) => (
                    <Link key={item.title} href={`/styles/${item.title.toLowerCase()}`} className="p-3 text-white/80 hover:bg-white/10 rounded-xl flex items-center gap-3" onClick={() => setIsOpen(false)}>
                      {item.icon} {item.title}
                    </Link>
                  ))}
                </div>
              </div>

              <div className="h-[1px] bg-white/10 my-3" />

              <Link href="/gallery" className="block p-3 text-white rounded-xl hover:bg-white/10" onClick={() => setIsOpen(false)}>Gallery</Link>

              {user ? (
                <>
                  {/* ADDED PROFILE LINK TO MOBILE VIEW */}
                  <Link 
                    href="/profile" 
                    className="flex items-center gap-2 w-full p-3 text-white rounded-xl hover:bg-white/10" 
                    onClick={() => setIsOpen(false)}
                  >
                    <UserCircle className="w-5 h-5" /> Profile
                  </Link>
                  <button onClick={handleLogout} className="flex items-center gap-2 w-full p-3 text-red-400 rounded-xl hover:bg-white/10">
                    <LogOut className="w-5 h-5" /> Log Out
                  </button>
                </>
              ) : (
                <Link href="/auth" className="flex items-center gap-2 p-3 text-white rounded-xl hover:bg-white/10" onClick={() => setIsOpen(false)}>
                  <UserCircle className="w-5 h-5" /> Sign In
                </Link>
              )}

              <div className="h-[1px] bg-white/10 my-3" />

              <Link href={user ? "/generate" : "/auth?next=/generate"} className="block p-4 mt-2 text-center bg-white text-black rounded-xl font-bold" onClick={() => setIsOpen(false)}>
                Generate Room
              </Link>
            </div>
          </div>
        </nav>
      </header>
    </>
  );
}