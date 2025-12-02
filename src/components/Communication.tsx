import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Plus, Send, Mail, MessageSquare, Phone, CheckCircle, Clock, X } from "lucide-react";

const messageTemplates = [
  { id: 1, name: "Booking Confirmation", type: "Email", category: "Booking", usage: 234 },
  { id: 2, name: "Pickup Reminder", type: "WhatsApp", category: "Reminder", usage: 189 },
  { id: 3, name: "Return Reminder", type: "SMS", category: "Reminder", usage: 176 },
  { id: 4, name: "Payment Due", type: "Email", category: "Payment", usage: 145 },
  { id: 5, name: "Thank You Message", type: "WhatsApp", category: "Feedback", usage: 198 },
  { id: 6, name: "Late Return Warning", type: "SMS", category: "Alert", usage: 23 },
];

const messageHistory = [
  {
    id: 1,
    customer: "John Smith",
    type: "Email",
    template: "Booking Confirmation",
    sentDate: "Nov 20, 2025 09:15 AM",
    status: "delivered",
  },
  {
    id: 2,
    customer: "Sarah Johnson",
    type: "WhatsApp",
    template: "Pickup Reminder",
    sentDate: "Nov 19, 2025 03:30 PM",
    status: "read",
  },
  {
    id: 3,
    customer: "Mike Davis",
    type: "SMS",
    template: "Return Reminder",
    sentDate: "Nov 20, 2025 08:00 AM",
    status: "delivered",
  },
  {
    id: 4,
    customer: "Emily Brown",
    type: "Email",
    template: "Payment Due",
    sentDate: "Nov 18, 2025 10:45 AM",
    status: "failed",
  },
];

const scheduledMessages = [
  {
    id: 1,
    customer: "Chris Wilson",
    type: "WhatsApp",
    template: "Pickup Reminder",
    scheduledFor: "Nov 21, 2025 09:00 AM",
    status: "pending",
  },
  {
    id: 2,
    customer: "Lisa Anderson",
    type: "Email",
    template: "Booking Confirmation",
    scheduledFor: "Nov 22, 2025 10:00 AM",
    status: "pending",
  },
];

const statusConfig = {
  delivered: { label: "Delivered", className: "bg-green-100 text-green-800", icon: CheckCircle },
  read: { label: "Read", className: "bg-blue-100 text-blue-800", icon: CheckCircle },
  pending: { label: "Pending", className: "bg-yellow-100 text-yellow-800", icon: Clock },
  failed: { label: "Failed", className: "bg-red-100 text-red-800", icon: X },
};

export function Communication() {
  const [selectedTemplate, setSelectedTemplate] = useState("");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1>Communication Center</h1>
          <p className="text-gray-600">Send messages and manage communication with customers</p>
        </div>
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          New Template
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-gray-600 text-sm">Sent Today</p>
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <Send className="w-5 h-5 text-blue-600" />
              </div>
            </div>
            <p className="text-3xl">42</p>
            <p className="text-xs text-gray-500 mt-1">All channels</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-gray-600 text-sm">Delivery Rate</p>
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
            </div>
            <p className="text-3xl">98.5%</p>
            <p className="text-xs text-gray-500 mt-1">Last 30 days</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-gray-600 text-sm">Scheduled</p>
              <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                <Clock className="w-5 h-5 text-yellow-600" />
              </div>
            </div>
            <p className="text-3xl">8</p>
            <p className="text-xs text-gray-500 mt-1">Upcoming messages</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-gray-600 text-sm">Templates</p>
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                <MessageSquare className="w-5 h-5 text-purple-600" />
              </div>
            </div>
            <p className="text-3xl">12</p>
            <p className="text-xs text-gray-500 mt-1">Active templates</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Send Message Panel */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Send Message</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Recipient(s)</label>
                <Input placeholder="Search customers..." />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Channel</label>
                <Select defaultValue="email">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="email">Email</SelectItem>
                    <SelectItem value="whatsapp">WhatsApp</SelectItem>
                    <SelectItem value="sms">SMS</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Template</label>
                <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select template..." />
                  </SelectTrigger>
                  <SelectContent>
                    {messageTemplates.map((template) => (
                      <SelectItem key={template.id} value={template.name}>
                        {template.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Message</label>
                <Textarea 
                  placeholder="Type your message or select a template..." 
                  rows={6}
                  defaultValue="Hi {customer_name},&#10;&#10;This is a reminder that your booking for {vehicle} is confirmed for {pickup_date}.&#10;&#10;Pickup time: {pickup_time}&#10;Location: {pickup_location}&#10;&#10;See you soon!"
                />
              </div>

              <div className="flex gap-2">
                <Button className="flex-1 gap-2">
                  <Send className="w-4 h-4" />
                  Send Now
                </Button>
                <Button variant="outline" className="flex-1 gap-2">
                  <Clock className="w-4 h-4" />
                  Schedule
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Message Management */}
        <div className="lg:col-span-2 space-y-6">
          <Tabs defaultValue="history" className="w-full">
            <TabsList>
              <TabsTrigger value="history">Message History</TabsTrigger>
              <TabsTrigger value="scheduled">Scheduled</TabsTrigger>
              <TabsTrigger value="templates">Templates</TabsTrigger>
            </TabsList>

            <TabsContent value="history">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Messages</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {messageHistory.map((message) => {
                      const status = statusConfig[message.status as keyof typeof statusConfig];
                      const StatusIcon = status.icon;
                      
                      return (
                        <div key={message.id} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                              {message.type === "Email" ? <Mail className="w-5 h-5" /> :
                               message.type === "WhatsApp" ? <MessageSquare className="w-5 h-5" /> :
                               <Phone className="w-5 h-5" />}
                            </div>
                            <div>
                              <p className="font-medium text-sm">{message.customer}</p>
                              <p className="text-xs text-gray-600">{message.template}</p>
                              <p className="text-xs text-gray-500">{message.sentDate}</p>
                            </div>
                          </div>
                          <Badge className={status.className}>
                            <StatusIcon className="w-3 h-3 mr-1" />
                            {status.label}
                          </Badge>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="scheduled">
              <Card>
                <CardHeader>
                  <CardTitle>Scheduled Messages</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {scheduledMessages.map((message) => (
                      <div key={message.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                            <Clock className="w-5 h-5 text-yellow-600" />
                          </div>
                          <div>
                            <p className="font-medium text-sm">{message.customer}</p>
                            <p className="text-xs text-gray-600">{message.template} • {message.type}</p>
                            <p className="text-xs text-gray-500">Scheduled: {message.scheduledFor}</p>
                          </div>
                        </div>
                        <div className="flex gap-1">
                          <Button variant="outline" size="sm">Edit</Button>
                          <Button variant="outline" size="sm">Cancel</Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="templates">
              <Card>
                <CardHeader>
                  <CardTitle>Message Templates</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {messageTemplates.map((template) => (
                      <div key={template.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                            <MessageSquare className="w-5 h-5 text-purple-600" />
                          </div>
                          <div>
                            <p className="font-medium text-sm">{template.name}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant="outline" className="text-xs">{template.type}</Badge>
                              <Badge variant="outline" className="text-xs">{template.category}</Badge>
                              <span className="text-xs text-gray-500">Used {template.usage} times</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-1">
                          <Button variant="outline" size="sm">Edit</Button>
                          <Button variant="outline" size="sm">Use</Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
