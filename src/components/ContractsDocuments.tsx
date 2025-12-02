import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Plus, Search, FileText, Download, Eye, Upload, File, Shield, Car, User } from "lucide-react";

const contracts = [
  {
    id: "CNT-3421",
    type: "Rental Agreement",
    customer: "John Smith",
    vehicle: "Toyota Corolla",
    date: "Nov 15, 2025",
    status: "signed",
    bookingId: "BK-3421",
  },
  {
    id: "CNT-3420",
    type: "Rental Agreement",
    customer: "Sarah Johnson",
    vehicle: "Honda CR-V",
    date: "Nov 14, 2025",
    status: "signed",
    bookingId: "BK-3420",
  },
  {
    id: "CNT-3419",
    type: "Rental Agreement",
    customer: "Mike Davis",
    vehicle: "Ford Explorer",
    date: "Nov 16, 2025",
    status: "pending",
    bookingId: "BK-3419",
  },
];

const vehicleDocuments = [
  {
    vehicle: "Toyota Corolla",
    plate: "ABC-123",
    documents: {
      registration: { status: "valid", expiry: "Jan 15, 2026" },
      insurance: { status: "valid", expiry: "Dec 10, 2025" },
      license: { status: "valid", expiry: "Mar 20, 2026" },
      inspection: { status: "valid", expiry: "Apr 5, 2026" },
    },
  },
  {
    vehicle: "Honda CR-V",
    plate: "XYZ-789",
    documents: {
      registration: { status: "valid", expiry: "Feb 8, 2026" },
      insurance: { status: "expiring", expiry: "Nov 25, 2025" },
      license: { status: "valid", expiry: "Jan 30, 2026" },
      inspection: { status: "valid", expiry: "Mar 15, 2026" },
    },
  },
  {
    vehicle: "Ford Explorer",
    plate: "DEF-456",
    documents: {
      registration: { status: "valid", expiry: "Dec 20, 2025" },
      insurance: { status: "valid", expiry: "Jan 5, 2026" },
      license: { status: "expired", expiry: "Nov 10, 2025" },
      inspection: { status: "valid", expiry: "Feb 22, 2026" },
    },
  },
];

const customerDocuments = [
  {
    customer: "John Smith",
    documents: {
      idPassport: true,
      driversLicense: true,
      proofOfAddress: true,
    },
    lastUpdated: "Nov 15, 2025",
  },
  {
    customer: "Sarah Johnson",
    documents: {
      idPassport: true,
      driversLicense: true,
      proofOfAddress: false,
    },
    lastUpdated: "Nov 14, 2025",
  },
];

const conditionReports = [
  {
    id: "CR-2341",
    booking: "BK-3421",
    customer: "John Smith",
    vehicle: "Toyota Corolla",
    type: "Pre-rental",
    date: "Nov 15, 2025",
    condition: "Excellent",
    damages: 0,
  },
  {
    id: "CR-2340",
    booking: "BK-3420",
    customer: "Sarah Johnson",
    vehicle: "Honda CR-V",
    type: "Post-rental",
    date: "Nov 18, 2025",
    condition: "Good",
    damages: 1,
  },
];

