"use client";
import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import Bg from "@/components/bg";
import { Trash2, ImageOff, ExternalLink, ArrowRight, Loader2, Download } from "lucide-react";
import { useRouter } from "next/navigation";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function GalleryPage() {
  const [designs, setDesigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [downloadingId, setDownloadingId] = useState(null);
  const router = useRouter();

  useEffect(() => {
    fetchMyDesigns();
  }, []);

  async function fetchMyDesigns() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data, error } = await supabase
          .from('designs') 
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (data) setDesigns(data);
        if (error) console.error("Error fetching designs:", error.message);
      }
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  }

  // The Download Logic
  const handleDownload = async (imageUrl, id) => {
    setDownloadingId(id);
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `room-design-${id}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download failed:", error);
      alert("Failed to download image.");
    } finally {
      setDownloadingId(null);
    }
  };

  const handleStartGenerating = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session) router.push("/generate");
    else router.push("/auth"); 
  };

  async function deleteDesign(id) {
    const { error } = await supabase.from('designs').delete().eq('id', id);
    if (!error) setDesigns(designs.filter(d => d.id !== id));
  }

  return (
    <Bg>
      <div className="min-h-screen pt-32 pb-20 px-6 max-w-7xl mx-auto text-white">
        <header className="mb-12">
          <h1 className="text-5xl font-extrabold mb-3 tracking-tight bg-gradient-to-r from-white to-zinc-500 bg-clip-text text-transparent">
            My Gallery
          </h1>
          <p className="text-zinc-400 text-lg">Your collection of AI-imagined spaces.</p>
        </header>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-32">
            <Loader2 className="text-blue-500 animate-spin mb-4" size={40} />
            <p className="text-zinc-500 uppercase tracking-[0.3em] text-[10px] font-bold">Retrieving Assets</p>
          </div>
        ) : designs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {designs.map((design) => (
              <div key={design.id} className="group relative bg-zinc-900/40 border border-white/5 rounded-[2.5rem] overflow-hidden backdrop-blur-md transition-all hover:border-blue-500/30">
                <img 
                  src={design.image_url} 
                  alt={design.prompt} 
                  className="w-full aspect-[4/5] object-cover transition-transform duration-1000 group-hover:scale-110"
                />
                
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 p-8 flex flex-col justify-end">
                  <div className="translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                    <p className="text-white text-sm font-light leading-relaxed line-clamp-3 mb-6 italic">
                      "{design.prompt}"
                    </p>
                    
                    <div className="flex items-center justify-between pt-4 border-t border-white/10">
                      <span className="text-[10px] font-black text-blue-400 uppercase tracking-[0.2em]">
                        {design.style || 'Custom'}
                      </span>
                      <div className="flex gap-2">
                        {/* Download Button */}
                        <button 
                          onClick={() => handleDownload(design.image_url, design.id)}
                          disabled={downloadingId === design.id}
                          className="p-2.5 bg-white/5 rounded-full hover:bg-blue-600 transition-all disabled:opacity-50"
                          title="Download Image"
                        >
                          {downloadingId === design.id ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />}
                        </button>
                        
                        <a href={design.image_url} target="_blank" className="p-2.5 bg-white/5 rounded-full hover:bg-white/20 transition-colors">
                          <ExternalLink size={16} />
                        </a>
                        
                        <button 
                          onClick={() => deleteDesign(design.id)}
                          className="p-2.5 bg-red-500/10 text-red-400 rounded-full hover:bg-red-500 hover:text-white transition-all"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-32 bg-white/[0.02] rounded-[4rem] border border-dashed border-white/10 flex flex-col items-center">
            <ImageOff className="text-zinc-700 mb-6" size={56} />
            <p className="text-zinc-500 mb-10 max-w-sm mx-auto text-sm">Your gallery is currently empty.</p>
            <button 
              onClick={handleStartGenerating}
              className="flex items-center gap-3 px-10 py-5 bg-white text-black rounded-2xl font-black hover:scale-105 transition-all"
            >
              Start Generating <ArrowRight size={20} />
            </button>
          </div>
        )}
      </div>
    </Bg>
  );
}