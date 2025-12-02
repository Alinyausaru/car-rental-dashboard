import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Eye, Edit, Send } from "lucide-react";

const bookings = [
  {
    id: "BK-3421",
    customer: "John Smith",
    vehicle: "Toyota Corolla",
    pickup: "Nov 20, 2025",
    return: "Nov 25, 2025",
    amount: "$250",
    status: "confirmed",
  },
  {
    id: "BK-3420",
    customer: "Sarah Johnson",
    vehicle: "Honda CR-V",
    pickup: "Nov 18, 2025",
    return: "Nov 22, 2025",
    amount: "$380",
    status: "active",
  },
  {
    id: "BK-3419",
    customer: "Mike Davis",
    vehicle: "Ford Explorer",
    pickup: "Nov 21, 2025",
    return: "Nov 28, 2025",
    amount: "$560",
    status: "pending",
  },
  {
    id: "BK-3418",
    customer: "Emily Brown",
    vehicle: "Nissan Altima",
    pickup: "Nov 19, 2025",
    return: "Nov 20, 2025",
    amount: "$95",
    status: "completed",
  },
  {
    id: "BK-3417",
    customer: "Chris Wilson",
    vehicle: "BMW 3 Series",
    pickup: "Nov 22, 2025",
    return: "Nov 29, 2025",
    amount: "$875",
    status: "confirmed",
  },
];

const statusConfig = {
  confirmed: { label: "Confirmed", className: "bg-blue-100 text-blue-800" },
  active: { label: "Active", className: "bg-green-100 text-green-800" },
  pending: { label: "Pending", className: "bg-yellow-100 text-yellow-800" },
  completed: { label: "Completed", className: "bg-gray-100 text-gray-800" },
  cancelled: { label: "Cancelled", className: "bg-red-100 text-red-800" },
};

export function RecentBookings() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Recent Bookings</CardTitle>
          <Button variant="outline" size="sm">View All</Button>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Booking ID</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Vehicle</TableHead>
              <TableHead>Pickup Date</TableHead>
              <TableHead>Return Date</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {bookings.map((booking) => {
              const status = statusConfig[booking.status as keyof typeof statusConfig];
              return (
                <TableRow key={booking.id}>
                  <TableCell className="font-medium">{booking.id}</TableCell>
                  <TableCell>{booking.customer}</TableCell>
                  <TableCell>{booking.vehicle}</TableCell>
                  <TableCell>{booking.pickup}</TableCell>
                  <TableCell>{booking.return}</TableCell>
                  <TableCell>{booking.amount}</TableCell>
                  <TableCell>
                    <Badge className={status.className}>{status.label}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="sm">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Send className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
