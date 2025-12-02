import { useState } from "react";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Plus, Search, Grid3x3, List, MapPin, Calendar, DollarSign, Fuel, Users } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

const vehicles = [
  {
    id: 1,
    make: "Toyota",
    model: "Corolla",
    year: 2023,
    plate: "ABC-123",
    status: "available",
    type: "Sedan",
    transmission: "Automatic",
    seats: 5,
    fuel: "Petrol",
    dailyRate: 45,
    mileage: 12500,
    nextService: "Dec 15, 2025",
    location: "Main Office",
  },
  {
    id: 2,
    make: "Honda",
    model: "CR-V",
    year: 2024,
    plate: "XYZ-789",
    status: "rented",
    type: "SUV",
    transmission: "Automatic",
    seats: 5,
    fuel: "Petrol",
    dailyRate: 75,
    mileage: 8200,
    rentedTo: "Sarah Johnson",
    returnDate: "Nov 22, 2025",
    location: "With Customer",
  },
  {
    id: 3,
    make: "Ford",
    model: "Explorer",
    year: 2023,
    plate: "DEF-456",
    status: "available",
    type: "SUV",
    transmission: "Automatic",
    seats: 7,
    fuel: "Petrol",
    dailyRate: 85,
    mileage: 15000,
    nextService: "Nov 25, 2025",
    location: "Airport Branch",
  },
  {
    id: 4,
    make: "BMW",
    model: "3 Series",
    year: 2024,
    plate: "JKL-345",
    status: "rented",
    type: "Luxury",
    transmission: "Automatic",
    seats: 5,
    fuel: "Petrol",
    dailyRate: 125,
    mileage: 5400,
    rentedTo: "Chris Wilson",
    returnDate: "Nov 29, 2025",
    location: "With Customer",
  },
  {
    id: 5,
    make: "Nissan",
    model: "Altima",
    year: 2023,
    plate: "GHI-012",
    status: "maintenance",
    type: "Sedan",
    transmission: "Automatic",
    seats: 5,
    fuel: "Petrol",
    dailyRate: 50,
    mileage: 18000,
    nextService: "In Progress",
    location: "Service Center",
  },
  {
    id: 6,
    make: "Mercedes",
    model: "C-Class",
    year: 2024,
    plate: "MNO-678",
    status: "available",
    type: "Luxury",
    transmission: "Automatic",
    seats: 5,
    fuel: "Petrol",
    dailyRate: 135,
    mileage: 3200,
    nextService: "Jan 10, 2026",
    location: "Main Office",
  },
];

const statusConfig = {
  available: { label: "Available", className: "bg-green-100 text-green-800" },
  rented: { label: "Rented", className: "bg-blue-100 text-blue-800" },
  maintenance: { label: "Maintenance", className: "bg-orange-100 text-orange-800" },
  outofservice: { label: "Out of Service", className: "bg-red-100 text-red-800" },
};

export function FleetManagement() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1>Fleet Management</h1>
          <p className="text-gray-600">Manage your vehicle inventory and track vehicle status</p>
        </div>
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          Add Vehicle
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input placeholder="Search by make, model, or plate number..." className="pl-10" />
            </div>
            
            <Select defaultValue="all">
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="available">Available</SelectItem>
                <SelectItem value="rented">Rented</SelectItem>
                <SelectItem value="maintenance">Maintenance</SelectItem>
              </SelectContent>
            </Select>

            <Select defaultValue="all-types">
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Vehicle Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all-types">All Types</SelectItem>
                <SelectItem value="sedan">Sedan</SelectItem>
                <SelectItem value="suv">SUV</SelectItem>
                <SelectItem value="luxury">Luxury</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex gap-2">
              <Button
                variant={viewMode === "grid" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("grid")}
              >
                <Grid3x3 className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("list")}
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Vehicle Grid */}
      {viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {vehicles.map((vehicle) => {
            const status = statusConfig[vehicle.status as keyof typeof statusConfig];
            return (
              <Card key={vehicle.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-0">
                  <div className="aspect-video bg-gradient-to-br from-gray-200 to-gray-300 rounded-t-lg flex items-center justify-center">
                    <ImageWithFallback
                      src={`https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=400&q=80`}
                      alt={`${vehicle.make} ${vehicle.model}`}
                      className="w-full h-full object-cover rounded-t-lg"
                    />
                  </div>
                  
                  <div className="p-4 space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-lg">{vehicle.make} {vehicle.model}</h3>
                        <p className="text-sm text-gray-500">{vehicle.year} • {vehicle.plate}</p>
                      </div>
                      <Badge className={status.className}>{status.label}</Badge>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Users className="w-4 h-4" />
                        <span>{vehicle.seats} seats</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <Fuel className="w-4 h-4" />
                        <span>{vehicle.fuel}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <MapPin className="w-4 h-4" />
                        <span className="truncate">{vehicle.location}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <DollarSign className="w-4 h-4" />
                        <span>${vehicle.dailyRate}/day</span>
                      </div>
                    </div>

                    {vehicle.status === "rented" && (
                      <div className="pt-3 border-t">
                        <p className="text-xs text-gray-600">Rented to: <span className="font-medium">{vehicle.rentedTo}</span></p>
                        <p className="text-xs text-gray-600">Return: <span className="font-medium">{vehicle.returnDate}</span></p>
                      </div>
                    )}

                    {vehicle.status === "available" && (
                      <div className="pt-3 border-t">
                        <p className="text-xs text-gray-600 flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          Next service: <span className="font-medium">{vehicle.nextService}</span>
                        </p>
                      </div>
                    )}

                    <Button className="w-full" variant="outline">View Details</Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card>
          <CardContent className="p-0">
            <div className="divide-y">
              {vehicles.map((vehicle) => {
                const status = statusConfig[vehicle.status as keyof typeof statusConfig];
                return (
                  <div key={vehicle.id} className="p-4 hover:bg-gray-50 cursor-pointer">
                    <div className="flex items-center gap-4">
                      <div className="w-24 h-16 bg-gradient-to-br from-gray-200 to-gray-300 rounded flex-shrink-0">
                        <ImageWithFallback
                          src={`https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=200&q=80`}
                          alt={`${vehicle.make} ${vehicle.model}`}
                          className="w-full h-full object-cover rounded"
                        />
                      </div>
                      
                      <div className="flex-1 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                        <div>
                          <p className="text-sm">{vehicle.make} {vehicle.model}</p>
                          <p className="text-xs text-gray-500">{vehicle.plate}</p>
                        </div>
                        <div>
                          <Badge className={status.className}>{status.label}</Badge>
                        </div>
                        <div className="text-sm">
                          <p className="text-gray-600">${vehicle.dailyRate}/day</p>
                        </div>
                        <div className="text-sm">
                          <p className="text-gray-600">{vehicle.mileage} km</p>
                        </div>
                        <div className="text-sm">
                          <p className="text-gray-600">{vehicle.location}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm">View</Button>
                          <Button variant="outline" size="sm">Edit</Button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
