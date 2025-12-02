import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";

const dailyData = [
  { day: "Mon", revenue: 2400, bookings: 8 },
  { day: "Tue", revenue: 1800, bookings: 6 },
  { day: "Wed", revenue: 3200, bookings: 11 },
  { day: "Thu", revenue: 2847, bookings: 8 },
  { day: "Fri", revenue: 4100, bookings: 14 },
  { day: "Sat", revenue: 5200, bookings: 17 },
  { day: "Sun", revenue: 3800, bookings: 12 },
];

const monthlyData = [
  { month: "Jan", revenue: 45000, bookings: 156 },
  { month: "Feb", revenue: 38000, bookings: 142 },
  { month: "Mar", revenue: 52000, bookings: 189 },
  { month: "Apr", revenue: 48000, bookings: 167 },
  { month: "May", revenue: 61000, bookings: 203 },
  { month: "Jun", revenue: 58000, bookings: 198 },
];

export function RevenueOverview() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Revenue Overview</CardTitle>
          <div className="flex gap-4 text-sm">
            <div>
              <span className="text-gray-600">This Week: </span>
              <span className="font-semibold">$23,347</span>
            </div>
            <div>
              <span className="text-gray-600">This Month: </span>
              <span className="font-semibold">$58,420</span>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="week" className="w-full">
          <TabsList>
            <TabsTrigger value="week">This Week</TabsTrigger>
            <TabsTrigger value="month">Last 6 Months</TabsTrigger>
          </TabsList>
          
          <TabsContent value="week" className="mt-4">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={dailyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="revenue" fill="#3b82f6" name="Revenue ($)" />
                <Bar dataKey="bookings" fill="#10b981" name="Bookings" />
              </BarChart>
            </ResponsiveContainer>
          </TabsContent>
          
          <TabsContent value="month" className="mt-4">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={2} name="Revenue ($)" />
                <Line type="monotone" dataKey="bookings" stroke="#10b981" strokeWidth={2} name="Bookings" />
              </LineChart>
            </ResponsiveContainer>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
