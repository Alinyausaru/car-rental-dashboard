import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Switch } from "./ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Building, DollarSign, CreditCard, Bell, Globe, Shield, Upload } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

export function Settings() {
  return (
    <div className="space-y-6">
      <div>
        <h1>Settings</h1>
        <p className="text-gray-600">Configure your car rental business settings</p>
      </div>

      <Tabs defaultValue="company" className="w-full">
        <TabsList>
          <TabsTrigger value="company">Company</TabsTrigger>
          <TabsTrigger value="pricing">Pricing</TabsTrigger>
          <TabsTrigger value="payments">Payments</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="system">System</TabsTrigger>
        </TabsList>

        <TabsContent value="company" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="w-5 h-5" />
                Company Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="company-name">Company Name</Label>
                  <Input id="company-name" defaultValue="RentalPro Fleet Services" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="business-reg">Business Registration Number</Label>
                  <Input id="business-reg" defaultValue="BR-123456789" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input id="email" type="email" defaultValue="contact@rentalpro.com" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input id="phone" defaultValue="+263 77 123 4567" />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="address">Business Address</Label>
                  <Input id="address" defaultValue="123 Main Street, Harare, Zimbabwe" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="website">Website</Label>
                  <Input id="website" defaultValue="www.rentalpro.com" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tax-number">Tax ID Number</Label>
                  <Input id="tax-number" defaultValue="TAX-987654321" />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Company Logo</Label>
                <div className="flex items-center gap-4">
                  <div className="w-24 h-24 bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg flex items-center justify-center">
                    <Building className="w-12 h-12 text-white" />
                  </div>
                  <Button variant="outline" className="gap-2">
                    <Upload className="w-4 h-4" />
                    Upload New Logo
                  </Button>
                </div>
              </div>

              <div className="flex justify-end">
                <Button>Save Changes</Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Business Hours</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map((day) => (
                  <div key={day} className="flex items-center justify-between">
                    <div className="flex items-center gap-4 flex-1">
                      <span className="w-24">{day}</span>
                      <Input className="w-32" defaultValue="08:00" />
                      <span>to</span>
                      <Input className="w-32" defaultValue="18:00" />
                    </div>
                    <Switch defaultChecked={day !== "Sunday"} />
                  </div>
                ))}
              </div>
              <div className="flex justify-end mt-6">
                <Button>Save Changes</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pricing" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="w-5 h-5" />
                Default Pricing Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-medium">Sedan</h3>
                  <div className="space-y-2">
                    <Label>Daily Rate (Weekday)</Label>
                    <Input type="number" defaultValue="45" />
                  </div>
                  <div className="space-y-2">
                    <Label>Daily Rate (Weekend)</Label>
                    <Input type="number" defaultValue="55" />
                  </div>
                  <div className="space-y-2">
                    <Label>Weekly Rate</Label>
                    <Input type="number" defaultValue="280" />
                  </div>
                  <div className="space-y-2">
                    <Label>Monthly Rate</Label>
                    <Input type="number" defaultValue="1000" />
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-medium">SUV</h3>
                  <div className="space-y-2">
                    <Label>Daily Rate (Weekday)</Label>
                    <Input type="number" defaultValue="75" />
                  </div>
                  <div className="space-y-2">
                    <Label>Daily Rate (Weekend)</Label>
                    <Input type="number" defaultValue="90" />
                  </div>
                  <div className="space-y-2">
                    <Label>Weekly Rate</Label>
                    <Input type="number" defaultValue="450" />
                  </div>
                  <div className="space-y-2">
                    <Label>Monthly Rate</Label>
                    <Input type="number" defaultValue="1600" />
                  </div>
                </div>
              </div>

              <div className="border-t pt-6">
                <h3 className="font-medium mb-4">Add-ons Pricing</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Insurance (per day)</Label>
                    <Input type="number" defaultValue="15" />
                  </div>
                  <div className="space-y-2">
                    <Label>GPS Device (per day)</Label>
                    <Input type="number" defaultValue="5" />
                  </div>
                  <div className="space-y-2">
                    <Label>Child Seat (per day)</Label>
                    <Input type="number" defaultValue="8" />
                  </div>
                  <div className="space-y-2">
                    <Label>Additional Driver (per day)</Label>
                    <Input type="number" defaultValue="10" />
                  </div>
                </div>
              </div>

              <div className="border-t pt-6">
                <h3 className="font-medium mb-4">Fees & Charges</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Late Return Fee (per hour)</Label>
                    <Input type="number" defaultValue="20" />
                  </div>
                  <div className="space-y-2">
                    <Label>Cancellation Fee</Label>
                    <Input type="number" defaultValue="50" />
                  </div>
                  <div className="space-y-2">
                    <Label>Mileage Limit (km per day)</Label>
                    <Input type="number" defaultValue="200" />
                  </div>
                  <div className="space-y-2">
                    <Label>Overage Charge (per km)</Label>
                    <Input type="number" defaultValue="0.50" />
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <Button>Save Pricing</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payments" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="w-5 h-5" />
                Payment Methods
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Switch defaultChecked />
                    <div>
                      <p className="font-medium">Cash</p>
                      <p className="text-sm text-gray-500">Accept cash payments</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Switch defaultChecked />
                    <div>
                      <p className="font-medium">Bank Transfer</p>
                      <p className="text-sm text-gray-500">Accept bank transfers</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Switch defaultChecked />
                    <div>
                      <p className="font-medium">EcoCash</p>
                      <p className="text-sm text-gray-500">Mobile money payments</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Switch defaultChecked />
                    <div>
                      <p className="font-medium">OneMoney</p>
                      <p className="text-sm text-gray-500">Mobile money payments</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Switch />
                    <div>
                      <p className="font-medium">Credit/Debit Card</p>
                      <p className="text-sm text-gray-500">Payment gateway integration</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t pt-6">
                <h3 className="font-medium mb-4">Bank Account Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Bank Name</Label>
                    <Input defaultValue="Standard Bank" />
                  </div>
                  <div className="space-y-2">
                    <Label>Account Name</Label>
                    <Input defaultValue="RentalPro Fleet Services" />
                  </div>
                  <div className="space-y-2">
                    <Label>Account Number</Label>
                    <Input defaultValue="123456789" />
                  </div>
                  <div className="space-y-2">
                    <Label>Branch Code</Label>
                    <Input defaultValue="001234" />
                  </div>
                </div>
              </div>

              <div className="border-t pt-6">
                <h3 className="font-medium mb-4">Mobile Money Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>EcoCash Number</Label>
                    <Input defaultValue="+263 77 123 4567" />
                  </div>
                  <div className="space-y-2">
                    <Label>OneMoney Number</Label>
                    <Input defaultValue="+263 71 987 6543" />
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <Button>Save Payment Settings</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5" />
                Notification Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="font-medium">Automated Messages</h3>
                
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="font-medium">Booking Confirmation</p>
                    <p className="text-sm text-gray-500">Send immediately after booking</p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="font-medium">Pickup Reminder</p>
                    <p className="text-sm text-gray-500">Send 1 day before pickup</p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="font-medium">Return Reminder</p>
                    <p className="text-sm text-gray-500">Send on return day</p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="font-medium">Payment Reminder</p>
                    <p className="text-sm text-gray-500">Send before payment due date</p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="font-medium">Thank You Message</p>
                    <p className="text-sm text-gray-500">Send after rental completion</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>

              <div className="border-t pt-6">
                <h3 className="font-medium mb-4">Delivery Channels</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">Email</p>
                      <p className="text-sm text-gray-500">Send via email</p>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">WhatsApp</p>
                      <p className="text-sm text-gray-500">Send via WhatsApp</p>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">SMS</p>
                      <p className="text-sm text-gray-500">Send via text message</p>
                    </div>
                    <Switch />
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <Button>Save Notification Settings</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="system" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="w-5 h-5" />
                System Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Currency</Label>
                  <Select defaultValue="usd">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="usd">USD ($)</SelectItem>
                      <SelectItem value="zig">ZiG (ZiG)</SelectItem>
                      <SelectItem value="zwl">ZWL (Z$)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Date Format</Label>
                  <Select defaultValue="mdy">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mdy">MM/DD/YYYY</SelectItem>
                      <SelectItem value="dmy">DD/MM/YYYY</SelectItem>
                      <SelectItem value="ymd">YYYY-MM-DD</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Time Zone</Label>
                  <Select defaultValue="cat">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cat">CAT (Africa/Harare)</SelectItem>
                      <SelectItem value="eat">EAT (Africa/Nairobi)</SelectItem>
                      <SelectItem value="sast">SAST (Africa/Johannesburg)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Language</Label>
                  <Select defaultValue="en">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="fr">French</SelectItem>
                      <SelectItem value="pt">Portuguese</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Fiscal Year Start</Label>
                  <Select defaultValue="jan">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="jan">January</SelectItem>
                      <SelectItem value="apr">April</SelectItem>
                      <SelectItem value="jul">July</SelectItem>
                      <SelectItem value="oct">October</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex justify-end">
                <Button>Save System Settings</Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Security & Backup
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <p className="font-medium">Two-Factor Authentication</p>
                  <p className="text-sm text-gray-500">Add extra security to your account</p>
                </div>
                <Switch />
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <p className="font-medium">Automatic Backup</p>
                  <p className="text-sm text-gray-500">Daily backup at midnight</p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="font-medium">Last Backup</p>
                    <p className="text-sm text-gray-500">Nov 20, 2025 at 12:00 AM</p>
                  </div>
                  <Button variant="outline">Backup Now</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