export function ContractsDocuments() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1>Contracts & Documents</h1>
          <p className="text-gray-600">Manage rental agreements, vehicle documents, and condition reports</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Upload className="w-4 h-4" />
            Upload
          </Button>
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            New Contract
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-gray-600 text-sm">Active Contracts</p>
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <FileText className="w-5 h-5 text-blue-600" />
              </div>
            </div>
            <p className="text-3xl">18</p>
            <p className="text-xs text-gray-500 mt-1">Currently active</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-gray-600 text-sm">Pending Signature</p>
              <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                <File className="w-5 h-5 text-yellow-600" />
              </div>
            </div>
            <p className="text-3xl">3</p>
            <p className="text-xs text-gray-500 mt-1">Awaiting signature</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-gray-600 text-sm">Expiring Documents</p>
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <Shield className="w-5 h-5 text-red-600" />
              </div>
            </div>
            <p className="text-3xl">2</p>
            <p className="text-xs text-gray-500 mt-1">Next 30 days</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-gray-600 text-sm">Total Documents</p>
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <File className="w-5 h-5 text-green-600" />
              </div>
            </div>
            <p className="text-3xl">247</p>
            <p className="text-xs text-gray-500 mt-1">All categories</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="contracts" className="w-full">
        <TabsList>
          <TabsTrigger value="contracts">Rental Contracts</TabsTrigger>
          <TabsTrigger value="vehicle-docs">Vehicle Documents</TabsTrigger>
          <TabsTrigger value="customer-docs">Customer Documents</TabsTrigger>
          <TabsTrigger value="condition">Condition Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="contracts" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Rental Agreements</CardTitle>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input placeholder="Search contracts..." className="pl-10 w-[300px]" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {contracts.map((contract) => (
                  <div key={contract.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                        <FileText className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium">{contract.id} - {contract.type}</p>
                        <p className="text-sm text-gray-600">{contract.customer} • {contract.vehicle}</p>
                        <p className="text-xs text-gray-500">Date: {contract.date} • Booking: {contract.bookingId}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge className={contract.status === 'signed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                        {contract.status === 'signed' ? 'Signed' : 'Pending'}
                      </Badge>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="sm" title="View">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" title="Download">
                          <Download className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="vehicle-docs" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Vehicle Documents</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {vehicleDocuments.map((vehicle) => (
                  <div key={vehicle.plate} className="border rounded-lg p-4">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                        <Car className="w-6 h-6 text-purple-600" />
                      </div>
                      <div>
                        <p className="font-medium">{vehicle.vehicle}</p>
                        <p className="text-sm text-gray-500">{vehicle.plate}</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {Object.entries(vehicle.documents).map(([key, doc]) => (
                        <div key={key} className="p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <p className="text-xs font-medium capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</p>
                            <Badge 
                              className={
                                doc.status === 'valid' ? 'bg-green-100 text-green-800' :
                                doc.status === 'expiring' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-red-100 text-red-800'
                              }
                            >
                              {doc.status}
                            </Badge>
                          </div>
                          <p className="text-xs text-gray-600">Expires: {doc.expiry}</p>
                        </div>
                      ))}
                    </div>
                    
                    <div className="flex gap-2 mt-4">
                      <Button variant="outline" size="sm" className="gap-2">
                        <Eye className="w-4 h-4" />
                        View All
                      </Button>
                      <Button variant="outline" size="sm" className="gap-2">
                        <Upload className="w-4 h-4" />
                        Upload
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="customer-docs" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Customer Documents</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {customerDocuments.map((customer) => (
                  <div key={customer.customer} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                        <User className="w-6 h-6 text-green-600" />
                      </div>
                      <div>
                        <p className="font-medium">{customer.customer}</p>
                        <p className="text-sm text-gray-500">Last updated: {customer.lastUpdated}</p>
                        <div className="flex gap-2 mt-2">
                          <Badge variant={customer.documents.idPassport ? "default" : "secondary"}>
                            ID/Passport
                          </Badge>
                          <Badge variant={customer.documents.driversLicense ? "default" : "secondary"}>
                            Driver's License
                          </Badge>
                          <Badge variant={customer.documents.proofOfAddress ? "default" : "secondary"}>
                            Proof of Address
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="sm">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Upload className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="condition" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Vehicle Condition Reports</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {conditionReports.map((report) => (
                  <div key={report.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                        report.type === 'Pre-rental' ? 'bg-blue-100' : 'bg-green-100'
                      }`}>
                        <FileText className={`w-6 h-6 ${
                          report.type === 'Pre-rental' ? 'text-blue-600' : 'text-green-600'
                        }`} />
                      </div>
                      <div>
                        <p className="font-medium">{report.id} - {report.type}</p>
                        <p className="text-sm text-gray-600">{report.customer} • {report.vehicle}</p>
                        <p className="text-xs text-gray-500">
                          Date: {report.date} • Booking: {report.booking}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <p className="text-sm font-medium">{report.condition}</p>
                        <p className="text-xs text-gray-500">
                          {report.damages} damage{report.damages !== 1 ? 's' : ''}
                        </p>
                      </div>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="sm">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Download className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
