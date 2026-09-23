import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users, Car, Wrench, DollarSign, Search, LogOut, LayoutDashboard,
  CalendarCheck, TrendingUp, Settings, Trash2,
  CheckCircle, Clock, Play, XCircle, Save, Plus, Edit2, X, Gift,
  FileText, Send, IndianRupee, MessageCircle, Package,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import ThemeToggle from "@/components/ThemeToggle";
import { cn } from "@/lib/utils";
import logo from "@/assets/mr-red-logo-transparent.png";

// ─── Types ──────────────────────────────────────────────
interface AdminStats {
  totalUsers: number;
  totalBookings: number;
  totalVehicles: number;
  totalServices: number;
  revenue: number;
}

interface Booking {
  id: string;
  user_id: string;
  service_type: string;
  vehicle_type: string;
  booking_date: string;
  booking_time: string;
  pickup_location: string | null;
  estimated_price: number | null;
  status: string;
  assigned_agent: string | null;
  created_at: string;
}

interface Profile {
  id: string;
  user_id: string;
  name: string | null;
  email: string | null;
  mobile_number: string | null;
  profile_photo: string | null;
  address: string | null;
  created_at: string;
}

interface ServiceItem {
  id: string;
  name: string;
  category: string;
  price_car: number;
  price_bike: number;
  description: string | null;
  is_active: boolean;
  sort_order: number;
}

interface SiteSetting {
  id: string;
  setting_key: string;
  setting_value: string;
  setting_label: string;
  setting_group: string;
}

// ─── Tab definitions ────────────────────────────────────
const TABS = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "bookings", label: "Bookings", icon: CalendarCheck },
  { id: "invoices", label: "Invoices", icon: FileText },
  { id: "users", label: "Users", icon: Users },
  { id: "services", label: "Services", icon: Wrench },
  { id: "analytics", label: "Analytics", icon: TrendingUp },
  { id: "settings", label: "Settings", icon: Settings },
] as const;

type TabId = typeof TABS[number]["id"];

// ─── Status flow ────────────────────────────────────────
const STATUS_FLOW = ["pending", "confirmed", "in_progress", "completed"] as const;
const statusConfig: Record<string, { label: string; class: string; icon: any }> = {
  pending: { label: "Pending", class: "status-pending", icon: Clock },
  confirmed: { label: "Confirmed", class: "status-confirmed", icon: CheckCircle },
  in_progress: { label: "In Progress", class: "status-in_progress", icon: Play },
  completed: { label: "Completed", class: "status-completed", icon: CheckCircle },
  cancelled: { label: "Cancelled", class: "status-cancelled", icon: XCircle },
};

// ─── Overview Tab ───────────────────────────────────────
const OverviewTab = ({ stats }: { stats: AdminStats }) => {
  const metrics = [
    { label: "Total Users", icon: Users, value: stats.totalUsers, color: "text-primary" },
    { label: "Total Bookings", icon: CalendarCheck, value: stats.totalBookings, color: "text-accent" },
    { label: "Vehicles", icon: Car, value: stats.totalVehicles, color: "text-blue-500" },
    { label: "Services Done", icon: Wrench, value: stats.totalServices, color: "text-emerald-500" },
    { label: "Revenue", icon: DollarSign, value: `₹${stats.revenue.toLocaleString()}`, color: "text-amber-500" },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
      {metrics.map((m, i) => (
        <motion.div key={m.label} className="glass-card p-5 rounded-xl" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
          <m.icon className={`w-5 h-5 ${m.color} mb-2`} />
          <p className="font-display text-2xl font-bold text-foreground">{m.value}</p>
          <p className="text-xs text-muted-foreground mt-1">{m.label}</p>
        </motion.div>
      ))}
    </div>
  );
};

