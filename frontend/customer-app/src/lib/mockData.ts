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

// ---------------------------------------------------------------------------
// Per-item image map — each menu item ID maps to a curated, appropriate image.
// All URLs use a fixed Unsplash photo ID + crop params for consistent loading
// on Expo Go (Android / iOS).
// ---------------------------------------------------------------------------
const ITEM_IMAGES: Record<string, string> = {
  // ── ROLLS ────────────────────────────────────────────────────────────────
  // Indian kati/frankie rolls — veg, paneer, egg, chicken variants
  'item-1': 'https://images.unsplash.com/photo-1626203840844-5a5da39e843d?w=400&q=80&fit=crop', // Veg Roll
  'item-2': 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&q=80&fit=crop', // Paneer Roll
  'item-3': 'https://images.unsplash.com/photo-1506354666786-959d6d497f1a?w=400&q=80&fit=crop', // Egg Roll
  'item-4': 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=400&q=80&fit=crop', // Chicken Roll

  // ── SANDWICHES ────────────────────────────────────────────────────────────
  'item-5': 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=400&q=80&fit=crop', // Veg Sandwich
  'item-6': 'https://images.unsplash.com/photo-1553909489-cd47e0ef937f?w=400&q=80&fit=crop', // Paneer Sandwich
  'item-7': 'https://images.unsplash.com/photo-1484723091739-30a097e8f929?w=400&q=80&fit=crop', // Egg Sandwich
  'item-8': 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=400&q=80&fit=crop', // Chicken Sandwich

  // ── BURGERS & SIDES ────────────────────────────────────────────────────────
  'item-9':  'https://images.unsplash.com/photo-1550547660-d9450f859349?w=400&q=80&fit=crop', // Veg Burger
  'item-10': 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&q=80&fit=crop', // Chicken Burger
  'item-11': 'https://images.unsplash.com/photo-1573080496219-bb964701e927?w=400&q=80&fit=crop', // French Fries
  'item-12': 'https://images.unsplash.com/photo-1576107232684-1279f390859f?w=400&q=80&fit=crop', // Peri Peri Fries
  'item-13': 'https://images.unsplash.com/photo-1578849278619-e73505e9610f?w=400&q=80&fit=crop', // Pop Corn

  // ── MAGGI SPECIALS ────────────────────────────────────────────────────────
  'item-14': 'https://images.unsplash.com/photo-1569050467447-ce54b3bbc37d?w=400&q=80&fit=crop', // Plain Maggi
  'item-15': 'https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?w=400&q=80&fit=crop', // Plain Cheese Maggi
  'item-16': 'https://images.unsplash.com/photo-1555126634-323283e090fa?w=400&q=80&fit=crop', // Veg Maggi
  'item-17': 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400&q=80&fit=crop', // Veg Cheese Maggi
  'item-18': 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=400&q=80&fit=crop', // Fried Egg Maggi
  'item-19': 'https://images.unsplash.com/photo-1542281286-9e0a16bb7366?w=400&q=80&fit=crop', // Corn Maggi
  'item-20': 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=400&q=80&fit=crop', // Corn Cheese Maggi
  'item-21': 'https://images.unsplash.com/photo-1562802378-063ec186a863?w=400&q=80&fit=crop', // Paneer Maggi
  'item-22': 'https://images.unsplash.com/photo-1585325701165-491bc2ba5fb0?w=400&q=80&fit=crop', // Paneer Cheese Maggi

  // ── ICE CREAM ─────────────────────────────────────────────────────────────
  'item-23': 'https://images.unsplash.com/photo-1501443762994-82bd5dace89a?w=400&q=80&fit=crop', // Vanilla Ice Cream
  'item-24': 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400&q=80&fit=crop',   // Choco Ice Cream
  'item-25': 'https://images.unsplash.com/photo-1576506295286-5cda18df43e7?w=400&q=80&fit=crop', // Butterscotch Ice Cream

  // ── MOMOS ─────────────────────────────────────────────────────────────────
  'item-26': 'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=400&q=80&fit=crop', // Veg Steamed Momos
  'item-27': 'https://images.unsplash.com/photo-1609501676751-7686c2a9e3c1?w=400&q=80&fit=crop', // Veg Fried Momos
  'item-28': 'https://images.unsplash.com/photo-1625220194771-7ebdea0b70b9?w=400&q=80&fit=crop', // Chicken Steamed Momos
  'item-29': 'https://images.unsplash.com/photo-1534482421-64566f976cfa?w=400&q=80&fit=crop',   // Chicken Fried Momos

  // ── COLD BEVERAGES ────────────────────────────────────────────────────────
  'item-30': 'https://images.unsplash.com/photo-1556909114-44e3e9b0ef48?w=400&q=80&fit=crop', // Lemon Juice
  'item-31': 'https://images.unsplash.com/photo-1587392573188-01cec8d03ff2?w=400&q=80&fit=crop', // Buttermilk
  'item-32': 'https://images.unsplash.com/photo-1523371054106-bbf80586c38c?w=400&q=80&fit=crop', // Lemon Soda
  'item-33': 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400&q=80&fit=crop', // Cold Coffee
  'item-34': 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400&q=80&fit=crop', // Sweet Lassi
  'item-35': 'https://images.unsplash.com/photo-1572490122747-3e9f22a1b8d3?w=400&q=80&fit=crop', // Oreo Shake
  'item-36': 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=400&q=80&fit=crop', // Coke/Sprite

  // ── EGG SPECIAL ───────────────────────────────────────────────────────────
  'item-37': 'https://images.unsplash.com/photo-1607690424560-35d967c86d30?w=400&q=80&fit=crop', // Half Boil
  'item-38': 'https://images.unsplash.com/photo-1485921325833-c519f76c4927?w=400&q=80&fit=crop', // Boiled Egg
  'item-39': 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=400&q=80&fit=crop', // Fried Egg
  'item-40': 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=400&q=80&fit=crop', // Egg Bhurji
  'item-41': 'https://images.unsplash.com/photo-1565299507177-b0ac66763828?w=400&q=80&fit=crop', // Masala Omelette
  'item-42': 'https://images.unsplash.com/photo-1482049016688-2d3e1b311543?w=400&q=80&fit=crop', // Bread Omelette

  // ── HOT BEVERAGES ─────────────────────────────────────────────────────────
  'item-43': 'https://images.unsplash.com/photo-1594631252845-29fc4cc8cde9?w=400&q=80&fit=crop', // Regular Tea
  'item-44': 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=400&q=80&fit=crop', // Ginger Tea
  'item-45': 'https://images.unsplash.com/photo-1564890369478-c89ca8d2a344?w=400&q=80&fit=crop', // Lemon Tea
  'item-46': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80&fit=crop', // Black Tea
  'item-47': 'https://images.unsplash.com/photo-1627933814772-28f8a8b5f869?w=400&q=80&fit=crop', // Cardamom Tea
  'item-48': 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400&q=80&fit=crop', // Coffee
  'item-49': 'https://images.unsplash.com/photo-1542990253-a781e5759d25?w=400&q=80&fit=crop', // Hot Choco
  'item-50': 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400&q=80&fit=crop', // Badam Milk

  // ── JUICES ────────────────────────────────────────────────────────────────
  'item-51': 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=400&q=80&fit=crop', // Watermelon Juice
  'item-52': 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=400&q=80&fit=crop', // Muskmelon Juice
  'item-53': 'https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=400&q=80&fit=crop', // Musambi (Sweet Lime)
  'item-54': 'https://images.unsplash.com/photo-1570197788417-0e82375c9371?w=400&q=80&fit=crop', // Orange Juice
  'item-55': 'https://images.unsplash.com/photo-1610970881699-44a5587cabec?w=400&q=80&fit=crop', // Carrot Juice
  'item-56': 'https://images.unsplash.com/photo-1590301157890-4810ed352733?w=400&q=80&fit=crop', // Pomegranate Juice

  // ── SHAKES ────────────────────────────────────────────────────────────────
  'item-57': 'https://images.unsplash.com/photo-1568649929103-28ffdf40bdb1?w=400&q=80&fit=crop', // Muskmelon Shake
  'item-58': 'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?w=400&q=80&fit=crop', // Vanilla Shake
  'item-59': 'https://images.unsplash.com/photo-1572490122747-3e9f22a1b8d3?w=400&q=80&fit=crop', // Choco Shake
  'item-60': 'https://images.unsplash.com/photo-1619158404641-15a19e9f22a9?w=400&q=80&fit=crop', // Butterscotch Shake
  'item-61': 'https://images.unsplash.com/photo-1590301157890-4810ed352733?w=400&q=80&fit=crop', // Pomegranate Shake
};

