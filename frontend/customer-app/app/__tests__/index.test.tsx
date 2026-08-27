import { describe, it, expect, jest, beforeEach } from '@jest/globals';
import { render, screen } from '@testing-library/react-native';
import RootScreen from '../index';
import * as useMenuModule from '../../src/hooks/useMenu';
import * as useCartModule from '../../src/hooks/useCart';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();
const Wrapper = ({ children }: any) => <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;

jest.mock('../../src/context/AuthContext', () => ({
  useAuth: () => ({ user: null, logout: jest.fn() }),
}));
jest.mock('expo-router', () => ({
  useRouter: () => ({ push: jest.fn() }),
}));

describe('Customer App Root Screen', () => {
  beforeEach(() => {
    jest.spyOn(useMenuModule, 'useRestaurants').mockReturnValue({ data: { pages: [{ data: [{ id: '1', name: 'BYTE++ Cafe', address: 'Bangalore' }] }] }, isLoading: false, isError: false } as any);
    jest.spyOn(useMenuModule, 'useCategories').mockReturnValue({ data: [{ id: 'c1', name: 'ROLLS' }], isLoading: false } as any);
    jest.spyOn(useMenuModule, 'useMenu').mockReturnValue({ data: { pages: [{ data: [{ id: 'm1', name: 'Veg Roll', price: 59, availability: true }] }] }, isLoading: false, isError: false, refetch: jest.fn() } as any);
    jest.spyOn(useCartModule, 'useCart').mockReturnValue({ data: { items: [], itemCount: 0, subtotal: 0 }, isLoading: false, isError: false } as any);
  });

  it('renders correctly and displays expected text', async () => {
    await render(<RootScreen />, { wrapper: Wrapper });
    expect(screen.getByText('BYTE++ Café')).toBeTruthy();
    expect(screen.getByText('Menu')).toBeTruthy();
    expect(screen.getByText('All')).toBeTruthy();
    expect(screen.getByText(/Veg Roll/)).toBeTruthy();
    expect(screen.getByText('₹59')).toBeTruthy();
  });
});
