import { useState, useEffect } from "react";
import { Calendar, DollarSign, Car, User, Heart, FileText, ArrowLeft, Download, Star } from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Badge } from "../ui/badge";
import { Input } from "../ui/input";
import { ImageWithFallback } from "../figma/ImageWithFallback";
import { Skeleton } from "../ui/skeleton";
import type { Booking, Customer, Vehicle } from "../../types";
import { bookingsApi, customersApi } from "../../utils/api";
import { createClient } from "../../utils/supabase/client";

interface CustomerAccountProps {
  user: any;
  onNavigate: (page: string, params?: any) => void;
}

export function CustomerDashboard({ user, onNavigate }: CustomerAccountProps) {
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const supabase = createClient();
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.access_token) {
        const [customerRes, bookingsRes] = await Promise.all([
          customersApi.getMe(session.access_token),
          bookingsApi.getAll(session.access_token),
        ]);

        if (customerRes.success) setCustomer(customerRes.data);
        if (bookingsRes.success) setBookings(bookingsRes.data);
      }
    } catch (error) {
      console.error("Failed to load customer data:", error);
    } finally {
      setLoading(false);
    }
  };

  const upcomingBookings = bookings.filter(
    (b) => b.status === "Confirmed" || b.status === "Pending"
  );
  const completedBookings = bookings.filter((b) => b.status === "Completed");

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4">
          <Skeleton className="h-64 w-full mb-6" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-32" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-4xl mb-2">Welcome back, {customer?.full_name || user.email}!</h1>
          <p className="text-gray-600">Manage your bookings and account</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <div className="text-2xl">{upcomingBookings.length}</div>
                  <div className="text-sm text-gray-600">Active Bookings</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <Car className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <div className="text-2xl">{customer?.total_bookings || 0}</div>
                  <div className="text-sm text-gray-600">Total Rentals</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <div className="text-2xl">${customer?.total_spent || 0}</div>
                  <div className="text-sm text-gray-600">Total Spent</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Star className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <div className="text-2xl">{customer?.loyalty_points || 0}</div>
                  <div className="text-sm text-gray-600">Loyalty Points</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Upcoming Bookings */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl">Upcoming Bookings</h2>
              <Button variant="outline" onClick={() => onNavigate("bookings")}>
                View All
              </Button>
            </div>

            {upcomingBookings.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p className="mb-4">No upcoming bookings</p>
                <Button onClick={() => onNavigate("cars")} className="bg-blue-600">
                  Browse Cars
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {upcomingBookings.slice(0, 3).map((booking) => (
                  <div key={booking.id} className="border rounded-lg p-4 flex justify-between items-center">
                    <div>
                      <div className="mb-1">
                        <Badge variant={booking.status === "Confirmed" ? "default" : "secondary"}>
                          {booking.status}
                        </Badge>
                      </div>
                      <div>Booking #{booking.booking_reference}</div>
                      <div className="text-sm text-gray-600">
                        {new Date(booking.pickup_date).toLocaleDateString()} - {new Date(booking.return_date).toLocaleDateString()}
                      </div>
                      <div className="text-sm text-gray-600">{booking.pickup_location}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-xl text-blue-600">${booking.total_price}</div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onNavigate("booking-details", { id: booking.id })}
                      >
                        View Details
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Button
            variant="outline"
            className="h-24 flex flex-col gap-2"
            onClick={() => onNavigate("cars")}
          >
            <Car className="w-6 h-6" />
            Browse Cars
          </Button>
          <Button
            variant="outline"
            className="h-24 flex flex-col gap-2"
            onClick={() => onNavigate("bookings")}
          >
            <Calendar className="w-6 h-6" />
            My Bookings
          </Button>
          <Button
            variant="outline"
            className="h-24 flex flex-col gap-2"
            onClick={() => onNavigate("profile")}
          >
            <User className="w-6 h-6" />
            Update Profile
          </Button>
          <Button
            variant="outline"
            className="h-24 flex flex-col gap-2"
            onClick={() => onNavigate("favorites")}
          >
            <Heart className="w-6 h-6" />
            Saved Favorites
          </Button>
        </div>
      </div>
    </div>
  );
}

export function MyBookings({ user, onNavigate }: CustomerAccountProps) {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "upcoming" | "completed" | "cancelled">("all");

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    try {
      const supabase = createClient();
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.access_token) {
        const response = await bookingsApi.getAll(session.access_token);
        if (response.success) setBookings(response.data);
      }
    } catch (error) {
      console.error("Failed to load bookings:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredBookings = bookings.filter((booking) => {
    if (filter === "all") return true;
    if (filter === "upcoming") return booking.status === "Confirmed" || booking.status === "Pending";
    if (filter === "completed") return booking.status === "Completed";
    if (filter === "cancelled") return booking.status === "Cancelled";
    return true;
  });

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Button variant="ghost" onClick={() => onNavigate("account")} className="mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Button>

        <h1 className="text-4xl mb-8">My Bookings</h1>

        <Tabs value={filter} onValueChange={(value: any) => setFilter(value)} className="mb-6">
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
            <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
          </TabsList>
        </Tabs>

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-32" />
            ))}
          </div>
        ) : filteredBookings.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <p className="text-gray-500 mb-4">No bookings found</p>
              <Button onClick={() => onNavigate("cars")} className="bg-blue-600">
                Browse Cars
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredBookings.map((booking) => (
              <Card key={booking.id}>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl">Booking #{booking.booking_reference}</h3>
                        <Badge variant={
                          booking.status === "Confirmed" ? "default" :
                          booking.status === "Completed" ? "secondary" :
                          booking.status === "Cancelled" ? "destructive" :
                          "outline"
                        }>
                          {booking.status}
                        </Badge>
                        <Badge variant="outline">{booking.payment_status}</Badge>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <div className="text-gray-600">Pickup</div>
                          <div>{new Date(booking.pickup_date).toLocaleDateString()}</div>
                          <div>{booking.pickup_time}</div>
                          <div>{booking.pickup_location}</div>
                        </div>
                        <div>
                          <div className="text-gray-600">Return</div>
                          <div>{new Date(booking.return_date).toLocaleDateString()}</div>
                          <div>{booking.return_time}</div>
                          <div>{booking.return_location}</div>
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-2xl text-blue-600 mb-2">${booking.total_price}</div>
                      <div className="space-y-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onNavigate("booking-details", { id: booking.id })}
                        >
                          View Details
                        </Button>
                        <Button variant="outline" size="sm" className="w-full">
                          <Download className="w-4 h-4 mr-2" />
                          Invoice
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export function MyProfile({ user, onNavigate }: CustomerAccountProps) {
  const [customer, setCustomer] = useState<Partial<Customer>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const supabase = createClient();
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.access_token) {
        const response = await customersApi.getMe(session.access_token);
        if (response.success && response.data) {
          setCustomer(response.data);
        }
      }
    } catch (error) {
      console.error("Failed to load profile:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4">
        <Button variant="ghost" onClick={() => onNavigate("account")} className="mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Button>

        <h1 className="text-4xl mb-8">My Profile</h1>

        <Card>
          <CardContent className="p-6">
            <div className="space-y-6">
              <div>
                <h3 className="mb-4">Personal Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm mb-2">Full Name</label>
                    <Input
                      value={customer.full_name || ""}
                      onChange={(e) => setCustomer({ ...customer, full_name: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm mb-2">Email</label>
                    <Input
                      type="email"
                      value={customer.email || user.email}
                      onChange={(e) => setCustomer({ ...customer, email: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm mb-2">Phone</label>
                    <Input
                      value={customer.phone || ""}
                      onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm mb-2">Date of Birth</label>
                    <Input
                      type="date"
                      value={customer.date_of_birth || ""}
                      onChange={(e) => setCustomer({ ...customer, date_of_birth: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              <div className="border-t pt-6">
                <h3 className="mb-4">Driver Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm mb-2">Driver's License Number</label>
                    <Input
                      value={customer.drivers_license_number || ""}
                      onChange={(e) => setCustomer({ ...customer, drivers_license_number: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm mb-2">License Expiry Date</label>
                    <Input
                      type="date"
                      value={customer.license_expiry_date || ""}
                      onChange={(e) => setCustomer({ ...customer, license_expiry_date: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm mb-2">ID/Passport Number</label>
                    <Input
                      value={customer.id_passport_number || ""}
                      onChange={(e) => setCustomer({ ...customer, id_passport_number: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              <Button className="bg-blue-600">Save Changes</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export function Favorites({ onNavigate }: { onNavigate: (page: string) => void }) {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <Button variant="ghost" onClick={() => onNavigate("account")} className="mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Button>

        <h1 className="text-4xl mb-8">Saved Favorites</h1>

        <Card>
          <CardContent className="p-12 text-center">
            <Heart className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-500 mb-4">You haven't saved any cars yet</p>
            <Button onClick={() => onNavigate("cars")} className="bg-blue-600">
              Browse Cars
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