// ─── Bookings Tab ───────────────────────────────────────
const BookingsTab = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  const fetchBookings = async () => {
    const { data } = await supabase.from("bookings").select("*").order("created_at", { ascending: false });
    setBookings((data as Booking[]) || []);
    setLoading(false);
  };

  useEffect(() => { fetchBookings(); }, []);

  useEffect(() => {
    const channel = supabase
      .channel("admin-bookings")
      .on("postgres_changes", { event: "*", schema: "public", table: "bookings" }, () => fetchBookings())
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, []);

  const updateStatus = async (id: string, newStatus: string) => {
    const { error } = await supabase.from("bookings").update({ status: newStatus }).eq("id", id);
    if (error) toast.error("Failed to update status");
    else { toast.success(`Status → ${newStatus}`); fetchBookings(); }
  };

  const assignAgent = async (id: string) => {
    const agent = prompt("Enter agent name:");
    if (!agent) return;
    const { error } = await supabase.from("bookings").update({ assigned_agent: agent }).eq("id", id);
    if (error) toast.error("Failed to assign agent");
    else { toast.success("Agent assigned"); fetchBookings(); }
  };

  const filtered = filter === "all" ? bookings : bookings.filter((b) => b.status === filter);

  if (loading) return <div className="glass-card rounded-xl p-8 animate-pulse h-40" />;

  return (
    <div className="space-y-4">
      <div className="flex gap-2 overflow-x-auto pb-1">
        {["all", ...STATUS_FLOW, "cancelled"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={cn(
              "px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all",
              filter === f ? "bg-primary text-primary-foreground" : "bg-card border border-border text-muted-foreground hover:text-foreground"
            )}
          >
            {f === "all" ? `All (${bookings.length})` : `${statusConfig[f]?.label} (${bookings.filter((b) => b.status === f).length})`}
          </button>
        ))}
      </div>
      <div className="space-y-3">
        {filtered.map((booking, i) => {
          const sc = statusConfig[booking.status] || statusConfig.pending;
          const currentIdx = STATUS_FLOW.indexOf(booking.status as any);
          const nextStatus = currentIdx >= 0 && currentIdx < STATUS_FLOW.length - 1 ? STATUS_FLOW[currentIdx + 1] : null;
          return (
            <motion.div key={booking.id} className="glass-card rounded-xl p-4" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.02 }}>
              <div className="flex items-start justify-between flex-wrap gap-2">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${sc.class}`}>{sc.label}</span>
                    <span className="text-xs text-muted-foreground">{booking.vehicle_type}</span>
                  </div>
                  <p className="font-semibold text-foreground">{booking.service_type}</p>
                  <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground flex-wrap">
                    <span>{format(new Date(booking.booking_date), "dd MMM yyyy")}</span>
                    <span>{booking.booking_time}</span>
                    {booking.estimated_price && <span>₹{Number(booking.estimated_price).toLocaleString()}</span>}
                    {booking.assigned_agent && <span className="text-foreground">🔧 {booking.assigned_agent}</span>}
                  </div>
                </div>
                <div className="flex gap-2 flex-wrap">
                  {nextStatus && booking.status !== "cancelled" && (
                    <Button size="sm" variant="outline" className="rounded-lg text-xs" onClick={() => updateStatus(booking.id, nextStatus)}>
                      → {statusConfig[nextStatus]?.label}
                    </Button>
                  )}
                  <Button size="sm" variant="ghost" className="rounded-lg text-xs" onClick={() => assignAgent(booking.id)}>Assign</Button>
                  {booking.status !== "cancelled" && booking.status !== "completed" && (
                    <Button size="sm" variant="ghost" className="rounded-lg text-xs text-destructive" onClick={() => updateStatus(booking.id, "cancelled")}>Cancel</Button>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
        {filtered.length === 0 && <div className="glass-card rounded-xl p-12 text-center text-muted-foreground">No bookings found</div>}
      </div>
    </div>
  );
};

// ─── Users Tab ──────────────────────────────────────────
interface Vehicle {
  id: string;
  vehicle_number: string;
  vehicle_type: string;
  brand: string | null;
  model: string | null;
}

interface LoyaltyPoints {
  id: string;
  vehicle_id: string;
  wash_dots: number;
  service_dots: number;
}

const UsersTab = () => {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [expandedUser, setExpandedUser] = useState<string | null>(null);
  const [editingUser, setEditingUser] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<Profile>>({});
  const [userVehicles, setUserVehicles] = useState<Record<string, Vehicle[]>>({});
  const [userLoyalty, setUserLoyalty] = useState<Record<string, LoyaltyPoints[]>>({});
  const [savingProfile, setSavingProfile] = useState(false);

  const fetchProfiles = useCallback(async () => {
    const { data } = await supabase.from("profiles").select("*").order("created_at", { ascending: false });
    setProfiles((data as Profile[]) || []);
    setLoading(false);
  }, []);

  useEffect(() => { fetchProfiles(); }, [fetchProfiles]);

  const handleDelete = async (userId: string) => {
    if (!confirm("Remove this user's profile?")) return;
    const { error } = await supabase.from("profiles").delete().eq("user_id", userId);
    if (error) toast.error("Failed to delete");
    else { toast.success("Profile removed"); setProfiles((prev) => prev.filter((p) => p.user_id !== userId)); }
  };

  const toggleExpand = async (userId: string) => {
    if (expandedUser === userId) { setExpandedUser(null); setEditingUser(null); return; }
    setExpandedUser(userId);
    setEditingUser(null);
    // Fetch vehicles & loyalty for user
    const [vehiclesRes] = await Promise.all([
      supabase.from("vehicles").select("id, vehicle_number, vehicle_type, brand, model").eq("user_id", userId),
    ]);
    const vehicles = (vehiclesRes.data || []) as Vehicle[];
    setUserVehicles((prev) => ({ ...prev, [userId]: vehicles }));
    // Fetch loyalty for each vehicle
    if (vehicles.length > 0) {
      const vehicleIds = vehicles.map((v) => v.id);
      const { data: loyaltyData } = await supabase.from("loyalty_points").select("*").in("vehicle_id", vehicleIds);
      setUserLoyalty((prev) => ({ ...prev, [userId]: (loyaltyData || []) as LoyaltyPoints[] }));
    } else {
      setUserLoyalty((prev) => ({ ...prev, [userId]: [] }));
    }
  };

  const startEdit = (profile: Profile) => {
    setEditingUser(profile.user_id);
    setEditForm({ name: profile.name, email: profile.email, mobile_number: profile.mobile_number, address: profile.address });
  };

  const saveProfile = async (userId: string) => {
    setSavingProfile(true);
    const { error } = await supabase.from("profiles").update({
      name: editForm.name, email: editForm.email,
      mobile_number: editForm.mobile_number, address: editForm.address,
    }).eq("user_id", userId);
    setSavingProfile(false);
    if (error) toast.error("Failed to update profile");
    else { toast.success("Profile updated"); setEditingUser(null); fetchProfiles(); }
  };

  const updateLoyalty = async (vehicleId: string, field: "wash_dots" | "service_dots", value: number) => {
    const existing = Object.values(userLoyalty).flat().find((l) => l.vehicle_id === vehicleId);
    if (existing) {
      const { error } = await supabase.from("loyalty_points").update({ [field]: value }).eq("vehicle_id", vehicleId);
      if (error) toast.error("Failed to update");
      else {
        toast.success("Loyalty updated");
        setUserLoyalty((prev) => {
          const updated = { ...prev };
          for (const key of Object.keys(updated)) {
            updated[key] = updated[key].map((l) => l.vehicle_id === vehicleId ? { ...l, [field]: value } : l);
          }
          return updated;
        });
      }
    } else {
      const { error, data } = await supabase.from("loyalty_points").insert({ vehicle_id: vehicleId, [field]: value }).select().single();
      if (error) toast.error("Failed to create loyalty");
      else {
        toast.success("Loyalty created");
        setUserLoyalty((prev) => {
          const updated = { ...prev };
          for (const key of Object.keys(updated)) {
            if (updated[key]) updated[key] = [...updated[key], data as LoyaltyPoints];
          }
          return updated;
        });
      }
    }
  };

  const filtered = profiles.filter((p) =>
    (p.name || "").toLowerCase().includes(search.toLowerCase()) ||
    (p.email || "").toLowerCase().includes(search.toLowerCase()) ||
    (p.mobile_number || "").includes(search)
  );

  if (loading) return <div className="glass-card rounded-xl p-8 animate-pulse h-40" />;

  return (
    <div className="space-y-4">
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input value={search} onChange={(e) => setSearch(e.target.value)} className="premium-input pl-10" placeholder="Search by name, email, phone..." />
      </div>
      <div className="space-y-2">
        {filtered.map((profile, i) => {
          const isExpanded = expandedUser === profile.user_id;
          const isEditing = editingUser === profile.user_id;
          const vehicles = userVehicles[profile.user_id] || [];
          const loyalty = userLoyalty[profile.user_id] || [];

          return (
            <motion.div key={profile.id} className="glass-card rounded-xl overflow-hidden" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.02 }}>
              {/* Header row */}
              <div className="p-4 flex items-center justify-between cursor-pointer" onClick={() => toggleExpand(profile.user_id)}>
                <div className="flex items-center gap-3">
                  {profile.profile_photo ? (
                    <img src={profile.profile_photo} alt="" className="w-10 h-10 rounded-full object-cover" />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center"><Users className="w-5 h-5 text-primary" /></div>
                  )}
                  <div>
                    <p className="font-medium text-foreground">{profile.name || "Unnamed"}</p>
                    <p className="text-xs text-muted-foreground">{profile.email}{profile.mobile_number ? ` • ${profile.mobile_number}` : ""}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground hidden sm:inline">{format(new Date(profile.created_at), "dd MMM yyyy")}</span>
                  <motion.div animate={{ rotate: isExpanded ? 180 : 0 }} transition={{ duration: 0.2 }}>
                    <svg className="w-4 h-4 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                  </motion.div>
                </div>
              </div>

              {/* Expanded content */}
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="border-t border-border/30"
                  >
                    <div className="p-4 space-y-4">
                      {/* Profile Details / Edit */}
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <h4 className="text-sm font-semibold text-foreground flex items-center gap-1.5"><Users className="w-4 h-4 text-primary" /> Profile Details</h4>
                          <div className="flex gap-1.5">
                            {!isEditing ? (
                              <Button size="sm" variant="outline" className="rounded-lg text-xs gap-1" onClick={() => startEdit(profile)}><Edit2 className="w-3 h-3" /> Edit</Button>
                            ) : (
                              <>
                                <Button size="sm" className="rounded-lg text-xs gap-1" onClick={() => saveProfile(profile.user_id)} disabled={savingProfile}><Save className="w-3 h-3" /> {savingProfile ? "Saving..." : "Save"}</Button>
                                <Button size="sm" variant="ghost" className="rounded-lg text-xs" onClick={() => setEditingUser(null)}>Cancel</Button>
                              </>
                            )}
                            <Button size="sm" variant="ghost" className="text-destructive rounded-lg text-xs" onClick={() => handleDelete(profile.user_id)}><Trash2 className="w-3 h-3" /></Button>
                          </div>
                        </div>

                        {isEditing ? (
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                              <label className="text-[10px] font-medium text-muted-foreground mb-1 block">Name</label>
                              <input className="premium-input h-9 text-sm" value={editForm.name || ""} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} />
                            </div>
                            <div>
                              <label className="text-[10px] font-medium text-muted-foreground mb-1 block">Email</label>
                              <input className="premium-input h-9 text-sm" value={editForm.email || ""} onChange={(e) => setEditForm({ ...editForm, email: e.target.value })} />
                            </div>
                            <div>
                              <label className="text-[10px] font-medium text-muted-foreground mb-1 block">Mobile</label>
                              <input className="premium-input h-9 text-sm" value={editForm.mobile_number || ""} onChange={(e) => setEditForm({ ...editForm, mobile_number: e.target.value })} />
                            </div>
                            <div>
                              <label className="text-[10px] font-medium text-muted-foreground mb-1 block">Address</label>
                              <input className="premium-input h-9 text-sm" value={editForm.address || ""} onChange={(e) => setEditForm({ ...editForm, address: e.target.value })} />
                            </div>
                          </div>
                        ) : (
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                            <div className="bg-muted/30 rounded-lg p-2.5">
                              <p className="text-[10px] text-muted-foreground">Name</p>
                              <p className="text-sm font-medium text-foreground truncate">{profile.name || "—"}</p>
                            </div>
                            <div className="bg-muted/30 rounded-lg p-2.5">
                              <p className="text-[10px] text-muted-foreground">Email</p>
                              <p className="text-sm font-medium text-foreground truncate">{profile.email || "—"}</p>
                            </div>
                            <div className="bg-muted/30 rounded-lg p-2.5">
                              <p className="text-[10px] text-muted-foreground">Mobile</p>
                              <p className="text-sm font-medium text-foreground">{profile.mobile_number || "—"}</p>
                            </div>
                            <div className="bg-muted/30 rounded-lg p-2.5">
                              <p className="text-[10px] text-muted-foreground">Address</p>
                              <p className="text-sm font-medium text-foreground truncate">{(profile as any).address || "—"}</p>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Vehicles & Loyalty */}
                      <div className="space-y-3">
                        <h4 className="text-sm font-semibold text-foreground flex items-center gap-1.5"><Car className="w-4 h-4 text-primary" /> Vehicles & Loyalty Rewards</h4>
                        {vehicles.length === 0 ? (
                          <p className="text-xs text-muted-foreground bg-muted/30 rounded-lg p-4 text-center">No vehicles registered</p>
                        ) : (
                          <div className="space-y-3">
                            {vehicles.map((vehicle) => {
                              const vLoyalty = loyalty.find((l) => l.vehicle_id === vehicle.id);
                              const washDots = vLoyalty?.wash_dots ?? 0;
                              const serviceDots = vLoyalty?.service_dots ?? 0;
                              return (
                                <div key={vehicle.id} className="bg-muted/20 border border-border/30 rounded-xl p-4 space-y-3">
                                  <div className="flex items-center justify-between">
                                    <div>
                                      <p className="font-semibold text-foreground text-sm">{vehicle.vehicle_number}</p>
                                      <p className="text-xs text-muted-foreground">{vehicle.vehicle_type}{vehicle.brand ? ` • ${vehicle.brand}` : ""}{vehicle.model ? ` ${vehicle.model}` : ""}</p>
                                    </div>
                                    <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-primary/10 text-primary">{vehicle.vehicle_type}</span>
                                  </div>
                                  {/* Loyalty dots */}
                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    {/* Wash Dots */}
                                    <div className="bg-background/50 rounded-lg p-3 space-y-2">
                                      <div className="flex items-center justify-between">
                                        <p className="text-xs font-medium text-foreground flex items-center gap-1"><Gift className="w-3 h-3 text-blue-500" /> Wash Dots</p>
                                        <span className="text-xs font-bold text-primary">{washDots}/5</span>
                                      </div>
                                      <div className="flex gap-1.5">
                                        {[1, 2, 3, 4, 5].map((dot) => (
                                          <button
                                            key={dot}
                                            onClick={() => updateLoyalty(vehicle.id, "wash_dots", dot === washDots ? dot - 1 : dot)}
                                            className={cn(
                                              "w-7 h-7 rounded-full border-2 transition-all text-xs font-bold",
                                              dot <= washDots
                                                ? "bg-blue-500 border-blue-500 text-white shadow-lg shadow-blue-500/30"
                                                : "border-border text-muted-foreground hover:border-blue-400"
                                            )}
                                          >
                                            {dot}
                                          </button>
                                        ))}
                                      </div>
                                      {washDots >= 5 && <p className="text-[10px] font-medium text-blue-500">🎉 Free wash earned!</p>}
                                    </div>
                                    {/* Service Dots */}
                                    <div className="bg-background/50 rounded-lg p-3 space-y-2">
                                      <div className="flex items-center justify-between">
                                        <p className="text-xs font-medium text-foreground flex items-center gap-1"><Gift className="w-3 h-3 text-amber-500" /> Service Dots</p>
                                        <span className="text-xs font-bold text-primary">{serviceDots}/5</span>
                                      </div>
                                      <div className="flex gap-1.5">
                                        {[1, 2, 3, 4, 5].map((dot) => (
                                          <button
                                            key={dot}
                                            onClick={() => updateLoyalty(vehicle.id, "service_dots", dot === serviceDots ? dot - 1 : dot)}
                                            className={cn(
                                              "w-7 h-7 rounded-full border-2 transition-all text-xs font-bold",
                                              dot <= serviceDots
                                                ? "bg-amber-500 border-amber-500 text-white shadow-lg shadow-amber-500/30"
                                                : "border-border text-muted-foreground hover:border-amber-400"
                                            )}
                                          >
                                            {dot}
                                          </button>
                                        ))}
                                      </div>
                                      {serviceDots >= 5 && <p className="text-[10px] font-medium text-amber-500">🎉 50% discount earned!</p>}
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
        {filtered.length === 0 && <div className="glass-card rounded-xl p-12 text-center text-muted-foreground">No users found</div>}
      </div>
      <p className="text-xs text-muted-foreground">{profiles.length} total users</p>
    </div>
  );
};

// ─── Parts interface ────────────────────────────────────
interface PartItem {
  id: string;
  name: string;
  price: number;
  is_active: boolean;
}

// ─── Services Tab (CRUD) ────────────────────────────────
const ServicesTab = () => {
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [parts, setParts] = useState<PartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<string | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [subTab, setSubTab] = useState<"services" | "parts">("services");
  const [form, setForm] = useState({ name: "", category: "Both", price_car: 0, price_bike: 0, description: "" });
  const [partForm, setPartForm] = useState({ name: "", price: 0 });
  const [showAddPart, setShowAddPart] = useState(false);

  const fetchServices = useCallback(async () => {
    const { data } = await supabase.from("services").select("*").order("sort_order");
    setServices((data as ServiceItem[]) || []);
    setLoading(false);
  }, []);

  const fetchParts = useCallback(async () => {
    const { data } = await supabase.from("parts").select("*").order("created_at", { ascending: false });
    setParts((data as PartItem[]) || []);
  }, []);

  useEffect(() => { fetchServices(); fetchParts(); }, [fetchServices, fetchParts]);

  const handleAdd = async () => {
    if (!form.name) { toast.error("Service name required"); return; }
    const { error } = await supabase.from("services").insert({
      name: form.name, category: form.category,
      price_car: form.price_car, price_bike: form.price_bike,
      description: form.description || null, sort_order: services.length + 1,
    });
    if (error) toast.error("Failed to add service");
    else { toast.success("Service added"); setShowAdd(false); setForm({ name: "", category: "Both", price_car: 0, price_bike: 0, description: "" }); fetchServices(); }
  };

  const handleAddPart = async () => {
    if (!partForm.name) { toast.error("Part name required"); return; }
    const { error } = await supabase.from("parts").insert({ name: partForm.name, price: partForm.price });
    if (error) toast.error("Failed to add part");
    else { toast.success("Part added"); setShowAddPart(false); setPartForm({ name: "", price: 0 }); fetchParts(); }
  };

  const handleDeletePart = async (id: string) => {
    if (!confirm("Delete this part?")) return;
    const { error } = await supabase.from("parts").delete().eq("id", id);
    if (error) toast.error("Failed to delete");
    else { toast.success("Part deleted"); fetchParts(); }
  };

  const handleUpdate = async (id: string, updates: Partial<ServiceItem>) => {
    const { error } = await supabase.from("services").update(updates).eq("id", id);
    if (error) toast.error("Failed to update");
    else { toast.success("Updated"); setEditing(null); fetchServices(); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this service?")) return;
    const { error } = await supabase.from("services").delete().eq("id", id);
    if (error) toast.error("Failed to delete");
    else { toast.success("Deleted"); fetchServices(); }
  };

  const toggleActive = async (s: ServiceItem) => {
    handleUpdate(s.id, { is_active: !s.is_active });
  };

  if (loading) return <div className="glass-card rounded-xl p-8 animate-pulse h-40" />;

  return (
    <div className="space-y-4">
      {/* Sub-tabs: Services / Parts */}
      <div className="flex gap-2 mb-2">
        <button
          onClick={() => setSubTab("services")}
          className={cn(
            "flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all",
            subTab === "services" ? "bg-primary text-primary-foreground shadow-lg" : "bg-card border border-border text-muted-foreground hover:text-foreground"
          )}
        >
          <Wrench className="w-4 h-4" /> Services
        </button>
        <button
          onClick={() => setSubTab("parts")}
          className={cn(
            "flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all",
            subTab === "parts" ? "bg-primary text-primary-foreground shadow-lg" : "bg-card border border-border text-muted-foreground hover:text-foreground"
          )}
        >
          <Package className="w-4 h-4" /> Parts
        </button>
      </div>

      {subTab === "services" ? (
        <>
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">{services.length} services configured</p>
            <Button size="sm" className="rounded-lg gap-1.5" onClick={() => setShowAdd(!showAdd)}>
              {showAdd ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
              {showAdd ? "Cancel" : "Add Service"}
            </Button>
          </div>

          <AnimatePresence>
            {showAdd && (
              <motion.div className="glass-card rounded-xl p-5 space-y-3" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input className="premium-input" placeholder="Service Name *" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                  <select className="premium-select" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                    <option value="Both">Both</option>
                    <option value="Car">Car Only</option>
                    <option value="Bike">Bike Only</option>
                  </select>
                  <input className="premium-input" type="number" placeholder="Car Price ₹" value={form.price_car || ""} onChange={(e) => setForm({ ...form, price_car: +e.target.value })} />
                  <input className="premium-input" type="number" placeholder="Bike Price ₹" value={form.price_bike || ""} onChange={(e) => setForm({ ...form, price_bike: +e.target.value })} />
                </div>
                <input className="premium-input" placeholder="Description (optional)" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
                <Button className="rounded-lg gap-1.5" onClick={handleAdd}><Save className="w-4 h-4" /> Add Service</Button>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {services.map((s, i) => (
              <motion.div key={s.id} className={cn("glass-card rounded-xl p-4", !s.is_active && "opacity-50")} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}>
                {editing === s.id ? (
                  <ServiceEditForm service={s} onSave={(updates) => handleUpdate(s.id, updates)} onCancel={() => setEditing(null)} />
                ) : (
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-semibold text-foreground">{s.name}</p>
                      <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-primary/10 text-primary">{s.category}</span>
                      {s.description && <p className="text-xs text-muted-foreground mt-1">{s.description}</p>}
                    </div>
                    <div className="text-right">
                      {(s.category !== "Bike") && <>
                        <p className="text-sm font-bold text-foreground">₹{Number(s.price_car).toLocaleString()}</p>
                        <p className="text-[10px] text-muted-foreground">Car</p>
                      </>}
                      {(s.category !== "Car" && Number(s.price_bike) > 0) && <>
                        <p className="text-sm font-bold text-foreground mt-0.5">₹{Number(s.price_bike).toLocaleString()}</p>
                        <p className="text-[10px] text-muted-foreground">Bike</p>
                      </>}
                    </div>
                  </div>
                )}
                {editing !== s.id && (
                  <div className="flex gap-1.5 mt-3 pt-3 border-t border-border/30">
                    <Button size="sm" variant="ghost" className="text-xs rounded-lg gap-1" onClick={() => setEditing(s.id)}><Edit2 className="w-3 h-3" /> Edit</Button>
                    <Button size="sm" variant="ghost" className="text-xs rounded-lg" onClick={() => toggleActive(s)}>{s.is_active ? "Disable" : "Enable"}</Button>
                    <Button size="sm" variant="ghost" className="text-xs rounded-lg text-destructive" onClick={() => handleDelete(s.id)}><Trash2 className="w-3 h-3" /></Button>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </>
      ) : (
        /* Parts sub-tab */
        <>
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">{parts.length} parts configured</p>
            <Button size="sm" className="rounded-lg gap-1.5" onClick={() => setShowAddPart(!showAddPart)}>
              {showAddPart ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
              {showAddPart ? "Cancel" : "Add Part"}
            </Button>
          </div>

          <AnimatePresence>
            {showAddPart && (
              <motion.div className="glass-card rounded-xl p-5 space-y-3" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input className="premium-input" placeholder="Part Name *" value={partForm.name} onChange={(e) => setPartForm({ ...partForm, name: e.target.value })} />
                  <input className="premium-input" type="number" placeholder="Price ₹" value={partForm.price || ""} onChange={(e) => setPartForm({ ...partForm, price: +e.target.value })} />
                </div>
                <Button className="rounded-lg gap-1.5" onClick={handleAddPart}><Save className="w-4 h-4" /> Add Part</Button>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {parts.map((p, i) => (
              <motion.div key={p.id} className={cn("glass-card rounded-xl p-4", !p.is_active && "opacity-50")} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-foreground">{p.name}</p>
                    <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-accent/20 text-accent-foreground">Part</span>
                  </div>
                  <p className="text-sm font-bold text-foreground">₹{Number(p.price).toLocaleString()}</p>
                </div>
                <div className="flex gap-1.5 mt-3 pt-3 border-t border-border/30">
                  <Button size="sm" variant="ghost" className="text-xs rounded-lg text-destructive gap-1" onClick={() => handleDeletePart(p.id)}><Trash2 className="w-3 h-3" /> Delete</Button>
                </div>
              </motion.div>
            ))}
            {parts.length === 0 && <div className="glass-card rounded-xl p-12 text-center text-muted-foreground col-span-2">No parts added yet</div>}
          </div>
        </>
      )}
    </div>
  );
};

const ServiceEditForm = ({ service, onSave, onCancel }: { service: ServiceItem; onSave: (u: Partial<ServiceItem>) => void; onCancel: () => void }) => {
  const [f, setF] = useState({
    name: service.name, category: service.category,
    price_car: Number(service.price_car), price_bike: Number(service.price_bike),
    description: service.description || "",
  });
  return (
    <div className="space-y-2">
      <input className="premium-input h-9 text-sm" value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} />
      <div className="grid grid-cols-2 gap-2">
        <input className="premium-input h-9 text-sm" type="number" placeholder="Car ₹" value={f.price_car || ""} onChange={(e) => setF({ ...f, price_car: +e.target.value })} />
        <input className="premium-input h-9 text-sm" type="number" placeholder="Bike ₹" value={f.price_bike || ""} onChange={(e) => setF({ ...f, price_bike: +e.target.value })} />
      </div>
      <select className="premium-select h-9 text-sm" value={f.category} onChange={(e) => setF({ ...f, category: e.target.value })}>
        <option value="Both">Both</option><option value="Car">Car Only</option><option value="Bike">Bike Only</option>
      </select>
      <div className="flex gap-2">
        <Button size="sm" className="rounded-lg gap-1 text-xs" onClick={() => onSave(f)}><Save className="w-3 h-3" /> Save</Button>
        <Button size="sm" variant="ghost" className="rounded-lg text-xs" onClick={onCancel}>Cancel</Button>
      </div>
    </div>
  );
};

// ─── Invoices Tab ───────────────────────────────────────
interface LineItem {
  name: string;
  price: number;
}

type InvoiceMode = "user" | "non-user";

const InvoicesTab = () => {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState<InvoiceMode>("user");
  const [catalogItems, setCatalogItems] = useState<{ name: string; price: number; type: string }[]>([]);

  // User mode
  const [selectedProfile, setSelectedProfile] = useState<Profile | null>(null);
  const [userSearch, setUserSearch] = useState("");

  // Non-user mode
  const [nonUserName, setNonUserName] = useState("");
  const [nonUserPhone, setNonUserPhone] = useState("");
  const [vehicleType, setVehicleType] = useState("Car");
  const [vehicleNumber, setVehicleNumber] = useState("");

  // Shared
  const [lineItems, setLineItems] = useState<LineItem[]>([{ name: "", price: 0 }]);
  const [activeDropdown, setActiveDropdown] = useState<number | null>(null);

  useEffect(() => {
    supabase.from("profiles").select("*").order("created_at", { ascending: false }).then(({ data }) => {
      setProfiles((data as Profile[]) || []);
      setLoading(false);
    });
    // Fetch catalog for autocomplete
    Promise.all([
      supabase.from("services").select("name, price_car, price_bike, category").eq("is_active", true),
      supabase.from("parts").select("name, price").eq("is_active", true),
    ]).then(([servicesRes, partsRes]) => {
      const items: { name: string; price: number; type: string }[] = [];
      (servicesRes.data || []).forEach((s: any) => {
        items.push({ name: s.name, price: Number(s.price_car) || Number(s.price_bike) || 0, type: "Service" });
      });
      (partsRes.data || []).forEach((p: any) => {
        items.push({ name: p.name, price: Number(p.price), type: "Part" });
      });
      setCatalogItems(items);
    });
  }, []);

  const filteredProfiles = profiles.filter((p) =>
    (p.name || "").toLowerCase().includes(userSearch.toLowerCase()) ||
    (p.email || "").toLowerCase().includes(userSearch.toLowerCase()) ||
    (p.mobile_number || "").includes(userSearch)
  );

  const addLineItem = () => setLineItems([...lineItems, { name: "", price: 0 }]);
  const removeLineItem = (idx: number) => {
    if (lineItems.length <= 1) return;
    setLineItems(lineItems.filter((_, i) => i !== idx));
  };
  const updateLineItem = (idx: number, field: keyof LineItem, value: string | number) => {
    setLineItems(lineItems.map((item, i) => i === idx ? { ...item, [field]: value } : item));
  };

  const totalAmount = lineItems.reduce((sum, item) => sum + (Number(item.price) || 0), 0);

  const getCustomerName = () => mode === "user" ? (selectedProfile?.name || "N/A") : (nonUserName || "Walk-in Customer");
  const getCustomerPhone = () => {
    const raw = mode === "user" ? (selectedProfile?.mobile_number || "") : nonUserPhone;
    return raw.replace(/\D/g, "");
  };

  const generateInvoiceText = () => {
    const itemsText = lineItems
      .filter((item) => item.name.trim())
      .map((item) => `  • ${item.name} — ₹${Number(item.price).toLocaleString()}`)
      .join("\n");

    const invNo = `INV-${Date.now().toString(36).toUpperCase()}`;
    const dateStr = format(new Date(), "dd MMM yyyy");

    let details = `👤 Customer: ${getCustomerName()}\n📅 Date: ${dateStr}`;
    if (mode === "non-user" && vehicleNumber) details += `\n🚗 Vehicle: ${vehicleType} • ${vehicleNumber}`;

    return `🧾 *INVOICE — Mr Red OSB*\n📄 ${invNo}\n\n` +
      `${details}\n\n` +
      `━━━━━━━━━━━━━━━━━━\n` +
      `*Item-wise Breakdown:*\n\n` +
      `${itemsText}\n\n` +
      `━━━━━━━━━━━━━━━━━━\n` +
      `💰 *Total: ₹${totalAmount.toLocaleString()}*\n\n` +
      `Thank you for choosing Mr Red OSB! 🙏`;
  };

  const sendViaWhatsApp = () => {
    const validItems = lineItems.filter((item) => item.name.trim() && item.price > 0);
    if (validItems.length === 0) { toast.error("Add at least one line item"); return; }

    const phone = getCustomerPhone();
    if (!phone) {
      toast.error("No phone number available. Copying invoice to clipboard.");
      navigator.clipboard.writeText(generateInvoiceText());
      return;
    }

    const text = encodeURIComponent(generateInvoiceText());
    const whatsappUrl = `https://wa.me/${phone.startsWith("91") ? phone : "91" + phone}?text=${text}`;
    window.open(whatsappUrl, "_blank");
    toast.success("Opening WhatsApp with invoice");
  };

  const copyInvoice = () => {
    navigator.clipboard.writeText(generateInvoiceText());
    toast.success("Invoice copied to clipboard!");
  };

  const resetForm = () => {
    setSelectedProfile(null);
    setNonUserName("");
    setNonUserPhone("");
    setVehicleType("Car");
    setVehicleNumber("");
    setLineItems([{ name: "", price: 0 }]);
  };

  if (loading) return <div className="glass-card rounded-xl p-8 animate-pulse h-40" />;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Left: Customer Selection */}
      <div className="space-y-4">
        {/* Mode toggle */}
        <div className="flex gap-2">
          <button
            onClick={() => { setMode("user"); resetForm(); }}
            className={cn(
              "flex-1 py-2.5 rounded-xl text-sm font-medium transition-all",
              mode === "user" ? "bg-primary text-primary-foreground shadow-lg" : "bg-card border border-border text-muted-foreground hover:text-foreground"
            )}
          >
            <Users className="w-4 h-4 inline mr-1.5" /> Existing User
          </button>
          <button
            onClick={() => { setMode("non-user"); resetForm(); }}
            className={cn(
              "flex-1 py-2.5 rounded-xl text-sm font-medium transition-all",
              mode === "non-user" ? "bg-primary text-primary-foreground shadow-lg" : "bg-card border border-border text-muted-foreground hover:text-foreground"
            )}
          >
            <Plus className="w-4 h-4 inline mr-1.5" /> Non-User
          </button>
        </div>

        {mode === "user" ? (
          <div className="space-y-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                className="premium-input pl-10"
                placeholder="Search by name, email, or phone..."
              />
            </div>
            <div className="space-y-2 max-h-[50vh] overflow-y-auto pr-1">
              {filteredProfiles.map((profile) => {
                const isSelected = selectedProfile?.user_id === profile.user_id;
                return (
                  <motion.button
                    key={profile.id}
                    className={cn(
                      "w-full text-left glass-card rounded-xl p-4 transition-all border-2",
                      isSelected ? "border-primary bg-primary/5" : "border-transparent hover:border-primary/30"
                    )}
                    onClick={() => setSelectedProfile(profile)}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-center gap-3">
                      {profile.profile_photo ? (
                        <img src={profile.profile_photo} alt="" className="w-9 h-9 rounded-full object-cover" />
                      ) : (
                        <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center"><Users className="w-4 h-4 text-primary" /></div>
                      )}
                      <div className="min-w-0">
                        <p className="font-semibold text-foreground text-sm truncate">{profile.name || "Unnamed"}</p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          {profile.mobile_number && <span>{profile.mobile_number}</span>}
                          {profile.email && <span className="truncate">• {profile.email}</span>}
                        </div>
                      </div>
                    </div>
                  </motion.button>
                );
              })}
              {filteredProfiles.length === 0 && (
                <div className="glass-card rounded-xl p-8 text-center text-muted-foreground text-sm">No users found</div>
              )}
            </div>
          </div>
        ) : (
          <motion.div className="glass-card rounded-xl p-5 space-y-3" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
            <h4 className="text-sm font-semibold text-foreground">Customer Details</h4>
            <input className="premium-input" placeholder="Customer Name" value={nonUserName} onChange={(e) => setNonUserName(e.target.value)} />
            <input className="premium-input" placeholder="WhatsApp Number (e.g. 9876543210) *" value={nonUserPhone} onChange={(e) => setNonUserPhone(e.target.value)} />
            <div className="grid grid-cols-2 gap-3">
              <select className="premium-select" value={vehicleType} onChange={(e) => setVehicleType(e.target.value)}>
                <option value="Car">Car</option>
                <option value="Bike">Bike</option>
              </select>
              <input className="premium-input" placeholder="Vehicle Number" value={vehicleNumber} onChange={(e) => setVehicleNumber(e.target.value)} />
            </div>
          </motion.div>
        )}
      </div>

      {/* Right: Invoice Builder */}
      <div className="space-y-4">
        <h3 className="font-display text-lg font-semibold text-foreground flex items-center gap-2">
          <FileText className="w-5 h-5 text-primary" /> Invoice Builder
        </h3>

        {(mode === "user" && !selectedProfile) ? (
          <div className="glass-card rounded-2xl p-12 text-center">
            <FileText className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-muted-foreground">Select a user to generate an invoice</p>
          </div>
        ) : (
          <motion.div className="glass-card rounded-xl p-5 space-y-4" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
            {/* Customer summary */}
            <div className="bg-primary/5 rounded-lg p-3 text-sm space-y-0.5">
              <p className="font-semibold text-foreground">{getCustomerName()}</p>
              <p className="text-muted-foreground text-xs">
                {getCustomerPhone() ? `📱 ${getCustomerPhone()}` : "No phone"}
                {mode === "non-user" && vehicleNumber ? ` • 🚗 ${vehicleType} ${vehicleNumber}` : ""}
              </p>
            </div>

            {/* Line items */}
            <div className="space-y-2">
              <p className="text-xs font-medium text-muted-foreground">Services & Parts</p>
              {lineItems.map((item, idx) => {
                const suggestions = item.name.length > 0
                  ? catalogItems.filter((c) => c.name.toLowerCase().includes(item.name.toLowerCase()))
                  : [];
                return (
                  <div key={idx} className="flex gap-2 items-center relative">
                    <div className="relative flex-1">
                      <input
                        className="premium-input h-9 text-sm w-full"
                        placeholder="Service / Part name"
                        value={item.name}
                        onChange={(e) => { updateLineItem(idx, "name", e.target.value); setActiveDropdown(idx); }}
                        onFocus={() => setActiveDropdown(idx)}
                        onBlur={() => setTimeout(() => setActiveDropdown(null), 200)}
                      />
                      {activeDropdown === idx && suggestions.length > 0 && (
                        <div className="absolute z-50 top-full left-0 right-0 mt-1 bg-popover border border-border rounded-lg shadow-xl max-h-40 overflow-y-auto">
                          {suggestions.map((s, si) => (
                            <button
                              key={si}
                              className="w-full text-left px-3 py-2 text-sm hover:bg-muted/50 transition-colors flex items-center justify-between"
                              onMouseDown={(e) => {
                                e.preventDefault();
                                const updated = [...lineItems];
                                updated[idx] = { name: s.name, price: s.price };
                                setLineItems(updated);
                                setActiveDropdown(null);
                              }}
                            >
                              <span className="text-foreground">{s.name}</span>
                              <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                <span className={cn("px-1.5 py-0.5 rounded text-[10px] font-medium", s.type === "Service" ? "bg-primary/10 text-primary" : "bg-accent/20 text-accent-foreground")}>{s.type}</span>
                                ₹{Number(s.price).toLocaleString()}
                              </span>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="relative w-28">
                      <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">₹</span>
                      <input
                        className="premium-input h-9 text-sm pl-6 w-full"
                        type="number"
                        placeholder="Price"
                        value={item.price || ""}
                        onChange={(e) => updateLineItem(idx, "price", +e.target.value)}
                      />
                    </div>
                    <button onClick={() => removeLineItem(idx)} className="text-muted-foreground hover:text-destructive transition-colors p-1" disabled={lineItems.length <= 1}>
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                );
              })}
              <Button size="sm" variant="outline" className="rounded-lg gap-1 text-xs" onClick={addLineItem}>
                <Plus className="w-3 h-3" /> Add Item
              </Button>
            </div>

            {/* Total */}
            <div className="flex items-center justify-between bg-card border border-border rounded-lg p-3">
              <span className="font-semibold text-foreground">Total</span>
              <span className="font-display text-xl font-bold text-primary">₹{totalAmount.toLocaleString()}</span>
            </div>

            {/* Preview */}
            <div className="bg-[#005c4b]/10 rounded-lg p-4 text-xs font-mono whitespace-pre-wrap text-foreground/80 max-h-48 overflow-y-auto border border-[#25D366]/20">
              {generateInvoiceText()}
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <Button className="flex-1 rounded-lg gap-2 bg-[#25D366] hover:bg-[#1da851] text-white" onClick={sendViaWhatsApp}>
                <MessageCircle className="w-4 h-4" /> Send via WhatsApp
              </Button>
              <Button variant="outline" className="rounded-lg gap-1.5" onClick={copyInvoice}>
                <FileText className="w-4 h-4" /> Copy
              </Button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

// ─── Analytics Tab ──────────────────────────────────────
const AnalyticsTab = ({ stats }: { stats: AdminStats }) => {
  const [dailyBookings, setDailyBookings] = useState<{ date: string; count: number }[]>([]);

  useEffect(() => {
    supabase.from("bookings").select("booking_date").order("booking_date", { ascending: false }).limit(100).then(({ data }) => {
      const counts: Record<string, number> = {};
      (data || []).forEach((b: any) => { counts[b.booking_date] = (counts[b.booking_date] || 0) + 1; });
      setDailyBookings(
        Object.entries(counts).sort(([a], [b]) => a.localeCompare(b)).slice(-14).map(([date, count]) => ({ date, count }))
      );
    });
  }, []);

  const maxCount = Math.max(...dailyBookings.map((d) => d.count), 1);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: "Conversion Rate", value: stats.totalBookings > 0 ? `${Math.round((stats.totalServices / Math.max(stats.totalBookings, 1)) * 100)}%` : "0%", sub: "Bookings → Completed" },
          { label: "Avg Revenue/Booking", value: `₹${stats.totalBookings > 0 ? Math.round(stats.revenue / stats.totalBookings).toLocaleString() : 0}`, sub: "Per booking" },
          { label: "Users", value: stats.totalUsers, sub: "Registered" },
        ].map((m, i) => (
          <motion.div key={m.label} className="glass-card rounded-xl p-5" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
            <p className="font-display text-2xl font-bold text-foreground">{m.value}</p>
            <p className="text-xs text-muted-foreground mt-1">{m.label}</p>
            <p className="text-[10px] text-muted-foreground/60">{m.sub}</p>
          </motion.div>
        ))}
      </div>
      <div className="glass-card rounded-xl p-6">
        <h3 className="font-display text-lg font-semibold text-foreground mb-4">Daily Bookings (Last 14 days)</h3>
        <div className="flex items-end gap-1.5 h-40">
          {dailyBookings.map((d, i) => (
            <div key={d.date} className="flex-1 flex flex-col items-center gap-1">
              <span className="text-[10px] text-muted-foreground">{d.count}</span>
              <motion.div className="w-full bg-primary/80 rounded-t-md" initial={{ height: 0 }} animate={{ height: `${(d.count / maxCount) * 100}%` }} transition={{ delay: i * 0.03, duration: 0.4 }} style={{ minHeight: d.count > 0 ? 4 : 0 }} />
              <span className="text-[8px] text-muted-foreground -rotate-45 origin-top-left whitespace-nowrap">{format(new Date(d.date), "dd/MM")}</span>
            </div>
          ))}
          {dailyBookings.length === 0 && <p className="text-muted-foreground text-sm w-full text-center py-12">No booking data yet</p>}
        </div>
      </div>
    </div>
  );
};

// ─── Settings Tab ───────────────────────────────────────
const SettingsTab = () => {
  const [settings, setSettings] = useState<SiteSetting[]>([]);
  const [loading, setLoading] = useState(true);
  const [edited, setEdited] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    supabase.from("site_settings").select("*").order("setting_group").then(({ data }) => {
      setSettings((data as SiteSetting[]) || []);
      setLoading(false);
    });
  }, []);

  const handleChange = (key: string, value: string) => {
    setEdited((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    const updates = Object.entries(edited);
    let hasError = false;
    for (const [key, value] of updates) {
      const { error } = await supabase.from("site_settings").update({ setting_value: value }).eq("setting_key", key);
      if (error) hasError = true;
    }
    setSaving(false);
    if (hasError) toast.error("Some settings failed to save");
    else { toast.success("Settings saved!"); setEdited({}); }
  };

  const groups = settings.reduce<Record<string, SiteSetting[]>>((acc, s) => {
    (acc[s.setting_group] = acc[s.setting_group] || []).push(s);
    return acc;
  }, {});

  const groupLabels: Record<string, { label: string; icon: any }> = {
    general: { label: "Website & Contact Info", icon: Settings },
    loyalty: { label: "Loyalty Rewards", icon: Gift },
    reminders: { label: "Service Reminders", icon: Clock },
  };

  const hasChanges = Object.keys(edited).length > 0;

  if (loading) return <div className="glass-card rounded-xl p-8 animate-pulse h-40" />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">Edit your website, loyalty rewards, and reminder settings.</p>
        <AnimatePresence>
          {hasChanges && (
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}>
              <Button className="rounded-lg gap-1.5" onClick={handleSave} disabled={saving}>
                <Save className="w-4 h-4" />
                {saving ? "Saving..." : "Save Changes"}
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {Object.entries(groups).map(([group, items]) => {
        const meta = groupLabels[group] || { label: group, icon: Settings };
        return (
          <motion.div key={group} className="glass-card rounded-xl p-5 space-y-4" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center gap-2 mb-2">
              <meta.icon className="w-5 h-5 text-primary" />
              <h3 className="font-display text-base font-semibold text-foreground">{meta.label}</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {items.map((s) => (
                <div key={s.setting_key}>
                  <label className="text-xs font-medium text-muted-foreground mb-1 block">{s.setting_label}</label>
                  <input
                    className={cn("premium-input h-10", edited[s.setting_key] !== undefined && "ring-2 ring-primary/40")}
                    value={edited[s.setting_key] ?? s.setting_value}
                    onChange={(e) => handleChange(s.setting_key, e.target.value)}
                  />
                </div>
              ))}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

// ─── Main Admin Panel ───────────────────────────────────
const AdminPanel = () => {
  const { profile, signOut, isSuperAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState<TabId>("overview");
  const [stats, setStats] = useState<AdminStats>({ totalUsers: 0, totalBookings: 0, totalVehicles: 0, totalServices: 0, revenue: 0 });

  useEffect(() => {
    Promise.all([
      supabase.from("profiles").select("id", { count: "exact", head: true }),
      supabase.from("bookings").select("id", { count: "exact", head: true }),
      supabase.from("vehicles").select("id", { count: "exact", head: true }),
      supabase.from("service_records").select("id", { count: "exact", head: true }),
      supabase.from("bookings").select("estimated_price").eq("status", "completed"),
    ]).then(([users, bookings, vehicles, services, revenue]) => {
      const totalRevenue = (revenue.data || []).reduce((sum: number, b: any) => sum + (Number(b.estimated_price) || 0), 0);
      setStats({
        totalUsers: users.count || 0,
        totalBookings: bookings.count || 0,
        totalVehicles: vehicles.count || 0,
        totalServices: services.count || 0,
        revenue: totalRevenue,
      });
    });
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50">
        <div className="container mx-auto flex items-center justify-between h-16 px-4">
          <div className="flex items-center gap-3">
            <img src={logo} alt="Mr Red OSB Service" className="brand-logo h-9 sm:h-11 w-auto max-w-[10rem]" />
            <div className="flex items-center gap-2">
              <LayoutDashboard className="w-4 h-4 text-primary" />
              <span className="font-display font-bold text-foreground text-lg hidden sm:inline">Admin Panel</span>
            </div>
            {isSuperAdmin && <span className="text-[10px] font-medium bg-primary/15 text-primary px-2 py-0.5 rounded-full">Super Admin</span>}
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <div className="flex items-center gap-2">
              {profile?.profile_photo && <img src={profile.profile_photo} alt="" className="w-8 h-8 rounded-full object-cover" />}
              <span className="text-sm text-foreground hidden sm:inline">{profile?.name || "Admin"}</span>
            </div>
            <button onClick={signOut} className="text-muted-foreground hover:text-primary transition-colors" title="Sign out"><LogOut className="w-5 h-5" /></button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 max-w-7xl">
        <div className="flex gap-1 mb-6 bg-card/50 p-1 rounded-xl border border-border/50 overflow-x-auto">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all whitespace-nowrap",
                activeTab === tab.id ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20" : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              )}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        <motion.div key={activeTab} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>
          {activeTab === "overview" && <OverviewTab stats={stats} />}
          {activeTab === "bookings" && <BookingsTab />}
          {activeTab === "invoices" && <InvoicesTab />}
          {activeTab === "users" && <UsersTab />}
          {activeTab === "services" && <ServicesTab />}
          {activeTab === "analytics" && <AnalyticsTab stats={stats} />}
          {activeTab === "settings" && <SettingsTab />}
        </motion.div>
      </main>
    </div>
  );
};

export default AdminPanel;
