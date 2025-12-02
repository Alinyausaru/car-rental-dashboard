import { Hono } from "npm:hono";
import * as kv from "./kv_store.tsx";

const app = new Hono();

// Seed demo data
app.post("/make-server-b43c05fb/seed-data", async (c) => {
  try {
    // Demo Vehicles
    const vehicles = [
      {
        id: "v1",
        make: "Toyota",
        model: "Camry",
        year: 2023,
        license_plate: "ABC-1234",
        vin_number: "1HGBH41JXMN109186",
        category: "Sedan",
        color: "Silver",
        transmission: "Automatic",
        fuel_type: "Petrol",
        seating_capacity: 5,
        mileage: "15,000 km",
        daily_rate_weekday: 45,
        daily_rate_weekend: 50,
        weekly_rate: 280,
        monthly_rate: 1000,
        deposit_amount: 200,
        images: ["https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=800"],
        primary_image_url: "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=800",
        features: ["Air Conditioning", "Bluetooth", "Backup Camera", "USB Charging", "Cruise Control"],
        availability_status: "Available",
        current_location: "Main Office",
        rating: 4.7,
        total_reviews: 23,
        utilization_rate: 75,
        total_revenue: 12500,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: "v2",
        make: "Honda",
        model: "CR-V",
        year: 2022,
        license_plate: "XYZ-5678",
        vin_number: "2HGBH41JXMN109187",
        category: "SUV",
        color: "Black",
        transmission: "Automatic",
        fuel_type: "Petrol",
        seating_capacity: 5,
        mileage: "22,000 km",
        daily_rate_weekday: 65,
        daily_rate_weekend: 70,
        weekly_rate: 420,
        monthly_rate: 1500,
        deposit_amount: 300,
        images: ["https://images.unsplash.com/photo-1619767886558-efdc259cde1a?w=800"],
        primary_image_url: "https://images.unsplash.com/photo-1619767886558-efdc259cde1a?w=800",
        features: ["Air Conditioning", "Bluetooth", "GPS Navigation", "Backup Camera", "Sunroof", "All-Wheel Drive"],
        availability_status: "Available",
        current_location: "Airport",
        rating: 4.8,
        total_reviews: 31,
        utilization_rate: 82,
        total_revenue: 18900,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: "v3",
        make: "Tesla",
        model: "Model 3",
        year: 2024,
        license_plate: "EV-9999",
        vin_number: "5YJ3E1EA1KF000001",
        category: "Electric",
        color: "White",
        transmission: "Automatic",
        fuel_type: "Electric",
        seating_capacity: 5,
        mileage: "5,000 km",
        daily_rate_weekday: 95,
        daily_rate_weekend: 105,
        weekly_rate: 630,
        monthly_rate: 2400,
        deposit_amount: 500,
        images: ["https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=800"],
        primary_image_url: "https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=800",
        features: ["Autopilot", "Bluetooth", "GPS Navigation", "Backup Camera", "Premium Audio", "Glass Roof"],
        availability_status: "Available",
        current_location: "City Center",
        rating: 4.9,
        total_reviews: 18,
        utilization_rate: 88,
        total_revenue: 9500,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: "v4",
        make: "Ford",
        model: "F-150",
        year: 2023,
        license_plate: "PKP-1111",
        vin_number: "1FTFW1E54KFA00001",
        category: "Pickup",
        color: "Blue",
        transmission: "Automatic",
        fuel_type: "Diesel",
        seating_capacity: 5,
        mileage: "18,000 km",
        daily_rate_weekday: 75,
        daily_rate_weekend: 85,
        weekly_rate: 490,
        monthly_rate: 1800,
        deposit_amount: 400,
        images: ["https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800"],
        primary_image_url: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800",
        features: ["Air Conditioning", "Bluetooth", "Backup Camera", "Towing Package", "4x4"],
        availability_status: "Available",
        current_location: "Main Office",
        rating: 4.6,
        total_reviews: 27,
        utilization_rate: 71,
        total_revenue: 15300,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: "v5",
        make: "BMW",
        model: "3 Series",
        year: 2023,
        license_plate: "LUX-3333",
        vin_number: "WBA8E9C51JNU00001",
        category: "Luxury",
        color: "Gray",
        transmission: "Automatic",
        fuel_type: "Petrol",
        seating_capacity: 5,
        mileage: "12,000 km",
        daily_rate_weekday: 85,
        daily_rate_weekend: 95,
        weekly_rate: 560,
        monthly_rate: 2100,
        deposit_amount: 450,
        images: ["https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800"],
        primary_image_url: "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800",
        features: ["Air Conditioning", "Bluetooth", "GPS Navigation", "Heated Seats", "Premium Audio", "Sunroof"],
        availability_status: "Available",
        current_location: "Airport",
        rating: 4.8,
        total_reviews: 22,
        utilization_rate: 79,
        total_revenue: 13600,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: "v6",
        make: "Chevrolet",
        model: "Suburban",
        year: 2022,
        license_plate: "VAN-7777",
        vin_number: "1GNSKCKD6NR000001",
        category: "Van",
        color: "Black",
        transmission: "Automatic",
        fuel_type: "Petrol",
        seating_capacity: 8,
        mileage: "25,000 km",
        daily_rate_weekday: 80,
        daily_rate_weekend: 90,
        weekly_rate: 520,
        monthly_rate: 1900,
        deposit_amount: 350,
        images: ["https://images.unsplash.com/photo-1527786356703-4b100091cd2c?w=800"],
        primary_image_url: "https://images.unsplash.com/photo-1527786356703-4b100091cd2c?w=800",
        features: ["Air Conditioning", "Bluetooth", "GPS Navigation", "3rd Row Seating", "Rear Entertainment"],
        availability_status: "Available",
        current_location: "Main Office",
        rating: 4.5,
        total_reviews: 19,
        utilization_rate: 68,
        total_revenue: 11200,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: "v7",
        make: "Mazda",
        model: "CX-5",
        year: 2023,
        license_plate: "SUV-4444",
        vin_number: "JM3KFBCL1N0000001",
        category: "SUV",
        color: "Red",
        transmission: "Automatic",
        fuel_type: "Petrol",
        seating_capacity: 5,
        mileage: "10,000 km",
        daily_rate_weekday: 60,
        daily_rate_weekend: 65,
        weekly_rate: 385,
        monthly_rate: 1400,
        deposit_amount: 280,
        images: ["https://images.unsplash.com/photo-1581847850285-fca8e8ebb65e?w=800"],
        primary_image_url: "https://images.unsplash.com/photo-1581847850285-fca8e8ebb65e?w=800",
        features: ["Air Conditioning", "Bluetooth", "Backup Camera", "Lane Assist", "Adaptive Cruise"],
        availability_status: "Available",
        current_location: "City Center",
        rating: 4.7,
        total_reviews: 25,
        utilization_rate: 76,
        total_revenue: 14100,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: "v8",
        make: "Nissan",
        model: "Altima",
        year: 2022,
        license_plate: "SED-2222",
        vin_number: "1N4BL4BV8NC000001",
        category: "Sedan",
        color: "Blue",
        transmission: "Automatic",
        fuel_type: "Petrol",
        seating_capacity: 5,
        mileage: "28,000 km",
        daily_rate_weekday: 40,
        daily_rate_weekend: 45,
        weekly_rate: 260,
        monthly_rate: 950,
        deposit_amount: 200,
        images: ["https://images.unsplash.com/photo-1590362891991-f776e747a588?w=800"],
        primary_image_url: "https://images.unsplash.com/photo-1590362891991-f776e747a588?w=800",
        features: ["Air Conditioning", "Bluetooth", "USB Charging", "Keyless Entry"],
        availability_status: "Available",
        current_location: "Airport",
        rating: 4.4,
        total_reviews: 20,
        utilization_rate: 70,
        total_revenue: 10800,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ];

    // Save vehicles
    for (const vehicle of vehicles) {
      await kv.set(`vehicle:${vehicle.id}`, vehicle);
    }

    // Demo Customers
    const customers = [
      {
        id: "c1",
        full_name: "John Mpofu",
        email: "john.mpofu@email.com",
        phone: "+263771234567",
        date_of_birth: "1985-03-15",
        age: 38,
        customer_segment: "VIP",
        total_bookings: 5,
        total_spent: 2450,
        loyalty_points: 245,
        created_at: "2023-01-15T10:00:00Z",
        last_rental_date: "2024-11-20",
      },
      {
        id: "c2",
        full_name: "Sarah Ncube",
        email: "sarah.ncube@email.com",
        phone: "+263772345678",
        date_of_birth: "1990-07-22",
        age: 33,
        customer_segment: "Returning",
        total_bookings: 3,
        total_spent: 1280,
        loyalty_points: 128,
        created_at: "2023-04-10T14:30:00Z",
        last_rental_date: "2024-10-15",
      },
      {
        id: "c3",
        full_name: "Michael Dube",
        email: "michael.dube@email.com",
        phone: "+263773456789",
        date_of_birth: "1992-11-08",
        age: 31,
        customer_segment: "New",
        total_bookings: 1,
        total_spent: 320,
        loyalty_points: 32,
        created_at: "2024-11-01T09:15:00Z",
        last_rental_date: "2024-11-05",
      },
    ];

    // Save customers
    for (const customer of customers) {
      await kv.set(`customer:${customer.id}`, customer);
    }

    // Demo Reviews
    const reviews = [
      {
        id: "r1",
        vehicle_id: "v1",
        customer_id: "c1",
        rating: 5,
        comment: "Excellent car! Very comfortable and fuel efficient. Will definitely rent again.",
        is_verified: true,
        created_at: "2024-11-22T16:30:00Z",
      },
      {
        id: "r2",
        vehicle_id: "v1",
        customer_id: "c2",
        rating: 4,
        comment: "Great car for city driving. Clean and well-maintained.",
        is_verified: true,
        created_at: "2024-10-18T11:20:00Z",
      },
      {
        id: "r3",
        vehicle_id: "v2",
        customer_id: "c1",
        rating: 5,
        comment: "Perfect SUV for our family road trip. Spacious and comfortable!",
        is_verified: true,
        created_at: "2024-09-10T14:45:00Z",
      },
      {
        id: "r4",
        vehicle_id: "v3",
        customer_id: "c2",
        rating: 5,
        comment: "Amazing electric car experience! Smooth, quiet, and eco-friendly.",
        is_verified: true,
        created_at: "2024-10-20T10:15:00Z",
      },
      {
        id: "r5",
        vehicle_id: "v4",
        customer_id: "c3",
        rating: 4,
        comment: "Powerful truck, great for moving furniture. Handles well.",
        is_verified: true,
        created_at: "2024-11-07T13:00:00Z",
      },
      {
        id: "r6",
        vehicle_id: "v5",
        customer_id: "c1",
        rating: 5,
        comment: "Luxury at its finest. Perfect for business meetings.",
        is_verified: true,
        created_at: "2024-08-15T09:30:00Z",
      },
    ];

    // Save reviews
    for (const review of reviews) {
      await kv.set(`review:${review.id}`, review);
    }

    return c.json({
      success: true,
      message: "Demo data seeded successfully",
      data: {
        vehicles: vehicles.length,
        customers: customers.length,
        reviews: reviews.length,
      },
    });
  } catch (error) {
    console.error("Error seeding data:", error);
    return c.json({ success: false, error: "Failed to seed data" }, 500);
  }
});

// Clear all data
app.delete("/make-server-b43c05fb/clear-data", async (c) => {
  try {
    // This is a simple implementation - in production you'd want proper authorization
    const vehicles = await kv.getByPrefix("vehicle:");
    const customers = await kv.getByPrefix("customer:");
    const bookings = await kv.getByPrefix("booking:");
    const reviews = await kv.getByPrefix("review:");

    const vehicleKeys = vehicles.map((v: any) => `vehicle:${v.id}`);
    const customerKeys = customers.map((c: any) => `customer:${c.id}`);
    const bookingKeys = bookings.map((b: any) => `booking:${b.id}`);
    const reviewKeys = reviews.map((r: any) => `review:${r.id}`);

    await kv.mdel([...vehicleKeys, ...customerKeys, ...bookingKeys, ...reviewKeys]);

    return c.json({
      success: true,
      message: "All data cleared",
      deleted: {
        vehicles: vehicleKeys.length,
        customers: customerKeys.length,
        bookings: bookingKeys.length,
        reviews: reviewKeys.length,
      },
    });
  } catch (error) {
    console.error("Error clearing data:", error);
    return c.json({ success: false, error: "Failed to clear data" }, 500);
  }
});

export default app;
