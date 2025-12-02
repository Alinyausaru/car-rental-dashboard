import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import {
  ChevronLeft,
  ChevronRight,
  Filter,
  Plus,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

const vehicles = [
  { id: 1, name: "Toyota Corolla", plate: "ABC-123" },
  { id: 2, name: "Honda CR-V", plate: "XYZ-789" },
  { id: 3, name: "Ford Explorer", plate: "DEF-456" },
  { id: 4, name: "Nissan Altima", plate: "GHI-012" },
  { id: 5, name: "BMW 3 Series", plate: "JKL-345" },
  { id: 6, name: "Mercedes C-Class", plate: "MNO-678" },
];

const bookings = [
  {
    vehicleId: 1,
    start: 1,
    duration: 4,
    customer: "John Smith",
    status: "confirmed",
  },
  {
    vehicleId: 2,
    start: 0,
    duration: 3,
    customer: "Sarah Johnson",
    status: "active",
  },
  {
    vehicleId: 3,
    start: 2,
    duration: 6,
    customer: "Mike Davis",
    status: "confirmed",
  },
  {
    vehicleId: 4,
    start: 0,
    duration: 1,
    customer: "Emily Brown",
    status: "completed",
  },
  {
    vehicleId: 5,
    start: 3,
    duration: 7,
    customer: "Chris Wilson",
    status: "confirmed",
  },
  {
    vehicleId: 1,
    start: 6,
    duration: 3,
    customer: "Lisa Anderson",
    status: "pending",
  },
  {
    vehicleId: 6,
    start: 1,
    duration: 5,
    customer: "David Lee",
    status: "active",
  },
];

const days = [
  "Mon 18",
  "Tue 19",
  "Wed 20",
  "Thu 21",
  "Fri 22",
  "Sat 23",
  "Sun 24",
];

const statusColors = {
  confirmed: "bg-blue-500",
  active: "bg-green-500",
  pending: "bg-yellow-500",
  completed: "bg-gray-400",
  maintenance: "bg-orange-500",
};

export function BookingCalendarView() {
  const [viewMode, setViewMode] = useState("week");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1>Booking Calendar</h1>
          <p className="text-gray-600">
            Visual overview of all bookings and vehicle
            availability
          </p>
        </div>
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          New Booking
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="outline" size="sm">
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <CardTitle>November 18-24, 2025</CardTitle>
              <Button variant="outline" size="sm">
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>

            <div className="flex items-center gap-3">
              <Select defaultValue="all">
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">
                    All Bookings
                  </SelectItem>
                  <SelectItem value="confirmed">
                    Confirmed
                  </SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="pending">
                    Pending
                  </SelectItem>
                </SelectContent>
              </Select>

              <Select
                defaultValue="week"
                onValueChange={setViewMode}
              >
                <SelectTrigger className="w-[140px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="week">
                    Week View
                  </SelectItem>
                  <SelectItem value="month">
                    Month View
                  </SelectItem>
                </SelectContent>
              </Select>

              <Button
                variant="outline"
                size="sm"
                className="gap-2"
              >
                <Filter className="w-4 h-4" />
                Filters
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Calendar Grid */}
          <div className="overflow-x-auto">
            <div className="min-w-[900px]">
              {/* Header */}
              <div className="grid grid-cols-8 gap-2 mb-2">
                <div className="p-2 font-medium">Vehicle</div>
                {days.map((day) => (
                  <div
                    key={day}
                    className="p-2 text-center font-medium text-sm bg-gray-50 rounded"
                  >
                    {day}
                  </div>
                ))}
              </div>

              {/* Vehicle Rows */}
              {vehicles.map((vehicle) => (
                <div
                  key={vehicle.id}
                  className="grid grid-cols-8 gap-2 mb-2"
                >
                  <div className="p-3 border rounded-lg bg-white">
                    <p className="text-sm truncate">
                      {vehicle.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {vehicle.plate}
                    </p>
                  </div>

                  {/* Day cells */}
                  <div className="col-span-7 grid grid-cols-7 gap-2 relative">
                    {days.map((_, dayIndex) => (
                      <div
                        key={dayIndex}
                        className="border rounded bg-gray-50 h-16 hover:bg-gray-100 cursor-pointer transition-colors"
                      />
                    ))}

                    {/* Booking blocks */}
                    {bookings
                      .filter((b) => b.vehicleId === vehicle.id)
                      .map((booking, idx) => (
                        <div
                          key={idx}
                          className={`absolute ${statusColors[booking.status as keyof typeof statusColors]} text-white rounded p-2 text-xs cursor-pointer hover:shadow-lg transition-shadow`}
                          style={{
                            left: `${(booking.start / 7) * 100}%`,
                            width: `${(booking.duration / 7) * 100}%`,
                            top: "0",
                            height: "100%",
                          }}
                        >
                          <p className="truncate">
                            {booking.customer}
                          </p>
                          <p className="text-xs opacity-90">
                            {booking.duration}d
                          </p>
                        </div>
                      ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Legend */}
          <div className="flex items-center gap-6 mt-6 pt-6 border-t">
            <p className="text-sm text-gray-600">Status:</p>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded" />
              <span className="text-sm">Available</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500 rounded" />
              <span className="text-sm">Confirmed</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded" />
              <span className="text-sm">Active</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-yellow-500 rounded" />
              <span className="text-sm">Pending</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-orange-500 rounded" />
              <span className="text-sm">Maintenance</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-gray-400 rounded" />
              <span className="text-sm">Completed</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}