import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Plus, Calendar, AlertTriangle, CheckCircle, Clock, Wrench, FileText } from "lucide-react";

const upcomingMaintenance = [
  {
    id: 1,
    vehicle: "Toyota Corolla",
    plate: "ABC-123",
    serviceType: "Oil Change",
    scheduledDate: "Nov 25, 2025",
    daysUntil: 5,
    estimatedCost: 85,
    status: "scheduled",
    provider: "Quick Service Auto",
  },
  {
    id: 2,
    vehicle: "Honda CR-V",
    plate: "XYZ-789",
    serviceType: "Major Service",
    scheduledDate: "Nov 28, 2025",
    daysUntil: 8,
    estimatedCost: 450,
    status: "scheduled",
    provider: "Honda Service Center",
  },
  {
    id: 3,
    vehicle: "Ford Explorer",
    plate: "DEF-456",
    serviceType: "Tire Rotation",
    scheduledDate: "Nov 22, 2025",
    daysUntil: 2,
    estimatedCost: 120,
    status: "scheduled",
    provider: "Tire Masters",
  },
];

const maintenanceHistory = [
  {
    id: 1,
    vehicle: "Nissan Altima",
    plate: "GHI-012",
    serviceType: "Brake Service",
    completedDate: "Nov 18, 2025",
    cost: 380,
    mileage: 18000,
    provider: "Brake Specialists",
    nextService: "Feb 18, 2026",
  },
  {
    id: 2,
    vehicle: "BMW 3 Series",
    plate: "JKL-345",
    serviceType: "Oil Change",
    completedDate: "Nov 15, 2025",
    cost: 120,
    mileage: 5400,
    provider: "BMW Service Center",
    nextService: "Feb 15, 2026",
  },
  {
    id: 3,
    vehicle: "Mercedes C-Class",
    plate: "MNO-678",
    serviceType: "Inspection",
    completedDate: "Nov 10, 2025",
    cost: 95,
    mileage: 3200,
    provider: "Mercedes Service",
    nextService: "May 10, 2026",
  },
];

const activeServices = [
  {
    id: 1,
    vehicle: "Nissan Altima",
    plate: "GHI-012",
    serviceType: "Brake Repair",
    startDate: "Nov 20, 2025",
    expectedCompletion: "Nov 21, 2025",
    progress: 60,
    provider: "Downtown Auto Repair",
  },
];

const alerts = [
  {
    type: "overdue",
    vehicle: "Toyota Camry",
    plate: "PQR-901",
    message: "Service overdue by 15 days",
    priority: "high",
  },
  {
    type: "insurance",
    vehicle: "Honda Accord",
    plate: "STU-234",
    message: "Insurance expires in 5 days",
    priority: "high",
  },
  {
    type: "license",
    vehicle: "Ford F-150",
    plate: "VWX-567",
    message: "License renewal due in 15 days",
    priority: "medium",
  },
];

