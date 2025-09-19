import React from 'react';
import { ThemeOverrideProvider, shopperOrangeTheme } from '../theme/theme';

export function withShopperTheme<P extends React.JSX.IntrinsicAttributes>(Component: React.ComponentType<P>): React.FC<P> {
  return function Themed(props: P) {
    return (
      <ThemeOverrideProvider theme={shopperOrangeTheme}>
        <Component {...props} />
      </ThemeOverrideProvider>
    );
  };
}


