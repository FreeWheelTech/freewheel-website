# Cart API

Base URL: `/cart`

## `GET /cart`
Fetches the current user's cart. Creates an empty cart if one doesn't exist.

**Response**
```json
{
  "id": "cart_uuid",
  "restaurantId": "restaurant_uuid",
  "items": [
    {
      "id": "cart_item_uuid",
      "quantity": 2,
      "menuItem": {
        "id": "item_uuid",
        "name": "Chicken Roll",
        "price": 89
      },
      "addons": [
        {
          "id": "addon_uuid",
          "name": "Cheese",
          "price": 10
        }
      ],
      "lineTotal": 198
    }
  ],
  "subtotal": 198,
  "itemCount": 2
}
```

## `POST /cart/items`
Adds a menu item to the cart. Validates restaurant restrictions.

**Body**
```json
{
  "menuItemId": "uuid",
  "quantity": 1,
  "addonIds": ["addon_uuid"]
}
```

## `PATCH /cart/items/:id`
Updates the quantity of an existing cart item. Max quantity is 99.

**Body**
```json
{
  "quantity": 2
}
```

## `DELETE /cart/items/:id`
Removes an item from the cart. If the cart becomes empty, `restaurantId` is cleared.

## `DELETE /cart`
Clears all items from the cart and resets `restaurantId`.
