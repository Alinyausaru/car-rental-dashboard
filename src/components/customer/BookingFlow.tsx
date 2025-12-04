import { useState, useEffect } from "react";
import { ArrowLeft, ArrowRight, Check, Calendar, CreditCard, FileText } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Card, CardContent } from "../ui/card";
import { Checkbox } from "../ui/checkbox";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { toast } from "sonner@2.0.3";
import { eventTracker } from "../../utils/eventTracking";
import type { Vehicle, BookingFormData } from "../../types";
import { bookingsApi } from "../../utils/api";
import { ImageWithFallback } from "../figma/ImageWithFallback";

interface BookingFlowProps {
  vehicle: Vehicle;
  onNavigate: (page: string, params?: any) => void;
  user: any;
}

export function BookingFlow({ vehicle, onNavigate, user }: BookingFlowProps) {
  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5>(1);
  const [bookingData, setBookingData] = useState<Partial<BookingFormData>>({
    vehicle_id: vehicle.id,
    pickup_location: "",
    pickup_date: "",
    pickup_time: "09:00",
    return_location: "",
    return_date: "",
    return_time: "17:00",
    addons: {
      insurance: false,
      gps: false,
      childSeat: false,
      additionalDriver: false,
      roadsideAssistance: false,
    },
    fuel_option: "Full_to_Full",
    payment_method: "Pay_on_Pickup",
    customer: {
      full_name: "",
      email: "",
      phone: "",
      date_of_birth: "",
      drivers_license_number: "",
      license_expiry_date: "",
      id_passport_number: "",
    },
    create_account: false,
    agree_to_terms: false,
  });
  const [loading, setLoading] = useState(false);
  const [confirmationData, setConfirmationData] = useState<any>(null);

  // Track booking started when component mounts
  useEffect(() => {
    const pricing = calculatePricing();
    eventTracker.trackBookingStarted(vehicle, {
      pickup_location: bookingData.pickup_location,
      pickup_date: bookingData.pickup_date,
      return_date: bookingData.return_date,
      estimated_total: pricing.total,
    }, user);
  }, []);

  // Track when user leaves the page without completing
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (step < 5 && !confirmationData) {
        const pricing = calculatePricing();
        const stepNames = ["dates", "extras", "customer-info", "payment", "review"];
        eventTracker.trackBookingAbandoned(stepNames[step - 1], vehicle, {
          pickup_location: bookingData.pickup_location,
          pickup_date: bookingData.pickup_date,
          return_date: bookingData.return_date,
          total_price: pricing.total,
          extras: Object.keys(bookingData.addons || {}).filter(k => bookingData.addons?.[k]),
        }, user);
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [step, confirmationData, bookingData, user]);

  const calculatePricing = () => {
    if (!bookingData.pickup_date || !bookingData.return_date) {
      return {
        days: 0,
        basePrice: 0,
        addonsPrice: 0,
        subtotal: 0,
        tax: 0,
        deposit: vehicle.deposit_amount,
        total: 0,
      };
    }

    const pickup = new Date(bookingData.pickup_date);
    const returnDate = new Date(bookingData.return_date);
    const days = Math.ceil((returnDate.getTime() - pickup.getTime()) / (1000 * 60 * 60 * 24));
    
    const basePrice = days * vehicle.daily_rate_weekday;
    
    let addonsPrice = 0;
    if (bookingData.addons?.insurance) addonsPrice += days * 25;
    if (bookingData.addons?.gps) addonsPrice += days * 10;
    if (bookingData.addons?.childSeat) addonsPrice += days * 8;
    if (bookingData.addons?.additionalDriver) addonsPrice += days * 15;
    if (bookingData.addons?.roadsideAssistance) addonsPrice += days * 5;
    if (bookingData.fuel_option === "Pre_purchase") addonsPrice += 60;

    const subtotal = basePrice + addonsPrice;
    const tax = subtotal * 0.15; // 15% tax
    const total = subtotal + tax;

    return {
      days,
      basePrice,
      addonsPrice,
      subtotal,
      tax,
      deposit: vehicle.deposit_amount,
      total,
    };
  };

  const pricing = calculatePricing();

  const handleNext = () => {
    if (step === 1 && (!bookingData.pickup_date || !bookingData.return_date || !bookingData.pickup_location)) {
      toast.error("Please fill in all date and location fields");
      return;
    }
    if (step < 5) setStep((step + 1) as any);
  };

  const handleBack = () => {
    if (step > 1) setStep((step - 1) as any);
  };

  const handleConfirmBooking = async () => {
    if (!bookingData.agree_to_terms) {
      toast.error("Please agree to the terms and conditions");
      return;
    }

    setLoading(true);
    
    // Track payment attempt
    eventTracker.trackPaymentAttempted(pricing.total, {
      vehicle_name: `${vehicle.make} ${vehicle.model}`,
      payment_method: bookingData.payment_method,
    }, user);
    
    try {
      const booking = {
        vehicle_id: vehicle.id,
        pickup_date: bookingData.pickup_date!,
        pickup_time: bookingData.pickup_time!,
        pickup_location: bookingData.pickup_location!,
        return_date: bookingData.return_date!,
        return_time: bookingData.return_time!,
        return_location: bookingData.return_location || bookingData.pickup_location!,
        total_days: pricing.days,
        base_price: pricing.basePrice,
        addons: bookingData.addons!,
        addons_price: pricing.addonsPrice,
        fuel_option: bookingData.fuel_option!,
        subtotal: pricing.subtotal,
        tax: pricing.tax,
        deposit: pricing.deposit,
        total_price: pricing.total,
        payment_method: bookingData.payment_method!,
        customer: bookingData.customer,
      };

      const response = await bookingsApi.create(booking);
      
      if (response.success) {
        // Track successful payment
        eventTracker.trackPaymentSuccess(pricing.total, {
          vehicle_name: `${vehicle.make} ${vehicle.model}`,
          payment_method: bookingData.payment_method,
        }, user);
        
        // Track completed booking
        eventTracker.trackBookingCompleted({
          id: response.data.booking.id,
          confirmation_number: response.data.booking.booking_reference,
          vehicle_id: vehicle.id,
          vehicle_name: `${vehicle.make} ${vehicle.model}`,
          pickup_location: bookingData.pickup_location,
          pickup_date: bookingData.pickup_date,
          return_date: bookingData.return_date,
          total_amount: pricing.total,
          extras: Object.keys(bookingData.addons || {}).filter(k => bookingData.addons?.[k]),
        }, user);
        
        setConfirmationData(response.data);
        setStep(5);
        toast.success("Booking confirmed!");
      } else {
        throw new Error(response.error);
      }
    } catch (error: any) {
      // Track failed payment
      eventTracker.trackPaymentFailed(pricing.total, error.message, {
        vehicle_name: `${vehicle.make} ${vehicle.model}`,
        payment_method: bookingData.payment_method,
      }, user);
      
      toast.error(error.message || "Failed to create booking");
    } finally {
      setLoading(false);
    }
  };

  if (step === 5 && confirmationData) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-3xl mx-auto px-4">
          <Card>
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-3xl mb-2">🎉 Booking Confirmed!</h1>
              <p className="text-gray-600 mb-6">
                Your rental is confirmed. We've sent the details to your email.
              </p>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <div className="text-sm text-gray-600 mb-1">Booking Reference</div>
                <div className="text-2xl text-blue-600">
                  {confirmationData.booking.booking_reference}
                </div>
              </div>

              <Card className="text-left mb-6">
                <CardContent className="p-4">
                  <div className="flex gap-4 mb-4">
                    <ImageWithFallback
                      src={vehicle.primary_image_url}
                      alt={vehicle.make}
                      className="w-32 h-24 object-cover rounded"
                    />
                    <div>
                      <h3>{vehicle.make} {vehicle.model}</h3>
                      <p className="text-sm text-gray-600">{vehicle.year} • {vehicle.category}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="text-gray-600">Pickup</div>
                      <div>{new Date(bookingData.pickup_date!).toLocaleDateString()}</div>
                      <div>{bookingData.pickup_time}</div>
                      <div>{bookingData.pickup_location}</div>
                    </div>
                    <div>
                      <div className="text-gray-600">Return</div>
                      <div>{new Date(bookingData.return_date!).toLocaleDateString()}</div>
                      <div>{bookingData.return_time}</div>
                      <div>{bookingData.return_location || bookingData.pickup_location}</div>
                    </div>
                  </div>

                  <div className="border-t mt-4 pt-4 flex justify-between">
                    <span>Total Amount:</span>
                    <span className="text-xl text-blue-600">${pricing.total.toFixed(2)}</span>
                  </div>
                </CardContent>
              </Card>

              <div className="bg-gray-50 rounded-lg p-6 mb-6 text-left">
                <h3 className="mb-4">What's Next?</h3>
                <ol className="space-y-2 text-sm">
                  <li className="flex gap-2">
                    <span>1.</span>
                    <span>Check your email for confirmation details</span>
                  </li>
                  <li className="flex gap-2">
                    <span>2.</span>
                    <span>Bring required documents (ID, driver's license)</span>
                  </li>
                  <li className="flex gap-2">
                    <span>3.</span>
                    <span>Pick up your car on {new Date(bookingData.pickup_date!).toLocaleDateString()}</span>
                  </li>
                </ol>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Button variant="outline" onClick={() => onNavigate("home")}>
                  Book Another Car
                </Button>
                <Button onClick={() => onNavigate("bookings")} className="bg-blue-600">
                  View My Bookings
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-5xl mx-auto px-4">
        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-8">
          {[1, 2, 3, 4].map((s) => (
            <div key={s} className="flex items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  step >= s ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-600"
                }`}
              >
                {s}
              </div>
              {s < 4 && (
                <div
                  className={`w-16 h-1 ${step > s ? "bg-blue-600" : "bg-gray-200"}`}
                />
              )}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card>
              <CardContent className="p-6">
                {/* Step 1: Dates & Location */}
                {step === 1 && (
                  <div>
                    <h2 className="text-2xl mb-6">Select Dates & Location</h2>
                    
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm mb-2">Pickup Date</label>
                          <Input
                            type="date"
                            value={bookingData.pickup_date}
                            onChange={(e) =>
                              setBookingData({ ...bookingData, pickup_date: e.target.value })
                            }
                            min={new Date().toISOString().split("T")[0]}
                          />
                        </div>
                        <div>
                          <label className="block text-sm mb-2">Pickup Time</label>
                          <Input
                            type="time"
                            value={bookingData.pickup_time}
                            onChange={(e) =>
                              setBookingData({ ...bookingData, pickup_time: e.target.value })
                            }
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm mb-2">Pickup Location</label>
                        <Select
                          value={bookingData.pickup_location}
                          onValueChange={(value) =>
                            setBookingData({ ...bookingData, pickup_location: value })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select location" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Main Office">Main Office</SelectItem>
                            <SelectItem value="Airport">Airport</SelectItem>
                            <SelectItem value="City Center">City Center</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm mb-2">Return Date</label>
                          <Input
                            type="date"
                            value={bookingData.return_date}
                            onChange={(e) =>
                              setBookingData({ ...bookingData, return_date: e.target.value })
                            }
                            min={bookingData.pickup_date || new Date().toISOString().split("T")[0]}
                          />
                        </div>
                        <div>
                          <label className="block text-sm mb-2">Return Time</label>
                          <Input
                            type="time"
                            value={bookingData.return_time}
                            onChange={(e) =>
                              setBookingData({ ...bookingData, return_time: e.target.value })
                            }
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm mb-2">Return Location</label>
                        <Input
                          placeholder="Same as pickup"
                          value={bookingData.return_location}
                          onChange={(e) =>
                            setBookingData({ ...bookingData, return_location: e.target.value })
                          }
                        />
                      </div>

                      {pricing.days > 0 && (
                        <div className="bg-blue-50 p-4 rounded-lg">
                          <div className="flex justify-between mb-2">
                            <span>Total Rental Days:</span>
                            <span>{pricing.days} days</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Base Price:</span>
                            <span>${pricing.basePrice.toFixed(2)}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Step 2: Add-ons */}
                {step === 2 && (
                  <div>
                    <h2 className="text-2xl mb-6">Add-ons & Extras</h2>
                    
                    <div className="space-y-4">
                      <div className="border rounded-lg p-4">
                        <div className="flex items-start gap-3">
                          <Checkbox
                            checked={bookingData.addons?.insurance}
                            onCheckedChange={(checked) =>
                              setBookingData({
                                ...bookingData,
                                addons: { ...bookingData.addons!, insurance: checked as boolean },
                              })
                            }
                          />
                          <div className="flex-1">
                            <h4>Full Insurance Coverage</h4>
                            <p className="text-sm text-gray-600">Peace of mind with zero excess</p>
                          </div>
                          <div className="text-blue-600">+$25/day</div>
                        </div>
                      </div>

                      <div className="border rounded-lg p-4">
                        <div className="flex items-start gap-3">
                          <Checkbox
                            checked={bookingData.addons?.gps}
                            onCheckedChange={(checked) =>
                              setBookingData({
                                ...bookingData,
                                addons: { ...bookingData.addons!, gps: checked as boolean },
                              })
                            }
                          />
                          <div className="flex-1">
                            <h4>GPS Navigation Device</h4>
                            <p className="text-sm text-gray-600">Never get lost</p>
                          </div>
                          <div className="text-blue-600">+$10/day</div>
                        </div>
                      </div>

                      <div className="border rounded-lg p-4">
                        <div className="flex items-start gap-3">
                          <Checkbox
                            checked={bookingData.addons?.childSeat}
                            onCheckedChange={(checked) =>
                              setBookingData({
                                ...bookingData,
                                addons: { ...bookingData.addons!, childSeat: checked as boolean },
                              })
                            }
                          />
                          <div className="flex-1">
                            <h4>Child Safety Seat</h4>
                            <p className="text-sm text-gray-600">For children 2-7 years</p>
                          </div>
                          <div className="text-blue-600">+$8/day</div>
                        </div>
                      </div>

                      <div className="border rounded-lg p-4">
                        <div className="flex items-start gap-3">
                          <Checkbox
                            checked={bookingData.addons?.additionalDriver}
                            onCheckedChange={(checked) =>
                              setBookingData({
                                ...bookingData,
                                addons: { ...bookingData.addons!, additionalDriver: checked as boolean },
                              })
                            }
                          />
                          <div className="flex-1">
                            <h4>Additional Driver</h4>
                            <p className="text-sm text-gray-600">Share the driving</p>
                          </div>
                          <div className="text-blue-600">+$15/day</div>
                        </div>
                      </div>

                      <div className="border rounded-lg p-4">
                        <div className="flex items-start gap-3">
                          <Checkbox
                            checked={bookingData.addons?.roadsideAssistance}
                            onCheckedChange={(checked) =>
                              setBookingData({
                                ...bookingData,
                                addons: { ...bookingData.addons!, roadsideAssistance: checked as boolean },
                              })
                            }
                          />
                          <div className="flex-1">
                            <h4>Roadside Assistance 24/7</h4>
                            <p className="text-sm text-gray-600">Emergency support</p>
                          </div>
                          <div className="text-blue-600">+$5/day</div>
                        </div>
                      </div>

                      <div>
                        <h4 className="mb-3">Fuel Options</h4>
                        <RadioGroup
                          value={bookingData.fuel_option}
                          onValueChange={(value: any) =>
                            setBookingData({ ...bookingData, fuel_option: value })
                          }
                        >
                          <div className="border rounded-lg p-4 flex items-start gap-3">
                            <RadioGroupItem value="Full_to_Full" id="full" />
                            <label htmlFor="full" className="flex-1 cursor-pointer">
                              <div>Full-to-Full (Free)</div>
                              <p className="text-sm text-gray-600">Return with full tank</p>
                            </label>
                          </div>
                          <div className="border rounded-lg p-4 flex items-start gap-3">
                            <RadioGroupItem value="Pre_purchase" id="prepurchase" />
                            <label htmlFor="prepurchase" className="flex-1 cursor-pointer">
                              <div>Pre-purchase Fuel ($60)</div>
                              <p className="text-sm text-gray-600">We'll fill it up for you</p>
                            </label>
                          </div>
                        </RadioGroup>
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 3: Customer Information */}
                {step === 3 && (
                  <div>
                    <h2 className="text-2xl mb-6">Your Information</h2>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm mb-2">Full Name *</label>
                        <Input
                          value={bookingData.customer?.full_name}
                          onChange={(e) =>
                            setBookingData({
                              ...bookingData,
                              customer: { ...bookingData.customer!, full_name: e.target.value },
                            })
                          }
                          required
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm mb-2">Email *</label>
                          <Input
                            type="email"
                            value={bookingData.customer?.email}
                            onChange={(e) =>
                              setBookingData({
                                ...bookingData,
                                customer: { ...bookingData.customer!, email: e.target.value },
                              })
                            }
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm mb-2">Phone *</label>
                          <Input
                            type="tel"
                            value={bookingData.customer?.phone}
                            onChange={(e) =>
                              setBookingData({
                                ...bookingData,
                                customer: { ...bookingData.customer!, phone: e.target.value },
                              })
                            }
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm mb-2">Date of Birth *</label>
                        <Input
                          type="date"
                          value={bookingData.customer?.date_of_birth}
                          onChange={(e) =>
                            setBookingData({
                              ...bookingData,
                              customer: { ...bookingData.customer!, date_of_birth: e.target.value },
                            })
                          }
                          required
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm mb-2">Driver's License Number *</label>
                          <Input
                            value={bookingData.customer?.drivers_license_number}
                            onChange={(e) =>
                              setBookingData({
                                ...bookingData,
                                customer: { ...bookingData.customer!, drivers_license_number: e.target.value },
                              })
                            }
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm mb-2">License Expiry Date *</label>
                          <Input
                            type="date"
                            value={bookingData.customer?.license_expiry_date}
                            onChange={(e) =>
                              setBookingData({
                                ...bookingData,
                                customer: { ...bookingData.customer!, license_expiry_date: e.target.value },
                              })
                            }
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm mb-2">ID/Passport Number *</label>
                        <Input
                          value={bookingData.customer?.id_passport_number}
                          onChange={(e) =>
                            setBookingData({
                              ...bookingData,
                              customer: { ...bookingData.customer!, id_passport_number: e.target.value },
                            })
                          }
                          required
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 4: Review & Payment */}
                {step === 4 && (
                  <div>
                    <h2 className="text-2xl mb-6">Review & Payment</h2>

                    <div className="space-y-6">
                      <div>
                        <h3 className="mb-3">Booking Summary</h3>
                        <div className="bg-gray-50 rounded-lg p-4 space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span>Rental Period</span>
                            <span>{pricing.days} days</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Base Price</span>
                            <span>${pricing.basePrice.toFixed(2)}</span>
                          </div>
                          {pricing.addonsPrice > 0 && (
                            <div className="flex justify-between">
                              <span>Add-ons</span>
                              <span>${pricing.addonsPrice.toFixed(2)}</span>
                            </div>
                          )}
                          <div className="flex justify-between">
                            <span>Subtotal</span>
                            <span>${pricing.subtotal.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Tax (15%)</span>
                            <span>${pricing.tax.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Deposit (refundable)</span>
                            <span>${pricing.deposit.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between border-t pt-2">
                            <span>Total</span>
                            <span className="text-xl text-blue-600">${pricing.total.toFixed(2)}</span>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h3 className="mb-3">Payment Method</h3>
                        <RadioGroup
                          value={bookingData.payment_method}
                          onValueChange={(value: any) =>
                            setBookingData({ ...bookingData, payment_method: value })
                          }
                        >
                          <div className="border rounded-lg p-3 flex items-center gap-3">
                            <RadioGroupItem value="Pay_on_Pickup" id="pickup" />
                            <label htmlFor="pickup" className="flex-1 cursor-pointer">
                              Pay on Pickup (Cash/Card at counter)
                            </label>
                          </div>
                          <div className="border rounded-lg p-3 flex items-center gap-3">
                            <RadioGroupItem value="Bank_Transfer" id="bank" />
                            <label htmlFor="bank" className="flex-1 cursor-pointer">
                              Bank Transfer
                            </label>
                          </div>
                          <div className="border rounded-lg p-3 flex items-center gap-3">
                            <RadioGroupItem value="EcoCash" id="ecocash" />
                            <label htmlFor="ecocash" className="flex-1 cursor-pointer">
                              EcoCash
                            </label>
                          </div>
                        </RadioGroup>
                      </div>

                      <div className="flex items-start gap-2">
                        <Checkbox
                          id="terms"
                          checked={bookingData.agree_to_terms}
                          onCheckedChange={(checked) =>
                            setBookingData({ ...bookingData, agree_to_terms: checked as boolean })
                          }
                        />
                        <label htmlFor="terms" className="text-sm cursor-pointer">
                          I agree to the rental terms and conditions
                        </label>
                      </div>
                    </div>
                  </div>
                )}

                {/* Navigation Buttons */}
                <div className="flex gap-4 mt-8">
                  {step > 1 && (
                    <Button variant="outline" onClick={handleBack}>
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Back
                    </Button>
                  )}
                  {step < 4 ? (
                    <Button onClick={handleNext} className="flex-1 bg-blue-600">
                      Continue
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  ) : (
                    <Button
                      onClick={handleConfirmBooking}
                      className="flex-1 bg-orange-500 hover:bg-orange-600"
                      disabled={loading}
                    >
                      {loading ? "Processing..." : "Confirm Booking"}
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar - Vehicle Summary */}
          <div>
            <Card className="sticky top-20">
              <CardContent className="p-4">
                <h3 className="mb-3">Your Selection</h3>
                <ImageWithFallback
                  src={vehicle.primary_image_url}
                  alt={vehicle.make}
                  className="w-full h-32 object-cover rounded mb-3"
                />
                <h4>{vehicle.make} {vehicle.model}</h4>
                <p className="text-sm text-gray-600 mb-4">
                  {vehicle.year} • {vehicle.category}
                </p>
                
                {pricing.days > 0 && (
                  <div className="border-t pt-4 space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Base Rate</span>
                      <span>${vehicle.daily_rate_weekday}/day</span>
                    </div>
                    <div className="flex justify-between">
                      <span>{pricing.days} days</span>
                      <span>${pricing.basePrice.toFixed(2)}</span>
                    </div>
                    {pricing.addonsPrice > 0 && (
                      <div className="flex justify-between">
                        <span>Add-ons</span>
                        <span>${pricing.addonsPrice.toFixed(2)}</span>
                      </div>
                    )}
                    <div className="flex justify-between border-t pt-2">
                      <span>Total</span>
                      <span className="text-lg text-blue-600">${pricing.total.toFixed(2)}</span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}