export interface Vehicle {
  id: string;
  make: string;
  model: string;
  year: number;
  license_plate: string;
  vin_number?: string;
  category: "Sedan" | "SUV" | "Pickup" | "Luxury" | "Van" | "Electric";
  color: string;
  transmission: "Automatic" | "Manual";
  fuel_type: "Petrol" | "Diesel" | "Electric" | "Hybrid";
  seating_capacity: number;
  mileage: string;
  daily_rate_weekday: number;
  daily_rate_weekend: number;
  weekly_rate: number;
  monthly_rate: number;
  deposit_amount: number;
  images: string[];
  primary_image_url: string;
  features: string[];
  availability_status: "Available" | "Rented" | "Maintenance" | "Out_of_Service";
  current_location: string;
  rating: number;
  total_reviews: number;
  utilization_rate?: number;
  total_revenue?: number;
  created_at: string;
  updated_at: string;
}

export interface Customer {
  id: string;
  user_id?: string;
  full_name: string;
  email: string;
  phone: string;
  date_of_birth?: string;
  age?: number;
  drivers_license_number?: string;
  license_expiry_date?: string;
  id_passport_number?: string;
  address?: string;
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
  profile_photo_url?: string;
  id_photo_url?: string;
  license_photo_url?: string;
  customer_segment?: "New" | "Returning" | "VIP" | "High_Value" | "At_Risk";
  total_bookings: number;
  total_spent: number;
  average_rental_duration?: number;
  favorite_vehicle_type?: string;
  loyalty_points: number;
  flags?: string[];
  internal_notes?: string;
  created_at: string;
  last_rental_date?: string;
}

export interface Booking {
  id: string;
  booking_reference: string;
  customer_id: string;
  vehicle_id: string;
  pickup_date: string;
  pickup_time: string;
  pickup_location: string;
  return_date: string;
  return_time: string;
  return_location: string;
  total_days: number;
  base_price: number;
  addons: {
    insurance?: boolean;
    gps?: boolean;
    childSeat?: boolean;
    additionalDriver?: boolean;
    roadsideAssistance?: boolean;
  };
  addons_price: number;
  fuel_option: "Full_to_Full" | "Pre_purchase";
  subtotal: number;
  tax: number;
  deposit: number;
  total_price: number;
  status: "Pending" | "Confirmed" | "Active" | "Completed" | "Cancelled";
  payment_status: "Pending" | "Partial" | "Paid" | "Refunded";
  payment_method: "Pay_on_Pickup" | "Bank_Transfer" | "EcoCash" | "OneMoney" | "Card";
  special_instructions?: string;
  created_at: string;
  confirmed_at?: string;
  picked_up_at?: string;
  returned_at?: string;
  cancelled_at?: string;
}

export interface Review {
  id: string;
  vehicle_id: string;
  customer_id: string;
  booking_id?: string;
  rating: 1 | 2 | 3 | 4 | 5;
  comment: string;
  created_at: string;
  is_verified: boolean;
}

export interface Invoice {
  id: string;
  invoice_number: string;
  booking_id: string;
  customer_id: string;
  issue_date: string;
  due_date: string;
  subtotal: number;
  tax: number;
  deposit: number;
  total_amount: number;
  amount_paid: number;
  balance_due: number;
  status: "Paid" | "Pending" | "Partial" | "Overdue";
  payment_terms: string;
  created_at: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  status: "New" | "Read" | "Responded";
  created_at: string;
}

export type BookingStep = 1 | 2 | 3 | 4 | 5;

export interface BookingFormData {
  vehicle_id: string;
  pickup_date: string;
  pickup_time: string;
  pickup_location: string;
  return_date: string;
  return_time: string;
  return_location: string;
  total_days: number;
  base_price: number;
  addons: {
    insurance: boolean;
    gps: boolean;
    childSeat: boolean;
    additionalDriver: boolean;
    roadsideAssistance: boolean;
  };
  addons_price: number;
  fuel_option: "Full_to_Full" | "Pre_purchase";
  subtotal: number;
  tax: number;
  deposit: number;
  total_price: number;
  payment_method: "Pay_on_Pickup" | "Bank_Transfer" | "EcoCash" | "OneMoney" | "Card";
  customer: {
    full_name: string;
    email: string;
    phone: string;
    date_of_birth: string;
    drivers_license_number: string;
    license_expiry_date: string;
    id_passport_number: string;
    address?: string;
    emergency_contact_name?: string;
    emergency_contact_phone?: string;
  };
  special_instructions?: string;
  create_account: boolean;
  password?: string;
  agree_to_terms: boolean;
}
