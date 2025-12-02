import { Hono } from "npm:hono";
import { createClient } from "npm:@supabase/supabase-js";
import * as kv from "./kv_store.tsx";

const app = new Hono();

// Initialize Supabase client
const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
);

// Helper function to generate booking reference
function generateBookingReference(): string {
  const prefix = "BK";
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.random().toString(36).substring(2, 5).toUpperCase();
  return `${prefix}-${timestamp}${random}`;
}

// Helper function to generate invoice number
function generateInvoiceNumber(): string {
  const prefix = "INV";
  const timestamp = Date.now().toString().slice(-8);
  return `${prefix}-${timestamp}`;
}

// ==================== VEHICLES ====================

// Get all vehicles
app.get("/make-server-b43c05fb/vehicles", async (c) => {
  try {
    const vehicles = await kv.getByPrefix("vehicle:");
    return c.json({ success: true, data: vehicles });
  } catch (error) {
    console.error("Error fetching vehicles:", error);
    return c.json({ success: false, error: "Failed to fetch vehicles" }, 500);
  }
});

// Get vehicle by ID
app.get("/make-server-b43c05fb/vehicles/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const vehicle = await kv.get(`vehicle:${id}`);
    if (!vehicle) {
      return c.json({ success: false, error: "Vehicle not found" }, 404);
    }
    return c.json({ success: true, data: vehicle });
  } catch (error) {
    console.error("Error fetching vehicle:", error);
    return c.json({ success: false, error: "Failed to fetch vehicle" }, 500);
  }
});

