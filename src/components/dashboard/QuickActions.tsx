import { Plus, Clock, RotateCcw, User, FileText, Send } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";

const actions = [
  { icon: Plus, label: "New Booking", color: "bg-blue-500 hover:bg-blue-600" },
  { icon: User, label: "Add Customer", color: "bg-green-500 hover:bg-green-600" },
  { icon: Clock, label: "Walk-in Booking", color: "bg-purple-500 hover:bg-purple-600" },
  { icon: RotateCcw, label: "Extend Rental", color: "bg-orange-500 hover:bg-orange-600" },
  { icon: FileText, label: "Generate Invoice", color: "bg-pink-500 hover:bg-pink-600" },
  { icon: Send, label: "Send Reminder", color: "bg-teal-500 hover:bg-teal-600" },
];

export function QuickActions() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {actions.map((action) => {
            const Icon = action.icon;
            return (
              <Button
                key={action.label}
                className={`${action.color} text-white h-auto py-4 flex-col gap-2`}
              >
                <Icon className="w-6 h-6" />
                <span className="text-sm">{action.label}</span>
              </Button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
