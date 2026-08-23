import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AddCartItemDto } from './dto/add-cart-item.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';

@Injectable()
export class CartService {
  constructor(private prisma: PrismaService) {}

  private async ensureCustomerProfile(userId: string) {
    let profile = await this.prisma.customerProfile.findUnique({
      where: { userId },
    });
    if (!profile) {
      profile = await this.prisma.customerProfile.create({
        data: { userId },
      });
    }
    return profile;
  }

  private async getOrCreateCart(customerProfileId: string) {
    let cart = await this.prisma.cart.findUnique({
      where: { customerProfileId },
      include: {
        items: {
          include: {
            menuItem: true,
            addons: { include: { menuItemAddon: true } },
          },
        },
      },
    });

    if (!cart) {
      cart = await this.prisma.cart.create({
        data: { customerProfileId },
        include: {
          items: {
            include: {
              menuItem: true,
              addons: { include: { menuItemAddon: true } },
            },
          },
        },
      });
    }

    return cart;
  }

  async getCart(userId: string) {
    const profile = await this.ensureCustomerProfile(userId);
    const cart = await this.getOrCreateCart(profile.id);

    return this.formatCartResponse(cart);
  }

  private formatCartResponse(cart: any) {
    let subtotal = 0;
    let itemCount = 0;

    const formattedItems = cart.items.map((item: any) => {
      const basePrice = Number(item.menuItem.price);
      const addonsPrice = item.addons.reduce(
        (sum: number, addon: any) => sum + Number(addon.menuItemAddon.price),
        0,
      );

      const lineTotal = (basePrice + addonsPrice) * item.quantity;
      subtotal += lineTotal;
      itemCount += item.quantity;

      return {
        id: item.id,
        quantity: item.quantity,
        menuItem: {
          id: item.menuItem.id,
          name: item.menuItem.name,
          price: basePrice,
        },
        addons: item.addons.map((a: any) => ({
          id: a.menuItemAddon.id,
          name: a.menuItemAddon.name,
          price: Number(a.menuItemAddon.price),
        })),
        lineTotal,
      };
    });

    return {
      id: cart.id,
      restaurantId: cart.restaurantId,
      items: formattedItems,
      subtotal,
      itemCount,
    };
  }

  async addItem(userId: string, addCartItemDto: AddCartItemDto) {
    const profile = await this.ensureCustomerProfile(userId);
    const cart = await this.getOrCreateCart(profile.id);

    const { menuItemId, quantity, addonIds = [] } = addCartItemDto;

    // Validate Menu Item
    const menuItem = await this.prisma.menuItem.findUnique({
      where: { id: menuItemId },
      include: { category: true },
    });

    if (!menuItem) throw new NotFoundException('Menu item not found');
    if (!menuItem.availability)
      throw new BadRequestException('Menu item is currently unavailable');

    // Restaurant Check
    if (
      cart.restaurantId &&
      cart.restaurantId !== menuItem.category.restaurantId
    ) {
      if (cart.items.length > 0) {
        throw new ConflictException(
          'Your cart contains items from another restaurant. Clear the cart before adding items from this restaurant.',
        );
      }
    }

    // Validate Addons
    if (addonIds.length > 0) {
      const addons = await this.prisma.menuItemAddon.findMany({
        where: { id: { in: addonIds } },
      });

      if (addons.length !== addonIds.length) {
        throw new BadRequestException(
          'One or more selected addons are invalid',
        );
      }

      for (const addon of addons) {
        if (addon.menuItemId !== menuItemId) {
          throw new BadRequestException(
            `Addon ${addon.name} does not belong to the selected menu item`,
          );
        }
        if (!addon.availability) {
          throw new BadRequestException(
            `Addon ${addon.name} is currently unavailable`,
          );
        }
      }
    }

    // Update restaurant if cart was empty
    if (!cart.restaurantId || cart.items.length === 0) {
      await this.prisma.cart.update({
        where: { id: cart.id },
        data: { restaurantId: menuItem.category.restaurantId },
      });
    }

    // Check for duplicate item selection
    const duplicateItem = cart.items.find((item) => {
      if (item.menuItemId !== menuItemId) return false;
      const existingAddonIds = item.addons
        .map((a: any) => a.menuItemAddon.id)
        .sort();
      const newAddonIds = [...addonIds].sort();
      return JSON.stringify(existingAddonIds) === JSON.stringify(newAddonIds);
    });

    if (duplicateItem) {
      const newQuantity = duplicateItem.quantity + quantity;
      if (newQuantity > 99)
        throw new BadRequestException('Maximum quantity exceeded');

      await this.prisma.cartItem.update({
        where: { id: duplicateItem.id },
        data: { quantity: newQuantity },
      });
    } else {
      if (quantity > 99)
        throw new BadRequestException('Maximum quantity exceeded');

      await this.prisma.$transaction(async (prisma) => {
        const cartItem = await prisma.cartItem.create({
          data: {
            cartId: cart.id,
            menuItemId,
            quantity,
          },
        });

        if (addonIds.length > 0) {
          await prisma.cartItemAddon.createMany({
            data: addonIds.map((addonId) => ({
              cartItemId: cartItem.id,
              menuItemAddonId: addonId,
            })),
          });
        }
      });
    }

    return this.getCart(userId);
  }

  async updateQuantity(
    userId: string,
    cartItemId: string,
    updateDto: UpdateCartItemDto,
  ) {
    const profile = await this.ensureCustomerProfile(userId);
    const cart = await this.getOrCreateCart(profile.id);

    const cartItem = cart.items.find((i) => i.id === cartItemId);
    if (!cartItem) throw new NotFoundException('Cart item not found');

    if (updateDto.quantity > 99)
      throw new BadRequestException('Maximum quantity exceeded');

    await this.prisma.cartItem.update({
      where: { id: cartItemId },
      data: { quantity: updateDto.quantity },
    });

    return this.getCart(userId);
  }

  async removeItem(userId: string, cartItemId: string) {
    const profile = await this.ensureCustomerProfile(userId);
    const cart = await this.getOrCreateCart(profile.id);

    const cartItem = cart.items.find((i) => i.id === cartItemId);
    if (!cartItem) throw new NotFoundException('Cart item not found');

    await this.prisma.cartItem.delete({
      where: { id: cartItemId },
    });

    // Reset restaurantId if cart becomes empty
    if (cart.items.length === 1) {
      // 1 item before deletion means 0 after
      await this.prisma.cart.update({
        where: { id: cart.id },
        data: { restaurantId: null },
      });
    }

    return this.getCart(userId);
  }

  async clearCart(userId: string) {
    const profile = await this.ensureCustomerProfile(userId);
    const cart = await this.getOrCreateCart(profile.id);

    await this.prisma.cartItem.deleteMany({
      where: { cartId: cart.id },
    });

    await this.prisma.cart.update({
      where: { id: cart.id },
      data: { restaurantId: null },
    });

    return this.getCart(userId);
  }
}
