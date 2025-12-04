# Data Sync Integration - Customer to CRM

## Overview
This system tracks all customer interactions on the website and syncs them in real-time to your admin CRM dashboard.

## Architecture

```
Customer Website → Event Tracker → Backend Server → CRM Integration → CRM Database
```

## How It Works

### 1. Event Tracking (Frontend)
Located in `/utils/eventTracking.ts`

**Automatically tracks:**
- ✅ Customer registration & login
- ✅ Vehicle searches
- ✅ Vehicle page views
- ✅ Booking started
- ✅ Booking step completed
- ✅ Booking abandoned (if user leaves)
- ✅ Booking completed
- ✅ Payment attempts & outcomes
- ✅ Form submissions
- ✅ Page views
- ✅ Chat messages

### 2. Server Integration
Located in `/supabase/functions/server/crm-integration.tsx`

**Receives events and:**
- Creates/updates CRM contacts
- Logs activities to contact timeline
- Creates tasks for sales team
- Tracks revenue and booking counts
- Monitors lead status changes

### 3. CRM Data Storage
Uses the existing Supabase KV store with prefixed keys:
- `crm_contact_` - Contact records
- `crm_contact_email_` - Email lookup index
- `crm_activity_` - Activity timeline
- `crm_task_` - Sales tasks

## Events Being Tracked

### Customer Actions
| Event | Triggers When | CRM Action |
|-------|--------------|------------|
| `customer.created` | User registers | Creates new contact, sets status to "New Lead" |
| `customer.login` | User logs in | Updates last activity, increments visit count |
| `customer.updated` | Profile updated | Updates contact fields |

### Browsing Behavior
| Event | Triggers When | CRM Action |
|-------|--------------|------------|
| `search.performed` | Customer searches cars | Logs search, stores preferred location |
| `vehicle.viewed` | Views vehicle details | Logs vehicle interest, tracks preferences |
| `page.viewed` | Visits any page | Updates last activity |

### Booking Flow
| Event | Triggers When | CRM Action |
|-------|--------------|------------|
| `booking.started` | Begins booking process | Sets status to "Hot Lead - Booking In Progress", stores deal value |
| `booking.step_completed` | Completes a booking step | Logs progress |
| `booking.abandoned` | Leaves booking incomplete | ⚠️ Sets status to "Hot Lead - Abandoned", **creates urgent task** |
| `booking.completed` | Confirms booking | ✅ Sets status to "Customer - Active", increments bookings, adds revenue |

### Payment Events
| Event | Triggers When | CRM Action |
|-------|--------------|------------|
| `payment.attempted` | Tries to pay | Logs payment attempt |
| `payment.successful` | Payment succeeds | ✅ Logs successful payment |
| `payment.failed` | Payment fails | ❌ Logs failure, creates follow-up task |

## Automated Actions

### High-Priority Tasks Created
1. **Abandoned Booking** → Create urgent task (due in 1 hour)
   - "URGENT: Follow up - Abandoned Booking"
   - Contact customer immediately

2. **Payment Failed** → Create high-priority task
   - "Follow up - Payment Failed"
   - Assist customer with payment

3. **Booking Completed** → Create task for customer service
   - "Send Booking Confirmation & Welcome"
   - Send confirmation materials

## CRM Contact Fields

### Standard Fields
- `id` - Unique contact ID
- `email` - Primary email (indexed)
- `first_name` - First name
- `last_name` - Last name
- `phone` - Phone number
- `lead_source` - Always "Website"

### Tracking Fields
- `lead_status` - Current stage (New Lead, Hot Lead, Customer, etc.)
- `last_activity` - Timestamp of last action
- `last_action` - Description of last action
- `last_vehicle_viewed` - Most recently viewed vehicle
- `last_search_location` - Preferred location
- `estimated_deal_value` - Current booking value
- `total_bookings` - Lifetime bookings
- `total_revenue` - Lifetime revenue
- `website_visits` - Number of visits

## Lead Status Flow

```
1. New Lead → (registers on website)
2. Hot Lead - Booking In Progress → (starts booking)
3a. Hot Lead - Abandoned Booking → (leaves booking) 
3b. Customer - Active → (completes booking)
```

## API Endpoint

### Track Event
**POST** `/make-server-b43c05fb/track-event`

**Request:**
```json
{
  "event_type": "booking.completed",
  "customer": {
    "id": "user123",
    "email": "john@example.com",
    "name": "John Doe",
    "phone": "+1234567890"
  },
  "event_data": {
    "vehicle_id": "car_789",
    "vehicle_name": "Toyota Camry",
    "pickup_location": "Airport",
    "total_amount": 450.00
  },
  "session": {
    "session_id": "sess_abc123",
    "device": "mobile",
    "browser": "Chrome"
  }
}
```

**Response:**
```json
{
  "success": true,
  "contact_id": "contact_xyz789",
  "message": "Event tracked successfully"
}
```

## Viewing CRM Data in Admin

The events and contact data flow into your existing CRM dashboard. You can view:

1. **Customer Timeline** - All activities for each customer
2. **Tasks** - Urgent follow-ups for abandoned bookings/failed payments
3. **Lead Status** - Where each customer is in the funnel
4. **Revenue Tracking** - Lifetime value per customer
5. **Behavior Analytics** - Vehicle preferences, search patterns

## Real-Time Sync

- **Critical events** (booking completed, abandoned): Synced within seconds
- **All events**: Processed immediately via async API call
- **No user impact**: Tracking fails silently if server is down

## Privacy & Performance

- ✅ No tracking of logged-out users (anonymous browsing)
- ✅ Non-blocking - doesn't slow down user experience
- ✅ Fails gracefully - errors don't break the website
- ✅ Minimal data - only business-relevant information

## Testing

To test the integration:

1. **Browse as customer** - Search vehicles, view details
2. **Start booking** - Go through booking flow
3. **Check admin CRM** - View the contact created and activities logged
4. **Abandon booking** - Leave mid-process and check for urgent task
5. **Complete booking** - Finish and see status change to "Customer"

## Monitoring

Check server logs for:
```
Received event: booking.completed
Received event: vehicle.viewed
Received event: customer.login
```

## Future Enhancements

Possible additions:
- Email open/click tracking
- SMS campaign integration
- Automated email workflows
- Lead scoring based on behavior
- Predictive booking likelihood

---

**Note:** This integration runs automatically - no configuration needed. All customer actions are being tracked and synced to your CRM in real-time!
