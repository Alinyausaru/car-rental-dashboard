import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Plus, Search, Download, Send, Eye, DollarSign, AlertCircle, CheckCircle, Clock } from "lucide-react";

const invoices = [
  {
    id: "INV-3421",
    bookingId: "BK-3421",
    customer: "John Smith",
    vehicle: "Toyota Corolla",
    issueDate: "Nov 15, 2025",
    dueDate: "Nov 20, 2025",
    amount: 250,
    paid: 250,
    status: "paid",
  },
  {
    id: "INV-3420",
    bookingId: "BK-3420",
    customer: "Sarah Johnson",
    vehicle: "Honda CR-V",
    issueDate: "Nov 14, 2025",
    dueDate: "Nov 18, 2025",
    amount: 380,
    paid: 380,
    status: "paid",
  },
  {
    id: "INV-3419",
    bookingId: "BK-3419",
    customer: "Mike Davis",
    vehicle: "Ford Explorer",
    issueDate: "Nov 16, 2025",
    dueDate: "Nov 21, 2025",
    amount: 560,
    paid: 0,
    status: "pending",
  },
  {
    id: "INV-3418",
    bookingId: "BK-3418",
    customer: "Emily Brown",
    vehicle: "Nissan Altima",
    issueDate: "Nov 12, 2025",
    dueDate: "Nov 19, 2025",
    amount: 95,
    paid: 50,
    status: "partial",
  },
  {
    id: "INV-3417",
    bookingId: "BK-3417",
    customer: "James Wilson",
    vehicle: "BMW 3 Series",
    issueDate: "Nov 10, 2025",
    dueDate: "Nov 17, 2025",
    amount: 450,
    paid: 0,
    status: "overdue",
  },
];

const payments = [
  {
    id: "PAY-5621",
    invoice: "INV-3421",
    customer: "John Smith",
    amount: 250,
    method: "Bank Transfer",
    date: "Nov 20, 2025",
    reference: "TXN123456",
    receivedBy: "Admin User",
  },
  {
    id: "PAY-5620",
    invoice: "INV-3420",
    customer: "Sarah Johnson",
    amount: 380,
    method: "EcoCash",
    date: "Nov 18, 2025",
    reference: "EC789012",
    receivedBy: "Admin User",
  },
  {
    id: "PAY-5619",
    invoice: "INV-3418",
    customer: "Emily Brown",
    amount: 50,
    method: "Cash",
    date: "Nov 19, 2025",
    reference: "CASH-001",
    receivedBy: "Staff User",
  },
];

const statusConfig = {
  paid: { label: "Paid", className: "bg-green-100 text-green-800", icon: CheckCircle },
  pending: { label: "Pending", className: "bg-yellow-100 text-yellow-800", icon: Clock },
  partial: { label: "Partial", className: "bg-blue-100 text-blue-800", icon: Clock },
  overdue: { label: "Overdue", className: "bg-red-100 text-red-800", icon: AlertCircle },
};

export function InvoicesPayments() {
  const [activeTab, setActiveTab] = useState("invoices");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1>Invoices & Payments</h1>
          <p className="text-gray-600">Manage invoices, track payments, and process transactions</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Download className="w-4 h-4" />
            Export
          </Button>
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            Create Invoice
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-gray-600 text-sm">Total Revenue</p>
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-green-600" />
              </div>
            </div>
            <p className="text-3xl">$1,735</p>
            <p className="text-xs text-gray-500 mt-1">This month</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-gray-600 text-sm">Outstanding</p>
              <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                <Clock className="w-5 h-5 text-yellow-600" />
              </div>
            </div>
            <p className="text-3xl">$1,010</p>
            <p className="text-xs text-gray-500 mt-1">Pending payment</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-gray-600 text-sm">Overdue</p>
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <AlertCircle className="w-5 h-5 text-red-600" />
              </div>
            </div>
            <p className="text-3xl">$450</p>
            <p className="text-xs text-gray-500 mt-1">1 invoice</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-gray-600 text-sm">Paid Today</p>
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-blue-600" />
              </div>
            </div>
            <p className="text-3xl">$630</p>
            <p className="text-xs text-gray-500 mt-1">2 payments</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList>
                <TabsTrigger value="invoices">Invoices</TabsTrigger>
                <TabsTrigger value="payments">Payment History</TabsTrigger>
                <TabsTrigger value="overdue">Overdue</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input placeholder="Search invoices or payments..." className="pl-10" />
            </div>
          </div>

          {activeTab === "invoices" && (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Invoice ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Vehicle</TableHead>
                  <TableHead>Issue Date</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Paid</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invoices.map((invoice) => {
                  const status = statusConfig[invoice.status as keyof typeof statusConfig];
                  const StatusIcon = status.icon;
                  return (
                    <TableRow key={invoice.id}>
                      <TableCell className="font-medium">{invoice.id}</TableCell>
                      <TableCell>{invoice.customer}</TableCell>
                      <TableCell>{invoice.vehicle}</TableCell>
                      <TableCell>{invoice.issueDate}</TableCell>
                      <TableCell>{invoice.dueDate}</TableCell>
                      <TableCell>${invoice.amount}</TableCell>
                      <TableCell>${invoice.paid}</TableCell>
                      <TableCell>
                        <Badge className={status.className}>
                          <StatusIcon className="w-3 h-3 mr-1" />
                          {status.label}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button variant="ghost" size="sm" title="View">
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm" title="Download">
                            <Download className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm" title="Send">
                            <Send className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}

          {activeTab === "payments" && (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Payment ID</TableHead>
                  <TableHead>Invoice</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Method</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Reference</TableHead>
                  <TableHead>Received By</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {payments.map((payment) => (
                  <TableRow key={payment.id}>
                    <TableCell className="font-medium">{payment.id}</TableCell>
                    <TableCell>{payment.invoice}</TableCell>
                    <TableCell>{payment.customer}</TableCell>
                    <TableCell>${payment.amount}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{payment.method}</Badge>
                    </TableCell>
                    <TableCell>{payment.date}</TableCell>
                    <TableCell className="text-xs text-gray-500">{payment.reference}</TableCell>
                    <TableCell>{payment.receivedBy}</TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="sm" title="View Receipt">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" title="Download Receipt">
                          <Download className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}

          {activeTab === "overdue" && (
            <div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Invoice ID</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Amount Due</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead>Days Overdue</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {invoices.filter(inv => inv.status === "overdue").map((invoice) => (
                    <TableRow key={invoice.id} className="bg-red-50">
                      <TableCell className="font-medium">{invoice.id}</TableCell>
                      <TableCell>{invoice.customer}</TableCell>
                      <TableCell className="text-red-600 font-semibold">${invoice.amount}</TableCell>
                      <TableCell>{invoice.dueDate}</TableCell>
                      <TableCell>
                        <Badge variant="destructive">3 days</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button variant="outline" size="sm">Send Reminder</Button>
                          <Button size="sm">Record Payment</Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
