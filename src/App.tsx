import { useState, useEffect } from "react";
import { CarRentalDashboard } from "./components/CarRentalDashboard";
import { CustomerWebsite } from "./components/CustomerWebsite";
import { createClient } from "./utils/supabase/client";

const DEV_BYPASS_ADMIN = true;

export default function App() {
  const [mode, setMode] = useState<"customer" | "admin">("customer");
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    checkAdminStatus();
  }, []);

  const checkAdminStatus = async () => {
    if (DEV_BYPASS_ADMIN) {
      setIsAdmin(true);
      return;
    }

    try {
      const supabase = createClient();
      const { data: { session } } = await supabase.auth.getSession();

      if (session?.user?.user_metadata?.role === "admin") {
        setIsAdmin(true);
      }
    } catch (error) {
      console.error("Failed to check admin status:", error);
    }
  };

  // Toggle between customer and admin views
  if (mode === "admin") {
    return (
      <div>
        <div className="bg-gray-900 text-white px-4 py-2 flex justify-between items-center">
          <span>Admin Mode</span>
          <button
            onClick={() => setMode("customer")}
            className="px-4 py-1 bg-blue-600 rounded hover:bg-blue-700"
          >
            Switch to Customer View
          </button>
        </div>
        <CarRentalDashboard />
      </div>
    );
  }

  return (
    <div>
      {isAdmin && (
        <div className="bg-gray-900 text-white px-4 py-2 flex justify-between items-center">
          <span>Customer View</span>
          <button
            onClick={() => setMode("admin")}
            className="px-4 py-1 bg-orange-600 rounded hover:bg-orange-700"
          >
            Switch to Admin CRM
          </button>
        </div>
      )}
      <CustomerWebsite />
    </div>
  );
}