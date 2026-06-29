import api from "./axios";

/**
 * Restaurant API service.
 *
 * Encapsulates all restaurant-related HTTP calls.
 * Components call these functions instead of axios directly,
 * keeping API URLs and response parsing in one place.
 */

export interface Restaurant {
  _id: string;
  name: string;
  image: string;
  cuisine: string[];
  rating: number;
  deliveryTime: number;
  address: string;
  isOpen: boolean;
}

export interface MenuItem {
  _id: string;
  restaurantId: string;
  name: string;
  description: string;
  image: string;
  price: number;
  category: string;
  isAvailable: boolean;
}

interface RestaurantsResponse {
  success: boolean;
  count: number;
  total: number;
  page: number;
  totalPages: number;
  data: Restaurant[];
}

interface RestaurantDetailResponse {
  success: boolean;
  data: {
    restaurant: Restaurant;
    menuItems: MenuItem[];
  };
}

interface MenuResponse {
  success: boolean;
  count: number;
  data: MenuItem[];
  grouped: Record<string, MenuItem[]>;
}

/**
 * Fetch all restaurants with optional search and filter.
 */
export const getRestaurants = async (params?: {
  search?: string;
  cuisine?: string;
  page?: number;
  limit?: number;
}): Promise<RestaurantsResponse> => {
  const { data } = await api.get<RestaurantsResponse>("/restaurants", {
    params,
  });
  return data;
};

/**
 * Fetch a single restaurant by ID (includes menu items).
 */
export const getRestaurantById = async (
  id: string
): Promise<RestaurantDetailResponse> => {
  const { data } = await api.get<RestaurantDetailResponse>(
    `/restaurants/${id}`
  );
  return data;
};

/**
 * Fetch menu items for a specific restaurant.
 */
export const getMenuByRestaurant = async (
  restaurantId: string,
  params?: { category?: string }
): Promise<MenuResponse> => {
  const { data } = await api.get<MenuResponse>(
    `/restaurants/${restaurantId}/menu`,
    { params }
  );
  return data;
};
