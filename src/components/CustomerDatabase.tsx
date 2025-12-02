import { useState } from "react";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Plus, Search, Star, Flag, Eye, Edit, MessageSquare, FileText } from "lucide-react";

const customers = [
  {
    id: 1,
    name: "John Smith",
    email: "john.smith@email.com",
    phone: "+263 77 123 4567",
    totalBookings: 12,
    totalSpent: 3450,
    lastRental: "Nov 18, 2025",
    status: "VIP",
    tags: ["VIP", "Frequent"],
  },
  {
    id: 2,
    name: "Sarah Johnson",
    email: "sarah.j@email.com",
    phone: "+263 77 234 5678",
    totalBookings: 3,
    totalSpent: 890,
    lastRental: "Nov 10, 2025",
    status: "Active",
    tags: ["Returning"],
  },
  {
    id: 3,
    name: "Mike Davis",
    email: "mike.davis@email.com",
    phone: "+263 77 345 6789",
    totalBookings: 8,
    totalSpent: 2100,
    lastRental: "Nov 5, 2025",
    status: "Active",
    tags: ["Frequent"],
  },
  {
    id: 4,
    name: "Emily Brown",
    email: "emily.b@email.com",
    phone: "+263 77 456 7890",
    totalBookings: 1,
    totalSpent: 195,
    lastRental: "Nov 1, 2025",
    status: "New",
    tags: ["New"],
  },
  {
    id: 5,
    name: "Chris Wilson",
    email: "chris.w@email.com",
    phone: "+263 77 567 8901",
    totalBookings: 15,
    totalSpent: 5240,
    lastRental: "Nov 20, 2025",
    status: "VIP",
    tags: ["VIP", "High Value"],
  },
  {
    id: 6,
    name: "Lisa Anderson",
    email: "lisa.a@email.com",
    phone: "+263 77 678 9012",
    totalBookings: 2,
    totalSpent: 450,
    lastRental: "Oct 15, 2025",
    status: "Active",
    tags: ["Returning"],
  },
  {
    id: 7,
    name: "David Lee",
    email: "david.lee@email.com",
    phone: "+263 77 789 0123",
    totalBookings: 6,
    totalSpent: 1680,
    lastRental: "Nov 12, 2025",
    status: "Active",
    tags: ["Frequent"],
  },
  {
    id: 8,
    name: "James Wilson",
    email: "james.w@email.com",
    phone: "+263 77 890 1234",
    totalBookings: 4,
    totalSpent: 980,
    lastRental: "Sep 20, 2025",
    status: "Flagged",
    tags: ["Late Return"],
  },
];

const statusConfig = {
  VIP: { className: "bg-purple-100 text-purple-800" },
  Active: { className: "bg-green-100 text-green-800" },
  New: { className: "bg-blue-100 text-blue-800" },
  Flagged: { className: "bg-red-100 text-red-800" },
};

export function CustomerDatabase() {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1>Customer Database</h1>
          <p className="text-gray-600">Manage customer information and rental history</p>
        </div>
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          Add Customer
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Customers</p>
                <p className="text-3xl mt-1">348</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Star className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">VIP Customers</p>
                <p className="text-3xl mt-1">42</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <Star className="w-6 h-6 text-purple-600 fill-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">New This Month</p>
                <p className="text-3xl mt-1">18</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <Plus className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Flagged</p>
                <p className="text-3xl mt-1">5</p>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <Flag className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search by name, email, phone, or ID..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button variant="outline">Export to Excel</Button>
          </div>
        </CardContent>
      </Card>

      {/* Customer Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer Name</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Total Bookings</TableHead>
                <TableHead>Total Spent</TableHead>
                <TableHead>Last Rental</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Tags</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {customers.map((customer) => {
                const status = statusConfig[customer.status as keyof typeof statusConfig];
                return (
                  <TableRow key={customer.id} className="hover:bg-gray-50">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                          <span className="text-white text-sm">
                            {customer.name.split(" ").map(n => n[0]).join("")}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium">{customer.name}</p>
                          <p className="text-xs text-gray-500">{customer.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <p className="text-sm">{customer.phone}</p>
                    </TableCell>
                    <TableCell>
                      <p>{customer.totalBookings}</p>
                    </TableCell>
                    <TableCell>
                      <p>${customer.totalSpent.toLocaleString()}</p>
                    </TableCell>
                    <TableCell>
                      <p className="text-sm">{customer.lastRental}</p>
                    </TableCell>
                    <TableCell>
                      <Badge className={status.className}>{customer.status}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        {customer.tags.map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="sm" title="View Profile">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" title="Edit">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" title="Send Message">
                          <MessageSquare className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" title="New Booking">
                          <FileText className="w-4 h-4" />
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
    </div>
  );
}
