import { useState, useEffect } from "react";
import { Toaster } from "sonner@2.0.3";
import { createClient } from "../utils/supabase/client";
import { vehiclesApi } from "../utils/api";
import { ensureDemoData } from "../utils/seed-demo-data";
import type { Vehicle } from "../types";

// Import components
import { CustomerHeader } from "./customer/CustomerHeader";
import { CustomerFooter } from "./customer/CustomerFooter";
import { HomePage } from "./customer/HomePage";
import { BrowseCars } from "./customer/BrowseCars";
import { VehicleDetails } from "./customer/VehicleDetails";
import { BookingFlow } from "./customer/BookingFlow";
import { LoginPage, SignupPage } from "./customer/AuthPages";
import { CustomerDashboard, MyBookings, MyProfile, Favorites } from "./customer/CustomerAccount";
import { AboutPage, ContactPage, FAQPage, TermsPage, PrivacyPage } from "./customer/StaticPages";

type PageType =
  | "home"
  | "cars"
  | "vehicle-details"
  | "booking"
  | "login"
  | "signup"
  | "account"
  | "bookings"
  | "booking-details"
  | "profile"
  | "favorites"
  | "about"
  | "contact"
  | "faq"
  | "terms"
  | "privacy"
  | "admin";

export function CustomerWebsite() {
  const [currentPage, setCurrentPage] = useState<PageType>("home");
  const [pageParams, setPageParams] = useState<any>({});
  const [user, setUser] = useState<any>(null);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    initializeApp();
  }, []);

  useEffect(() => {
    // Load selected vehicle when navigating to vehicle-details or booking
    if ((currentPage === "vehicle-details" || currentPage === "booking") && pageParams.id) {
      const vehicle = vehicles.find((v) => v.id === pageParams.id || v.id === pageParams.vehicleId);
      setSelectedVehicle(vehicle || null);
    }
  }, [currentPage, pageParams, vehicles]);

  const initializeApp = async () => {
    await checkUser();
    await ensureDemoData(); // Seed demo data if needed
    await loadVehicles();
  };

  const checkUser = async () => {
    try {
      const supabase = createClient();
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user || null);
    } catch (error) {
      console.error("Failed to check user:", error);
    }
  };

  const loadVehicles = async () => {
    try {
      const response = await vehiclesApi.getAll();
      if (response.success) {
        setVehicles(response.data);
      }
    } catch (error) {
      console.error("Failed to load vehicles:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleNavigate = (page: PageType, params?: any) => {
    setCurrentPage(page);
    setPageParams(params || {});
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    setUser(null);
    handleNavigate("home");
  };

  const handleLoginSuccess = (user: any) => {
    setUser(user);
  };

  const handleBookVehicle = (vehicleId: string) => {
    const vehicle = vehicles.find((v) => v.id === vehicleId);
    if (vehicle) {
      setSelectedVehicle(vehicle);
      handleNavigate("booking", { vehicleId });
    }
  };

  // Render the appropriate page
  const renderPage = () => {
    switch (currentPage) {
      case "home":
        return <HomePage onNavigate={handleNavigate} featuredVehicles={vehicles} />;

      case "cars":
        return <BrowseCars vehicles={vehicles} onNavigate={handleNavigate} />;

      case "vehicle-details":
        return selectedVehicle ? (
          <VehicleDetails
            vehicle={selectedVehicle}
            onNavigate={handleNavigate}
            onBook={handleBookVehicle}
          />
        ) : (
          <div className="min-h-screen flex items-center justify-center">
            <p>Vehicle not found</p>
          </div>
        );

      case "booking":
        return selectedVehicle ? (
          <BookingFlow
            vehicle={selectedVehicle}
            onNavigate={handleNavigate}
            user={user}
          />
        ) : (
          <div className="min-h-screen flex items-center justify-center">
            <p>Vehicle not found</p>
          </div>
        );

      case "login":
        return <LoginPage onNavigate={handleNavigate} onLoginSuccess={handleLoginSuccess} />;

      case "signup":
        return <SignupPage onNavigate={handleNavigate} onSignupSuccess={handleLoginSuccess} />;

      case "account":
        return user ? (
          <CustomerDashboard user={user} onNavigate={handleNavigate} />
        ) : (
          <LoginPage onNavigate={handleNavigate} onLoginSuccess={handleLoginSuccess} />
        );

      case "bookings":
        return user ? (
          <MyBookings user={user} onNavigate={handleNavigate} />
        ) : (
          <LoginPage onNavigate={handleNavigate} onLoginSuccess={handleLoginSuccess} />
        );

      case "profile":
        return user ? (
          <MyProfile user={user} onNavigate={handleNavigate} />
        ) : (
          <LoginPage onNavigate={handleNavigate} onLoginSuccess={handleLoginSuccess} />
        );

      case "favorites":
        return user ? (
          <Favorites onNavigate={handleNavigate} />
        ) : (
          <LoginPage onNavigate={handleNavigate} onLoginSuccess={handleLoginSuccess} />
        );

      case "about":
        return <AboutPage onNavigate={handleNavigate} />;

      case "contact":
        return <ContactPage onNavigate={handleNavigate} />;

      case "faq":
        return <FAQPage onNavigate={handleNavigate} />;

      case "terms":
        return <TermsPage onNavigate={handleNavigate} />;

      case "privacy":
        return <PrivacyPage onNavigate={handleNavigate} />;

      case "admin":
        // Redirect to admin CRM (will be handled by parent component)
        return (
          <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
            <h1 className="text-4xl mb-4">Admin Access</h1>
            <p className="text-gray-600 mb-8">Redirecting to admin dashboard...</p>
          </div>
        );

      default:
        return <HomePage onNavigate={handleNavigate} featuredVehicles={vehicles} />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <CustomerHeader
        currentPage={currentPage}
        onNavigate={handleNavigate}
        user={user}
        onLogout={handleLogout}
      />
      
      <main className="flex-1">
        {renderPage()}
      </main>

      <CustomerFooter onNavigate={handleNavigate} />
      
      <Toaster position="top-right" />
    </div>
  );
}