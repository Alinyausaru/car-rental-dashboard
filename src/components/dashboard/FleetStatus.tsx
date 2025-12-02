import { Car, Wrench, AlertTriangle, CheckCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Progress } from "../ui/progress";

const fleetData = [
  {
    status: "Available",
    count: 24,
    total: 45,
    percentage: 53,
    color: "bg-green-500",
    icon: CheckCircle,
    iconColor: "text-green-600",
  },
  {
    status: "Rented",
    count: 18,
    total: 45,
    percentage: 40,
    color: "bg-blue-500",
    icon: Car,
    iconColor: "text-blue-600",
  },
  {
    status: "Maintenance",
    count: 2,
    total: 45,
    percentage: 4,
    color: "bg-orange-500",
    icon: Wrench,
    iconColor: "text-orange-600",
  },
  {
    status: "Out of Service",
    count: 1,
    total: 45,
    percentage: 2,
    color: "bg-red-500",
    icon: AlertTriangle,
    iconColor: "text-red-600",
  },
];

export function FleetStatus() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Fleet Status</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="text-center p-4 bg-gray-50 rounded-lg">
          <p className="text-4xl mb-1">45</p>
          <p className="text-sm text-gray-600">Total Vehicles</p>
        </div>

        <div className="space-y-4">
          {fleetData.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.status} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Icon className={`w-4 h-4 ${item.iconColor}`} />
                    <span className="text-sm">{item.status}</span>
                  </div>
                  <span className="text-sm">{item.count} vehicles</span>
                </div>
                <Progress value={item.percentage} className="h-2" />
              </div>
            );
          })}
        </div>

        <div className="pt-4 border-t space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Utilization Rate</span>
            <span className="font-semibold">40%</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Avg. Revenue/Vehicle</span>
            <span className="font-semibold">$1,240/mo</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
