import { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import DashboardStats from "@/components/dashboard/DashboardStats";
import ProfileCard from "@/components/dashboard/ProfileCard";
import VehicleCards from "@/components/dashboard/VehicleCards";
import ServiceTimeline from "@/components/dashboard/ServiceTimeline";
import LoyaltyDisplay from "@/components/dashboard/LoyaltyDisplay";
import BookingForm from "@/components/dashboard/BookingForm";
import MyBookings from "@/components/dashboard/MyBookings";
import PaymentsSection from "@/components/dashboard/PaymentsSection";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
import { CalendarPlus, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const OverviewPage = () => {
  const { profile, user } = useAuth();
  const [selectedVehicle, setSelectedVehicle] = useState<string | null>(null);
  const [upcomingCount, setUpcomingCount] = useState(0);
  const [completedCount, setCompletedCount] = useState(0);

  useEffect(() => {
    if (!user) return;
    Promise.all([
      supabase.from("bookings").select("id", { count: "exact", head: true }).eq("user_id", user.id).in("status", ["pending", "confirmed", "in_progress"]),
      supabase.from("bookings").select("id", { count: "exact", head: true }).eq("user_id", user.id).eq("status", "completed"),
    ]).then(([upcoming, completed]) => {
      setUpcomingCount(upcoming.count || 0);
      setCompletedCount(completed.count || 0);
    });
  }, [user]);

  return (
    <div className="space-y-8">
      <motion.div className="flex items-start justify-between" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-foreground">
            Welcome, {profile?.name?.split(" ")[0] || "there"}! 👋
          </h1>
          <p className="text-muted-foreground text-sm mt-1">Here's your account overview.</p>
        </div>
        <Link
          to="/dashboard/book"
          className="hidden sm:flex items-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-xl font-medium text-sm hover:bg-primary/90 transition-colors shadow-lg shadow-primary/25"
        >
          <CalendarPlus className="w-4 h-4" />
          Book Service
          <ArrowRight className="w-4 h-4" />
        </Link>
      </motion.div>

      <DashboardStats />

      {/* Quick stats cards */}
      <div className="grid grid-cols-2 gap-4">
        <motion.div className="glass-card p-5 rounded-xl" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <p className="text-xs text-muted-foreground">Upcoming Bookings</p>
          <p className="font-display text-3xl font-bold text-foreground mt-1">{upcomingCount}</p>
        </motion.div>
        <motion.div className="glass-card p-5 rounded-xl" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
          <p className="text-xs text-muted-foreground">Completed Services</p>
          <p className="font-display text-3xl font-bold text-foreground mt-1">{completedCount}</p>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="space-y-6">
          <ProfileCard />
          <VehicleCards onVehicleSelect={setSelectedVehicle} selectedVehicleId={selectedVehicle} />
        </div>
        <div>
          <h3 className="font-display text-lg font-semibold text-foreground mb-4">Service History</h3>
          <ServiceTimeline vehicleId={selectedVehicle} />
        </div>
        <div>
          <h3 className="font-display text-lg font-semibold text-foreground mb-4">Loyalty Rewards</h3>
          <LoyaltyDisplay vehicleId={selectedVehicle} />
        </div>
      </div>
    </div>
  );
};

const BookServicePage = () => {
  const [refreshKey, setRefreshKey] = useState(0);
  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="font-display text-2xl font-bold text-foreground mb-6">Book a Service</h1>
      <BookingForm onBooked={() => setRefreshKey((k) => k + 1)} />
    </div>
  );
};

const BookingsPage = () => {
  return (
    <div className="max-w-3xl">
      <h1 className="font-display text-2xl font-bold text-foreground mb-2">My Bookings</h1>
      <p className="text-muted-foreground text-sm mb-6">Track and manage all your service bookings.</p>
      <MyBookings />
    </div>
  );
};

const VehiclesPage = () => {
  const [selectedVehicle, setSelectedVehicle] = useState<string | null>(null);
  return (
    <div className="max-w-2xl">
      <h1 className="font-display text-2xl font-bold text-foreground mb-6">My Vehicles</h1>
      <VehicleCards onVehicleSelect={setSelectedVehicle} selectedVehicleId={selectedVehicle} />
    </div>
  );
};

const ServicesPage = () => {
  const [selectedVehicle, setSelectedVehicle] = useState<string | null>(null);
  return (
    <div className="max-w-3xl">
      <h1 className="font-display text-2xl font-bold text-foreground mb-2">Service History</h1>
      <p className="text-muted-foreground text-sm mb-6">Select a vehicle to view its service records.</p>
      <div className="mb-6">
        <VehicleCards onVehicleSelect={setSelectedVehicle} selectedVehicleId={selectedVehicle} />
      </div>
      <ServiceTimeline vehicleId={selectedVehicle} />
    </div>
  );
};

const LoyaltyPage = () => {
  const [selectedVehicle, setSelectedVehicle] = useState<string | null>(null);
  return (
    <div className="max-w-2xl">
      <h1 className="font-display text-2xl font-bold text-foreground mb-2">Loyalty Rewards</h1>
      <p className="text-muted-foreground text-sm mb-6">Select a vehicle to view loyalty progress.</p>
      <div className="mb-6">
        <VehicleCards onVehicleSelect={setSelectedVehicle} selectedVehicleId={selectedVehicle} />
      </div>
      <LoyaltyDisplay vehicleId={selectedVehicle} />
    </div>
  );
};

const PaymentsPage = () => (
  <div className="max-w-2xl">
    <h1 className="font-display text-2xl font-bold text-foreground mb-2">Payments</h1>
    <p className="text-muted-foreground text-sm mb-6">Your payment history and billing overview.</p>
    <PaymentsSection />
  </div>
);

const ProfilePage = () => (
  <div className="max-w-lg">
    <h1 className="font-display text-2xl font-bold text-foreground mb-6">My Profile</h1>
    <ProfileCard />
  </div>
);

const PlaceholderPage = ({ title }: { title: string }) => (
  <div className="glass-card rounded-2xl p-12 text-center">
    <p className="text-muted-foreground">{title} — coming soon</p>
  </div>
);

const Dashboard = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <DashboardSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <header className="h-14 flex items-center border-b border-border/30 px-4 sticky top-0 z-40 bg-background/80 backdrop-blur-sm">
            <SidebarTrigger className="mr-3" />
            <span className="text-sm text-muted-foreground">Customer Dashboard</span>
          </header>
          <main className="flex-1 p-4 sm:p-6 lg:p-8">
            <Routes>
              <Route index element={<OverviewPage />} />
              <Route path="book" element={<BookServicePage />} />
              <Route path="bookings" element={<BookingsPage />} />
              <Route path="vehicles" element={<VehiclesPage />} />
              <Route path="services" element={<ServicesPage />} />
              <Route path="loyalty" element={<LoyaltyPage />} />
              <Route path="payments" element={<PaymentsPage />} />
              <Route path="invoices" element={<PlaceholderPage title="Invoices" />} />
              <Route path="reminders" element={<PlaceholderPage title="Service Reminders" />} />
              <Route path="profile" element={<ProfilePage />} />
            </Routes>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Dashboard;
