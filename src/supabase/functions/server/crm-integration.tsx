import * as kv from "./kv_store.tsx";

interface CRMContact {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
  lead_source?: string;
  lead_status?: string;
  last_activity?: string;
  last_action?: string;
  last_vehicle_viewed?: string;
  last_search_location?: string;
  estimated_deal_value?: number;
  total_bookings?: number;
  total_revenue?: number;
  website_visits?: number;
  created_at: string;
  updated_at: string;
}

interface CRMActivity {
  id: string;
  contact_id: string;
  type: string;
  description: string;
  timestamp: string;
  metadata?: any;
}

interface CRMTask {
  id: string;
  contact_id: string;
  title: string;
  description: string;
  priority: "low" | "medium" | "high" | "urgent";
  status: "pending" | "in_progress" | "completed";
  assigned_to?: string;
  due_date?: string;
  created_at: string;
}

export class CRMIntegration {
  // Find or create contact in CRM
  async findOrCreateContact(email: string, customerData?: any): Promise<CRMContact> {
    // Try to find existing contact
    const existingContacts = await kv.getByPrefix(`crm_contact_email_${email}`);
    
    if (existingContacts.length > 0) {
      return existingContacts[0] as CRMContact;
    }

    // Create new contact
    const contactId = `contact_${Date.now()}_${Math.random().toString(36).substring(7)}`;
    const nameParts = customerData?.name?.split(" ") || ["", ""];
    
    const newContact: CRMContact = {
      id: contactId,
      email,
      first_name: nameParts[0] || "",
      last_name: nameParts.slice(1).join(" ") || "",
      phone: customerData?.phone || "",
      lead_source: "Website",
      lead_status: "New Lead",
      last_activity: new Date().toISOString(),
      last_action: "Created",
      website_visits: 1,
      total_bookings: 0,
      total_revenue: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    // Store in KV with multiple keys for lookup
    await kv.set(`crm_contact_${contactId}`, newContact);
    await kv.set(`crm_contact_email_${email}`, newContact);

    return newContact;
  }

  // Update contact in CRM
  async updateContact(contactId: string, updates: Partial<CRMContact>): Promise<CRMContact> {
    const contact = await kv.get(`crm_contact_${contactId}`) as CRMContact;
    
    if (!contact) {
      throw new Error(`Contact ${contactId} not found`);
    }

    const updatedContact: CRMContact = {
      ...contact,
      ...updates,
      updated_at: new Date().toISOString(),
    };

    // Update both keys
    await kv.set(`crm_contact_${contactId}`, updatedContact);
    await kv.set(`crm_contact_email_${contact.email}`, updatedContact);

    return updatedContact;
  }

  // Create activity/timeline entry
  async createActivity(contactId: string, activityData: {
    type: string;
    description: string;
    timestamp?: string;
    metadata?: any;
  }): Promise<CRMActivity> {
    const activityId = `activity_${Date.now()}_${Math.random().toString(36).substring(7)}`;
    
    const activity: CRMActivity = {
      id: activityId,
      contact_id: contactId,
      type: activityData.type,
      description: activityData.description,
      timestamp: activityData.timestamp || new Date().toISOString(),
      metadata: activityData.metadata,
    };

    await kv.set(`crm_activity_${activityId}`, activity);
    await kv.set(`crm_contact_activity_${contactId}_${activityId}`, activity);

    return activity;
  }

  // Create task for sales team
  async createTask(contactId: string, taskData: {
    title: string;
    description: string;
    priority: "low" | "medium" | "high" | "urgent";
    assigned_to?: string;
    due_date?: string;
  }): Promise<CRMTask> {
    const taskId = `task_${Date.now()}_${Math.random().toString(36).substring(7)}`;
    
    const task: CRMTask = {
      id: taskId,
      contact_id: contactId,
      title: taskData.title,
      description: taskData.description,
      priority: taskData.priority,
      status: "pending",
      assigned_to: taskData.assigned_to || "sales_team",
      due_date: taskData.due_date,
      created_at: new Date().toISOString(),
    };

    await kv.set(`crm_task_${taskId}`, task);
    await kv.set(`crm_contact_task_${contactId}_${taskId}`, task);

    return task;
  }

  // Get contact activities
  async getContactActivities(contactId: string): Promise<CRMActivity[]> {
    const activities = await kv.getByPrefix(`crm_contact_activity_${contactId}_`);
    return activities as CRMActivity[];
  }

  // Get contact tasks
  async getContactTasks(contactId: string): Promise<CRMTask[]> {
    const tasks = await kv.getByPrefix(`crm_contact_task_${contactId}_`);
    return tasks as CRMTask[];
  }

  // Process event from customer interface
  async processEvent(event: any): Promise<{ success: boolean; contact_id?: string; error?: string }> {
    try {
      const { event_type, customer, event_data } = event;

      // If no customer info, just log the event
      if (!customer?.email) {
        console.log("Anonymous event:", event_type, event_data);
        return { success: true };
      }

      // Find or create contact
      const contact = await this.findOrCreateContact(customer.email, customer);

      // Process event based on type
      switch (event_type) {
        case "customer.created":
          await this.handleCustomerCreated(contact, event_data);
          break;

        case "customer.login":
          await this.handleCustomerLogin(contact, event_data);
          break;

        case "customer.updated":
          await this.handleCustomerUpdated(contact, event_data);
          break;

        case "search.performed":
          await this.handleSearchPerformed(contact, event_data);
          break;

        case "vehicle.viewed":
          await this.handleVehicleViewed(contact, event_data);
          break;

        case "booking.started":
          await this.handleBookingStarted(contact, event_data);
          break;

        case "booking.step_completed":
          await this.handleBookingStepCompleted(contact, event_data);
          break;

        case "booking.abandoned":
          await this.handleBookingAbandoned(contact, event_data);
          break;

        case "booking.completed":
          await this.handleBookingCompleted(contact, event_data);
          break;

        case "payment.attempted":
          await this.handlePaymentAttempted(contact, event_data);
          break;

        case "payment.successful":
          await this.handlePaymentSuccessful(contact, event_data);
          break;

        case "payment.failed":
          await this.handlePaymentFailed(contact, event_data);
          break;

        case "page.viewed":
          await this.handlePageViewed(contact, event_data);
          break;

        case "form.submitted":
          await this.handleFormSubmitted(contact, event_data);
          break;

        case "chat.message_sent":
          await this.handleChatMessage(contact, event_data);
          break;

        default:
          console.log("Unknown event type:", event_type);
      }

      return { success: true, contact_id: contact.id };
    } catch (error) {
      console.error("Error processing event:", error);
      return { success: false, error: error.message };
    }
  }

  // Event handlers
  private async handleCustomerCreated(contact: CRMContact, data: any) {
    await this.updateContact(contact.id, {
      lead_status: "New Lead",
      last_action: "Registered",
      last_activity: new Date().toISOString(),
    });

    await this.createActivity(contact.id, {
      type: "Customer Registered",
      description: `New customer registered: ${contact.email}`,
      metadata: data,
    });
  }

  private async handleCustomerLogin(contact: CRMContact, data: any) {
    const visits = (contact.website_visits || 0) + 1;
    
    await this.updateContact(contact.id, {
      last_action: "Logged In",
      last_activity: new Date().toISOString(),
      website_visits: visits,
    });

    await this.createActivity(contact.id, {
      type: "Customer Login",
      description: `Customer logged in (Visit #${visits})`,
      metadata: data,
    });
  }

  private async handleCustomerUpdated(contact: CRMContact, data: any) {
    await this.updateContact(contact.id, {
      ...data.updates,
      last_action: "Updated Profile",
      last_activity: new Date().toISOString(),
    });

    await this.createActivity(contact.id, {
      type: "Profile Updated",
      description: "Customer updated their profile",
      metadata: data,
    });
  }

  private async handleSearchPerformed(contact: CRMContact, data: any) {
    await this.updateContact(contact.id, {
      last_action: "Searched Vehicles",
      last_activity: new Date().toISOString(),
      last_search_location: data.location || data.pickup_location,
    });

    await this.createActivity(contact.id, {
      type: "Vehicle Search",
      description: `Searched for vehicles in ${data.location || data.pickup_location || "unknown location"}`,
      metadata: data,
    });
  }

  private async handleVehicleViewed(contact: CRMContact, data: any) {
    await this.updateContact(contact.id, {
      last_action: "Viewed Vehicle",
      last_activity: new Date().toISOString(),
      last_vehicle_viewed: data.vehicle_name,
    });

    await this.createActivity(contact.id, {
      type: "Vehicle Viewed",
      description: `Viewed ${data.vehicle_name} (${data.vehicle_type}) - $${data.daily_rate}/day`,
      metadata: data,
    });
  }

  private async handleBookingStarted(contact: CRMContact, data: any) {
    await this.updateContact(contact.id, {
      lead_status: "Hot Lead - Booking In Progress",
      last_action: "Started Booking",
      last_activity: new Date().toISOString(),
      estimated_deal_value: data.estimated_total,
    });

    await this.createActivity(contact.id, {
      type: "Booking Started",
      description: `Started booking ${data.vehicle_name} for ${data.pickup_date} to ${data.return_date} - Est. $${data.estimated_total}`,
      metadata: data,
    });
  }

  private async handleBookingStepCompleted(contact: CRMContact, data: any) {
    await this.updateContact(contact.id, {
      last_action: `Completed ${data.step} Step`,
      last_activity: new Date().toISOString(),
    });

    await this.createActivity(contact.id, {
      type: "Booking Progress",
      description: `Completed booking step: ${data.step}`,
      metadata: data,
    });
  }

  private async handleBookingAbandoned(contact: CRMContact, data: any) {
    await this.updateContact(contact.id, {
      lead_status: "Hot Lead - Abandoned Booking",
      last_action: "Abandoned Booking",
      last_activity: new Date().toISOString(),
      estimated_deal_value: data.total_price,
    });

    await this.createActivity(contact.id, {
      type: "Booking Abandoned",
      description: `⚠️ Abandoned booking for ${data.vehicle_name} at ${data.abandoned_at_step} step - Value: $${data.total_price}`,
      metadata: data,
    });

    // Create urgent follow-up task
    const dueDate = new Date();
    dueDate.setHours(dueDate.getHours() + 1); // Due in 1 hour

    await this.createTask(contact.id, {
      title: "URGENT: Follow up - Abandoned Booking",
      description: `Customer abandoned $${data.total_price} booking for ${data.vehicle_name} at ${data.abandoned_at_step} step. Call immediately to assist.`,
      priority: "urgent",
      due_date: dueDate.toISOString(),
    });
  }

  private async handleBookingCompleted(contact: CRMContact, data: any) {
    const totalBookings = (contact.total_bookings || 0) + 1;
    const totalRevenue = (contact.total_revenue || 0) + data.total_amount;

    await this.updateContact(contact.id, {
      lead_status: "Customer - Active",
      last_action: "Completed Booking",
      last_activity: new Date().toISOString(),
      total_bookings: totalBookings,
      total_revenue: totalRevenue,
    });

    await this.createActivity(contact.id, {
      type: "Booking Completed",
      description: `✅ Completed booking #${data.confirmation_number} for ${data.vehicle_name} - $${data.total_amount} (Total bookings: ${totalBookings}, Lifetime value: $${totalRevenue})`,
      metadata: data,
    });

    // Create welcome/confirmation task
    await this.createTask(contact.id, {
      title: "Send Booking Confirmation & Welcome",
      description: `Send confirmation for booking #${data.confirmation_number} and welcome materials`,
      priority: "high",
      assigned_to: "customer_service",
    });
  }

  private async handlePaymentAttempted(contact: CRMContact, data: any) {
    await this.updateContact(contact.id, {
      last_action: "Attempted Payment",
      last_activity: new Date().toISOString(),
    });

    await this.createActivity(contact.id, {
      type: "Payment Attempted",
      description: `Attempted payment of $${data.amount}`,
      metadata: data,
    });
  }

  private async handlePaymentSuccessful(contact: CRMContact, data: any) {
    await this.updateContact(contact.id, {
      last_action: "Payment Successful",
      last_activity: new Date().toISOString(),
    });

    await this.createActivity(contact.id, {
      type: "Payment Successful",
      description: `✅ Payment successful: $${data.amount}`,
      metadata: data,
    });
  }

  private async handlePaymentFailed(contact: CRMContact, data: any) {
    await this.updateContact(contact.id, {
      lead_status: "Hot Lead - Payment Failed",
      last_action: "Payment Failed",
      last_activity: new Date().toISOString(),
    });

    await this.createActivity(contact.id, {
      type: "Payment Failed",
      description: `❌ Payment failed: $${data.amount} - Reason: ${data.error}`,
      metadata: data,
    });

    // Create task to follow up
    await this.createTask(contact.id, {
      title: "Follow up - Payment Failed",
      description: `Payment of $${data.amount} failed. Contact customer to assist with payment.`,
      priority: "high",
    });
  }

  private async handlePageViewed(contact: CRMContact, data: any) {
    const visits = (contact.website_visits || 0) + 1;
    
    await this.updateContact(contact.id, {
      last_action: `Viewed ${data.page}`,
      last_activity: new Date().toISOString(),
      website_visits: visits,
    });
  }

  private async handleFormSubmitted(contact: CRMContact, data: any) {
    await this.updateContact(contact.id, {
      last_action: "Submitted Form",
      last_activity: new Date().toISOString(),
    });

    await this.createActivity(contact.id, {
      type: "Form Submitted",
      description: `Submitted ${data.form_type} form`,
      metadata: data,
    });
  }

  private async handleChatMessage(contact: CRMContact, data: any) {
    await this.updateContact(contact.id, {
      last_action: "Sent Chat Message",
      last_activity: new Date().toISOString(),
    });

    await this.createActivity(contact.id, {
      type: "Chat Message",
      description: `Sent message: "${data.message.substring(0, 100)}${data.message.length > 100 ? "..." : ""}"`,
      metadata: data,
    });
  }
}

// Export singleton instance
export const crmIntegration = new CRMIntegration();
