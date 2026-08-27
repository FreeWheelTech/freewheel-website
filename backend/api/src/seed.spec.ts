import { PrismaClient, DietaryType } from '@prisma/client';
import { execSync } from 'child_process';
import * as path from 'path';

const prisma = new PrismaClient();

const runSeed = () => {
  const seedPath = path.resolve(__dirname, '../prisma/seed.ts');
  execSync(`npx ts-node "${seedPath}"`, { stdio: 'ignore' });
};

describe('Menu Seed Tests (Phase 2B)', () => {
  beforeAll(async () => {
    // Clear all existing data to ensure a fresh test, handling constraints
    await prisma.payment.deleteMany();
    await prisma.orderStatusHistory.deleteMany();
    await prisma.orderItem.deleteMany();
    await prisma.order.deleteMany();

    await prisma.menuItemAddon.deleteMany();
    await prisma.menuItem.deleteMany();
    await prisma.category.deleteMany();

    await prisma.restaurantStaff.deleteMany();
    await prisma.restaurant.deleteMany();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe('11. Seed completes successfully on a fresh database', () => {
    it('Should execute the seed script without throwing', () => {
      expect(() => runSeed()).not.toThrow();
    });
  });

  describe('8. Running the seed twice does not create duplicates', () => {
    it('Should be completely idempotent', async () => {
      // Run it a second time
      expect(() => runSeed()).not.toThrow();

      // Count entities
      const restaurants = await prisma.restaurant.count();
      const categories = await prisma.category.count();
      const menuItems = await prisma.menuItem.count();
      const addons = await prisma.menuItemAddon.count();

      expect(restaurants).toBe(1);
      expect(categories).toBe(11);
      expect(menuItems).toBe(61);
      expect(addons).toBe(10);
    });
  });

  describe('1. Restaurant is created correctly', () => {
    it('Should create BYTE++ Café', async () => {
      const cafe = await prisma.restaurant.findUnique({
        where: { id: 'byte-cafe-id' },
      });
      expect(cafe).toBeDefined();
      expect(cafe?.name).toBe('BYTE++ Café');
    });
  });

  describe('2 & 3. All expected categories and menu items are created', () => {
    it('Should accurately load all 11 categories and 61 items', async () => {
      const categories = await prisma.category.findMany({
        include: { menuItems: true },
      });
      expect(categories.length).toBe(11);

      const totalItems = categories.reduce(
        (sum, cat) => sum + cat.menuItems.length,
        0,
      );
      expect(totalItems).toBe(61);

      const rolls = categories.find((c) => c.name === 'ROLLS');
      expect(rolls?.menuItems.length).toBe(4);
    });
  });

  describe('4. Menu prices match the source PDF', () => {
    it('Should accurately reflect prices from the PDF (e.g. Butterscotch is 35, Buttermilk is 19)', async () => {
      // Ice cream butterscotch is 35. Shake is 79. We find the ice cream by category
      const iceCreamCat = await prisma.category.findFirst({
        where: { name: 'ICE CREAM' },
      });
      const iceCreamButterscotch = await prisma.menuItem.findFirst({
        where: { name: 'Butterscotch', categoryId: iceCreamCat?.id },
      });
      expect(iceCreamButterscotch?.price.toNumber()).toBe(35);

      const buttermilk = await prisma.menuItem.findFirst({
        where: { name: 'Buttermilk' },
      });
      expect(buttermilk?.price.toNumber()).toBe(19);

      const vegBurger = await prisma.menuItem.findFirst({
        where: { name: 'Veg', category: { name: 'BURGERS & SIDES' } },
      });
      expect(vegBurger?.price.toNumber()).toBe(79);
    });
  });

  describe('5. Red-marked items have the intended classification', () => {
    it('Should correctly map red markers to NON_VEG and EGG', async () => {
      const eggRoll = await prisma.menuItem.findFirst({
        where: { name: 'Egg', category: { name: 'ROLLS' } },
      });
      expect(eggRoll?.dietaryType).toBe(DietaryType.EGG);

      const chickenBurger = await prisma.menuItem.findFirst({
        where: { name: 'Chicken', category: { name: 'BURGERS & SIDES' } },
      });
      expect(chickenBurger?.dietaryType).toBe(DietaryType.NON_VEG);

      const breadOmelette = await prisma.menuItem.findFirst({
        where: {
          name: 'Bread Omelette',
          category: { name: 'EGG SPEACIAL (2PC)' },
        },
      });
      expect(breadOmelette?.dietaryType).toBe(DietaryType.EGG);
    });
  });

  describe('6 & 7. Cheese add-on logic', () => {
    it('Cheese add-on has correct price and is assigned correctly', async () => {
      const eggSandwich = await prisma.menuItem.findFirst({
        where: { name: 'Egg', category: { name: 'SANDWICHES' } },
      });
      const addon = await prisma.menuItemAddon.findFirst({
        where: { menuItemId: eggSandwich?.id },
      });

      expect(addon).toBeDefined();
      expect(addon?.name).toBe('With Cheese');
      expect(addon?.price.toNumber()).toBe(10);
    });
  });

  describe('9. Missing/invalid category relationship fails appropriately', () => {
    it('Cannot create a menu item with a non-existent category', async () => {
      await expect(
        prisma.menuItem.create({
          data: {
            name: 'Ghost Item',
            price: 10,
            categoryId: 'invalid-id-that-does-not-exist',
          },
        }),
      ).rejects.toThrow(); // Prisma throws a KnownRequestError on FK constraint violation
    });
  });

  describe('10. Invalid price data is rejected', () => {
    it('Cannot use non-decimal/malformed inputs for price', async () => {
      await expect(
        prisma.menuItem.create({
          data: {
            name: 'Bad Price Item',
            price: 'invalid_price_string',
            categoryId: (await prisma.category.findFirst())!.id,
          },
        }),
      ).rejects.toThrow(); // Prisma validation catches this before DB
    });
  });
});
