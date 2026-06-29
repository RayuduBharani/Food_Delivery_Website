import api from "./axios";

/**
 * Order API service.
 *
 * Encapsulates all order-related HTTP calls.
 */

export interface OrderItem {
  menuItem: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

export interface Order {
  _id: string;
  userId: string | null;
  customerName: string;
  phone: string;
  address: string;
  items: OrderItem[];
  restaurantId: string;
  restaurantName: string;
  subtotal: number;
  deliveryFee: number;
  total: number;
  status: string;
  paymentMethod: string;
  createdAt: string;
  updatedAt: string;
}

interface PlaceOrderPayload {
  customerName: string;
  phone: string;
  address: string;
  items: { menuItem: string; quantity: number }[];
  paymentMethod?: string;
}

interface OrderResponse {
  success: boolean;
  message: string;
  data: Order;
}

interface OrdersListResponse {
  success: boolean;
  count: number;
  total: number;
  page: number;
  totalPages: number;
  data: Order[];
}

/**
 * Place a new order.
 */
export const placeOrder = async (
  payload: PlaceOrderPayload
): Promise<OrderResponse> => {
  const { data } = await api.post<OrderResponse>("/orders", payload);
  return data;
};

/**
 * Fetch all orders (optionally filtered by userId).
 */
export const getOrders = async (params?: {
  userId?: string;
  page?: number;
  limit?: number;
}): Promise<OrdersListResponse> => {
  const { data } = await api.get<OrdersListResponse>("/orders", { params });
  return data;
};

/**
 * Fetch a single order by ID.
 */
export const getOrderById = async (id: string): Promise<OrderResponse> => {
  const { data } = await api.get<OrderResponse>(`/orders/${id}`);
  return data;
};
