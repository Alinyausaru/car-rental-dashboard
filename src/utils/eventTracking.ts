import { projectId, publicAnonKey } from "./supabase/info";

export type CustomerEventType =
  | "customer.created"
  | "customer.login"
  | "customer.updated"
  | "search.performed"
  | "vehicle.viewed"
  | "quote.requested"
  | "booking.started"
  | "booking.step_completed"
  | "booking.abandoned"
  | "booking.completed"
  | "payment.attempted"
  | "payment.successful"
  | "payment.failed"
  | "form.submitted"
  | "chat.message_sent"
  | "page.viewed";

interface CustomerEventData {
  event_type: CustomerEventType;
  customer?: {
    id?: string;
    email?: string;
    name?: string;
    phone?: string;
  };
  event_data?: any;
  session?: {
    session_id?: string;
    device?: string;
    browser?: string;
    ip_address?: string;
  };
}

class EventTracker {
  private sessionId: string;
  private apiUrl: string;

  constructor() {
    this.sessionId = this.generateSessionId();
    this.apiUrl = `https://${projectId}.supabase.co/functions/v1/make-server-b43c05fb`;
  }

  private generateSessionId(): string {
    return `sess_${Date.now()}_${Math.random().toString(36).substring(7)}`;
  }

  private getDeviceInfo() {
    const userAgent = navigator.userAgent;
    let device = "desktop";
    
    if (/mobile/i.test(userAgent)) {
      device = "mobile";
    } else if (/tablet|ipad/i.test(userAgent)) {
      device = "tablet";
    }

    let browser = "unknown";
    if (userAgent.includes("Chrome")) browser = "Chrome";
    else if (userAgent.includes("Firefox")) browser = "Firefox";
    else if (userAgent.includes("Safari")) browser = "Safari";
    else if (userAgent.includes("Edge")) browser = "Edge";

    return { device, browser };
  }

  async track(eventType: CustomerEventType, data: any = {}, customer?: any) {
    const { device, browser } = this.getDeviceInfo();

    const eventData: CustomerEventData = {
      event_type: eventType,
      customer: customer ? {
        id: customer.id,
        email: customer.email,
        name: customer.user_metadata?.name || customer.email,
        phone: customer.user_metadata?.phone,
      } : undefined,
      event_data: {
        ...data,
        timestamp: new Date().toISOString(),
      },
      session: {
        session_id: this.sessionId,
        device,
        browser,
      },
    };

    try {
      const response = await fetch(`${this.apiUrl}/track-event`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${publicAnonKey}`,
        },
        body: JSON.stringify(eventData),
      });

      if (!response.ok) {
        console.error("Event tracking failed:", await response.text());
      }
    } catch (error) {
      console.error("Event tracking error:", error);
      // Fail silently - don't break user experience
    }
  }

  // Convenience methods for common events
  trackPageView(page: string, customer?: any) {
    this.track("page.viewed", { page }, customer);
  }

  trackSearch(searchParams: any, customer?: any) {
    this.track("search.performed", searchParams, customer);
  }

  trackVehicleView(vehicle: any, customer?: any) {
    this.track("vehicle.viewed", {
      vehicle_id: vehicle.id,
      vehicle_name: `${vehicle.make} ${vehicle.model}`,
      vehicle_type: vehicle.category,
      daily_rate: vehicle.daily_rate,
    }, customer);
  }

  trackBookingStarted(vehicle: any, bookingData: any, customer?: any) {
    this.track("booking.started", {
      vehicle_id: vehicle.id,
      vehicle_name: `${vehicle.make} ${vehicle.model}`,
      pickup_location: bookingData.pickup_location,
      pickup_date: bookingData.pickup_date,
      return_date: bookingData.return_date,
      estimated_total: bookingData.estimated_total,
    }, customer);
  }

  trackBookingStepCompleted(step: string, vehicle: any, bookingData: any, customer?: any) {
    this.track("booking.step_completed", {
      step,
      vehicle_id: vehicle.id,
      vehicle_name: `${vehicle.make} ${vehicle.model}`,
      ...bookingData,
    }, customer);
  }

  trackBookingAbandoned(step: string, vehicle: any, bookingData: any, customer?: any) {
    this.track("booking.abandoned", {
      abandoned_at_step: step,
      vehicle_id: vehicle.id,
      vehicle_name: `${vehicle.make} ${vehicle.model}`,
      pickup_location: bookingData.pickup_location,
      pickup_date: bookingData.pickup_date,
      return_date: bookingData.return_date,
      total_price: bookingData.total_price,
      cart_items: bookingData.extras,
    }, customer);
  }

  trackBookingCompleted(booking: any, customer?: any) {
    this.track("booking.completed", {
      booking_id: booking.id,
      confirmation_number: booking.confirmation_number,
      vehicle_id: booking.vehicle_id,
      vehicle_name: booking.vehicle_name,
      pickup_location: booking.pickup_location,
      pickup_date: booking.pickup_date,
      return_date: booking.return_date,
      total_amount: booking.total_amount,
      extras: booking.extras,
    }, customer);
  }

  trackPaymentAttempted(amount: number, bookingData: any, customer?: any) {
    this.track("payment.attempted", {
      amount,
      ...bookingData,
    }, customer);
  }

  trackPaymentSuccess(amount: number, bookingData: any, customer?: any) {
    this.track("payment.successful", {
      amount,
      ...bookingData,
    }, customer);
  }

  trackPaymentFailed(amount: number, error: string, bookingData: any, customer?: any) {
    this.track("payment.failed", {
      amount,
      error,
      ...bookingData,
    }, customer);
  }

  trackCustomerLogin(customer: any) {
    this.track("customer.login", {}, customer);
  }

  trackCustomerCreated(customer: any) {
    this.track("customer.created", {}, customer);
  }

  trackCustomerUpdated(customer: any, updates: any) {
    this.track("customer.updated", { updates }, customer);
  }

  trackFormSubmitted(formType: string, formData: any, customer?: any) {
    this.track("form.submitted", {
      form_type: formType,
      ...formData,
    }, customer);
  }

  trackChatMessage(message: string, customer?: any) {
    this.track("chat.message_sent", { message }, customer);
  }
}

// Export singleton instance
export const eventTracker = new EventTracker();
