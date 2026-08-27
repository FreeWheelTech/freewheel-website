import re

md_path = "/Users/apple/byte app/docs/testing/menu-seed-test-report.md"
with open(md_path, 'r') as f:
    content = f.read()

categories_match = re.search(r"## Source Category Validation Matrix.*?\|---\|(.*?)\n\n", content, re.DOTALL)
categories_table = categories_match.group(1).strip().split('\n')

items_match = re.search(r"## Detailed Item & Price Validation Matrix.*?\|---\|(.*?)\n\n", content, re.DOTALL)
items_table = items_match.group(1).strip().split('\n')

categories = []
for line in categories_table:
    parts = [p.strip() for p in line.split('|') if p.strip()]
    if len(parts) >= 1:
        cat_name = parts[0]
        categories.append(cat_name)

items = []
item_id = 1
for line in items_table:
    parts = [p.strip() for p in line.split('|') if p.strip()]
    if len(parts) >= 4:
        cat_name = parts[0]
        item_name = parts[1].replace(' (🔴)', '') # clean up name
        price = float(parts[3])
        
        addons = []
        if cat_name in ['ROLLS', 'SANDWICHES'] or (cat_name == 'BURGERS & SIDES' and 'Burger' in item_name):
            addons.append({ 'id': f'addon-cheese-{item_id}', 'name': 'With Cheese', 'price': 10 })
            
        items.append({
            'id': f'item-{item_id}',
            'name': item_name,
            'description': f'Delicious {item_name} from our {cat_name} menu.',
            'price': price,
            'categoryId': f'cat-{cat_name.replace(" ", "-").lower()}',
            'categoryName': cat_name,
            'imageUrl': 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c',
            'isAvailable': True,
            'dietaryTags': ['Non-Veg'] if '(🔴)' in parts[1] else ['Veg'],
            'addons': addons
        })
        item_id += 1

ts_code = """
export const mockUser = {
  id: 'user-001',
  name: 'Demo User',
  email: 'demo@bytecafe.app',
  role: 'customer',
  phone: '555-0100',
};

export const mockCategories = [
"""
for cat in categories:
    cat_id = f'cat-{cat.replace(" ", "-").lower()}'
    ts_code += f"  {{ id: '{cat_id}', name: '{cat}', description: '{cat} menu' }},\n"

ts_code += "];\n\nexport const mockMenu = [\n"
for item in items:
    ts_code += f"  {repr(item)},\n"
    
ts_code += """];

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
"""

with open('/Users/apple/byte app/frontend/customer-app/src/lib/mockData.ts', 'w') as f:
    f.write(ts_code)
