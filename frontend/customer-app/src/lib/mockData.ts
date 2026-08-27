export const mockUser = {
  id: 'user-001',
  name: 'Demo User',
  email: 'demo@bytecafe.app',
  role: 'customer',
  phone: '555-0100',
};

export const mockCategories = [
  { id: 'cat-rolls', name: 'ROLLS', description: 'Delicious Rolls' },
  { id: 'cat-sandwiches', name: 'SANDWICHES', description: 'Fresh Sandwiches' },
  { id: 'cat-burgers', name: 'BURGERS & SIDES', description: 'Burgers and more' },
  { id: 'cat-maggi', name: 'MAGGI SPECIALS', description: 'Maggi noodles' },
  { id: 'cat-icecream', name: 'ICE CREAM', description: 'Sweet Treats' },
  { id: 'cat-cold-bev', name: 'COLD BEVERAGES', description: 'Refreshing drinks' },
  { id: 'cat-hot-bev', name: 'HOT BEVERAGES', description: 'Hot drinks' },
  { id: 'cat-momos', name: 'MOMOS', description: 'Steamed and fried momos' },
  { id: 'cat-egg', name: 'EGG SPEACIAL (2PC)', description: 'Egg specials' },
  { id: 'cat-juices', name: 'JUICES', description: 'Fresh juices' },
  { id: 'cat-shakes', name: 'SHAKES', description: 'Thick shakes' },
];

const createItem = (id: string, name: string, price: number, catId: string, catName: string, isVeg: boolean) => ({
  id,
  name,
  description: `${name} from ${catName}`,
  price,
  categoryId: catId,
  categoryName: catName,
  imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c',
  isAvailable: true,
  dietaryTags: [isVeg ? 'Veg' : 'Non-Veg'],
  addons: (catName === 'ROLLS' || catName === 'SANDWICHES' || name.includes('Burger')) 
    ? [{ id: `addon-cheese-${id}`, name: 'With Cheese', price: 10 }] 
    : []
});

