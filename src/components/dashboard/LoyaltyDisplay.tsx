import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Gift, Wrench, Droplets, Star } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

type LoyaltyPoints = Tables<"loyalty_points">;

interface LoyaltyDisplayProps {
  vehicleId: string | null;
}

const DotTrack = ({
  label,
  icon: Icon,
  current,
  max,
  reward,
  color,
}: {
  label: string;
  icon: React.ElementType;
  current: number;
  max: number;
  reward: string;
  color: string;
}) => {
  const isComplete = current >= max;

  return (
    <div className="glass-card rounded-xl p-5">
      <div className="flex items-center gap-2 mb-4">
        <div className={`w-8 h-8 rounded-lg ${color} flex items-center justify-center`}>
          <Icon className="w-4 h-4 text-white" />
        </div>
        <div>
          <p className="font-semibold text-foreground text-sm">{label}</p>
          <p className="text-[11px] text-muted-foreground">{current}/{max} completed</p>
        </div>
      </div>

      {/* Dots */}
      <div className="flex items-center gap-2 mb-3">
        {Array.from({ length: max }).map((_, i) => (
          <motion.div
            key={i}
            className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all ${
              i < current
                ? "bg-primary border-primary"
                : "bg-card border-border/60"
            }`}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: i * 0.08 }}
          >
            {i < current && <Star className="w-3.5 h-3.5 text-primary-foreground" />}
          </motion.div>
        ))}
      </div>

      {/* Reward info */}
      <div
        className={`text-xs px-3 py-2 rounded-lg ${
          isComplete
            ? "bg-green-500/15 text-green-400 font-medium"
            : "bg-muted/50 text-muted-foreground"
        }`}
      >
        {isComplete ? (
          <span className="flex items-center gap-1.5">
            <Gift className="w-3.5 h-3.5" />
            🎉 Reward unlocked: {reward}
          </span>
        ) : (
          <span>{max - current} more to unlock: {reward}</span>
        )}
      </div>
    </div>
  );
};

const LoyaltyDisplay = ({ vehicleId }: LoyaltyDisplayProps) => {
  const [loyalty, setLoyalty] = useState<LoyaltyPoints | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!vehicleId) {
      setLoyalty(null);
      return;
    }
    setLoading(true);
    supabase
      .from("loyalty_points")
      .select("*")
      .eq("vehicle_id", vehicleId)
      .maybeSingle()
      .then(({ data }) => {
        setLoyalty(data);
        setLoading(false);
      });
  }, [vehicleId]);

  if (!vehicleId) {
    return (
      <div className="glass-card rounded-2xl p-8 text-center">
        <Gift className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
        <p className="text-muted-foreground text-sm">Select a vehicle to view loyalty rewards</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2].map((i) => (
          <div key={i} className="glass-card rounded-xl p-5 animate-pulse h-32" />
        ))}
      </div>
    );
  }

  const serviceDots = loyalty?.service_dots ?? 0;
  const washDots = loyalty?.wash_dots ?? 0;

  return (
    <motion.div
      className="space-y-4"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <DotTrack
        label="Service Rewards"
        icon={Wrench}
        current={serviceDots}
        max={5}
        reward="50% discount on next service"
        color="bg-primary"
      />
      <DotTrack
        label="Wash Rewards"
        icon={Droplets}
        current={washDots}
        max={5}
        reward="Free wash or discount"
        color="bg-blue-500"
      />
    </motion.div>
  );
};

export default LoyaltyDisplay;
