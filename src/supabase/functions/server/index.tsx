import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import * as kv from "./kv_store.tsx";
import routes from "./routes.tsx";
import seedData from "./seed-data.tsx";
import { crmIntegration } from "./crm-integration.tsx";

const app = new Hono();

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Health check endpoint
app.get("/make-server-b43c05fb/health", (c) => {
  return c.json({ status: "ok" });
});

// Event tracking endpoint for CRM integration
app.post("/make-server-b43c05fb/track-event", async (c) => {
  try {
    const eventData = await c.req.json();
    console.log("Received event:", eventData.event_type);
    
    const result = await crmIntegration.processEvent(eventData);
    
    if (result.success) {
      return c.json({ 
        success: true, 
        contact_id: result.contact_id,
        message: "Event tracked successfully" 
      });
    } else {
      return c.json({ 
        success: false, 
        error: result.error 
      }, 500);
    }
  } catch (error) {
    console.error("Event tracking error:", error);
    return c.json({ 
      success: false, 
      error: error.message 
    }, 500);
  }
});

// Mount all routes
app.route("/", routes);
app.route("/", seedData);