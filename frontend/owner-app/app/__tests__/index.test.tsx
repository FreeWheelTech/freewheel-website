import { describe, it, expect, jest, beforeEach } from '@jest/globals';
import { render } from '@testing-library/react-native';
import RootScreen from '../index';
import * as useOwnerMenuModule from '../../src/hooks/useOwnerMenu';

jest.mock('../../src/context/AuthContext', () => ({
  useAuth: () => ({ user: null, logout: jest.fn() }),
}));
jest.mock('expo-router', () => ({
  useRouter: () => ({ push: jest.fn() }),
}));

describe('Owner App Root Screen', () => {
  beforeEach(() => {
    jest.spyOn(useOwnerMenuModule, 'useRestaurants').mockReturnValue({ data: [{ id: '1', name: 'BYTE++ Cafe', address: 'Bangalore' }], isLoading: false, isError: false } as any);
  });

  it('renders correctly and displays expected text', async () => {
    const { getByText } = await render(<RootScreen />);
    expect(getByText('Owner Dashboard')).toBeTruthy();
    expect(getByText('BYTE++ Cafe')).toBeTruthy();
    expect(getByText('Manage Menu →')).toBeTruthy();
  });
});
