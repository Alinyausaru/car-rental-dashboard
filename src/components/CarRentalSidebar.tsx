import { X, LayoutDashboard, Calendar, Car, Users, FileText, BarChart3, Wrench, Settings, MessageSquare, File } from "lucide-react";
import { Button } from "./ui/button";

interface CarRentalSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  currentView: string;
  onViewChange: (view: string) => void;
}

const navItems = [
  { id: "dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { id: "bookings", icon: Calendar, label: "Booking Management" },
  { id: "customers", icon: Users, label: "Customer Database" },
  { id: "fleet", icon: Car, label: "Fleet Management" },
  { id: "invoices", icon: FileText, label: "Invoices & Payments" },
  { id: "reports", icon: BarChart3, label: "Reports & Analytics" },
  { id: "maintenance", icon: Wrench, label: "Maintenance Tracking" },
  { id: "documents", icon: File, label: "Contracts & Documents" },
  { id: "communication", icon: MessageSquare, label: "Communication" },
  { id: "settings", icon: Settings, label: "Settings" },
];

export function CarRentalSidebar({ isOpen, onClose, currentView, onViewChange }: CarRentalSidebarProps) {
  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`
          fixed lg:static inset-y-0 left-0 z-50
          w-72 bg-white border-r border-gray-200
          transform transition-transform duration-200 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl flex items-center justify-center">
                <Car className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="font-semibold">RentalPro CRM</h2>
                <p className="text-xs text-gray-500">Fleet Management</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden"
              onClick={onClose}
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onViewChange(item.id);
                    onClose();
                  }}
                  className={`
                    w-full flex items-center gap-3 px-4 py-3 rounded-lg
                    transition-colors
                    ${
                      currentView === item.id
                        ? "bg-blue-50 text-blue-600"
                        : "text-gray-700 hover:bg-gray-100"
                    }
                  `}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  <span className="text-sm">{item.label}</span>
                </button>
              );
            })}
          </nav>

          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 cursor-pointer">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <span className="text-white text-sm">AD</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm truncate">Admin User</p>
                <p className="text-xs text-gray-500 truncate">admin@rentalpro.com</p>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