// Create vehicle (admin only)
app.post("/make-server-b43c05fb/vehicles", async (c) => {
  try {
    const accessToken = c.req.header("Authorization")?.split(" ")[1];
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    
    if (!user || authError) {
      return c.json({ success: false, error: "Unauthorized" }, 401);
    }

    const vehicleData = await c.req.json();
    const id = crypto.randomUUID();
    
    const vehicle = {
      id,
      ...vehicleData,
      rating: 0,
      total_reviews: 0,
      utilization_rate: 0,
      total_revenue: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    await kv.set(`vehicle:${id}`, vehicle);
    return c.json({ success: true, data: vehicle });
  } catch (error) {
    console.error("Error creating vehicle:", error);
    return c.json({ success: false, error: "Failed to create vehicle" }, 500);
  }
});

// Update vehicle (admin only)
app.put("/make-server-b43c05fb/vehicles/:id", async (c) => {
  try {
    const accessToken = c.req.header("Authorization")?.split(" ")[1];
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    
    if (!user || authError) {
      return c.json({ success: false, error: "Unauthorized" }, 401);
    }

    const id = c.req.param("id");
    const updates = await c.req.json();
    const existing = await kv.get(`vehicle:${id}`);
    
    if (!existing) {
      return c.json({ success: false, error: "Vehicle not found" }, 404);
    }

    const updated = {
      ...existing,
      ...updates,
      id,
      updated_at: new Date().toISOString(),
    };

    await kv.set(`vehicle:${id}`, updated);
    return c.json({ success: true, data: updated });
  } catch (error) {
    console.error("Error updating vehicle:", error);
    return c.json({ success: false, error: "Failed to update vehicle" }, 500);
  }
});

// ==================== CUSTOMERS ====================

// Get customer by user ID
app.get("/make-server-b43c05fb/customers/me", async (c) => {
  try {
    const accessToken = c.req.header("Authorization")?.split(" ")[1];
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    
    if (!user || authError) {
      return c.json({ success: false, error: "Unauthorized" }, 401);
    }

    const customer = await kv.get(`customer:user:${user.id}`);
    return c.json({ success: true, data: customer });
  } catch (error) {
    console.error("Error fetching customer:", error);
    return c.json({ success: false, error: "Failed to fetch customer" }, 500);
  }
});

// Get all customers (admin only)
app.get("/make-server-b43c05fb/customers", async (c) => {
  try {
    const accessToken = c.req.header("Authorization")?.split(" ")[1];
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    
    if (!user || authError) {
      return c.json({ success: false, error: "Unauthorized" }, 401);
    }

    const customers = await kv.getByPrefix("customer:");
    return c.json({ success: true, data: customers });
  } catch (error) {
    console.error("Error fetching customers:", error);
    return c.json({ success: false, error: "Failed to fetch customers" }, 500);
  }
});

// Create or update customer profile
app.post("/make-server-b43c05fb/customers", async (c) => {
  try {
    const accessToken = c.req.header("Authorization")?.split(" ")[1];
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    
    if (!user || authError) {
      return c.json({ success: false, error: "Unauthorized" }, 401);
    }

    const customerData = await c.req.json();
    const customerId = customerData.id || crypto.randomUUID();
    
    const customer = {
      id: customerId,
      user_id: user.id,
      ...customerData,
      total_bookings: customerData.total_bookings || 0,
      total_spent: customerData.total_spent || 0,
      customer_segment: customerData.customer_segment || "New",
      loyalty_points: customerData.loyalty_points || 0,
      created_at: customerData.created_at || new Date().toISOString(),
    };

    await kv.set(`customer:${customerId}`, customer);
    await kv.set(`customer:user:${user.id}`, customer);
    
    return c.json({ success: true, data: customer });
  } catch (error) {
    console.error("Error creating/updating customer:", error);
    return c.json({ success: false, error: "Failed to save customer" }, 500);
  }
});

// ==================== BOOKINGS ====================

// Get all bookings (with filters)
app.get("/make-server-b43c05fb/bookings", async (c) => {
  try {
    const accessToken = c.req.header("Authorization")?.split(" ")[1];
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    
    if (!user || authError) {
      return c.json({ success: false, error: "Unauthorized" }, 401);
    }

    const allBookings = await kv.getByPrefix("booking:");
    
    // Filter bookings based on user role
    const customer = await kv.get(`customer:user:${user.id}`);
    const isAdmin = user.user_metadata?.role === "admin";
    
    let bookings = allBookings;
    if (!isAdmin && customer) {
      bookings = allBookings.filter((b: any) => b.customer_id === customer.id);
    }

    return c.json({ success: true, data: bookings });
  } catch (error) {
    console.error("Error fetching bookings:", error);
    return c.json({ success: false, error: "Failed to fetch bookings" }, 500);
  }
});

// Get booking by ID
app.get("/make-server-b43c05fb/bookings/:id", async (c) => {
  try {
    const accessToken = c.req.header("Authorization")?.split(" ")[1];
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    
    if (!user || authError) {
      return c.json({ success: false, error: "Unauthorized" }, 401);
    }

    const id = c.req.param("id");
    const booking = await kv.get(`booking:${id}`);
    
    if (!booking) {
      return c.json({ success: false, error: "Booking not found" }, 404);
    }

    // Check authorization
    const customer = await kv.get(`customer:user:${user.id}`);
    const isAdmin = user.user_metadata?.role === "admin";
    
    if (!isAdmin && (!customer || booking.customer_id !== customer.id)) {
      return c.json({ success: false, error: "Unauthorized" }, 403);
    }

    return c.json({ success: true, data: booking });
  } catch (error) {
    console.error("Error fetching booking:", error);
    return c.json({ success: false, error: "Failed to fetch booking" }, 500);
  }
});

// Create booking
app.post("/make-server-b43c05fb/bookings", async (c) => {
  try {
    const bookingData = await c.req.json();
    const id = crypto.randomUUID();
    const bookingReference = generateBookingReference();
    
    // Create customer if not exists
    let customerId = bookingData.customer_id;
    if (!customerId && bookingData.customer) {
      customerId = crypto.randomUUID();
      const customer = {
        id: customerId,
        ...bookingData.customer,
        total_bookings: 0,
        total_spent: 0,
        customer_segment: "New",
        loyalty_points: 0,
        created_at: new Date().toISOString(),
      };
      await kv.set(`customer:${customerId}`, customer);
      
      if (bookingData.customer.user_id) {
        await kv.set(`customer:user:${bookingData.customer.user_id}`, customer);
      }
    }
    
    const booking = {
      id,
      booking_reference: bookingReference,
      customer_id: customerId,
      vehicle_id: bookingData.vehicle_id,
      pickup_date: bookingData.pickup_date,
      pickup_time: bookingData.pickup_time,
      pickup_location: bookingData.pickup_location,
      return_date: bookingData.return_date,
      return_time: bookingData.return_time,
      return_location: bookingData.return_location,
      total_days: bookingData.total_days,
      base_price: bookingData.base_price,
      addons: bookingData.addons || {},
      addons_price: bookingData.addons_price || 0,
      fuel_option: bookingData.fuel_option || "Full_to_Full",
      subtotal: bookingData.subtotal,
      tax: bookingData.tax || 0,
      deposit: bookingData.deposit,
      total_price: bookingData.total_price,
      status: "Pending",
      payment_status: "Pending",
      payment_method: bookingData.payment_method || "Pay_on_Pickup",
      special_instructions: bookingData.special_instructions || "",
      created_at: new Date().toISOString(),
    };

    await kv.set(`booking:${id}`, booking);
    
    // Update customer stats
    if (customerId) {
      const customer = await kv.get(`customer:${customerId}`);
      if (customer) {
        customer.total_bookings = (customer.total_bookings || 0) + 1;
        customer.last_rental_date = bookingData.pickup_date;
        await kv.set(`customer:${customerId}`, customer);
        if (customer.user_id) {
          await kv.set(`customer:user:${customer.user_id}`, customer);
        }
      }
    }

    // Create invoice
    const invoiceNumber = generateInvoiceNumber();
    const invoice = {
      id: crypto.randomUUID(),
      invoice_number: invoiceNumber,
      booking_id: id,
      customer_id: customerId,
      issue_date: new Date().toISOString().split('T')[0],
      due_date: bookingData.pickup_date,
      subtotal: bookingData.subtotal,
      tax: bookingData.tax || 0,
      deposit: bookingData.deposit,
      total_amount: bookingData.total_price,
      amount_paid: 0,
      balance_due: bookingData.total_price,
      status: "Pending",
      payment_terms: "Due on pickup",
      created_at: new Date().toISOString(),
    };

    await kv.set(`invoice:${invoice.id}`, invoice);
    await kv.set(`invoice:booking:${id}`, invoice);

    return c.json({ success: true, data: { booking, invoice } });
  } catch (error) {
    console.error("Error creating booking:", error);
    return c.json({ success: false, error: "Failed to create booking" }, 500);
  }
});

// Update booking (admin only)
app.put("/make-server-b43c05fb/bookings/:id", async (c) => {
  try {
    const accessToken = c.req.header("Authorization")?.split(" ")[1];
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    
    if (!user || authError) {
      return c.json({ success: false, error: "Unauthorized" }, 401);
    }

    const id = c.req.param("id");
    const updates = await c.req.json();
    const existing = await kv.get(`booking:${id}`);
    
    if (!existing) {
      return c.json({ success: false, error: "Booking not found" }, 404);
    }

    const updated = {
      ...existing,
      ...updates,
      id,
    };

    if (updates.status === "Confirmed" && !existing.confirmed_at) {
      updated.confirmed_at = new Date().toISOString();
    }

    await kv.set(`booking:${id}`, updated);
    return c.json({ success: true, data: updated });
  } catch (error) {
    console.error("Error updating booking:", error);
    return c.json({ success: false, error: "Failed to update booking" }, 500);
  }
});

// ==================== REVIEWS ====================

// Get reviews for a vehicle
app.get("/make-server-b43c05fb/vehicles/:vehicleId/reviews", async (c) => {
  try {
    const vehicleId = c.req.param("vehicleId");
    const allReviews = await kv.getByPrefix("review:");
    const vehicleReviews = allReviews.filter((r: any) => r.vehicle_id === vehicleId);
    
    return c.json({ success: true, data: vehicleReviews });
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return c.json({ success: false, error: "Failed to fetch reviews" }, 500);
  }
});

// Create review
app.post("/make-server-b43c05fb/reviews", async (c) => {
  try {
    const accessToken = c.req.header("Authorization")?.split(" ")[1];
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    
    if (!user || authError) {
      return c.json({ success: false, error: "Unauthorized" }, 401);
    }

    const reviewData = await c.req.json();
    const id = crypto.randomUUID();
    
    const review = {
      id,
      vehicle_id: reviewData.vehicle_id,
      customer_id: reviewData.customer_id,
      booking_id: reviewData.booking_id,
      rating: reviewData.rating,
      comment: reviewData.comment,
      is_verified: true,
      created_at: new Date().toISOString(),
    };

    await kv.set(`review:${id}`, review);
    
    // Update vehicle rating
    const vehicle = await kv.get(`vehicle:${reviewData.vehicle_id}`);
    if (vehicle) {
      const allReviews = await kv.getByPrefix("review:");
      const vehicleReviews = allReviews.filter((r: any) => r.vehicle_id === reviewData.vehicle_id);
      
      const totalRating = vehicleReviews.reduce((sum: number, r: any) => sum + r.rating, 0);
      vehicle.rating = totalRating / vehicleReviews.length;
      vehicle.total_reviews = vehicleReviews.length;
      
      await kv.set(`vehicle:${reviewData.vehicle_id}`, vehicle);
    }

    return c.json({ success: true, data: review });
  } catch (error) {
    console.error("Error creating review:", error);
    return c.json({ success: false, error: "Failed to create review" }, 500);
  }
});

// ==================== CONTACT MESSAGES ====================

app.post("/make-server-b43c05fb/contact", async (c) => {
  try {
    const messageData = await c.req.json();
    const id = crypto.randomUUID();
    
    const message = {
      id,
      ...messageData,
      status: "New",
      created_at: new Date().toISOString(),
    };

    await kv.set(`contact:${id}`, message);
    return c.json({ success: true, data: message });
  } catch (error) {
    console.error("Error saving contact message:", error);
    return c.json({ success: false, error: "Failed to save message" }, 500);
  }
});

// ==================== AUTH ====================

// Signup
app.post("/make-server-b43c05fb/auth/signup", async (c) => {
  try {
    const { email, password, full_name, phone, date_of_birth } = await c.req.json();
    
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // Auto-confirm since email server not configured
      user_metadata: {
        role: "customer",
        full_name,
      },
    });

    if (error) {
      return c.json({ success: false, error: error.message }, 400);
    }

    // Create customer profile
    const customerId = crypto.randomUUID();
    const customer = {
      id: customerId,
      user_id: data.user.id,
      full_name,
      email,
      phone,
      date_of_birth,
      age: date_of_birth ? new Date().getFullYear() - new Date(date_of_birth).getFullYear() : null,
      total_bookings: 0,
      total_spent: 0,
      customer_segment: "New",
      loyalty_points: 0,
      created_at: new Date().toISOString(),
    };

    await kv.set(`customer:${customerId}`, customer);
    await kv.set(`customer:user:${data.user.id}`, customer);

    return c.json({ success: true, data: { user: data.user, customer } });
  } catch (error) {
    console.error("Error during signup:", error);
    return c.json({ success: false, error: "Failed to create account" }, 500);
  }
});

export default app;
