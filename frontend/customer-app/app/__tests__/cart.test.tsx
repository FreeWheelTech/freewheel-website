import { describe, it, expect, jest, beforeEach } from '@jest/globals';
import { render, screen, fireEvent } from '@testing-library/react-native';
import CartScreen from '../cart';
import * as useCartModule from '../../src/hooks/useCart';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();
const Wrapper = ({ children }: any) => <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;

jest.mock('../../src/context/AuthContext', () => ({
  useAuth: () => ({ user: { id: 'user1' }, logout: jest.fn() }),
}));

jest.mock('expo-router', () => ({
  useRouter: () => ({ push: jest.fn(), back: jest.fn() }),
}));

describe('Cart Screen', () => {
  const mockUpdateMutation = jest.fn();
  const mockRemoveMutation = jest.fn();
  const mockClearMutation = jest.fn();

  beforeEach(() => {
    jest.spyOn(useCartModule, 'useUpdateCartItem').mockReturnValue({ mutate: mockUpdateMutation } as any);
    jest.spyOn(useCartModule, 'useRemoveCartItem').mockReturnValue({ mutate: mockRemoveMutation } as any);
    jest.spyOn(useCartModule, 'useClearCart').mockReturnValue({ mutate: mockClearMutation } as any);
  });

  it('renders correctly with empty cart', async () => {
    jest.spyOn(useCartModule, 'useCart').mockReturnValue({ data: { items: [], itemCount: 0, subtotal: 0 }, isLoading: false, isError: false } as any);
    await render(<CartScreen />, { wrapper: Wrapper });
    
    expect(screen.getByText('Your Cart')).toBeTruthy();
    expect(screen.getByText('Your cart is empty.')).toBeTruthy();
    expect(screen.getByText('Browse Menu')).toBeTruthy();
  });

  it('renders cart items and subtotal', async () => {
    jest.spyOn(useCartModule, 'useCart').mockReturnValue({
      data: {
        items: [
          {
            id: 'cartitem1',
            quantity: 2,
            menuItem: { id: 'm1', name: 'Chicken Roll', price: 89 },
            addons: [{ id: 'a1', name: 'Cheese', price: 10 }],
            lineTotal: 198,
          }
        ],
        itemCount: 2,
        subtotal: 198,
      },
      isLoading: false,
      isError: false
    } as any);

    await render(<CartScreen />, { wrapper: Wrapper });
    
    expect(screen.getByText('Chicken Roll')).toBeTruthy();
    expect(screen.getByText('Cheese (+₹10)')).toBeTruthy();
    expect(screen.getAllByText('₹198').length).toBe(2); // One for line total, one for subtotal
  });

  it('calls update mutation when quantity increases', async () => {
    jest.spyOn(useCartModule, 'useCart').mockReturnValue({
      data: {
        items: [
          {
            id: 'cartitem1',
            quantity: 2,
            menuItem: { id: 'm1', name: 'Chicken Roll', price: 89 },
            addons: [],
            lineTotal: 178,
          }
        ],
        itemCount: 2,
        subtotal: 178,
      },
      isLoading: false,
      isError: false
    } as any);

    await render(<CartScreen />, { wrapper: Wrapper });
    
    const incrementBtn = screen.getByText('+');
    fireEvent.press(incrementBtn);

    expect(mockUpdateMutation).toHaveBeenCalledWith({ cartItemId: 'cartitem1', quantity: 3 });
  });
});