export function MaintenanceTracking() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1>Maintenance Tracking</h1>
          <p className="text-gray-600">Schedule and track vehicle maintenance and services</p>
        </div>
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          Schedule Maintenance
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-gray-600 text-sm">Upcoming Services</p>
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <Calendar className="w-5 h-5 text-blue-600" />
              </div>
            </div>
            <p className="text-3xl">3</p>
            <p className="text-xs text-gray-500 mt-1">Next 7 days</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-gray-600 text-sm">In Progress</p>
              <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                <Wrench className="w-5 h-5 text-orange-600" />
              </div>
            </div>
            <p className="text-3xl">1</p>
            <p className="text-xs text-gray-500 mt-1">Currently servicing</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-gray-600 text-sm">Overdue</p>
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-red-600" />
              </div>
            </div>
            <p className="text-3xl">1</p>
            <p className="text-xs text-gray-500 mt-1">Requires attention</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-gray-600 text-sm">This Month Cost</p>
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <FileText className="w-5 h-5 text-green-600" />
              </div>
            </div>
            <p className="text-3xl">$1,245</p>
            <p className="text-xs text-gray-500 mt-1">8 services</p>
          </CardContent>
        </Card>
      </div>

      {/* Alerts Panel */}
      <Card className="border-red-200 bg-red-50">
        <CardHeader>
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-red-600" />
            <CardTitle className="text-red-900">Maintenance Alerts</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {alerts.map((alert, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-white rounded-lg">
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${alert.priority === 'high' ? 'bg-red-500' : 'bg-orange-500'}`} />
                  <div>
                    <p className="text-sm font-medium">{alert.vehicle} ({alert.plate})</p>
                    <p className="text-xs text-gray-600">{alert.message}</p>
                  </div>
                </div>
                <Button size="sm" variant="outline">Take Action</Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="upcoming" className="w-full">
        <TabsList>
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="active">In Progress</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming">
          <Card>
            <CardHeader>
              <CardTitle>Scheduled Maintenance</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Vehicle</TableHead>
                    <TableHead>Service Type</TableHead>
                    <TableHead>Scheduled Date</TableHead>
                    <TableHead>Days Until</TableHead>
                    <TableHead>Est. Cost</TableHead>
                    <TableHead>Service Provider</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {upcomingMaintenance.map((service) => (
                    <TableRow key={service.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{service.vehicle}</p>
                          <p className="text-xs text-gray-500">{service.plate}</p>
                        </div>
                      </TableCell>
                      <TableCell>{service.serviceType}</TableCell>
                      <TableCell>{service.scheduledDate}</TableCell>
                      <TableCell>
                        <Badge variant={service.daysUntil <= 3 ? "destructive" : "secondary"}>
                          {service.daysUntil} days
                        </Badge>
                      </TableCell>
                      <TableCell>${service.estimatedCost}</TableCell>
                      <TableCell>{service.provider}</TableCell>
                      <TableCell>
                        <Badge className="bg-blue-100 text-blue-800">
                          <Clock className="w-3 h-3 mr-1" />
                          Scheduled
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button variant="outline" size="sm">Edit</Button>
                          <Button variant="outline" size="sm">Cancel</Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="active">
          <Card>
            <CardHeader>
              <CardTitle>Active Services</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {activeServices.map((service) => (
                  <div key={service.id} className="p-4 border rounded-lg">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="font-medium">{service.vehicle} ({service.plate})</h3>
                        <p className="text-sm text-gray-600">{service.serviceType}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          Provider: {service.provider}
                        </p>
                      </div>
                      <Badge className="bg-orange-100 text-orange-800">
                        <Wrench className="w-3 h-3 mr-1" />
                        In Progress
                      </Badge>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Progress</span>
                        <span className="font-medium">{service.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-orange-500 h-2 rounded-full transition-all"
                          style={{ width: `${service.progress}%` }}
                        />
                      </div>
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>Started: {service.startDate}</span>
                        <span>Expected: {service.expectedCompletion}</span>
                      </div>
                    </div>

                    <div className="flex gap-2 mt-4">
                      <Button size="sm" variant="outline">Update Status</Button>
                      <Button size="sm">Mark Complete</Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>Maintenance History</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Vehicle</TableHead>
                    <TableHead>Service Type</TableHead>
                    <TableHead>Completed Date</TableHead>
                    <TableHead>Mileage</TableHead>
                    <TableHead>Cost</TableHead>
                    <TableHead>Service Provider</TableHead>
                    <TableHead>Next Service</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {maintenanceHistory.map((service) => (
                    <TableRow key={service.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{service.vehicle}</p>
                          <p className="text-xs text-gray-500">{service.plate}</p>
                        </div>
                      </TableCell>
                      <TableCell>{service.serviceType}</TableCell>
                      <TableCell>{service.completedDate}</TableCell>
                      <TableCell>{service.mileage.toLocaleString()} km</TableCell>
                      <TableCell>${service.cost}</TableCell>
                      <TableCell>{service.provider}</TableCell>
                      <TableCell>
                        <span className="text-sm text-gray-600">{service.nextService}</span>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button variant="ghost" size="sm" title="View Details">
                            <FileText className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm" title="Schedule Next">
                            <Calendar className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
