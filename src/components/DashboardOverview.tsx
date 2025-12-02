import { TodayStats } from "./dashboard/TodayStats";
import { QuickActions } from "./dashboard/QuickActions";
import { FleetStatus } from "./dashboard/FleetStatus";
import { UpcomingSchedule } from "./dashboard/UpcomingSchedule";
import { RevenueOverview } from "./dashboard/RevenueOverview";
import { AlertsPanel } from "./dashboard/AlertsPanel";
import { RecentBookings } from "./dashboard/RecentBookings";

export function DashboardOverview() {
  return (
    <div className="space-y-6">
      <div>
        <h1>Dashboard</h1>
        <p className="text-gray-600">Welcome back! Here's your rental business overview.</p>
      </div>

      <TodayStats />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <QuickActions />
          <RevenueOverview />
          <RecentBookings />
        </div>
        
        <div className="space-y-6">
          <FleetStatus />
          <UpcomingSchedule />
          <AlertsPanel />
        </div>
      </div>
    </div>
  );
}
