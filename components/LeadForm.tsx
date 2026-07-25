"use client";

import { useState } from "react";
import { Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function LeadForm() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("loading");
    setErrors({});
    setErrorMessage("");

    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const budget_range = formData.get("budget_range") as string;
    const message = formData.get("message") as string;

    // Client-side validation
    const newErrors: Record<string, string> = {};
    if (!name || name.trim().length === 0) newErrors.name = "Name is required";
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) newErrors.email = "Valid email is required";
    if (!budget_range) newErrors.budget_range = "Please select a budget range";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setStatus("error");
      setErrorMessage("Please fix the errors below.");
      return;
    }

    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, budget_range, message }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to submit");
      }

      setStatus("success");
    } catch (err: any) {
      setStatus("error");
      setErrorMessage(err.message || "An unexpected error occurred. Please try again.");
    }
  };

  if (status === "success") {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-muted p-8 rounded-xl border border-muted-foreground/20 text-center space-y-4"
      >
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.1 }}
          className="flex justify-center text-accent"
        >
          <CheckCircle2 size={56} />
        </motion.div>
        <h3 className="text-2xl font-display font-bold text-foreground">You're on the list!</h3>
        <p className="text-muted-foreground">
          We've received your request and will be in touch within 24 hours.
        </p>
      </motion.div>
    );
  }

  return (
    <div className="bg-muted p-8 rounded-xl border border-muted-foreground/20 w-full max-w-md mx-auto shadow-xl">
      <h3 className="text-2xl font-display font-bold mb-6 text-foreground">Start your project</h3>
      
      <AnimatePresence>
        {status === "error" && errorMessage && (
          <motion.div 
            initial={{ opacity: 0, height: 0, marginBottom: 0 }}
            animate={{ opacity: 1, height: "auto", marginBottom: 24 }}
            exit={{ opacity: 0, height: 0, marginBottom: 0 }}
            className="overflow-hidden"
          >
            <div className="p-4 bg-red-500/10 border border-red-500/50 rounded-lg flex items-start gap-3 text-red-500">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <p className="text-sm">{errorMessage}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium mb-1.5 text-muted-foreground">Name *</label>
          <input
            type="text"
            id="name"
            name="name"
            className={`w-full bg-background border ${errors.name ? 'border-red-500' : 'border-muted-foreground/30'} rounded-lg px-4 py-2.5 text-foreground focus:outline-none focus:ring-2 focus:ring-accent transition-colors`}
            placeholder="Jane Doe"
          />
          <AnimatePresence>
            {errors.name && (
              <motion.p initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="text-red-500 text-xs mt-1.5 font-medium">{errors.name}</motion.p>
            )}
          </AnimatePresence>
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium mb-1.5 text-muted-foreground">Email *</label>
          <input
            type="email"
            id="email"
            name="email"
            className={`w-full bg-background border ${errors.email ? 'border-red-500' : 'border-muted-foreground/30'} rounded-lg px-4 py-2.5 text-foreground focus:outline-none focus:ring-2 focus:ring-accent transition-colors`}
            placeholder="jane@example.com"
          />
          <AnimatePresence>
            {errors.email && (
              <motion.p initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="text-red-500 text-xs mt-1.5 font-medium">{errors.email}</motion.p>
            )}
          </AnimatePresence>
        </div>

        <div>
          <label htmlFor="budget_range" className="block text-sm font-medium mb-1.5 text-muted-foreground">Budget Range *</label>
          <select
            id="budget_range"
            name="budget_range"
            defaultValue=""
            className={`w-full bg-background border ${errors.budget_range ? 'border-red-500' : 'border-muted-foreground/30'} rounded-lg px-4 py-2.5 text-foreground focus:outline-none focus:ring-2 focus:ring-accent appearance-none transition-colors`}
          >
            <option value="" disabled>Select a budget</option>
            <option value="<$1k">{"<$1k"}</option>
            <option value="$1k-5k">$1k - $5k</option>
            <option value="$5k-20k">$5k - $20k</option>
            <option value="$20k+">$20k+</option>
          </select>
          <AnimatePresence>
            {errors.budget_range && (
              <motion.p initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="text-red-500 text-xs mt-1.5 font-medium">{errors.budget_range}</motion.p>
            )}
          </AnimatePresence>
        </div>

        <div>
          <label htmlFor="message" className="block text-sm font-medium mb-1.5 text-muted-foreground">Message (Optional)</label>
          <textarea
            id="message"
            name="message"
            rows={4}
            className="w-full bg-background border border-muted-foreground/30 rounded-lg px-4 py-2.5 text-foreground focus:outline-none focus:ring-2 focus:ring-accent transition-colors"
            placeholder="Tell us about your goals..."
          ></textarea>
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          disabled={status === "loading"}
          className="w-full bg-accent text-background font-bold py-3 px-4 rounded-lg hover:bg-accent-hover transition-colors flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed mt-4 shadow-lg shadow-accent/20"
        >
          {status === "loading" && <Loader2 className="w-5 h-5 animate-spin" />}
          {status === "loading" ? "Submitting..." : "Get Started"}
        </motion.button>
      </form>
    </div>
  );
}
