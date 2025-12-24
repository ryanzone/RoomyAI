"use client";
import { useRouter } from "next/navigation";
import { supabase } from "@/utils/supabase/client";
import Bg from "@/components/bg";
import { ArrowRight, Layout, Building2, Palmtree } from "lucide-react";

const styles = [
  { 
    title: "Minimalist", 
    slug: "minimalist",
    desc: "Clean lines and neutral tones for a calm, clutter-free soul.", 
    icon: <Layout className="w-6 h-6 text-blue-300" />,
    gradient: "from-blue-500/20"
  },
  { 
    title: "Industrial", 
    slug: "industrial",
    desc: "Raw concrete, exposed brick, and dark metallic accents.", 
    icon: <Building2 className="w-6 h-6 text-zinc-300" />,
    gradient: "from-zinc-500/20"
  },
  { 
    title: "Bohemian", 
    slug: "bohemian",
    desc: "Vibrant textures and artistic layers for a free-spirited home.", 
    icon: <Palmtree className="w-6 h-6 text-green-300" />,
    gradient: "from-purple-500/20"
  },
];

export default function StylesPage() {
  const router = useRouter();

  const handleStyleClick = async (slug) => {
    // 1. Check if the user is authenticated
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      // 2. REDIRECT TO /auth (Because your folder is named auth)
      // We pass the 'next' parameter so we can return here after login
      router.push(`/auth?next=/generate?style=${slug}`);
    } else {
      // 3. User is logged in, go straight to generate
      router.push(`/generate?style=${slug}`);
    }
  };

  return (
    <Bg>
      <div className="min-h-screen px-6 py-32 text-white max-w-6xl mx-auto flex flex-col items-center">
        <h1 className="text-5xl font-bold tracking-tighter mb-4">Design Styles</h1>
        <p className="text-zinc-500 mb-16 text-center max-w-lg">Select a foundation. We'll handle the architectural details.</p>

        <div className="grid gap-8 md:grid-cols-3 w-full">
          {styles.map((style) => (
            <button 
              key={style.slug}
              onClick={() => handleStyleClick(style.slug)}
              className="group text-left relative rounded-[2.5rem] border border-white/10 bg-black/40 p-10 backdrop-blur-3xl transition-all duration-500 hover:scale-[1.02] hover:border-white/20 overflow-hidden"
            >
              <div className={`absolute -bottom-10 -left-10 w-32 h-32 bg-gradient-to-tr ${style.gradient} blur-3xl opacity-0 group-hover:opacity-100 transition-opacity`} />
              
              <div className="relative z-10">
                <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center mb-8 border border-white/10">
                  {style.icon}
                </div>
                <h2 className="text-2xl font-bold mb-3">{style.title}</h2>
                <p className="text-zinc-400 text-sm leading-relaxed mb-8">{style.desc}</p>
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-blue-400">
                  Use Style <ArrowRight size={14} />
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </Bg>
  );
}