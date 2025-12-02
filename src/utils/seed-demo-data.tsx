import { projectId, publicAnonKey } from "./supabase/info";

const API_BASE_URL = `https://${projectId}.supabase.co/functions/v1/make-server-b43c05fb`;

export async function seedDemoData() {
  try {
    const response = await fetch(`${API_BASE_URL}/seed-data`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${publicAnonKey}`,
      },
    });

    const data = await response.json();
    
    if (data.success) {
      console.log("✅ Demo data seeded successfully:", data.data);
      return true;
    } else {
      console.error("❌ Failed to seed demo data:", data.error);
      return false;
    }
  } catch (error) {
    console.error("❌ Error seeding demo data:", error);
    return false;
  }
}

export async function clearAllData() {
  try {
    const response = await fetch(`${API_BASE_URL}/clear-data`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${publicAnonKey}`,
      },
    });

    const data = await response.json();
    
    if (data.success) {
      console.log("✅ Data cleared successfully:", data.deleted);
      return true;
    } else {
      console.error("❌ Failed to clear data:", data.error);
      return false;
    }
  } catch (error) {
    console.error("❌ Error clearing data:", error);
    return false;
  }
}

// Check if data exists, if not, seed it
export async function ensureDemoData() {
  try {
    const response = await fetch(`${API_BASE_URL}/vehicles`, {
      headers: {
        Authorization: `Bearer ${publicAnonKey}`,
      },
    });

    const data = await response.json();
    
    // If no vehicles exist, seed demo data
    if (data.success && (!data.data || data.data.length === 0)) {
      console.log("📦 No data found. Seeding demo data...");
      await seedDemoData();
    } else {
      console.log(`✅ Found ${data.data?.length || 0} vehicles in database`);
    }
  } catch (error) {
    console.error("❌ Error checking for demo data:", error);
  }
}
