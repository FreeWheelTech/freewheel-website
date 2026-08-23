-- AlterTable
ALTER TABLE "Cart" ADD COLUMN     "restaurantId" TEXT;

-- CreateTable
CREATE TABLE "CartItemAddon" (
    "id" TEXT NOT NULL,
    "cartItemId" TEXT NOT NULL,
    "menuItemAddonId" TEXT NOT NULL,

    CONSTRAINT "CartItemAddon_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CartItemAddon_cartItemId_menuItemAddonId_key" ON "CartItemAddon"("cartItemId", "menuItemAddonId");

-- AddForeignKey
ALTER TABLE "Cart" ADD CONSTRAINT "Cart_restaurantId_fkey" FOREIGN KEY ("restaurantId") REFERENCES "Restaurant"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CartItemAddon" ADD CONSTRAINT "CartItemAddon_cartItemId_fkey" FOREIGN KEY ("cartItemId") REFERENCES "CartItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CartItemAddon" ADD CONSTRAINT "CartItemAddon_menuItemAddonId_fkey" FOREIGN KEY ("menuItemAddonId") REFERENCES "MenuItemAddon"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
