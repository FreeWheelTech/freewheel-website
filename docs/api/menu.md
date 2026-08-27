# Menu API Documentation

## Base URL
`/api/v1`

## Customer Endpoints (Public)

### GET `/restaurants`
Returns a list of all active restaurants.

### GET `/restaurants/:id`
Returns details of a specific restaurant.

### GET `/restaurants/:id/categories`
Returns a list of menu categories for the restaurant.

### GET `/restaurants/:id/menu`
Returns a list of menu items for the restaurant.
**Query Parameters:**
- `category` (string, optional) - Filter by category name
- `search` (string, optional) - Text search on menu item name
- `availability` (boolean, optional) - Filter by availability status

### GET `/menu-items/:id`
Returns details of a specific menu item including its add-ons.

---

## Owner Endpoints (Protected: OWNER/ADMIN)

> **Authorization**: All Owner APIs strictly verify that the authenticated User ID matches a record in `RestaurantStaff` for the related restaurant. This prevents an Owner from modifying a restaurant they do not manage (IDOR protection).

### POST `/restaurants/:id/categories`
Create a new category.
**Body:** `{ "name": "string", "restaurantId": "UUID" }`

### PATCH `/categories/:categoryId`
Update a category.
**Body:** `{ "name": "string" }`

### DELETE `/categories/:categoryId`
Delete a category. Requires the category to be empty of menu items.

### POST `/categories/:categoryId/menu-items`
Create a new menu item inside a category.
**Body:** `{ "name": "string", "description": "string", "price": "number", "dietaryType": "VEG|EGG|NON_VEG", "availability": "boolean" }`

### PATCH `/menu-items/:menuItemId`
Update a menu item.
**Body:** `{ "name": "string", "description": "string", "price": "number", "dietaryType": "VEG|EGG|NON_VEG", "availability": "boolean" }`

### PATCH `/menu-items/:menuItemId/availability`
Quickly toggle menu item availability on/off.
**Body:** `{ "availability": "boolean" }`

### DELETE `/menu-items/:menuItemId`
Delete a menu item entirely.
