import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Wrench, Calendar, DollarSign, ImageIcon, ChevronDown, ChevronUp } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import type { Tables } from "@/integrations/supabase/types";

type ServiceRecord = Tables<"service_records">;

interface ServiceTimelineProps {
  vehicleId: string | null;
}

const ServiceTimeline = ({ vehicleId }: ServiceTimelineProps) => {
  const [records, setRecords] = useState<ServiceRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    if (!vehicleId) {
      setRecords([]);
      return;
    }
    setLoading(true);
    supabase
      .from("service_records")
      .select("*")
      .eq("vehicle_id", vehicleId)
      .order("service_date", { ascending: false })
      .then(({ data }) => {
        setRecords(data || []);
        setLoading(false);
      });
  }, [vehicleId]);

  if (!vehicleId) {
    return (
      <div className="glass-card rounded-2xl p-8 text-center">
        <Wrench className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
        <p className="text-muted-foreground text-sm">Select a vehicle to view service history</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="glass-card rounded-xl p-5 animate-pulse h-20" />
        ))}
      </div>
    );
  }

  if (records.length === 0) {
    return (
      <div className="glass-card rounded-2xl p-8 text-center">
        <Wrench className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
        <p className="text-muted-foreground text-sm">No service records yet for this vehicle</p>
      </div>
    );
  }

  const serviceTypeColors: Record<string, string> = {
    "General Service": "bg-primary/15 text-primary",
    "Oil Change": "bg-amber-500/15 text-amber-400",
    "Brake Service": "bg-red-500/15 text-red-400",
    "Wash": "bg-blue-500/15 text-blue-400",
    "Engine Repair": "bg-orange-500/15 text-orange-400",
  };

  return (
    <div className="relative">
      {/* Timeline line */}
      <div className="absolute left-5 top-0 bottom-0 w-px bg-border/50" />

      <div className="space-y-4">
        {records.map((record, i) => {
          const expanded = expandedId === record.id;
          const colorClass = serviceTypeColors[record.service_type] || "bg-muted text-muted-foreground";

          return (
            <motion.div
              key={record.id}
              className="relative pl-12"
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              {/* Timeline dot */}
              <div className="absolute left-3.5 top-5 w-3 h-3 rounded-full bg-primary border-2 border-background z-10" />

              <div className="glass-card rounded-xl p-4">
                <button
                  className="w-full text-left flex items-start justify-between"
                  onClick={() => setExpandedId(expanded ? null : record.id)}
                >
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${colorClass}`}>
                        {record.service_type}
                      </span>
                    </div>
                    <p className="text-sm text-foreground font-medium">
                      {record.description || record.service_type}
                    </p>
                    <div className="flex items-center gap-4 mt-1.5 text-[11px] text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {format(new Date(record.service_date), "dd MMM yyyy")}
                      </span>
                      {record.service_cost && (
                        <span className="flex items-center gap-1">
                          <DollarSign className="w-3 h-3" />
                          ₹{Number(record.service_cost).toLocaleString()}
                        </span>
                      )}
                      {record.technician_name && (
                        <span>By {record.technician_name}</span>
                      )}
                    </div>
                  </div>
                  {expanded ? (
                    <ChevronUp className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                  )}
                </button>

                {expanded && (
                  <motion.div
                    className="mt-4 pt-4 border-t border-border/40 space-y-3"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    {record.parts_replaced && (
                      <div>
                        <p className="text-[11px] text-muted-foreground mb-1">Parts Replaced</p>
                        <p className="text-sm text-foreground">{record.parts_replaced}</p>
                      </div>
                    )}

                    {/* Before/After Images */}
                    {(record.before_image || record.after_image) && (
                      <div className="grid grid-cols-2 gap-3">
                        {record.before_image && (
                          <div>
                            <p className="text-[11px] text-muted-foreground mb-1.5">Before</p>
                            <img
                              src={record.before_image}
                              alt="Before service"
                              className="w-full h-32 object-cover rounded-lg border border-border/40"
                            />
                          </div>
                        )}
                        {record.after_image && (
                          <div>
                            <p className="text-[11px] text-muted-foreground mb-1.5">After</p>
                            <img
                              src={record.after_image}
                              alt="After service"
                              className="w-full h-32 object-cover rounded-lg border border-border/40"
                            />
                          </div>
                        )}
                      </div>
                    )}

                    {!record.before_image && !record.after_image && (
                      <div className="flex items-center gap-2 text-xs text-muted-foreground/50">
                        <ImageIcon className="w-3.5 h-3.5" />
                        No service images available
                      </div>
                    )}
                  </motion.div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default ServiceTimeline;
