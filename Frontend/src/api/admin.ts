import api from "./axios";

// ─── Types ───────────────────────────────────────────────────────────────────

export interface AdminStats {
  totalOrders: number;
  totalRestaurants: number;
  totalUsers: number;
  totalRevenue: number;
  ordersByStatus: Record<string, number>;
  recentOrders: { _id: string; customerName: string; total: number; status: string; createdAt: string }[];
}

export interface AdminRestaurant {
  _id: string;
  name: string;
  image: string;
  cuisine: string[];
  rating: number;
  deliveryTime: number;
  address: string;
  isOpen: boolean;
  createdAt: string;
}

export interface AdminMenuItem {
  _id: string;
  restaurantId: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  isAvailable: boolean;
}

export interface AdminOrder {
  _id: string;
  customerName: string;
  phone: string;
  address: string;
  restaurantName: string;
  items: { name: string; price: number; quantity: number }[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  status: string;
  paymentMethod: string;
  createdAt: string;
}

export interface AdminUser {
  _id: string;
  fullName: string;
  email: string;
  phone: string;
  address: string;
  createdAt: string;
}

// ─── API calls ───────────────────────────────────────────────────────────────

export const getAdminStats = () => api.get<{ success: boolean; data: AdminStats }>("/admin/stats");

// Orders
export const getAdminOrders = (params?: { status?: string; page?: number; limit?: number }) =>
  api.get<{ success: boolean; data: AdminOrder[]; total: number; totalPages: number }>("/admin/orders", { params });

export const updateOrderStatus = (id: string, status: string) =>
  api.patch<{ success: boolean; data: AdminOrder }>(`/admin/orders/${id}/status`, { status });

// Restaurants
export const getAdminRestaurants = () =>
  api.get<{ success: boolean; data: AdminRestaurant[] }>("/admin/restaurants");

export const createRestaurant = (payload: Omit<AdminRestaurant, "_id" | "createdAt">) =>
  api.post<{ success: boolean; data: AdminRestaurant }>("/admin/restaurants", payload);

export const updateRestaurant = (id: string, payload: Partial<AdminRestaurant>) =>
  api.patch<{ success: boolean; data: AdminRestaurant }>(`/admin/restaurants/${id}`, payload);

export const deleteRestaurant = (id: string) =>
  api.delete<{ success: boolean }>(`/admin/restaurants/${id}`);

// Menu Items
export const getMenuItems = (restaurantId: string) =>
  api.get<{ success: boolean; data: AdminMenuItem[] }>(`/admin/restaurants/${restaurantId}/menu`);

export const createMenuItem = (restaurantId: string, payload: Omit<AdminMenuItem, "_id" | "restaurantId">) =>
  api.post<{ success: boolean; data: AdminMenuItem }>(`/admin/restaurants/${restaurantId}/menu`, payload);

export const updateMenuItem = (id: string, payload: Partial<AdminMenuItem>) =>
  api.patch<{ success: boolean; data: AdminMenuItem }>(`/admin/menu/${id}`, payload);

export const deleteMenuItem = (id: string) =>
  api.delete<{ success: boolean }>(`/admin/menu/${id}`);

// Users
export const getAdminUsers = () =>
  api.get<{ success: boolean; data: AdminUser[] }>("/admin/users");
