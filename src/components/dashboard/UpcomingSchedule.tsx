import { Calendar, Clock, MapPin } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";

const schedule = [
  {
    type: "pickup",
    customer: "John Smith",
    vehicle: "Toyota Corolla",
    time: "09:00 AM",
    location: "Main Office",
  },
  {
    type: "return",
    customer: "Sarah Johnson",
    vehicle: "Honda CR-V",
    time: "11:30 AM",
    location: "Airport Branch",
  },
  {
    type: "pickup",
    customer: "Mike Davis",
    vehicle: "Ford Explorer",
    time: "02:00 PM",
    location: "Main Office",
  },
  {
    type: "return",
    customer: "Emily Brown",
    vehicle: "Nissan Altima",
    time: "04:30 PM",
    location: "Main Office",
  },
];

export function UpcomingSchedule() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Today's Schedule</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {schedule.map((item, index) => (
            <div key={index} className="flex gap-3 pb-4 border-b last:border-0 last:pb-0">
              <div className="flex flex-col items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  item.type === "pickup" ? "bg-green-100" : "bg-blue-100"
                }`}>
                  <Calendar className={`w-5 h-5 ${
                    item.type === "pickup" ? "text-green-600" : "text-blue-600"
                  }`} />
                </div>
                {index < schedule.length - 1 && (
                  <div className="w-px h-8 bg-gray-200 my-1" />
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <Badge variant={item.type === "pickup" ? "default" : "secondary"} className="text-xs">
                    {item.type === "pickup" ? "Pickup" : "Return"}
                  </Badge>
                  <span className="text-xs text-gray-500 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {item.time}
                  </span>
                </div>
                <p className="text-sm truncate">{item.customer}</p>
                <p className="text-xs text-gray-500 truncate">{item.vehicle}</p>
                <p className="text-xs text-gray-400 flex items-center gap-1 mt-1">
                  <MapPin className="w-3 h-3" />
                  {item.location}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
