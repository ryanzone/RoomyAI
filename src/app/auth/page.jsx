"use client";
import { useState, useEffect, Suspense } from 'react'; // Added Suspense
import { signUp, signIn } from '@/utils/supabase/auth';
import { useRouter, useSearchParams } from 'next/navigation'; // Added useSearchParams
import Link from 'next/link';

function AuthContent() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  
  const router = useRouter();
  const searchParams = useSearchParams();

  const toggleMode = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setIsSignUp(!isSignUp);
      setIsAnimating(false);
    }, 200);
  };

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    const { data, error } = isSignUp 
      ? await signUp(email, password) 
      : await signIn(email, password);

    if (error) {
      alert(error.message);
    } else {
      // THE PRO FIX: Check if there is a 'next' destination in the URL
      const nextDestination = searchParams.get('next') || '/'; 
      router.push(nextDestination); 
    }
    setLoading(false);
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center bg-black overflow-hidden px-6">
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-600/20 blur-[120px] animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-zinc-800/30 blur-[120px]" />

      <div className="relative w-full max-w-md z-10">
        <Link href="/" className="inline-block mb-8 text-zinc-500 hover:text-white transition-colors text-sm">
          ← Back to RoomyAI
        </Link>

        <div className={`space-y-8 rounded-[2rem] border border-white/10 bg-zinc-900/40 p-8 md:p-10 backdrop-blur-2xl shadow-2xl transition-all duration-300 transform ${isAnimating ? "opacity-0 -translate-y-2 scale-[0.98]" : "opacity-100 translate-y-0 scale-100"}`}>
          
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white tracking-tight">
              {isSignUp ? 'Create Account' : 'Welcome Back'}
            </h2>
            <p className="mt-3 text-zinc-400 text-sm">
              {isSignUp ? 'Start designing your dream room today.' : 'Your saved designs are waiting.'}
            </p>
          </div>

          <form onSubmit={handleAuth} className="mt-8 space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-medium text-zinc-500 ml-1 uppercase tracking-wider">Email</label>
              <input
                type="email"
                placeholder="name@example.com"
                className="w-full rounded-2xl border border-white/5 bg-black/40 p-4 text-white placeholder:text-zinc-600 outline-none focus:border-white/20 focus:bg-black/60 transition-all"
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-xs font-medium text-zinc-500 ml-1 uppercase tracking-wider">Password</label>
              <input
                type="password"
                placeholder="••••••••"
                className="w-full rounded-2xl border border-white/5 bg-black/40 p-4 text-white placeholder:text-zinc-600 outline-none focus:border-white/20 focus:bg-black/60 transition-all"
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-4 rounded-2xl bg-white py-4 font-bold text-black transition-all hover:bg-zinc-200 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(255,255,255,0.1)]"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                  Processing...
                </span>
              ) : isSignUp ? 'Create Account' : 'Sign In'}
            </button>
          </form>

          <div className="pt-4 text-center">
            <button 
              onClick={toggleMode}
              className="text-sm text-zinc-500 hover:text-white transition-colors"
            >
              {isSignUp ? (
                <span>Already have an account? <span className="text-white font-medium">Sign In</span></span>
              ) : (
                <span>Don't have an account? <span className="text-white font-medium">Sign Up</span></span>
              )}
            </button>
          </div>
        </div>
        
        <p className="mt-8 text-center text-[10px] text-zinc-600 uppercase tracking-[0.2em]">
          Secured by Supabase
        </p>
      </div>
    </div>
  );
}

// Next.js requires Suspense for components using useSearchParams
export default function AuthPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black" />}>
      <AuthContent />
    </Suspense>
  );
}