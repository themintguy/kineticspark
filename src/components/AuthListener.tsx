
"use client";

import { useEffect } from "react";
import { supabase } from "@/utils/supbase";
import { useAuthStore } from "@/stores/authStore";

interface AuthListenerProps {
  children: React.ReactNode;
}

export default function AuthListener({ children }: AuthListenerProps) {
  const setUser = useAuthStore((state) => state.setUser);
  const setLoadingUser = useAuthStore((state) => state.setLoadingUser);

  useEffect(() => {
    const getSession = async () => {
      setLoadingUser(true);
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setUser(session?.user || null);
      setLoadingUser(false);
    };

    getSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("Supabase Auth Event:", event, "Session:", session);
      setUser(session?.user || null);
      setLoadingUser(false);
    });

    return () => {
      subscription?.unsubscribe(); 
    };
  }, [setUser, setLoadingUser]);

  return <>{children}</>;
}
