"use client";
import { useEffect, useState } from "react"; // Added hooks
import { supabase } from "@/utils/supabase/client"; // Added supabase
import Bg from "@/components/bg";
import { Upload, Palette, Sparkles, FolderHeart, ArrowRight } from "lucide-react";
import Link from "next/link";

const steps = [
  {
    title: "Upload Your Space",
    desc: "Start with a photo of your existing room. High-quality lighting works best for the AI to understand your architecture.",
    icon: <Upload className="w-6 h-6 text-green-400" />,
    color: "from-blue-500/20 to-transparent",
  },
  {
    title: "Pick Your Aesthetic",
    desc: "From Industrial Lofts to Japandi Minimalist, choose the design language that fits your personality.",
    icon: <Palette className="w-6 h-6 text-orange-400" />,
    color: "from-purple-500/20 to-transparent",
  },
  {
    title: "AI Transformation",
    desc: "Our neural engine re-renders your furniture, lighting, and textures while keeping your room's structural integrity.",
    icon: <Sparkles className="w-6 h-6 text-indigo-400" />,
    color: "from-indigo-500/20 to-transparent",
  },
  {
    title: "Save & Export",
    desc: "Download your high-resolution renders or save them to your gallery to share with contractors or friends.",
    icon: <FolderHeart className="w-6 h-6 text-red-400" />,
    color: "from-pink-500/20 to-transparent",
  },
];

export default function HowItWorksPage() {
  const [user, setUser] = useState(null);

  // Check if user is logged in to determine the CTA link
  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    checkUser();
  }, []);

  return (
    <Bg>
      <div className="min-h-screen px-6 py-32 flex flex-col items-center">
        {/* Header Section */}
        <div className="max-w-3xl text-center mb-20">
          <h1 className="text-5xl md:text-6xl font-bold text-white tracking-tighter mb-6">
            Four Steps to <span className="bg-gradient-to-r from-blue-300 to-indigo-600 bg-clip-text text-transparent">Perfection</span>
          </h1>
          <p className="text-zinc-400 text-lg font-light leading-relaxed">
            RoomyAI combines architectural logic with creative vision to transform 
            your interior spaces instantly.
          </p>
        </div>

        {/* Steps Journey */}
        <div className="w-full max-w-5xl grid gap-8 md:grid-cols-2">
          {steps.map((step, index) => (
            <div
              key={step.title}
              className="group relative rounded-[2.5rem] border border-white/10 bg-black/40 p-8 backdrop-blur-3xl transition-all duration-500 hover:border-white/20 hover:bg-black/60 shadow-2xl overflow-hidden"
            >
              <div className={`absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-br ${step.color} blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-6">
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/10 group-hover:scale-110 transition-transform duration-500">
                    {step.icon}
                  </div>
                  <span className="text-5xl font-black text-white/5 italic">
                    0{index + 1}
                  </span>
                </div>
                <h2 className="text-2xl font-bold text-white mb-3 tracking-tight">
                  {step.title}
                </h2>
                <p className="text-zinc-400 text-sm leading-relaxed mb-4">
                  {step.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA Section */}
        <div className="mt-20 text-center">
          <Link 
            // DYNAMIC LINK: If no user, go to auth and tell it to return to generate
            href={user ? "/generate" : "/auth?next=/generate"} 
            className="group flex items-center gap-2 px-8 py-4 rounded-2xl bg-white text-black font-bold text-lg hover:bg-indigo-500 hover:text-white transition-all duration-300 shadow-[0_0_40px_-10px_rgba(255,255,255,0.3)]"
          >
            Start Your Roomy
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>

        </div>
      </div>
    </Bg>
  );
}