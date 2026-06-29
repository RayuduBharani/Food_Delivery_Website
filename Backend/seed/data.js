/**
 * Seed Data — Restaurants, menu items, and admin user.
 */

const restaurants = [
  {
    name: "Spice Garden",
    image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80",
    cuisine: ["North Indian", "Mughlai", "Biryani"],
    rating: 4.3,
    deliveryTime: 35,
    address: "12, MG Road, Bangalore",
    isOpen: true,
  },
  {
    name: "Dragon Wok",
    image: "https://images.unsplash.com/photo-1552566626-52f8b828add9?w=800&q=80",
    cuisine: ["Chinese", "Thai", "Asian"],
    rating: 4.1,
    deliveryTime: 30,
    address: "45, Brigade Road, Bangalore",
    isOpen: true,
  },
  {
    name: "Pizza Planet",
    image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&q=80",
    cuisine: ["Italian", "Pizza", "Pasta"],
    rating: 4.5,
    deliveryTime: 25,
    address: "78, Koramangala, Bangalore",
    isOpen: true,
  },
];

const menuItems = [
  // ── Spice Garden (index 0) ──────────────────────────────────────
  { restaurantIndex: 0, name: "Butter Chicken", description: "Tender chicken in a rich, creamy tomato-based sauce.", image: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=600&q=80", price: 320, category: "Main Course", isAvailable: true },
  { restaurantIndex: 0, name: "Hyderabadi Biryani", description: "Fragrant basmati rice layered with marinated chicken.", image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600&q=80", price: 280, category: "Biryani", isAvailable: true },
  { restaurantIndex: 0, name: "Paneer Tikka", description: "Cottage cheese marinated in spiced yogurt and grilled.", image: "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=600&q=80", price: 220, category: "Starters", isAvailable: true },
  { restaurantIndex: 0, name: "Dal Makhani", description: "Slow-cooked black lentils with cream, butter, and tomatoes.", image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=600&q=80", price: 180, category: "Main Course", isAvailable: true },
  { restaurantIndex: 0, name: "Gulab Jamun", description: "Milk dumplings soaked in warm rose-flavored sugar syrup.", image: "https://images.unsplash.com/photo-1666190050267-17dc609f24e5?w=600&q=80", price: 120, category: "Desserts", isAvailable: true },

  // ── Dragon Wok (index 1) ───────────────────────────────────────
  { restaurantIndex: 1, name: "Kung Pao Chicken", description: "Stir-fried chicken with peanuts and fiery Sichuan peppers.", image: "https://images.unsplash.com/photo-1525755662778-989d0524087e?w=600&q=80", price: 290, category: "Main Course", isAvailable: true },
  { restaurantIndex: 1, name: "Veg Hakka Noodles", description: "Wok-tossed noodles with vegetables in soy-chili sauce.", image: "https://images.unsplash.com/photo-1585032226651-759b368d7246?w=600&q=80", price: 200, category: "Noodles", isAvailable: true },
  { restaurantIndex: 1, name: "Chicken Manchurian", description: "Crispy chicken in a tangy Indo-Chinese Manchurian sauce.", image: "https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?w=600&q=80", price: 260, category: "Starters", isAvailable: true },
  { restaurantIndex: 1, name: "Veg Spring Rolls", description: "Crispy golden rolls stuffed with seasoned vegetables.", image: "https://images.unsplash.com/photo-1548507200-e5492e633a48?w=600&q=80", price: 180, category: "Starters", isAvailable: true },
  { restaurantIndex: 1, name: "Thai Green Curry", description: "Coconut milk curry with vegetables and Thai basil.", image: "https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?w=600&q=80", price: 310, category: "Main Course", isAvailable: true },

  // ── Pizza Planet (index 2) ─────────────────────────────────────
  { restaurantIndex: 2, name: "Margherita Pizza", description: "Classic pizza with mozzarella, tomatoes, and basil.", image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=600&q=80", price: 350, category: "Pizza", isAvailable: true },
  { restaurantIndex: 2, name: "Pepperoni Pizza", description: "Loaded with spicy pepperoni on melted mozzarella.", image: "https://images.unsplash.com/photo-1628840042765-356cda07504e?w=600&q=80", price: 420, category: "Pizza", isAvailable: true },
  { restaurantIndex: 2, name: "Penne Arrabbiata", description: "Penne pasta in a fiery garlic-tomato sauce.", image: "https://images.unsplash.com/photo-1563379926898-05f4575a45d8?w=600&q=80", price: 280, category: "Pasta", isAvailable: true },
  { restaurantIndex: 2, name: "Garlic Bread", description: "Toasted bread with garlic butter and herbs.", image: "https://images.unsplash.com/photo-1619535860434-cf9b23d5c040?w=600&q=80", price: 150, category: "Sides", isAvailable: true },
  { restaurantIndex: 2, name: "Tiramisu", description: "Espresso-soaked ladyfingers with mascarpone cream.", image: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=600&q=80", price: 250, category: "Desserts", isAvailable: true },
];

/**
 * Admin user seeded with a fixed password for development.
 * Credentials: admin@foodrush.in / Admin@123
 */
const adminUser = {
  fullName: "FoodRush Admin",
  email: "admin@foodrush.in",
  phone: "9000000000",
  password: "Admin@123", // will be hashed in the seed script
  role: "admin",
  address: "FoodRush HQ, Bangalore",
};

module.exports = { restaurants, menuItems, adminUser };
