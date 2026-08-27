import MockAdapter from 'axios-mock-adapter';
import { api } from './api';
import { mockUser, mockCategories, mockMenu, appState, resetAppState } from './mockData';

export const enableMockApi = () => {
  // Use a slight delay to simulate network latency, makes the demo feel more real
  const mock = new MockAdapter(api, { delayResponse: 500 });

  console.log('[DEMO MODE] API Mocking Enabled');

  // ==========================================
  // AUTHENTICATION
  // ==========================================
  mock.onPost('/auth/login').reply((config) => {
    return [200, { accessToken: 'mock-access', refreshToken: 'mock-refresh', user: mockUser }];
  });

  mock.onPost('/auth/register').reply((config) => {
    return [200, { accessToken: 'mock-access', refreshToken: 'mock-refresh', user: mockUser }];
  });

  mock.onGet('/auth/me').reply(200, mockUser);
  
  mock.onPost('/auth/logout').reply((config) => {
    resetAppState();
    return [200, { success: true }];
  });

  // ==========================================
  // RESTAURANTS & MENU
  // ==========================================
  mock.onGet(/\/restaurants\?/).reply(200, {
    data: [{ id: 'byte-cafe', name: 'Byte Cafe', address: '123 Tech Lane', rating: 4.8 }],
    nextCursor: null
  });

  mock.onGet(/\/restaurants\/[^\/]+\/categories/).reply(200, mockCategories);

  mock.onGet(/\/restaurants\/[^\/]+\/menu/).reply((config) => {
    const params = new URLSearchParams(config.url?.split('?')[1] || '');
    const category = params.get('category');
    const search = params.get('q')?.toLowerCase();

    let filtered = mockMenu;
    if (category && category !== 'All') {
      filtered = filtered.filter(item => item.categoryName === category);
    }
    if (search) {
      filtered = filtered.filter(item => item.name.toLowerCase().includes(search));
    }

    return [200, { data: filtered, nextCursor: null }];
  });

  mock.onGet(/\/menu\/search/).reply((config) => {
    const params = new URLSearchParams(config.url?.split('?')[1] || '');
    const search = params.get('q')?.toLowerCase();
    const category = params.get('category');
    
    let filtered = mockMenu;
    if (search) filtered = filtered.filter(i => i.name.toLowerCase().includes(search));
    if (category && category !== 'All') filtered = filtered.filter(i => i.categoryName === category);
    
    return [200, { data: filtered, nextCursor: null }];
  });

  mock.onGet(/\/menu-items\/[^\/]+/).reply((config) => {
    const id = config.url?.split('/').pop();
    const item = mockMenu.find(i => i.id === id);
    if (item) return [200, item];
    return [404, { message: 'Not found' }];
  });

  // ==========================================
  // CART
  // ==========================================
  const DELIVERY_FEE = 30;
  const GST_RATE = 0.05; // 5%

  const calculateCartTotal = () => {
    // Compute lineTotal for each item
    appState.cart.items.forEach(item => {
      item.lineTotal = item.price * item.quantity;
    });
    const subtotal = appState.cart.items.reduce((sum, item) => sum + item.lineTotal, 0);
    const taxes = Math.round(subtotal * GST_RATE);
    const deliveryFee = subtotal > 0 ? DELIVERY_FEE : 0;
    appState.cart.subtotal = subtotal;
    appState.cart.taxes = taxes;
    appState.cart.deliveryFee = deliveryFee;
    appState.cart.total = subtotal + taxes + deliveryFee;
  };

  mock.onGet('/cart').reply(() => [200, appState.cart]);

  mock.onPost('/cart/items').reply((config) => {
    const { menuItemId, quantity, addonIds } = JSON.parse(config.data);
    const menuItem = mockMenu.find(i => i.id === menuItemId);
    
    if (menuItem) {
      let price = menuItem.price;
      const selectedAddons = addonIds ? menuItem.addons.filter(a => addonIds.includes(a.id)) : [];
      price += selectedAddons.reduce((s, a) => s + a.price, 0);

      const existingItem = appState.cart.items.find(i => 
        i.menuItem.id === menuItemId && 
        JSON.stringify(i.addons) === JSON.stringify(selectedAddons)
      );

      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        appState.cart.items.push({
          id: `cart-item-${Date.now()}`,
          menuItem,
          quantity,
          addons: selectedAddons,
          price
        });
      }
      calculateCartTotal();
    }
    return [200, appState.cart];
  });

  mock.onPatch(/\/cart\/items\/[^\/]+/).reply((config) => {
    const id = config.url?.split('/').pop();
    const { quantity } = JSON.parse(config.data);
    const item = appState.cart.items.find(i => i.id === id);
    if (item) {
      item.quantity = quantity;
      calculateCartTotal();
    }
    return [200, appState.cart];
  });

  mock.onDelete(/\/cart\/items\/[^\/]+/).reply((config) => {
    const id = config.url?.split('/').pop();
    appState.cart.items = appState.cart.items.filter(i => i.id !== id);
    calculateCartTotal();
    return [200, appState.cart];
  });

  mock.onDelete('/cart').reply(() => {
    appState.cart.items = [];
    appState.cart.total = 0;
    return [200, appState.cart];
  });

  // ==========================================
  // PAYMENTS & ORDERS
  // ==========================================
  mock.onPost('/payments/create-intent').reply(200, { clientSecret: 'mock_secret_123' });
  
  mock.onPost('/payments/verify').reply(200, { success: true });

  mock.onPost('/orders').reply((config) => {
    const newOrder = {
      id: `ORD-${Math.floor(Math.random() * 10000)}`,
      createdAt: new Date().toISOString(),
      status: 'Placed',
      totalAmount: appState.cart.total,
      restaurantId: appState.cart.restaurantId,
      items: [...appState.cart.items]
    };
    
    appState.orders.unshift(newOrder);
    
    // Clear cart
    appState.cart.items = [];
    appState.cart.total = 0;

    // Add notification
    appState.notifications.unshift({
      id: `notif-${Date.now()}`,
      title: 'Order Confirmed',
      message: `Your order ${newOrder.id} has been placed successfully!`,
      isRead: false,
      createdAt: new Date().toISOString()
    });

    return [201, newOrder];
  });

  mock.onGet('/orders').reply(() => [200, { data: appState.orders, nextCursor: null }]);

  mock.onGet(/\/orders\/[^\/]+/).reply((config) => {
    const id = config.url?.split('/').pop();
    const order = appState.orders.find(o => o.id === id);
    return order ? [200, order] : [404, { message: 'Order not found' }];
  });

  // ==========================================
  // NOTIFICATIONS
  // ==========================================
  mock.onGet('/notifications').reply(() => [200, { data: appState.notifications, nextCursor: null }]);
  
  mock.onPut(/\/notifications\/[^\/]+\/read/).reply((config) => {
    const id = config.url?.split('/')[2];
    const notif = appState.notifications.find(n => n.id === id);
    if (notif) notif.isRead = true;
    return [200, { success: true }];
  });
  
  mock.onPut('/notifications/read-all').reply(() => {
    appState.notifications.forEach(n => n.isRead = true);
    return [200, { success: true }];
  });

  // ==========================================
  // REVIEWS
  // ==========================================
  mock.onGet(/\/restaurants\/[^\/]+\/reviews/).reply(() => {
    return [200, { data: appState.reviews, nextCursor: null }];
  });

  mock.onPost(/\/restaurants\/[^\/]+\/reviews/).reply((config) => {
    const { rating, comment } = JSON.parse(config.data);
    const newReview = {
      id: `rev-${Date.now()}`,
      rating,
      comment,
      customerName: mockUser.name,
      customerId: mockUser.id,
      createdAt: new Date().toISOString()
    };
    appState.reviews.unshift(newReview);
    return [201, newReview];
  });

  mock.onDelete(/\/reviews\/[^\/]+/).reply((config) => {
    const id = config.url?.split('/').pop();
    appState.reviews = appState.reviews.filter(r => r.id !== id);
    return [200, { success: true }];
  });
  
  // Catch-all to log unmatched requests
  mock.onAny().reply((config) => {
    console.warn(`[DEMO MODE] Unmocked API request: ${config.method?.toUpperCase()} ${config.url}`);
    return [404, { message: 'Unmocked route' }];
  });
};
