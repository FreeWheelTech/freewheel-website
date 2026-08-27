import React from 'react';
import { View, StyleSheet, ViewProps, ViewStyle } from 'react-native';
import { useTheme } from '@/hooks/use-theme';

export interface CardProps extends ViewProps {
  style?: ViewStyle;
  children: React.ReactNode;
  variant?: 'elevated' | 'outlined' | 'flat';
}

export const Card = ({
  style,
  children,
  variant = 'elevated',
  ...rest
}: CardProps) => {
  const theme = useTheme();

  return (
    <View
      style={[
        styles.base,
        {
          backgroundColor: theme.card,
          borderColor: variant === 'outlined' ? theme.border : 'transparent',
          borderWidth: variant === 'outlined' ? 1 : 0,
        },
        variant === 'elevated' && styles.elevated,
        style,
      ]}
      {...rest}
    >
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  base: {
    borderRadius: 16,
    padding: 16,
    overflow: 'hidden',
  },
  elevated: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
});
