"use client";

import { useEffect, useState } from "react";
import { Search, Inbox, LogOut, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

type Lead = {
  id: string;
  name: string;
  email: string;
  budget_range: string;
  message: string | null;
  status: "New" | "Contacted" | "Closed";
  created_at: string;
};

export default function AdminDashboard() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  const fetchLeads = async () => {
    try {
      const response = await fetch("/api/leads");
      if (response.status === 401) {
        window.location.href = "/admin/login";
        return;
      }
      if (!response.ok) {
        throw new Error("Failed to fetch leads");
      }
      const { data } = await response.json();
      setLeads(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      // Optimistic update
      setLeads(leads.map(lead => lead.id === id ? { ...lead, status: newStatus as any } : lead));
      
      const response = await fetch(`/api/leads/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus })
      });
      
      if (!response.ok) {
        throw new Error("Failed to update");
      }
    } catch (err) {
      console.error(err);
      // Revert on error
      fetchLeads();
    }
  };

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  };

  const filteredLeads = leads.filter(lead => 
    lead.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    lead.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusBadgeClass = (status: string) => {
    switch(status) {
      case "New": return "bg-accent/20 text-accent border-accent/30";
      case "Contacted": return "bg-yellow-500/20 text-yellow-500 border-yellow-500/30";
      case "Closed": return "bg-muted-foreground/20 text-muted-foreground border-muted-foreground/30";
      default: return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="border-b border-muted">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded bg-accent flex items-center justify-center text-background font-bold">
              LD
            </div>
            <span className="font-display font-bold text-lg tracking-tight">LeadDesk Mini</span>
          </div>
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <h1 className="text-3xl font-display font-bold">Leads Overview</h1>
          
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-muted border border-muted-foreground/20 rounded-lg focus:outline-none focus:border-accent text-sm transition-colors"
            />
          </div>
        </div>

        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div 
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-20 text-muted-foreground"
            >
              <Loader2 className="w-8 h-8 animate-spin mb-4" />
              <p>Loading leads...</p>
            </motion.div>
          ) : error ? (
            <motion.div 
              key="error"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-20 text-red-500"
            >
              <p>{error}</p>
            </motion.div>
          ) : filteredLeads.length === 0 ? (
            <motion.div 
              key="empty"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="text-center py-24 bg-muted/30 rounded-xl border border-muted-foreground/10 border-dashed"
            >
              <Inbox className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-bold mb-1">No leads found</h3>
              <p className="text-muted-foreground text-sm max-w-sm mx-auto">
                {searchQuery ? "No leads matched your search query. Try a different term." : "Your pipeline is currently empty. Wait for new leads to roll in!"}
              </p>
            </motion.div>
          ) : (
            <motion.div 
              key="table"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="overflow-x-auto rounded-xl border border-muted-foreground/20 bg-muted/30"
            >
              <table className="w-full text-left text-sm">
                <thead className="bg-muted text-muted-foreground border-b border-muted-foreground/20">
                  <tr>
                    <th className="px-6 py-4 font-medium">Name</th>
                    <th className="px-6 py-4 font-medium">Email</th>
                    <th className="px-6 py-4 font-medium">Budget</th>
                    <th className="px-6 py-4 font-medium">Date</th>
                    <th className="px-6 py-4 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-muted-foreground/10">
                  <AnimatePresence>
                    {filteredLeads.map((lead, index) => (
                      <motion.tr 
                        key={lead.id} 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2, delay: index * 0.05 }}
                        className="hover:bg-muted/50 transition-colors"
                      >
                        <td className="px-6 py-4 font-medium text-foreground">{lead.name}</td>
                        <td className="px-6 py-4 text-muted-foreground">{lead.email}</td>
                        <td className="px-6 py-4 text-muted-foreground">{lead.budget_range}</td>
                        <td className="px-6 py-4 text-muted-foreground">
                          {new Date(lead.created_at).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4">
                          <select
                            value={lead.status}
                            onChange={(e) => handleStatusChange(lead.id, e.target.value)}
                            className={`text-xs font-medium px-2.5 py-1 rounded-full border appearance-none cursor-pointer focus:outline-none transition-colors duration-300 ${getStatusBadgeClass(lead.status)}`}
                          >
                            <option value="New" className="bg-background text-foreground">New</option>
                            <option value="Contacted" className="bg-background text-foreground">Contacted</option>
                            <option value="Closed" className="bg-background text-foreground">Closed</option>
                          </select>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
