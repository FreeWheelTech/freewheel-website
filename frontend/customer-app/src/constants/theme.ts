/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 */

import '@/global.css';

import { Platform } from 'react-native';

export const Colors = {
  light: {
    text: '#2D1A11',
    background: '#FDF7F0',
    backgroundElement: '#FFFFFF',
    backgroundSelected: '#F0E6D8',
    textSecondary: '#6C5446',
    primary: '#4A2B1D',
    primaryText: '#FFFFFF',
    accent: '#B7713A',
    border: '#E8DCC8',
    card: '#FFFFFF',
    error: '#D32F2F',
    success: '#388E3C',
  },
  dark: {
    text: '#FDF7F0',
    background: '#120D0A',
    backgroundElement: '#1C1410',
    backgroundSelected: '#2A1F18',
    textSecondary: '#A38C7D',
    primary: '#B7713A',
    primaryText: '#FFFFFF',
    accent: '#C87D43',
    border: '#2A1F18',
    card: '#1C1410',
    error: '#EF5350',
    success: '#66BB6A',
  },
} as const;

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;

export const Fonts = Platform.select({
  ios: {
    sans: 'system-ui',
    serif: 'ui-serif',
    rounded: 'ui-rounded',
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: 'var(--font-display)',
    serif: 'var(--font-serif)',
    rounded: 'var(--font-rounded)',
    mono: 'var(--font-mono)',
  },
});

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
} as const;

export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;
export const MaxContentWidth = 800;
