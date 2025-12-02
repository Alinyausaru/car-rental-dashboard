import { useState } from "react";
import { CarRentalSidebar } from "./CarRentalSidebar";
import { CarRentalHeader } from "./CarRentalHeader";
import { DashboardOverview } from "./DashboardOverview";
import { BookingCalendarView } from "./BookingCalendarView";
import { FleetManagement } from "./FleetManagement";
import { CustomerDatabase } from "./CustomerDatabase";
import { InvoicesPayments } from "./InvoicesPayments";
import { ReportsAnalytics } from "./ReportsAnalytics";
import { MaintenanceTracking } from "./MaintenanceTracking";
import { ContractsDocuments } from "./ContractsDocuments";
import { Communication } from "./Communication";
import { Settings } from "./Settings";

type ViewType = "dashboard" | "bookings" | "fleet" | "customers" | "invoices" | "reports" | "maintenance" | "documents" | "communication" | "settings";

export function CarRentalDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentView, setCurrentView] = useState<ViewType>("dashboard");

  const renderView = () => {
    switch (currentView) {
      case "dashboard":
        return <DashboardOverview />;
      case "bookings":
        return <BookingCalendarView />;
      case "fleet":
        return <FleetManagement />;
      case "customers":
        return <CustomerDatabase />;
      case "invoices":
        return <InvoicesPayments />;
      case "reports":
        return <ReportsAnalytics />;
      case "maintenance":
        return <MaintenanceTracking />;
      case "documents":
        return <ContractsDocuments />;
      case "communication":
        return <Communication />;
      case "settings":
        return <Settings />;
      default:
        return <DashboardOverview />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <CarRentalSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        currentView={currentView}
        onViewChange={setCurrentView}
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        <CarRentalHeader onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
        
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-[1600px] mx-auto">
            {renderView()}
          </div>
        </main>
      </div>
    </div>
  );
}