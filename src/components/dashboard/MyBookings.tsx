import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, Clock, MapPin, IndianRupee, Star, RotateCcw, XCircle, ChevronDown, ChevronUp, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { format } from "date-fns";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Booking {
  id: string;
  service_type: string;
  vehicle_type: string;
  booking_date: string;
  booking_time: string;
  pickup_location: string | null;
  estimated_price: number | null;
  status: string;
  assigned_agent: string | null;
  rating: number | null;
  review: string | null;
  created_at: string;
}

const statusConfig: Record<string, { label: string; class: string }> = {
  pending: { label: "Pending", class: "status-pending" },
  confirmed: { label: "Confirmed", class: "status-confirmed" },
  in_progress: { label: "In Progress", class: "status-in_progress" },
  completed: { label: "Completed", class: "status-completed" },
  cancelled: { label: "Cancelled", class: "status-cancelled" },
};

const MyBookings = ({ refreshTrigger }: { refreshTrigger?: number }) => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [filter, setFilter] = useState("all");

  const fetchBookings = async () => {
    if (!user) return;
    const { data } = await supabase
      .from("bookings")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });
    setBookings((data as Booking[]) || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchBookings();
  }, [user, refreshTrigger]);

  // Realtime subscription
  useEffect(() => {
    if (!user) return;
    const channel = supabase
      .channel("my-bookings")
      .on("postgres_changes", { event: "*", schema: "public", table: "bookings", filter: `user_id=eq.${user.id}` }, () => {
        fetchBookings();
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [user]);

  const handleCancel = async (id: string) => {
    if (!confirm("Cancel this booking?")) return;
    const { error } = await supabase.from("bookings").update({ status: "cancelled" }).eq("id", id);
    if (error) toast.error("Failed to cancel");
    else { toast.success("Booking cancelled"); fetchBookings(); }
  };

  const handleRebook = async (booking: Booking) => {
    if (!user) return;
    const { error } = await supabase.from("bookings").insert({
      user_id: user.id,
      vehicle_type: booking.vehicle_type,
      service_type: booking.service_type,
      booking_date: format(new Date(), "yyyy-MM-dd"),
      booking_time: booking.booking_time,
      pickup_location: booking.pickup_location,
      estimated_price: booking.estimated_price,
      status: "pending",
    });
    if (error) toast.error("Failed to rebook");
    else { toast.success("Rebooked! We'll confirm shortly."); fetchBookings(); }
  };

  const handleRate = async (id: string, rating: number) => {
    const { error } = await supabase.from("bookings").update({ rating }).eq("id", id);
    if (error) toast.error("Failed to rate");
    else { toast.success("Thanks for your rating!"); fetchBookings(); }
  };

  const filtered = filter === "all" ? bookings : bookings.filter((b) => b.status === filter);

  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => <div key={i} className="glass-card rounded-xl p-5 animate-pulse h-24" />)}
      </div>
    );
  }

  return (
    <div>
      {/* Filter chips */}
      <div className="flex gap-2 mb-5 overflow-x-auto pb-1">
        {["all", "pending", "confirmed", "in_progress", "completed", "cancelled"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={cn(
              "px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all",
              filter === f ? "bg-primary text-primary-foreground" : "bg-card border border-border text-muted-foreground hover:text-foreground"
            )}
          >
            {f === "all" ? "All" : statusConfig[f]?.label || f}
            {f !== "all" && (
              <span className="ml-1 opacity-60">({bookings.filter((b) => b.status === f).length})</span>
            )}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="glass-card rounded-2xl p-12 text-center">
          <Calendar className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
          <p className="text-muted-foreground">No bookings found</p>
        </div>
      ) : (
        <div className="space-y-3">
          <AnimatePresence>
            {filtered.map((booking, i) => {
              const expanded = expandedId === booking.id;
              const sc = statusConfig[booking.status] || statusConfig.pending;
              const canCancel = ["pending", "confirmed"].includes(booking.status);

              return (
                <motion.div
                  key={booking.id}
                  className="glass-card-hover rounded-xl overflow-hidden"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.03 }}
                >
                  <button
                    className="w-full p-4 text-left flex items-start justify-between"
                    onClick={() => setExpandedId(expanded ? null : booking.id)}
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${sc.class}`}>
                          {sc.label}
                        </span>
                        <span className="text-xs text-muted-foreground">{booking.vehicle_type}</span>
                      </div>
                      <p className="font-semibold text-foreground">{booking.service_type}</p>
                      <div className="flex items-center gap-4 mt-1.5 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {format(new Date(booking.booking_date), "dd MMM yyyy")}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {booking.booking_time}
                        </span>
                        {booking.estimated_price && (
                          <span className="flex items-center gap-1">
                            <IndianRupee className="w-3 h-3" />
                            ₹{Number(booking.estimated_price).toLocaleString()}
                          </span>
                        )}
                      </div>
                    </div>
                    {expanded ? <ChevronUp className="w-4 h-4 text-muted-foreground mt-1" /> : <ChevronDown className="w-4 h-4 text-muted-foreground mt-1" />}
                  </button>

                  {expanded && (
                    <motion.div
                      className="px-4 pb-4 space-y-3"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      <div className="border-t border-border/40 pt-3" />
                      {booking.pickup_location && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <MapPin className="w-4 h-4" /> {booking.pickup_location}
                        </div>
                      )}
                      {booking.assigned_agent && (
                        <p className="text-sm text-muted-foreground">Agent: <span className="text-foreground">{booking.assigned_agent}</span></p>
                      )}

                      {/* Rating for completed */}
                      {booking.status === "completed" && (
                        <div>
                          <p className="text-xs text-muted-foreground mb-1.5">Rate this service</p>
                          <div className="flex gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <button
                                key={star}
                                onClick={() => handleRate(booking.id, star)}
                                className="transition-transform hover:scale-110"
                              >
                                <Star
                                  className={cn(
                                    "w-6 h-6",
                                    star <= (booking.rating || 0) ? "fill-amber-400 text-amber-400" : "text-border"
                                  )}
                                />
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Actions */}
                      <div className="flex gap-2 pt-1">
                        {canCancel && (
                          <Button variant="outline" size="sm" className="rounded-lg" onClick={() => handleCancel(booking.id)}>
                            <XCircle className="w-4 h-4 mr-1" /> Cancel
                          </Button>
                        )}
                        {booking.status === "completed" && (
                          <Button variant="outline" size="sm" className="rounded-lg" onClick={() => handleRebook(booking)}>
                            <RotateCcw className="w-4 h-4 mr-1" /> Book Again
                          </Button>
                        )}
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

export default MyBookings;
