import React from 'react';

export const StripeProviderWrapper = ({ children, publishableKey }: { children: React.ReactNode, publishableKey: string }) => {
  return <>{children}</>;
};
