# Cart Module Architecture

## Overview
The Cart module handles temporary shopping data for customers before they proceed to checkout. It ensures business rules around pricing, add-ons, and restaurant boundaries.

## Key Design Decisions
1. **Server-Authoritative Pricing**: The API recalculates all subtotals and line totals using database prices. Client-submitted prices are ignored.
2. **Single Restaurant Restriction**: The `Cart` table has an optional `restaurantId` column. If it is set, subsequent items must belong to the same restaurant. Clearing the cart resets this field.
3. **Add-on Hashing**: The backend identifies "duplicate" items by comparing the `menuItemId` and a sorted list of `addonIds`. If an identical configuration is added, the quantity is merged.

## Database Schema Highlights
- `Cart`: Belongs to `CustomerProfile` (1:1). Contains a `restaurantId` to lock the cart.
- `CartItem`: Belongs to `Cart` and `MenuItem`. Contains `quantity`.
- `CartItemAddon`: A mapping table linking `CartItem` and `MenuItemAddon` (since one `CartItem` can have multiple addons).
