"use client";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Bg from "@/components/bg";
import { Sparkles, RefreshCw, Wand2, AlertCircle, CheckCircle2 } from "lucide-react";
import { createClient } from "@supabase/supabase-js";

// Initialize Supabase Client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

function GenerateContent() {
  const searchParams = useSearchParams();
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [resultImage, setResultImage] = useState(null);
  const [error, setError] = useState(""); 
  const [saved, setSaved] = useState(false);

  const stylePresets = {
    minimalist: "A serene minimalist living room with clean lines, soft oak wood, and oversized windows with natural lighting.",
    industrial: "A high-end industrial loft with exposed red brick, matte black metal fixtures, and polished concrete floors.",
    bohemian: "A cozy bohemian bedroom with layered Moroccan rugs, rattan furniture, and warm ambient string lighting."
  };

  useEffect(() => {
    const selectedStyle = searchParams.get("style");
    if (selectedStyle && stylePresets[selectedStyle]) {
      setPrompt(stylePresets[selectedStyle]);
    }
  }, [searchParams]);

  const handleSaveDesign = async (imageUrl, userPrompt) => {
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) {
        console.error("Auth error:", userError);
        return;
      }

      const selectedStyle = searchParams.get("style") || "Modern";

      const { error: saveError } = await supabase
        .from('designs')
        .insert([
          { 
            user_id: user.id,
            image_url: imageUrl,
            prompt: userPrompt,
            style: selectedStyle
          }
        ]);

      if (saveError) {
        console.error("Database Save Error:", saveError.message);
      } else {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      }
    } catch (err) {
      console.error("Critical Save Error:", err);
    }
  };

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setLoading(true);
    setError("");
    setResultImage(null);
    setSaved(false);

    try {
      // 1. VALIDATION: Check with Chat API
      let isApproved = true;
      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userMessage: prompt }),
        });
        const data = await res.json();
        if (data.isRoom === false) {
          isApproved = false;
        }
      } catch (validationErr) {
        console.warn("Validation skipped - API unreachable");
      }

      if (!isApproved) {
        setError("Please provide a prompt related to room design or interior decor.");
        setLoading(false);
        return;
      }

      // 2. GENERATION: Pollinations AI
      const seed = Math.floor(Math.random() * 999999);
      // Clean prompt of special characters that break URLs
      const cleanPrompt = prompt.trim().replace(/[^\w\s]/gi, '');
      const encodedPrompt = encodeURIComponent(
        `${cleanPrompt}, high-end professional interior design, architectural photography, 8k, realistic, cinematic lighting`
      );
      
      const aiUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?seed=${seed}&width=1024&height=1024&nologo=true`;

      // Use Image object to verify the URL is fully loaded/generated
      const img = new Image();
      img.src = aiUrl;
      img.onload = async () => {
        setResultImage(aiUrl);
        setLoading(false);
        // 3. AUTO-SAVE to Gallery
        await handleSaveDesign(aiUrl, prompt);
      };
      img.onerror = () => {
        setError("The image generation service is currently busy. Try again in a moment.");
        setLoading(false);
      };

    } catch (err) {
      console.error("Generation failed:", err);
      setError("An unexpected error occurred. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center pt-28 pb-12 px-6 text-white">
      <div className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Panel: Prompt Input */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-8 rounded-[2rem] border border-white/10 bg-black/40 backdrop-blur-3xl shadow-2xl">
            <h2 className="text-2xl font-bold flex items-center gap-2 mb-6">
              <Wand2 className="text-blue-500" size={24} /> Design Studio
            </h2>

            <div className="space-y-4">
              <label className="text-xs font-bold uppercase tracking-widest text-zinc-500 ml-1">
                Describe your vision
              </label>
              <textarea
                value={prompt}
                onChange={(e) => {
                  setPrompt(e.target.value);
                  if (error) setError("");
                }}
                placeholder="e.g. A luxury master bedroom with marble walls..."
                className={`w-full h-48 rounded-2xl border ${error ? 'border-red-500/50 bg-red-500/5' : 'border-white/10 bg-white/5'} p-4 text-white placeholder:text-zinc-600 outline-none focus:border-blue-500 transition-all resize-none`}
              />

              {error && (
                <div className="flex items-center gap-2 text-red-400 bg-red-400/10 p-3 rounded-xl border border-red-400/20">
                  <AlertCircle size={16} />
                  <span className="text-xs font-medium">{error}</span>
                </div>
              )}
              
              <button
                onClick={handleGenerate}
                disabled={loading || !prompt}
                className="w-full py-5 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-700 font-bold hover:brightness-110 active:scale-[0.98] transition-all disabled:opacity-30 flex items-center justify-center gap-2"
              >
                {loading ? <RefreshCw className="animate-spin" size={20} /> : <Sparkles size={20} />}
                {loading ? "Designing..." : "Generate Room Design"}
              </button>
            </div>
          </div>

          {saved && (
            <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/20 flex items-center gap-3 text-green-400 animate-in fade-in slide-in-from-bottom-2">
              <CheckCircle2 size={18} />
              <span className="text-sm font-medium">Design saved to your gallery!</span>
            </div>
          )}
        </div>

        {/* Right Panel: Output */}
        <div className="lg:col-span-7">
          <div className="relative aspect-square w-full rounded-[2.5rem] border border-white/10 bg-zinc-900/40 backdrop-blur-3xl overflow-hidden shadow-2xl flex items-center justify-center">
            {resultImage ? (
              <img src={resultImage} className="w-full h-full object-cover animate-in fade-in duration-1000" alt="AI Generated Room" />
            ) : (
              <div className="text-center px-10">
                <p className="text-zinc-600 italic text-sm">Your architectural masterpiece will appear here.</p>
              </div>
            )}

            {loading && (
              <div className="absolute inset-0 bg-black/70 backdrop-blur-md flex flex-col items-center justify-center z-10">
                <div className="w-16 h-16 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin mb-4" />
                <p className="text-white tracking-[0.4em] text-[10px] uppercase font-bold animate-pulse">Designing Space...</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function GeneratePage() {
  return (
    <Bg>
      <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-black text-white">Loading Studio...</div>}>
        <GenerateContent />
      </Suspense>
    </Bg>
  );
}