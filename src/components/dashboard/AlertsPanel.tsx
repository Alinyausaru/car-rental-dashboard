import { AlertTriangle, AlertCircle, Info } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";

const alerts = [
  {
    type: "urgent",
    icon: AlertTriangle,
    title: "Insurance Expiring",
    message: "Honda Accord insurance expires in 5 days",
    color: "text-red-600",
    bgColor: "bg-red-50",
  },
  {
    type: "warning",
    icon: AlertCircle,
    title: "Maintenance Due",
    message: "Toyota Camry service due in 2 days",
    color: "text-orange-600",
    bgColor: "bg-orange-50",
  },
  {
    type: "warning",
    icon: AlertCircle,
    title: "Payment Overdue",
    message: "$450 payment overdue from James Wilson",
    color: "text-orange-600",
    bgColor: "bg-orange-50",
  },
  {
    type: "info",
    icon: Info,
    title: "License Renewal",
    message: "Ford F-150 license renewal due in 15 days",
    color: "text-blue-600",
    bgColor: "bg-blue-50",
  },
  {
    type: "urgent",
    icon: AlertTriangle,
    title: "Late Return",
    message: "BMW 3 Series should have been returned 2 hours ago",
    color: "text-red-600",
    bgColor: "bg-red-50",
  },
];

export function AlertsPanel() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Alerts & Notifications</CardTitle>
        <Badge variant="destructive">5</Badge>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 max-h-[400px] overflow-y-auto">
          {alerts.map((alert, index) => {
            const Icon = alert.icon;
            return (
              <div
                key={index}
                className={`p-3 rounded-lg ${alert.bgColor} hover:shadow-sm transition-shadow cursor-pointer`}
              >
                <div className="flex gap-3">
                  <Icon className={`w-5 h-5 flex-shrink-0 ${alert.color}`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm mb-1">{alert.title}</p>
                    <p className="text-xs text-gray-600">{alert.message}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
