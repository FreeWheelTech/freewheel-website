import { describe, it, expect, jest, beforeEach } from '@jest/globals';
import { render, screen, fireEvent } from '@testing-library/react-native';
import ItemDetails from '../item/[id]';
import * as useMenuModule from '../../src/hooks/useMenu';
import * as useCartModule from '../../src/hooks/useCart';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();
const Wrapper = ({ children }: any) => <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;

jest.mock('../../src/context/AuthContext', () => ({
  useAuth: () => ({ user: { id: 'user1' }, logout: jest.fn() }),
}));

jest.mock('expo-router', () => ({
  useLocalSearchParams: () => ({ id: 'm1' }),
  useRouter: () => ({ push: jest.fn(), back: jest.fn() }),
}));

describe('Item Details Screen (Cart functions)', () => {
  const mockAddToCart = jest.fn();

  beforeEach(() => {
    jest.spyOn(useMenuModule, 'useMenuItem').mockReturnValue({
      data: {
        id: 'm1',
        name: 'Chicken Roll',
        price: 89,
        availability: true,
        addons: [
          { id: 'a1', name: 'Cheese', price: 10, availability: true },
          { id: 'a2', name: 'Extra Egg', price: 15, availability: true },
        ]
      },
      isLoading: false,
      isError: false
    } as any);

    jest.spyOn(useCartModule, 'useAddToCart').mockReturnValue({
      mutate: mockAddToCart,
      isPending: false,
    } as any);
  });

  it('renders item details and addons', async () => {
    await render(<ItemDetails />, { wrapper: Wrapper });
    expect(screen.getByText('Chicken Roll')).toBeTruthy();
    expect(screen.getByText('₹89')).toBeTruthy();
    expect(screen.getByText('Cheese')).toBeTruthy();
    expect(screen.getByText('+ ₹10')).toBeTruthy();
  });

  it('handles quantity changes and add to cart', async () => {
    await render(<ItemDetails />, { wrapper: Wrapper });
    
    // Increment quantity
    fireEvent.press(screen.getByTestId('increment-btn'));
    expect(await screen.findByText('2')).toBeTruthy();

    // Select Addon
    fireEvent.press(screen.getByTestId('addon-Cheese'));
    expect(await screen.findByText('✓')).toBeTruthy();

    // Add to cart
    fireEvent.press(screen.getByText('Add to Cart'));

    expect(mockAddToCart).toHaveBeenCalledWith(
      { menuItemId: 'm1', quantity: 2, addonIds: ['a1'] },
      expect.any(Object)
    );
  });
});