/** Fallback for any unmapped future items */
const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&q=80&fit=crop';

const createItem = (id: string, name: string, price: number, catId: string, catName: string, isVeg: boolean) => ({
  id,
  name,
  description: `${name} from ${catName}`,
  price,
  categoryId: catId,
  categoryName: catName,
  // `category` object for index.tsx grouping (item.category?.name)
  category: { id: catId, name: catName },
  // Each item gets its own curated image via ITEM_IMAGES lookup
  imageUrl: ITEM_IMAGES[id] ?? FALLBACK_IMAGE,
  isAvailable: true,
  dietaryTags: [isVeg ? 'Veg' : 'Non-Veg'],
  addons: (catName === 'ROLLS' || catName === 'SANDWICHES' || name.includes('Burger'))
    ? [{ id: `addon-cheese-${id}`, name: 'With Cheese', price: 10 }]
    : [],
});

export const mockMenu = [
  createItem('item-1',  'Veg',                59,  'cat-rolls',     'ROLLS',              true),
  createItem('item-2',  'Paneer',              75,  'cat-rolls',     'ROLLS',              true),
  createItem('item-3',  'Egg',                 69,  'cat-rolls',     'ROLLS',              false),
  createItem('item-4',  'Chicken',             89,  'cat-rolls',     'ROLLS',              false),
  createItem('item-5',  'Veg',                 59,  'cat-sandwiches','SANDWICHES',         true),
  createItem('item-6',  'Paneer',              69,  'cat-sandwiches','SANDWICHES',         true),
  createItem('item-7',  'Egg',                 65,  'cat-sandwiches','SANDWICHES',         false),
  createItem('item-8',  'Chicken',             79,  'cat-sandwiches','SANDWICHES',         false),
  createItem('item-9',  'Veg Burger',          79,  'cat-burgers',   'BURGERS & SIDES',    true),
  createItem('item-10', 'Chicken Burger',      99,  'cat-burgers',   'BURGERS & SIDES',    false),
  createItem('item-11', 'French Fries',        59,  'cat-burgers',   'BURGERS & SIDES',    true),
  createItem('item-12', 'Peri Peri Fries',     69,  'cat-burgers',   'BURGERS & SIDES',    true),
  createItem('item-13', 'Pop Corn',            59,  'cat-burgers',   'BURGERS & SIDES',    true),
  createItem('item-14', 'Plain',               39,  'cat-maggi',     'MAGGI SPECIALS',     true),
  createItem('item-15', 'Plain Cheese',        49,  'cat-maggi',     'MAGGI SPECIALS',     true),
  createItem('item-16', 'Veg',                 45,  'cat-maggi',     'MAGGI SPECIALS',     true),
  createItem('item-17', 'Veg Cheese',          55,  'cat-maggi',     'MAGGI SPECIALS',     true),
  createItem('item-18', 'Fried Egg',           59,  'cat-maggi',     'MAGGI SPECIALS',     false),
  createItem('item-19', 'Corn',                49,  'cat-maggi',     'MAGGI SPECIALS',     true),
  createItem('item-20', 'Corn Cheese',         59,  'cat-maggi',     'MAGGI SPECIALS',     true),
  createItem('item-21', 'Paneer',              55,  'cat-maggi',     'MAGGI SPECIALS',     true),
  createItem('item-22', 'Paneer Cheese',       65,  'cat-maggi',     'MAGGI SPECIALS',     true),
  createItem('item-23', 'Vanilla',             29,  'cat-icecream',  'ICE CREAM',          true),
  createItem('item-24', 'Choco',               35,  'cat-icecream',  'ICE CREAM',          true),
  createItem('item-25', 'Butterscotch',        35,  'cat-icecream',  'ICE CREAM',          true),
  createItem('item-26', 'Veg Steamed',         74,  'cat-momos',     'MOMOS',              true),
  createItem('item-27', 'Veg Fried',           79,  'cat-momos',     'MOMOS',              true),
  createItem('item-28', 'Chicken Steamed',     84,  'cat-momos',     'MOMOS',              false),
  createItem('item-29', 'Chicken Fried',       89,  'cat-momos',     'MOMOS',              false),
  createItem('item-30', 'Lemon Juice',         29,  'cat-cold-bev',  'COLD BEVERAGES',     true),
  createItem('item-31', 'Buttermilk',          19,  'cat-cold-bev',  'COLD BEVERAGES',     true),
  createItem('item-32', 'Lemon Soda',          35,  'cat-cold-bev',  'COLD BEVERAGES',     true),
  createItem('item-33', 'Cold Coffee',         65,  'cat-cold-bev',  'COLD BEVERAGES',     true),
  createItem('item-34', 'Sweet Lassi',         45,  'cat-cold-bev',  'COLD BEVERAGES',     true),
  createItem('item-35', 'Oreo Shake',          69,  'cat-cold-bev',  'COLD BEVERAGES',     true),
  createItem('item-36', 'Coke/Sprite',         29,  'cat-cold-bev',  'COLD BEVERAGES',     true),
  createItem('item-37', 'Half Boil',           39,  'cat-egg',       'EGG SPEACIAL (2PC)', false),
  createItem('item-38', 'Boiled Egg',          39,  'cat-egg',       'EGG SPEACIAL (2PC)', false),
  createItem('item-39', 'Fried Egg',           39,  'cat-egg',       'EGG SPEACIAL (2PC)', false),
  createItem('item-40', 'Egg Bhurji',          45,  'cat-egg',       'EGG SPEACIAL (2PC)', false),
  createItem('item-41', 'Masala Omelette',     45,  'cat-egg',       'EGG SPEACIAL (2PC)', false),
  createItem('item-42', 'Bread Omelette',      59,  'cat-egg',       'EGG SPEACIAL (2PC)', false),
  createItem('item-43', 'Regular Tea',         15,  'cat-hot-bev',   'HOT BEVERAGES',      true),
  createItem('item-44', 'Ginger Tea',          19,  'cat-hot-bev',   'HOT BEVERAGES',      true),
  createItem('item-45', 'Lemon Tea',           15,  'cat-hot-bev',   'HOT BEVERAGES',      true),
  createItem('item-46', 'Black Tea',           10,  'cat-hot-bev',   'HOT BEVERAGES',      true),
  createItem('item-47', 'Cardamom Tea',        25,  'cat-hot-bev',   'HOT BEVERAGES',      true),
  createItem('item-48', 'Coffee',              19,  'cat-hot-bev',   'HOT BEVERAGES',      true),
  createItem('item-49', 'Hot Choco',           35,  'cat-hot-bev',   'HOT BEVERAGES',      true),
  createItem('item-50', 'Badam Milk',          29,  'cat-hot-bev',   'HOT BEVERAGES',      true),
  createItem('item-51', 'Watermelon',          49,  'cat-juices',    'JUICES',             true),
  createItem('item-52', 'Muskmelon',           49,  'cat-juices',    'JUICES',             true),
  createItem('item-53', 'Musambi',             59,  'cat-juices',    'JUICES',             true),
  createItem('item-54', 'Orange',              69,  'cat-juices',    'JUICES',             true),
  createItem('item-55', 'Carrot',              69,  'cat-juices',    'JUICES',             true),
  createItem('item-56', 'Pomegranate',         79,  'cat-juices',    'JUICES',             true),
  createItem('item-57', 'Muskmelon Shake',     65,  'cat-shakes',    'SHAKES',             true),
  createItem('item-58', 'Vanilla Shake',       65,  'cat-shakes',    'SHAKES',             true),
  createItem('item-59', 'Choco Shake',         69,  'cat-shakes',    'SHAKES',             true),
  createItem('item-60', 'Butterscotch Shake',  79,  'cat-shakes',    'SHAKES',             true),
  createItem('item-61', 'Pomegranate Shake',   89,  'cat-shakes',    'SHAKES',             true),
];

export const mockReviews = [];

export let appState = {
  cart: {
    id: 'cart-demo',
    items: [] as any[],
    subtotal: 0,
    taxes: 0,
    deliveryFee: 0,
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
  appState.cart.subtotal = 0;
  appState.cart.taxes = 0;
  appState.cart.deliveryFee = 0;
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
