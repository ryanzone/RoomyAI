"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/utils/supabase/client";
import { useRouter } from "next/navigation"; // Added router
import Bg from "@/components/bg";

export default function ProfilePage() {
  const [profile, setProfile] = useState(null);
  const [displayName, setDisplayName] = useState("");
  const [loading, setLoading] = useState(true);
  const router = useRouter(); // Initialize router

  useEffect(() => {
    getProfile();
  }, []);

  async function getProfile() {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      let { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      
      if (data) {
        setProfile(data);
        setDisplayName(data.display_name || "");
      }
    } else {
      // If someone tries to access /profile while logged out
      router.push("/auth");
    }
    setLoading(false);
  }

  async function updateProfile() {
    const { data: { user } } = await supabase.auth.getUser();
    const { error } = await supabase
      .from('profiles')
      .update({ display_name: displayName })
      .eq('id', user.id);

    if (error) alert(error.message);
    else alert("Profile updated!");
  }

  // --- LOGOUT FUNCTION ---
  async function handleLogout() {
    const { error } = await supabase.auth.signOut();
    if (error) alert(error.message);
    else router.push("/"); // Send them back to home after logout
  }

  if (loading) return <Bg><div className="text-white p-20 flex justify-center">Loading...</div></Bg>;

  return (
    <Bg>
      <div className="min-h-screen flex items-center justify-center px-6">
        <div className="w-full max-w-md bg-zinc-900/50 border border-white/10 p-8 rounded-[2rem] backdrop-blur-xl shadow-2xl">
          <h1 className="text-2xl font-bold text-white mb-6">Your Profile</h1>
          
          <div className="space-y-4">
            <div>
              <label className="text-xs text-zinc-500 uppercase tracking-widest ml-1">Email Address</label>
              <p className="text-white mt-1 p-3 bg-white/5 rounded-xl border border-white/5">{profile?.email}</p>
            </div>

            <div>
              <label className="text-xs text-zinc-500 uppercase tracking-widest ml-1">Display Name</label>
              <input 
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl p-3 mt-1 text-white focus:outline-none focus:border-blue-500 transition-all"
                placeholder="Enter your name"
              />
            </div>

            <button 
              onClick={updateProfile}
              className="w-full bg-white text-black font-bold py-4 rounded-xl hover:bg-zinc-200 active:scale-[0.98] transition-all shadow-lg"
            >
              Save Changes
            </button>

            {/* --- LOGOUT BUTTON --- */}
            <div className="pt-4 border-t border-white/5">
              <button 
                onClick={handleLogout}
                className="w-full text-zinc-500 hover:text-red-400 text-sm py-2 transition-colors"
              >
                Sign out of account
              </button>
            </div>
          </div>
        </div>
      </div>
    </Bg>
  );
}