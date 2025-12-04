import { useState, useEffect } from "react";
import { Star, Users, Fuel, Settings, MapPin, Calendar, ArrowLeft, Heart } from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { ImageWithFallback } from "../figma/ImageWithFallback";
import { Skeleton } from "../ui/skeleton";
import { eventTracker } from "../../utils/eventTracking";
import type { Vehicle, Review } from "../../types";
import { reviewsApi } from "../../utils/api";
import { createClient } from "../../utils/supabase/client";

interface VehicleDetailsProps {
  vehicle: Vehicle;
  onNavigate: (page: string, params?: any) => void;
  onBook: (vehicleId: string) => void;
}

export function VehicleDetails({ vehicle, onNavigate, onBook }: VehicleDetailsProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    loadReviews();
    checkUser();
    // Track vehicle view
    trackVehicleView();
  }, [vehicle.id]);

  const checkUser = async () => {
    const supabase = createClient();
    const { data: { session } } = await supabase.auth.getSession();
    setUser(session?.user || null);
  };

  const trackVehicleView = async () => {
    const supabase = createClient();
    const { data: { session } } = await supabase.auth.getSession();
    eventTracker.trackVehicleView(vehicle, session?.user);
  };

  const loadReviews = async () => {
    try {
      const response = await reviewsApi.getForVehicle(vehicle.id);
      setReviews(response.data);
    } catch (error) {
      console.error("Failed to load reviews:", error);
    } finally {
      setLoading(false);
    }
  };

  const images = vehicle.images && vehicle.images.length > 0 
    ? vehicle.images 
    : [vehicle.primary_image_url];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => onNavigate("cars")}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Browse
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Images */}
          <div className="lg:col-span-2 space-y-4">
            {/* Main Image */}
            <div className="h-96 rounded-lg overflow-hidden">
              <ImageWithFallback
                src={images[selectedImage]}
                alt={`${vehicle.make} ${vehicle.model}`}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Thumbnail Images */}
            {images.length > 1 && (
              <div className="grid grid-cols-4 gap-4">
                {images.map((image, index) => (
                  <div
                    key={index}
                    className={`h-24 rounded-lg overflow-hidden cursor-pointer border-2 ${
                      selectedImage === index ? "border-blue-600" : "border-transparent"
                    }`}
                    onClick={() => setSelectedImage(index)}
                  >
                    <ImageWithFallback
                      src={image}
                      alt={`${vehicle.make} ${vehicle.model} view ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            )}

            {/* Details Sections */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-2xl mb-4">Specifications</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-gray-500">Make & Model</div>
                    <div>{vehicle.make} {vehicle.model}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Year</div>
                    <div>{vehicle.year}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Category</div>
                    <div>{vehicle.category}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Transmission</div>
                    <div>{vehicle.transmission}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Fuel Type</div>
                    <div>{vehicle.fuel_type}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Seating</div>
                    <div>{vehicle.seating_capacity} passengers</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Mileage</div>
                    <div>{vehicle.mileage}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Color</div>
                    <div>{vehicle.color}</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Features */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-2xl mb-4">Features & Amenities</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {vehicle.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Reviews */}
            <Card>
              <CardContent className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl">Customer Reviews</h2>
                  <div className="flex items-center gap-2">
                    <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    <span className="text-xl">{vehicle.rating.toFixed(1)}</span>
                    <span className="text-gray-500">({vehicle.total_reviews} reviews)</span>
                  </div>
                </div>

                {loading ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i}>
                        <Skeleton className="h-4 w-24 mb-2" />
                        <Skeleton className="h-16 w-full" />
                      </div>
                    ))}
                  </div>
                ) : reviews.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">No reviews yet</p>
                ) : (
                  <div className="space-y-6">
                    {reviews.map((review) => (
                      <div key={review.id} className="border-b last:border-b-0 pb-4 last:pb-0">
                        <div className="flex items-center gap-1 mb-2">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${
                                i < review.rating
                                  ? "fill-yellow-400 text-yellow-400"
                                  : "text-gray-300"
                              }`}
                            />
                          ))}
                          <span className="text-sm text-gray-500 ml-2">
                            {new Date(review.created_at).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-gray-700">{review.comment}</p>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Booking Card */}
          <div>
            <Card className="sticky top-20">
              <CardContent className="p-6">
                <div className="mb-6">
                  <h1 className="text-3xl mb-2">{vehicle.make} {vehicle.model}</h1>
                  <p className="text-gray-600">{vehicle.year} • {vehicle.category}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    <span>{vehicle.rating.toFixed(1)}</span>
                    <span className="text-gray-500">({vehicle.total_reviews} reviews)</span>
                  </div>
                </div>

                <div className="border-t border-b py-4 mb-6 space-y-3">
                  <h3 className="mb-3">Pricing</h3>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Weekday Rate</span>
                    <span className="text-xl text-blue-600">${vehicle.daily_rate_weekday}/day</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Weekend Rate</span>
                    <span className="text-xl text-orange-600">${vehicle.daily_rate_weekend}/day</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Weekly Rate</span>
                    <span className="text-lg text-green-600">${vehicle.weekly_rate}/week</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Monthly Rate</span>
                    <span className="text-lg text-green-600">${vehicle.monthly_rate}/month</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t">
                    <span className="text-gray-600">Refundable Deposit</span>
                    <span>${vehicle.deposit_amount}</span>
                  </div>
                </div>

                <div className="mb-6">
                  <div className={`inline-flex px-3 py-1 rounded-full text-sm ${
                    vehicle.availability_status === "Available"
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}>
                    {vehicle.availability_status}
                  </div>
                </div>

                <Button
                  onClick={() => onBook(vehicle.id)}
                  className="w-full h-12 text-lg bg-orange-500 hover:bg-orange-600 mb-3"
                  disabled={vehicle.availability_status !== "Available"}
                >
                  Book This Car
                </Button>

                <Button
                  variant="outline"
                  className="w-full"
                >
                  <Heart className="w-4 h-4 mr-2" />
                  Save to Favorites
                </Button>

                <div className="mt-6 pt-6 border-t text-sm text-gray-600 space-y-2">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    <span>Available at: {vehicle.current_location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>Flexible pickup times</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}