export const mockMenu = [
  createItem('item-1', 'Veg', 59, 'cat-rolls', 'ROLLS', true),
  createItem('item-2', 'Paneer', 75, 'cat-rolls', 'ROLLS', true),
  createItem('item-3', 'Egg', 69, 'cat-rolls', 'ROLLS', false),
  createItem('item-4', 'Chicken', 89, 'cat-rolls', 'ROLLS', false),
  createItem('item-5', 'Veg', 59, 'cat-sandwiches', 'SANDWICHES', true),
  createItem('item-6', 'Paneer', 69, 'cat-sandwiches', 'SANDWICHES', true),
  createItem('item-7', 'Egg', 65, 'cat-sandwiches', 'SANDWICHES', false),
  createItem('item-8', 'Chicken', 79, 'cat-sandwiches', 'SANDWICHES', false),
  createItem('item-9', 'Veg Burger', 79, 'cat-burgers', 'BURGERS & SIDES', true),
  createItem('item-10', 'Chicken Burger', 99, 'cat-burgers', 'BURGERS & SIDES', false),
  createItem('item-11', 'French Fries', 59, 'cat-burgers', 'BURGERS & SIDES', true),
  createItem('item-12', 'Peri Peri Fries', 69, 'cat-burgers', 'BURGERS & SIDES', true),
  createItem('item-13', 'Pop Corn', 59, 'cat-burgers', 'BURGERS & SIDES', true),
  createItem('item-14', 'Plain', 39, 'cat-maggi', 'MAGGI SPECIALS', true),
  createItem('item-15', 'Plain Cheese', 49, 'cat-maggi', 'MAGGI SPECIALS', true),
  createItem('item-16', 'Veg', 45, 'cat-maggi', 'MAGGI SPECIALS', true),
  createItem('item-17', 'Veg Cheese', 55, 'cat-maggi', 'MAGGI SPECIALS', true),
  createItem('item-18', 'Fried Egg', 59, 'cat-maggi', 'MAGGI SPECIALS', false),
  createItem('item-19', 'Corn', 49, 'cat-maggi', 'MAGGI SPECIALS', true),
  createItem('item-20', 'Corn Cheese', 59, 'cat-maggi', 'MAGGI SPECIALS', true),
  createItem('item-21', 'Paneer', 55, 'cat-maggi', 'MAGGI SPECIALS', true),
  createItem('item-22', 'Paneer Cheese', 65, 'cat-maggi', 'MAGGI SPECIALS', true),
  createItem('item-23', 'Vanilla', 29, 'cat-icecream', 'ICE CREAM', true),
  createItem('item-24', 'Choco', 35, 'cat-icecream', 'ICE CREAM', true),
  createItem('item-25', 'Butterscotch', 35, 'cat-icecream', 'ICE CREAM', true),
  createItem('item-26', 'Veg Steamed', 74, 'cat-momos', 'MOMOS', true),
  createItem('item-27', 'Veg Fried', 79, 'cat-momos', 'MOMOS', true),
  createItem('item-28', 'Chicken Steamed', 84, 'cat-momos', 'MOMOS', false),
  createItem('item-29', 'Chicken Fried', 89, 'cat-momos', 'MOMOS', false),
  createItem('item-30', 'Lemon Juice', 29, 'cat-cold-bev', 'COLD BEVERAGES', true),
  createItem('item-31', 'Buttermilk', 19, 'cat-cold-bev', 'COLD BEVERAGES', true),
  createItem('item-32', 'Lemon Soda', 35, 'cat-cold-bev', 'COLD BEVERAGES', true),
  createItem('item-33', 'Cold Coffee', 65, 'cat-cold-bev', 'COLD BEVERAGES', true),
  createItem('item-34', 'Sweet Lassi', 45, 'cat-cold-bev', 'COLD BEVERAGES', true),
  createItem('item-35', 'Oreo Shake', 69, 'cat-cold-bev', 'COLD BEVERAGES', true),
  createItem('item-36', 'Coke/Sprite', 29, 'cat-cold-bev', 'COLD BEVERAGES', true),
  createItem('item-37', 'Half Boil', 39, 'cat-egg', 'EGG SPEACIAL (2PC)', false),
  createItem('item-38', 'Boiled Egg', 39, 'cat-egg', 'EGG SPEACIAL (2PC)', false),
  createItem('item-39', 'Fried Egg', 39, 'cat-egg', 'EGG SPEACIAL (2PC)', false),
  createItem('item-40', 'Egg Bhurji', 45, 'cat-egg', 'EGG SPEACIAL (2PC)', false),
  createItem('item-41', 'Masala Omelette', 45, 'cat-egg', 'EGG SPEACIAL (2PC)', false),
  createItem('item-42', 'Bread Omelette', 59, 'cat-egg', 'EGG SPEACIAL (2PC)', false),
  createItem('item-43', 'Regular Tea', 15, 'cat-hot-bev', 'HOT BEVERAGES', true),
  createItem('item-44', 'Ginger Tea', 19, 'cat-hot-bev', 'HOT BEVERAGES', true),
  createItem('item-45', 'Lemon Tea', 15, 'cat-hot-bev', 'HOT BEVERAGES', true),
  createItem('item-46', 'Black Tea', 10, 'cat-hot-bev', 'HOT BEVERAGES', true),
  createItem('item-47', 'Cardamom Tea', 25, 'cat-hot-bev', 'HOT BEVERAGES', true),
  createItem('item-48', 'Coffee', 19, 'cat-hot-bev', 'HOT BEVERAGES', true),
  createItem('item-49', 'Hot Choco', 35, 'cat-hot-bev', 'HOT BEVERAGES', true),
  createItem('item-50', 'Badam Milk', 29, 'cat-hot-bev', 'HOT BEVERAGES', true),
  createItem('item-51', 'Watermelon', 49, 'cat-juices', 'JUICES', true),
  createItem('item-52', 'Muskmelon', 49, 'cat-juices', 'JUICES', true),
  createItem('item-53', 'Musambi', 59, 'cat-juices', 'JUICES', true),
  createItem('item-54', 'Orange', 69, 'cat-juices', 'JUICES', true),
  createItem('item-55', 'Carrot', 69, 'cat-juices', 'JUICES', true),
  createItem('item-56', 'Pomegranate', 79, 'cat-juices', 'JUICES', true),
  createItem('item-57', 'Muskmelon Shake', 65, 'cat-shakes', 'SHAKES', true),
  createItem('item-58', 'Vanilla Shake', 65, 'cat-shakes', 'SHAKES', true),
  createItem('item-59', 'Choco Shake', 69, 'cat-shakes', 'SHAKES', true),
  createItem('item-60', 'Butterscotch Shake', 79, 'cat-shakes', 'SHAKES', true),
  createItem('item-61', 'Pomegranate Shake', 89, 'cat-shakes', 'SHAKES', true),
];

export const mockReviews = [];

export let appState = {
  cart: {
    id: 'cart-demo',
    items: [] as any[],
    total: 0,
    restaurantId: 'byte-cafe'
  },
  orders: [] as any[],
  notifications: [
    {
      id: 'notif-1',
      title: 'Welcome to Byte Cafe!',
      message: 'Thanks for trying out our demo app.',
      isRead: false,
      createdAt: new Date().toISOString()
    }
  ],
  reviews: [...mockReviews]
};

export const resetAppState = () => {
  appState.cart.items = [];
  appState.cart.total = 0;
  appState.orders = [];
  appState.notifications = [
    {
      id: 'notif-1',
      title: 'Welcome to Byte Cafe!',
      message: 'Thanks for trying out our demo app.',
      isRead: false,
      createdAt: new Date().toISOString()
    }
  ];
};
