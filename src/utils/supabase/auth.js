// Change this line to import the 'supabase' instance directly
import { supabase } from './client';

export const signUp = async (email, password) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });
  return { data, error };
};

export const signIn = async (email, password) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  return { data, error };
};

export const signOut = async () => {
  await supabase.auth.signOut();
};

export const updateProfile = async (username) => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "No user logged in" };

  const { error } = await supabase
    .from('profiles')
    .update({ 
      username: username,
      updated_at: new Date() 
    })
    .eq('id', user.id);

  return { error };
};