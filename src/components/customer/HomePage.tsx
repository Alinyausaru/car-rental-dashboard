import { useState } from "react";
import { Search, Calendar, MapPin, CheckCircle, Star, ArrowRight, Shield, DollarSign, Headphones, Users } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Card, CardContent } from "../ui/card";
import { ImageWithFallback } from "../figma/ImageWithFallback";
import { eventTracker } from "../../utils/eventTracking";
import type { Vehicle } from "../../types";

interface HomePageProps {
  onNavigate: (page: string, params?: any) => void;
  featuredVehicles: Vehicle[];
  user?: any;
}

export function HomePage({ onNavigate, featuredVehicles, user }: HomePageProps) {
  const [searchData, setSearchData] = useState({
    location: "",
    pickupDate: "",
    returnDate: "",
  });

  const handleSearch = () => {
    // Track search event
    eventTracker.trackSearch(searchData, user);
    onNavigate("cars", { ...searchData });
  };

  const testimonials = [
    {
      name: "John M.",
      rating: 5,
      text: "Excellent service! The car was clean, well-maintained, and perfect for our family road trip.",
      date: "2 weeks ago",
    },
    {
      name: "Sarah N.",
      rating: 5,
      text: "Best car rental experience I've had. Easy booking process and competitive prices.",
      date: "1 month ago",
    },
    {
      name: "Michael D.",
      rating: 4,
      text: "Great selection of vehicles. The Tesla Model 3 was amazing! Will definitely rent again.",
      date: "3 weeks ago",
    },
    {
      name: "Grace M.",
      rating: 5,
      text: "Professional staff and hassle-free pickup/return. Highly recommend!",
      date: "2 months ago",
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section 
        className="relative h-[600px] bg-cover bg-center flex items-center"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('https://images.unsplash.com/photo-1758322680193-56fe2af8fd59?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBjYXIlMjBkcml2aW5nJTIwcm9hZHxlbnwxfHx8fDE3NjQ1ODE2ODZ8MA&ixlib=rb-4.1.0&q=80&w=1080')`,
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="text-center text-white mb-8">
            <h1 className="text-5xl md:text-6xl mb-4">Find Your Perfect Rental Car</h1>
            <p className="text-xl mb-8">Quality vehicles, competitive rates, and exceptional service</p>
          </div>

          {/* Search Widget */}
          <Card className="max-w-4xl mx-auto">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm mb-2">Pickup Location</label>
                  <Select 
                    value={searchData.location}
                    onValueChange={(value) => setSearchData({ ...searchData, location: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select location" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="main">Main Office</SelectItem>
                      <SelectItem value="airport">Airport</SelectItem>
                      <SelectItem value="city">City Center</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="block text-sm mb-2">Pickup Date</label>
                  <Input
                    type="date"
                    value={searchData.pickupDate}
                    onChange={(e) => setSearchData({ ...searchData, pickupDate: e.target.value })}
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>

                <div>
                  <label className="block text-sm mb-2">Return Date</label>
                  <Input
                    type="date"
                    value={searchData.returnDate}
                    onChange={(e) => setSearchData({ ...searchData, returnDate: e.target.value })}
                    min={searchData.pickupDate || new Date().toISOString().split('T')[0]}
                  />
                </div>
              </div>

              <Button 
                onClick={handleSearch}
                className="w-full mt-6 bg-orange-500 hover:bg-orange-600 h-12 text-lg"
              >
                <Search className="w-5 h-5 mr-2" />
                Search Available Cars
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl mb-4">How It Works</h2>
            <p className="text-gray-600">Rent a car in three simple steps</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl mb-3">1. Browse</h3>
              <p className="text-gray-600">
                Search our wide selection of quality vehicles and find the perfect car for your needs.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl mb-3">2. Book</h3>
              <p className="text-gray-600">
                Choose your dates, select add-ons, and complete your booking online in minutes.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl mb-3">3. Drive</h3>
              <p className="text-gray-600">
                Pick up your car at the selected location and enjoy your journey with confidence.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Cars */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl mb-4">Featured Vehicles</h2>
            <p className="text-gray-600">Popular choices from our fleet</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredVehicles.slice(0, 8).map((vehicle) => (
              <Card key={vehicle.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="h-48 overflow-hidden">
                  <ImageWithFallback
                    src={vehicle.primary_image_url}
                    alt={`${vehicle.make} ${vehicle.model}`}
                    className="w-full h-full object-cover hover:scale-105 transition-transform"
                  />
                </div>
                <CardContent className="p-4">
                  <h3 className="mb-1">{vehicle.make} {vehicle.model}</h3>
                  <p className="text-sm text-gray-500 mb-2">{vehicle.year} • {vehicle.category}</p>
                  
                  <div className="flex items-center gap-1 mb-3">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm">{vehicle.rating.toFixed(1)}</span>
                    <span className="text-sm text-gray-500">({vehicle.total_reviews})</span>
                  </div>

                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <div className="text-sm text-gray-500">From</div>
                      <div className="text-xl text-blue-600">${vehicle.daily_rate_weekday}/day</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onNavigate("vehicle-details", { id: vehicle.id })}
                    >
                      Details
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => onNavigate("booking", { vehicleId: vehicle.id })}
                      className="bg-orange-500 hover:bg-orange-600"
                    >
                      Book Now
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-8">
            <Button
              onClick={() => onNavigate("cars")}
              className="bg-blue-600 hover:bg-blue-700"
            >
              View All Vehicles
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 bg-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl mb-4">Why Choose AutoRent?</h2>
            <p className="text-gray-600">Your trusted car rental partner</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white p-6 rounded-lg text-center">
              <Headphones className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-xl mb-2">24/7 Support</h3>
              <p className="text-gray-600">
                Round-the-clock customer support for your peace of mind
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg text-center">
              <DollarSign className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-xl mb-2">Best Prices</h3>
              <p className="text-gray-600">
                Competitive rates with no hidden fees
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg text-center">
              <Users className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-xl mb-2">Wide Selection</h3>
              <p className="text-gray-600">
                Choose from our diverse fleet of quality vehicles
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg text-center">
              <Shield className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-xl mb-2">Fully Insured</h3>
              <p className="text-gray-600">
                All vehicles come with comprehensive insurance
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl mb-4">What Our Customers Say</h2>
            <p className="text-gray-600">Real experiences from real customers</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {testimonials.map((testimonial, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex items-center gap-1 mb-3">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < testimonial.rating
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-gray-700 mb-4">"{testimonial.text}"</p>
                  <div className="flex justify-between items-center text-sm">
                    <div className="text-gray-900">{testimonial.name}</div>
                    <div className="text-gray-500">{testimonial.date}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl mb-4">Ready to Book Your Car?</h2>
          <p className="text-xl mb-8">
            Start your journey today with AutoRent
          </p>
          <Button
            onClick={() => onNavigate("cars")}
            size="lg"
            className="bg-orange-500 hover:bg-orange-600"
          >
            Book Your Car Today
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </section>
    </div>
  );
}