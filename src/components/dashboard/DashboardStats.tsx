import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Car, Wrench, Gift, FileText } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

const DashboardStats = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({ vehicles: 0, services: 0, invoices: 0, loyalty: 0 });

  useEffect(() => {
    if (!user) return;

    const fetchStats = async () => {
      const [vehiclesRes, servicesRes, invoicesRes] = await Promise.all([
        supabase.from("vehicles").select("id", { count: "exact", head: true }).eq("user_id", user.id),
        supabase
          .from("service_records")
          .select("id, vehicles!inner(user_id)", { count: "exact", head: true })
          .eq("vehicles.user_id", user.id),
        supabase
          .from("invoices")
          .select("id, service_records!inner(vehicle_id, vehicles!inner(user_id))", { count: "exact", head: true })
          .eq("service_records.vehicles.user_id", user.id),
      ]);

      setStats({
        vehicles: vehiclesRes.count || 0,
        services: servicesRes.count || 0,
        invoices: invoicesRes.count || 0,
        loyalty: 0,
      });
    };

    fetchStats();
  }, [user]);

  const cards = [
    { label: "Vehicles", icon: Car, value: stats.vehicles, color: "text-primary" },
    { label: "Services", icon: Wrench, value: stats.services, color: "text-accent" },
    { label: "Invoices", icon: FileText, value: stats.invoices, color: "text-blue-400" },
    { label: "Reward Pts", icon: Gift, value: stats.loyalty, color: "text-green-400" },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, i) => (
        <motion.div
          key={card.label}
          className="glass-card p-5 rounded-xl"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.05 }}
        >
          <card.icon className={`w-5 h-5 ${card.color} mb-2`} />
          <p className="font-display text-2xl font-bold text-foreground">{card.value}</p>
          <p className="text-xs text-muted-foreground mt-1">{card.label}</p>
        </motion.div>
      ))}
    </div>
  );
};

export default DashboardStats;
