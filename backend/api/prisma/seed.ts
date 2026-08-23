import { PrismaClient, DietaryType, Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting DB Seeding...');

  // 1. Seed Demo Accounts
  const passwordHash = await bcrypt.hash('Password123!', 10);

  const customerUser = await prisma.user.upsert({
    where: { email: 'customer@example.com' },
    update: { passwordHash, role: Role.CUSTOMER },
    create: {
      email: 'customer@example.com',
      name: 'Test Customer',
      phone: '9876543210',
      passwordHash,
      role: Role.CUSTOMER,
      customerProfile: {
        create: {},
      },
    },
  });

  const ownerUser = await prisma.user.upsert({
    where: { email: 'owner@example.com' },
    update: { passwordHash, role: Role.OWNER },
    create: {
      email: 'owner@example.com',
      name: 'Test Owner',
      phone: '8765432109',
      passwordHash,
      role: Role.OWNER,
    },
  });

  console.log('Demo accounts created.');

  // 2. Seed Restaurants
  const restaurantsData = [
    {
      id: 'byte-burger-id',
      name: 'BYTE Burger',
      description: 'The best burgers on campus',
      address: 'Food Court, Uniworld-1, Bangalore',
    },
    {
      id: 'chennai-bites-id',
      name: 'Chennai Bites',
      description: 'Authentic South Indian Cuisine',
      address: 'Main Road, Uniworld-2, Bangalore',
    },
    {
      id: 'campus-kitchen-id',
      name: 'Campus Kitchen',
      description: 'Your daily meals and snacks',
      address: 'Hostel Block A, Bangalore',
    },
    {
      id: 'spice-hub-id',
      name: 'Spice Hub',
      description: 'Spicy Indian curries and biryani',
      address: 'North Avenue, Bangalore',
    },
    {
      id: 'south-street-cafe-id',
      name: 'South Street Café',
      description: 'Coffee, snacks, and good vibes',
      address: 'South Avenue, Bangalore',
    },
  ];

  for (const r of restaurantsData) {
    await prisma.restaurant.upsert({
      where: { id: r.id },
      update: r,
      create: r,
    });
  }

  // Assign owner to the first restaurant
  await prisma.restaurantStaff.upsert({
    where: {
      userId_restaurantId: { userId: ownerUser.id, restaurantId: 'byte-burger-id' },
    },
    update: {},
    create: {
      userId: ownerUser.id,
      restaurantId: 'byte-burger-id',
    },
  });

  // Helper for menu seeding
  async function seedCategoryAndItems(restaurantId: string, categoriesData: any[]) {
    for (const catData of categoriesData) {
      const category = await prisma.category.upsert({
        where: {
          restaurantId_name: { restaurantId: restaurantId, name: catData.name },
        },
        update: {},
        create: {
          restaurantId: restaurantId,
          name: catData.name,
        },
      });

      for (const item of catData.items) {
        let menuItem = await prisma.menuItem.findFirst({
          where: { categoryId: category.id, name: item.name }
        });

        if (menuItem) {
          menuItem = await prisma.menuItem.update({
            where: { id: menuItem.id },
            data: { price: item.price, dietaryType: item.dietaryType },
          });
        } else {
          menuItem = await prisma.menuItem.create({
            data: {
              categoryId: category.id,
              name: item.name,
              description: `Delicious ${item.name}`,
              price: item.price,
              dietaryType: item.dietaryType,
            },
          });
        }

        if (item.addon) {
          let existingAddon = await prisma.menuItemAddon.findFirst({
            where: { menuItemId: menuItem.id, name: 'Extra Cheese' }
          });
          
          if (!existingAddon) {
             await prisma.menuItemAddon.create({
               data: {
                 menuItemId: menuItem.id,
                 name: 'Extra Cheese',
                 price: 20,
               }
             });
          }
        }
      }
    }
  }

  // 3. Seed Menu Categories & Items for BYTE Burger
  const byteBurgerCategories = [
    {
      name: 'Burgers',
      items: [
        { name: 'Veg Burger', price: 119, dietaryType: DietaryType.VEG, addon: true },
        { name: 'Chicken Burger', price: 149, dietaryType: DietaryType.NON_VEG, addon: true },
        { name: 'Double Cheese Burger', price: 169, dietaryType: DietaryType.VEG, addon: true },
        { name: 'Spicy Paneer Burger', price: 139, dietaryType: DietaryType.VEG, addon: true },
      ],
    },
    {
      name: 'Sides',
      items: [
        { name: 'French Fries', price: 79, dietaryType: DietaryType.VEG, addon: false },
        { name: 'Peri Peri Fries', price: 99, dietaryType: DietaryType.VEG, addon: false },
        { name: 'Chicken Nuggets', price: 129, dietaryType: DietaryType.NON_VEG, addon: false },
      ],
    },
    {
      name: 'Beverages',
      items: [
        { name: 'Coke', price: 49, dietaryType: DietaryType.VEG, addon: false },
        { name: 'Cold Coffee', price: 89, dietaryType: DietaryType.VEG, addon: false },
        { name: 'Lime Soda', price: 59, dietaryType: DietaryType.VEG, addon: false },
      ],
    },
  ];
  await seedCategoryAndItems('byte-burger-id', byteBurgerCategories);

  // 4. Seed Menu Categories & Items for Chennai Bites
  const chennaiBitesCategories = [
    {
      name: 'South Indian',
      items: [
        { name: 'Idli (2 pcs)', price: 49, dietaryType: DietaryType.VEG, addon: false },
        { name: 'Masala Dosa', price: 89, dietaryType: DietaryType.VEG, addon: true },
        { name: 'Medu Vada (2 pcs)', price: 59, dietaryType: DietaryType.VEG, addon: false },
        { name: 'Pongal', price: 79, dietaryType: DietaryType.VEG, addon: false },
      ],
    },
    {
      name: 'Rolls',
      items: [
        { name: 'Paneer Roll', price: 79, dietaryType: DietaryType.VEG, addon: false },
        { name: 'Chicken Roll', price: 89, dietaryType: DietaryType.NON_VEG, addon: false },
        { name: 'Egg Roll', price: 69, dietaryType: DietaryType.EGG, addon: false },
      ],
    },
    {
      name: 'Drinks',
      items: [
        { name: 'Filter Coffee', price: 35, dietaryType: DietaryType.VEG, addon: false },
        { name: 'Tea', price: 25, dietaryType: DietaryType.VEG, addon: false },
        { name: 'Fresh Juice', price: 60, dietaryType: DietaryType.VEG, addon: false },
      ],
    },
  ];
  await seedCategoryAndItems('chennai-bites-id', chennaiBitesCategories);

  // 5. Seed Campus Kitchen (Biryani)
  const campusKitchenCategories = [
    {
      name: 'Biryani',
      items: [
        { name: 'Chicken Biryani', price: 199, dietaryType: DietaryType.NON_VEG, addon: true },
        { name: 'Paneer Biryani', price: 179, dietaryType: DietaryType.VEG, addon: true },
        { name: 'Egg Biryani', price: 159, dietaryType: DietaryType.EGG, addon: true },
      ],
    },
    {
      name: 'Desserts',
      items: [
        { name: 'Gulab Jamun', price: 49, dietaryType: DietaryType.VEG, addon: false },
        { name: 'Rasmalai', price: 69, dietaryType: DietaryType.VEG, addon: false },
      ],
    },
  ];
  await seedCategoryAndItems('campus-kitchen-id', campusKitchenCategories);

  console.log('Seeding completed successfully.');
}

main()
  .catch((e) => {
    console.error('Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
