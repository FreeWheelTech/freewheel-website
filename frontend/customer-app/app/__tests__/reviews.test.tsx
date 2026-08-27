import React from 'react';
import { render, screen } from '@testing-library/react-native';
import RestaurantReviewsScreen from '../restaurant/[id]/reviews';
import { useRestaurantReviews } from '../../src/hooks/useReviews';

jest.mock('expo-router', () => ({
  useLocalSearchParams: jest.fn().mockReturnValue({ id: 'rest1' }),
  useRouter: jest.fn().mockReturnValue({ back: jest.fn() }),
}));

jest.mock('../../src/hooks/useReviews', () => ({
  useRestaurantReviews: jest.fn(),
  useDeleteReview: jest.fn().mockReturnValue({ mutate: jest.fn() }),
  useUpdateReview: jest.fn().mockReturnValue({ mutate: jest.fn() }),
  useCreateReview: jest.fn().mockReturnValue({ mutate: jest.fn() }),
}));

jest.mock('../../src/context/AuthContext', () => ({
  useAuth: jest.fn().mockReturnValue({ user: { customerProfile: { id: 'c1' } } }),
}));

describe('RestaurantReviewsScreen', () => {
  it('1. Displays loading state', async () => {
    (useRestaurantReviews as jest.Mock).mockReturnValue({
      data: null,
      isLoading: true,
      isError: false,
    });

    const utils = await render(<RestaurantReviewsScreen />);
    expect(utils.toJSON()).toBeTruthy();
  });

  it('2. Displays empty reviews state', async () => {
    (useRestaurantReviews as jest.Mock).mockReturnValue({
      data: { pages: [{ data: [] }] },
      isLoading: false,
      isError: false,
    });

    await render(<RestaurantReviewsScreen />);
    expect(screen.getByText('No reviews yet.')).toBeTruthy();
  });

  it('3. Displays list of reviews', async () => {
    (useRestaurantReviews as jest.Mock).mockReturnValue({
      data: {
        pages: [{
          data: [
            { id: '1', rating: 5, comment: 'Excellent food!', createdAt: new Date().toISOString(), customerName: 'Alice' },
            { id: '2', rating: 3, comment: 'Average', createdAt: new Date().toISOString(), customerName: 'Bob' },
          ]
        }]
      },
      isLoading: false,
      isError: false,
    });

    await render(<RestaurantReviewsScreen />);
    expect(screen.getByText('Alice')).toBeTruthy();
    expect(screen.getByText('Excellent food!')).toBeTruthy();
    expect(screen.getByText('Bob')).toBeTruthy();
    expect(screen.getByText('Average')).toBeTruthy();
    // 5 stars for Alice
    expect(screen.getByText('★★★★★')).toBeTruthy();
    // 3 stars for Bob
    expect(screen.getByText('★★★☆☆')).toBeTruthy();
  });
});
