import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Calendar as CalendarIcon, MapPin, Car, Wrench, Clock, IndianRupee, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

const SERVICE_ICONS: Record<string, string> = {
  "General Service": "🔧",
  "Oil Change": "🛢️",
  "Full Service": "⚙️",
  "Wash & Detailing": "🧽",
  "Brake Service": "🛑",
  "Engine Repair": "🏎️",
  "Tyre Replacement": "🔘",
  "AC Service": "❄️",
};

const TIME_SLOTS = [
  "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
  "14:00", "14:30", "15:00", "15:30", "16:00", "16:30",
];

const VEHICLE_TYPES = ["Car", "Bike", "Scooter", "Auto"];

interface ServiceItem {
  name: string;
  price_car: number;
  price_bike: number;
  category: string;
}

const BookingForm = ({ onBooked }: { onBooked?: () => void }) => {
  const { user } = useAuth();
  const [vehicleType, setVehicleType] = useState("Car");
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [date, setDate] = useState<Date>();
  const [time, setTime] = useState("");
  const [location, setLocation] = useState("");
  const [saving, setSaving] = useState(false);
  const [services, setServices] = useState<ServiceItem[]>([]);

  useEffect(() => {
    const fetchServices = async () => {
      const { data } = await supabase
        .from("services")
        .select("name, price_car, price_bike, category")
        .eq("is_active", true)
        .order("sort_order");
      if (data) setServices(data);
    };
    fetchServices();
  }, []);

  const totalPrice = selectedServices.reduce((sum, name) => {
    const svc = services.find((s) => s.name === name);
    if (!svc) return sum;
    return sum + (vehicleType === "Car" ? Number(svc.price_car) : Number(svc.price_bike));
  }, 0);

  const handleBook = async () => {
    if (!user || selectedServices.length === 0 || !date || !time) {
      toast.error("Please fill all required fields");
      return;
    }
    setSaving(true);
    const { error } = await supabase.from("bookings").insert({
      user_id: user.id,
      vehicle_type: vehicleType,
      service_type: selectedServices.join(", "),
      booking_date: format(date, "yyyy-MM-dd"),
      booking_time: time,
      pickup_location: location || null,
      estimated_price: totalPrice,
      status: "pending",
    });
    if (error) {
      toast.error("Failed to create booking");
    } else {
      toast.success("Booking created! We'll confirm shortly.");
      setSelectedServices([]);
      setDate(undefined);
      setTime("");
      setLocation("");
      onBooked?.();
    }
    setSaving(false);
  };

  return (
    <motion.div
      className="glass-card rounded-2xl p-6 sm:p-8"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h2 className="font-display text-xl font-bold text-foreground mb-6 flex items-center gap-2">
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
          <Wrench className="w-5 h-5 text-primary" />
        </div>
        Book a Service
      </h2>

      <div className="space-y-5">
        {/* Vehicle Type */}
        <div>
          <label className="text-sm font-medium text-foreground mb-2 block">Vehicle Type</label>
          <div className="grid grid-cols-4 gap-2">
            {VEHICLE_TYPES.map((vt) => (
              <button
                key={vt}
                onClick={() => setVehicleType(vt)}
                className={cn(
                  "h-11 rounded-xl border text-sm font-medium transition-all",
                  vehicleType === vt
                    ? "bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/20"
                    : "bg-card border-border text-foreground hover:border-primary/50"
                )}
              >
                {vt}
              </button>
            ))}
          </div>
        </div>

        {/* Service Type */}
        <div>
          <label className="text-sm font-medium text-foreground mb-2 block">Service Type</label>
          <div className="grid grid-cols-2 gap-2">
            {services.map((st) => {
              const isSelected = selectedServices.includes(st.name);
              return (
                <button
                  key={st.name}
                  onClick={() =>
                    setSelectedServices((prev) =>
                      isSelected ? prev.filter((n) => n !== st.name) : [...prev, st.name]
                    )
                  }
                  className={cn(
                    "p-3 rounded-xl border text-left transition-all",
                    isSelected
                      ? "bg-primary/10 border-primary/50 ring-1 ring-primary/30"
                      : "bg-card border-border hover:border-primary/30"
                  )}
                >
                  <span className="text-lg">{SERVICE_ICONS[st.name] || "🔧"}</span>
                  <p className="text-sm font-medium text-foreground mt-1">{st.name}</p>
                  <p className="text-xs text-muted-foreground">
                    from ₹{vehicleType === "Car" ? Number(st.price_car) : Number(st.price_bike)}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Date & Time */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">Date</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full h-11 justify-start text-left rounded-xl",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  disabled={(d) => d < new Date()}
                  initialFocus
                  className={cn("p-3 pointer-events-auto")}
                />
              </PopoverContent>
            </Popover>
          </div>

          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">Time Slot</label>
            <div className="grid grid-cols-3 gap-1.5">
              {TIME_SLOTS.map((t) => (
                <button
                  key={t}
                  onClick={() => setTime(t)}
                  className={cn(
                    "h-9 rounded-lg text-xs font-medium transition-all",
                    time === t
                      ? "bg-primary text-primary-foreground"
                      : "bg-card border border-border text-foreground hover:border-primary/50"
                  )}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Location */}
        <div>
          <label className="text-sm font-medium text-foreground mb-2 block">Pickup Location (optional)</label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="premium-input pl-10"
              placeholder="Enter pickup address"
            />
          </div>
        </div>

        {/* Price Estimate */}
        {totalPrice > 0 && (
          <motion.div
            className="flex items-center justify-between p-4 rounded-xl bg-primary/5 border border-primary/20"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <div className="flex items-center gap-2">
              <IndianRupee className="w-5 h-5 text-primary" />
              <span className="text-sm text-foreground">
                Estimated Price ({selectedServices.length} service{selectedServices.length > 1 ? "s" : ""})
              </span>
            </div>
            <span className="font-display text-2xl font-bold text-primary">₹{totalPrice.toLocaleString()}</span>
          </motion.div>
        )}

        {/* Submit */}
        <Button
          onClick={handleBook}
          disabled={saving || selectedServices.length === 0 || !date || !time}
          className="w-full h-12 rounded-xl text-base font-semibold shadow-lg shadow-primary/25"
        >
          {saving ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <>
              <Clock className="w-5 h-5 mr-2" />
              Confirm Booking
            </>
          )}
        </Button>
      </div>
    </motion.div>
  );
};

export default BookingForm;
