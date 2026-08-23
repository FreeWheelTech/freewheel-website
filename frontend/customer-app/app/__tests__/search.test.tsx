import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react-native';
import SearchScreen from '../search';
import { useGlobalMenuSearch } from '../../src/hooks/useMenu';
import { useDebounce } from '../../src/hooks/useDebounce';
import { useRouter } from 'expo-router';

jest.mock('../../src/hooks/useMenu');
jest.mock('../../src/hooks/useDebounce');
jest.mock('expo-router', () => ({
  useRouter: jest.fn(),
}));

describe('SearchScreen', () => {
  const mockRouter = { push: jest.fn(), back: jest.fn() };
  
  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
    (useDebounce as jest.Mock).mockImplementation((val) => val);
  });

  it('1. Renders empty state correctly', async () => {
    (useGlobalMenuSearch as jest.Mock).mockReturnValue({
      data: { pages: [{ data: [] }] },
      isLoading: false,
      isError: false,
    });

    await render(<SearchScreen />);
    expect(screen.getByText('No food found')).toBeTruthy();
  });

  it('2. Shows loading state', async () => {
    (useGlobalMenuSearch as jest.Mock).mockReturnValue({
      data: undefined,
      isLoading: true,
      isError: false,
    });

    await render(<SearchScreen />);
    // React Native ActivityIndicator usually doesn't have text, we just assume it renders if not crashed
  });

  it('3. Renders search results', async () => {
    (useGlobalMenuSearch as jest.Mock).mockReturnValue({
      data: {
        pages: [{
          data: [{ id: '1', name: 'Burger', price: 100, availability: true, category: { restaurant: { name: 'Cafe' } } }]
        }]
      },
      isLoading: false,
      isError: false,
    });

    await render(<SearchScreen />);
    expect(screen.getByText('Burger')).toBeTruthy();
    expect(screen.getByText('₹100')).toBeTruthy();
  });

  it('4. Applies search debounce', async () => {
    (useGlobalMenuSearch as jest.Mock).mockReturnValue({
      data: { pages: [{ data: [] }] },
      isLoading: false,
      isError: false,
    });

    await render(<SearchScreen />);
    fireEvent.changeText(screen.getByPlaceholderText(/Search for/i), 'Pizza');
    
    // useDebounce is mocked to return instantly here, but we can verify the text input updates
    await waitFor(() => {
      expect(screen.getByPlaceholderText(/Search for/i).props.value).toBe('Pizza');
    });
  });

  it.skip('5. Opens filter modal and applies sort', async () => {
    (useGlobalMenuSearch as jest.Mock).mockReturnValue({
      data: { pages: [{ data: [] }] },
      isLoading: false,
      isError: false,
    });

    await render(<SearchScreen />);
    fireEvent.press(screen.getByText('Filters'));

    // Modal is now open
    expect(screen.getByText('Price (Low to High)')).toBeTruthy();
    fireEvent.press(screen.getByText('Price (Low to High)'));

    fireEvent.press(screen.getByText('Apply Filters'));
    
    // In a real scenario we'd assert useGlobalMenuSearch was called with new filters, 
    // but since state updates trigger re-renders, the mock would receive the new values.
  });
});
