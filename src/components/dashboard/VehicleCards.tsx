import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Car, Plus, Pencil, Trash2, X, Check, Fuel, Calendar, Hash } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import type { Tables } from "@/integrations/supabase/types";

type Vehicle = Tables<"vehicles">;

const VEHICLE_TYPES = ["Bike", "Car", "Scooter", "Auto", "Other"];
const FUEL_TYPES = ["Petrol", "Diesel", "Electric", "CNG", "Hybrid"];

const emptyForm = {
  vehicle_type: "Bike",
  vehicle_number: "",
  brand: "",
  model: "",
  fuel_type: "Petrol",
  manufacturing_year: new Date().getFullYear(),
};

interface VehicleCardsProps {
  onVehicleSelect?: (vehicleId: string) => void;
  selectedVehicleId?: string | null;
}

const VehicleCards = ({ onVehicleSelect, selectedVehicleId }: VehicleCardsProps) => {
  const { user } = useAuth();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const fetchVehicles = async () => {
    if (!user) return;
    const { data } = await supabase
      .from("vehicles")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });
    setVehicles(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchVehicles();
  }, [user]);

  const handleSubmit = async () => {
    if (!user || !form.vehicle_number.trim()) {
      toast.error("Vehicle number is required");
      return;
    }
    setSaving(true);

    if (editingId) {
      const { error } = await supabase
        .from("vehicles")
        .update({
          vehicle_type: form.vehicle_type,
          vehicle_number: form.vehicle_number.toUpperCase(),
          brand: form.brand,
          model: form.model,
          fuel_type: form.fuel_type,
          manufacturing_year: form.manufacturing_year,
        })
        .eq("id", editingId);

      if (error) toast.error("Failed to update vehicle");
      else toast.success("Vehicle updated!");
    } else {
      const { error } = await supabase.from("vehicles").insert({
        user_id: user.id,
        vehicle_type: form.vehicle_type,
        vehicle_number: form.vehicle_number.toUpperCase(),
        brand: form.brand,
        model: form.model,
        fuel_type: form.fuel_type,
        manufacturing_year: form.manufacturing_year,
      });

      if (error) toast.error("Failed to add vehicle");
      else toast.success("Vehicle added!");
    }

    setSaving(false);
    setShowForm(false);
    setEditingId(null);
    setForm(emptyForm);
    fetchVehicles();
  };

  const handleEdit = (v: Vehicle) => {
    setForm({
      vehicle_type: v.vehicle_type,
      vehicle_number: v.vehicle_number,
      brand: v.brand || "",
      model: v.model || "",
      fuel_type: v.fuel_type || "Petrol",
      manufacturing_year: v.manufacturing_year || new Date().getFullYear(),
    });
    setEditingId(v.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this vehicle? All service records will also be removed.")) return;
    const { error } = await supabase.from("vehicles").delete().eq("id", id);
    if (error) toast.error("Failed to delete");
    else {
      toast.success("Vehicle removed");
      fetchVehicles();
    }
  };

  const inputClass =
    "w-full bg-card/80 h-10 px-3 rounded-lg text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary border border-border/60 text-sm";
  const selectClass = `${inputClass} appearance-none`;

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-display text-lg font-semibold text-foreground">My Vehicles</h3>
        <button
          onClick={() => {
            setForm(emptyForm);
            setEditingId(null);
            setShowForm(true);
          }}
          className="flex items-center gap-1.5 text-sm text-primary hover:text-primary/80 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add
        </button>
      </div>

      {/* Add/Edit Form */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            className="glass-card rounded-xl p-5 mb-4 space-y-3"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
          >
            <div className="flex items-center justify-between mb-2">
              <p className="font-medium text-foreground text-sm">
                {editingId ? "Edit Vehicle" : "Add New Vehicle"}
              </p>
              <button onClick={() => { setShowForm(false); setEditingId(null); }}>
                <X className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <select
                value={form.vehicle_type}
                onChange={(e) => setForm({ ...form, vehicle_type: e.target.value })}
                className={selectClass}
              >
                {VEHICLE_TYPES.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
              <input
                value={form.vehicle_number}
                onChange={(e) => setForm({ ...form, vehicle_number: e.target.value })}
                className={inputClass}
                placeholder="Vehicle Number *"
                maxLength={15}
              />
              <input
                value={form.brand}
                onChange={(e) => setForm({ ...form, brand: e.target.value })}
                className={inputClass}
                placeholder="Brand (e.g., Honda)"
              />
              <input
                value={form.model}
                onChange={(e) => setForm({ ...form, model: e.target.value })}
                className={inputClass}
                placeholder="Model (e.g., City)"
              />
              <select
                value={form.fuel_type}
                onChange={(e) => setForm({ ...form, fuel_type: e.target.value })}
                className={selectClass}
              >
                {FUEL_TYPES.map((f) => (
                  <option key={f} value={f}>{f}</option>
                ))}
              </select>
              <input
                type="number"
                value={form.manufacturing_year}
                onChange={(e) => setForm({ ...form, manufacturing_year: parseInt(e.target.value) || 2024 })}
                className={inputClass}
                placeholder="Year"
                min={1990}
                max={new Date().getFullYear() + 1}
              />
            </div>
            <button
              onClick={handleSubmit}
              disabled={saving}
              className="w-full h-10 bg-primary text-primary-foreground font-medium rounded-lg hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 text-sm disabled:opacity-50"
            >
              {saving ? (
                <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  {editingId ? "Update" : "Add Vehicle"}
                </>
              )}
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Vehicle List */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2].map((i) => (
            <div key={i} className="glass-card rounded-xl p-5 animate-pulse h-24" />
          ))}
        </div>
      ) : vehicles.length === 0 ? (
        <div className="glass-card rounded-xl p-8 text-center">
          <Car className="w-10 h-10 text-muted-foreground/40 mx-auto mb-3" />
          <p className="text-muted-foreground text-sm">No vehicles yet. Add your first vehicle!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {vehicles.map((v, i) => (
            <motion.div
              key={v.id}
              className={`glass-card-hover rounded-xl p-4 cursor-pointer transition-all ${
                selectedVehicleId === v.id ? "ring-2 ring-primary border-primary/40" : ""
              }`}
              onClick={() => onVehicleSelect?.(v.id)}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Car className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground text-sm">
                      {v.brand} {v.model}
                    </p>
                    <p className="text-xs text-muted-foreground flex items-center gap-1.5 mt-0.5">
                      <Hash className="w-3 h-3" />
                      {v.vehicle_number}
                    </p>
                  </div>
                </div>
                <div className="flex gap-1.5" onClick={(e) => e.stopPropagation()}>
                  <button
                    onClick={() => handleEdit(v)}
                    className="w-7 h-7 rounded-lg bg-card flex items-center justify-center text-muted-foreground hover:text-primary transition-colors"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(v.id)}
                    className="w-7 h-7 rounded-lg bg-card flex items-center justify-center text-muted-foreground hover:text-destructive transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
              <div className="flex gap-4 mt-3 text-[11px] text-muted-foreground">
                <span className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary/60" />
                  {v.vehicle_type}
                </span>
                <span className="flex items-center gap-1">
                  <Fuel className="w-3 h-3" />
                  {v.fuel_type || "—"}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {v.manufacturing_year || "—"}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default VehicleCards;
