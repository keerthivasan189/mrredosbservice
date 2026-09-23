import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { IndianRupee, CheckCircle, Clock, Calendar } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { format } from "date-fns";

interface Booking {
  id: string;
  service_type: string;
  vehicle_type: string;
  booking_date: string;
  estimated_price: number | null;
  status: string;
}

const PaymentsSection = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    supabase
      .from("bookings")
      .select("id, service_type, vehicle_type, booking_date, estimated_price, status")
      .eq("user_id", user.id)
      .order("booking_date", { ascending: false })
      .then(({ data }) => {
        setBookings((data as Booking[]) || []);
        setLoading(false);
      });
  }, [user]);

  const totalSpent = bookings
    .filter((b) => b.status === "completed")
    .reduce((sum, b) => sum + (Number(b.estimated_price) || 0), 0);

  const pendingAmount = bookings
    .filter((b) => ["pending", "confirmed", "in_progress"].includes(b.status))
    .reduce((sum, b) => sum + (Number(b.estimated_price) || 0), 0);

  if (loading) {
    return <div className="space-y-3">{[1, 2].map((i) => <div key={i} className="glass-card rounded-xl p-5 animate-pulse h-20" />)}</div>;
  }

  return (
    <div className="space-y-6">
      {/* Summary cards */}
      <div className="grid grid-cols-2 gap-4">
        <motion.div className="glass-card rounded-xl p-5" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
          <CheckCircle className="w-5 h-5 text-emerald-500 mb-2" />
          <p className="font-display text-2xl font-bold text-foreground">₹{totalSpent.toLocaleString()}</p>
          <p className="text-xs text-muted-foreground">Total Spent</p>
        </motion.div>
        <motion.div className="glass-card rounded-xl p-5" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
          <Clock className="w-5 h-5 text-amber-500 mb-2" />
          <p className="font-display text-2xl font-bold text-foreground">₹{pendingAmount.toLocaleString()}</p>
          <p className="text-xs text-muted-foreground">Pending</p>
        </motion.div>
      </div>

      {/* History */}
      <div className="space-y-2">
        {bookings.map((b, i) => (
          <motion.div
            key={b.id}
            className="glass-card rounded-xl p-4 flex items-center justify-between"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.03 }}
          >
            <div>
              <p className="text-sm font-medium text-foreground">{b.service_type}</p>
              <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                <span>{b.vehicle_type}</span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {format(new Date(b.booking_date), "dd MMM yyyy")}
                </span>
              </div>
            </div>
            <div className="text-right">
              <p className="font-display font-bold text-foreground">
                ₹{(Number(b.estimated_price) || 0).toLocaleString()}
              </p>
              <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${
                b.status === "completed" ? "status-completed" : b.status === "cancelled" ? "status-cancelled" : "status-pending"
              }`}>
                {b.status === "completed" ? "Paid" : b.status === "cancelled" ? "Cancelled" : "Pending"}
              </span>
            </div>
          </motion.div>
        ))}
        {bookings.length === 0 && (
          <div className="glass-card rounded-2xl p-12 text-center">
            <IndianRupee className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-muted-foreground">No payment history yet</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentsSection;
