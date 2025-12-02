import { useState, useMemo } from "react";
import { Star, Filter, SlidersHorizontal } from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { Checkbox } from "../ui/checkbox";
import { Slider } from "../ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { ImageWithFallback } from "../figma/ImageWithFallback";
import type { Vehicle } from "../../types";

interface BrowseCarsProps {
  vehicles: Vehicle[];
  onNavigate: (page: string, params?: any) => void;
}

export function BrowseCars({ vehicles, onNavigate }: BrowseCarsProps) {
  const [showFilters, setShowFilters] = useState(true);
  const [priceRange, setPriceRange] = useState([0, 200]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedTransmission, setSelectedTransmission] = useState<string[]>([]);
  const [selectedSeating, setSelectedSeating] = useState<string[]>([]);
  const [selectedFuelTypes, setSelectedFuelTypes] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState("popular");

  const availableVehicles = vehicles.filter((v) => v.availability_status === "Available");

  const filteredVehicles = useMemo(() => {
    let filtered = availableVehicles;

    // Price filter
    filtered = filtered.filter(
      (v) => v.daily_rate_weekday >= priceRange[0] && v.daily_rate_weekday <= priceRange[1]
    );

    // Category filter
    if (selectedCategories.length > 0) {
      filtered = filtered.filter((v) => selectedCategories.includes(v.category));
    }

    // Transmission filter
    if (selectedTransmission.length > 0) {
      filtered = filtered.filter((v) => selectedTransmission.includes(v.transmission));
    }

    // Seating filter
    if (selectedSeating.length > 0) {
      filtered = filtered.filter((v) =>
        selectedSeating.includes(v.seating_capacity.toString())
      );
    }

    // Fuel type filter
    if (selectedFuelTypes.length > 0) {
      filtered = filtered.filter((v) => selectedFuelTypes.includes(v.fuel_type));
    }

    // Sorting
    switch (sortBy) {
      case "price-low":
        filtered.sort((a, b) => a.daily_rate_weekday - b.daily_rate_weekday);
        break;
      case "price-high":
        filtered.sort((a, b) => b.daily_rate_weekday - a.daily_rate_weekday);
        break;
      case "rating":
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case "newest":
        filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        break;
      default: // popular
        filtered.sort((a, b) => b.total_reviews - a.total_reviews);
    }

    return filtered;
  }, [
    availableVehicles,
    priceRange,
    selectedCategories,
    selectedTransmission,
    selectedSeating,
    selectedFuelTypes,
    sortBy,
  ]);

  const toggleCategory = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const toggleTransmission = (transmission: string) => {
    setSelectedTransmission((prev) =>
      prev.includes(transmission)
        ? prev.filter((t) => t !== transmission)
        : [...prev, transmission]
    );
  };

  const toggleSeating = (seating: string) => {
    setSelectedSeating((prev) =>
      prev.includes(seating)
        ? prev.filter((s) => s !== seating)
        : [...prev, seating]
    );
  };

  const toggleFuelType = (fuelType: string) => {
    setSelectedFuelTypes((prev) =>
      prev.includes(fuelType)
        ? prev.filter((f) => f !== fuelType)
        : [...prev, fuelType]
    );
  };

  const clearFilters = () => {
    setPriceRange([0, 200]);
    setSelectedCategories([]);
    setSelectedTransmission([]);
    setSelectedSeating([]);
    setSelectedFuelTypes([]);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl mb-2">Browse Our Fleet</h1>
          <p className="text-gray-600">Find the perfect vehicle for your journey</p>
        </div>

        {/* Top Bar */}
        <div className="bg-white p-4 rounded-lg shadow-sm mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2"
            >
              <SlidersHorizontal className="w-4 h-4" />
              {showFilters ? "Hide Filters" : "Show Filters"}
            </Button>
            <div className="text-gray-600">
              Showing {filteredVehicles.length} of {availableVehicles.length} vehicles
            </div>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">Sort by:</span>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="popular">Most Popular</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="rating">Highest Rated</SelectItem>
                <SelectItem value="newest">Newest First</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex gap-6">
          {/* Filters Sidebar */}
          {showFilters && (
            <div className="w-64 flex-shrink-0">
              <Card className="sticky top-20">
                <CardContent className="p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="flex items-center gap-2">
                      <Filter className="w-4 h-4" />
                      Filters
                    </h3>
                    <Button variant="link" size="sm" onClick={clearFilters}>
                      Clear All
                    </Button>
                  </div>

                  {/* Price Range */}
                  <div className="mb-6">
                    <h4 className="mb-3">Price Range</h4>
                    <Slider
                      min={0}
                      max={200}
                      step={5}
                      value={priceRange}
                      onValueChange={setPriceRange}
                      className="mb-2"
                    />
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>${priceRange[0]}</span>
                      <span>${priceRange[1]}</span>
                    </div>
                  </div>

                  {/* Vehicle Type */}
                  <div className="mb-6">
                    <h4 className="mb-3">Vehicle Type</h4>
                    <div className="space-y-2">
                      {["Sedan", "SUV", "Pickup", "Luxury", "Van", "Electric"].map((category) => (
                        <div key={category} className="flex items-center gap-2">
                          <Checkbox
                            checked={selectedCategories.includes(category)}
                            onCheckedChange={() => toggleCategory(category)}
                          />
                          <label className="text-sm cursor-pointer" onClick={() => toggleCategory(category)}>
                            {category}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Transmission */}
                  <div className="mb-6">
                    <h4 className="mb-3">Transmission</h4>
                    <div className="space-y-2">
                      {["Automatic", "Manual"].map((transmission) => (
                        <div key={transmission} className="flex items-center gap-2">
                          <Checkbox
                            checked={selectedTransmission.includes(transmission)}
                            onCheckedChange={() => toggleTransmission(transmission)}
                          />
                          <label className="text-sm cursor-pointer" onClick={() => toggleTransmission(transmission)}>
                            {transmission}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Seating Capacity */}
                  <div className="mb-6">
                    <h4 className="mb-3">Seating Capacity</h4>
                    <div className="space-y-2">
                      {["2", "4", "5", "7", "8"].map((seating) => (
                        <div key={seating} className="flex items-center gap-2">
                          <Checkbox
                            checked={selectedSeating.includes(seating)}
                            onCheckedChange={() => toggleSeating(seating)}
                          />
                          <label className="text-sm cursor-pointer" onClick={() => toggleSeating(seating)}>
                            {seating === "7" || seating === "8" ? `${seating}+` : seating} seats
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Fuel Type */}
                  <div className="mb-6">
                    <h4 className="mb-3">Fuel Type</h4>
                    <div className="space-y-2">
                      {["Petrol", "Diesel", "Electric", "Hybrid"].map((fuelType) => (
                        <div key={fuelType} className="flex items-center gap-2">
                          <Checkbox
                            checked={selectedFuelTypes.includes(fuelType)}
                            onCheckedChange={() => toggleFuelType(fuelType)}
                          />
                          <label className="text-sm cursor-pointer" onClick={() => toggleFuelType(fuelType)}>
                            {fuelType}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Vehicle Grid */}
          <div className="flex-1">
            {filteredVehicles.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-lg">
                <p className="text-gray-500 mb-4">No vehicles found matching your filters</p>
                <Button onClick={clearFilters}>Clear Filters</Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredVehicles.map((vehicle) => (
                  <Card key={vehicle.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="h-48 overflow-hidden relative">
                      <ImageWithFallback
                        src={vehicle.primary_image_url}
                        alt={`${vehicle.make} ${vehicle.model}`}
                        className="w-full h-full object-cover hover:scale-105 transition-transform"
                      />
                      <div className="absolute top-2 right-2 bg-white px-2 py-1 rounded text-sm">
                        {vehicle.category}
                      </div>
                    </div>
                    <CardContent className="p-4">
                      <h3 className="mb-1">{vehicle.make} {vehicle.model}</h3>
                      <p className="text-sm text-gray-500 mb-2">{vehicle.year}</p>
                      
                      <div className="flex items-center gap-1 mb-3">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm">{vehicle.rating.toFixed(1)}</span>
                        <span className="text-sm text-gray-500">({vehicle.total_reviews})</span>
                      </div>

                      <div className="flex gap-2 text-xs text-gray-600 mb-3">
                        <span>🚗 {vehicle.transmission}</span>
                        <span>👥 {vehicle.seating_capacity} seats</span>
                        <span>⛽ {vehicle.fuel_type}</span>
                      </div>

                      <div className="border-t pt-3 mb-3">
                        <div className="flex justify-between items-center">
                          <div>
                            <div className="text-sm text-gray-500">Weekday</div>
                            <div className="text-lg text-blue-600">${vehicle.daily_rate_weekday}/day</div>
                          </div>
                          <div className="text-right">
                            <div className="text-sm text-gray-500">Weekend</div>
                            <div className="text-lg text-orange-600">${vehicle.daily_rate_weekend}/day</div>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onNavigate("vehicle-details", { id: vehicle.id })}
                        >
                          View Details
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
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
