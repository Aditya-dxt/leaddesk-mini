"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Loader2, AlertCircle, Lock } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw new Error(error.message);
      }

      router.push("/admin");
      router.refresh();
    } catch (err: any) {
      setError(err.message || "Failed to sign in");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-6">
      <div className="w-full max-w-md bg-muted p-8 rounded-xl border border-muted-foreground/20">
        <div className="flex justify-center mb-6">
          <div className="w-12 h-12 rounded bg-accent flex items-center justify-center text-background font-bold text-xl">
            LD
          </div>
        </div>
        
        <h1 className="text-2xl font-display font-bold text-center mb-2">Admin Login</h1>
        <p className="text-muted-foreground text-center text-sm mb-8">
          Sign in to manage your leads
        </p>

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-lg flex items-start gap-3 text-red-500">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <p className="text-sm">{error}</p>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1.5 text-muted-foreground">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-background border border-muted-foreground/30 rounded-lg px-4 py-2.5 text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
              placeholder="admin@agency.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5 text-muted-foreground">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-background border border-muted-foreground/30 rounded-lg px-4 py-2.5 text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-foreground text-background font-bold py-3 px-4 rounded-lg hover:bg-muted-foreground transition-colors flex items-center justify-center gap-2 mt-4 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Lock className="w-5 h-5" />}
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}
