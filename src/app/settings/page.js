"use client"
import { useState } from 'react';
import { updateProfile } from '@/utils/supabase/auth';

export default function Settings() {
  const [name, setName] = useState('');
  const [msg, setMsg] = useState('');

  const handleUpdate = async () => {
    const { error } = await updateProfile(name);
    if (error) setMsg("Error: " + error.message);
    else setMsg("Username updated successfully!");
  };

  return (
    <div className="p-10 bg-zinc-900 text-white rounded-2xl border border-white/10 max-w-md">
      <h2 className="text-xl mb-4">Update Profile</h2>
      <input 
        type="text" 
        placeholder="Enter username" 
        className="bg-black border border-white/20 p-2 w-full rounded mb-4"
        onChange={(e) => setName(e.target.value)}
      />
      <button onClick={handleUpdate} className="bg-white text-black px-4 py-2 rounded font-bold w-full">
        Save Name
      </button>
      {msg && <p className="mt-4 text-green-400">{msg}</p>}
    </div>
  );
}