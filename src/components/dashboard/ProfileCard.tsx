import { useState } from "react";
import { motion } from "framer-motion";
import { User, Phone, MapPin, Mail, Pencil, Check, X, Camera } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const ProfileCard = () => {
  const { profile, refreshProfile, user } = useAuth();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    name: profile?.name || "",
    mobile_number: profile?.mobile_number || "",
    address: profile?.address || "",
  });
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    const { error } = await supabase
      .from("profiles")
      .update({
        name: form.name,
        mobile_number: form.mobile_number,
        address: form.address,
      })
      .eq("user_id", user.id);

    if (error) {
      toast.error("Failed to update profile");
    } else {
      toast.success("Profile updated!");
      await refreshProfile();
      setEditing(false);
    }
    setSaving(false);
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    const ext = file.name.split(".").pop();
    const path = `${user.id}/avatar.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from("profile-photos")
      .upload(path, file, { upsert: true });

    if (uploadError) {
      toast.error("Failed to upload photo");
      return;
    }

    const { data: urlData } = supabase.storage
      .from("profile-photos")
      .getPublicUrl(path);

    await supabase
      .from("profiles")
      .update({ profile_photo: urlData.publicUrl })
      .eq("user_id", user.id);

    toast.success("Photo updated!");
    await refreshProfile();
  };

  const infoItems = [
    { icon: Mail, label: "Email", value: profile?.email },
    { icon: Phone, label: "Phone", value: profile?.mobile_number || "Not set" },
    { icon: MapPin, label: "Address", value: profile?.address || "Not set" },
  ];

  const inputClass =
    "w-full bg-card/80 h-10 px-3 rounded-lg text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary border border-border/60 text-sm";

  return (
    <motion.div
      className="glass-card rounded-2xl p-6"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="flex items-start justify-between mb-5">
        <h3 className="font-display text-lg font-semibold text-foreground">My Profile</h3>
        {!editing ? (
          <button
            onClick={() => {
              setForm({
                name: profile?.name || "",
                mobile_number: profile?.mobile_number || "",
                address: profile?.address || "",
              });
              setEditing(true);
            }}
            className="text-muted-foreground hover:text-primary transition-colors"
          >
            <Pencil className="w-4 h-4" />
          </button>
        ) : (
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              disabled={saving}
              className="text-green-400 hover:text-green-300 transition-colors"
            >
              <Check className="w-4 h-4" />
            </button>
            <button
              onClick={() => setEditing(false)}
              className="text-muted-foreground hover:text-destructive transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Avatar */}
      <div className="flex items-center gap-4 mb-6">
        <div className="relative group">
          <div className="w-16 h-16 rounded-full overflow-hidden bg-primary/10 flex items-center justify-center">
            {profile?.profile_photo ? (
              <img src={profile.profile_photo} alt="" className="w-full h-full object-cover" />
            ) : (
              <User className="w-7 h-7 text-primary" />
            )}
          </div>
          <label className="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
            <Camera className="w-4 h-4 text-white" />
            <input type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} />
          </label>
        </div>
        <div>
          {editing ? (
            <input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className={inputClass}
              placeholder="Your name"
            />
          ) : (
            <>
              <p className="font-semibold text-foreground">{profile?.name || "User"}</p>
              <p className="text-xs text-muted-foreground">Customer</p>
            </>
          )}
        </div>
      </div>

      {/* Info */}
      <div className="space-y-3">
        {editing ? (
          <>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Phone</label>
              <input
                value={form.mobile_number}
                onChange={(e) => setForm({ ...form, mobile_number: e.target.value })}
                className={inputClass}
                placeholder="Phone number"
              />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Address</label>
              <input
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                className={inputClass}
                placeholder="Your address"
              />
            </div>
          </>
        ) : (
          infoItems.map(({ icon: Icon, label, value }) => (
            <div key={label} className="flex items-center gap-3 text-sm">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Icon className="w-4 h-4 text-primary" />
              </div>
              <div className="min-w-0">
                <p className="text-[11px] text-muted-foreground">{label}</p>
                <p className="text-foreground truncate">{value}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </motion.div>
  );
};

export default ProfileCard;
