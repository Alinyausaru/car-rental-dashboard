import { Calendar, CarFront, DollarSign, Users, TrendingUp, AlertCircle } from "lucide-react";
import { Card, CardContent } from "../ui/card";

const stats = [
  {
    title: "Today's Bookings",
    value: "12",
    subtitle: "3 pickups, 4 returns",
    icon: Calendar,
    color: "bg-blue-500",
    trend: "+8% from yesterday",
    trendUp: true,
  },
  {
    title: "Available Vehicles",
    value: "24",
    subtitle: "Out of 45 total",
    icon: CarFront,
    color: "bg-green-500",
    trend: "53% utilization",
    trendUp: true,
  },
  {
    title: "Today's Revenue",
    value: "$2,847",
    subtitle: "From 8 rentals",
    icon: DollarSign,
    color: "bg-purple-500",
    trend: "+15% from yesterday",
    trendUp: true,
  },
  {
    title: "Active Customers",
    value: "21",
    subtitle: "Currently renting",
    icon: Users,
    color: "bg-orange-500",
    trend: "3 new this week",
    trendUp: true,
  },
];

export function TodayStats() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
      {stats.map((stat) => {
        const Icon = stat.icon;
        
        return (
          <Card key={stat.title} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className={`${stat.color} p-3 rounded-xl`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-gray-600 text-sm">{stat.title}</p>
                <p className="text-3xl">{stat.value}</p>
                <p className="text-xs text-gray-500">{stat.subtitle}</p>
                <p className={`text-xs flex items-center gap-1 mt-2 ${stat.trendUp ? "text-green-600" : "text-red-600"}`}>
                  <TrendingUp className="w-3 h-3" />
                  {stat.trend}
                </p>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
