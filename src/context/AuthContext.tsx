import {
    createContext,
    useContext,
    useEffect,
    useState,
  } from "react";
  import type { User } from "@supabase/supabase-js";
  import { supabase } from "../lib/supabase";
  
  type UserRole = "doctor" | "admin";

  type AuthContextType = {
    user: User | null;
    role: UserRole | null;
    loading: boolean;
  };
  
  const AuthContext = createContext<AuthContextType | undefined>(
    undefined
  );
  
  export function AuthProvider({
    children,
  }: {
    children: React.ReactNode;
  }) {
    const [user, setUser] = useState<User | null>(null);
    const [role, setRole] = useState<UserRole | null>(null);
    const [loading, setLoading] = useState(true);

    async function fetchUserRole(userId: string) {
        const { data, error } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", userId)
          .maybeSingle();
      
        if (error) {
          console.error("Failed to fetch user role:", error.message);
          setRole(null);
          return;
        }
      
        if (data?.role === "doctor" || data?.role === "admin") {
          setRole(data.role);
        } else {
          setRole(null);
        }
      }
  
      useEffect(() => {
        let active = true;
      
        async function loadSession() {
          const { data, error } = await supabase.auth.getSession();
      
          if (!active) return;
      
          if (error || !data.session?.user) {
            setUser(null);
            setRole(null);
            setLoading(false);
            return;
          }
      
          const currentUser = data.session.user;
          setUser(currentUser);
      
          const { data: profile, error: profileError } = await supabase
            .from("profiles")
            .select("role")
            .eq("id", currentUser.id)
            .maybeSingle();
      
          if (!active) return;
      
          if (
            !profileError &&
            (profile?.role === "doctor" || profile?.role === "admin")
          ) {
            setRole(profile.role);
          } else {
            setRole(null);
          }
      
          setLoading(false);
        }
      
        void loadSession();
      
        const {
          data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
          setUser(session?.user ?? null);
      
          if (!session?.user) {
            setRole(null);
            setLoading(false);
          } else {
            setLoading(true);
      
            // Defer the database request until after the auth callback.
            setTimeout(() => {
              if (active) {
                void fetchUserRole(session.user.id).finally(() => {
                  if (active) setLoading(false);
                });
              }
            }, 0);
          }
        });
      
        return () => {
          active = false;
          subscription.unsubscribe();
        };
      }, []);
  
    return (
      <AuthContext.Provider value={{ user, role, loading }}>
        {children}
      </AuthContext.Provider>
    );
  }
  
  export function useAuth() {
    const context = useContext(AuthContext);
  
    if (!context) {
      throw new Error("useAuth must be used inside AuthProvider");
    }
  
    return context;
  }