import { projectId, publicAnonKey } from "./supabase/info";

const API_BASE_URL = `https://${projectId}.supabase.co/functions/v1/make-server-b43c05fb`;

export async function apiRequest(
  endpoint: string,
  options: RequestInit = {},
  accessToken?: string
) {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  if (accessToken) {
    headers["Authorization"] = `Bearer ${accessToken}`;
  } else {
    headers["Authorization"] = `Bearer ${publicAnonKey}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "API request failed");
  }

  return data;
}

// Vehicles
export const vehiclesApi = {
  getAll: () => apiRequest("/vehicles"),
  getById: (id: string) => apiRequest(`/vehicles/${id}`),
  create: (data: any, token: string) =>
    apiRequest("/vehicles", { method: "POST", body: JSON.stringify(data) }, token),
  update: (id: string, data: any, token: string) =>
    apiRequest(`/vehicles/${id}`, { method: "PUT", body: JSON.stringify(data) }, token),
};

// Customers
export const customersApi = {
  getMe: (token: string) => apiRequest("/customers/me", {}, token),
  getAll: (token: string) => apiRequest("/customers", {}, token),
  create: (data: any, token: string) =>
    apiRequest("/customers", { method: "POST", body: JSON.stringify(data) }, token),
};

// Bookings
export const bookingsApi = {
  getAll: (token: string) => apiRequest("/bookings", {}, token),
  getById: (id: string, token: string) => apiRequest(`/bookings/${id}`, {}, token),
  create: (data: any) =>
    apiRequest("/bookings", { method: "POST", body: JSON.stringify(data) }),
  update: (id: string, data: any, token: string) =>
    apiRequest(`/bookings/${id}`, { method: "PUT", body: JSON.stringify(data) }, token),
};

// Reviews
export const reviewsApi = {
  getForVehicle: (vehicleId: string) => apiRequest(`/vehicles/${vehicleId}/reviews`),
  create: (data: any, token: string) =>
    apiRequest("/reviews", { method: "POST", body: JSON.stringify(data) }, token),
};

// Contact
export const contactApi = {
  send: (data: any) =>
    apiRequest("/contact", { method: "POST", body: JSON.stringify(data) }),
};

// Auth
export const authApi = {
  signup: (data: any) =>
    apiRequest("/auth/signup", { method: "POST", body: JSON.stringify(data) }),
};
